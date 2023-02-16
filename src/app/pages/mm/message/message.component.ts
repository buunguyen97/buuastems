import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {MessageService} from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  mainKey = 'uid';
  changes = [];

  GRID_STATE_KEY = 'mm_message';
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);

  constructor(public utilService: CommonUtilService,
              private service: MessageService,
              public gridUtil: GridUtilService) {
    this.onClickSave = this.onClickSave.bind(this);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.mainForm.instance.focus();
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    this.mainForm.formData.tenant = this.G_TENANT;

    const result = await this.service.sendPost(this.mainForm.formData, 'findMessage');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.instance.cancelEditData();
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  addClick(e): void {

    this.mainGrid.instance.addRow().then(r => {
      const rowIdx = this.mainGrid.instance.getRowIndexByKey(this.changes[this.changes.length - 1].key);
      this.setFocusRow(rowIdx);
    });
  }

  async deleteClick(e): Promise<void> {
    const focusedRowIdx = this.mainGrid.focusedRowIndex;

    if (focusedRowIdx > -1) {
      this.mainGrid.instance.deleteRow(focusedRowIdx);
      this.mainGrid.instance.getDataSource().store().push([{type: 'remove', key: this.mainGrid.focusedRowKey}]);
      this.setFocusRow(focusedRowIdx - 1);
    }
  }

  async onClickSave(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');
    const tempData = await this.collectGridData(this.changes);
    const columns = ['messageKey', 'ko'];    // required 컬럼 dataField 정의
    // const validColumns = this.mainGrid.columns.filter(el => !!el['validationRules']);
    // const changeData = [];

    for (const item of tempData) {
      // if (item.type === 'delete') {
      //   return;
      // }

      if (!item.key && !item.uid) {
        for (const col of columns) {
          if ((item[col] === undefined) || (item[col] === '')) {
            this.utilService.notify_error('An empty value exists');
            return;
          }
        }
      }

      this.mainGrid.instance.byKey(item.key).then(
        (dataItem) => {
          for (const col of columns) {
            if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
              this.utilService.notify_error('An empty value exists');
              return;
            }
          }
        }
      );
    }

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.save(tempData);

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.onSearch().then();
      }
    }

    // if (!tempData.check) {
    //   console.log(tempData.checkData);
    //   console.log(this.mainGrid.instance['getController']('validating').validate());
    //   // const key = tempData.checkData.key;
    //   // console.log(key);
    //   // this.mainGrid.instance.getRowIndexByKey(key);
    //   // console.log(this.mainGrid.instance.getRowIndexByKey(key));
    //   // this.mainGrid.focusedRowKey = key;
    //   //
    //   // let gridInstance = this.mainGrid.instance as any;
    //   // console.log("Submitted");
    //   // console.log(gridInstance.getController("validating").validate());
    //   // console.log(gridInstance.getController("validating").validate(true));
    // }
  }

  onFocusedCellChanging(e): void {
    this.setFocusRow(e.rowIndex);
  }

  setFocusRow(index): void {
    this.mainGrid.focusedRowIndex = index;
  }

  async collectGridData(changes: any): Promise<any[]> {
    const gridList = [];

    for (const row of changes) {
      // Insert일 경우 UUID가 들어가 있기 때문에 Null로 매핑한다.
      if (row.type === 'insert') {
        gridList.push(Object.assign({
          operType: row.type,
          uid: null,
          tenant: this.G_TENANT
        }, row.data));
      } else {
        gridList.push(
          Object.assign(
            {operType: row.type, uid: row.key}, row.data
          )
        );
      }
    }
    return gridList;
  }


  // onFocusedRowChanging(e) {
  //   const rowsCount = e.component.getVisibleRows().length;
  //   const pageCount = e.component.pageCount();
  //   const pageIndex = e.component.pageIndex();
  //   const key = e.event && e.event.key;
  //
  //   if (key && e.prevRowIndex === e.newRowIndex) {
  //     if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
  //       e.component.pageIndex(pageIndex + 1).done(() => {
  //         e.component.option('focusedRowIndex', 0);
  //       });
  //     } else if (e.newRowIndex === 0 && pageIndex > 0) {
  //       e.component.pageIndex(pageIndex - 1).done(() => {
  //         e.component.option('focusedRowIndex', rowsCount - 1);
  //       });
  //     }
  //   }
  // }
  //
  // onFocusedRowChanged(e) {
  //   const rowData = e.row && e.row.data;
  //
  //   // if (rowData) {
  //   //   this.taskSubject = rowData.Task_Subject;
  //   //   this.taskDetailsHtml = this.sanitizer.bypassSecurityTrustHtml(rowData.Task_Description);
  //   //   this.taskStatus = rowData.Task_Status;
  //   //   this.taskProgress = rowData.Task_Completion ? `${rowData.Task_Completion}` + '%' : '';
  //   // }
  // }

  // async collectGridData(changes: any): Promise<any> {
  //   let returnData: any = {};
  //   const gridList = [];
  //   returnData.check = true;
  //   const validColumns = this.mainGrid.columns.filter(el => !!el['validationRules']).map(ed => ed['dataField']);
  //
  //   for (const row of changes) {
  //     console.log(22222);
  //
  //     if (row.type === 'insert') {
  //
  //       for (const validColumn of validColumns) {
  //
  //         if (!row.data[validColumn]) {
  //           row.data[validColumn] = '';
  //           returnData.check = false;
  //           returnData.checkData = row;
  //           console.log(33333);
  //           console.log(this.mainGrid.instance['getController']('validating').validate());
  //           // this.mainGrid.instance.instance['getController'].component.focus();
  //           return returnData;
  //         }
  //       }
  //
  //
  //
  //       if (returnData.check) {
  //         console.log(44444);
  //         gridList.push(Object.assign({
  //           operType: row.type,
  //           uid: null,
  //           tenant: this.G_TENANT
  //         }, row.data));
  //       }
  //     } else {
  //
  //       if (row.type === 'update') {
  //
  //       }
  //       gridList.push(
  //         Object.assign({operType: row.type, uid: row.key}, row.data)
  //       );
  //     }
  //   }
  //
  //   console.log(55555);
  //   returnData.gridList = gridList;
  //   return returnData;
  // }
}
