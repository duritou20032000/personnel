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


export async function queryEmpDetail(params) {
    return request(`${api.empdetail}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function removeEmp(params) {
    return request(`${api.removeemp}`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function leaveEmp(params) {
    return request(`${api.leaveemp}`, {
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


