import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {TermService} from './term.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: {path: string, pathName: string, title: string, menuL2Id: number} = this.utilService.getPageInfo();

  mainKey = 'uid';

  isNewPopup = true;
  termContentValue: string;

  dsYN = [];
  dsTermType = [];

  GRID_STATE_KEY = 'mm_term';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: TermService,
              public gridUtil: GridUtilService) {

    this.onClickPopupSave = this.onClickPopupSave.bind(this);
    this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
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

    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TERMTYPE').subscribe(result => {
      this.dsTermType = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    this.mainForm.formData.tenant = this.G_TENANT;

    const result = await this.service.sendPost(this.mainForm.formData, 'findTerm');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.term.newTerm', '약관 신규');
    this.popupForm.instance.resetValues();
    this.popupForm.formData.requiredYn = this.dsYN[0].code;
    this.popup.visible = true;
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.term.editTerm', '약관 수정');
    this.onSearchPopup(e.data).then();
  }

  async onSearchPopup(eData): Promise<void> {
    const result = await this.service.sendPost(eData, 'findTermFull');
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.termContentValue = result.data.termContent;
      this.popupForm.formData = result.data;
      this.popup.visible = true;
    }
  }

  onHiddenPopup(e): void {
    this.popupForm.formData = {};
    this.onSearch().then();
  }

  async onClickPopupSave(e): Promise<void> {
    const popupValidate = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (popupValidate.isValid) {

      if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        this.popupForm.formData.tenant = this.G_TENANT;
        this.popupForm.formData.termContent = this.termContentValue;
        const result = await this.service.sendPost(this.popupForm.formData, 'saveTerm');

        if (this.utilService.resultMsgCallback(result, executionTxt)) {
          this.popup.visible = false;
        }
      }
    }
  }

  async onClickPopupDelete(e): Promise<void> {
    const popupFormData = this.popupForm.formData;
    const executionTxt = this.utilService.convert1('com.btn.del', '삭제');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.sendPost(popupFormData, 'deleteTerm');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
      }
    }
  }

  onClickPopupCancel(e): void {
    this.popup.visible = false;
  }
}
