import {Injectable} from '@angular/core';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';


@Injectable({
  providedIn: 'root'
})
export class AstemsService {

  

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcvInstruct`;

  constructor(private http: JHttpService) {
  }

  // 조회함수
  async get(searchData: {}): Promise<ApiResult<RcvAcceptVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvInstruct`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvAcceptVO[]>>(baseUrl, searchData).toPromise();
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
  async getInstructed(searchData: {}): Promise<ApiResult<RcvAcceptVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvInstructed`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvAcceptVO[]>>(baseUrl, searchData).toPromise();
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

  // 지시결과 조회
  async findRcvTagDetail(searchData: {}): Promise<ApiResult<RcvTagDetailVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvTagDetail`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvTagDetailVO[]>>(baseUrl, searchData).toPromise();
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

  // 적치지시
  async executeInstruct(searchData: {}): Promise<ApiResult<RcvAcceptVO>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/executeInstruct`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvAcceptVO>>(baseUrl, searchData).toPromise();
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

export interface RcvAcceptVO {
  uid: number;
  tenant: string;
  acceptKey: string;
  acceptTypecd: string;
  acceptGroupcd: string;
  actFlg: string;
  warehouseId: number;
  logisticsId: number;
  locId: number;
  inspectedUserId: number;
  carrierId: number;
  carrier: string;
  carrierName: string;
  carrierNo: string;
  carrierWbNo: string;
  carrierRefName: string;
  actualTime: Date;
  completeTime: Date;
  acceptlinetotal: number;
  tagLabelPrintFlg: string;
  rcvId: number;
  acceptUserId: number;
  belongingCompany: number; // TODO 알포터용 (화주 대체용 소속회사)

  createdDatetime: Date;
  createdBy: string;
  modifiedDatetime: Date;
  modifiedBy: string;
}

export interface RcvTagDetailVO {
  tenant: string;
  uid: number;

  rcvAcceptId: number;
  rcvAcceptLineNo: number;
  rcvId: number;
  rcvDetailId: number;
  actFlg: string;
  sts: string;
  ownerId: number;
  itemAdminId: number;
  itemId: number;
  ifItem: string;
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
  logisticsId: number;
  warehouseId: number;
  slotFlg: string;
  toLocId: number;
  locId: number;
  lotId: number;
  tagId: number;
  oddsFlg: string;
  instructQty1: number;
  instructQty2: number;
  instructQty3: number;
  loadQty1: number;
  loadQty2: number;
  loadQty3: number;
  labelPrintedFlg: string;
  soId: number;
  soDetailId: number;
  prospectFlg: string;
  prospectUpdateFlg: string;
  slotType: string;
  slottedUserId: number;
  xdockOrderId: number;
  pickId: number;
}
