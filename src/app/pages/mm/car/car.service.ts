import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/car`;

  constructor(private http: JHttpService) {
  }

  async sendPost(data: any, command?: string): Promise<ApiResult<any>> {
    const url = `${this.httpUrl}/${command}`;

    try {
      return await this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }

  async uploadFiles(formData): Promise<any> {
    // "multipart/form-data"
    // {headers: {'Content-Type': 'undefined' }
    const baseUrl = `${this.httpUrl}/saveCar`;

    try {
      const request = new XMLHttpRequest();
      request.open('POST', baseUrl);
      const result = await request.send(formData);
      // const result = await this.$http.post(baseUrl, data, {params: {files}} ).toPromise();
      return result;
    } catch {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }

    //
    // try {
    //   this.http.post(baseUrl, formData, {headers: {'Content-Type': undefined }, transformRequest: angular.identity})
    //            .success( ...all right!... ).error( ..damn!... );
  }
}

export interface CarVO {
  uid: number;
  carRegiNo: string;
  userId: number;
  carNo: string;
  carType: string;
  carKind: string;
  isOption1: string;
  isOption2: string;
  isOption3: string;
  isOption4: string;
  isOption5: string;
  isOption6: string;
  carRegiYn: string;
  actFlg: string;
  brand: string;
  createYm: string;
  oilType: string;
  carUserAuthVOList: CarUserAuthVO[];
}

export interface CarUserAuthVO {
  uid: number;
  userUploadType: string;
  userUploadSeq: number;
  userId: number;
  logUploadFile: string;
  phyUploadFile: string;
  extUploadFile: string;
  sizeUploadFile: number;
  carId: number;
}
