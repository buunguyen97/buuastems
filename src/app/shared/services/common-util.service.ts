/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : common-util.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-01 14:00:58
 */

import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {APPCONSTANTS} from '../constants/appconstants';
import notify from 'devextreme/ui/notify';
import {JHttpService} from './jhttp.service';
import {JTimeZoneService} from './jtime-zone.service';
import {Moment} from 'moment';
import {Observable} from 'rxjs';
import {ApiResult} from '../vo/api-result';
import {formatMessage, loadMessages, locale} from 'devextreme/localization';
import {CommonCodeService} from './common-code.service';
import {custom, CustomDialogOptions} from 'devextreme/ui/dialog';
import {forEach} from 'lodash';
import {COMMONINITDATA} from '../constants/commoninitdata';
import {ComponentBehaviorService} from './component-behavior.service';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilService {

  private _dictionary: any = {};
  set dictionary(dic: any) {
    this._dictionary = dic;
  }

  get dictionary(): any {
    return this._dictionary;
  }

  constructor(private cookieService: CookieService,
              private http: JHttpService,
              private behaviorService: ComponentBehaviorService,
              private codeService: CommonCodeService,
              private timeService: JTimeZoneService) {
  }

  httpUrl = `${APPCONSTANTS.BASE_URL_WM}/api/v1/mm/util`;

  dateRange: any = -7;

  public setDateRange(dateRange: number): void {
    this.dateRange = dateRange;
  }

  getLanguage(): string {
    const lang = localStorage.getItem(APPCONSTANTS.TEXT_LOCALE);
    return lang != null ? lang : APPCONSTANTS.LANG_DEFAULT;
  }

  setLanguage(lang: string): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_LOCALE);
    localStorage.setItem(APPCONSTANTS.TEXT_LOCALE, lang);
  }

  getTenant(): string {
    return this.cookieService.get(APPCONSTANTS.TOKEN_USER_TENANT_KEY) || COMMONINITDATA.TENANT;
  }

  getUser(): string {
    return this.cookieService.get(APPCONSTANTS.TOKEN_USER_USERID_KEY);
  }

  getUserUid(): string {
    return this.cookieService.get(APPCONSTANTS.TOKEN_USER_USERID_UID);
  }

  // TODO: POC ?????? ?????? ??????
  getUserCompanyId(): number {
    return Number(this.cookieService.get(APPCONSTANTS.TOKEN_USER_COMPANYID));
  }

  /**
   *  ????????? ????????? ????????? ????????????
   */
  isAdminUser(): boolean {
    // return this.getUser() === APPCONSTANTS.ADMIN_USER;
    const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));
    return 'Y' === data.isAdmin;
  }

  // TODO: POC ?????? ?????? ???

  getFormatDate(date: any): string {
    let month: string | number;
    let day: string | number;
    let data: Date;
    if (typeof (date) !== typeof (Date)) {
      data = new Date(date);
    } else {
      data = date;
    }

    const year = data.getFullYear();
    month = (1 + data.getMonth());
    month = month >= 10 ? month : '0' + month;

    day = data.getDate();
    day = day >= 10 ? day : '0' + day;
    return `${year}-${month}-${day}`;
  }

  getFormatMonth(date: any): string {
    let month: string | number;
    let day: string | number;
    let data: Date;
    if (typeof (date) !== typeof (Date)) {
      data = new Date(date);
    } else {
      data = date;
    }

    const year = data.getFullYear();
    month = (1 + data.getMonth());
    month = month >= 10 ? month : '0' + month;

    day = data.getDate();
    day = day >= 10 ? day : '0' + day;
    return `${year}-${month}`;
  }

  notify_success(msg: string): void {
    notify({message: msg, width: 300, shading: false}, 'success', 2000);
    // notify(msg, 'success', 600);
  }

  notify_error(msg: string): void {
    notify({message: msg, width: 300, shading: true}, 'error', 2000);
  }

  useLocale(_locale: string): void {
    this.timeService.use(_locale);
  }

  getCurrLocale(): string {
    return this.timeService.currLocale();
  }

  getTimeZoneNames(): string[] {
    return this.timeService.getTimeZoneNames();
  }

  getBrowserTimeZone(): string {
    return this.timeService.getBrowserTimeZone();
  }

  convertUTCDateTime(date: any): Date {
    return new Date(date * 1000);
  }

  // ?????? ?????????????????? ????????? ???????????? ?????? ????????? ??????
  /////////////////////////////////////////////////////////////////////////////
  // let state = this.dataGrid.instance.state();
  // localStorage.setItem("dataGridState", JSON.stringify(state));
  // sendStorageRequest = (storageKey, dataType, method, data) => {
  //   const url = 'https://url/to/your/storage/' + JSON.stringify(storageKey);
  //   const req: HttpRequest<any> = new HttpRequest(method, url, {
  //     headers: new HttpHeaders({
  //       'Accept': 'text/html',
  //       'Content-Type': 'text/html'
  //     }),
  //     responseType: dataType
  //   });
  //
  //   if (data) {
  //     req.body = JSON.stringify(data);
  //   }
  //   return this.httpClient.request(req)
  //     .toPromise();
  // }
  //
  // loadState = () => {
  //   return this.sendStorageRequest("storageKey", "json", "Get");
  // }
  //
  // saveState = (state) => {
  //   this.sendStorageRequest("storageKey", "text", "Put", state);
  // }
  // getGridConfig(gridName: string): any {
  //   const baseUrl = `this.httpUrl/grid/${gridName}`;
  //   return this.http.get(baseUrl);
  // }
  /////////////////////////////////////////////////////////////////////////////
  getNowUtc(): Moment {
    return this.timeService.getNowUtc();
  }

  getNow(): Moment {
    return this.timeService.getNow();
  }

  /**
   *   ????????? ????????? ?????? ?????? ?????? ??????
   */
  getMenuListForUser(userId: number, tenant: string, lang: string): Observable<ApiResult<MenuVO[]>> {
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/findMenuList?userId=${userId}&tenant=${tenant}&locale=${lang}`;
    return this.http.get<ApiResult<MenuVO[]>>(baseUrl);
  }


  /**
   *   ????????? ?????? ?????? ?????????
   */
  getMessages(vTenant: string): Observable<ApiResult<MessageVO[]>> {
    // const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/mfmessage/findMessage`;
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/user/findMessage`;

    const data = Object.assign(
      {tenant: vTenant},
    );

    return this.http.post<ApiResult<MessageVO[]>>(baseUrl, data);
  }

  /**
   *  ????????? ?????? ?????????
   */
  async initMessages(): Promise<void> {
    const dic = {};
    const lang = this.getLanguage();

    locale(lang); // ?????? ??????

    const dictionary = this.dictionary;
    if (dictionary && dictionary[locale()]) { // ????????? ?????????
      loadMessages(dictionary); // ????????? ??????
      return;
    }

    // ????????? ?????? ??????
    await this.getMessages(this.getTenant()).subscribe(result => {
      dic[lang] = {};

      for (const obj of result.data) {
        dic[lang][obj.messageKey] = obj[lang];
      }
      loadMessages(dic);
      this.dictionary = dic;
    });
  }

  /**
   *  ????????? ??????
   */
  async saveMessage(data: {}): Promise<void> {
    const saveUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/mfmessage/saveMessage`;
    try {
      await this.http.post<ApiResult<MessageVO>>(saveUrl, data).toPromise();
    } catch (e) {
    }
  }

  /**
   * ????????? ??? -> ????????? ??????
   * @param key     - ????????? ???
   * @param values  - ????????? ???????????? ?????? ????????? ????????? ???????????? ?????? ?????? ????????? ????????? ???????????? ??????
   *                - {0} ??? {1} ??? {2}
   */
  convert(key: string, ...values: Array<string>): string {
    return formatMessage(key, ...values);
  }

  /**
   * ????????? ??? -> ????????? ??????(??????????????? ???????????? ?????? ?????? INSERT)
   * @param key     - ????????? ???
   * @param ko      - ?????????
   * @param en      - ??????(OPTIONAL)
   */
  convert1(key: string, ko: string, en?: string): string {
    const dictionary = this.dictionary;
    if (ko && dictionary && dictionary[locale()] && !dictionary[locale()][key]) { // ????????? ?????????
      // ????????? ???????????? ?????? ??? ??????
      const data = {
        tenant: this.getTenant(),
        operType: 'insert',
        messageKey: key,              // ???????????????
        ko,                           // ?????????
        en: (en || ko),              // ??????
        cn: ko,                       // ?????????
        jp: ko,                       // ?????????
        remarks: 'Common Util Insert' // ??????
      } as MessageVO;
      this.dictionary = null;
      this.saveMessage([data]);
      this.initMessages();
    }
    return formatMessage(key);
  }

  /**
   *   ????????? ??????
   */
  setPagePath(path: string, parentPath: string): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_PAGE_PATH);
    localStorage.setItem(APPCONSTANTS.TEXT_PAGE_PATH, `${parentPath}${APPCONSTANTS.TEXT_PATH_SEPARATOR}${path}`);
  }

  getPagePath(): string {
    return localStorage.getItem(APPCONSTANTS.TEXT_PAGE_PATH);
  }

  setSystemType(systemType: string): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_SYSTEM_TYPE);
    localStorage.setItem(APPCONSTANTS.TEXT_SYSTEM_TYPE, systemType);
  }

  getSystemType(): string {
    return localStorage.getItem(APPCONSTANTS.TEXT_SYSTEM_TYPE) || APPCONSTANTS.DEFAULT_SYSTEMT_TYPE;
  }

  setUserType(userType: string): void {
    localStorage.removeItem(APPCONSTANTS.USER_TYPE);
    localStorage.setItem(APPCONSTANTS.USER_TYPE, userType);
  }

  getUserType(): string {
    return localStorage.getItem(APPCONSTANTS.USER_TYPE) || '';
  }

  /**
   *   ??? ????????????
   */
   getFoldable(form, btn): void {
    // ??????????????? 3??? ???????????? foldable-btn ?????? ?????????, .dx-form??? ?????? 56px
    // ??????????????? 3??? ???????????? foldable-btn ?????? ?????????, .dx-form??? ?????? 78px
    // ??????????????? 2??? ????????? foldable-btn ?????? ????????????
    // ??????  css ??? ???????????? ??????, ?????? ???????????? .dx-state-opened,  .dx.state-closed ?????? ??????

    btn.instance.option({
       icon: 'chevrondown',
       text: '?????????'
    });

    // form[customHeight] = form.instance.element().clientHeight;
    const customOrHeight = 'customOriginHeight';
    const customCmHeight = 'customCommonHeight';
    const formItem = form.items[0];
    const formColSpan = formItem.colSpan;
    const itemDataList = formItem.items.filter(el => el.visible !== false);
    let formItemsColSpan = 0;

    itemDataList.forEach(el => formItemsColSpan += (!el.colSpan ? 1 : el.colSpan));

    const formCnt = Math.ceil(formItemsColSpan / formColSpan);
    const rowHeight = 43;
    form[customCmHeight] = 86;

    if (formCnt > 2) {
      form.height = form[customCmHeight];
      form[customOrHeight] = rowHeight * formCnt;
      btn.visible = true;
    } else {
      btn.visible = false;
    }
  }

  /**
   *   ??? ?????????
   */
  onFoldable(form, btn): void {
    form.height = form.customCommonHeight === form.height ? form.customOriginHeight : form.customCommonHeight;
    const icon = form.customCommonHeight === form.height ? 'chevrondown' : 'chevronup';
    const text = form.customCommonHeight === form.height ? '?????????' : '??????';
    btn.instance.option({icon, text});
  }

  getGridHeight(grid, extraHeight?): void {
    // const documentHeight = document.documentElement.offsetHeight;
    // const contentHeight = document.getElementsByClassName('content')[0].clientHeight;

    // offsetTop: 159
    const documentHeight = document.documentElement.clientHeight;
    const gridTop = grid.element.nativeElement.offsetTop;

    // console.log(grid);
    //
    // console.log(gridTop);
    // console.log(documentHeight - gridTop - 213);  // 765 - 213

    // const pagerElement = document.getElementsByClassName('dx-widget dx-datagrid-pager dx-pager');


    // console.log(pagerElement[pagerElement.length - 1].clientHeight);
    const margin = -120;
    // grid.height = documentHeight - gridTop - 213;
    grid.height = documentHeight - gridTop + margin - (extraHeight || 0);

    // console.log(grid.height);

    const layoutHeaderHeight = document.getElementsByClassName('layout-header')[0].clientHeight;
    const contentsHeaderHeight = document.getElementsByClassName('contents-header')[0].clientHeight;
    const searchBoxHeight = document.getElementsByClassName('search-box')[0].clientHeight;
    const padding = 30;
    // console.log(documentHeight, layoutHeaderHeight, contentsHeaderHeight, searchBoxHeight, padding);
    // console.log(documentHeight - layoutHeaderHeight - contentsHeaderHeight - searchBoxHeight - padding);
    // console.log(documentHeight - layoutHeaderHeight - contentsHeaderHeight - searchBoxHeight - 34);
    // grid.height = documentHeight - layoutHeaderHeight - contentsHeaderHeight - searchBoxHeight - 34;
  }


  getPopupGridHeight(grid, popup, extraHeight?): void {
    const popupTop = popup.element.nativeElement.offsetTop;
    const gridTop = grid.element.nativeElement.offsetTop;

    grid.height = popupTop - gridTop - 190 + (extraHeight || 0);
  }


  getCalcGridHeight(grid): number {

    const documentHeight = document.documentElement.clientHeight;
    const gridTop = grid.element.nativeElement.offsetTop;

    return documentHeight - gridTop - 213;

  }


  /**
   *  ?????? ??????VO SETTER
   */
  setCommonWarehouseVO(warehouseVO: any): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_WAREHOUSE_VO);
    localStorage.setItem(APPCONSTANTS.TEXT_WAREHOUSE_VO, JSON.stringify(warehouseVO));
    // this.warehouseVO = warehouseVO;
  }

  /**
   *  ?????? ??????VO GETTER
   */
  getCommonWarehouseVO(): any {
    return JSON.parse(localStorage.getItem(APPCONSTANTS.TEXT_WAREHOUSE_VO));
  }

  /**
   *  ?????? ???????????? SETTER
   */
  setCommonWarehouseId(warehouseId: number): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_WAREHOUSE_ID);
    localStorage.setItem(APPCONSTANTS.TEXT_WAREHOUSE_ID, String(warehouseId));
  }

  /**
   *  ?????? ???????????? GETTER
   */
  getCommonWarehouseId(): number {
    return Number(localStorage.getItem(APPCONSTANTS.TEXT_WAREHOUSE_ID));
  }

  /**
   *  ?????? ?????? SETTER
   */
  setCommonOwnerId(ownerId: number): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_OWNER_ID);
    localStorage.setItem(APPCONSTANTS.TEXT_OWNER_ID, String(ownerId));
  }

  /**
   *  ?????? ?????? GETTER
   */
  getCommonOwnerId(): number {
    return Number(localStorage.getItem(APPCONSTANTS.TEXT_OWNER_ID));
  }

  /**
   *  ?????? ??????????????? SETTER
   */
  setCommonItemAdminId(itemAdminId: number): void {
    localStorage.removeItem(APPCONSTANTS.TEXT_ITEMADMIN_ID);
    localStorage.setItem(APPCONSTANTS.TEXT_ITEMADMIN_ID, String(itemAdminId));
  }

  /**
   *  ?????? ?????? GETTER
   */
  getCommonItemAdminId(): number {
    return Number(localStorage.getItem(APPCONSTANTS.TEXT_ITEMADMIN_ID));
  }

  /**
   *   ??????
   */
  setUtSetting(data: any): void {
    localStorage.removeItem(APPCONSTANTS.APPLIED_UTSETTING);
    localStorage.setItem(APPCONSTANTS.APPLIED_UTSETTING, JSON.stringify(data));
  }

  getUtSetting(): any {
    let appliedUtSetting = JSON.parse(localStorage.getItem(APPCONSTANTS.APPLIED_UTSETTING));

    if (!appliedUtSetting) {

      appliedUtSetting = {
        theme: APPCONSTANTS.DEFAULT_THEME,
        font: APPCONSTANTS.DEFAULT_FONT,
        fontsize: APPCONSTANTS.DEFAULT_FONTSIZE
      };
    }
    return appliedUtSetting;
  }

  /**
   * ???????????? ?????? ?????????
   * @param accordion ???????????? ???????????? DxAccordionComponent
   */
  fnAccordionExpandAll(accordion: any): void {
    // const animationDuration = accordion.animationDuration;
    // accordion.animationDuration = 0;
    accordion.selectedItems = accordion.items;
    // accordion.animationDuration = animationDuration;
  }

  /**
   * ?????? ?????? ??????
   */
  getDateRange(): any {
    const today = new Date();

    let fromDate = '';
    let toDate = '';

    const date1 = today;
    const date2 = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + this.dateRange));

    if (date1 > date2) {
      fromDate = this.formatDate(date2);
      toDate = this.formatDate(date1);
    } else {
      fromDate = this.formatDate(date1);
      toDate = this.formatDate(date2);
    }

    return {fromDate, toDate};
  }

  /**
   * ?????? -> ??????????????? ??????[yyyy-MM-dd]
   */
  formatDate(date): string {
    const seperator = '-';
    const yyyy = date.getFullYear();
    const MM = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return yyyy + seperator + MM + seperator + dd;
  }

  /**
   * ????????? ??????
   */
  async confirm(msg): Promise<boolean> {
    const dialogOptions = {
      title: this.convert('com.confirm.title'),
      messageHtml: `<div style="height: 120px; width: 300px; font-size: 15px; text-align: center; position: relative; top: 10px;">${msg}</div>`,
      buttons: [
        {
          text: this.convert('com.confirm.yes.text'), onClick: () => {
            return true;
          },
          focusStateEnabled: false
        },
        {
          text: this.convert('com.confirm.no.text'), onClick: () => {
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

  // ??????????????????????????????
  async downloadSerialExcel(): Promise<void> {
    // ?????? Api ??????
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcv/downloadSerialExcel`;

    try {

      const a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(baseUrl);
      a.href = baseUrl;
      // a.download = `${excelHandler.excelFileName}.XLSX`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);

      // const result = await this.http.get<any>(baseUrl).toPromise();
      // return result;
    } catch (e) {
      // console.log(e);
      // return {
      //   success: false,
      //   data: null,
      //   code: '-999',
      //   msg: 'Post service api error!'
      // };
    }
  }

  // ???????????? ????????????
  async download(): Promise<void> {
    // ?????? Api ??????

    const fileName = localStorage.getItem('wmUploadFileNm');
    if (!fileName) {
      return;
    }
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcv/downloadFile?fileName=${fileName}`;

    try {

      const a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(baseUrl);
      a.href = baseUrl;
      // a.download = `${excelHandler.excelFileName}.XLSX`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // const result = await this.http.get<any>(baseUrl).toPromise();
      // return result;
    } catch (e) {
      // console.log(e);
      // return {
      //   success: false,
      //   data: null,
      //   code: '-999',
      //   msg: 'Post service api error!'
      // };
    }
  }

  async delete(): Promise<void> {
    // ?????? Api ??????

    const fileName = localStorage.getItem('wmUploadFileNm');
    if (!fileName) {
      return;
    }
    const baseUrl = `${APPCONSTANTS.BASE_URL_WM}/receive-service/rcv/rcv/deleteFile?fileName=${fileName}`;

    const result = this.http.get(baseUrl).toPromise();
    console.log(result);
  }

  /**
   * Ubi Report ??????
   * reportFile : ?????? Report File ??? (????????? *.jrf, *.jef)
   *  ex) reportFile = 'file=Test.jrf'
   * reportOption : reportFile DataSet Parameter
   *  ex) reportOption = [
   *       {
   *         dataSet : 'ApiDataSet',
   *         node : '',
   *         path : '/master-service/menu/findMenuListPost',
   *         apiParam : {
   *           userId : '101',
   *           tenant : '1000',
   *           locale : 'ko'
   *         }
   *       },
   *       {
   *         dataSet : 'ApiDataSetData',
   *         node : 'data',
   *         path : '/master-service/menu/findMenuListPost',
   *         apiParam : {
   *           userId : '101',
   *           tenant : '1000',
   *           locale : 'ko',
   *           items  : 'AC1023'
   *         }
   *       }
   *     ];
   */
  async openViewReport(reportFile, reportOption, multiple = false, left = 0, system = 'WM'): Promise<void> {
    const reportUrl = `${APPCONSTANTS.BASE_URL_RP}` + '/ubi4/ubihtml_jsondata.jsp';
    // ????????? port ?????? Report ?????? Api Gateway ??? Authorize ?????? ??? ???????????? ???
    // const apiUrl = 'http://www.concplay.co.kr:10001';
    const apiUrl = `${APPCONSTANTS.BASE_URL_WM}`;

    let argUrl = '';
    reportOption.forEach(el => {
      argUrl += '^' + el.dataSet;
      argUrl += '^node=' + el.node;
      argUrl += '&url=' + apiUrl + el.path + '?';

      // array = ['aaa', 'bbb', 'ccc'];
      // http://server/context?array=aaa&array=bbb&array=ccc&otherparameter=x
      forEach(el.apiParam, (value, key) => {
        if (value instanceof Array) {
          value.forEach(val => {
            argUrl += key + '=' + val + '|';
          });
        } else {
          argUrl += key + '=' + value + '|';
        }
      });
    });

    /*
     URL Encoding ???????????? ??????
     ^  %5E
     #  %23
     |  %7C
     &	%26
    */
    const arg = encodeURI('arg=' + argUrl).split('%5E').join('%23').split('%7C').join('%5E').split('&').join('%26');
    console.log(arg);
    // http://www.concplay.co.kr:9080/ubi4/ubihtml_jsondata.jsp?
    // file=Test.jrf
    // tslint:disable-next-line:max-line-length
    // &arg=%23ApiDataSet%23node=%26url=http://www.concplay.co.kr:9999/master-service/menu/findMenuListPost?userId=101%5Etenant=1000%5Elocale=ko%5E%23ApiDataSetData%23node=data%26url=http://www.concplay.co.kr:9999/master-service/menu/findMenuListPost?userId=101%5Etenant=1000%5Elocale=ko%5E
    if (multiple) {
      window.open(reportUrl + '?' + reportFile + '&' + arg, '', 'height=' + window.screen.height + 'vh,width=' + 1024 + ',left=' + left + ',fullscreen=yes'+ ', true');
    } else {
      window.open(reportUrl + '?' + reportFile + '&' + arg, 'reportViewer', 'height=' + window.screen.height + 'vh,width=' + 1024 + 'fullscreen=yes'+ ', true');
    }
  }

  getUserGroup(): string {
    const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));
    return data.userGroup;
  }

  getCompanyId(): string {
    const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));
    return data.companyId;
  }

  getCompany(): string {
    const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));
    return data.company;
  }

  /////////////////////////////////////////////////////////////

  // convertDataList(cvDataList): any {
  //   const dataObj: any = {};
  //
  //   cvDataList.formList.forEach(cvObj => {
  //     const dataOptList = [];
  //
  //     for (const cvObjKey of Object.keys(cvObj)) {
  //       const cvDataObjList = cvObj[cvObjKey];
  //
  //       cvDataObjList.forEach(cvDataObj => {
  //         const dataOpt: any = {};
  //
  //         for (const cvDataObjKey of Object.keys(cvDataObj)) {
  //
  //           if (cvDataObjKey === 'dataField') {
  //             dataOpt.dataField = cvDataObj.dataField;
  //           } else if (cvDataObjKey === 'text') {
  //             dataOpt.text = this[cvDataList.convertType](cvDataList.convertPrefix + cvDataObj.dataField, cvDataObj.cvLang);
  //           }
  //         }
  //         dataOptList.push(dataOpt);
  //       });
  //       dataObj[cvObjKey] = dataOptList;
  //     }
  //   });
  //   console.log(dataObj);
  //   return dataObj;
  // }

  /**
   *   ?????? ??????
   */
  onReset(form): void {
    form.instance.resetValues();
  }

  /**
   *   ????????? ??????
   */
  setPageInfo(data: {path: string, pathName: string, title: string, menuL2Id: number}): void {
    localStorage.removeItem(APPCONSTANTS.PAGE_INFO);
    localStorage.setItem(APPCONSTANTS.PAGE_INFO, JSON.stringify(data));
  }

  getPageInfo(): any {
    return JSON.parse(localStorage.getItem(APPCONSTANTS.PAGE_INFO));
  }

  /**
   *   POST ??????
   */
  async sendPost(data: any, url?: string): Promise<ApiResult<any>> {

    try {
      return await this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return COMMONINITDATA.DEFAULT_POST_API_ERROR;
    }
  }

  /**
   *   ?????? ???????????? ??????
   */
  onBookmarkToggle(btn): void {
    const icon = btn.instance.option('icon');

    if ( icon === 'star'){

      this.saveBookMark({
        tenant: this.getTenant(),
        userId: this.getUserUid(),
        menuL2Id: this.getPageInfo().menuL2Id
      }).then(r => {
        btn.instance.option('icon', 'star-active');
        this.behaviorService.changedBookMark(btn);
      });
    } else{

      this.deleteBookMark({
        tenant: this.getTenant(),
        userId: this.getUserUid(),
        menuL2Id: this.getPageInfo().menuL2Id
      }).then(r => {
        btn.instance.option('icon', 'star');
        this.behaviorService.changedBookMark(btn);
      });
    }
  }

  /**
   *   ???????????? ??????
   */
  async saveBookMark(data: {}): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/saveMyMenu`;
    return await this.sendPost(data, url);
  }

  async saveBookMarkSort(data: any): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/saveMyMenuSort`;
    return await this.sendPost(data, url);
  }

  async deleteBookMark(data: {}): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/deleteMyMenu`;
    return await this.sendPost(data, url);
  }

  async getBookMark(data: {}): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/findMyMenu`;
    return await this.sendPost(data, url);
  }

  async getShowBookMark(data: {}, btn): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/bookMarkLookup`;
    const result =  await this.sendPost(data, url);
    btn.instance.option('icon', result.data ? 'star-active' : 'star');
    return result;
  }

  /**
   *  ????????? ????????? ??????
   */
  setGridDataSource(data: any[], key: string): any {
    return new DataSource({
      store: new ArrayStore({data, key})
    });
  }

  resultMsgCallback(result, txt?): boolean {

    if (!txt) {
      result.success === true ? this.notify_success(result.msg) : this.notify_error(result.msg);
      return result.success;
    } else {
      const resultMsgData = COMMONINITDATA.COMMON_RESPONSE_DATA[result.success === true ? 'success' : 'fail'];

      if (result.success === true) {
        this.notify_success(this.convert(resultMsgData.msg, txt));
      } else {

        if (result.code === resultMsgData.code) {
          this.notify_error(this.convert(resultMsgData.msg, txt));
        } else {
          this.notify_error(result.msg);
        }
      }
      return result.success;
    }
  }

  checkValueConversion(checkValue): any {

    if (typeof(checkValue) === 'boolean') {
      return checkValue ? 'Y' : 'N';
    } else if (typeof(checkValue) === 'string') {
      return checkValue === 'Y' ? true : false;
    }
  }

  customList(type: string): any {
    const obj: any = new Object();
    obj.visibleList = [];
    obj.dataList = [];
    obj.type = type;
    obj.selectedInx = -1;
    return obj;
  }

  getDataField(data, list: string[]): string[] {

    for (const item of data) {

      if (Boolean(item.items)) {
        this.getDataField(item.items, list);
      } else {

        for (const key of Object.keys(item)) {

          if (key === 'dataField') {
            list.push(item[key]);
          }
        }
      }
    }
    return list;
  }

  getValidationDataField(data, list: string[]): string[] {

    for (const item of data) {

      if (Boolean(item.items)) {
        this.getValidationDataField(item.items, list);
      } else {

        for (const key of Object.keys(item)) {

          if (key === 'dataField') {

            if (Boolean(item.validationRules)) {
              list.push(item[key]);
            }
          }
        }
      }
    }
    return list;
  }

  getPhoneEditorOptions(): {} {

    return {
      mask: COMMONINITDATA.DEFAULT_PHONE_MASK,
      maskInvalidMessage: this.convert('com.valid.maskInvalid', this.convert1('com.text.phone', '???????????????')),
      onValueChanged: (e) => {

        if (!e.value) {
          e.component.option('mask', COMMONINITDATA.DEFAULT_PHONE_MASK);
        } else {
          e.component.option('mask', this.getPhoneMask(e.value));
        }
      }
    };
  }

  getPhoneMask(phoneNumber): string {
    let mask: string;

    if (phoneNumber.length === 10) {
      mask = '000) 000-0000';
    } else if (phoneNumber.length === 11) {
      mask = '000) 0000-0000';
    } else {
      mask = COMMONINITDATA.DEFAULT_PHONE_MASK;
    }
    return mask;
  }

  getTelEditorOptions(): {} {

    return {
      mask: COMMONINITDATA.DEFAULT_TEL_MASK,
      maskInvalidMessage: this.convert('com.valid.maskInvalid', this.convert1('com.text.tel', '????????????')),
      onValueChanged: (e) => {

        if (!e.value) {
          e.component.option('mask', COMMONINITDATA.DEFAULT_TEL_MASK);
        } else {
          e.component.option('mask', this.getTelMask(e.value));
        }
      }
    };
  }

  getTelMask(telNumber): string {
    const check =  telNumber.substr(0, 2) === '02' ? true : false;
    let mask: string;

    if (check) {

      if (telNumber.length === 9) {
        mask = '00) 000-0000';
      } else if (telNumber.length === 10) {
        mask = '00) 0000-0000';
      } else {
        mask = COMMONINITDATA.DEFAULT_TEL_MASK;
      }
    } else {

      if (telNumber.length === 10) {
        mask = '000) 000-0000';
      } else if (telNumber.length === 11) {
        mask = '000) 0000-0000';
      } else {
        mask = COMMONINITDATA.DEFAULT_TEL_MASK;
      }
    }
    return mask;
  }

  getCardMask(cardNumber): string {
    const card1 = String(cardNumber.slice(0, 4));
    const mask_value = String(cardNumber.slice(4, 12));
    const card2 = String(cardNumber.slice(12, 16));
    let mask = '';

    for (let i = 0; i < mask_value.length; i++) {
      mask += '*';
    }
    return String(card1) + String(mask) + String(card2);
  }

  async initNamedPlace(): Promise<void> {
    console.log('aaaaa');
    this.codeService.getCode(this.getTenant(), 'AREA').subscribe(result => {
      console.log(result);
    });
  }

  getTotalDistance(totalDistance): number {
    return Number((totalDistance / 1000).toFixed(1));
  }

  getTotalTime(totalTime): number {
    return Number((totalTime / 60).toFixed(0));
  }

  getTranChargeAmt(tranData, tranChargeData, tDistance, tTime): number {

    return Math.round((
      (Number(tranChargeData.unitAmt) * Number(tTime)) + (tDistance / Number(tranChargeData.mileageAvg) * tranData.oilPrice)
    ) / 1000)  * 1000;
  }

  commonPopupOpen(popup): void {
    popup.visible = true;
  }

  commonPopupClose(popup): void {
    popup.visible = false;
  }

  commonInitData(popup): void {
    popup.visible = true;
  }

  setNumberComma(num): string {
    return !num ? '0' : num.toLocaleString();
  }

  async collectGridData(changes: any, addData?: {}): Promise<any[]> {
    const gridList = [];

    for (const rowIndex in changes) {
      // Insert??? ?????? UUID??? ????????? ?????? ????????? Null??? ????????????.
      if (changes[rowIndex].type === 'insert') {
        gridList.push(Object.assign({
          operType: changes[rowIndex].type,
          uid: null,
          tenant: this.getTenant()
        }, changes[rowIndex].data, addData));
      } else if (changes[rowIndex].type === 'remove') {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data, addData
          )
        );
      } else {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data, addData
          )
        );
      }
    }
    return gridList;
  }

  setSelectBoxEditorOptions(data: any): any {
    return data;
  }

  async initConvertAuto(convertList, convertOptions): Promise<void> {

    this.concatDataListFn(convertList).then(async rtDataList => {

      await this.convertAuto(
        rtDataList
          .filter((data, idx, arr) => {
            return arr.findIndex((item) => item.convertKey === data.convertKey) === idx; })
          .map(el => {
            return {convertKey: el.convertKey, text: el.text};
          }) ,
        convertOptions
      );
    });
  }

  async concatDataListFn(concatDataList: any[]): Promise<any[]> {
    const rtDataList = [];

    concatDataList.forEach(el => {
      rtDataList.push(...el);
    });
    return rtDataList;
  }

  async convertAuto(cvDataList, convertOptions): Promise<void> {
    const dictionary = this.dictionary;

    if (dictionary && dictionary[locale()]) {
      const cvSaveDataList = [];

      cvDataList.forEach(el => {
        const key = convertOptions.convertPrefix + el.convertKey;

        if (!dictionary[locale()][key]) {
          cvSaveDataList.push(
            {
              tenant: this.getTenant(),
              operType: 'insert',
              messageKey: key,
              ko: el.text.ko,
              en: (el.text.en || el.text.ko),
              cn: (el.text.cn || el.text.ko),
              jp: (el.text.jp || el.text.ko),
              remarks: 'Common Util Insert'
            }
          );
        }
      });

      if (cvSaveDataList.length > 0) {
        this.dictionary = null;

        await this.saveAllMessage(cvSaveDataList).then(messageList => {
          const dic = {};
          const lang = locale();

          messageList.data.forEach(messageData => {
            dic[lang] = {};
            dic[lang][messageData.messageKey] = messageData[lang];
          });
          loadMessages(dic);
          this.dictionary = dic;
        });
      }
    }
  }

  async saveAllMessage(data: {}): Promise<any> {
    const saveUrl = `${APPCONSTANTS.BASE_URL_WM}/master-service/mfmessage/saveAllMessage`;

    try {
      return await this.http.post<ApiResult<MessageVO>>(saveUrl, data).toPromise();
    } catch (e) {
    }
  }

  async getMenuForUserType(data: {}): Promise<any> {
    const url = `${APPCONSTANTS.BASE_URL_WM}/master-service/menu/findMenuUserType`;

    try {
      return await this.http.post<ApiResult<any>>(url, data).toPromise();
    } catch (e) {
      return {
        success: false,
        data: null,
        code: '-999',
        msg: 'Post service api error!'
      };
    }
  }

  async formCompOptList(formItems, formOptData): Promise<any> {
    const cvPrefix = formOptData.convertPrefix;
    const newOptList: any = [];

    formItems.forEach(formItem => {
      const newData: any = {};

      for (const formItemKey of Object.keys(formItem)) {

        if (formItemKey === 'convertKey') {
          newData.dataField = formItem[formItemKey];
          newData.label = {text: formatMessage(cvPrefix + formItem.convertKey)};
        }
      }
      newOptList.push(newData);
    });
    return newOptList;
  }

  async formCompOptSet(formCompArr, formOptList, formData): Promise<void> {

    formCompArr.forEach(formComp => {
      const id = formComp.instance.element().id;
      formComp.instance.formData = formData;
      formComp.formData = formData;

      if (formOptList[id]) {
        formComp.items = formOptList[id].opt;
      }
    });
  }

  async btnCompOptSet(btnCompArr, btnOptList): Promise<void> {

    btnCompArr.forEach(btnComp => {
      const id = btnComp.instance.element().id;

      if (btnOptList[id]) {
        const assignOpt = Object.assign({}, COMMONINITDATA.DEFAULT_FORM_OPT, btnOptList[id].opt);

        btnComp.instance.option(assignOpt);
        btnComp.instance.focusStateEnabled = false;

        if (btnOptList[id].clk) {
          btnComp.instance.on('click', btnOptList[id].clk);
        }
      }
    });
  }

  async setComponentOptions(component: any, options: any): Promise<void> {
    const compType = component.instance.NAME;
    Object.assign(component, COMMONINITDATA.DEFAULT_COMPOPTS[compType], options);
  }

  /**
   *  ????????? ?????? ?????? ??????
   */
  async getSelectedIndex(arr: any[]): Promise<number> {
    return arr.findIndex(el => el.selected === true);
  }
}

export interface MenuVO {
  tenant: string;
  uid: number;
  l1path: string;
  l2path: string;
  l1text: string;
  l2text: string;
  l1icon: string;
  userType: string;
  app: string;
  authSearch: string;
  authUpd: string;
  authDel: string;
  authExec: string;
  authPrint: string;
  l1priorities: number;
  l2priorities: number;
  apppriorities: number;

  menuL2Id: number;
}


export interface MessageVO {
  tenant: string;
  uid: number;
  operType: string;

  messageKey: string;         // ???????????????
  ko: string;                 // ?????????
  en: string;                 // ??????
  cn: string;                 // ?????????
  jp: string;                 // ?????????
  remarks: string;            // ??????
  code: string;

  modifiedBy: string;
  modifiedDatetime: string;
}
