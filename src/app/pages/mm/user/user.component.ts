import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CarService} from '../car/car.service';
import {CookieService} from 'ngx-cookie-service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import _ from 'lodash';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import { UserService } from './user.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {PasswordComponent} from '../../popup/password/password.component';

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

  @ViewChild('password', {static: false}) password: PasswordComponent;

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
  dsUser = [];
  dsCurrUser = [];

  phoneMask = COMMONINITDATA.DEFAULT_PHONE_MASK;
  phoneRules = COMMONINITDATA.PHONE_RULES;
  phoneEditorOptions = this.utilService.getPhoneEditorOptions();
  telEditorOptions = this.utilService.getTelEditorOptions();

  GRID_STATE_KEY = 'mm_user_admin';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: UserService,
              private carService: CarService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.resetPassword = this.resetPassword.bind(this);
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

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'USERTYPE'})).subscribe(result => {
      this.dsUserType = result.data;
    });

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });

    this.codeService.getItems(_.cloneDeep(data), 'company').subscribe(result => {
      this.dsCompany = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');

    if (data.isValid) {
      this.mainForm.formData.userType = 'ADMIN';
      const result = await this.service.sendPost(this.mainForm.formData, 'findUser');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.user.newUser', '사용자 신규');
    this.popupForm.instance.resetValues();
    this.popupForm.formData.userType = 'ADMIN';
    this.popup.visible = true;
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.user.editUser', '사용자 수정');
    this.onSearchPopup(e.data).then();
  }

  onHiddenPopup(e): void {
    this.initPopup();
    this.onSearch().then();
  }

  initPopup(): void {
    this.popupForm.formData = {};
  }

  async onSearchPopup(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findUserFull');
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.popupForm.formData = result.data;
      this.popup.visible = true;
    }
  }

  async onClickPopupSave(): Promise<void> {
    const popupValidate = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!popupValidate.isValid) { return; }

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const saveData = _.cloneDeep(this.popupForm.formData);

      saveData.tenant = this.G_TENANT;
      saveData.operType = this.isNewPopup ? 'insert' : 'update';
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

  passwordPopupOpen(): void {
    const cloneData = _.cloneDeep(this.popupForm.formData);
    this.password.open(cloneData);
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
}
