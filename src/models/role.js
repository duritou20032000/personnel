import { query, remove, setprivilege, queryTree } from '../services/role';
import { message } from 'antd'

export default {
    namespace: 'role',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        tree: [],
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
        *fetchTree({ payload }, { call, put }) {
            const response = yield call(queryTree, payload);
            yield put({
                type: 'saveTree',
                payload: response,
            });
        },
        *setprivilege({ payload }, { call, put }) {
            const data = yield call(setprivilege, payload);

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
            return {...state,data: action.payload };
        },

        saveTree(state, action) {
            return {...state,tree: action.payload.data };
        },

        showModal (state) {
            return { ...state, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },
    },
};
