import { query, set, add, del } from '../services/authset';
import { message } from 'antd'

export default {
    namespace: 'authset',

    state: {
        data: "",
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
        *set({ payload }, { call, put }) {
            const data = yield call(set, payload);

            if (data.success) {
                yield put({ type: 'fetch' })
                message.success(data.message);
            } else {
                // message.error(data.message);
            }
        },
        *add({ payload }, { call, put }) {
            const data = yield call(add, payload);

            if (data.success) {
                yield put({ type: 'fetch' })
            } else {
                // message.error(data.message);
            }
        },
        *del({ payload }, { call, put }) {
            const data = yield call(del, payload);

            if (data.success) {
                yield put({ type: 'fetch' })
            } else {
                // message.error(data.message);
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
