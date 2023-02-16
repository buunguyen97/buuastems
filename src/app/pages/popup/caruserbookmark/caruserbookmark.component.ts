import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import _ from 'lodash';
import {CaruserbookmarkService} from './caruserbookmark.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Component({
  selector: 'app-caruserbookmark',
  templateUrl: './caruserbookmark.component.html',
  styleUrls: ['./caruserbookmark.component.scss']
})
export class CaruserbookmarkComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  bookmarks = [];

  ciDoDs = [];
  guGunDs = [];
  eupMyunDs = [];

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: CaruserbookmarkService) {
    this.onChangedArea1 = this.onChangedArea1.bind(this);
    this.onChangedArea2 = this.onChangedArea2.bind(this);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCode();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'AREA', etcColumn1: '0000000000'})).subscribe(result => {
      this.ciDoDs = result.data;
    });
  }

  open(data): void {
    data.userId = data.uid;
    this.input = data;
    this.search(this.input).then();
  }

  async search(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findCarUserBookmark');
    this.bookmarks = result.data;
    this.popup.visible = true;
  }

  async registration(e): Promise<void> {
    const formData = this.popupForm.formData;
    const selectedIdx = this.bookmarks.findIndex(el => el.selected === true);
    const validData = this.popupForm.instance.validate();
    const bookmarksData = [];

    if (!validData.isValid) {
      validData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    for (const name of ['ciDo', 'guGun', 'eupMyun']) {
      const ds = this[name.concat('Ds')].filter(el => el.code === formData[name])[0];

      if (!ds) {
        continue;
      } else {
        bookmarksData.push(ds.codeName);
      }
    }
    const address = bookmarksData.join(' ');

    if (selectedIdx > -1) {
      const selectedAddress = this.bookmarks[selectedIdx];

      if (JSON.stringify(selectedAddress) !== JSON.stringify(formData)) {
        formData.operType = 'update';
      } else {
        return;
      }
    } else {
      formData.tenant = this.input.tenant;
      formData.userId = this.input.uid;
      formData.operType = 'insert';
      formData.address = address;
    }

    this.service.sendPost([formData], 'saveCarUserBookmark').then(result => {

      if (result.success) {
        this.initFormData();
        this.search(this.input).then();
      }
    });
  }

  deleteRow(data): void {

    this.service.sendPost([data], 'deleteCarUserBookmark').then(result => {

      if (result.success) {
        this.initFormData();
        this.search(this.input).then();
      }
    });
  }

  initFormData(): void {
    this.popupForm.formData = {};
  }

  reset(e): void {
    this.initSelectedRow();
    this.popupForm.formData = {};
  }

  selectRow(e, data): void {
    this.initSelectedRow();
    data.selected = true;
    const cloneData = _.cloneDeep(data);

    for (const name of Object.keys(cloneData)) {
      this.popupForm.formData[name] = cloneData[name];
    }
  }

  initSelectedRow(): void {
    this.utilService.getSelectedIndex(this.bookmarks).then(beforeIdx => {

      if (beforeIdx >= 0) {
        this.bookmarks[beforeIdx].selected = false;
      }
    });
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.popupForm.formData = {};
    this.input = {};
  }

  onChangedArea1(e): void {
    const commonFormData = {tenant: this.G_TENANT};

    if (!!e.value) {

      if (!!e.event) {
        this.popupForm.formData.guGun = '';
        this.popupForm.formData.eupMyun = '';
      }
      this.codeService.getLookUp(
        Object.assign(commonFormData, {
          codeCategory: 'AREA',
          etcColumn1: e.value
        }), 'code').then(result => {
        this.guGunDs = result.data;
        this.eupMyunDs = [];
      });
    } else {
      this.guGunDs = [];
    }
  }

  onChangedArea2(e): void {
    const commonFormData = {tenant: this.G_TENANT};

    if (!!e.value) {

      if (!!e.event) {
        this.popupForm.formData.eupMyun = '';
      }
      this.codeService.getLookUp(
        Object.assign(commonFormData, {
          codeCategory: 'AREA',
          etcColumn1: e.value
        }), 'code').then(result => {
        this.eupMyunDs = result.data;
      });
    } else {
      this.eupMyunDs = [];
    }
  }
}
