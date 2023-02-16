import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {UserService, UserVO} from './user.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {CookieService} from 'ngx-cookie-service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {Layout8Service} from '../../common/layout8/layout8.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

@ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
@ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

@ViewChild('popup', {static: false}) popup: DxPopupComponent;
@ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
@ViewChild('deleteBtn', {static: false}) deleteBtn: DxButtonComponent;
@ViewChild('resetPwdBtn', {static: false}) resetPwdBtn: DxButtonComponent;


@ViewChild('pwdPopup', {static: false}) pwdPopup: DxPopupComponent;
@ViewChild('pwdPopupForm', {static: false}) pwdPopupForm: DxFormComponent;
@ViewChild('pwdBtn', {static: false}) pwdBtn: DxButtonComponent;

@ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
@ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

@ViewChild('addPopup1', {static: false}) addPopup1: DxPopupComponent;
@ViewChild('addCardBtn', {static: false}) addCardBtn: DxButtonComponent;
@ViewChild('addPopup2', {static: false}) addPopup2: DxPopupComponent;

  //카드 추가 팝업
  cardOptions: any[] =  [{
    ImageSrc: '/assets/images/card1.png',
  }, {
    ImageSrc: '/assets/images/card2.png',
  }, {
    ImageSrc: '/assets/images/card3.png',
  }, {
    ImageSrc: '/assets/images/card4.png',
  }];


  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';

  isNewPopup = true;

  // DataSets
  dsActFlg = [];
  dsCompany = [];
  dsUserGroup = [];
  dsUser = [];
  pwdPopupData = {
    changePassword: ''
  };

  // Grid State
  GRID_STATE_KEY = 'mm_user1';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: UserService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.onSearch = this.onSearch.bind(this);
    this.pwdPopupSaveClick = this.pwdPopupSaveClick.bind(this);
    this.pwdPopupCancelClick = this.pwdPopupCancelClick.bind(this);
    this.resetPassword = this.resetPassword.bind(this);

    this.addPopupClose = this.addPopupClose.bind(this);
    this.addPopupClose2 = this.addPopupClose2.bind(this);
    this.addCard = this.addCard.bind(this);
    this.delCard = this.delCard.bind(this);
    this.addBankTr = this.addBankTr.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    // this.newBtn.visible = this.utilService.isAdminUser();
    this.mainForm.instance.focus();
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();
  }

  initForm(): void {
    this.mainForm.instance.getEditor('companyId').option('value', this.utilService.getCommonOwnerId());
    this.mainForm.instance.getEditor('actFlg').option('value', 'Y');
  }

  initCode(): void {
    // 사용여부
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsActFlg = result.data;
    });

    // 사용자그룹
    this.codeService.getCode(this.G_TENANT, 'USERGROUP').subscribe(result => {
      this.dsUserGroup = result.data;
    });

    // 화주
    this.codeService.getCompany(this.G_TENANT, null, null, null, null, null, null, null).subscribe(result => {
      this.dsCompany = result.data;
    });

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get(this.mainForm.formData);

      if (this.resultMsgCallback(result, 'Search')) {
        this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      } else {
        return;
      }
    }
  }

  resultMsgCallback(result, msg): boolean {
    if (result.success) {
      this.utilService.notify_success(msg + ' success');
    } else {
      this.utilService.notify_error(result.msg);
    }
    return result.success;
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.user.newUser', '차량등록 신규');
    this.popup.visible = true;
    this.onPopupInitData();
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.user.editUser', '차량등록 수정');
    this.popup.visible = true;
    this.onPopupSearch(e.data).then();
  }

  onPopupInitData(): void {
    this.popupForm.formData = Object.assign({tenant: this.G_TENANT, usr: '', name: '', shortName: '', email: ''});
  }

  onPopupAfterOpen(): void {
    // 사용자 계정이 아닌 경우 수정 불가
    this.popupForm.instance.getEditor('companyId').option('disabled', !this.utilService.isAdminUser());

    // 관리자용 비밀번호 초기화
    if (this.utilService.isAdminUser()) {
      this.resetPwdBtn.visible = true;
      this.resetPwdBtn.disabled = false;
    }

  // this.popupForm.instance.getEditor('companyId').option('value', this.utilService.getCommonOwnerId());
    if (this.isNewPopup) {
      this.pwdBtn.disabled = true;
      this.resetPwdBtn.disabled = true;

      this.popupForm.instance.getEditor('usr').focus();
    }
  }

  // 팝업 닫기
  onPopupClose(): void {
    this.popup.visible = false;
  }

  onPopupAfterClose(): void {
    this.popupForm.instance.resetValues();
    this.popupForm.instance.getEditor('usr').option('disabled', false);
    this.pwdBtn.disabled = false;

    // 관리자용 비밀번호 초기화
    if (this.utilService.isAdminUser()) {
      this.resetPwdBtn.visible = true;
      this.resetPwdBtn.disabled = false;
    }
    this.onSearch();
  }

  async onPopupSearch(data): Promise<void> {
    const result = await this.service.getPopup(data);

    if (this.resultMsgCallback(result, 'PopupSearch')) {
      this.popupForm.formData = result.data;
  } else {
    return;
  }
}

  async onPopupSave(): Promise<void> {
    const popData = this.popupForm.instance.validate();

    if (popData.isValid) {
    if (await this.execSave()) {
      this.onPopupClose();
    }
  }
}

  async execSave(): Promise<boolean> {
    try {
      let result;

      if (this.isNewPopup) {
    result = await this.service.save(this.popupForm.formData);
  } else {
    result = await this.service.update(this.popupForm.formData);
  }

  if (this.resultMsgCallback(result, 'Save')) {
    const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

    if (data.user === this.popupForm.formData.usr) {
      data.companyId = this.popupForm.formData.companyId;
      data.userGroup = this.popupForm.formData.userGroup;

      sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
    }
    this.popupForm.formData = result.data;
    return true;
  } else {
    return false;
  }
} catch {
    this.utilService.notify_error('There was an error!');
    return false;
  }
}

  async onPopupDelete(): Promise<void> {

    try {
      const result = await this.service.delete(this.popupForm.formData);

      if (this.resultMsgCallback(result, 'Delete')) {
    this.onPopupClose();
  }
} catch {
    this.utilService.notify_error('There was an error!');
  }
}

  pwdPopupOpenClick(): void {
    this.pwdPopup.visible = true;
  }

  async resetPassword(): Promise<void> {
    // 비밀번호 초기화를 하시겠습니까?
    const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('비밀번호 초기화'));
    if (!await this.utilService.confirm(confirmMsg)) {
    return;
  }

  try {
    const result = await this.service.resetPassword(this.popupForm.formData);

    if (!result.success) {
      this.utilService.notify_error(result.msg);
      return;
    } else {
      this.utilService.notify_success('Save success');
      this.pwdPopupCancelClick();
    }
  } catch {
    this.utilService.notify_error('There was an error!');
  }
}

  async pwdPopupSaveClick(): Promise<void> {
    const pwdPopData = this.pwdPopupForm.instance.validate();
    const saveData = Object.assign(this.popupForm.formData, this.pwdPopupData);

    if (pwdPopData.isValid) {

    try {
      const result = await this.service.updatePwd(saveData);

      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.utilService.notify_success('Save success');
        this.pwdPopupCancelClick();
      }
    } catch {
      this.utilService.notify_error('There was an error!');
    }
  }
}

  pwdPopupCancelClick(): void {
    this.pwdPopup.visible = false;
  }

  pwdPopupAfterClose(): void {
    this.pwdPopupForm.instance.resetValues();
  }

  passwordComparison = () => this.pwdPopupData.changePassword;


  //카드등록, 계좌추가
  addPopupOpen():void {
    this.addPopup1.visible = true;
  }
  addPopupOpen2():void {
    this.addPopup2.visible = true;
  }
  addPopupClose():void {
    this.addPopup1.visible = false;
  }
  addPopupClose2():void {
    this.addPopup2.visible = false;
  }
  addCard():void {
    this.cardOptions.push({
      ImageSrc: '/assets/images/card_default.png',
    });
    this.addPopup1.visible = false;
  }
  delCard(cardNum):void {
    this.cardOptions.splice(cardNum,1);
  }

  trNum = 4;
  addBankTr(): void{

    const table = document.getElementById('bankTable') as HTMLTableElement | null;
    const newRow =  table?.insertRow();
    const newCell1 = newRow.insertCell(0);
    const newCell2 = newRow.insertCell(1);
    const newCell3 = newRow.insertCell(2);

    newRow.id ='tr'+this.trNum;
    newCell1.innerHTML = '<img src="/assets/images/icon_bank_kb.png" alt="kb">';
    newCell2.innerText = '하나 212****5959';
    newCell3.innerHTML = '<dx-button type="form"  icon="trash" (onClick)="delBankTr(#tr'+ this.trNum+')" ></dx-button>'
    this.trNum = this.trNum + 1;

    this.addPopup2.visible = false;
  }
  delBankTr(tr): void{
    document.querySelector('#bankRow').querySelector(tr).remove();
  }
}
