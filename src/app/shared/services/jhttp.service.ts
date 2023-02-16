/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : jhttp.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-01 14:00:58
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JHttpService {

  // headers = new HttpHeaders().
  // set('Access-Control-Allow-Origin', '*').
  // set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT').
  // set('Content-Type', 'application/json; charset=utf-8').
  // set('Accept', 'application/json');

  constructor(private http: HttpClient) {
  }

  get<T>(baseUrl: string): Observable<T> {
    // return this.http.get<T>(baseUrl, {headers : this.headers});
    return this.http.get<T>(baseUrl);
  }

  // postLogin<T>(baseUrl: string, body: any): any {
  //   // return this.http.post<T>(baseUrl, body, {headers: this.headers});;
  //   return this.http.post<T>(baseUrl, body);
  //
  // }

  post<T>(baseUrl: string, body: any): Observable<T> {
    return this.http.post<T>(baseUrl, body);
  }

  put<T>(baseUrl: string, body: any): Observable<T> {
    return this.http.put<T>(baseUrl, body);
  }

  delete<T>(baseUrl: string): Observable<T> {
    return this.http.delete<T>(baseUrl);
  }
}
