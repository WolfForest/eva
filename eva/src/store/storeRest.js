export default {

  async rest(formData,searchFrom,restAuth,idDash) {

    
    let response = await fetch(`/api/makejob`, {  // сперва нужно подать post запрос
      method: 'POST',
      body: formData,
      // mode: 'no-cors'  
    })
      .catch (error => {
        console.log(error);
        restAuth.putLog(`Запрос выполнить не удалось.&nbsp;&nbsp;Ошибка: ${error}`);
        return []
      })  
        
    if (response.status == 200) {  // если получилось 

      return response.json().then( answer => {
        if (answer.status != 'success') {
          restAuth.putLog(`Запрос ${searchFrom.sid} запустился с ошибкой.&nbsp;&nbsp;status: ${answer.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${answer.error}`);
          return []
        } else {
          return new Promise( resolveMain => {
            restAuth.putLog(`Запрос ${searchFrom.sid} запустился успешно.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);   
             
            let responseGet = '';  // ответ от сервера после запроса в виде статуса 
            let resEvents = {}; // данные полученные от RESTа
            let status = '';  // стату операции перевода данных из json в нормальный вид
            let result = [];  // собственно сам результат всех манипуляций

            let countNoCache = 0; // УДАЛИТЬ
            

            let cycle = new Promise((resolve) => {

              let i = 0;

              let timeOut = setTimeout( async function tick() {
            
                if (status == 'failed') {
                  result.push('failed');
                  clearTimeout(timeOut);
                }
    
                // отправляем get запрос с параметрами ИС
                            
                responseGet = await fetch(`/api/checkjob?original_otl=${encodeURIComponent(searchFrom.otl)}&tws=${searchFrom.tws}&twf=${searchFrom.twf}&cache_ttl=${searchFrom.cache_ttl}`, {
                  method: 'GET',
                  //  mode: 'no-cors'  
                })  
                  .then( data => {
                    resEvents = data;
                    return data.status;
                  })  
        
                if (responseGet != 200 && responseGet != 0) {  // если запрос не прошел то вернем ответ с ошибкой
                  status = 'failed';
                  result.push('failed');
                  clearTimeout(timeOut);
                  //return resEvents;
                } else {  // если прошёл
                  let  dataEvents = await resEvents.json().then( res => {  // переводим полученные данные из json в нормальный объект
                    restAuth.putLog(`Запрос ${searchFrom.sid} в процессе выполнения.&nbsp;&nbsp;status: ${res.status}&nbsp;&nbsp;url: ${decodeURIComponent(resEvents.url)}`);
                    status = res.status;
                    return res;
                  });
                  result = dataEvents;    
                }
                if (status == 'nocache' || status == 'notfound') { // УДАЛИТЬ
                  countNoCache++;
                }
                // if (status == 'success' || i >100 || status == 'failed' || status == 'notfound' || status == 'nocache' ) {
                if (status == 'success' || i >100 || status == 'failed'  || countNoCache >10 ) {
                  clearTimeout(timeOut);
                  resolve(result);
                }  else {
                  timeOut = setTimeout(tick, 2000); 
                }
                i++;
              }, 0);
                              
            });
        
            cycle
              .then(
                async result => {
                  if(status == 'failed') {
                    restAuth.putLog(`Запрос ${searchFrom.sid} выполнился с ошибкой.&nbsp;&nbsp;status: ${status}&nbsp;&nbsp;Ошибка: ${result.error};`);
                    resolveMain([])
                  } else if(status == 'notfound') {
                    restAuth.putLog(`Запрос ${searchFrom.sid} выполнился с ошибкой.&nbsp;&nbsp;status: ${status}&nbsp;&nbsp;Ошибка: ${result.error};`);
                    resolveMain([])
                  }  else if(status == 'nocache') {
                    restAuth.putLog(`Запрос ${searchFrom.sid} выполнился с ошибкой.&nbsp;&nbsp;status: ${status}&nbsp;&nbsp;Ошибка: ${result.error};`);
                    resolveMain([])
                  } else {
                    restAuth.putLog(`Запрос ${searchFrom.sid} выполнился успешно.&nbsp;&nbsp;status: ${status}`);

                    let dataResponse =  await fetch(`/api/getresult?cid=${result.cid}`)
                      .catch (error => {
                        restAuth.putLog(`Получить данные из запроса ${searchFrom.sid} не удалось.&nbsp;&nbsp;status: ${status}&nbsp;&nbsp;Ошибка: ${error};`);
                        resolveMain([])
                      }) 
        
        
                    restAuth.putLog(`Данные из запроса ${searchFrom.sid} получены успешно.&nbsp;&nbsp;status: ${dataResponse.status}&nbsp;&nbsp;url: ${dataResponse.url}`);

                    
                    let allData = new Promise(function(resolve, reject) {

                    
                      dataResponse.json().then(async res => {
                        if(res.status == 'success') {
                            

                          restAuth.putLog(`Данные из запроса ${searchFrom.sid}:&nbsp;&nbsp;${res.data_urls.join(' ; ')}`);

                          let shema = null;

                          let promise = res.data_urls.map(  (item,i) => {
                            if (item.indexOf('SCHEMA') != -1) {
                              shema = i;
                            }
                            return  fetch(`/${item}`)
                          })

                                                            
        
                          let resultProm = await Promise.all(promise);

                        

                          let dataProm = resultProm.map((prom,i) => {
                            return new Promise(function(resolve, reject) {
                              let allData = []


                              prom.text().then(dataitself => {
                                if (shema == i) {
                                  shema = dataitself;
                                }
                                dataitself.split('\n').forEach( dataPeace => {  // все это потому что там не совсем json а строка состоящая из строка в json
                                  if (dataPeace!= '') {
                                    try {
                                      allData.push(JSON.parse(dataPeace));
                                    }
                                    catch (error) {} 
                                  }
                                })
                                resolve(allData)
                              })
                            })
                          })
                                                            
        
                          resultProm = await Promise.all(dataProm);

                    
                          let resolveData = [];

                          resultProm.forEach( item => {
                            if (item.length != 0) {
                              resolveData = [...item];
                            }
                          })
                          if(shema != null) {

                            let keys = shema.match(/\`[^\`.]+\`/g).map( item => {
                              return item.replace(/\`/g,'')
                            })
                            let values = shema.replace(/\`[^\`.]+\`/g,'').replace(/\s*/g,'').split(',');
                            // shema = shema.match(/\`[^\`.]+\`/g).map( item => {
                            //     return item.replace(/\`/g,'')
                            // })
                            shema = {};
                            keys.forEach( (item,i) => {
                              shema[item] = values[i];
                            })
                                                                
                            resolveData.forEach( (item,i) => {
                              let keys = Object.keys(item);
                              Object.keys(shema).forEach( itemSchem => {
                                if(!keys.includes(itemSchem)) {
                                  resolveData[i][itemSchem] = null;
                                }
                              })
                            })
                          }

                          restAuth.putLog(`Все данные из запроса ${searchFrom.sid} обработаны  успешно.&nbsp;&nbsp;status: ${res.status}`);
                          if (idDash == 'reports') {
                            resolve({data: resolveData, shema: shema})
                          } else {
                            resolve(resolveData)
                          }
        
                        } else {
                          restAuth.putLog(`Обработать данные из запроса ${searchFrom.sid} не удалось.&nbsp;&nbsp;status: ${res.status}&nbsp;&nbsp;Ошибка: ${res.error};`);
                          resolve([])
                        }
                      })

                    })

                    resolveMain(allData)

                  }
    
    
                },
              )
          })
        }
      })

            
                 
    } else {
      restAuth.putLog(`Запрос ${searchFrom.sid} выполнить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      return []
    }
    
  },
  async getGroups(restAuth) { 
    let data = [];
    let response = await fetch(`/api/user/groups`)
      .catch (error => {
        restAuth.putLog(`Получить группы не удалось.&nbsp;&nbsp;Ошибка: ${error}`);
        return []
      }) 
    if (response.status == 200) {  // если получилось
      await response.json().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res.data; 
        restAuth.putLog(`Группы получены.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Получить группы не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Получить группы не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      return response
    }
    return data
  },
  async getDashs(id,restAuth) { 
    let data = [];
    let response = await fetch(`/api/group/dashs?id=${id}`)
      .catch (error => {
        restAuth.putLog(`Получить дашборды не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return []
      }) 
    if (response.status == 200) {  // если получилось
      await response.json().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res.data; 
        restAuth.putLog(`Дашборды получены.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Получить дашборды не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Получить дашборды не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      return response
    }

    return data
  },
  async getState(id,restAuth) { 
    let data = [];
    let response = await fetch(`/api/dash?id=${id}`)
      .catch (error => {
        restAuth.putLog(`Состояние приложения получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return response
      }) 
    if (response.status == 200) {  // если получилось
      await response.json().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res.data; 
        restAuth.putLog(`Состояние приложения успешно получено.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Состояние приложения получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Состояние приложения получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
      return response
    }

    return data
  },
  async getSvg(svg,restAuth) { 
    let data = [];
    let response = await fetch(`/svg/${svg}`)
      .catch (error => {
        restAuth.putLog(`Изображение получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return response
      }) 
    if (response.status == 200) {  // если получилось
      await response.text().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res; 
        restAuth.putLog(`Изображение успешно получено.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Изображение получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Изображение получить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
      return response
    }

    return data
  },
  async setSvg(svg,restAuth) { 
    let data = [];
    
    let response = await fetch(`/api/load/svg`, {  // сперва нужно подать post запрос
      method: 'POST',
      body: svg,
      // mode: 'no-cors'
    })
      .catch (error => {
        restAuth.putLog(`Изображение отправить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return response
      }) 
    if (response.status == 200) {  // если получилось
      await response.text().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res; 
        restAuth.putLog(`Изображение успешно отправлено.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Изображение отправить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Изображение отправить не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
      return response
    }

    return data
  },
  async exportDash(dash,restAuth) { 
    let data = [];
    
    let response = await fetch(`/api/${dash.element}/export?ids=${dash.ids}`)
      .catch (error => {
        restAuth.putLog(`Экспортировать не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return response
      }) 
    if (response.status == 200) {  // если получилось
      await response.text().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res; 
        restAuth.putLog(`Экспорт прошел успешно успешно.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Экспортировать  не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Экспортировать  не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
      return response
    }

    return data
  },
  async importDash(dash,restAuth) { 
    let data = [];

    let response = await fetch(`/api/${dash.element}/import`, {  // сперва нужно подать post запрос
      method: 'POST',
      body: dash.formData,
      // mode: 'no-cors'
    })
      .catch (error => {
        restAuth.putLog(`Импортировать дашборд ${dash.idDash} не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
        return response
      }) 
    if (response.status == 200) {  // если получилось
      await response.text().then( res => {  // переводим полученные данные из json в нормальный объект
        data = res; 
        restAuth.putLog(`Дашборд ${dash.idDash} импортирован успешно.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}`);
      }).catch( error => {
        restAuth.putLog(`Импортировать дашборд ${dash.idDash} не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;Ошибка: ${error}`);
      }) 
    }  else {
      restAuth.putLog(`Импортировать дашборд ${dash.idDash} не удалось.&nbsp;&nbsp;status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
      return response
    }

    return data
  },
 
};