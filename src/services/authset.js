import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query() {
    return request(`${api.authlist}`);
}

export async function set(params) {
    return request(`${api.authset}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function add(params) {
    return request(`${api.authadd}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function del(params) {
    return request(`${api.authremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
