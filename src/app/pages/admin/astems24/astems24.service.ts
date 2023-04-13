import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {UserVO} from '../../common/layout8/layout8.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

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

  async sendPost(data: any, command?: string): Promise<ApiResult<saveVO>> {
    const url = `${this.httpUrl}/${command}`;
    try {
      return await this.http.post<ApiResult<saveVO>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }
}

// tslint:disable-next-line:class-name
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

// tslint:disable-next-line:class-name
export interface saveVO {
  tenant: string;
  rcvKey: string;
  acceptKey: string;
  sts: string;
  rcvTypecd: string;
  rcvSchDate: Date;
  receiveDate: Date;
  warehouseId: number;
  ownerId: number;
  remarks: string;
  supplierId: number;
  supplierCountrycd: string;
  supplierPortcd: string;
  supplierZip: string;
  supplierAddress1: string;
  supplierAddress2: string;
  refName: string;
  supplierPhone: string;
  rcvDetailList: [{
    uid: number;
    tenant: string;
    itemId: number;
    expectQty1: number;
    receivedQty1: number;
    adjustQty1: number;
    lot1: string;
    lot2: string;
    lot3: string;
    lot4: string;
    lot5: string;
    lot6: string;
    lot7: string;
    lot8: string;
    lot9: string;
    lot10: string;
    damageFlg: string;
    noShippingFlg: string;
    foreignCargoFlg: string;
    customsReleaseFlg: string;
    taxFlg: string;
    whInDate: Date;
    mngDate: Date;
    isSerial: string;
  }];
}
