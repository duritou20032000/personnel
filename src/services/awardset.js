import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query() {
    return request(`${api.organizationtree}`);
}

export async function emplist(params) {
    return request(`${api.queryemplist}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function savelist(params) {
    return request(`${api.saveawardlist}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}



