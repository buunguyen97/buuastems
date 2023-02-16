import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import _ from 'lodash';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {PrepaidcardService} from './prepaidcard.service';

@Component({
  selector: 'app-prepaidcard',
  templateUrl: './prepaidcard.component.html',
  styleUrls: ['./prepaidcard.component.scss']
})
export class PrepaidcardComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();
  key = 'uid';
  input: any;

  dsProcType = [];
  dsUser = [];

  constructor(public utilService: CommonUtilService,
              public gridUtil: GridUtilService,
              private codeService: CommonCodeService,
              private service: PrepaidcardService) {
    this.onClickSearch = this.onClickSearch.bind(this);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCode();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'PROCTYPE'})).subscribe(result => {
      this.dsProcType = result.data;
    });

    this.codeService.getItems(_.cloneDeep(data), 'user').subscribe(result => {
      this.dsUser = result.data;
    });
  }

  open(data): void {
    data.userId = data.uid;
    // this.input = data;
    const currDate = this.toStringByFormatting(new Date());
    const searchData = {uid: data.preCardId};
    this.input = _.cloneDeep(searchData);
    this.popupForm.formData.fromProcDate = currDate.substr(0, 8).concat('01');
    this.popupForm.formData.toProcDate = currDate;

    this.search(Object.assign(searchData, this.popupForm.formData)).then();
  }

  onClickSearch(): void {
    this.search(Object.assign(this.input, this.popupForm.formData)).then();
  }

  async search(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findPreCardHistory');

    if (result.success) {
      this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data.preCardHistoryList, this.key);
      this.popup.visible = true;
    } else {

    }
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
    this.popupForm.formData = {};
    this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.key);
  }

  toStringByFormatting(source, delimiter = '-'): string {
    const year = source.getFullYear();
    const month = this.leftPad(source.getMonth() + 1);
    const day = this.leftPad(source.getDate());

    return [year, month, day].join(delimiter);
  }

  leftPad(value): string{

    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }
}
