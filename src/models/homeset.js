import { query, set } from '../services/homeset';
import { message } from 'antd'

export default {
    namespace: 'homeset',

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
                message.error(data.message);
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

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
