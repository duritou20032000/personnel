import { routerRedux } from 'dva/router';
import { fakeAccountLogin, logout, getcode, checkcode } from '../services/login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    url:"",
    clear:false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        //获取初始化路径
        let initpath = response.initpath;
        initpath = initpath?initpath:"/";
        yield put(routerRedux.push(initpath));
      }
    },
    *logout(_, { put, select, call }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        //触发注销操作
        yield call(logout);

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/login/login'));
      }
    },
    *getcode({ payload }, { call, put }) {
        const response = yield call(getcode, payload);
        if(response.success){
            yield put({
                type: 'saveUrl',
                payload: response,
            });
        }
    },

    *checkcode({ payload }, { call, put }) {
        const response = yield call(checkcode, payload);
        // Login successfully
        if (response.status === 'ok') {
            yield put({
                type: 'changeLoginStatus',
                payload: response,
            });

            reloadAuthorized();
            //获取初始化路径
            let initpath = response.initpath;
            initpath = initpath?initpath:"/";
            yield put(routerRedux.push(initpath));

            yield put({
                type: 'user/fetchCurrent',
            });

            yield put({
                type: 'user/fetchMenu',
            });
        }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        clear:true,
      };
    },
    saveUrl(state, { payload }) {
        return {
            ...state,
            url: payload.url,
            clear:false,
        };
    },
  },
};
