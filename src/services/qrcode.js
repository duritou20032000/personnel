import { stringify } from 'qs';
import request from '../utils/request';
import {api} from '../utils/config';

export async function query(params) {

    return request(`${api.queryqrcode}&${stringify(params)}`);
}

export async function saveQrCode(params) {

    return request(`${api.saveqrcode}&${params.qrcode}`);
}
