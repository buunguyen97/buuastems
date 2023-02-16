import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../shared/constants/appconstants';
import {JHttpService} from '../../shared/services/jhttp.service';
import {ApiResult} from '../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user`;

  constructor(private http: JHttpService) {
  }

  async get(searchData: {}): Promise<ApiResult<UserVO[]>> {
    const baseUrl = `${this.httpUrl}/findUserFull`;

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
