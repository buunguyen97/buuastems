import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {SoDetailVO, SoService, SoVO} from './so.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {COMMONINITSTR} from '../../../shared/constants/commoninitstr';

@Component({
  selector: 'app-so',
  templateUrl: './so.component.html',
  styleUrls: ['./so.component.scss']
})
export class SoComponent implements OnInit, AfterViewInit {

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('deleteBtn', {static: false}) deleteBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  // Global
  G_TENANT: any;

  // ***** main ***** //
  // Form
  mainFormData = {};
  // Grid
  mainDataSource: DataSource;
  mainEntityStore: ArrayStore;
  mainKey = 'uid';
  selectedRows: number[];
  // ***** main ***** //

  // ***** popup ***** //
  popupMode = 'Add';
  // Form
  popupFormData: SoVO;
  // Grid
  popupDataSource: DataSource;
  popupEntityStore: ArrayStore;
  popupKey = 'uid';
  codeList: SoDetailVO[];

  // Changes
  popupChanges = [];
  // ***** popup ***** //

  // DataSet
  dsYN = [];
  dsSoType = [];
  dsOwner = [];
  dsWarehouse = [];
  dsSoStatus = [];
  dsItemAdmin = [];
  dsItemId = [];
  dsCompany = [];
  dsShipTo = [];
  dsCountry = [];
  dsPort = [];
  copyPort = [];
  dsUser = [];
  dsDeliveryType = [];

  // summary
  searchList = [];

  changedCompanyCheck = true;
  shownFlag = false;

  GRID_STATE_KEY = 'so_so';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');

  constructor(public utilService: CommonUtilService,
              private service: SoService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService
  ) {
    this.onSelectionChangedCountry = this.onSelectionChangedCountry.bind(this);
    this.onSelectionChangedCompany = this.onSelectionChangedCompany.bind(this);
    this.getFilteredItemId = this.getFilteredItemId.bind(this);
    this.setIsSerial = this.setIsSerial.bind(this);
    this.calculateCustomSummary = this.calculateCustomSummary.bind(this);
  }

  ngOnInit(): void {
    this.G_TENANT = this.utilService.getTenant();
    this.initCode();
    this.inputDataSource([], 'main');
  }

  ngAfterViewInit(): void {
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getGridHeight(this.mainGrid);
    this.initData(this.mainForm);
    this.inputDataSource(this.codeList, 'popup');
  }

