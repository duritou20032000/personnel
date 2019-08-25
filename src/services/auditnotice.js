import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.auditnoticelist}`,{
        method:'POST',
        body:{
            ...params,
        }
    });
}

export async function approve(params) {
    return request(`${api.auditnoticecheck}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}