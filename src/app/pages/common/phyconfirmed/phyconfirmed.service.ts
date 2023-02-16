import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class PhyconfirmedService {

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/inventory-service/phyConfirmed`;

  constructor(private http: JHttpService) {
  }

  async get(searchData: {}): Promise<ApiResult<PhyConfirmedVO[]>> {
    const baseUrl = `${this.httpUrl}/findPhyConfirmed`;
    try {
      // Post 방식으로 조회
      return await this.http.post<ApiResult<PhyConfirmedVO[]>>(baseUrl, searchData).toPromise();
    } catch (e) {
      return {
        success: false,
        data: null,
        code: e.code,
        msg: e.msg
      };
    }
  }

  async getPopup(data: {}): Promise<ApiResult<PhyConfirmedVO>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findPhyConfirmedFull`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<PhyConfirmedVO>>(baseUrl, data).toPromise();
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

  async save(data: any[]): Promise<ApiResult<void>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/savePhyConfirmed`;

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

  async execute(data: PhyConfirmedVO): Promise<ApiResult<void>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/executePhyConfirmed`;

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

export interface PhyConfirmedVO {
  tenant: string;
  uid: number;
  phyInstructKey: string;       // 재고조사키
  ownerPhyInstructKey: string;  // 화주재고조사키
  actFlg: string;               // 사용여부
  sts: string;                  // 상태
  phyInstructDate: Date;        // 재고조사 지시일
  warehouseId: number;          // 창고ID
  logisticsId: number;          // 창고회사ID
  ownerId: number;              // 화주ID
  itemAdminId: number;          // 품목관리사ID
  itemId: number;               // 품목ID
  visibleInstQty: string;       // 지시수량표기여부
  inventoryQty1: number;        // 조사수량
  phyInstructDetailList: PhyInstructDetailVO[];

  createdBy: string;
  createdDatetime: Date;
  createdIp: string;
  modifiedBy: string;
  modifiedDatetime: Date;
  modifiedIp: string;
}

export interface PhyInstructDetailVO {
  tenant: string;
  uid: number;
  ownerPhyInstructKey: string;  // 화주재고조사키
  actFlg: string;               // 사용여부
  sts: string;                  // 상태
  phyInstructDate: Date;        // 재고조사 지시일
  warehouseId: number;          // 창고ID
  logisticsId: number;          // 창고회사ID
  ownerId: number;              // 화주ID
  itemAdminId: number;          // 품목관리사ID
  itemId: number;               // 품목ID
  visibleInstQty: string;       // 지시수량표기여부
  instructQty1: number;        // 지시수량
  inventoryQty1: number;        // 조사수량
  qty1: number;        // 조사수량
  replace: boolean;
}
