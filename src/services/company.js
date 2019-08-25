import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.companylist}&${stringify(params)}`);
}

export async function approve(params) {
    return request(`${api.approveco}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

