import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/onboard`;

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

  // async get(searchData: {}): Promise<ApiResult<any[]>> {
  //   const baseUrl = `${this.httpUrl}/findOnBoard`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<any[]>>(baseUrl, searchData).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
  //
  // async getPopupCheck(data: {}): Promise<ApiResult<CodeVO[]>> {
  //   const baseUrl = `${this.httpUrl}/findOnBoardPopupCheck`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<CodeVO[]>>(baseUrl, data).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
  //
  // async getPopup(data: {}): Promise<ApiResult<OnBoardVO[]>> {
  //   const baseUrl = `${this.httpUrl}/findOnBoardFull`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<OnBoardVO[]>>(baseUrl, data).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
  //
  // async save(data: any): Promise<ApiResult<any>> {
  //   const baseUrl = `${this.httpUrl}/saveOnBoard`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<any>>(baseUrl, data).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
  //
  // async update(data: {}): Promise<ApiResult<OnBoardVO[]>> {
  //   const baseUrl = `${this.httpUrl}/updateOnBoard`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<OnBoardVO[]>>(baseUrl, data).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
  //
  // async delete(data: {}): Promise<ApiResult<void>> {
  //   const baseUrl = `${this.httpUrl}/deleteOnBoard`;
  //
  //   try {
  //     const result = await this.http.post<ApiResult<void>>(baseUrl, data).toPromise();
  //     return result;
  //   } catch (e) {
  //     return COMMONINITDATA.DEFAULT_POST_API_ERROR;
  //   }
  // }
}

export interface OnBoardVO {
  uid: number;
  targetType: string;
  seq: number;
  filePath: string;
  logUploadFile: string;
  phyUploadFile: string;
  extUploadFile: string;
  sizeUploadFile: number;

  uploadFileCnt: number;
}
