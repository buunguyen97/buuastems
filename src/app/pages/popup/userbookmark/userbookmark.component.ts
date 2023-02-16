import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import _ from 'lodash';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {UserbookmarkService} from './userbookmark.service';

@Component({
  selector: 'app-userbookmark',
  templateUrl: './userbookmark.component.html',
  styleUrls: ['./userbookmark.component.scss']
})
export class UserbookmarkComponent implements OnInit, AfterViewInit {

  @ViewChild('simplePopup', {static: false}) simplePopup: DxPopupComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  simpleInput: any;
  input: any;

  simpleBookmarks = [];
  bookmarks = [];

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: UserbookmarkService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  open(data): void {
    this.popupForm.instance.resetValues();
    data.userId = data.uid;
    this.search(data).then();
  }

  async search(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findUserBookmark');

    if (data.isSimple) {
      data.isSimple = false;
      this.simpleInput = data;
      this.simplePopup.visible = true;
      this.simpleBookmarks = result.data;

      let num = this.simpleBookmarks.length;
      const maxLength = 5;

      if (num >= maxLength) {
        this.simpleBookmarks.length = maxLength;
      } else {
        num = maxLength - num;

        for (num; num > 0; num--) {
          const bookmarkData = {class: '', companyNm: ''};
          this.simpleBookmarks.push(bookmarkData);
        }
      }
      this.simpleBookmarks.forEach(el => {
        el.class = this.pickRandom(el.uid, 'class');
        el.icon = this.pickRandom(el.uid, 'icon');
      });
    } else {
      this.input = data;
      this.popup.visible = true;
      this.bookmarks = result.data;
    }
  }

  pickRandom(check, type): string {
    let list = [];

    if (!check) {
      return type === 'class' ? '' : 'add';
    } else {

      if (type === 'class') {
        list = ['yellow', 'orange', 'pink', 'crimson', 'tomato', 'forestgreen', 'powderblue'];
      } else if (type === 'icon') {
        list = ['user', 'like', 'home'];
      }
      return list[Math.floor(Math.random() * list.length)];
    }
  }

  clickSimpleBookmark(data): any {
    this.simplePopup.visible = false;
    data.formName = this.simpleInput.formName;
    console.log(data);
    return this.output.emit(data);
  }

  async registration(e): Promise<void> {
    const formData = this.popupForm.formData;
    const selectedIdx = this.bookmarks.findIndex(el => el.selected === true);
    const validData = this.popupForm.instance.validate();

    if (!validData.isValid) {
      validData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    if (selectedIdx > -1) {
      const selectedBookmark = this.bookmarks[selectedIdx];

      if (JSON.stringify(selectedBookmark) !== JSON.stringify(formData)) {
        formData.operType = 'update';
      } else {
        return;
      }
    } else {
      formData.tenant = this.input.tenant;
      formData.userId = this.input.uid;
      formData.operType = 'insert';
    }

    this.service.sendPost([formData], 'saveUserBookmark').then(result => {

      if (result.success) {
        this.initFormData();
        this.search(this.input).then();
      }
    });
  }

  deleteRow(data): void {

    this.service.sendPost([data], 'deleteUserBookmark').then(result => {

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
    this.popupForm.formData = _.cloneDeep(data);
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

    if (this.simplePopup.visible) {
      this.input.isSimple = this.simplePopup.visible;
      this.search(this.input).then();
    }
  }

  onHidden(): void {
    this.popupForm.formData = {};
    this.input = {};
  }

  async findAddress(e, that): Promise<void> {

    // @ts-ignore
    new daum.Postcode({
      popupKey: 'searchAddrPopup',
      // tslint:disable-next-line:typedef
      oncomplete(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 예제를 참고하여 다양한 활용법을 확인해 보세요.
        that.popupForm.formData.address1 = data.address;
      }
    }).open();
  }
}
