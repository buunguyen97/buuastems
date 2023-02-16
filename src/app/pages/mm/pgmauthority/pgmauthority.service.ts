import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class PgmauthorityService {

  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/pgmxauthority`;

  // http 객체 Injection
  constructor(
    private http: JHttpService) {
  }

  // 조회함수
  async get(searchData: {}): Promise<ApiResult<PgmXAuthorityVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findPgmXAuthority`;
    // return this.http.get<ApiResult<AppVO[]>>(baseUrl);
    try {
      // Post 방식으로 조회
      // Company는 Interface 형식으로 Service 하단에 구현하며, BackEnd의 VO와 형식을 맞춤.
      const result = await this.http.post<ApiResult<PgmXAuthorityVO[]>>(baseUrl, searchData).toPromise();
      return result;
    } catch {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

  // 저장함수
  async save(data: {}): Promise<ApiResult<PgmXAuthorityVO>> {
    const baseUrl = `${this.httpUrl}/savePgmXAuthority`;
    try {
      const result = await this.http.post<ApiResult<PgmXAuthorityVO>>(baseUrl, data).toPromise();
      return result;
    } catch (e) {
      return {
        success: false,
        data: null,
        code: e.code,
        msg: e.msg
      };
    }
  }

  // 변경함수
  async update(data: {}): Promise<ApiResult<AppVO>> {
    const baseUrl = `${this.httpUrl}/updateApp`;
    try {
      const result = await this.http.post<ApiResult<AppVO>>(baseUrl, data).toPromise();
      return result;
    } catch (e) {
      return {
        success: false,
        data: null,
        code: e.code,
        msg: e.msg
      };
    }
  }

  // 삭제함수
  async delete(data: {}): Promise<ApiResult<void>> {
    const baseUrl = `${this.httpUrl}/deleteApp`;
    try {
      const result = await this.http.post<ApiResult<void>>(baseUrl, data).toPromise();
      return result;
    } catch (e) {
      return {
        success: false,
        data: null,
        code: e.code,
        msg: e.msg
      };
    }
  }

  async getUsers(searchData: {}): Promise<ApiResult<UserVO[]>> {
    const baseUrl = `${this.httpUrl}/findUser`;

    try {
      const result = await this.http.post<ApiResult<UserVO[]>>(baseUrl, searchData).toPromise();
      return result;
    } catch {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

  async copyAuth(searchData: any): Promise<ApiResult<PgmXAuthorityVO[]>> {
    const baseUrl = `${this.httpUrl}/copyPgmXAuthority?tenant=${searchData.tenant}&targetId=${searchData.popupUserId}&sourceId=${searchData.userId}`;

    try {
      const result = await this.http.get<ApiResult<PgmXAuthorityVO[]>>(baseUrl).toPromise();
      return result;
    } catch {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

  async saveAdmin(saveData: any): Promise<ApiResult<UserVO[]>> {
    const baseUrl = `${this.httpUrl}/saveAdmin`;

    try {
      const result = await this.http.post<ApiResult<UserVO[]>>(baseUrl, saveData).toPromise();
      return result;
    } catch {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

}

export interface UserVO {
  tenant: string;
  uid: number;

  actFlg: string;
  name: string;
  shortName: string;
  userGroup: string;
  companyId: number;
  isAdmin: string;

  userType: string;
}

// BackEnd의 VO와 맞춤
export interface PgmXAuthorityVO {
  tenant: string;
  uid: number;

  userId: number;
  appId: number;

  menuL1Text: string;
  menuL2Text: string;
  app: string;
  authSearch: string;
  authUpd: string;
  authDel: string;
  authExec: string;
  authPrint: string;

  keyExpr: string;
  parentIdExpr: string;
}


// BackEnd의 VO와 맞춤
export interface AppVO {
  tenant: string;
  uid: number;

  app: string; // 어플리케이션코드
  title: string;   // 어플리케이션명
  actFlg: string;  // 사용여부
  url: string; // URL
  link: string;
  icon: string;

  modifiedBy: string;
  modifiedDatetime: string;
}
