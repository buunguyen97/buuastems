import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {PhyConfirmedVO} from '../phyconfirmed/phyconfirmed.service';

@Injectable({
  providedIn: 'root'
})
export class Layout4Service {

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/inventory-service/separate`;

  constructor(private http: JHttpService) {
  }

  async get(searchData: {}): Promise<ApiResult<PhyConfirmedVO[]>> {
    const baseUrl = `${this.httpUrl}/findSeparate`;
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

  async execute(data: any[]): Promise<ApiResult<void>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/executeSeparate`;

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

export interface SeparateVO {
  tenant: string;

  uid: number;
  lotId: number;
  warehouseId: number;
  warehouseName: string;
  logisticsId: number;
  locId: number;
  locName: string;
  tagId: number;
  ownerId: number;
  ownerName: string;
  itemAdminId: number;
  itemAdminName: string;
  itemId: number;
  itemName: string;
  moveQty: number;
  qty1: number;
  actualDate: Date;

  lotAttribute: LotAttributeVO;

  createdBy: string;
  createdDatetime: Date;
  createdIp: string;
  modifiedBy: string;
  modifiedDatetime: Date;
  modifiedIp: string;
}

export interface LotAttributeVO {
  tenant: string;

  uid: number;
  lotId: number;
  warehouseId: number;
  logisticsId: number;
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
}
