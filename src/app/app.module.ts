/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : app.module.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 16:08:12
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SideNavInnerToolbarModule, SingleCardModule} from './layouts';
import {AppInfoService, AuthService, ScreenService} from './shared/services';
import {UnauthenticatedContentModule} from './unauthenticated-content';
import {AppRoutingModule} from './app-routing.module';
import {JHttpService} from './shared/services/jhttp.service';
import {SessionStorageService} from './shared/services/session-storage.service';
import {authInterceptorProviders} from './shared/interceptors/jhttp.interceptor';
import {CookieService} from 'ngx-cookie-service';
import {WindowRefService} from './shared/window-ref.service';
import {CommonUtilService} from './shared/services/common-util.service';
import {CommonCodeService} from './shared/services/common-code.service';
import {JTimeZoneService} from './shared/services/jtime-zone.service';
import config from 'devextreme/core/config';
import {HttpClientModule} from '@angular/common/http';

import {MmModule} from './pages/mm/mm.module';
import {AdminModule} from './pages/admin/admin.module';
import {CarownerModule} from './pages/carowner/carowner.module';
import {CarrierModule} from './pages/carrier/carrier.module';
import {PopupModule} from './pages/popup/popup.module';

import {SharedComponentsModule} from './shared/components/sharedComponents.module';
import {ComponentBehaviorService} from './shared/services/component-behavior.service';
import {DevExtremeModule} from 'devextreme-angular';

import { Layout0Component } from './pages/common/layout0/layout0.component';
import { Layout1Component } from './pages/common/layout1/layout1.component';
import { Layout2Component } from './pages/common/layout2/layout2.component';
import { Layout3Component } from './pages/common/layout3/layout3.component';
import { Layout4Component } from './pages/common/layout4/layout4.component';
import { Layout5Component } from './pages/common/layout5/layout5.component';
import { Layout6Component } from './pages/common/layout6/layout6.component';
import { Layout7Component } from './pages/common/layout7/layout7.component';
import { Layout8Component } from './pages/common/layout8/layout8.component';
import { Layout9Component } from './pages/common/layout9/layout9.component';
import { Layout10Component } from './pages/common/layout10/layout10.component';


@NgModule({
  declarations: [
    AppComponent,
    Layout0Component,
    Layout1Component,
    Layout2Component,
    Layout3Component,
    Layout4Component,
    Layout5Component,
    Layout6Component,
    Layout7Component,
    Layout8Component,
    Layout9Component,
    Layout10Component
  ],
  imports: [
    BrowserModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule,
    SharedComponentsModule,
    MmModule,
    AdminModule,
    CarownerModule,
    CarrierModule,
    PopupModule,
    DevExtremeModule
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    JHttpService,
    SessionStorageService,
    authInterceptorProviders,
    CookieService,
    WindowRefService,
    CommonUtilService,
    CommonCodeService,
    JTimeZoneService,
    ComponentBehaviorService
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {

  constructor() {
    config({
      rtlEnabled: false,
      forceIsoDateParsing: true,
    });
  }
}


// AoT requires an exported function for factories
// export function httpTranslateLoader(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// tslint:disable-next-line:typedef
export function windowFactory() {
  return window;
}
