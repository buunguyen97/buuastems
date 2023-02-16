import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import _ from 'lodash';
import {AccountService} from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  accountList: any[] = [];

  constructor(public utilService: CommonUtilService,
              private service: AccountService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  open(data): void {
    data.userId = data.uid;
    this.input = data;
    this.popup.visible = true;
  }

  async search(data): Promise<any> {
    return await this.service.sendPost(data, 'findCarUserBank');
  }

  decide(): void {

    if (this.input.isNew) {
      this.registration();
    } else {
      this.save().then();
    }
  }

  registration(): void {
    const formData = this.popupForm.formData;
    formData.tenant = this.input.tenant;
    formData.userId = this.input.userId;
    formData.isNew = this.input.isNew;
    formData.imageSrc = '/assets/images/card_default.png';

    const cloneData = _.cloneDeep(formData);
    cloneData.operType = 'insert';

    this.output.emit(cloneData);
    this.close();
  }

  async save(): Promise<void> {
    const formData = this.popupForm.formData;
    formData.tenant = this.input.tenant;
    formData.userId = this.input.userId;
    formData.isNew = this.input.isNew;
    formData.operType = 'insert';

    this.service.sendPost([formData], 'saveCarUserBank').then(result => {

      if (result.success) {
        this.output.emit(formData);
        this.close();
      }
    });
  }

  async delete(account): Promise<any> {
    return await this.service.sendPost([account], 'deleteCarUserBank');
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
    this.popupForm.formData = {};
    this.accountList = [];
  }
}
