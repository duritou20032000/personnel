import { queryOrganization, removeOrganization, createOrganization, updateOrganization,
    queryLevel, updateLevel, updateSeal ,querySeal, queryProcess, updateProcess, queryDeptEmp  } from '../services/levelset';
import { message } from 'antd'

export default {
    namespace: 'levelset',

    state: {
        modalVisible: false,
        level:[],
        initTree: [],
        seal:[
            // {id:"1",value:""}
        ],
        apv:[
            // {id:"1",value:""}
        ],
        deptEmp:[],
    },

    effects: {
        *fetchOrg({ payload }, { call, put }) {
            const response = yield call(queryOrganization, payload);

            if(response.success){
                yield put({
                    type: 'saveOrg',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *fetchLevel({ payload }, { call, put }) {
            const response = yield call(queryLevel, payload);

            if(response.success){
                yield put({
                    type: 'saveLevel',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *createTree({ payload }, { call, put }) {
            const data = yield call(createOrganization, payload);

            if (data.success) {
                yield put({ type: 'fetchOrg' })
            } else {
                message.error(data.message);
            }
        },

        *updateTree({ payload }, { call, put }) {
            const data = yield call(updateOrganization, payload);

            if (data.success) {
                yield put({ type: 'fetchOrg' })
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *removeTree({ payload, callback }, { call, put }) {
            const data = yield call(removeOrganization, payload);
            if (data.success) {
                yield put({ type: 'fetchOrg' });
                //回调清除选中key记录
                if (callback) callback();
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *updateLevel({ payload }, { call, put }) {
            const data = yield call(updateLevel, payload);

            if (data.success) {
                yield put({ type: 'fetchLevel' })
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *fetchSeal({ payload }, { call, put }) {
            const response = yield call(querySeal, payload);

            if(response.success){
                yield put({
                    type: 'saveSeal',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *updateSeal({ payload }, { call, put }) {
            const data = yield call(updateSeal, payload);

            if (data.success) {
                yield put({ type: 'fetchSeal' })
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *fetchProcess({ payload }, { call, put }) {
            const response = yield call(queryProcess, payload);

            if(response.success){
                yield put({
                    type: 'saveApv',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *updateProcess({ payload }, { call, put }) {
            const data = yield call(updateProcess, payload);

            if (data.success) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *fetchDeptEmp({ payload }, { call, put }) {
            const response = yield call(queryDeptEmp, payload);

            if(response.success){
                yield put({
                    type: 'saveDE',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

    },

    reducers: {
        saveOrg(state, action) {
            return {...state,initTree: action.payload.data,};
        },

        saveLevel(state, action) {
            return {...state,level: action.payload.data,};
        },

        saveSeal(state, action) {
            return {...state,seal: action.payload.data.seal,};
        },

        saveApv(state, action) {
            return {...state,apv: action.payload.data.apv,};
        },

        saveDE(state, action) {
            return {...state,deptEmp: action.payload.data.de,};
        },

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
