import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {

    return request(`${api.queryqrcode}&${stringify(params)}`);
}

export async function saveBatchCode(params) {

    return request(`${api.saveqrcode}&${params.batchcode}`);
}

export async function readQrExcel(params){

    return request(`${api.readqrexcel}`,{
        method:'POST',
        body:{
            ...params
        }
    });
}

export async function exportQrExcel(params){

    return request(`${api.exportqrexcel}`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body:{
            ...params
        }
    });
}