import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class RcvexpectedService {

  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcvExpected`;

  // http 객체 Injection
  constructor(private http: JHttpService) {
  }

  async get(searchData: {}): Promise<ApiResult<RcvExpectedVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvExpected`;
    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvExpectedVO[]>>(baseUrl, searchData).toPromise();
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

  // 조회함수(디테일포함)
  async getRcvFull(searchData: {}): Promise<ApiResult<RcvExpectedVO>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findRcvFull`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvExpectedVO>>(baseUrl, searchData).toPromise();
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

  async save(data: {}): Promise<ApiResult<RcvExpectedVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/saveRcvExpected`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvExpectedVO[]>>(baseUrl, data).toPromise();
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

  async update(data: {}): Promise<ApiResult<RcvExpectedVO[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/updateRcvExpected`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<RcvExpectedVO[]>>(baseUrl, data).toPromise();
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

  async delete(data: RcvExpectedVO): Promise<ApiResult<void>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/deleteRcvExpected`;

    try {
      // Post 방식으로 조회
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

export interface RcvExpectedVO {
  tenant: string;

  uid: number;
  rcvKey: string;             // 입고번호
  sts: string;                // 입고상태
  stsList: string[];
  rcvAcceptId: string;        // 입고접수키
  acceptKey: string;          // 입고접수번호
  rcvTypecd: string;          // 입고타입
  rcvSchDate: Date;           // 입고예정일
  receiveDate: Date;          // 입고실적일
  supplierId: number;         // 공급처
  supplierName: string;       // 공급처명
  rcvSumItemCount: number;    // 총품목수
  rcvSumQty1: number;         // 총품목수량
  rcvSumBoxCount: number;     // 총BOX수
  rcvSumEaCount: number;      // 총EA수
  actFlg: string;             // 사용여부
  remarks: string;            // 전표비고

  refName: string;            // 담당자
  warehouseId: number;        // 창고코드
  supplierPhone: string;      // 연락처
  supplierCountrycd: string;  // 국가
  supplierPortcd: string;     // 항구
  supplierZip: string;        // 우편번호
  supplierAddress1: string;   // 주소1
  supplierAddress2: string;   // 주소2
  companyId: number;          // companyId
  logisticsId: number;        // 물류회사

  moveId: number;
  fromRcvSchDate: Date;   // from입고예정일
  toRcvSchDate: Date;     // to입고예정일
  fromReceiveDate: Date;  // from입고실적일
  toReceiveDate: Date;    // to입고실적일

  ownerId: number;      // 화주

  rcvDetailList: RcvDetailVO[];
}

export interface RcvDetailVO {
  tenant: string;

  uid: number;
  rcvId: number;
  supplierRcvLineNo: number;
  xDockFlg: number;
  poId: number;
  poDetailId: number;
  poTypecd: string;
  ownerPoNo: string;
  ownerPoLineNo: number;
  originalPoNo: string;
  originalPoLineNo: number;
  poDate: Date;

  ownerId: number;
  itemAdminId: number;
  itemId: number;
  unit1Stylecd: string;
  unit2Stylecd: string;
  unit3Stylecd: string;
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
  damageFlg: boolean;
  noShippingFlg: boolean;
  foreignCargoFlg: boolean;
  customsReleaseFlg: boolean;
  taxFlg: boolean;
  whInDate: Date;
  mngDate: Date;

  expectQty1: number;
  expectQty2: number;
  expectQty3: number;

  receivedQty1: number;
  receivedQty2: number;
  receivedQty3: number;

  adjustQty1: number;
  adjustQty2: number;
  adjustQty3: number;

  rcvTagQty1: number;

  xDockFreeQty1: number;

  inspectedQty1: number;
  inspectedQty2: number;
  inspectedQty3: number;

  priceBuy: number;
  priceWholeSale: number;
  priceSale: number;

  icDate: Date;

  orderNo: string;

  orderLineNo: number;

  ownerOrderNo: string;

  ownerOrderLineNo: number;

  custOrderNo: string;

  custOrderLineNo: number;

  orderTypecd: string;

  rcvQtyErrorFlg: number;

  logicFlg1: number;
  logicFlg2: number;
  logicFlg3: number;

  checkLastLotFlg: number;

  moveId: number;
  moveDetailId: number;
  assyDetailId: number;
  produceDetailId: number;

  tagQty: number;
}
