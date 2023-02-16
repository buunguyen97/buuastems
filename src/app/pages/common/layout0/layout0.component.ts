import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {Layout0Service, UserVO} from './layout0.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {CookieService} from 'ngx-cookie-service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';


@Component({
  selector: 'app-layout0',
  templateUrl: './layout0.component.html',
  styleUrls: ['./layout0.component.scss']
})
export class Layout0Component implements OnInit, AfterViewInit {
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
  @ViewChild('newBtn', {static: false}) newBtn: DxButtonComponent;
  @ViewChild('deleteBtn', {static: false}) deleteBtn: DxButtonComponent;
  @ViewChild('resetPwdBtn', {static: false}) resetPwdBtn: DxButtonComponent;


  @ViewChild('pwdPopup', {static: false}) pwdPopup: DxPopupComponent;
  @ViewChild('pwdPopupForm', {static: false}) pwdPopupForm: DxFormComponent;
  @ViewChild('pwdBtn', {static: false}) pwdBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;


  @ViewChild('defaultPopup', {static: false}) defaultPopup: DxPopupComponent;
  @ViewChild('defaultScrollPopup', {static: false}) defaultScrollPopup: DxFormComponent;
  // Global
  G_TENANT: any;

  // ***** main ***** //
  // Form
  mainFormData = {};
  // Grid
  mainGridDataSource: DataSource;
  mainEntityStore: ArrayStore;
  key = 'uid';
  // ***** main ***** //

  // ***** popup ***** //
  popupVisible = false;
  popupMode = 'Add';
  // Form
  popupFormData: UserVO;
  popupFormData2: any;

  popupDataSource: DataSource;
  popupEntityStore: ArrayStore;
  selectedRows: number[];
  deleteRowList = [];
  changes = [];
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
  dsAcceptType = this.service.dsAcceptType;
  dsAcceptGroup = this.service.dsAcceptGroup;
  dsWarehouse = this.service.dsWarehouse;
  dsItemAdmin = this.service.dsItemAdmin;
  // Grid State
  GRID_STATE_KEY = 'mm_user1';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: Layout0Service,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.onSearch = this.onSearch.bind(this);
    this.pwdPopupSaveClick = this.pwdPopupSaveClick.bind(this);
    this.pwdPopupCancelClick = this.pwdPopupCancelClick.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
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
  async onNew(e): Promise<void> {
    // 관리자 계정이 아닐 경우 생성 불가
    if (!this.utilService.isAdminUser()) {
      this.utilService.notify_error('신규 생성 권한이 없습니다.');
      return;
    }

    this.deleteBtn.visible = false;
    this.showPopup('Add', {...e.data});
  }

  async onSearchPopup(): Promise<void> {
    if (this.popupFormData.uid) {
      // Service의 get 함수 생성
      const result = await this.service.getPopup(this.popupFormData2);

      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {

        this.popupGrid.instance.cancelEditData();
        this.utilService.notify_success('search success');
        this.popupEntityStore = new ArrayStore(
          {

            key: this.key
          }
        );
        this.popupDataSource = new DataSource({
          store: this.popupEntityStore
        });
        this.popupGrid.focusedRowKey = null;
        this.popupGrid.paging.pageIndex = 0;
      }
    }
  }

  showPopup(popupMode, data): void {
    this.changes = [];  // 초기화
    this.popupEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );

    this.popupDataSource = new DataSource({
      store: this.popupEntityStore
    });

    this.popupFormData2 = data;
    this.popupFormData2 = {tenant: this.G_TENANT, ...this.popupFormData2};

    this.popupMode = popupMode;
    this.popupVisible = true;

    this.onSearchPopup();
  }
  openMapLine(): void {
    window.open('https://www.geoplaner.com/', '_blank');
  }
  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
    this.newBtn.visible = this.utilService.isAdminUser();
    this.mainForm.instance.focus();
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    this.utilService.getGridHeight(this.mainGrid);

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
  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
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
  defaultPopupOpenClick(targetPopup): void {
    targetPopup.visible = true;
  }
  defaultPopupcloseClick(targetPopup): void {
    targetPopup.visible = false;
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
}
