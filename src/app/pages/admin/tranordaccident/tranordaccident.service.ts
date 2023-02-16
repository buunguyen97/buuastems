import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {custom, CustomDialogOptions} from 'devextreme/ui/dialog';
import {tranOrdAllocateVO, tranOrdMassVO} from '../tranordallocate/tranordallocate.service';

@Injectable({
  providedIn: 'root'
})
export class TranordaccidentService {
  // 기본 URL 선언
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/delivery-service/tranordaccident`;
  // httpUrl = `${APPCONSTANTS.BASE_URL_WM}/delivery-service/tranordallocate`;

  constructor(public utilService: CommonUtilService,
              private http: JHttpService) {
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
  async get(data: {}): Promise<any> {
    const baseUrl = `${this.httpUrl}/findTranOrdAccident`;
    try {
      const result = await this.http.post<any>(baseUrl, data).toPromise();
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
  async carInfoGet(data: any): Promise<any> {
    const baseUrl = `${this.httpUrl}/findCarInfo`;
    // console.log(companyId);
    try {
      const result = await this.http.post<tranOrdAllocateVO>(baseUrl, data).toPromise();
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

    // Api 설정
    const baseUrl = `${this.httpUrl}/saveTranOrdAllocate`;

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
  async saveAccident(data: any[]): Promise<any> {

    // Api 설정
    const baseUrl = `${this.httpUrl}/saveTranOrdAccident`;

    try {
      // Post 방식으로 조회
      const result = await this.http.post<tranOrdAccidentReqVO>(baseUrl, data).toPromise();
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
  async searchAddress(address: string): Promise<any> {
    const UserAppKey = 'l7xx46f9c83cb35e4db9abd67c564f44181e';
    const sendUrl = `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&appKey=${UserAppKey}&coordType=WGS84GEO&fullAddr=${address}`;

    try{
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', sendUrl, true);
        xhr.responseType = 'json';
        xhr.send();

        xhr.onload = (e) => {

          if (xhr.status === 200) {
            let result = xhr.response;
            result = JSON.stringify(result);
            result = JSON.parse(result);
            resolve(result);
          } else{
            reject(null);
          }
        };
      });
    }catch {
      return null;
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
export interface tranOrdAccidentReqVO {
  // Popup Data
  tranOrdId: number;
  tranOrdKey: string;
  tranPointSeq: number;
  tranOrdCarId: number;
  // Form Data
  address1: string;
  address2: string;
  remarks: string;
  tranAccidentAmt: number;
  // API
  latitude: number;
  longitude: number;
  ciDo: string;
  guGun: string;
  eupMyun: string;

}
