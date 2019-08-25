import { query, saveBatchCode,querytemp,save,deltemp } from '../services/psnlcard';
import { message } from 'antd'

export default {
    namespace: 'psnlcard',

    state: {
        empinfo:{
            id:0,
            name:"",
            portrait:"",
            phone:"",
        },
        companylist:[],
        workinfo:{
            dept:"",
            pos:"",
            co:"",
        },
        cardlist:[],
        codepsnlurl:"",
        tempdata: {},
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            const response = yield call(query, payload);

            if(response.success){
                yield put({
                    type: 'save',
                    payload: response.data,
                });
            }else{
                message.error(response.message);
            }
        },
        *queryTemp({ payload }, { call, put }) {
            //查询模板
            const response = yield call(querytemp,payload);
            if(response.success){
                yield put({
                    type: 'tempsave',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },
        *saveBatchCode({ payload }, { call, put }) {
            const response = yield call(saveBatchCode, payload);
            if(response.success){
                yield put({ type: 'fetch' ,payload:{ type : payload.type }})
                message.success(response.message);
            }else{
                message.error(response.message);
            }
        },

        *saveInfo({ payload }, { call, put }) {
            const response = yield call(save, payload);
            if (response.success) {
                yield put({ type: 'fetch' ,payload:payload})
                message.success(response.message);
            } else {
                // message.error(data.message);
                console.log(response.message);
            }
        },

        *delTemp({ payload }, { call, put }) {
            //删除模板
            const response = yield call(deltemp,payload);
            if(response.success){
                yield put({ type: 'fetch' ,payload:payload})
                message.success(response.message);
            }else{
                message.error(response.message);
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                empinfo:action.payload.empinfo,
                companylist:action.payload.companylist,
                workinfo:action.payload.workinfo,
                cardlist:action.payload.cardlist,
                codepsnlurl:action.payload.codepsnlurl,
            };
        },
        tempsave(state, action) {
            return {
                ...state,
                tempdata: action.payload.data,
            };
        },

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
