import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class Astems24Service {


  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcvExpected`;

  constructor(private http: JHttpService) {
  }

  // 조회함수
  async get(searchData: {}): Promise<ApiResult<searchVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvExpected`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<searchVO[]>>(baseUrl, searchData).toPromise();
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

// tslint:disable-next-line:class-nam class-name
export interface searchVO {
  tenant: string;
  rcvKey: string;
  fromRcvSchDate: Date;
  toRcvSchDate: Date;
  fromReceiveDate: Date;
  toReceiveDate: Date;
  sts: string;
  rcvTypecd: string;
  supplierId: number;
  warehouseId: number;
  ownerId: number;


}

// tslint:disable-next-line:class-name
export interface detailVO {
  uid: number;

}
