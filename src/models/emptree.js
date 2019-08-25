import { queryEmpTree, uploadInfo, queryOptionList, queryEmpDetail, saveEmpDetail, queryCard ,queryCodeConfig } from '../services/emptree';
import { message } from 'antd'

export default {
    namespace: 'emptree',

    state: {
        modalVisible: false,
        initTree: [],
        po:[],
        se:[],
        pr:[],
        de:[],
        empdetail:{},
        frontimage:"",
        backimage:"",
        codeurl:"",
        codeparam:"",
    },

    effects: {
        *fetchOrg({ payload }, { call, put }) {
            const response = yield call(queryEmpTree, payload);

            if(response.success){
                yield put({
                    type: 'saveOrg',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *fetchOption({ payload }, { call, put }) {
            const response = yield call(queryOptionList, payload);

            if(response.success){
                yield put({
                    type: 'saveOption',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *fetchDetail({ payload }, { call, put }) {

            const response = yield call(queryEmpDetail, payload);

            if(response.success){
                yield put({
                    type: 'saveDetail',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *fetchConfig({ payload }, { call, put }) {
            const response = yield call(queryCodeConfig, payload);

            yield put({
                type: 'saveConfig',
                payload: response,
            });

        },

        *fetchCard({ payload }, { call, put }) {
            const response = yield call(queryCard, payload);

            if(response.success){
                yield put({
                    type: 'saveCard',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *uploadInfo({ payload }, { call, put }) {
            //批量上传员工信息
            const data = yield call(uploadInfo, payload);
            if (data.success) {
                yield put({ type: 'fetchOrg' });
            } else {
                message.error(data.message);
            }
        },


        *saveEmpDetail({ payload }, { call, put }) {
            const response = yield call(saveEmpDetail, payload);

            let id = window.localStorage.getItem("curr_employee");

            if(response.success){
                message.success(response.message);
                yield put({ type: 'fetchOrg' });
                yield put({ type: 'fetchDetail',payload:{id:id} });
            }else{
                message.error(response.message);
            }
        },


    },

    reducers: {
        saveOrg(state, action) {
            return {...state,initTree: action.payload.data,};
        },

        saveOption(state, action) {
            return {...state,
                po:action.payload.data.po,
                se:action.payload.data.se,
                pr:action.payload.data.pr,
                de:action.payload.data.de,
            };
        },

        saveDetail(state, action) {
            return {...state,
                empdetail:action.payload.data,
            };
        },

        saveConfig(state, action) {
            return {...state,
                codeurl:action.payload.codeurl,
                codeparam:action.payload.codeparam,
            };
        },

        saveCard(state, action) {
            return {...state,
                logo:action.payload.data.logo,
                text:action.payload.data.text,
                code:action.payload.data.code,
                frontimage:action.payload.data.frontimage,
                backimage:action.payload.data.backimage,
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
