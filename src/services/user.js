import request from '../utils/request';
import { api } from '../utils/config';

export async function logout() {
    return request(api.logout);
}

export async function queryCurrent() {
  return request(api.loginstate);
}

export async function queryMenu(){
  return request(api.menu);
}
