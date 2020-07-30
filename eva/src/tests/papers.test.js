
// test компонента papers.vue

window.Vue =  require('vue')
require("fake-indexeddb/auto")

import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

import { shallowMount} from '@vue/test-utils'
import Paper from '../components/papers.vue'  // подключаем сам компонент который будем тестировать


// подключаем нужные нам библиотеки 

import store from '../store/index.js' // хранилилище local storage
import storeAuth from '../storeAuth/index.js' // хранилище с эндпоинтами и логами
import vuetify from 'vuetify'  // библотека для красивого отображения элементов
Vue.use(vuetify)

store.auth = storeAuth;

// подключаем компоненты, которые нужны для этого компонента

describe('Компонент papers.vue', () => {  // тест самого компонента


  store.commit('createPaperSearch');  // дело в том, что чтобы работали остальные компоненты, сперва нужно добавить объект papers в store


  let wrapper = shallowMount(Paper, { 
    store,
    stubs: ['header-top','modal-report','footer-bottom']
  });

  it ('Загрузить файл на сервер', async () => {
    const mockCallback = jest.fn()
    store.auth.putLog('add some string in log', mockCallback)


    wrapper.setData({ uploadFile: 'test.xlsx' })
    wrapper.vm.setPaper()
    // fetch.mockResponseOnce(JSON.stringify({ data: '12345' }))
 
    // //assert on the response
    // APIRequest('google').then(res => {
    //   expect(res.data).toEqual('12345')
    // })
  })

  // it('При выполнении запроса и успешного получения данных должен поменяться статус второго кружочка', async () => {

  //   wrapper.setData({ search: {
  //     original_otl: "| inputlookup papersdata.csv",
  //     sid: 1967812393,
  //     parametrs: {
  //       cache_ttl: 100,
  //       field_extraction: false,
  //       preview: false,
  //       timeout: 100,
  //       twf: 0,
  //       tws: 0,
  //       username: "admin"
  //     }
  //   }});
  //   expect(wrapper.vm.search).toEqual({
  //     original_otl: "| inputlookup papersdata.csv",
  //     sid: 1967812393,
  //     parametrs: {
  //       cache_ttl: 100,
  //       field_extraction: false,
  //       preview: false,
  //       timeout: 100,
  //       twf: 0,
  //       tws: 0,
  //       username: "admin"
  //     }
  //   })
    
  //   // // const launchSearch = jest.fn(() => {

  //   // //   fetch.mockImplementation(()=> {
  //   // //     wrapper.vm.steps['2'].complete = true
  //   // //     console.log('result ->'+wrapper.vm.steps['2'].complete)
  //   // //   })
      
      
  //   // // }); // так как реальная функция тянет много разных штук вроде IndexedDb, fetch  и т.д. 
  //   // //                                                                             // то делаем имитацию функции, с нужным нам резльутатом
  //   const launchSearch = jest.fn(() => {
  //     wrapper.setData({ 
  //       steps: {
  //         '2': {
  //           complete: true
  //         }
  //       }
  //     })
  //     wrapper.vm.steps['2'].complete = true
  //   })
  //   launchSearch()
  //   expect(wrapper.vm.steps['2'].complete).toBe(true)
  // })
  
  // it('При выборе файла и подтверждения выбора должен поменяться статус третьего кружочка', () => {
  //   wrapper.setData({ selectedFile: 'test.xlsx'});
  //   expect(wrapper.vm.selectedFile).toBe('test.xlsx')
  //   wrapper.vm.choosePaper()
  //   expect(wrapper.vm.steps['3'].complete).toBe(true)
  // })

  // // it('При выборе файла и выполнении запроса должен поменяться статус четвертого кружочка', () => {
  // //   expect(wrapper.vm.steps['2'].complete).toBe(true)
  // //   expect(wrapper.vm.steps['3'].complete).toBe(true)
  // //   const response = {
  // //     status: 'success',
  // //     file: 'some link on file',
  // //     html: 'some vis block',
  // //     names: ['file1', 'file2']
  // //   }
  // //   fetch.mockImplementation(()=> response)
  // //   // const getPaper = jest.fn(() => {
  // //   //   wrapper.vm.steps['4'].complete = true
  // //   //   wrapper.vm.fileLink = 'testlink'
  // //   // }); // так как реальная функция тянет много разных штук вроде IndexedDb, fetch  и т.д. 
  // //   //     // то делаем имитацию функции, с нужным нам резльутатом
  // //   // getPaper()
  // //   // expect(wrapper.vm.steps['4'].complete).toBe(true)
  // //   // expect(wrapper.vm.fileLink).not.toEqual('')
  // // })



})