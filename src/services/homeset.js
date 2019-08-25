import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query() {
    return request(`${api.homelist}`);
}

export async function set(params) {
    return request(`${api.homeset}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
