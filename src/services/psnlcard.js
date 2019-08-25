import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {

    return request(`${api.querycard}&${stringify(params)}`);
}

export async function querytemp(params) {

    return request(`${api.querytemplate}&${stringify(params)}`);
}


export async function saveBatchCode(params) {

    return request(`${api.saveqrcode}&${params.batchcode}`);
}

export async function save(params) {
    return request(`${api.savetemplate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function deltemp(params) {
    return request(`${api.deltemplate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
