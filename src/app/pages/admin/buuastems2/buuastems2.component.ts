import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxSwitchComponent} from "devextreme-angular";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {TranordService} from "../tranord/tranord.service";
import {UserService} from "../../mm/user/user.service";
import {CompanyService} from "../../mm/company/company.service";
import {TermService} from "../../mm/term/term.service";
import {DxFormComponent} from "devextreme-angular/ui/form";

@Component({
    selector: 'app-buuastems2',
    templateUrl: './buuastems2.component.html',
    styleUrls: ['./buuastems2.component.scss']
})
export class Buuastems2Component implements AfterViewInit {
    map;
    // weatherAddress: string;
    // weather: any;
    // weatherForecast: any;
    // @ViewChild('switchLocation', {static: false}) switchLocation: DxSwitchComponent;
    // @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;

    // constructor(public utilService: CommonUtilService,
    //             private service: TranordService,
    // ) {
    //
    // }

    initMap(): void {
        // @ts-ignore
        this.map = new Tmapv2.Map('maps', {
            // @ts-ignore
            center: new Tmapv2.LatLng(37.14662571373519, 127.5939137276295),
            width: '100%',
            height: '1000px',
            zoom: 14,
            zoomControl: true,
            scrollwheel: true
        });
    }

    // initData(): void {
    //     this.map.destroy();
    //     this.initMap();
    //
    // }

    ngAfterViewInit(): void {
        this.initMap();
        // this.setLocationMap(this.switchLocation.value);

    }

    // async setLocationMap(data): Promise<void> {
    //     let latitude = null;
    //     let longitude = null;
    //
    //     if (!data) {
    //         if (navigator.geolocation) {
    //             await navigator.geolocation.getCurrentPosition(async (position: any) => {
    //                     if (position) {
    //                         // console.log(position);
    //                         //
    //                         // console.log('Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude);
    //
    //                         latitude = position.coords.latitude;
    //                         longitude = position.coords.longitude;
    //
    //                         // @ts-ignore
    //                         this.map.setCenter(new Tmapv2.LatLng(latitude, longitude));
    //                         this.map.setZoom(14);
    //
    //                         const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});
    //
    //                         // console.log(result);
    //                         // console.log(result.addressInfo);
    //                         this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;
    //
    //                         this.weather = await this.service.getCurrentWeather(latitude, longitude, null);
    //
    //                         // console.log(this.weather);
    //
    //                         const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);
    //
    //                         this.weather.currentTime = weatherDate.getHours();
    //
    //                         this.weatherForecast = await this.service.getForecast(latitude, longitude, null);
    //
    //                         this.weatherForecast.list.forEach(el => {
    //                             const forecastDate = this.utilService.convertUTCDateTime(el.dt);
    //
    //                             el.currentTime = forecastDate.getHours();
    //                         });
    //
    //                         console.log(this.weatherForecast.list);
    //                     }
    //                 },
    //                 async (error: any) => {
    //                     console.log(error);
    //
    //                     if (this.weatherAddress == null && this.weather == null) {
    //                         latitude = this.map.getCenter().lat();
    //                         longitude = this.map.getCenter().lng();
    //
    //                         const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});
    //
    //                         this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;
    //
    //                         this.weather = await this.service.getCurrentWeather(latitude, longitude, null);
    //
    //                         const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);
    //
    //                         this.weather.currentTime = weatherDate.getHours();
    //
    //                         this.weatherForecast = await this.service.getForecast(latitude, longitude, null);
    //
    //                         this.weatherForecast.list.forEach(el => {
    //                             const forecastDate = this.utilService.convertUTCDateTime(el.dt);
    //
    //                             el.currentTime = forecastDate.getHours();
    //                         });
    //                     } else {
    //                         this.utilService.notify_error('위치 정보에 대한 권한이 없습니다.');
    //                     }
    //                 });
    //         }
    //     } else {
    //         const mainFormData = this.mainForm.formData;
    //
    //         if (mainFormData.endPoint) {
    //             latitude = mainFormData.endPoint.latitude;
    //             longitude = mainFormData.endPoint.longitude;
    //
    //             // @ts-ignore
    //             this.map.setCenter(new Tmapv2.LatLng(latitude, longitude));
    //             this.map.setZoom(14);
    //
    //             const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});
    //
    //             this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;
    //
    //             this.weather = await this.service.getCurrentWeather(latitude, longitude, null);
    //
    //             const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);
    //
    //             this.weather.currentTime = weatherDate.getHours();
    //
    //             this.weatherForecast = await this.service.getForecast(latitude, longitude, null);
    //
    //             this.weatherForecast.list.forEach(el => {
    //                 const forecastDate = this.utilService.convertUTCDateTime(el.dt);
    //
    //                 el.currentTime = forecastDate.getHours();
    //             });
    //         } else {
    //             this.utilService.notify_error('입력 된 하차지가 없습니다.');
    //         }
    //     }
    // }
}
