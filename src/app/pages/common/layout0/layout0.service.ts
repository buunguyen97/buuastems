import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class Layout0Service {

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user`;

  constructor(private http: JHttpService) {
  }

  dsAcceptType = [
    {code: 'ACCEPTTYPE1', name: 'ACCEPTTYPE1'},
    {code: 'ACCEPTTYPE2', name: 'ACCEPTTYPE2'},
    {code: 'ACCEPTTYPE3', name: 'ACCEPTTYPE3'},
    {code: 'ACCEPTTYPE4', name: 'ACCEPTTYPE4'},
    {code: 'ACCEPTTYPE5', name: 'ACCEPTTYPE5'},
  ];
  dsAcceptGroup = [
    {code: 'ACCEPTGROUP1', name: 'ACCEPTGROUP1'},
    {code: 'ACCEPTGROUP2', name: 'ACCEPTGROUP2'},
    {code: 'ACCEPTGROUP3', name: 'ACCEPTGROUP3'},
    {code: 'ACCEPTGROUP4', name: 'ACCEPTGROUP4'},
    {code: 'ACCEPTGROUP5', name: 'ACCEPTGROUP5'},
  ];
  dsWarehouse = [
    {code: 'WAREHOUSE1', name: 'WAREHOUSE1'},
    {code: 'WAREHOUSE2', name: 'WAREHOUSE2'},
    {code: 'WAREHOUSE3', name: 'WAREHOUSE3'},
    {code: 'WAREHOUSE4', name: 'WAREHOUSE4'},
    {code: 'WAREHOUSE5', name: 'WAREHOUSE5'},
  ];
  dsItemAdmin = [
    {code: 'ITEMADMIN1', name: 'ITEMADMIN1'},
    {code: 'ITEMADMIN2', name: 'ITEMADMIN2'},
    {code: 'ITEMADMIN3', name: 'ITEMADMIN3'},
    {code: 'ITEMADMIN4', name: 'ITEMADMIN4'},
    {code: 'ITEMADMIN5', name: 'ITEMADMIN5'},
  ];
  async get(searchData: {}): Promise<ApiResult<UserVO[]>> {
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

  async getPopup(data: {}): Promise<ApiResult<UserVO>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findUserFull`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
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

  async save(data: {}): Promise<ApiResult<UserVO>> {
    const baseUrl = `${this.httpUrl}/saveUser`;
    try {
      const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
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

  async update(data: {}): Promise<ApiResult<UserVO>> {
    const baseUrl = `${this.httpUrl}/updateUser`;
    try {
      const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
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

  async delete(data: {}): Promise<ApiResult<void>> {
    const baseUrl = `${this.httpUrl}/deleteUser`;
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

  async updatePwd(data: {}): Promise<ApiResult<UserVO>> {
    const baseUrl = `${this.httpUrl}/updatePwd`;
    try {
      const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
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

  async resetPassword(data: {}): Promise<ApiResult<UserVO>> {
    const baseUrl = `${this.httpUrl}/resetPassword`;
    try {
      const result = await this.http.post<ApiResult<UserVO>>(baseUrl, data).toPromise();
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
}

export interface UserVO {
  tenant: string;
  uid: number;
  usr: string;
  actFlg: string;
  name: string;
  shortName: string;
  userGroup: string;
  companyId: number;
  company: string;
  tel: string;
  email: string;
}
