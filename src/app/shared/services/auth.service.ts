/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : auth.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 16:08:12
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {JHttpService} from './jhttp.service';
import {APPCONSTANTS} from '../constants/appconstants';
import {ApiResult} from '../vo/api-result';
import {SessionStorageService} from './session-storage.service';
import {CommonUtilService} from './common-util.service';
import {COMMONINITDATA} from '../constants/commoninitdata';

const defaultPath = '/';

@Injectable()
export class AuthService {
  private _user: SignIn;

  // defaultUser = {
  //   uid: 1000,
  //   tenant: '1000',
  //   user: 'admin',
  //   avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png',
  //   email: 'test@test.co.kr'
  // };

  get loggedIn(): boolean {

    if (this.sessionStorageService.getItem(APPCONSTANTS.ISLOGIN) === null) {
      return false;
    }

    if (this.sessionStorageService.getItem(APPCONSTANTS.ISLOGIN).length) {
      this._user = JSON.parse(this.sessionStorageService.getItem(APPCONSTANTS.ISLOGIN));
      return true;
    }
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  get lastAuthenticatedPath(): string {
    return this._lastAuthenticatedPath;
  }

  constructor(private router: Router,
              private http: JHttpService,
              private sessionStorageService: SessionStorageService,
              private utilService: CommonUtilService) {
  }

  async logInPost(data: {}): Promise<ApiResult<SignIn>> {
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/sign-service/signin`;

    try {
      const result = await this.http.post<ApiResult<SignIn>>(baseUrl, data).toPromise();

      if (result.success) {
        this._user = result.data;

        // // 최초 로그인 비밀번호 변경 처리 주석 2022-11-14
        // if (this._user.loginCnt === 0) {
        //   return {
        //     success: true,
        //     code: APPCONSTANTS.CHANGE_PASSWORD_REQUIRED,
        //     msg: APPCONSTANTS.CHANGE_PASSWORD_REQUIRED,
        //     data: this._user
        //   };
        // }

        this.sessionStorageService.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(this._user));
        try {
          // 화면 경로
          const dict = this.utilService.dictionary();
          const message = dict[this.utilService.getLanguage()];
          const path = message[Object.keys(message).filter(el => {
            return el === '/' + this._lastAuthenticatedPath;
          })[0]];

          const parentPath = message[Object.keys(message).filter(el => {
            return el === '/' + this._lastAuthenticatedPath.substring(0, this._lastAuthenticatedPath.lastIndexOf('/'));
          })[0]];

          this.utilService.setPagePath(path, parentPath);
        } catch {
        }

        // 로그인시 화면 경로 home
        this.router.navigate(['/home'], {skipLocationChange: true});
      }
      return result;
    } catch {
      return {
        success: false,
        code: '-999',
        msg: '로그인 중 오류가 발생했습니다.',
        data: null
      };
    }
  }

  async sendPost(data: any, command?: string): Promise<ApiResult<any>> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/sign-service/${command}`;

    try {
      return await this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }

  async getUser(): Promise<any> {
    try {
      // Send request
      return {
        isOk: true,
        data: this._user
      };
    } catch {
      return {
        isOk: false
      };
    }
  }

  async createAccount(tenant, id, password): Promise<any> {
    try {
      // Send request
      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account'
      };
    }
  }

  async changePassword(password: string, recoveryCode: string): Promise<any> {
    try {
      // Send request
      return {
        isOk: true
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password'
      };
    }
  }

  async resetPassword(tenant: string, id: string, password: string): Promise<any> {
    try {
      // Send request
      console.log(tenant, id);

      return {
        isOk: true
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password'
      };
    }
  }

  async logOut(): Promise<any> {
    this.sessionStorageService.removeItem(APPCONSTANTS.ISLOGIN);
    this._user = null;
    this.router.navigate(['/login-form'], {skipLocationChange: true});
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;

    const loginForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ];
    const isAuthForm = loginForm.includes(route.routeConfig.path);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath], {skipLocationChange: true});
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form'], {skipLocationChange: true});
    }

    if (isLoggedIn) {
      console.log(route.routeConfig.path);
      this.authService.lastAuthenticatedPath = route.routeConfig.path;
    }

    return isLoggedIn || isAuthForm;
  }
}

export interface SignIn {
  uid: number;
  tenant: string;
  usr: string;
  userNm: string;
  password: string;
  avatarUrl: string;
  email: string;
  companyId: number;
  loginCnt: number;
}
