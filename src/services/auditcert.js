import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.auditcertlist}`,{
        method:'POST',
        body:{
            ...params,
        }
    });
}

export async function approve(params) {
    return request(`${api.auditcertcheck}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}