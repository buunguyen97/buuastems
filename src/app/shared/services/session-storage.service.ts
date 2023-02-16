/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : session-storage.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-06-17 17:49:51
 */

import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../constants/appconstants';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {
  }

  public setItem(tokenKey: string, token: string): void {
    window.sessionStorage.removeItem(tokenKey);
    window.sessionStorage.setItem(tokenKey, token);
  }

  public getItem(tokenKey: string): string | null {
    return window.sessionStorage.getItem(tokenKey);
  }

  public removeItem(tokenKey: string): void {
    window.sessionStorage.removeItem(tokenKey);
  }

  public getItemValue(itemKey: string): string {
    return JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN))[itemKey];
  }
}
