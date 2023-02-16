import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';

@Injectable({
  providedIn: 'root'
})
export class Layout3Service {

  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/company`;

  // http 객체 Injection
  constructor(
    private http: JHttpService) {
  }

  // 조회함수
  async get(searchData: {}): Promise<ApiResult<any[]>> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/findCompany`;
    // return this.http.get<ApiResult<CompanyService[]>>(baseUrl);
    try {
      // Post 방식으로 조회
      // Company는 Interface 형식으로 Service 하단에 구현하며, BackEnd의 VO와 형식을 맞춤.
      const result = await this.http.post<ApiResult<any[]>>(baseUrl, searchData).toPromise();
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

  async getPopup(data: {}): Promise<ApiResult<any>> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/findCompanyFull`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<ApiResult<any>>(baseUrl, data).toPromise();

      // 폼데이터에 들어가기전 형변환
      result.data.isCarrier = result.data.isCarrier === 1 ? true : false;
      result.data.isCustomer = result.data.isCustomer === 1 ? true : false;
      result.data.isEtc = result.data.isEtc === 1 ? true : false;
      result.data.isOwner = result.data.isOwner === 1 ? true : false;
      result.data.isShipTo = result.data.isShipTo === 1 ? true : false;
      result.data.isSupplier = result.data.isSupplier === 1 ? true : false;
      result.data.isWarehouse = result.data.isWarehouse === 1 ? true : false;

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

  // 저장함수
  async save(data: {}): Promise<ApiResult<any>> {
    const baseUrl = `${this.httpUrl}/saveCompany`;
    try {
      const result = await this.http.post<ApiResult<any>>(baseUrl, data).toPromise();
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
  async update(data: {}): Promise<ApiResult<any>> {
    const baseUrl = `${this.httpUrl}/updateCompany`;
    try {
      const result = await this.http.post<ApiResult<any>>(baseUrl, data).toPromise();
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
    const baseUrl = `${this.httpUrl}/deleteCompany`;
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

  // async save_sync(saveData: any): Promise<ApiResult<CompanyData>> {
  //   const baseUrl = `${this.httpUrl}/saveCompanyVO`;
  //   try {
  //     const result = await this.http.post<ApiResult<CompanyData>>(baseUrl, saveData).toPromise();
  //     return result;
  //   } catch {
  //     return {
  //       success: false,
  //       data: null,
  //       code: '-999',
  //       msg: 'Post service API error!'
  //     };
  //   }
  //
  // }


}

// BackEnd의 VO와 맞춤
export interface CompanyVO {
  tenant: string;
  uid: number;
  company: string;
  // itemAdminId
  itemAdminId: string;
  companyGroupcd: string;

  actFlg: string;
  name: string;
  shortName: string;
  bsNo: string;
  // address
  countrycd: string;
  zip: string;
  address1: string;
  address2: string;
  phone1: string;
  phone2: string;
  fax1: string;
  FAX2: string;
  refName: string;
  email: string;
  url: string;
  remarks: string;
  isOwner: boolean;
  isCustomer: boolean;
  isShipTo: boolean;
  isSupplier: boolean;
  isWarehouse: boolean;
  isCarrier: boolean;
  isEtc: boolean;

  transportPriority;
  purchaseTypecd;
  rowVersion: number;

  ownWarehouseId: number;

  gps_lat: string;
  gps_long: string;

  createdBy: string;
  createdDatetime: Date;
  createdIp: string;
  modifiedBy: string;
  modifiedDatetime: Date;
  modifiedIp: string;

  warehouseList: CompanyXWhVO[];
}


export interface CompanySearchVO {
  tenant: string;
  uid: number;
  company: string;
  // // itemAdminId
  // itemAdminId: string;
  // companyGroupcd: string;

  actFlg: string;
  name: string;
  // shortName: string;
  // bsNo: string;
  // address
  // countrycd: string;
  // zip: string;
  // address1: string;
  // address2: string;
  // phone1: string;
  // phone2: string;
  // fax1: string;
  // FAX2: string;
  // refName: string;
  // email: string;
  // url: string;
  // remarks: string;
  isOwner: number;
  isCustomer: number;
  isShipTo: number;
  isSupplier: number;
  isWarehouse: number;
  isCarrier: number;
  isEtc: number;

  // transportPriority;
  // purchaseTypecd;
  // rowVersion: number;
  //
  // ownWarehouseId: number;
  //
  // gps_lat: string;
  // gps_long: string;
  //
  // createdBy: string;
  // createdDatetime: Date;
  // createdIp: string;
  // modifiedBy: string;
  // modifiedDatetime: Date;
  // modifiedIp: string;
  //
  // warehouseList: CompanyXWhVO[];
}


export interface LookupCompanyVO {
  tenant: string;
  uid: number;
  company: string;
  name: string;
  shortName: string;

  isOwner: boolean;
  isCustomer: boolean;
  isShipTo: boolean;
  isSupplier: boolean;
  isWarehouse: boolean;
  isCarrier: boolean;
  isEtc: boolean;

  refName: string;
  phone1: string;
  countrycd: string;
  zip: string;
  address1: string;
  address2: string;

  ownWarehouseId: number;

  display: string;
}

export interface CompanyXWhVO {
  uid: number;
  ownerId: number;
  warehouseId: number;
  urcvingLocId: number;
  badReturnLocId: number;
  cancelLocId: number;
  sortLocId: number;
  pReturnLocId: number;
  overflowLocId: number;
  transferLocId: number;
  uRcvIngLocId: number;

  createdBy: string;
  createdDatetime: Date;
  createdIp: string;
  modifiedBy: string;
  modifiedDatetime: Date;
  modifiedIp: string;
}
