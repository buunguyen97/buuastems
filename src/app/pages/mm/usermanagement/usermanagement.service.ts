import { Injectable } from '@angular/core';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user`;

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
}
