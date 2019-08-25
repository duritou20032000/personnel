import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function fakeAccountLogin(params) {

    return request(api.login, {
      method: 'POST',
      body: params,
    });
}

export async function logout() {
    return request(`${api.logout}`);
}

export async function getcode(params) {

    return request(api.getcode, {
        method: 'POST',
        body: params,
    });
}

export async function checkcode() {

    return request(api.checkcode);
}
