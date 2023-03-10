import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {PgmauthorityService} from './pgmauthority.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxTreeListComponent} from 'devextreme-angular';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {CompanyService} from '../company/company.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Component({
  selector: 'app-pgmauthority',
  templateUrl: './pgmauthority.component.html',
  styleUrls: ['./pgmauthority.component.scss']
})
export class PgmauthorityComponent implements OnInit, AfterViewInit {

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('subTreeList', {static: false}) subTreeList: DxTreeListComponent;

  @ViewChild('popupMainGrid', {static: false}) popupMainGrid: DxDataGridComponent;
  @ViewChild('popupSubTreeList', {static: false}) popupSubTreeList: DxTreeListComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  pageInfo: any = this.utilService.getPageInfo();
  // Global
  G_TENANT: any;
  dsYN = [];
  dsCompany = [];
  dsUserType = [];

  // Form
  mainFormData = {};

  // grid
  mainGridDataSource: DataSource;
  mainEntityStore: ArrayStore;
  subGridDataSource: DataSource;
  subGridEntityStore: ArrayStore;

  popupMainGridDataSource: DataSource;
  popupMainEntityStore: ArrayStore;
  popupSubGridDataSource: DataSource;
  popupSubEntityStore: ArrayStore;

  selectedRows1: number[];
  selectedRows2: number[];
  deleteRowList = [];
  key = 'uid';
  treeKey = 'keyExpr';

  changes1 = [];
  changes2 = [];

  // ??????
  popupVisible = false;
  popupMode = 'Add';
  popupData = {tenant: '', userId: '', popupUserId: ''};

  GRID_STATE_KEY = 'mm_pgmauthority1';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStateSub = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_sub');
  loadStateSub = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_sub');
  saveStatePopupMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popupMain');
  loadStatePopupMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popupMain');
  saveStatePopupSub = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popupSub');
  loadStatePopupSub = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popupSub');


  constructor(public utilService: CommonUtilService,
              private service: PgmauthorityService,
              private codeService: CommonCodeService,
              private companyService: CompanyService,
              public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();

    this.copyAuth = this.copyAuth.bind(this);
    this.popupSaveClick = this.popupSaveClick.bind(this);
    this.popupCancelClick = this.popupCancelClick.bind(this);
  }

  ngOnInit(): void {
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

/*
    this.codeService.getCompany(this.G_TENANT, null, null, null, null, null, null, null).subscribe(result => {
      this.dsCompany = result.data;
    });
*/

    const commonFormData = {tenant: this.G_TENANT};

    this.companyService.sendPost(commonFormData, 'findCompany').then(result => {
      this.dsCompany = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'USERTYPE').subscribe(result => {
      this.dsUserType = result.data;
    });

    this.mainEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );
    // ArrayStore - DataSource??? ?????????.
    // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
    this.mainGridDataSource = new DataSource({
      store: this.mainEntityStore
    });
  }

  ngAfterViewInit(): void {
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getGridHeight(this.subTreeList);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();
    this.mainForm.instance.focus();
  }

