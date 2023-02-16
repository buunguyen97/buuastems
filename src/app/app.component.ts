/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : app.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-06-17 17:49:51
 */

import {Component, HostBinding} from '@angular/core';
import {AppInfoService, AuthService, ScreenService} from './shared/services';
import {CommonUtilService} from './shared/services/common-util.service';
import {APPCONSTANTS} from './shared/constants/appconstants';
import {CommonCodeService} from './shared/services/common-code.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @HostBinding('class') get getClass(): string {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  constructor(private authService: AuthService,
              private screen: ScreenService,
              private appInfo: AppInfoService,
              private commonUtils: CommonUtilService,
              private codeService: CommonCodeService) {
    this.commonUtils.initMessages();  // 다국어 적용(새로고침을 위한)

    // Naver map api
    const naverMap = document.createElement('script');
    naverMap.setAttribute('src', `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${APPCONSTANTS.NAVER_MAP_API_KEY}&submodules=geocoder`);
    document.body.appendChild(naverMap);

    // google map API
    const googleMap = document.createElement('script');
    googleMap.setAttribute('src', `https://maps.googleapis.com/maps/api/js?v=quarterly&key=${APPCONSTANTS.GOOGLE_MAP_API_KEY}&libraries=places,geometry&language=en`);
    document.body.appendChild(googleMap);

    const polyfill = document.createElement('script');
    polyfill.setAttribute('src', 'https://polyfill.io/v3/polyfill.min.js?features=default');
    document.body.appendChild(polyfill);

    let filtered = [];
    const defaultRange = -7;

    this.codeService.getCode(this.commonUtils.getTenant(), 'DATERANGE').subscribe(r => {
      filtered = r.data.filter(el => el.codeName === 'RANGE');
      this.commonUtils.setDateRange(filtered.length > 0 ? Number(filtered[0].code) : defaultRange);
    });
  }

  isAuthenticated(): boolean {
    return this.authService.loggedIn;
  }
}
