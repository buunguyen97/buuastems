import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class Layout2Service {

  
  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu`;
  // http 객체 Injection
  constructor(
    private http: JHttpService) {
  }
  // 조회함수
  async getL1(searchData: {}): Promise<ApiResult<MenuL1VO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findMenuL1`;
    try {
      // Post 방식으로 조회
      // Company는 Interface 형식으로 Service 하단에 구현하며, BackEnd의 VO와 형식을 맞춤.
      const result = await this.http.post<ApiResult<MenuL1VO[]>>(baseUrl, searchData).toPromise();
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
  // 조회함수
  async getL2(searchData: {}): Promise<ApiResult<MenuL2VO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findMenuL2`;
    try {
      // Post 방식으로 조회
      // Company는 Interface 형식으로 Service 하단에 구현하며, BackEnd의 VO와 형식을 맞춤.
      const result = await this.http.post<ApiResult<MenuL2VO[]>>(baseUrl, searchData).toPromise();
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

  // 조회함수
  async getApp(searchData: {}): Promise<ApiResult<AppVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findApp`;
    try {
      // Post 방식으로 조회
      // Company는 Interface 형식으로 Service 하단에 구현하며, BackEnd의 VO와 형식을 맞춤.
      const result = await this.http.post<ApiResult<AppVO[]>>(baseUrl, searchData).toPromise();
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
  async save(data: {}, userId: string): Promise<ApiResult<MenuL1VO>> {
    const baseUrl = `${this.httpUrl}/saveMenu?userId=${userId}`;
    try {
      const result = await this.http.post<ApiResult<MenuL1VO>>(baseUrl, data).toPromise();
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
  async update(data: {}): Promise<ApiResult<MenuL1VO>> {
    const baseUrl = `${this.httpUrl}/updateMenu`;
    try {
      const result = await this.http.post<ApiResult<MenuL1VO>>(baseUrl, data).toPromise();
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
    const baseUrl = `${this.httpUrl}/deleteMenu`;
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
}

export interface MenuSearchVO {
  text1: string;
  text2: string;
  title: string;
}

export interface MenuL1VO {
  tenant: string;
  uid: number;

  systemType: string;
  text: string;
  icon: string;
  path: string;
  priorities: number;
  items: MenuL2VO[];
}

export interface MenuL2VO {
  uid: number;

  menuL1Id: MenuL1VO;
  text: string;
  icon: string;
  path: string;
  priorities: number;
  items: AppVO[];
}

// BackEnd의 VO와 맞춤
export interface AppVO {
  tenant: string;
  uid: number;

  app: string;  // 어플리케이션코드
  title: string;  // 어플리케이션명
  actFlg: string;  // 사용여부
  url: string; // URL
  link: string;
  icon: string;
  priorities: number;
  menuL2Id: MenuL2VO;
}
