import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CodeService, CodeVO} from '../code/code.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {GradeService} from './grade.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';
  popupKey = 'uid';

  isNewPopup = true;

  dsYN = [];
  dsUser = [];
  dsGradeUser = [];

  GRID_STATE_KEY = 'mm_grade';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');

  constructor(public utilService: CommonUtilService,
              private service: CodeService,
              private codeService: CommonCodeService,
              private gradeService: GradeService,
              public gridUtil: GridUtilService) {
    this.onClickPopupSave = this.onClickPopupSave.bind(this);
    this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
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

    this.codeService.getCode(this.G_TENANT, 'GRADEUSER').subscribe(result => {
      this.dsGradeUser = result.data;
    });

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });
  }

  async onSearch(): Promise<void> {
    const validData = this.mainForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    this.mainForm.formData.tenant = this.G_TENANT;

    if (validData.isValid) {
      const result = await this.gradeService.sendPost(this.mainForm.formData, 'findGrade');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  onReset(): void {
    this.mainForm.formData = {};
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popupForm.instance.resetValues();
    this.popupForm.formData.actFlg = this.dsYN[0].code;
    this.popup.title = this.utilService.convert1('mm.grade.newGrade', '평가 신규');
    this.popup.visible = true;
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.grade.editGrade', '평가 수정');
    this.onSearchPopup(e.data).then();
  }

  async onSearchPopup(eData): Promise<void> {
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
    const result = await this.gradeService.sendPost(eData, 'findGrade');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.popupForm.formData = result.data[0];
      this.popup.visible = true;
    }
  }

  async onClickPopupSave(e): Promise<void> {
    const popData = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (popData.isValid) {

      if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        const popupFormData = this.popupForm.formData;
        popupFormData.tenant = this.G_TENANT;

        const result = await this.gradeService.sendPost(popupFormData, this.isNewPopup ? 'saveGrade' : 'updateGrade');

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
      const result = await this.gradeService.sendPost(popupFormData, 'deleteGrade');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
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
}
