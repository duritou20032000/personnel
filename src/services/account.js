import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {
    return request(`${api.userlist}&${stringify(params)}`);
}

export async function queryRole() {
    return request(`${api.rolelist}`);
}

export async function remove(params) {
    return request(`${api.removeuser}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function createUser(params) {
    return request(`${api.createuser}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateUser(params) {
    return request(`${api.updateuser}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
