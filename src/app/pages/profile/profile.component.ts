import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../shared/services/common-util.service';
import {CookieService} from 'ngx-cookie-service';
import {CommonCodeService} from '../../shared/services/common-code.service';
import {GridUtilService} from '../../shared/services/grid-util.service';
import {APPCONSTANTS} from '../../shared/constants/appconstants';
import {ProfileService} from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, AfterViewInit {
  employee: any;
  colCountByScreen: object;

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('pwdPopup', {static: false}) pwdPopup: DxPopupComponent;
  @ViewChild('pwdPopupForm', {static: false}) pwdPopupForm: DxFormComponent;
  @ViewChild('pwdBtn', {static: false}) pwdBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  // Global
  G_TENANT: any;

  // ***** main ***** //
  // Form
  mainFormData: any = {};
  // Grid
  mainGridDataSource: DataSource;
  mainEntityStore: ArrayStore;
  key = 'uid';
  // ***** main ***** //

  // ***** popup ***** //
  popupMode = 'Add';
  // Form
  popupFormData: any;
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
  GRID_STATE_KEY = 'mm_profile';
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: ProfileService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.onSearch = this.onSearch.bind(this);
    this.pwdPopupSaveClick = this.pwdPopupSaveClick.bind(this);
    this.pwdPopupCancelClick = this.pwdPopupCancelClick.bind(this);
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
    this.mainForm.instance.focus();
    // this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    // this.utilService.getGridHeight(this.mainGrid);
    this.onSearch();

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

    // // 화주
    // this.codeService.getCompany(this.G_TENANT, null, null, null, null, null, null, null).subscribe(result => {
    //   this.dsCompany = result.data;
    // });

    // 화주(로그인 사용자가 선택할 수 있는 화주)
/*
    this.codeService.getCompany(this.G_TENANT, true, true, null, null, true, null, null).subscribe(result => {
      this.dsOwnerId = result.data;
    });
*/

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get({uid: this.utilService.getUserUid()});

      if (this.resultMsgCallback(result, 'Search')) {

        this.mainFormData = result.data;
        // this.mainEntityStore = new ArrayStore(
        //   {
        //     data: result.data,
        //     key: this.key
        //   }
        // );
        //
        // this.mainGridDataSource = new DataSource({
        //   store: this.mainEntityStore
        // });
        // this.mainGrid.focusedRowKey = null;
        // this.mainGrid.paging.pageIndex = 0;
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

  async Save(): Promise<void> {
    const Data = this.mainForm.instance.validate();

    if (Data.isValid) {
      await this.execSave();
    }
  }

  async execSave(): Promise<boolean> {
    try {
      let result;

      result = await this.service.update(this.mainFormData);

      if (this.resultMsgCallback(result, 'Save')) {
        const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

        if (data.user === this.mainFormData.usr) {
          const company = this.dsOwnerId.filter(el => el.uid === this.mainFormData.companyId);
          data.companyId = this.mainFormData.companyId;
          data.userGroup = this.mainFormData.userGroup;
          data.company = company[0].company;

          sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
        }
        this.mainFormData = result.data;
        return true;
      } else {
        return false;
      }
    } catch {
      this.utilService.notify_error('There was an error!');
      return false;
    }
    return false;
  }

  pwdPopupOpenClick(): void {
    this.pwdPopup.visible = true;
  }

  async pwdPopupSaveClick(): Promise<void> {
    const pwdPopData = this.pwdPopupForm.instance.validate();

    const saveData = Object.assign(this.mainFormData, this.pwdPopupData);

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
    this.pwdPopupForm.instance.resetValues();
  }

  passwordComparison = () => this.pwdPopupData.changePassword;

  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
  }
}
