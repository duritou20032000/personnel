import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.accountreallist}`,{
        method:'POST',
        body:{
            ...params,
        }
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
    return request(`${api.checkid}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
