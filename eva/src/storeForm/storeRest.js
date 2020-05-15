    let host = '172.25.12.186:50000';
    //let host = '172.25.12.20:50000';
    //let host =  window.location.host;

export default {
    saveTemplateForm: async (template) => {

        //172.20.5.146

        let formData = new FormData();
        formData.append("json", JSON.stringify(template));

        let response = await fetch(`http://${host}/formbuilder/setFormTemplate`, {  // сперва нужно подать post запрос
        method: 'POST',
        body: formData,
       // mode: 'no-cors'
         
        })
        .catch (error => {
            console.log(error);
        })   

        

    },
    saveForm: async (form) => {

        let formData = new FormData();
        formData.append("json", JSON.stringify(form));

        let response = await fetch(`http://${host}/formbuilder/setFormData`, {  // сперва нужно подать post запрос
        method: 'POST',
        body: formData,
       // mode: 'no-cors'
         
        })
        .catch (error => {
            console.log(error);
        })   

        

    },
    getTemplateList: async () => {

        // let formData = new FormData();
        // formData.append("json", JSON.stringify(template));

        let response = await fetch(`http://${host}/formbuilder/listFormTemplates`)
        .catch (error => {
            console.log(error);
            //return {status: 300, result: 'Post не создался, возможно из-за неточностей в запросе'}
        })   
       // let result = await response.json();
         return  response.json();
    },
    getTemplate: async (id) => {


        let response = await fetch(`http://${host}/formbuilder/getFormTemplate?id=${id}`)
        .catch (error => {
            console.log(error);
        })   

        return response.json();
    //    // let result = await response.json();
    //      return  response.json();
    },
    getAllForm: async (id) => {


        let response = await fetch(`http://${host}/formbuilder/listForms?id=${id}`)
        .catch (error => {
            console.log(error);
        })   
        return response.json();
     },
     getFormContent: async (ids) => {

        let response = await fetch(`http://${host}/formbuilder/getFormData?form_id=${ids.idForm}&template_id=${ids.idTemplate}`)
        .catch (error => {
            console.log(error);
        })   
        return response.json();
     },
     deleteTemplate: async (id) => {

        let response = await fetch(`http://${host}/formbuilder/getFormData?id=${id}`)
        .catch (error => {
            console.log(error);
        })   
        return response.json();
     },


}

