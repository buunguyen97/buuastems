/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : common-code.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-03-17 11:03:04
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {JHttpService} from './jhttp.service';
import {APPCONSTANTS} from '../constants/appconstants';
import {ApiResult} from '../vo/api-result';
import {COMMONINITDATA} from '../constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class CommonCodeService {

  constructor(private http: JHttpService) {
  }

  getCode(tenant: string, codeCategory: string): Observable<ApiResult<CodeProjection[]>> {
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/code/findCode?tenant=${tenant}&codeCategory=${codeCategory}`;
    return this.http.get<ApiResult<CodeProjection[]>>(baseUrl);
  }

  getItems(data: any, name?: string): Observable<ApiResult<any>> {
    const serviceName = data.serviceName || COMMONINITDATA.MASTERSERVICE;
    const subName = data.subName || 'lookup';

    if (!name) { name = 'code'; }
    const url = `${APPCONSTANTS.BASE_URL_WM}/${serviceName}/${name}/${subName}`;

    return this.http.post<ApiResult<any>>(url, data);
  }

  async getLookUp(data: any, name: string): Promise<ApiResult<any>> {
    const serviceName = data.serviceName || COMMONINITDATA.MASTERSERVICE;
    const subName = data.subName || 'lookup';
    const url = `${APPCONSTANTS.BASE_URL_WM}/${serviceName}/${name}/${subName}`;

    try {
      return this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }

  async commonPostLookup(data: any, name: string): Promise<ApiResult<any>> {
    const serviceName = data.serviceName || COMMONINITDATA.MASTERSERVICE;
    const subName = data.subName || 'lookup';
    const url = `${APPCONSTANTS.BASE_URL_WM}/${serviceName}/${name}/${subName}`;

    try {
      return this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }

  // 사용자
  getUser(vTenant: string): Observable<ApiResult<LookupUserVO[]>> {
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user/lookup`;

    const data = Object.assign(
      {tenant: vTenant}
    );

    return this.http.post<ApiResult<LookupUserVO[]>>(baseUrl, data);
  }

  getNotification(data: {}): Observable<ApiResult<NotificationVO[]>> {
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/notification/findNotification`;
    return this.http.post<ApiResult<NotificationVO[]>>(baseUrl, data);
  }

  // getCodeOrderByCode(tenant: string, codeCategory: string): Observable<ApiResult<CodeProjection[]>> {
  //   const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/code/findCodeOrderByCode?tenant=${tenant}&codeCategory=${codeCategory}`;
  //   return this.http.get<ApiResult<CodeProjection[]>>(baseUrl);
  // }
}

export interface CodeProjection {
  codeCategoryId: number;
  codeCategory: string;
  name: string;

  codeId: number;
  code: string;
  codeName: string;

  etcColumn1: string;
  etcColumn2: string;
  etcColumn3: string;
  etcColumn4: string;
  etcColumn5: string;
}

export interface LookupUserVO {
  tenant: string;
  uid: number;
  usr: string;
  name: string;
  shortName: string;
  companyId: number;
}

export interface NotificationVO {
  tenant: string;
  uid: number;
  userId: number;
  title: string;
  body: string;
}
