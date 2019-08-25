import { query, approve } from '../services/auditseal';
import { message } from 'antd'

export default {
    namespace: 'auditseal',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        role: [],
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
        *approveinfo({ payload }, { call, put }) {
            const data = yield call(approve, payload);

            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'fetch' })
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
