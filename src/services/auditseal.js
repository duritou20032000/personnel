import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.auditseallist}`,{
        method:'POST',
        body:{
            ...params,
        }
    });
}

export async function approve(params) {
    return request(`${api.auditsealcheck}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}