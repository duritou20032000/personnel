import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';


export async function query() {
    return request(`${api.querytemplate}`);
}

export async function save(params) {
    return request(`${api.savetemplate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function uploadInfo(params) {
    return request(`${api.upload}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
