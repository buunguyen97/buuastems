import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import _ from 'lodash';
import {UsermanagementService} from '../../mm/usermanagement/usermanagement.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit{

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();
  input: any;

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: UsermanagementService) {
  }

  ngOnInit(): void {}

  open(data): void {
    this.input = data;
    this.popupForm.instance.resetValues();
    this.popup.visible = true;
  }

  async save(): Promise<void> {
    const validData = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.text.password.update', '비밀번호 변경');

    if (!validData.isValid) {
      validData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const saveData = Object.assign(this.input, this.popupForm.formData);
      const result = await this.service.sendPost(saveData, 'updatePwd');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.close();
      }
    }
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.popupForm.formData = {};
    this.input = {};
  }

  passwordComparison = () => this.popupForm.formData.changePassword;
}
