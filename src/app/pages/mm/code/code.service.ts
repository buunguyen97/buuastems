import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/code`;

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

export interface CodeCategoryVO {
  tenant: string;

  uid: number;
  codeCategory: string;
  systemType: string;
  name: string;
  remarks: string;
  isUsingSystemFlg: string;
  isEditPossibleFlg: string;

  codeList: CodeVO[];
}

export interface CodeVO {
  tenant: string;

  uid: number;
  codeCategoryId: number;
  code: string;
  name: string;
  etcColumn1: string;
  etcColumn2: string;
  etcColumn3: string;
  etcColumn4: string;
  etcColumn5: string;
  priority: number;
}
