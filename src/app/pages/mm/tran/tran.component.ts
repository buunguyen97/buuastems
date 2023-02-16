import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxAccordionComponent, DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {TranService} from './tran.service';

@Component({
  selector: 'app-trancharge',
  templateUrl: './tran.component.html',
  styleUrls: ['./tran.component.scss']
})
export class TranComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('subGrid', {static: false}) subGrid: DxDataGridComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  @ViewChild('acrdn', {static: false}) acrdn: DxAccordionComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: {path: string, pathName: string, title: string, menuL2Id: number} = this.utilService.getPageInfo();

  mainKey = 'uid';
  subKey = 'codeId';

  isNewPopup = true;
  termContentValue: string;

  dsYN = [];

  GRID_STATE_KEY = 'mm_tran';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  saveStateSub = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_sub');
  loadStateSub = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_sub');


  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: TranService,
              public gridUtil: GridUtilService) {
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.fnAccordionExpandAll(this.acrdn);
    this.utilService.getGridHeight(this.subGrid);
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
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');

    this.mainForm.formData.tenant = this.G_TENANT;
    const result = await this.service.sendPost(this.mainForm.formData, 'findTran');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data.tranList, this.mainKey);
      this.subGrid.dataSource = this.utilService.setGridDataSource(result.data.tranChargeList, this.subKey);
      this.mainGrid.instance.cancelEditData();
      this.subGrid.instance.cancelEditData();
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  async onClickSave(e): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const saveMainData = await this.utilService.collectGridData(this.mainGrid.editing.changes);
      const saveSubData = await this.collectSubGridData(this.subGrid.editing.changes);
      const result = await this.service.sendPost({tranList: saveMainData, tranChargeList: saveSubData}, 'saveTran');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        console.log(result.data);
        // this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data.tranList, this.mainKey);
        // this.subGrid.dataSource = this.utilService.setGridDataSource(result.data.tranChargeList, this.subKey);
        // this.mainGrid.focusedRowKey = null;
        // this.mainGrid.paging.pageIndex = 0;
        this.onSearch().then(() => {

        });
      }
      console.log(saveMainData);
      console.log(saveSubData);
    }
  }

  onMainGridAddRow(): void {
    this.mainGrid.dataSource = this.mainGrid.dataSource || this.utilService.setGridDataSource([], this.mainKey);

    this.mainGrid.instance.addRow().then(() => {
      this.setFocusRow(this.mainGrid, this.mainGrid.instance.getVisibleRows().length - 1);
    });
  }

  onMainGridDeleteRow(): void {

    if (this.mainGrid.focusedRowIndex > -1) {
      this.mainGrid.instance.deleteRow(this.mainGrid.focusedRowIndex);
      this.mainGrid.instance.getDataSource().store().push([{type: 'remove', key: this.mainGrid.focusedRowKey}]);
      this.setFocusRow(this.mainGrid, this.mainGrid.focusedRowIndex - 1);
    }
  }

  setFocusRow(grid, index): void {
    grid.focusedRowIndex = index;
  }

  onFocusedCellChanged(e): void {
    this.setFocusRow(this.mainGrid, e.rowIndex);
  }

  async collectSubGridData(changes: any): Promise<any[]> {
    const gridList = [];

    for (const rowIndex in changes) {
      const changeData = await this.subGrid.instance.byKey(changes[rowIndex].key);

      if (!changeData.uid) {

        gridList.push(
          Object.assign(
            changeData, {operType: 'insert', uid: null, tenant: this.G_TENANT}
          )
        );
      } else {

        gridList.push(
          Object.assign(
            changeData, {operType: changes[rowIndex].type}
          )
        );
      }
    }
    return gridList;
  }

  onFocusedCellChangedSubGrid(e): void {

    if (e.column.dataField === 'standardMinute' || e.column.dataField === 'mileageAvg') {
      const cdCtgNm = this.subGrid.instance.cellValue(e.rowIndex, 'codecategoryNm');
      e.column.allowEditing = cdCtgNm === '차량옵션' ? false : true;
    }
  }
}

