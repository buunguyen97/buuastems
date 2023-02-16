/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : header.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-02-20 11:22:19
 */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';

import {AuthService} from '../../services';
import themes from 'devextreme/ui/themes';
import {
  DxDropDownButtonComponent,
  DxDropDownButtonModule,
  DxFormModule,
  DxRadioGroupComponent,
  DxRadioGroupModule,
  DxSelectBoxComponent,
  DxSelectBoxModule,
  DxTabsModule
} from 'devextreme-angular';
import {CommonCodeService} from '../../services/common-code.service';
import {CommonUtilService} from '../../services/common-util.service';
import {ComponentBehaviorService} from '../../services/component-behavior.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import { interval } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService,
              private codeService: CommonCodeService,
              public utilService: CommonUtilService,
              private cookieService: CookieService,
              private behaviorService: ComponentBehaviorService,
              @Inject(DOCUMENT) private document,
              private router: Router) {
    this.initBusinessCategory();
    // this.onShown = this.onShown.bind(this);
  }

  @ViewChild('warehouse', {static: false}) warehouse: DxSelectBoxComponent;
  @ViewChild('itemAdmin', {static: false}) itemAdmin: DxSelectBoxComponent;
  @ViewChild('owner', {static: false}) owner: DxSelectBoxComponent;
  @ViewChild('company', {static: false}) company: DxSelectBoxComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('dropDownBtn', {static: false}) dropDownBtn: DxDropDownButtonComponent;

  @ViewChild('settingForm', {static: false}) settingForm: DxFormComponent;
  @ViewChild('colorModeComponent', {static: false}) colorModeComponent: DxRadioGroupComponent;
  @ViewChild('colorSchemeComponent', {static: false}) colorSchemeComponent: DxRadioGroupComponent;
  @ViewChild('fontComponent', {static: false}) fontComponent: DxRadioGroupComponent;
  @ViewChild('fontSizeComponent', {static: false}) fontSizeComponent: DxRadioGroupComponent;

  /**
   *  공통 Lookup DataSet
   */
  dsWarehouse = [];  // 창고
  dsItemAdmin = [];  // 품목관리사
  dsOwner = [];  // 화주
  dsCompany = [];  // 소속회사

  @Output()
  systemTypeChanged = new EventEmitter<string>();

  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title: string;

  user = {user: '', email: ''};

  tabs: any[] = [];
  selectedIndex: any;

  // 스킨 목록
  colorMode: any[] = [
    {value: 'light', name: 'Light', type: 'colorMode'},
    {value: 'dark', name: 'Dark', type: 'colorMode'}
  ];

  colorScheme: any[] = [
    {value: 'orange', name: 'Orange', type: 'colorScheme'},
    {value: 'yellow', name: 'Yellow', type: 'colorScheme'},
    {value: 'darkyellow', name: 'Dark Yellow', type: 'colorScheme'},
    {value: 'lightgreen', name: 'Light Green', type: 'colorScheme'},
    {value: 'green', name: 'Green', type: 'colorScheme'},
    {value: 'blue', name: 'Blue', type: 'colorScheme'},
    {value: 'darkblue', name: 'Dark Blue', type: 'colorScheme'},
    {value: 'purple', name: 'Purple', type: 'colorScheme'},
    {value: 'custom', name: 'custom', type: 'colorScheme'}
  ];

  fontSize: any[] = [
    {value: '12', name: '12px', type: 'fontsize'},
    {value: '13', name: '13px', type: 'fontsize'},
    {value: '14', name: '14px', type: 'fontsize'},
    {value: '15', name: '15px', type: 'fontsize'},
    {value: '16', name: '16px', type: 'fontsize'}
  ];

  font: any[] = [
    {value: 'nanumgothic', name: 'Nanumgothic', type: 'font'},
    {value: 'malgungothic', name: 'Malgungothic', type: 'font'},
    {value: 'natosans', name: 'Natosans', type: 'font'}
  ];

  userMenuItems = [
    {
      text: 'Profile',
      icon: 'user',
      onClick: () => {
        const e = {} as Event;
        // this.behaviorService.changedSystemType(e);
        this.router.navigate(['/profile'], {skipLocationChange: true});
      }
    },
    {
      text: 'Logout',
      icon: 'arrowright',
      onClick: () => {
        this.authService.logOut();
      }
    }];

    toggleMenuButtonOptions = {
      text: 'menu',
        icon: 'menuToggle',
        onClick: () => {
           this.menuToggle.emit();
        }
    }

    logoutButtonOptions = {
      icon: 'logout',
      onClick: () => {
        this.authService.logOut();
      }
    }



  /**
   *  공통 창고코드, 화주, 품목관리사 선택 이벤트
   */
  warehouseChangedFlg = false;
  ownerChangedFlg = false;
  itemAdminChangedFlg = false;

  settingFlag = false;
  shownFlag = false;

  notiDataList;

  initBusinessCategory(): void {

    const tenant = this.utilService.getTenant();
    // this.codeService.getMenuTabList(tenant, Number(this.utilService.getUserUid())).subscribe(result => {
    //
    //   if (result.success) {
    //     // tslint:disable-next-line:forin
    //     for (const idx in result.data) {
    //       const data = result.data[idx];
    //       this.tabs.push({
    //         text: data.codeName,
    //         systemType: data.code
    //       });
    //       if (this.utilService.getSystemType() === data.code) {
    //         this.selectedIndex = idx;   // 탭 포커스
    //       }
    //     }
    //   }
    // });
  }

  onSelectTab(e): void {
    // // systemType 선택
    // this.utilService.setSystemType(e.itemData.systemType);
    // this.behaviorService.changedSystemType(e);
    //
    // // 시스템타입 visible
    // this.setVisibleSystemType();
  }

  // setVisibleSystemType(): void {
    // const systemType = this.utilService.getSystemType();

    // header에 소속회사 등 3가지 표시
    // const allowTypes = ['WM', 'MM', 'PP'];
    // 시스템타입이 물류일 경우 창고 표시
    // this.warehouse.visible = allowTypes.includes(systemType);
    // this.itemAdmin.visible = allowTypes.includes(systemType);
    // this.owner.visible = allowTypes.includes(systemType);
    // this.company.visible = allowTypes.includes(systemType);
  // }

  ngOnInit(): void {
    this.authService.getUser().then((e) => {
        this.user = e.data;
      }
    );
    this.setNotification();

    const notiInterval = interval(1000000);
    notiInterval.subscribe(x => {
      this.setNotification();
    });
    // this.changSetting(this.utilService.getUtSetting()).then();
  }

  ngAfterViewInit(): void {
  }

  setNotification(): void {
    this.codeService.getNotification({
      tenant : this.utilService.getTenant(), userId: this.utilService.getUserUid()
    }).subscribe(result  => {
      this.notiDataList = result.data;
    });
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  }
  //
  // /**
  //  * 테마 변경 이벤트
  //  */
  // setSetting(): void {
  //   const font = this.fontComponent.value.value;
  //   const fontsize = this.fontSizeComponent.value.value;
  //   const theme = this.colorModeComponent.value.value + '.' + this.colorSchemeComponent.value.value;
  //
  //   this.changSetting({font, fontsize, theme}).then(settingData => {
  //     this.utilService.setUtSetting(settingData);
  //     this.dropDownBtn.opened = false;
  //   });
  // }
  //
  // async changSetting(settingData): Promise<any> {
  //
  //   for (const key of Object.keys(settingData)) {
  //
  //     if (key === 'font') {
  //       this.document.getElementById(key).setAttribute('href', 'themes/css/dx.fontfamily.' + settingData[key] + '.css');
  //     } else if (key === 'fontsize') {
  //       this.document.getElementById(key).setAttribute('href', 'themes/css/dx.fontsize.' + settingData[key] + '.css');
  //     } else if (key === 'theme') {
  //       themes.current(settingData[key]);
  //     }
  //   }
  //   return settingData;
  // }
  //
  // onShown(): void {
  //   const utSetting = this.utilService.getUtSetting();
  //
  //   const currTheme = utSetting.theme.split('.');
  //   this.colorModeComponent.value = this.colorMode.filter(el => el.value === currTheme[0])[0];
  //   this.colorSchemeComponent.value = this.colorScheme.filter(el => el.value === currTheme[1])[0];
  //
  //   const currFontSize = utSetting.fontsize;
  //   this.fontSizeComponent.value = this.fontSize.filter(el => el.value === currFontSize)[0];
  //
  //   const currFont = utSetting.font;
  //   this.fontComponent.value = this.font.filter(el => el.value === currFont)[0];
  // }
}
