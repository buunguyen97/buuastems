/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : jhttp.interceptor.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 16:08:12
 */

import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APPCONSTANTS} from '../constants/appconstants';
import {CookieService} from 'ngx-cookie-service';
import {CommonUtilService} from '../services/common-util.service';
import * as uuid from 'uuid';

@Injectable()
export class JHttpInterceptor implements HttpInterceptor {

  TOKEN_HEADER_KEY = APPCONSTANTS.HEADER_TOKEN;

  timeZone: string;
  tenant: string;
  language: string;

  constructor(private cookieService: CookieService,
              private commonSerivce: CommonUtilService) {
    this.timeZone = commonSerivce.getCurrLocale();
    this.tenant = commonSerivce.getTenant();
    this.language = commonSerivce.getLanguage();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 추후 그리드내용을 서버에 저장을 위해 놔둠.
    ///////////////////////////////////////////////////////////////////////////////////
    // const searchText = '/api/v1/mm/storage';
    // const searchIndex = request.url.indexOf(searchText);
    // if (searchIndex === -1) {
    //   request = request.clone({
    //     headers: request.headers
    //       .append('Access-Control-Allow-Origin', '*')
    //       .append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
    //       .append('Content-Type', 'application/json; charset=utf-8')
    //       .append('Accept', 'application/json')
    //     , withCredentials: true
    //    });
    // } else {
    //   request = request.clone({
    //     headers: request.headers
    //       .append('Access-Control-Allow-Origin', '*')
    //       .append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
    //       .append('Content-Type', 'text/html; charset=utf-8')
    //       .append('Accept', 'text/html')
    //     , withCredentials: true
    //   });
    // }
    //////////////////////////////////////////////////////////////////////////////////

    request = request.clone({
      headers: request.headers
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
        .append('Content-Type', 'application/json; charset=utf-8')
        .append('Accept', 'application/json')
        .append('The-Timezone-IANA', this.timeZone)
        .append('X-TENANT-ID', this.tenant)
        .append('UUID', uuid.v4())
        .set('Accept-Language', this.language)
      , withCredentials: true
    });
    return next.handle(request);
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: JHttpInterceptor, multi: true}
];
