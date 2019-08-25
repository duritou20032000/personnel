import { query, emplist, savelist } from '../services/awardset';
import { message } from 'antd'

export default {
    namespace: 'awardset',

    state: {
        data: [],
        list: [],
        modalVisible: false,
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(query, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *fetchList({ payload }, { call, put }) {
            const response = yield call(emplist, payload);
            yield put({
                type: 'saveList',
                payload: response,
            });
        },
        *savelist({ payload }, { call, put }) {
            const data = yield call(savelist, payload);

            if (data.success) {
                message.success(data.message);
            } else {
                message.error(data.message);
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
        saveList(state, action) {
            return {
                ...state,
                list: action.payload.data,
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
