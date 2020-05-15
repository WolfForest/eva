
import {  mdiGraph, mdiGestureTap, mdiBrush, mdiChartLine,   mdiPoll, mdiViewGrid, mdiCardTextOutline, mdiChartGantt, mdiChartMultiline,  mdiNumeric,  mdiTableLarge,  mdiFormatListBulleted,  mdiCalendarMonth, } from '@mdi/js'

export default {  
        tools: [
            {name:'Таблица', img: mdiTableLarge, type: 'table'},
            {name:'Линейный график', img:  mdiChartLine, type: 'lineChart'},
            {name:'Мультилинейный график', img:  mdiChartMultiline, type: 'multiLine'},
            {name:'Cтолбцовая диаграмма', img:  mdiPoll , type: 'barchart'},
            {name:'Выпадающий список', img:  mdiFormatListBulleted, type: 'select'},
            {name:'Выбор времени', img:  mdiCalendarMonth, type: 'picker'},
            {name:'Граф', img:  mdiGraph , type: 'graph'},
            {name:'Диаграмма Гантта', img:  mdiChartGantt, type: 'guntt'},
            {name:'Плитка', img:  mdiViewGrid , type: 'tile'},
            {name:'Изображение', img:  mdiBrush , type: 'csvg'},
            {name:'Число', img:  mdiNumeric, type: 'single'},
            {name:'Кнопка', img:  mdiGestureTap , type: 'button'},
            {name:'Текстовый блок', img:  mdiCardTextOutline , type: 'textarea'},
        ],
        size: {
            picker: {
                width: '19%',
                height: '18%'
            },
            select: {
                width: '25%',
                height: '19%'
            },
            lineChart: {
                width: '36%',
                height: '37%'
            },
            graph: {
                width: '52%',
                height: '55%'
            },
            table: {
                width: "26%",
                height: "44%"
            },
            single: {
                width: '18%',
                height: '18%'
            },
            guntt: {
                width: '30%',
                height: '25%'
            },
            multiLine: {
                width: '36%',
                height: '37%'
            },
            button: {
                width: '18%',
                height: '9%'
            },
            textarea: {
                width: '26%',
                height: '42%'
            },
            barchart: {
                width: '36%',
                height: '42%'
            },
            tile: {
                width: '26%',
                height: '37%'
            },  
            csvg: {
                width: '26%',
                height: '37%'
            }  
        },
        icons: {
            table: mdiTableLarge,
            lineChart: mdiChartLine,
            multiLine: mdiChartMultiline,
            graph: mdiGraph,
            guntt: mdiChartGantt,
            select: mdiFormatListBulleted,
            picker:  mdiCalendarMonth,
            single: mdiNumeric,
            button: mdiGestureTap,
            textarea: mdiCardTextOutline,
            barchart: mdiPoll,
            tile: mdiViewGrid,
            csvg: mdiBrush,
        }, 
        options: {
            lineChart: ['visible','level','boxShadow'],
            multiLine: ['visible','level','boxShadow','united'], 
            barchart: ['visible','level','boxShadow'],
            table: ['visible','level','boxShadow','rowcolor','columncolor','cellcolor'],
            select: ['visible','level','boxShadow','multiple'],
            picker: ['visible','level'],
            graph: ['visible','level','boxShadow'],
            single: ['visible','level','subnumber','color','boxShadow','fontSize'],
            button: ['visible','level','color','backgroundcolor','name'],
            textarea: ['visible','level'],
            guntt: ['visible','level','timeFormat'],
            tile: ['visible','level','size'],
            csvg: ['visible','level','tooltip']
        },
        reporstElements: ['table','lineChart','multiLine','barchart','graph','guntt','tile','csvg'],
        reports: {
            table: {
                tooltip: 'Таблица',
                icon: mdiTableLarge
            },
            lineChart: {
                tooltip: 'Линейный график',
                icon: mdiChartLine
            },
            multiLine: {
                tooltip: 'Мультилинейный график',
                icon: mdiChartMultiline
            },
            barchart: {
                tooltip: 'Столбцовая диаграмма',
                icon: mdiPoll
            },
            graph: {
                tooltip: 'Граф',
                icon: mdiGraph
            },
            guntt: {
                tooltip: 'Диаграмма Гантта',
                icon: mdiChartGantt
            },
            tile: {
                tooltip: 'Плитка',
                icon: mdiViewGrid
            },
            csvg: {
                tooltip: 'Изображение',
                icon: mdiBrush
            },

        }
}