import { query, remove, createUser, updateUser, queryRole } from '../services/account';
import { message } from 'antd'

export default {
    namespace: 'account',

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
        *fetchRole({ payload }, { call, put }) {
            const response = yield call(queryRole, payload);
            yield put({
                type: 'saveRole',
                payload: response,
            });
        },
        *create({ payload }, { call, put }) {
            const data = yield call(createUser, payload);

            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'fetch' })
            } else {
                message.error(data.message);
            }
        },
        *update({ payload }, { call, put }) {
            const data = yield call(updateUser, payload);

            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'fetch' })
            } else {
                message.error(data.message);
            }
        },
        *remove({ payload, callback }, { call, put }) {
            const data = yield call(remove, payload);
            if (data.success) {
                yield put({ type: 'fetch' });
                //回调清除选中key记录
                if (callback) callback();
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
        saveRole(state, action) {
            return {
                ...state,
                role: action.payload.data,
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
