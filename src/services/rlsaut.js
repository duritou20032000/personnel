import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params){
    return request(`${api.queryaut}&${stringify(params)}`)
}

export async function remove(params) {
    return request(`${api.auditautremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function create(params) {
    return request(`${api.createaut}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function checkcode(params) {
    return request(`${api.checkcodeaut}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}