  initCode(): void {

    // 화주
    this.codeService.getCompany(this.G_TENANT, true, null, null, null, null, null, null).subscribe(result => {
      this.dsOwner = result.data;
    });

    // 거래처
    this.codeService.getCompany(this.G_TENANT, null, true, null, null, null, null, null).subscribe(result => {
      this.dsCompany = result.data;
    });

    // 납품처
    this.codeService.getCompany(this.G_TENANT, null, null, true, null, null, null, null).subscribe(result => {
      this.dsShipTo = result.data;
    });

    // 창고
    this.codeService.getWarehouse(this.G_TENANT, null, null).subscribe(result => {
      this.dsWarehouse = result.data;
    });

    // 출고유형
    this.codeService.getCode(this.G_TENANT, 'SOTYPE').subscribe(result => {
      this.dsSoType = result.data;
    });

    // 출고상태
    this.codeService.getCode(this.G_TENANT, 'SOSTATUS').subscribe(result => {
      this.dsSoStatus = result.data;
    });

    // 물품
    this.codeService.getItem(this.G_TENANT).subscribe(result => {
      this.dsItemId = result.data;
    });

    // 품목관리사
    this.codeService.getItemAdmin(this.G_TENANT).subscribe(result => {
      this.dsItemAdmin = result.data;
    });

    // 사용여부
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    // 국가
    // this.codeService.getCodeOrderByCode(this.G_TENANT, 'COUNTRY').subscribe(result => {
    //   this.dsCountry = result.data;
    // });

    // 항구
    this.codeService.getCode(this.G_TENANT, 'PORT').subscribe(result => {
      this.copyPort = result.data;
    });

    // 사용자
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });

    // 운송구분
    this.codeService.getCode(this.G_TENANT, 'SODELIVERYTYPE').subscribe(result => {
      this.dsDeliveryType = result.data;
    });
  }

  inputDataSource(inputData, type): void {

    this[type + 'EntityStore'] = new ArrayStore({
        data: inputData,
        key: this[type + 'Key']
      }
    );

    this[type + 'DataSource'] = new DataSource({
      store: this[type + 'EntityStore']
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get(this.mainFormData);
      this.searchList = result.data;

      if (this.resultMsgCallback(result, 'Search')) {
        await this.inputDataSource(result.data, 'main');
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  onOptionChanged(e): void {
    this.gridUtil.onOptionChangedForSummary(e, this); // 합계 계산
  }

  calculateCustomSummary(options): void {
    this.gridUtil.setCustomSummary(options, this.mainGrid, this);
  }


  // 팝업 열기
  async onPopupOpen(e): Promise<void> {
    this.inputDataSource([], 'popup');

    if (e.element.id === 'Open') {
      this.deleteBtn.visible = false;
      this.popupMode = 'Add';
      await this.onPopupInitData();
    } else {
      this.deleteBtn.visible = true;
      this.popupMode = 'Edit';
      this.changedCompanyCheck = false;
      await this.onPopupSearch(e.data);
    }

    if (this.shownFlag) {
      this.changeDisabled(this.deleteBtn.visible, !e.data ? '100' : e.data.sts);
    }
    this.popup.visible = true;
  }

  // 생성시 초기데이터
  async onPopupInitData(): Promise<void> {

    this.popupFormData = {
      tenant: this.G_TENANT,
      actFlg: 'Y',
      sts: '100',
      soType: COMMONINITSTR.SO_SOTYPE,
      warehouseId: this.utilService.getCommonWarehouseId(),
      logisticsId: this.utilService.getCommonWarehouseVO().logisticsId,
      ownerId: this.utilService.getCommonOwnerId(),
      shipSchDate: this.utilService.getFormatDate(new Date()),
      deliveryType: 'INNER'
    } as SoVO;
  }

  onShown(): void {

    if (!this.shownFlag) {
      this.changeDisabled(this.popupMode !== 'Add', this.popupMode !== 'Add' ? this.popupFormData.sts : '100');
      this.shownFlag = true;
    }

    this.changedCompanyCheck = true;

    this.popupGrid.instance.repaint();  // 스크롤 제거를 위해 refresh
  }

  // 팝업 닫기
  onPopupClose(): void {
    this.popup.visible = false;
  }

  onPopupAfterClose(): void {
    this.popupForm.instance.resetValues();
    this.popupGrid.instance.cancelEditData();
    this.onSearch();
  }

  onPopupAddRow(): void {

    if (this.popupFormData.sts === '100') {

      this.popupGrid.instance.addRow().then(() => {
        this.setFocusRow(this.popupGrid.instance.getVisibleRows().length - 1);
      });
    }
  }

  onInitNewRowPopup(e): void {
    e.data = {
      tenant: this.utilService.getTenant(),
      // itemAdminId: this.dsItemAdmin.length > 0 ? this.dsItemAdmin[0].uid : null,
      itemAdminId: this.utilService.getCommonItemAdminId(),
      expectQty1: 0, allocQty1: 0, pickedQty1: 0, shippedQty1: 0, adjustQty1: 0,
      lotReserveFlg: 'N', damageFlg: 'N'
    };
  }

  async onPopupDeleteRow(): Promise<void> {

    if (this.popupFormData.sts === '100') {

      if (this.popupGrid.focusedRowIndex > -1) {
        this.popupGrid.instance.deleteRow(this.popupGrid.focusedRowIndex);
        this.popupEntityStore.push([{type: 'remove', key: this.popupGrid.focusedRowKey}]);
        this.setFocusRow(this.popupGrid.focusedRowIndex - 1);
      }
    }
  }

  async onPopupSearch(data): Promise<void> {
    const result = await this.service.getPopup(data);

    if (this.resultMsgCallback(result, 'PopupSearch')) {
      this.popupFormData = result.data;
      this.inputDataSource(result.data.soDetailList, 'popup');
    }
  }

  changeDisabled(type, sts): void {
    const editorList = ['soType', 'shipSchDate', 'deliveryType', 'remarks',
      'companyId', 'shipToId', 'refName', 'phone',
      'countrycd', 'port', 'zip', 'email', 'address1', 'address2'];

    if (type) { // type Add, Edit

      if (sts === '100') {
        this.popupGrid.editing.allowUpdating = true;

        editorList.forEach(el => {
          this.popupForm.instance.getEditor(el).option('disabled', !type);
        });
      } else {
        this.popupGrid.editing.allowUpdating = false;
        this.deleteBtn.visible = false;

        editorList.forEach(el => {
          this.popupForm.instance.getEditor(el).option('disabled', type);
        });
      }
    } else {
      this.popupGrid.editing.allowUpdating = false;

      editorList.forEach(el => {
        this.popupForm.instance.getEditor(el).option('disabled', type);
      });
    }
    this.popupGrid.focusedRowKey = null;
    this.popupGrid.paging.pageIndex = 0;
  }

  async onPopupSave(): Promise<void> {
    const popData = this.popupForm.instance.validate();
    const detailList = await this.collectDetail(this.popupChanges);

    if (popData.isValid) {
      let result;
      this.popupFormData.soDetailList = detailList;

      if (this.popupGrid.instance.getVisibleRows().length === 0) {
        this.utilService.notify_error(this.utilService.convert('com_valid_required', this.utilService.convert('so_so_popupGridTitle')));
        return;
      }
      const visibleRows = this.popupGrid.instance.getVisibleRows();
      let checkCell = false;

      for (const row of visibleRows) {
        const CELLS = 'cells';

        for (const cell of row[CELLS]) {
          const dField = cell.column.dataField;

          if (dField === 'itemAdminId' || dField === 'itemId') {

            if (!cell.value) {
              checkCell = true;
              this.setFocusRow(row.rowIndex);
              this.utilService.notify_error(this.utilService.convert('com_valid_required', this.utilService.convert('so_so_' + dField)));
              break;
            }
          } else if (dField === 'expectQty1') {

            if (cell.value <= 0) {
              checkCell = true;
              this.setFocusRow(row.rowIndex);
              this.utilService.notify_error(this.utilService.convert('so_valid_qtygt', this.utilService.convert('so_so_expectQty1'), '0'));
              break;
            }
          }
        }

        if (checkCell) {
          break;
        }
      }

      if (checkCell) {
        return;
      }
      const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('com_btn_save'));

      if (!await this.utilService.confirm(confirmMsg)) {
        return;
      }

      if (this.popupMode === 'Add') {
        result = await this.service.save(this.popupFormData);
      } else {
        result = await this.service.update(this.popupFormData);
      }

      if (this.resultMsgCallback(result, 'Save')) {
        this.popupFormData = result.data;
        this.onPopupClose();
      }
    }
  }

  async onPopupDelete(): Promise<void> {
    const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('com_btn_del'));

    if (!await this.utilService.confirm(confirmMsg)) {
      return;
    }

    const result = await this.service.delete(this.popupFormData);

    if (this.resultMsgCallback(result, 'Delete')) {
      this.onPopupClose();
    }
  }

  resultMsgCallback(result, msg): boolean {

    if (result.success) {
      this.utilService.notify_success(msg + ' success');
    } else {
      this.utilService.notify_error(result.msg);
    }
    return result.success;
  }

  async collectDetail(changes: any): Promise<any[]> {
    const detailList: any[] = [];

    for (const rowIndex in changes) {
      // Insert일 경우 UUID가 들어가 있기 때문에 Null로 매핑한다.
      if (changes[rowIndex].type === 'insert') {
        detailList.push(Object.assign({operType: changes[rowIndex].type, uid: null}, changes[rowIndex].data));
      } else if (changes[rowIndex].type === 'remove') {
        detailList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data
          )
        );
      } else {
        detailList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data
          )
        );
      }
    }
    return detailList;
  }

  onSelectionChangedCompany(e): void {  // 거래처 코드
    const companyData = [...this.dsCompany].filter(el => el.uid === e.value);

    if (companyData.length > 0) {

      if (this.popup.visible && this.changedCompanyCheck) {
        const formList = ['refName', 'email', 'phone', 'countrycd', 'port', 'zip', 'address1', 'address2'];

        if (!e.value) {

          formList.forEach(el => {
            this.popupFormData[el] = null;
          });
        } else {

          formList.forEach(el => {

            if (!companyData[0][el === 'phone' ? 'phone1' : el]) {
              this.popupFormData[el] = null;
            } else {
              this.popupFormData[el] = companyData[0][el === 'phone' ? 'phone1' : el];
            }
          });
        }
      }
    }
  }

  onFocusedCellChangedPopupGrid(e): void {
    this.setFocusRow(e.rowIndex);
  }

  setFocusRow(index): void {
    this.popupGrid.focusedRowIndex = index;
  }

  onReset(): void {
    this.mainForm.instance.resetValues();
    this.initData(this.mainForm);
  }

  initData(form): void {
    const rangeDate = this.utilService.getDateRange();

    form.formData = {
      tenant: this.G_TENANT,
      sts: '100',
      fromShipSchDate: rangeDate.fromDate,
      toShipSchDate: rangeDate.toDate,
      warehouseId: this.utilService.getCommonWarehouseId(),
      ownerId: this.utilService.getCommonOwnerId()
    };
    form.instance.focus();
  }

  setItemAdminValue(rowData: any, value: any): void {
    rowData.itemAdminId = value;
    rowData.itemId = null;
  }

  getFilteredItemId(options): any {
    const filterSoType = this.dsSoType.filter(el => el.code === this.popupFormData.soType);

    const filter = [];
    console.log(filterSoType);
    filter.push(['itemAdminId', '=', this.utilService.getCommonItemAdminId()]);

    if (filterSoType.length > 0) {
      filter.push('and');
      const etcColumn1 = filterSoType[0].etcColumn1;
      const typeArr = (etcColumn1 || '').split(',');

      const innerCond = [];
      // tslint:disable-next-line:forin
      for (const idx in typeArr) {
        const type = typeArr[idx].trim();
        innerCond.push(['itemTypecd', '=', type]);

        if (Number(idx) !== typeArr.length - 1) {
          innerCond.push('or');
        }
      }

      filter.push(innerCond);
    }
    return {
      store: this.dsItemId,
      filter: options.data ? filter : null
      // filter: options.data ? ['itemAdminId', '=', this.utilService.getCommonItemAdminId()] : null
    };
  }

  setIsSerial(row: any, value: any): void {
    row.itemId = value;
    row.unit = value;
    row.isSerial = this.dsItemId.filter(el => el.uid === value)[0].isSerial;
  }

  onSelectionChangedCountry(e): void {
    this.dsPort = this.copyPort.filter(el => el.etcColumn1 === e.value);
  }

  // onEditorPreparing(e): void {
  //
  //   if (e.dataField === 'itemAdminId' || e.dataField === 'itemAdmin' || e.dataField === 'expectQty1') {
  //
  //     e.editorOptions.onChange = (a) => {
  //       console.log(a);
  //       console.log(e);
  //     };
  //   }
  // }
  //
  // onRowValidating(e): void  {
  //   console.log(e);
  //   console.log(e.newData);
  // }
}
