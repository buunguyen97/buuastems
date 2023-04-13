import {Component, OnInit, ViewChild} from '@angular/core';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {Astems24Service} from './astems24.service';

@Component({
  selector: 'app-astems24',
  templateUrl: './astems24.component.html',
  styleUrls: ['./astems24.component.scss']
})

export class Astems24Component implements OnInit {
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('subGrid', {static: false}) subGrid: DxDataGridComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;


  // @ts-ignore
  dataTest = [{
    tenant: 1000,
    rcvKey: '1',
    uid: 1,
    fromRcvSchDate: '20/10/2022',
    toRcvSchDate: '20/10/2022',
    fromReceiveDate: '20/10/2022',
    toReceiveDate: '20/10/2022',
    sts: '취소 된',
    rcvTypecd: '유형 2',
    supplierId: '공급처3',
    warehouseId: '창고 A',
    ownerId: '화주 C',
    acceptKey: 2,
    rcvSchDate: '2/10/2022',
    receiveDate: '2/10/2022',
    rcvSumItemCount: 222000,
    rcvSumQty1: 222000,
    actFlag: 1,
    remarks: 'ABC123',
    createdBy: 'Buu',
    createdDatetime: '13/4/2023',
    modifiedBy: 'Buu',
    modifiedDatetime: '13/4/2023',
  },
    {
      tenant: 1000,
      rcvKey: '2',
      uid: 2,
      fromRcvSchDate: '20/10/2022',
      toRcvSchDate: '20/10/2022',
      fromReceiveDate: '20/10/2022',
      toReceiveDate: '20/10/2022',
      sts: '취소 된',
      rcvTypecd: '유형 2',
      supplierId: '공급처1',
      warehouseId: '창고 D',
      ownerId: '화주 D',
      acceptKey: 2,
      rcvSchDate: '2/10/2022',
      receiveDate: '2/10/2022',
      rcvSumItemCount: 222000,
      rcvSumQty1: 222000,
      actFlag: 1,
      remarks: 'ABC123',
      createdBy: 'Buu',
      createdDatetime: '13/4/2023',
      modifiedBy: 'Buu',
      modifiedDatetime: '13/4/2023',
    }
  ];

  popupDataTest = [{
    uid: 1,
    tenant: 1000,
    itemId: 112,
    unit: 31,
    expectQty1: 30,
    receivedQty1: 4,
    adjustQty1: 5,
    lot1: 'example_lot1',
    lot2: 'example_lot2',
    lot3: 'example_lot3',
    lot4: 'example_lot4',
    lot5: 'example_lot5',
    lot6: 'example_lot6',
    lot7: 'example_lot7',
    lot8: 'example_lot8',
    lot9: 'example_lot9',
    lot10: 'example_lot10',
    damageFlg: 'example_damageFlg',
    noShippingFlg: 'example_noShippingFlg',
    foreignCargoFlg: 'example_foreignCargoFlg',
    customsReleaseFlg: 'example_customsReleaseFlg',
    taxFlg: 'example_taxFlg',
    whInDate: '2023-04-15',
    mngDate: '2023-04-16',
    isSerial: 'example_isSerial',
    createdBy: 'Buu',
    createdDatetime: '13/4/2023',
    modifiedBy: 'Buu',
    modifiedDatetime: '13/4/2023',
  }];
  // Global
  G_TENANT: any;
  pageInfo: any = this.utilService.getPageInfo();

  mainFormData = {};

  // grid
  mainDataSource: DataSource;
  subDataSource: DataSource;
  mainEntityStore: ArrayStore;
  subEntityStore: ArrayStore;
  key = 'uid';

