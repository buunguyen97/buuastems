import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {PrecardService} from './precard.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import _ from 'lodash';

@Component({
  selector: 'app-precard',
  templateUrl: './precard.component.html',
  styleUrls: ['./precard.component.scss']
})
export class PrecardComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;

  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';
  popupKey = 'uid';

  // DataSet
  dsUser = [];
  dsUserType = [];
  dsProcType = [];

  GRID_STATE_KEY = 'mm_preCard';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');


  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: PrecardService,
              public gridUtil: GridUtilService) {

    this.onClickPopupAdjust = this.onClickPopupAdjust.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
    this.onClickSearchPopup = this.onClickSearchPopup.bind(this);
    this.onRowDblClick = this.onRowDblClick.bind(this);
    this.onSearchPopup = this.onSearchPopup.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.mainForm.instance.focus();
  }

  initCode(): void {

    this.codeService.getUser(this.G_TENANT).subscribe(result => {

      this.dsUser = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'USERTYPE').subscribe(result => {

      this.dsUserType = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'PROCTYPE').subscribe(result => {
      this.dsProcType = result.data.filter(el => el.etcColumn2 === 'Y');
    });
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');

    this.mainForm.formData.tenant = this.G_TENANT;
    const result = await this.service.sendPost(this.mainForm.formData, 'findPreCard');

    console.log(result);

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  async setProcDate(): Promise<void> {
    const currDate = this.toStringByFormatting(new Date());
    this.popupForm.formData.fromProcDate = currDate.substr(0, 8).concat('01');
    this.popupForm.formData.toProcDate = currDate;
  }

  onRowDblClick(e): void {
    const cloneData = _.cloneDeep(e.data);

    this.setProcDate().then(() => {
      this.onSearchPopup(Object.assign(cloneData, this.popupForm.formData)).then();
    });
  }

  onClickSearchPopup(): void {
    this.onSearchPopup(this.popupForm.formData).then();
  }

  async onSearchPopup(eData): Promise<void> {
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
    const result = await this.service.sendPost(eData, 'findPreCardHistory');
    this.popup.title = this.utilService.convert1('mm.precard.editPrecard', '선불카드 수정');
    this.popupForm.instance.resetValues();

    console.log(result);

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.popupForm.formData = result.data;
      this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data.preCardHistoryList, this.mainKey);
      this.popupGrid.focusedRowKey = null;
      this.popupGrid.paging.pageIndex = 0;
      this.popup.visible = true;
    }
  }

  async onClickPopupAdjust(e): Promise<void> {
    const executionTxt = this.utilService.convert1('mm.precard.adjust', '조정');
    const popupData = this.popupForm.instance.validate();

    if (popupData.isValid) {

      if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        return;
      }
      const result = await this.service.sendPost(this.popupForm.formData, 'savePreCardHistory');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.onSearchPopup(this.popupForm.formData).then();
      }
    }
  }

  onClickPopupCancel(e): void {
    this.popup.visible = false;
  }

  onHiddenPopup(e): void {
    this.popupForm.formData = {};
    this.onSearch().then();
  }


  creatFileName(menuName: string): string{

    const today: Date = new Date();
    let thisMonth: any = today.getMonth() + 1;
    let thisDay: any = today.getDate();
    let thisHour: any = today.getHours();
    let thisMin: any = today.getMinutes();
    if (Number(thisMonth) < 10){thisMonth = `0${thisMonth}`; }
    if (Number(thisDay) < 10){thisDay = `0${thisDay}`; }
    if (Number(thisHour) < 10){thisHour = `0${thisHour}`; }
    if (Number(thisMin) < 10){thisMin = `0${thisMin}`; }
    return `${menuName}_${today.getFullYear()}${thisMonth}${thisDay}${thisHour}${thisMin}`;
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