  // ????????? ??????
  onToolbarPreparing(e): void {
    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));         // first
    newToolbarItems.push(toolbarItems.find(item => item.name === 'exportButton'));        // second
    newToolbarItems.push(toolbarItems.find(item => item.name === 'columnChooserButton')); // third

    newToolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'copy',
        text: this.utilService.convert1('????????????', '????????????'),
        height: '26px',
        onClick: this.copyAuth.bind(this)
      }
    });

    newToolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'copy',
        text: this.utilService.convert1('???????????????', '???????????????'),
        height: '26px',
        onClick: this.saveAdmin.bind(this)
      }
    });

    e.toolbarOptions.items = newToolbarItems;
  }

  onToolbarPreparingForTreeList(e): void {
    const toolbarItems = e.toolbarOptions.items;

    toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        text: this.utilService.convert1('Y ??????', 'Y ??????'),
        height: '26px',
        onClick: this.chooseVisibleY.bind(this)
      }
    });

    toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        text: this.utilService.convert1('N ??????', 'N ??????'),
        height: '26px',
        onClick: this.chooseVisibleN.bind(this)
      }
    });

    e.toolbarOptions.items = toolbarItems;
  }

  async chooseVisibleY(): Promise<void> {
    const checkedList = this.subTreeList.instance.getSelectedRowsData('all');
    for (const checked of checkedList) {
      if (checked.appId > -1) {
        const findItem = this.changes2.find(el => el.key === checked.keyExpr);
        if (findItem) {
          findItem.data.authSearch = COMMONINITDATA.FLAG_TRUE;
        } else {
          if (checked.uid > -1) {
            this.changes2.push({type: 'update', key: checked.keyExpr, data: {authSearch: COMMONINITDATA.FLAG_TRUE}});
          } else {
            this.changes2.push({type: 'insert', key: checked.keyExpr, data: {authSearch: COMMONINITDATA.FLAG_TRUE}});
          }
        }
      }
    }

    await this.subTreeList.instance.refresh();
  }

  async chooseVisibleN(): Promise<void> {
    const checkedList = this.subTreeList.instance.getSelectedRowsData('all');
    for (const checked of checkedList) {
      if (checked.appId > -1) {
        const findItem = this.changes2.find(el => el.key === checked.keyExpr);
        if (findItem) {
          findItem.data.authSearch = COMMONINITDATA.FLAG_FALSE;
        } else {
          if (checked.uid > -1) {
            this.changes2.push({type: 'update', key: checked.keyExpr, data: {authSearch: COMMONINITDATA.FLAG_FALSE}});
          } else {
            this.changes2.push({type: 'insert', key: checked.keyExpr, data: {authSearch: COMMONINITDATA.FLAG_FALSE}});
          }
        }
      }
    }

    await this.subTreeList.instance.refresh();
  }

  onFocusedCellChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);
  }

  // ????????? ??? ????????? ???????????? ??????
  onFocusedRowChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);

    if (!e.row) {
      return;
    }
    if (grid === this.mainGrid) {
      this.onSearchSub(e.row.key, 'main');
    } else if (grid === this.popupMainGrid) {
      this.onSearchSub(e.row.key, 'popup');
    }
  }

  setFocusRow(index, grid): void {
    grid.focusedRowIndex = index;
  }

  // ??????
  async onSearch(gridNm: string): Promise<void> {

    this.subGridEntityStore = new ArrayStore(
      {
        data: [],
        key: this.treeKey
      }
    );
    // ArrayStore - DataSource??? ?????????.
    // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
    this.subGridDataSource = new DataSource({
      store: this.subGridEntityStore
    });

    // ??????????????? ??????????????? ??? ????????? ??????
    const data = this.mainForm.instance.validate();
    // ?????? ?????? ?????? ?????? ?????? ??????
    if (data.isValid) {
      const userType = this.mainGrid.instance.cellValue(this.mainGrid.focusedRowIndex, 'userType');
      let paramData;

      if (gridNm === 'popup') {
        paramData = Object.assign({userType}, this.mainFormData);
      } else {
        paramData = this.mainFormData;
      }
      const result = await this.service.getUsers(paramData);

      // ?????? ????????? success?????? ????????????, ????????? ????????? ??????
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        await this.mainGrid.instance.deselectAll();
        this.mainGrid.instance.cancelEditData();
        await this.utilService.notify_success('????????? ?????????????????????.');
        // ?????? ?????? ??? ?????? ????????? ArrayStore??? ?????????, Key??? ?????? DB??? Key??? ??????
        // Front?????? ???????????? CRUD??? ????????? ??? ??? ??????.
        // Grid1

        if (gridNm !== 'popup') {
          this.mainEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.key
            }
          );
          // ArrayStore - DataSource??? ?????????.
          // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
          this.mainGridDataSource = new DataSource({
            store: this.mainEntityStore
          });
        } else {
          this.popupMainEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.key
            }
          );
          // ArrayStore - DataSource??? ?????????.
          // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
          this.popupMainGridDataSource = new DataSource({
            store: this.popupMainEntityStore
          });
        }

        // ????????? ????????? ????????? ???????????? ???????????? ???????????? ?????? ???????????? ?????? ????????? ???????????? ?????????, ???????????? ????????? ??????
        // ?????????????????? ????????? 1???????????? Fix
        // ?????? : grid1??? HTML?????? ???????????? ????????? #grid1??? ???????????? ?????????, Behind ????????? @ViewChild??? DxDataGridComponent??? ???????????? ??????.
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  // ??????
  async onSearchSub(key: number, gridNm: string): Promise<void> {
    // ?????? ?????? ?????? ?????? ?????? ??????
    if (key) {
      // Service??? get ?????? ??????
      const result = await this.service.get({userId: key});
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {

        this.subTreeList.instance.cancelEditData();
        this.utilService.notify_success('????????? ?????????????????????.');
        // ?????? ?????? ??? ?????? ????????? ArrayStore??? ?????????, Key??? ?????? DB??? Key??? ??????
        // Front?????? ???????????? CRUD??? ????????? ??? ??? ??????.
        // Grid1

        if (gridNm !== 'popup') {
          this.subGridEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.treeKey/*['appUid', 'menuL1Uid', 'menuL2Uid']*/
            }
          );
          // ArrayStore - DataSource??? ?????????.
          // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
          this.subGridDataSource = new DataSource({
            store: this.subGridEntityStore
          });
        } else {
          this.popupSubEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.treeKey/*['appUid', 'menuL1Uid', 'menuL2Uid']*/
            }
          );
          // ArrayStore - DataSource??? ?????????.
          // ???????????? ???????????? ???????????? Reload????????? ??? ??? ??????.
          this.popupSubGridDataSource = new DataSource({
            store: this.popupSubEntityStore
          });
        }

        this.subTreeList.focusedRowKey = null;
        this.subTreeList.paging.pageIndex = 0;
      }
    }
  }

  async saveAdmin(): Promise<void> {
    const confirmMsg = this.utilService.convert('com.confirm.save', this.utilService.convert('???????????????'));
    if (!await this.utilService.confirm(confirmMsg)) {
      return;
    }

    const saveData = this.collectGridDataForAdmin(this.changes1);

    await this.mainGrid.instance.saveEditData();

    const result = await this.service.saveAdmin(saveData);
    if (result.success) {
      this.utilService.notify_success('????????? ?????????????????????.');
      await this.onSearch('main');
    } else {
      this.utilService.notify_error('????????? ?????????????????????.');
    }
  }

  async saveClick(): Promise<void> {
    const columns = [];    // required ?????? dataField ??????
    // const changeData = [];

    const grid1Idx = this.mainGrid.focusedRowIndex;
    const grid1Key = this.mainGrid.instance.getKeyByRowIndex(grid1Idx);

    for (const obj of this.changes2) {
      this.subTreeList.instance.byKey(obj.key).then(r => {
        obj.data.appId = r.appId;
        obj.data.uid = r.uid;
      });
    }

    const tempData = this.collectGridData(this.changes2, grid1Key);
    for (const item of tempData) {

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

    await this.mainGrid.instance.saveEditData();
    await this.subTreeList.instance.saveEditData();
    // const saveData = changeData;
    const result = await this.service.save(tempData);
    if (result.success) {
      this.utilService.notify_success('????????? ?????????????????????.');
      await this.onSearch('main');
    } else {
      this.utilService.notify_error('????????? ?????????????????????.');
    }
  }

  collectGridDataForAdmin(changes: any): any[] {
    const gridList = [];
    for (const rowIndex in changes) {
      // Insert??? ?????? UUID??? ????????? ?????? ????????? Null??? ????????????.
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

  collectGridData(changes: any, userId: number): any[] {
    const gridList = [];
    // tslint:disable-next-line:forin
    for (const rowIndex in changes) {

      const rowIdx = this.subTreeList.instance.getRowIndexByKey(changes[rowIndex].key);
      // changes[rowIndex].data.appId = this.subTreeList.instance.cellValue(rowIdx, 'appId');
      changes[rowIndex].data.userId = userId;

      if (changes[rowIndex].type === 'insert' || !changes[rowIndex].data.uid) {
        gridList.push(Object.assign({
          operType: /*changes[rowIndex].type*/'insert',
          uid: null,
          tenant: this.G_TENANT
        }, changes[rowIndex].data));
      } else if (changes[rowIndex].type === 'remove') {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].data.uid}, changes[rowIndex].data)
        );
      } else {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].data.uid}, changes[rowIndex].data
          )
        );
      }
    }
    return gridList;
  }

  copyAuth(e): void {
    const grid1Idx = this.mainGrid.focusedRowIndex;
    const grid1Key = this.mainGrid.instance.getKeyByRowIndex(grid1Idx);

    if (grid1Idx === -1) {
      return;
    }

    this.showPopup('Add', {userId: grid1Key});
  }

  async popupSaveClick(): Promise<void> {
    const grid1Idx = this.popupMainGrid.focusedRowIndex;
    this.popupData.popupUserId = this.popupMainGrid.instance.getKeyByRowIndex(grid1Idx);
    const result = await this.service.copyAuth(this.popupData);

    if (result.success) {
      this.utilService.notify_success('????????? ?????????????????????.');
    } else {
      this.utilService.notify_error('????????? ?????????????????????.');
    }

    this.popupVisible = false;
    this.onSearch('main');
  }

  popupCancelClick(): void {
    this.popupVisible = false;
    this.popupForm.instance.resetValues();
    this.onSearch('main');
  }

  popupShown(e): void {
    this.onSearch('popup');
  }

  // Popup ??????
  showPopup(popupMode, data): void {
    this.popupData = data;
    this.popupData = {tenant: this.G_TENANT, ...this.popupData};
    this.popupMode = popupMode;
    this.popupVisible = true;
  }

  onEditingStart(e): void {
    // ????????????????????? ????????? ?????? ????????????
    if (e.data.appId < 0) {
      e.cancel = true;
    }
  }

  onTreeListDblClick(e): void {
    // ????????? ????????? ????????? ??????
    if (!e.node.hasChildren) {
      return;
    }

    if (e.component.isRowExpanded(e.key)) {
      e.component.collapseRow(e.key);
    } else {
      e.component.expandRow(e.key);
    }
  }

  onSelectionChanged(): void {
  }
}