  dsWarehouse = [
    {uid: '창고 A', display: '창고 A'},
    {uid: '창고 B', display: '창고 B'},
    {uid: '창고 C', display: '창고 C'},
    {uid: '창고 D', display: '창고 D'},
  ]; // 창고
  dsItemAdmin = []; // 품목관리사
  dsCompany = []; // 거래처코드
  dsSupplierCountrycd = []; // 거래처코드
  dsSupplierPortcd = []; // 거래처코드
  dsRcvStatus = [
    {code: '받지 못했다', display: '받지 못했다'},
    {code: '받았다', display: '받았다'},
    {code: '취소 된', display: '취소 된'}
  ];
  dsRcvType = [
    {code: '유형 1', display: '유형 1'},
    {code: '유형 2', display: '유형 2'},
    {code: '유형 3', display: '유형 3'}
  ]; // 입고타입
  dsSupplier = [
    {display: '공급처1', code: '공급처1'},
    {display: '공급처2', code: '공급처2'},
    {display: '공급처3', code: '공급처3'},
    // ...
  ];
  dsUser = []; // 사용자
  dsOwner = [
    {uid: '화주 A', display: '화주 A'},
    {uid: '화주 B', display: '화주 B'},
    {uid: '화주 C', display: '화주 C'},
    {uid: '화주 D', display: '화주 D'},
  ];
  dsYN = [];
  changes = [];


  isNewPopup = true;
  popupKey = 'uid';
  GRID_STATE_KEY = 'mm_code';
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');

  constructor(
    public utilService: CommonUtilService,
    private service: Astems24Service,
    private codeService: CommonCodeService,
    public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  initCode(): void {

    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  ngOnInit(): void {
    this.mainEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );
    this.mainDataSource = new DataSource({
      store: this.mainEntityStore
    });

    this.subEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );
    this.subDataSource = new DataSource({
      store: this.subEntityStore
    });

    // this.codeService.getCode(this.G_TENANT, 'RCVSTATUS').subscribe(result => {
    //   this.dsRcvStatus = result.data;
    // });
    // this.codeService.getCode(this.G_TENANT, 'RCVTYPE').subscribe(result => {
    //   this.dsRcvType = result.data;
    // });
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
    // this.codeService.getCode(this.G_TENANT, null).subscribe(result => {
    //   this.dsWarehouse = result.data;
    // });
    // this.codeService.getCode(this.G_TENANT, null).subscribe(result => {
    //   this.dsSupplier = result.data;
    // });
    // this.codeService.getCode(this.G_TENANT, null).subscribe(result => {
    //   this.dsOwner = result.data;
    // });
  }

