import {Injectable} from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {custom, CustomDialogOptions} from 'devextreme/ui/dialog';
import {CommonUtilService} from '../../../shared/services/common-util.service';

@Injectable({
  providedIn: 'root'
})
export class TranOrdMassService {
  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/delivery-service/tranordmass`;

  constructor(public utilService: CommonUtilService,
              private http: JHttpService) {
  }

  async addressValidation(address: string): Promise<any> {

    const UserAppKey = 'l7xx46f9c83cb35e4db9abd67c564f44181e';
    const version = 1;
    const addressFlag = `F00`;
    const format = 'json';
    const tmapUrl = `https://apis.openapi.sk.com/tmap/geo/postcode?version=${version}&appKey=${UserAppKey}&addr=${address}&addressFlag=${addressFlag}&format=${format}`;
    let result: any;
    try {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', tmapUrl, true);
        xhr.responseType = 'json';
        xhr.onload = (e) => {
          result = xhr.response;
          if (xhr.status === 200) {
            result = JSON.stringify(result);
            result = JSON.parse(result);
            resolve(result.coordinateInfo);
          } else if (xhr.status >= 400){
            reject(result);
          }
        };
        // xhr.onerror = () => reject(result.error);
        xhr.send();
      });
    } catch {
      return null;
    }

  }

  async confirm(msg): Promise<boolean> {
    const dialogOptions = {
      title: this.utilService.convert1('com.confirm.title', '확인'),
      messageHtml: `<div style="height: 150px; width: 300px; font-size: 15px; text-align: center; position: relative; top: 20px;">${msg}</div>`,
      buttons: [
        {
          text: this.utilService.convert1('com.confirm.yes.text', '확인'), onClick: () => {
            return false;
          },
          focusStateEnabled: false
        }],
      showTitle: true,
      dragEnabled: true
    } as CustomDialogOptions;

    let returnValue = false;

    const result = custom(dialogOptions);
    try {
      await result.show().done(r => {
        returnValue = r;
      });
    } catch {
    }
    return returnValue.valueOf();
  }

  // 템플릿다운로드
  async downloadTemplateExcel(): Promise<{}> {
    // 조회 Api 설정
    const baseUrl = `${this.httpUrl}/downloadTemplateExcel`;

    try {
      const a = window.document.createElement('a');
      a.href = baseUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    } catch (e) {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

  async get(data: {}): Promise<any> {
    const baseUrl = `${this.httpUrl}/findTranOrdMass`;
    try {
      const result = await this.http.post<tranOrdMassSearchVO>(baseUrl, data).toPromise();

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

  async save(data: any[]): Promise<any> {
    // console.log(data);
    // Api 설정
    const baseUrl = `${this.httpUrl}/saveTranOrdMass`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<tranOrdMassVO>(baseUrl, data).toPromise();
      // console.log(result);
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
  async delete(data: any): Promise<any> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/deleteTranOrdMass`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<tranOrdMassVO>(baseUrl, data).toPromise();
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
  async regist(data: any): Promise<any> {
    // Api 설정
    const baseUrl = `${this.httpUrl}/createTranPayments`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<tranOrdMassVO>(baseUrl, data).toPromise();
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
  async getAddrDataByCoordinate(data: any): Promise<any> {

    const startX = data.startX;
    const startY = data.startY;
    const endX = data.endX;
    const endY = data.endY;
    const passList = data.passList;

    const truckWidth = data.truckWidth;
    const truckHeight = data.truckHeight;
    const truckWeight = data.truckWeight;
    const truckTotalWeight = data.truckTotalWeight;
    const truckLength = data.truckLength;
    const truckType = 1;

    const appKey = 'l7xx46f9c83cb35e4db9abd67c564f44181e';
    const version = 1;
    const format = 'json';
    const reqCoordType = 'WGS84GEO';
    const resCoordType = 'WGS84GEO';
    const angle = '172';
    const searchOption = '0';
    const trafficInfo = 'Y';

    // 화물 ROUTE
    const tmapUrl = `https://apis.openapi.sk.com/tmap/truck/routes?version=${version}&format=${format}&` +
      `truckWidth=${truckWidth}&truckHeight=${truckHeight}&truckWeight=${truckWeight}&truckTotalWeight=${truckTotalWeight}&` +
      `truckLength=${truckLength}&truckType=${truckType}&` +
      `startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}&passList=${passList}&reqCoordType=${reqCoordType}` +
      `&resCoordType=${resCoordType}&angle=${angle}&searchOption=${searchOption}&trafficInfo=${trafficInfo}&appKey=${appKey}`;
    /*
        일반 ROUTE
        const tmapUrl = `https://apis.openapi.sk.com/tmap/routes?version=${version}&format=${format}&` +
          `startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}&passList=${passList}&reqCoordType=${reqCoordType}` +
          `&resCoordType=${resCoordType}&angle=${angle}&searchOption=${searchOption}&trafficInfo=${trafficInfo}&appKey=${appKey}`;
    */

    try {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('post', tmapUrl, true);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = (e) => {
          if (xhr.status === 200) {
            const result = xhr.response;
            resolve(result);
          } else {
            reject(null);
          }
        };
      });
    } catch {
      return null;
    }
  }
}

// tslint:disable-next-line:class-name
export interface tranOrdMassSearchVO {
  sts: string;
  fromRcvSchDate: Date;
  toRcvSchDate: Date;
}

// tslint:disable-next-line:class-name
export interface tranOrdMassVO {
  uid: number;
  tranDate: Date;
  tranOrdType: string;
  tranOrdCategory: string;
  tranCarType: string;
  tranCarKind: string;
  tranCarCnt: number;
  tranItemOption: string;
  tranItemCategoryNm: string;
  tranItemPackType: string;
  tranItemWeight: number;
  tranItemHeight: number;
  tranItemWidth: number;
  tranItemLength: number;
  tranItemCbm: number;
  tranItemAmt: number;
  tranSalesType: string;
  tranPointSeq: number;
  tranType: string;
  companyNm: string;
  refNm: string;
  refTellNo: string;
  address1: string;
  address2: string;
  remarks: string;
  tranIntervalType: string;
  tranStartDateTime: Date;
  tranEndDateTime: Date;
  expectedDateTime: Date;
  companyId: number;

  ciDo: string;
  guGun: string;
  eupMyun: string;
  latitude: number;
  longitude: number;
}
