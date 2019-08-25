import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function queryCard() {
    return request(`${api.querytemplate}`);
}

export async function queryEmpTree() {
    return request(`${api.orgemptree}`);
}

export async function uploadInfo(params) {
    return request(`${api.uploadinfo}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function queryCodeConfig() {
    return request(`${api.codeconfig}`);
}

export async function queryOptionList() {
    return request(`${api.optionlist}`);
}

export async function queryEmpDetail(params) {
    return request(`${api.empdetail}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function saveEmpDetail(params) {
    return request(`${api.updateempdetail}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
