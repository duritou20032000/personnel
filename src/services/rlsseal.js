import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params){
    return request(`${api.queryseal}&${stringify(params)}`)
}

export async function queryseal(){
    return request(`${api.sealquery}`)
}

export async function remove(params) {
    return request(`${api.auditsealremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function create(params) {
    return request(`${api.createseal}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

