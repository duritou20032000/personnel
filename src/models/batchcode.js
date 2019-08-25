import { query, saveBatchCode, readQrExcel, exportQrExcel } from '../services/batchcode';
import { message } from 'antd'

export default {
    namespace: 'batchcode',

    state: {
        data:{
            bg:"ffffff",
            fg:"000000",
            wk:"000000",
            nk:"000000",
            size:250,
            radio:1,
            level:"L",
            logo:"",
        },
        data2:{
            bg:"ffffff",
            fg:"000000",
            wk:"000000",
            nk:"000000",
            size:250,
            radio:1,
            level:"L",
            logo:"",
        },
        // pagination:{},
        list:[],
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            const response = yield call(query, payload);

            if(response.data){

                if(payload.type == 3){
                    yield put({
                        type: 'save',
                        payload: response,
                    });
                }else{
                    yield put({
                        type: 'save2',
                        payload: response,
                    });
                }
            }else{
                //给默认值
                yield  put({
                    type:'save',
                    payload:{
                        data:{
                            bg:"ffffff",
                            fg:"000000",
                            wk:"000000",
                            nk:"000000",
                            size:250,
                            radio:1,
                            level:"L",
                            logo:"",
                        }
                    }
                })
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
        *readQrExcel({ payload }, { call, put }) {
            const response = yield call(readQrExcel, payload);

            if(response.success){
                yield put({
                    type: 'saveQr',
                    payload: response,
                });
            }else{
                message.error(response.message);
            }
        },

        *exportQrExcel({ payload }, { call, put }) {
            const response = yield call(exportQrExcel, payload);


            console.log(response);
            // if(response.success){
            //
            // }else{
            //     message.error(response.message);
            // }
        },

    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload.data,
            };
        },

        save2(state, action) {
            return {
                ...state,
                data2: action.payload.data,
            };
        },

        saveQr(state, action) {
            return {
                ...state,
                list: action.payload.data,
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
