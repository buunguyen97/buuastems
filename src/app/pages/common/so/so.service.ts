import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class SoService {

  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/release-service/so`;

  // http 객체 Injection
  constructor(private http: JHttpService) {
  }

  // 조회함수
  async get(searchData: {}): Promise<ApiResult<SoVO[]>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findSo`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<SoVO[]>>(baseUrl, searchData).toPromise();
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

  async getPopup(data: {}): Promise<ApiResult<SoVO>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findSoFull`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<SoVO>>(baseUrl, data).toPromise();
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

  async save(data: {}): Promise<ApiResult<SoVO[]>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/saveSo`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<SoVO[]>>(baseUrl, data).toPromise();
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

  async update(data: {}): Promise<ApiResult<SoVO[]>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/updateSo`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<SoVO[]>>(baseUrl, data).toPromise();
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

  async delete(data: SoVO): Promise<ApiResult<void>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/deleteSo`;

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

export interface SoVO {
  tenant: string;

  uid: number;
  soKey: string;
  ownerSoNo: string;
  preOwnerSoNo: string;
  soType: string;
  partFlg: number;
  actFlg: string;
  sts: string;

  companyId: number;
  ownerId: number;
  shipSchDate: string;
  shipDate: Date;
  delivSchDate: Date;
  delivDate: Date;
  carrySchDate: Date;
  transportPriority: number;

  logisticsId: number;
  warehouseId: number;
  customerId: number;
  shipToId: number;
  shipToSub: string;
  delivName: string;

  countrycd: string;
  zip: string;
  address1: string;
  address2: string;
  port: string;
  phone: string;
  email: string;
  fax: string;
  refName: string;
  allocGroup: string;

  carrierId: number;
  carrierName: string;
  carrierWbNo: string;

  carrierNo: string;
  carrierSname: string;
  otherRefNo1: string;
  otherRefNo2: string;
  otherRefNo3: string;

  pickBatchId: number;

  orderId: number;
  ownerOrderNo: string;
  orderType: string;
  custOrderNo: string;
  originalPoNo: string;
  rmaNo: string;
  orderDate: Date;
  moveId: number;
  assyId: number;

  remarks: string;
  deliveryType: string;

  soDetailList: SoDetailVO[];
}

export interface SoDetailVO {
  tenant: string;

  uid: number;
  soId: number;
  orderDetailId: number;
  ownerOrderLineNo: number;
  custOrderLineNo: number;
  originalPoLineNo: number;
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
  damageFlg: number;
  noShippingFlg: number;
  foreignCargoFlg: number;
  customsReleaseFlg: number;
  taxFlg: number;
  whInDate: Date;
  mngDate: Date;

  expectQty1: number;
  expectQty2: number;
  expectQty3: number;

  xDockQty1: number;
  allocQty1: number;
  pickedQty1: number;
  sortedQty1: number;

  inspectedQty1: number;
  inspectedQty2: number;
  inspectedQty3: number;

  shippedQty1: number;
  shippedQty2: number;
  shippedQty3: number;

  adjustQty1: number;
  adjustQty2: number;
  adjustQty3: number;

  priceBuy: number;
  priceWholeSale: number;
  priceSale: number;

  lotReserveFlg: number;
  pirckQtyErrorFlg: number;
  logicFlg1: number;
  logicFlg2: number;
  logicFlg3: number;

  xDockFlg: number;
  moveDetailId: number;
  assyDetailId: number;

  tagQty: number;
  isSerial: string;

  vehicleArrangeKey: string;
  deliveryType: string;
}

