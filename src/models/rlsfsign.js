import { create, query, remove, queryemp } from '../services/rlsfsign';
import { message } from 'antd'

export default {
    namespace: 'rlsfsign',

    state: {
        status:1,
        list:[],
        emptree:[],
    },

    effects: {
        *query({ payload}, { call, put }){
            const data = yield call(query, payload);

            if(data.success) {
                yield put({
                    type: 'queryStatus',
                    payload:data.data,
                })
            }
        },
        *queryemp({ payload}, { call, put }){
            const data = yield call(queryemp, payload);

            if(data.success) {
                yield put({
                    type: 'queryempStatus',
                    payload:data.data,
                })
            }
        },
        *remove({ payload, callback }, { call, put }) {
            const data = yield call(remove, payload);

            if (data.success) {
                yield put({type:'query'});
                if (callback) callback();
                message.success("删除成功");
            } else {
                message.error(data.message);
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(create, payload);

            if (data.success) {
                yield put({
                    type: 'createStatus',
                    payload:2,
                })

                yield put({type:'query'});
                //清除草稿
                window.localStorage.removeItem("aut");
                message.success("创建成功");
            } else {
                message.error(data.message);
            }
        },

    },

    reducers: {
        createStatus(state, action) {
            return {
                ...state,
                status: action.payload,
            };
        },

        queryStatus(state, action){
            return {
                ...state,
                list: action.payload,
            }
        },
        queryempStatus(state, action){
            return {
                ...state,
                emptree: action.payload,
            }
        }
    },
};
