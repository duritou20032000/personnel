import { indvreg, coreg, sendsms } from '../services/register';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *indvsubmit({ payload }, { call, put }) {
        const data = yield call(indvreg, payload);
        const username = payload.name;

        if (data.success) {

            yield put(routerRedux.push({
                pathname: '/user/register-result',
                state: {
                    account:username,
                },
            }))
        } else {
            message.error(data.message);
        }
    },

      *cosubmit({ payload }, { call, put }) {
          const data = yield call(coreg, payload);
          const username = payload.coname;

          if (data.success) {

              yield put(routerRedux.push({
                  pathname: '/user/register-result',
                  state: {
                      account:username,
                  },
              }))
          } else {
              message.error(data.message);
          }
      },

    *sendsmscode({ payload }, { call, put }) {
        const data = yield call(sendsms, payload);

        if (data.success) {
            message.success(data.message);
        } else {
            message.error(data.message);
        }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
