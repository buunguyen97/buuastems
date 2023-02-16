import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/grade`;

  // http 객체 Injection
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

  async get(searchData: {}): Promise<ApiResult<GradeVO[]>>{

    const baseUrl = `${this.httpUrl}/findGrade`;
    try {
      const result = await this.http.post<ApiResult<GradeVO[]>>(baseUrl, searchData).toPromise();
      // console.log(result);
      return result;
    } catch (e) {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: `Post service api error!`
      };
    }
  }
  async getPopup(data: {}): Promise<ApiResult<GradeVO>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findGrade`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<GradeVO>>(baseUrl, data).toPromise();
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
  async save(data: {}): Promise<ApiResult<GradeVO[]>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/saveGrade`;

    try {
      // Post 방식으로 조회

      const result = await this.http.post<ApiResult<GradeVO[]>>(baseUrl, data).toPromise();

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

  async update(data: {}): Promise<ApiResult<GradeVO[]>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/updateGrade`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<GradeVO[]>>(baseUrl, data).toPromise();
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

  async delete(data: {}): Promise<ApiResult<void>> {
    const baseUrl = `${this.httpUrl}/deleteGrade`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<void>>(baseUrl, data).toPromise();
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

export interface GradeVO {
  uid: number;
  gradeCd: string;
  gradeNm: string;
  gradeUser: string;
  gradeContent: string;
  actFlg: string;
  score: number;
}
