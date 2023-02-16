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

  // 팝업
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
    // ArrayStore - DataSource와 바인딩.
    // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
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

  // 그리드 툴바
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
        text: this.utilService.convert1('권한복사', '권한복사'),
        height: '26px',
        onClick: this.copyAuth.bind(this)
      }
    });

    newToolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'copy',
        text: this.utilService.convert1('관리자저장', '관리자저장'),
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
        text: this.utilService.convert1('Y 선택', 'Y 선택'),
        height: '26px',
        onClick: this.chooseVisibleY.bind(this)
      }
    });

    toolbarItems.push({
      location: 'after',
      widget: 'dxButton',
      options: {
        text: this.utilService.convert1('N 선택', 'N 선택'),
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

  // 그리드 셀 이동시 호출하는 함수
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

  // 조회
  async onSearch(gridNm: string): Promise<void> {

    this.subGridEntityStore = new ArrayStore(
      {
        data: [],
        key: this.treeKey
      }
    );
    // ArrayStore - DataSource와 바인딩.
    // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
    this.subGridDataSource = new DataSource({
      store: this.subGridEntityStore
    });

    // 조회패널에 필수컬럼에 값 있는지 체크
    const data = this.mainForm.instance.validate();
    // 값이 모두 있을 경우 조회 호출
    if (data.isValid) {
      const userType = this.mainGrid.instance.cellValue(this.mainGrid.focusedRowIndex, 'userType');
      let paramData;

      if (gridNm === 'popup') {
        paramData = Object.assign({userType}, this.mainFormData);
      } else {
        paramData = this.mainFormData;
      }
      const result = await this.service.getUsers(paramData);

      // 조회 결과가 success이면 화면표시, 실패면 메시지 표시
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        await this.mainGrid.instance.deselectAll();
        this.mainGrid.instance.cancelEditData();
        await this.utilService.notify_success('조회에 성공하였습니다.');
        // 조회 성공 시 해당 내역을 ArrayStore에 바인딩, Key는 실제 DB의 Key를 권장
        // Front에서 데이터의 CRUD를 컨트롤 할 수 있음.
        // Grid1

        if (gridNm !== 'popup') {
          this.mainEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.key
            }
          );
          // ArrayStore - DataSource와 바인딩.
          // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
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
          // ArrayStore - DataSource와 바인딩.
          // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
          this.popupMainGridDataSource = new DataSource({
            store: this.popupMainEntityStore
          });
        }

        // 그리드 상태가 수시로 저장되어 포커스가 있을경우 해당 포커스로 강제 페이지 이동되기 때문에, 그리드의 포커스 없앰
        // 페이징번호도 강제로 1페이지로 Fix
        // 참고 : grid1은 HTML에서 그리드의 이름이 #grid1로 명시되어 있으며, Behind 상단에 @ViewChild에 DxDataGridComponent로 선언되어 있음.
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  // 조회
  async onSearchSub(key: number, gridNm: string): Promise<void> {
    // 값이 모두 있을 경우 조회 호출
    if (key) {
      // Service의 get 함수 생성
      const result = await this.service.get({userId: key});
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {

        this.subTreeList.instance.cancelEditData();
        this.utilService.notify_success('조회에 성공하였습니다.');
        // 조회 성공 시 해당 내역을 ArrayStore에 바인딩, Key는 실제 DB의 Key를 권장
        // Front에서 데이터의 CRUD를 컨트롤 할 수 있음.
        // Grid1

        if (gridNm !== 'popup') {
          this.subGridEntityStore = new ArrayStore(
            {
              data: result.data,
              key: this.treeKey/*['appUid', 'menuL1Uid', 'menuL2Uid']*/
            }
          );
          // ArrayStore - DataSource와 바인딩.
          // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
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
          // ArrayStore - DataSource와 바인딩.
          // 그리드와 매핑되어 그리드를 Reload하거나 할 수 있음.
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
    const confirmMsg = this.utilService.convert('com.confirm.save', this.utilService.convert('관리자저장'));
    if (!await this.utilService.confirm(confirmMsg)) {
      return;
    }

    const saveData = this.collectGridDataForAdmin(this.changes1);

    await this.mainGrid.instance.saveEditData();

    const result = await this.service.saveAdmin(saveData);
    if (result.success) {
      this.utilService.notify_success('저장에 성공하였습니다.');
      await this.onSearch('main');
    } else {
      this.utilService.notify_error('저장에 실패하였습니다.');
    }
  }

  async saveClick(): Promise<void> {
    const columns = [];    // required 컬럼 dataField 정의
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
      this.utilService.notify_success('저장에 성공하였습니다.');
      await this.onSearch('main');
    } else {
      this.utilService.notify_error('저장에 실패하였습니다.');
    }
  }

  collectGridDataForAdmin(changes: any): any[] {
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
      this.utilService.notify_success('저장에 성공하였습니다.');
    } else {
      this.utilService.notify_error('저장에 실패하였습니다.');
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

  // Popup 관련
  showPopup(popupMode, data): void {
    this.popupData = data;
    this.popupData = {tenant: this.G_TENANT, ...this.popupData};
    this.popupMode = popupMode;
    this.popupVisible = true;
  }

  onEditingStart(e): void {
    // 어플리케이션이 아니면 수정 허용안함
    if (e.data.appId < 0) {
      e.cancel = true;
    }
  }

  onTreeListDblClick(e): void {
    // 마지막 뎁스면 컨트롤 안함
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
