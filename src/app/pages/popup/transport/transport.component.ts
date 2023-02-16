import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import _ from 'lodash';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit , AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  carTypeList = [];
  dsTranCarKind = [];

  selectedNum: number;

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCode();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARTYPE'})).subscribe(result => {
      this.carTypeList = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARKIND'})).subscribe(result => {
      this.dsTranCarKind = result.data;
    });
  }

  open(data): void {
    this.input = data;
    this.popup.visible = true;
    this.popupForm.formData = this.input;
  }

  registration(): void {
    this.output.emit(this.popupForm.formData);
    this.close();
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
    this.popupForm.formData = {};
    this.onSelectItem(-1);
  }

  onSelectItem(i, car?): void{
    this.selectedNum = i;

    if (!!car) {
      this.popupForm.formData.tranCarType = car.code;
    }
  }
}
