import {  queryCurrent, queryMenu } from '../services/user';
import { getPath } from "../utils/utils";
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menu:[],
  },

  effects: {

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);

      if(response.status=="ok"){
          yield put({
            type: 'saveCurrentUser',
            payload: response.user,
          });
      }else{
        //重新登录
        yield put(routerRedux.push('/user/login'));
      }
    },
    *fetchMenu(_, { call, put }) {
        const response = yield call(queryMenu);

        // let menu_path = getPath(response);
        // let hash = window.location.hash.replace("#","");
        //
        // if(menu_path.length>0){
        //     if(menu_path.filter(item => item===hash).length==0){
        //         //如果页面是未授权页面跳转到默认页面
        //         yield put(routerRedux.push("/"));
        //     }
        // }
        // yield put(routerRedux.push("/"));
        // yield put(routerRedux.push('/idcard'));

        yield put({
            type: 'saveMenu',
            payload: response,
        });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    saveMenu(state, action) {
        return {
            ...state,
            menu: action.payload,
        };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
