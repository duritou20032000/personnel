import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.rolelistdetail}&${stringify(params)}`);
}

export async function queryTree() {
    return request(`${api.tree}`);
}

export async function remove(params) {
    return request(`${api.roleremove}`, {
        method: 'POST',
        body: {...params,},
    });
}

export async function setprivilege(params) {
    return request(`${api.set_privilege}`, {
        method: 'POST',
        body: {...params,},
    });
}
