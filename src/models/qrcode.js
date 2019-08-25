import { query, saveQrCode } from '../services/qrcode';
import { message } from 'antd'

export default {
    namespace: 'qrcode',

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
    },

    effects: {
        *fetch({ payload }, { call, put }) {

            const response = yield call(query, payload);

            if(response.data){
                yield put({
                    type: 'save',
                    payload: response,
                });
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
        *saveQrCode({ payload }, { call, put }) {
            const response = yield call(saveQrCode, payload);
            if(response.success){
                yield put({ type: 'fetch' ,payload:{ type : payload.type }})
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
                data: action.payload.data,
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
