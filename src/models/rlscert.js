import {create, query, queryNode, queryList, remove, createNode, updateNode, removeNode, createImage, removeImage } from '../services/rlscert';
import { message } from 'antd'

export default {
    namespace: 'rlscert',

    state: {
        status:1,
        list:[],
        initTree: [],
        initList: [],
        modalVisible: false,
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
                window.localStorage.removeItem("cert");
                message.success("创建成功");
            } else {
                message.error(data.message);
            }
        },

        *createImage({ payload }, { call, put }) {
            const data = yield call(createImage, payload);

            if (data.success) {
                message.success("图片信息保存成功");
                yield put({ type: 'fetchNode' })
            } else {
                message.error(data.message);
            }
        },

        *removeImage({ payload, callback }, { call, put }) {
            const data = yield call(removeImage, payload);
            if (data.success) {
                yield put({ type: 'fetchNode' });
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },


        *fetchNode({ payload }, { call, put }) {
            const response = yield call(queryNode, payload);

            if(response.success){
                yield put({
                    type: 'saveNode',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *queryList({ payload }, { call, put }) {
            const response = yield call(queryList, payload);

            if(response.success){
                yield put({
                    type: 'saveList',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *createNode({ payload }, { call, put }) {
            const data = yield call(createNode, payload);

            if (data.success) {
                yield put({ type: 'fetchNode' });
                yield put({ type: 'queryList' });
            } else {
                message.error(data.message);
            }
        },

        *updateNode({ payload }, { call, put }) {
            const data = yield call(updateNode, payload);

            if (data.success) {
                yield put({ type: 'fetchNode' });
                yield put({ type: 'queryList' });
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },

        *removeNode({ payload, callback }, { call, put }) {
            const data = yield call(removeNode, payload);
            if (data.success) {
                yield put({ type: 'fetchNode' });
                yield put({ type: 'queryList' });
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },


    },

    reducers: {
        saveNode(state, action) {
            return {...state,initTree: action.payload.data,};
        },

        saveList(state, action) {
            return {...state,initList: action.payload.data,};
        },

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

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
