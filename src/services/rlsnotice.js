import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params){
    return request(`${api.querynotice}&${stringify(params)}`)
}

export async function remove(params) {
    return request(`${api.auditnoticeremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function create(params) {
    return request(`${api.createnotice}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

