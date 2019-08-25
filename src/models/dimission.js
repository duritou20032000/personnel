import { query, queryOptionList } from '../services/dimission';
import { message } from 'antd'

export default {
    namespace: 'dimission',

    state: {
        data: "",
        modalVisible: false,
        po:[],
        se:[],
        pr:[],
        de:[],
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
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },

        saveOption(state, action) {
            return {...state,
                po:action.payload.data.po,
                se:action.payload.data.se,
                pr:action.payload.data.pr,
                de:action.payload.data.de,
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
