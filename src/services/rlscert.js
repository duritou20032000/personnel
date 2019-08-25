import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params){
    return request(`${api.querycert}&${stringify(params)}`)
}

export async function remove(params) {
    return request(`${api.auditcertremove}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function create(params) {
    return request(`${api.createcert}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryNode() {
    return request(`${api.nodetree}`);
}

export async function queryList() {
    return request(`${api.nodelist}`);
}

export async function removeNode(params) {
    return request(`${api.removenode}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function createNode(params) {
    return request(`${api.createnode}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateNode(params) {
    return request(`${api.updatenode}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function createImage(params) {
    return request(`${api.createimage}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function removeImage(params) {
    return request(`${api.removeimage}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}


