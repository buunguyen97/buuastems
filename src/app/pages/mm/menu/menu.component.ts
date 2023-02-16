import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {MenuSearchVO, MenuService} from './menu.service';
import {CookieService} from 'ngx-cookie-service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('grid1', {static: false}) grid1: DxDataGridComponent;
  @ViewChild('grid2', {static: false}) grid2: DxDataGridComponent;
  @ViewChild('grid3', {static: false}) grid3: DxDataGridComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  key = 'uid';

  dsUserType = [];
  dsIcon = [];
  dsYN = [];

  changes1 = [];
  changes2 = [];
  changes3 = [];

  addFlg1 = false;
  addFlg2 = false;

  GRID_STATE_KEY = 'mm_menu';
  saveState1 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_1');
  loadState1 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_1');
  saveState2 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_2');
  loadState2 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_2');
  saveState3 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_3');
  loadState3 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_3');

  constructor(public utilService: CommonUtilService,
              private service: MenuService,
              private cookieService: CookieService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.addClick1 = this.addClick1.bind(this);
    this.addClick2 = this.addClick2.bind(this);
    this.addClick3 = this.addClick3.bind(this);
    this.deleteClick1 = this.deleteClick1.bind(this);
    this.deleteClick2 = this.deleteClick2.bind(this);
    this.deleteClick3 = this.deleteClick3.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.mainForm.instance.focus();
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);

    this.utilService.getGridHeight(this.grid1);
    this.utilService.getGridHeight(this.grid2);
    this.utilService.getGridHeight(this.grid3);

    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(data, {codeCategory: 'USERTYPE'})).subscribe(result => {
      this.dsUserType = result.data;
      this.mainForm.formData.userType = this.dsUserType[0].code;
    });

    this.codeService.getItems(Object.assign(data, {codeCategory: 'ICON'})).subscribe(result => {
      this.dsIcon = result.data;
    });

    this.codeService.getItems(Object.assign(data, {codeCategory: 'YN'})).subscribe(result => {
      this.dsYN = result.data;
    });
  }

  async onSearch(): Promise<void> {
    this.initGrid('all');
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      this.mainForm.formData.tenant = this.G_TENANT;
      const executionTxt = this.utilService.convert1('com.btn.search', '조회');
      const result = await this.service.sendPost(this.mainForm.formData, 'findMenuL1');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.grid1.dataSource = this.utilService.setGridDataSource(result.data, this.key);
        this.grid1.focusedRowKey = null;
        this.grid1.paging.pageIndex = 0;
      }
    }
  }

  async onSearchL2(searchVO): Promise<void> {

    if (this.addFlg1 || !searchVO.uid) {
      this.addFlg1 = false;
      return;
    }
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    const result = await this.service.sendPost(searchVO, 'findMenuL2');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.grid2.dataSource = this.utilService.setGridDataSource(result.data, this.key);
      this.grid2.focusedRowKey = null;
      this.grid2.paging.pageIndex = 0;
    }
  }

  async onSearchApp(searchVO): Promise<void> {

    if (this.addFlg2 || !searchVO.uid) {
      this.addFlg2 = false;
      return;
    }
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    const result = await this.service.sendPost(searchVO, 'findApp');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.grid3.dataSource = this.utilService.setGridDataSource(result.data, this.key);
      this.grid3.focusedRowKey = null;
      this.grid3.paging.pageIndex = 0;
    }
  }

  initGrid(type): void {

    if (type === 'all') {
      this.grid1.dataSource = this.utilService.setGridDataSource([], this.key);
      this.grid2.dataSource = this.utilService.setGridDataSource([], this.key);
      this.grid3.dataSource = this.utilService.setGridDataSource([], this.key);
      this.changes1 = [];
      this.changes2 = [];
      this.changes3 = [];
    } else if (type === 'grid1') {
      this.grid2.dataSource = this.utilService.setGridDataSource([], this.key);
      this.grid3.dataSource = this.utilService.setGridDataSource([], this.key);
      this.changes2 = [];
      this.changes3 = [];
    } else if (type === 'grid2') {
      this.grid3.dataSource = this.utilService.setGridDataSource([], this.key);
      this.changes3 = [];
    }
  }

  async onSave(): Promise<void> {
    const messages = {text: 'mm_menu_text', title: 'mm_menu_apptitle', path: 'mm_menu_path'};
    const columns = ['text', 'path'];    // required 컬럼 dataField 정의

    const grid1Idx = this.grid1.focusedRowIndex;
    const grid2Idx = this.grid2.focusedRowIndex;

    this.grid1.instance.cellValue(grid1Idx, 'items', null);
    this.grid2.instance.cellValue(grid2Idx, 'items', null);
    if (this.changes2.length > 0) {
      const grid2Data = this.collectGridData(this.changes2);
      this.grid1.instance.cellValue(grid1Idx, 'items', grid2Data);
    }

    if (this.changes3.length > 0) {
      const grid3Data = this.collectGridData(this.changes3);
      this.grid2.instance.cellValue(grid2Idx, 'items', grid3Data);

      const grid2Data = this.collectGridData(this.changes2);
      this.grid1.instance.cellValue(grid1Idx, 'items', grid2Data);
    }

    const tempData = this.collectGridData(this.changes1);
    const tempData2 = this.collectGridData(this.changes2);
    const tempData3 = this.collectGridData(this.changes3);

    console.log(tempData);

    for (const item of tempData) {
      item.userType = this.mainForm.instance.getEditor('userType').option('value');
    }

    for (const item of tempData) {
      if (!item.key && !item.uid) {
        for (const col of columns) {
          if ((item[col] === undefined) || (item[col] === '')) {
            const msg = this.utilService.convert(messages[col]);
            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
            return;
          }
        }
      }

      this.grid1.instance.byKey(item.key).then(
        (dataItem) => {
          for (const col of columns) {
            if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
              const msg = this.utilService.convert(messages[col]);
              this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
              return;
            }
          }
        }
      );
    }

    for (const item of tempData2) {

      if (!item.key && !item.uid) {
        for (const col of columns) {
          if ((item[col] === undefined) || (item[col] === '')) {
            const msg = this.utilService.convert(messages[col]);
            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
            return;
          }
        }
      }

      this.grid2.instance.byKey(item.key).then(
        (dataItem) => {
          for (const col of columns) {
            if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
              const msg = this.utilService.convert(messages[col]);
              this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
              return;
            }
          }
        }
      );
    }

    for (const item of tempData3) {
      const validArr = ['title'];

      if (!item.key && !item.uid) {
        for (const col of validArr) {
          if ((item[col] === undefined) || (item[col] === '')) {
            const msg = this.utilService.convert(messages[col]);
            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
            return;
          }
        }
      }

      this.grid3.instance.byKey(item.key).then(
        (dataItem) => {
          for (const col of validArr) {
            if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
              const msg = this.utilService.convert(messages[col]);
              this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
              return;
            }
          }
        }
      );
    }

    await this.grid1.instance.saveEditData();
    await this.grid2.instance.saveEditData();
    await this.grid3.instance.saveEditData();

    /// userId 파라메터 전송
    const userId = this.utilService.getUserUid();
    const result = await this.service.save(tempData, userId);
    if (result.success) {
      this.utilService.notify_success('save success');
      await this.onSearch();
    } else {
      this.utilService.notify_error(result.msg);
    }
  }

  addClick1(e): void {
    this.initGrid('grid1');
    this.addFlg1 = true;

    this.grid1.instance.addRow().then(r => {
      const rowIdx = this.grid1.instance.getRowIndexByKey(this.changes1[this.changes1.length - 1].key);
      this.setFocusRow(this.grid1, rowIdx);
    });
  }

  addClick2(e): void {
    this.initGrid('grid2');
    this.addFlg2 = true;

    const grid1Idx = this.grid1.focusedRowIndex;

    if (grid1Idx > -1) {

      this.grid2.instance.addRow().then(r => {
        const rowIdx = this.grid2.instance.getRowIndexByKey(this.changes2[this.changes2.length - 1].key);
        this.setFocusRow(this.grid2, rowIdx);
      });
      this.grid1.instance.cellValue(grid1Idx, 'items', this.changes2);
    }
  }

  addClick3(e): void {
    const grid2Idx = this.grid2.focusedRowIndex;

    // 어플리케이션은 한개만 허용
    if (this.grid3.instance.totalCount() + this.changes3.length > 0) {
      return;
    }

    if (grid2Idx > -1) {

      this.grid3.instance.addRow().then(r => {
        const rowIdx = this.grid3.instance.getRowIndexByKey(this.changes3[this.changes3.length - 1].key);
        this.setFocusRow(this.grid3, rowIdx);
      });
      this.grid2.instance.cellValue(grid2Idx, 'items', this.changes2);
    }
  }

  async deleteClick1(e): Promise<void> {
    this.initGrid('grid1');

    if (this.grid1.focusedRowIndex > -1) {
      const focusedIdx = this.grid1.focusedRowIndex;
      const instance = this.grid1.instance;

      instance.deleteRow(this.grid1.focusedRowIndex);
      instance.getDataSource().store().push([{type: 'remove', key: this.grid1.focusedRowKey}]);

      this.grid1.focusedRowIndex = focusedIdx - 1;
    }
  }

  async deleteClick2(e): Promise<void> {
    this.initGrid('grid2');

    if (this.grid2.focusedRowIndex > -1) {
      const focusedIdx = this.grid2.focusedRowIndex;
      const instance = this.grid2.instance;

      instance.deleteRow(this.grid2.focusedRowIndex);
      instance.getDataSource().store().push([{type: 'remove', key: this.grid2.focusedRowKey}]);

      this.grid2.focusedRowIndex = focusedIdx - 1;
    }
  }

  async deleteClick3(e): Promise<void> {

    if (this.grid3.focusedRowIndex > -1) {
      const focusedIdx = this.grid3.focusedRowIndex;
      const instance = this.grid3.instance;

      instance.deleteRow(this.grid3.focusedRowIndex);
      instance.getDataSource().store().push([{type: 'remove', key: this.grid3.focusedRowKey}]);

      this.grid3.focusedRowIndex = focusedIdx - 1;
    }
  }

  // 그리드 셀 이동시 호출하는 함수
  onFocusedCellChanging1(e): void {
    this.setFocusRow(this.grid1, e.rowIndex);
  }

  onFocusedRowChanging1(e): void {
    this.initGrid('grid1');

    if (e.rowIndex < 0 || !e.row || typeof e.row.data.uid === 'string') {
      return;
    } else {
      this.onSearchL2(e.row.data);
    }
  }

  onFocusedCellChanging2(e): void {
    this.setFocusRow(this.grid2, e.rowIndex);
  }

  onFocusedRowChanging2(e): Promise<void> {
    this.initGrid('grid2');

    if (e.rowIndex < 0 || !e.row || typeof e.row.data.uid === 'string') {
      return;
    } else {
      this.onSearchApp(e.row.data);
    }
  }

  onFocusedCellChanging3(e): void {
    this.setFocusRow(this.grid3, e.rowIndex);
  }

  onFocusedRowChanging3(e): void {
    this.setFocusRow(this.grid3, e.rowIndex);
  }

  setFocusRow(grid, index): void {
    grid.focusedRowIndex = index;
  }

  collectGridData(changes: any): any[] {
    const gridList = [];
    for (const rowIndex in changes) {
      // Insert일 경우 UUID가 들어가 있기 때문에 Null로 매핑한다.
      if (changes[rowIndex].type === 'insert') {
        gridList.push(Object.assign({
          operType: changes[rowIndex].type,
          uid: null,
          tenant: this.G_TENANT
        }, changes[rowIndex].data));
      } else if (changes[rowIndex].type === 'remove') {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data)
        );
      } else {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data
          )
        );
      }
    }
    return gridList;
  }

  onSelectionChanged(): void {
    this.changes1 = [];
  }
}

