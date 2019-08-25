import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params){
    return request(`${api.queryfsign}&${stringify(params)}`)
}

export async function queryemp(){
    return request(`${api.orgemptree}`)
}

export async function remove(params) {
    return request(`${api.auditfsignremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function create(params) {
    return request(`${api.createfsign}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

