import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxLoadPanelComponent, DxPopupComponent} from 'devextreme-angular';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {UsermanagementService} from '../usermanagement/usermanagement.service';
import {CookieService} from 'ngx-cookie-service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import _ from 'lodash';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {PasswordComponent} from '../../popup/password/password.component';
import {UserbookmarkComponent} from '../../popup/userbookmark/userbookmark.component';
import {CaruserbookmarkComponent} from '../../popup/caruserbookmark/caruserbookmark.component';
import {PrepaidcardComponent} from '../../popup/prepaidcard/prepaidcard.component';
import {CardComponent} from '../../popup/card/card.component';
import {AccountComponent} from '../../popup/account/account.component';
import {VehicleComponent} from '../../popup/vehicle/vehicle.component';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('password', {static: false}) password: PasswordComponent;
  @ViewChild('usbookmark', {static: false}) usbookmark: UserbookmarkComponent;
  @ViewChild('cubookmark', {static: false}) cubookmark: CaruserbookmarkComponent;
  @ViewChild('precard', {static: false}) precard: PrepaidcardComponent;
  @ViewChild('card', {static: false}) card: CardComponent;
  @ViewChild('account', {static: false}) account: AccountComponent;
  @ViewChild('car', {static: false}) car: VehicleComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  @ViewChild('loadPanel', {static: false}) loadPanel: DxLoadPanelComponent;

  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';
  popupKey = 'uid';

  dsYN = [];
  dsUserType = [];
  dsCompany = [];

  dsCarType = [];
  dsCarKind = [];
  dsProcType = [];

  cardList: any[] = [];
  accountList: any[] = [];

  checkValueList = ['permissionYn', 'selfAuthYn', 'smsYn', 'emailYn',
    'appPushYn', 'cardYn', 'billYn', 'preCardYn'];

  phoneEditorOptions = this.utilService.getPhoneEditorOptions();
  telEditorOptions = this.utilService.getTelEditorOptions();

  GRID_STATE_KEY = 'mm_userprofile';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: UsermanagementService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.onSearch().then();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'YN'})).subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'USERTYPE'})).subscribe(result => {
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
  }

  async onSearch(): Promise<void> {
    this.loadPanel.visible = true;
    const data = {tenant: this.G_TENANT, uid: this.utilService.getUserUid()};

    const result = await this.service.sendPost(data, 'findUserFull');
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.checkValueList.forEach(key => {
        result.data[key] = this.utilService.checkValueConversion(result.data[key]);
      });
      this.mainForm.formData = result.data;
      this.cardList = result.data.salesList;
      this.accountList = result.data.carUserBankList;
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data.carList, this.mainKey);
    }
    this.loadPanel.visible = false;
  }

  async onClickSave(): Promise<void> {
    const validData = this.mainForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!validData.isValid) {
      validData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const saveData = _.cloneDeep(this.mainForm.formData);

      saveData.tenant = this.G_TENANT;
      saveData.salesList = this.cardList;
      saveData.carUserBankList = this.accountList;
      saveData.operType = 'update';
      this.checkValueList.forEach(key => {
        saveData[key] = this.utilService.checkValueConversion(saveData[key]);
      });
      const result = await this.service.sendPost(saveData, 'saveUser');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

        if (data.user === this.mainForm.formData.usr) {
          data.companyId = this.mainForm.formData.companyId;
          data.userGroup = this.mainForm.formData.userGroup;

          sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
        }
        console.log(result.data);

        this.checkValueList.forEach(key => {
          result.data[key] = this.utilService.checkValueConversion(result.data[key]);
        });

        this.mainForm.formData = result.data;
      }
    }
  }

  passwordPopupOpen(): void {
    const cloneData = _.cloneDeep(this.mainForm.formData);
    this.password.open(cloneData);
  }

  addressPopupOpen(): void {
    const cloneData = _.cloneDeep(this.mainForm.formData);

    if (cloneData.userType === 'CAROWNER') {
      this.cubookmark.open(cloneData);
    } else {
      this.usbookmark.open(cloneData);
    }
  }

  preCardPopupOpen(): void {
    const cloneData = _.cloneDeep(this.mainForm.formData);
    this.precard.open(cloneData);
  }

  cardPopupOpen(): void {
    const cloneData = _.cloneDeep(this.mainForm.formData);
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

  accountPopupOpen(): void {
    const cloneData = _.cloneDeep(this.mainForm.formData);
    this.account.open(cloneData);
  }

  getAccounts(result): void {

    this.account.search(result).then(rData => {

      if (rData.success) {
        this.accountList = rData.data;
      }
    });
  }

  accountPopupDelete(account, idx): void {

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

  async carPopupOpen(e, car): Promise<void> {
    this.car.open(car.data);
  }

  getVehicle(result): void {

    this.car.searchList(result).then(rData => {

      if (rData.success) {
        this.mainGrid.dataSource = this.utilService.setGridDataSource(rData.data, this.popupKey);
      }
    });
  }
}

