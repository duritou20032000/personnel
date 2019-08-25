import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';


export async function queryOrganization() {
    return request(`${api.organizationtree}`);
}

export async function removeOrganization(params) {
    return request(`${api.removetree}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function createOrganization(params) {
    return request(`${api.createtree}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateOrganization(params) {
    return request(`${api.updatetree}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryLevel() {
    return request(`${api.levellist}`);
}

export async function updateLevel(params) {

    return request(`${api.levelupdate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function querySeal() {
    return request(`${api.sealquery}`);
}

export async function updateSeal(params) {

    return request(`${api.sealupdate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryProcess(params) {

    return request(`${api.processquery}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateProcess(params) {

    return request(`${api.processupdate}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryDeptEmp() {
    return request(`${api.deptempquery}`);
}