  // 그리드 품목 선택시 시리얼 여부
  setItemValue(rowData: any, value: any): void {
    rowData.itemId = value;
    rowData.unit = value;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    // this.utilService.fnAccordionExpandAll(this.acrdn);  // 아코디언 모두 펼치기
    // this.utilService.getGridHeight(this.subGrid, 30);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

  }


  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      // const result = await this.service.get(this.mainFormData);
      // const result = await this.service.get(this.mainFormData);
      const result = this.dataTest;
      this.mainEntityStore = new ArrayStore(
        {
          data: result,
          key: this.key
        }
      );
      this.mainDataSource = new DataSource({
        store: this.mainEntityStore
      });
      // this.mainGrid.dataSource = result;
      // if (!result.success) {
      //   this.utilService.notify_error(result.msg);
      //   return;
      // } else {
      //   this.mainGrid.instance.cancelEditData();
      //   this.utilService.notify_success('search success');
      //
      //   this.mainEntityStore = new ArrayStore(
      //     {
      //       data: result.data,
      //       key: this.key
      //     }
      //   );
      //   this.mainDataSource = new DataSource({
      //     store: this.mainEntityStore
      //   });
      //   await this.mainGrid.instance.deselectAll();
      //
      //   // 횡스크롤 제거
      //   this.gridUtil.fnScrollOption(this.mainGrid);
      // }
    }
  }

  // 적치지시

  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
  }

  initForm(): void {
    // from입고예정일자 setter
    const rangeDate = this.utilService.getDateRange();
    this.mainForm.instance.getEditor('fromRcvSchDate').option('value', rangeDate.fromDate);
    this.mainForm.instance.getEditor('toRcvSchDate').option('value', rangeDate.toDate);
    this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
    this.mainForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
    this.mainForm.instance.getEditor('supplierId').option('value', this.utilService.getCompanyId());
    this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCompanyId());
    this.mainForm.instance.getEditor('sts').option('value', '200');
    this.mainForm.instance.focus();
  }

  onNew(e): void {
    this.popup.visible = true;
    this.isNewPopup = true;
    this.popup.title = ('Add');
  }

  onInitNewRow(e): void {
    e.data.tenant = this.G_TENANT;
  }

  onFocusedCellChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);
  }

  onHiddenPopup(e): void {
    this.popupForm.formData = {};
    this.popupForm.instance.repaint();
    this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
    this.popupGrid.instance.cancelEditData();
    this.popupGrid.focusedRowKey = null;
    this.popupGrid.paging.pageIndex = 0;

    this.onSearch().then();
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.visible = true;
    this.popup.title = ('Edit');
    console.log(this.popupForm.instance.getEditor('sts'));
    this.popupForm.instance.getEditor('sts').option('value', e.sts);
    this.popupForm.instance.getEditor('rcvTypecd').option('value', e.rcvTypecd);
    this.popupForm.instance.getEditor('supplierId').option('supplierId', e.rcvTypecd);
    this.popupForm.instance.getEditor('warehouseId').option('warehouseId', e.rcvTypecd);
    this.popupGrid.dataSource = this.utilService.setGridDataSource(this.popupDataTest, this.popupKey);
    this.onSearchPopup(e.data).then();
  }

  async onSearchPopup(eData): Promise<void> {
    this.popupForm.formData = eData;
    this.popupGrid.dataSource = this.utilService.setGridDataSource(eData, this.popupKey);
    // const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
    // const result = await this.service.sendPost(eData, 'findCodeCategoryFull');

    // if (this.utilService.resultMsgCallback(result, executionTxt)) {
    //   this.popupForm.formData = result.data;
    // this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data.codeList, this.popupKey);
    //   this.popup.visible = true;
    // }
  }

  async onSave(e): Promise<void> {
    const popupValidate = this.popupForm.instance.validate();
    const popupFormData = this.popupForm.formData;
    // const detailList = this.collectGridData(this.changes);
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (popupValidate.isValid) {
      // let result;
      popupFormData.tenant = this.G_TENANT;
      // popupFormData.codeList = detailList;

      if (this.isNewPopup) {
        // result = await this.service.sendPost(popupFormData, 'saveRcvExpected');
        console.log('Add');
      } else {
        // result = await this.service.sendPost(popupFormData, 'updateRcvExpected');
        console.log('Update');
      }

      // if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.popup.visible = false;
      this.onSearch().then();
      // }
    }
  }

  async onDelete(e): Promise<void> {
    const popupFormData = this.popupForm.formData;
    const executionTxt = this.utilService.convert1('com.btn.del', '삭제');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      // const result = await this.service.sendPost(popupFormData, 'deleteCodeCategory');

      // if (this.utilService.resultMsgCallback(result, executionTxt)) {
      //   this.popup.visible = false;
      // }
    }
  }

  onClose(e): void {
    this.popup.visible = false;
  }

  addClick(): void {

    this.popupGrid.instance.addRow().then(() => {
        const rowIdx = this.popupGrid.instance.getRowIndexByKey(this.changes[this.changes.length - 1].key);
        this.setFocusRow(rowIdx, this.popupGrid);
      }
    );
  }

  async deleteClick(): Promise<void> {
    const focusedRowIdx = this.popupGrid.focusedRowIndex;

    if (focusedRowIdx > -1) {
      this.popupGrid.instance.deleteRow(focusedRowIdx);
      this.popupGrid.instance.getDataSource().store().push([{type: 'remove', key: this.popupGrid.focusedRowKey}]);
      this.setFocusRow(focusedRowIdx - 1, this.popupGrid);
    }
  }

  setFocusRow(index, grid): void {
    grid.focusedRowIndex = index;
  }
}
