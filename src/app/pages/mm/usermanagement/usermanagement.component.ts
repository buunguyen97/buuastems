import {AfterViewInit, Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CarService} from '../car/car.service';
import {CookieService} from 'ngx-cookie-service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import _ from 'lodash';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {UsermanagementService} from './usermanagement.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {AccountComponent} from '../../popup/account/account.component';
import {CardComponent} from '../../popup/card/card.component';
import {PasswordComponent} from '../../popup/password/password.component';
import {CaruserbookmarkComponent} from '../../popup/caruserbookmark/caruserbookmark.component';
import {UserbookmarkComponent} from '../../popup/userbookmark/userbookmark.component';
import {PrepaidcardComponent} from '../../popup/prepaidcard/prepaidcard.component';
import {VehicleComponent} from '../../popup/vehicle/vehicle.component';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('password', {static: false}) password: PasswordComponent;
  @ViewChild('usbookmark', {static: false}) usbookmark: UserbookmarkComponent;
  @ViewChild('cubookmark', {static: false}) cubookmark: CaruserbookmarkComponent;
  @ViewChild('precard', {static: false}) precard: PrepaidcardComponent;
  @ViewChild('card', {static: false}) card: CardComponent;
  @ViewChild('account', {static: false}) account: AccountComponent;
  @ViewChild('car', {static: false}) car: VehicleComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';
  popupKey = 'uid';

  isNewPopup = true;

  dsYN = [];
  dsUserType = [];
  dsCompany = [];

  dsCarType = [];
  dsCarKind = [];

  dsUserUploadType = [];
  imgUploadList: any[] = [];

  currAddrIdx: number;
  isSelected: string;

  cardList: any[] = [];
  accountList: any[] = [];

  imgName = '';
  currentData = {idx: 0};
  uploadFilePath = COMMONINITDATA.IMAGE_URL;
  checkValueList = ['permissionYn', 'selfAuthYn', 'smsYn', 'emailYn',
                    'appPushYn', 'cardYn', 'billYn', 'preCardYn'];

  phoneEditorOptions = this.utilService.getPhoneEditorOptions();
  telEditorOptions = this.utilService.getTelEditorOptions();

  GRID_STATE_KEY = 'mm_usermanagement';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  // cardList: any[] =  [{
  //   ImageSrc: '/assets/images/card1.png',
  // }, {
  //   ImageSrc: '/assets/images/card2.png',
  // }, {
  //   ImageSrc: '/assets/images/card3.png',
  // }, {
  //   ImageSrc: '/assets/images/card4.png',
  // }];

  constructor(public utilService: CommonUtilService,
              private service: UsermanagementService,
              private carService: CarService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.mainForm.instance.focus();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'YN'})).subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'USERTYPE', etcColumn1: 'ONBOARD'})).subscribe(result => {
      this.dsUserType = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARTYPE'})).subscribe(result => {
      this.dsCarType = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARKIND'})).subscribe(result => {
      this.dsCarKind = result.data;
    });

    this.codeService.getItems(_.cloneDeep(data), 'company').subscribe(result => {
      this.dsCompany = result.data;
    });

    // const dsList = [
    //
    //   { data: Object.assign(commonFormData, {codeCategory: 'YN'}),
    //     target: this.dsYN,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'USERTYPE', etcColumn1: 'ONBOARD'}),
    //     target: this.dsUserType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'CARDTYPE'}),
    //     target: this.dsCardType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'CARTYPE'}),
    //     target: this.dsCarType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'CARKIND'}),
    //     target: this.dsCarKind,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'CARBRAND'}),
    //     target: this.dsCarBrand,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'OILTYPE'}),
    //     target: this.dsOilType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'USERUPLOADTYPE'}),
    //     target: this.dsUserUploadType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'PROCTYPE'}),
    //     target: this.dsProcType,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData, {codeCategory: 'AREA', etcColumn1: '0000000000'}),
    //     target: this.area1Ds,
    //     name: 'code' },
    //   { data: Object.assign(commonFormData),
    //     target: this.dsUser,
    //     name: 'user' },
    //   { data: Object.assign(commonFormData),
    //     target: this.dsCompany,
    //     name: 'company' }
    // ];
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');

    if (data.isValid) {
      /* 조회를 위해 값을 isAdmin 넣음 */
      this.mainForm.formData.isAdmin = 'Y';
      const result = await this.service.sendPost(this.mainForm.formData, 'findUser');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
        await this.mainGrid.instance.deselectAll();
      }
    }
  }

  async updatePermissionYn(e): Promise<void> {
    const executionTxt = this.utilService.convert1('mm.user.permissionYnChk', '관리자인증');
    const selectedRows = this.mainGrid.instance.getSelectedRowsData();

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.sendPost(selectedRows, 'updatePermissionYn');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.onSearch().then();
      }
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.user.newUser', '사용자 신규');
    this.popupForm.instance.resetValues();
    this.popup.visible = true;
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.user.editUser', '사용자 수정');
    this.onSearchPopup(e.data).then();
  }

  onHiddenPopup(e): void {
    this.initPopup();
    this.imgUploadList = _.cloneDeep(this.dsUserUploadType);
    this.onSearch().then();
  }

  initPopup(): void {
    this.popupForm.formData = {};
    this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
    this.cardList = [];
    this.accountList = [];
  }

  async onSearchPopup(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findUserFull');
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.checkValueList.forEach(key => {
        result.data[key] = this.utilService.checkValueConversion(result.data[key]);
      });
      this.popupForm.formData = result.data;
      this.cardList = result.data.salesList;
      this.accountList = result.data.carUserBankList;
      this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data.carList, this.popupKey);
      this.popup.visible = true;
    }
  }

  async onClickPopupSave(): Promise<void> {
    const validData = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!validData.isValid) {
      validData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const saveData = _.cloneDeep(this.popupForm.formData);

      saveData.tenant = this.G_TENANT;
      saveData.salesList = this.cardList;
      saveData.carUserBankList = this.accountList;
      saveData.operType = this.isNewPopup ? 'insert' : 'update';
      this.checkValueList.forEach(key => {
        saveData[key] = this.utilService.checkValueConversion(saveData[key]);
      });
      const result = await this.service.sendPost(saveData, 'saveUser');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

        if (data.user === this.popupForm.formData.usr) {
          data.companyId = this.popupForm.formData.companyId;
          data.userGroup = this.popupForm.formData.userGroup;

          sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
        }
        this.popupForm.formData = result.data;
        this.popup.visible = false;
      }
    }
  }

  async onClickPopupDelete(): Promise<void> {
    const popupFormData = this.popupForm.formData;
    const executionTxt = this.utilService.convert1('com.btn.del', '삭제');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.sendPost(popupFormData, 'deleteUser');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
      }
    }
  }

  onClickPopupCancel(e): void {
    this.popup.visible = false;
  }

  async resetPassword(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.text.password.reset', '비밀번호 초기화');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.sendPost(this.popupForm.formData, 'resetPassword');
      this.utilService.resultMsgCallback(result, executionTxt);
    }
  }

  setChangeMask(e): void {
    const dataField = e.target.id.split('_').pop();

    if (dataField === 'phone' || dataField === 'tel') {
      const popFormIsc = this.popupForm.instance;
      const getId = 'getItemID';
      const elId = popFormIsc[getId](dataField);
      let mask;

      if (elId === e.target.id) {

        if (e.type === 'focusin') {

          mask = dataField === 'phone' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
        } else if (e.type === 'focusout') {
          const value = this.popupForm.formData[dataField];

          if (!value) {
            mask = dataField === 'phone' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
          } else {

            if (dataField === 'phone') {
              mask = this.utilService.getPhoneMask(value);
            } else if (dataField === 'tel') {
              mask = this.utilService.getTelMask(value);
            }
          }
        }
        popFormIsc.getEditor(dataField).option('mask', mask);
      }
    }
  }

  passwordPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);
    this.password.open(cloneData);
  }

  addressPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);

    if (cloneData.userType === 'CAROWNER') {
      this.cubookmark.open(cloneData);
    } else {
      this.usbookmark.open(cloneData);
    }
  }

  preCardPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);
    this.precard.open(cloneData);
  }

  cardPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);
    cloneData.isNew = this.isNewPopup;
    this.card.open(cloneData);
  }

  getCards(result): void {

    if (result.isNew) {
      this.cardList.push(result);
    } else {

      this.card.search(result).then(rData => {

        if (rData.success) {
          this.cardList = rData.data;
        }
      });
    }
  }

  cardPopupDelete(card, idx): void {

    if (this.isNewPopup) {
      card.operType = 'remove';
      this.cardList.splice(idx, 1);
    } else {

      this.card.delete(card).then(result => {

        if (result.success) {

          this.card.search(card).then(rData => {

            if (rData.success) {
              this.cardList = rData.data;
            }
          });
        }
      });
    }
  }

  accountPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);
    cloneData.isNew = this.isNewPopup;
    this.account.open(cloneData);
  }

  getAccounts(result): void {

    if (result.isNew) {
      this.accountList.push(result);
    } else {

      this.account.search(result).then(rData => {

        if (rData.success) {
          this.accountList = rData.data;
        }
      });
    }
  }

  accountPopupDelete(account, idx): void {

    if (this.isNewPopup) {
      account.operType = 'remove';
      this.accountList.splice(idx, 1);
    } else {

      this.account.delete(account).then(result => {

        if (result.success) {

          this.account.search(account).then(rData => {

            if (rData.success) {
              this.accountList = rData.data;
            }
          });
        }
      });
    }
  }

  async carPopupOpen(e, car): Promise<void> {
    this.car.open(car.data);
  }

  getVehicle(result): void {
    result.userId = this.popupForm.formData.uid;
    const data = {tenant: result.tenant, userId: result.userId};

    this.car.searchList(data).then(rData => {

      if (rData.success) {
        console.log(rData.data);
        rData.data.uid = null;
        this.popupGrid.dataSource = this.utilService.setGridDataSource(rData.data, this.popupKey);
      }
    });
  }
}
