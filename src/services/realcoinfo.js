import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.coreallist}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function remove(params) {
    return request(`${api.removeuser}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function approve(params) {
    return request(`${api.checkcoinfo}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
