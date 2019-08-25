import {  query, save } from '../services/idcard';
import { message } from 'antd';

export default {
  namespace: 'idcard',

  state: {
    data: {},
  },

  effects: {
      *fetch(_, { call, put }) {
        const response = yield call(query);
          if(response.success){
            yield put({
                type: 'save',
                payload: response,
            });
          }else{
              message.error(response.message);
          }
      },

      *saveinfo({ payload }, { call, put }) {
          const data = yield call(save, payload);
          if (data.success) {
              message.success(data.message);
          } else {
              message.error(data.message);
              console.log(data.message);
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
  },
};
