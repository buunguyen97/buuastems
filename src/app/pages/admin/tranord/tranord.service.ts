import { Injectable } from '@angular/core';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {JHttpService} from '../../../shared/services/jhttp.service';
import {ApiResult} from '../../../shared/vo/api-result';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {MenuL2VO} from '../../common/layout2/layout2.service';
import {RcvAcceptVO} from '../../common/layout1/layout1.service';

@Injectable({
  providedIn: 'root'
})
export class TranordService {
  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/delivery-service/tranord`;

  openWeatherUrl = `http://api.openweathermap.org/data/2.5`;

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

  async searchRoute(data: any): Promise<any> {
    const sendUrl = `https://apis.openapi.sk.com/tmap/truck/routes?version=1&format=json&callback=result`;
    const sendData = new HttpParams( { fromObject: data } );

    try{
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', sendUrl, true);

        xhr.onload = (e) => {

          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else{
          }
        };
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(sendData.toString());
      });
    }catch {
      return null;
    }

    // const headers = new HttpHeaders(
    //   {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // );
    // const body = new HttpParams({ fromObject: data });
    // const options = { headers };
    // return this.http.postTmap(sendUrl, body.toString(), options).toPromise();
  }

  async reverseGeocoding(data: any): Promise<any> {
    const UserAppKey = 'l7xx46f9c83cb35e4db9abd67c564f44181e';
    const sendUrl = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&appKey=${UserAppKey}&coordType=WGS84GEO&addressType=A10&lat=${data.lat}&lon=${data.lon}`;

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

  async getCurrentWeather(lat: string, lon: string, country: string): Promise<WeatherApiVO[]> {
    let sendUrl;

    if (country) {
      sendUrl = `${this.openWeatherUrl}/weather?q=${country}&appid=${APPCONSTANTS.OPEN_WEATHER_API_KEY}&units=metric&lang=kr`;
    } else {
      sendUrl = `${this.openWeatherUrl}/weather?lat=${lat}&lon=${lon}&appid=${APPCONSTANTS.OPEN_WEATHER_API_KEY}&units=metric&lang=kr`;
    }

    try {
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
    } catch {
      return null;
    }
  }

  getForecast(lat: string, lon: string, country: string): Promise<WeatherApiListVO[]> {
    let sendUrl;

    if (country) {
      sendUrl = `${this.openWeatherUrl}/forecast?q=${country}&appid=${APPCONSTANTS.OPEN_WEATHER_API_KEY}&units=metric&cnt=10&lang=kr`;
    } else {
      sendUrl = `${this.openWeatherUrl}/forecast?lat=${lat}&lon=${lon}&appid=${APPCONSTANTS.OPEN_WEATHER_API_KEY}&units=metric&cnt=10&lang=kr`;
    }

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
}

export interface WeatherApiListVO {
  cod: string;
  message: string;
  cnt: string;
  list: WeatherApiVO[];
}

export interface WeatherApiVO {
  coord: string;
  weather: WeatherApiWeatherVO[];
  base: string;
  main: WeatherApiMainVO;
  visibility: string;
  wind: string;
  clouds: string;
  rain: string;
  snow: string;
  dt: Date;
  sys: string;
  timezone: string;
  id: string;
  name: string;
  code: string;
}

export interface WeatherApiMainVO {
  temp: string;
  feels_like: string;
  temp_min: string;
  temp_max: string;
  pressure: string;
  sea_level: string;
  grnd_level: string;
  humidity: string;
  temp_kf: string;
}

export interface WeatherApiWeatherVO {
  id: string;
  main: string;
  description: string;
  icon: string;
}
