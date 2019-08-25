import { query, queryOptionList, queryEmpDetail, removeEmp, leaveEmp, saveEmpDetail } from '../services/entry';
import { message } from 'antd'

export default {
    namespace: 'entry',

    state: {
        data: "",
        modalVisible: false,
        po:[],
        se:[],
        pr:[],
        de:[],
        empdetail:{},
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            const response = yield call(query, payload);
            yield put({
                type: 'save',
                payload: response,
            });
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

            if(payload.flag=="create"){
                //创建一个空的json
                yield put({
                    type: 'saveDetail',
                    payload: {
                        data: {
                            awardinfo: [],
                            baseinfo: [],
                            workinfo: [],
                        }
                    },
                });

                yield put({
                    type:'showModal',
                })
            }else{
                const response = yield call(queryEmpDetail, payload);

                if(response.success){
                    yield put({
                        type: 'saveDetail',
                        payload: response,
                    });

                    yield put({
                        type:'showModal',
                    })
                }else{
                    message.error(response.message);
                }
            }
        },

        *remove({ payload, callback }, { call, put }) {
            const data = yield call(removeEmp, payload);
            if (data.success) {
                yield put({ type: 'fetch' });
                //回调清除选中key记录
                if (callback) callback();
            } else {
                message.error(data.message);
            }
        },

        *leave({ payload, callback }, { call, put }) {
            const data = yield call(leaveEmp, payload);
            if (data.success) {
                yield put({ type: 'fetch' });
                //回调清除选中key记录
                if (callback) callback();
            } else {
                message.error(data.message);
            }
        },

        *saveEmpDetail({ payload }, { call, put }) {
            const response = yield call(saveEmpDetail, payload);

            if(response.success){
                message.success(response.message);
                yield put({ type: 'fetch' });
                yield put({ type: 'hideModal' });
            }else{
                message.error(response.message);
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },

        saveOption(state, action) {
            return { ...state,
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

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
