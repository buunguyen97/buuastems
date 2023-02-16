import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/company`;

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
