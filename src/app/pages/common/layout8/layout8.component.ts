import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {Layout8Service, UserVO} from './layout8.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {CookieService} from 'ngx-cookie-service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';


@Component({
  selector: 'app-layout8',
  templateUrl: './layout8.component.html',
  styleUrls: ['./layout8.component.scss']
})
export class Layout8Component implements OnInit {

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('newBtn', {static: false}) newBtn: DxButtonComponent;
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


  // Global
  G_TENANT: any;
  pageInfo: any = this.utilService.getPageInfo();

  // ***** main ***** //
  // Form
  mainFormData = {};

  // Grid
  mainGridDataSource: DataSource;
  mainEntityStore: ArrayStore;
  key = 'uid';
  // ***** main ***** //

  // ***** popup ***** //
  popupMode = 'Add';
  // Form
  popupFormData: UserVO;
  // ***** popup ***** //

  // DataSets
  dsOwnerId = [];
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
              private service: Layout8Service,
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


    // this.addPhoneButtonOptions = {
    //   icon: 'add',
    //   text: 'Add phone',
    //   onClick: () => {
    //     this.employee.Phones.push('');
    //     this.phoneOptions = this.getPhonesOptions(this.employee.Phones);
    //   },
    // };

  }

  ngOnInit(): void {
    this.G_TENANT = this.utilService.getTenant();
    this.initCode();

    this.mainEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );

    this.mainGridDataSource = new DataSource({
      store: this.mainEntityStore
    });
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


    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get(this.mainFormData);

      if (this.resultMsgCallback(result, 'Search')) {

        this.mainEntityStore = new ArrayStore(
          {
            data: result.data,
            key: this.key
          }
        );

        this.mainGridDataSource = new DataSource({
          store: this.mainEntityStore
        });
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

  // 팝업 열기
  onPopupOpen(e): void {
    if (e.element.id === 'Open') {
      this.deleteBtn.visible = false;
      // this.resetPwdBtn.visible = false;
      this.popupMode = 'Add';
      this.onPopupInitData();
    } else {
      this.deleteBtn.visible = true;
      // this.resetPwdBtn.visible = this.utilService.isAdminUser();  // 관리자용 비밀번호 초기화
      this.popupMode = 'Edit';
      this.onPopupSearch(e.data);
    }
    // if (this.utilService.isAdminUser()) {
    //   this.resetPwdBtn.disabled = true;
    // } else {
    //   this.resetPwdBtn.disabled = false;
    // }

    this.popup.visible = true;
  }

  // 생성시 초기데이터
  onPopupInitData(): void {
    this.popupFormData = Object.assign({tenant: this.G_TENANT, usr: '', name: '', shortName: '', email: ''});
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
    if (this.popupMode === 'Add') {
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
      this.popupFormData = result.data;
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

      if (this.popupMode === 'Add') {
        result = await this.service.save(this.popupFormData);
      } else {
        result = await this.service.update(this.popupFormData);
      }

      if (this.resultMsgCallback(result, 'Save')) {
        const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

        if (data.user === this.popupFormData.usr) {
          const company = this.dsOwnerId.filter(el => el.uid === this.popupFormData.companyId);
          data.companyId = this.popupFormData.companyId;
          data.userGroup = this.popupFormData.userGroup;
          data.company = company[0].company;

          sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
        }
        this.popupFormData = result.data;
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
      const result = await this.service.delete(this.popupFormData);

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
      const result = await this.service.resetPassword(this.popupFormData);

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
    const saveData = Object.assign(this.popupFormData, this.pwdPopupData);

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
