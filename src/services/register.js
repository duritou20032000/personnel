import request from '../utils/request';
import { api } from '../utils/config';
import { stringify } from 'qs';

export async function query(params) {
    return request(`${api.verify}&${stringify(params)}`);
}

export async function indvreg(params) {
    return request(`${api.indvregister}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function coreg(params) {
    return request(`${api.coregister}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function sendsms(params) {
    return request(`${api.sendsms}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}