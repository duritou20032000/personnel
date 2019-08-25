import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {

    return request(`${api.emplist}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryOptionList() {
    return request(`${api.filterlist}`);
}
