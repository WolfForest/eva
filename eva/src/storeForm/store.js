import  rest from './storeRest.js';

export default  {
    state: {

    },
    mutations: {
        setCreateForm: (state,options) => {
            Vue.set(state, 'createForm',   options);
        },
        // saveForm: (state,form) => {
        //      //delete state.forms;
        //     if (!state.forms) {
        //         state.forms = {};
        //     }
        //     if (!state.forms[form.name.toLowerCase()]) {
        //         state.forms[form.name.toLowerCase()] = {};
        //     }
        //         form.cells.forEach( (item,i) => {
        //             Object.keys(item).forEach( itemObj => {
        //                 if (!state.forms[form.name.toLowerCase()][i]) {
        //                     state.forms[form.name.toLowerCase()][i] = [];
        //                 }
        //                 Vue.set(state.forms[form.name.toLowerCase()][i], itemObj , form.cells[i][itemObj]);
        //             })
        //         })
                
        // },
        saveForm: (state,form) => {
            rest.saveForm(form);
         },
        saveTemplateForm: (state) => {
            let template = {name: state.createForm.name, cells: state.createForm.cells};
            rest.saveTemplateForm(template);
        },
        setTemplate:  (state,cells) => {
            if (!state.createForm) {
                Vue.set(state, 'createForm', {name: '', rows: '', columns: '', disabled: false});
            }
            state.createForm.cells = cells;
        },
        setOptionsForm:  (state,options) => {
            if (!state.createForm.cells[options.element].options) {
                state.createForm.cells[options.element].options = {};
            }
            state.createForm.cells[options.element].options = {};
            Object.keys(options.options).forEach( item => {
                Vue.set(state.createForm.cells[options.element].options,  item, options.options[item]);
            })
        },
        setContent:  (state,content) => {
            if (!state.createForm.content) {
                state.createForm.content = {}
            }
            state.createForm.content[content.id] = content.value;
        },
        setAllContent: (state,content) => {
            if (!state.createForm.content) {
                state.createForm.content = {};
            }
            if (content != 'empty') {
                state.createForm.content = content;
            } else {
                state.createForm.content = {};
            }
            
        },
        setDisabled: (state,disabled) => {
            state.createForm.disabled = disabled;
        },
        deleteTemplate: (state,id) => {
            rest.deleteTemplate(id);
        }
        // setJson: (state) => {
        //     let content = state.createForm.content;
        //     content['6'] = "true";
        //     content['7'] = "false";
        //     let template = {name: 'origin', content: content};

        //     let json = JSON.stringify(template);
        //     console.log(json);
        // }
    },
    actions: {
        
    },
    getters: {
        getCreateForm: (state) => {
            return state.createForm
        },
        // getAllForm: (state) => {
        //     return state.forms
        // },
        getAllForm: (state) => {
            return (id) => {
                return  rest.getAllForm(id); 
            }
        },
        getOption: (state) => { 
            return (options) => {
                
                if (state.createForm.cells[options.key].options) {
                    return state.createForm.cells[options.key].options
                } else {
                    return 'empty'
                }
            }
        },
        getFormLocal: (state) => {
                return state.createForm.cells
        },
        getFormContent: (state) => {
            return (ids) => {
                return  rest.getFormContent(ids); 
            }

        },
        getContent: (state) => {
            return (id) => {
                if (state.createForm.content) {
                    return state.createForm.content[id]
                } else {
                    return 'empty'
                }
                     
            }
        },
        getAllContent: (state) => {
                if (state.createForm.content) {
                    return state.createForm.content
                } else {
                    return 'empty'
                }
                     
            
        },
        getAllTemplates:  (state) => {
            return  rest.getTemplateList();
        },
        getTemplate: (state) => {
            return (id) => {
                return  rest.getTemplate(id);      
            }
        },
        getDisabled: (state) => {
            if (!state.createForm.disabled) {
                state.createForm.disabled = false;
            }
           return state.createForm.disabled 
        }
    }
};




