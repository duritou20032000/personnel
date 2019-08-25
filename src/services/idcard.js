import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';


export async function query() {
    return request(`${api.getrealname}`);
}

export async function save(params) {
    return request(`${api.realname}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
