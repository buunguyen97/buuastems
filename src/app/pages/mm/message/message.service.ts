import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/mfmessage`;

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


  // 저장함수
  async save(data: {}): Promise<ApiResult<MessageVO>> {
    const baseUrl = `${this.httpUrl}/saveMessage`;
    try {
      const result = await this.http.post<ApiResult<MessageVO>>(baseUrl, data).toPromise();
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
  async update(data: {}): Promise<ApiResult<MessageVO>> {
    const baseUrl = `${this.httpUrl}/updateMessage`;
    try {
      const result = await this.http.post<ApiResult<MessageVO>>(baseUrl, data).toPromise();
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
    const baseUrl = `${this.httpUrl}/deleteMessage`;
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

export interface MessageVO {
  tenant: string;
  uid: number;

  messageKey: string;           // 메세지코드
  ko: string;      // 한국어
  en: string;      // 영어
  cn: string;      // 중국어
  jp: string;      // 일본어
  etc1: string;
  etc2: string;
  remarks: string; // 비고
}
