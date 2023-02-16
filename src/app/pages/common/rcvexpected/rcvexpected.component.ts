import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {RcvexpectedService, RcvExpectedVO} from './rcvexpected.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {RcvCommonUtils} from '../rcvCommonUtils';

@Component({
  selector: 'app-rcvexpected',
  templateUrl: './rcvexpected.component.html',
  styleUrls: ['./rcvexpected.component.scss']
})
export class RcvexpectedComponent implements OnInit, AfterViewInit {

  constructor(public utilService: CommonUtilService,
              private service: RcvexpectedService,
              private codeService: CommonCodeService,
              public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();

    this.popupSaveClick = this.popupSaveClick.bind(this);
    this.popupCancelClick = this.popupCancelClick.bind(this);
    this.popupDeleteClick = this.popupDeleteClick.bind(this);
    this.onSelectionChangedWarehouse = this.onSelectionChangedWarehouse.bind(this);
    this.onChangeSupplier = this.onChangeSupplier.bind(this);
    this.getFilteredItemId = this.getFilteredItemId.bind(this);
    this.setItemValue = this.setItemValue.bind(this);
    this.onSelectionChangedCountry = this.onSelectionChangedCountry.bind(this);
    this.isAllowEditing = this.isAllowEditing.bind(this);
    this.calculateCustomSummary = this.calculateCustomSummary.bind(this);
  }

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('deleteBtn', {static: false}) deleteBtn: DxButtonComponent;
  @ViewChild('saveBtn', {static: false}) saveBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  dsActFlg = []; // 사용여부
  dsRcvStatus = []; // 입고상태
  dsRcvType = []; // 입고타입
  dsCountry = []; // 국가
  dsWarehouse = []; // 창고
  dsPort = []; // 항구 필터
  copyPort = []; // 전체 항구
  dsOwner = []; // 화주
  dsSupplier = []; // 공급처
  dsItemAdmin = []; // 품목관리사
  dsItemId = []; // 품목
  dsUser = []; // 사용자
  dsUnitStyle = []; // 단위유형
  dsFilteredItemId = [];

  // Global
  G_TENANT: any;

  mainFormData: RcvExpectedVO = {} as RcvExpectedVO;

  // Grid Popup
  popupVisible = false;
  popupMode = 'Add';
  popupData: RcvExpectedVO;

  // grid
  dataSource: DataSource;
  popupDataSource: DataSource;
  entityStore: ArrayStore;
  popupEntityStore: ArrayStore;
  selectedRows: number[];
  deleteRowList = [];
  changes = [];
  key = 'uid';

  // summary
  searchList = [];

  // Grid State
  GRID_STATE_KEY = 'rcv_rcvexpected1';
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');

  supplierChangedFlg = true;  // 공급처 선택이벤트 활성화 여부
  portChangedFlg = true;

  /**
   *  초기화 메소드 START
   */
  ngOnInit(): void {
    this.entityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );
    this.dataSource = new DataSource({
      store: this.entityStore
    });

    // 사용여부
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsActFlg = result.data;
    });

    // 입고상태
    this.codeService.getCode(this.G_TENANT, 'RCVSTATUS').subscribe(result => {
      this.dsRcvStatus = result.data;
    });

    // 입고타입
    this.codeService.getCode(this.G_TENANT, 'RCVTYPE').subscribe(result => {
      this.dsRcvType = result.data;
    });

    // 국가
    // this.codeService.getCodeOrderByCode(this.G_TENANT, 'COUNTRY').subscribe(result => {
    //   this.dsCountry = result.data;
    // });

    // 창고
    this.codeService.getCommonWarehouse(Number(this.utilService.getUserUid())).subscribe(result => {
      this.dsWarehouse = result.data;
    });

    // 화주(공통 화주)
    this.codeService.getCommonOwner(Number(this.utilService.getUserUid())).subscribe(result => {
      this.dsOwner = result.data;
    });

    // 항구
    this.codeService.getCode(this.G_TENANT, 'PORT').subscribe(result => {
      this.copyPort = result.data;
    });

    // 공급처(isSupplier is True)
    this.codeService.getCompany(this.G_TENANT, null, null, null, true, null, null, null).subscribe(result => {
      this.dsSupplier = result.data;
    });

    // 품목관리사
    this.codeService.getItemAdmin(this.G_TENANT).subscribe(result => {
      this.dsItemAdmin = result.data;
    });

    // 전체 품목
    this.codeService.getItem(this.G_TENANT).subscribe(result => {
      this.dsItemId = result.data;
      this.dsFilteredItemId = this.dsItemId.filter(el => el.itemAdminId === this.utilService.getCommonItemAdminId());
    });

    // 사용자
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'UNITSTYLE').subscribe(result => {
      this.dsUnitStyle = result.data;
    });
  }

  ngAfterViewInit(): void {
    // 팝업 그리드 초기화
    this.popupEntityStore = new ArrayStore(
      {
        data: [], key: this.key
      }
    );

    this.popupDataSource = new DataSource({
      store: this.popupEntityStore
    });

    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    this.utilService.getGridHeight(this.mainGrid);
  }

  // changes -> savedata 변환
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

  // search Form 초기화
  initForm(): void {

    // 공통 조회 조건 set
    const rangeDate = this.utilService.getDateRange();

    this.mainForm.instance.getEditor('fromRcvSchDate').option('value', rangeDate.fromDate);
    this.mainForm.instance.getEditor('toRcvSchDate').option('value', rangeDate.toDate);
    this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
    this.mainForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
    this.mainForm.instance.getEditor('sts').option('value', RcvCommonUtils.STS_IDLE); // 예정
    this.mainForm.instance.focus();
  }

  // 그리드 Lookup filter
  getFilteredItemId(options): any {
    const filtredRcvType = this.dsRcvType.filter(el => el.code === this.popupData.rcvTypecd);

    const filter = [];
    filter.push(['itemAdminId', '=', this.utilService.getCommonItemAdminId()]);


    if (filtredRcvType.length > 0) {
      filter.push('and');
      const etcColumn1 = filtredRcvType[0].etcColumn1;
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
    };
  }

  // 그리드 품목관리사 value setter
  setItemAdminValue(rowData: any, value: any): void {
    rowData.itemAdminId = value;
    rowData.itemId = null;
    rowData.unit = null;
  }

  // 그리드 품목 선택시 시리얼 여부
  setItemValue(rowData: any, value: any): void {
    rowData.itemId = value;
    rowData.isSerial = this.dsItemId.filter(el => el.uid === value)[0].isSerial;          // 시리얼여부
    rowData.unit = value;
  }

  /**
   *  초기화 메소드 END
   */

  /**
   *  조회 메소드 START
   */
  // 메인 그리드 조회
  async onSearch(): Promise<void> {

    const data = this.mainForm.instance.validate();
    if (data.isValid) {

      const result = await this.service.get(this.mainFormData);
      this.searchList = result.data;
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.mainGrid.instance.cancelEditData();
        this.utilService.notify_success('search success');
        this.entityStore = new ArrayStore(
          {
            data: result.data,
            key: this.key
          }
        );
        this.dataSource = new DataSource({
          store: this.entityStore
        });
        await this.mainGrid.instance.deselectAll();
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  // 팝업 그리드 조회
  async onSearchPopup(): Promise<void> {
    if (this.popupData.uid) {
      // Service의 get 함수 생성
      const result = await this.service.getRcvFull(this.popupData);

      // for (const r of result.data.rcvDetailList) {
      //   const item = this.dsItemId.filter(el => el.uid === r.itemId);
      //   r.unit3Stylecd = item.length > 0 ? item[0].unit3Stylecd : null;
      // }
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.popupGrid.instance.cancelEditData();
        this.utilService.notify_success('search success');

        this.popupData.moveId = result.data.moveId;

        this.popupEntityStore = new ArrayStore(
          {
            data: result.data.rcvDetailList,
            key: this.key
          }
        );
        this.popupDataSource = new DataSource({
          store: this.popupEntityStore
        });
        this.popupGrid.focusedRowKey = null;
        this.popupGrid.paging.pageIndex = 0;
      }
    }
  }

  /**
   *  조회 메소드 END
   */

  /**
   *  이벤트 메소드 START
   */
  // 신규버튼 이벤트
  async onNew(e): Promise<void> {
    this.deleteBtn.visible = false;
    this.showPopup('Add', {...e.data});
  }

  // 저장버튼 이벤트
  async popupSaveClick(e): Promise<void> {

    const confirmMsg = this.utilService.convert('confirmSave', this.utilService.convert1('rcvTx', '입고전표'));
    if (!await this.utilService.confirm(confirmMsg)) {
      return;
    }

    // 상품목록 추가여부
    if ((this.popupGrid.instance.totalCount() + this.changes.length) === 0) {
      // '입고상품 목록을 추가하세요.'
      const msg = this.utilService.convert('com_valid_required', this.utilService.convert('rcvExpect_popupGridTitle'));
      this.utilService.notify_error(msg);
      return;
    }

    // 선택한 화주를 품목에 세팅
    const items = this.popupDataSource.items() || [];
    const ownerId = this.popupForm.instance.getEditor('ownerId').option('value');

    for (const item of this.changes) {
      if (item.type !== 'remove') {
        item.data.ownerId = ownerId;
      }
    }

    for (const item of items) {
      const rowIdx = this.popupGrid.instance.getRowIndexByKey(item.uid);
      this.popupGrid.instance.cellValue(rowIdx, 'ownerId', ownerId);
    }

    const messages = {
      temAdminId: 'rcvDetail.itemAdminId',
      itemId: 'rcvDetail.itemId',
      expectQty1: 'rcvDetail.expectQty1',
      whInDate: 'rcvDetail.whInDate'
    };
    const columns = ['itemAdminId', 'itemId', 'expectQty1', 'whInDate'];    // required 컬럼 dataField 정의
    const popData = this.popupForm.instance.validate();
    if (popData.isValid) {
      try {
        let result;
        const saveContent = this.popupData as RcvExpectedVO;
        const detailList = this.collectGridData(this.changes);

        for (const detail of detailList) {
          if (detail.expectQty1 <= 0) {
            // '입고예정수량을 1개 이상 입력하세요.'
            const msg = this.utilService.convert1('gt_expectQty', '입고예정수량을 1개 이상 입력하세요.');
            this.utilService.notify_error(msg);
            return;
          }
        }

        for (const item of detailList) {
          if (!item.key && !item.uid) {
            for (const col of columns) {
              if ((item[col] === undefined) || (item[col] === '')) {
                this.utilService.notify_error(this.utilService.convert('com_valid_required', this.utilService.convert(messages[col])));
                return;
              }
            }
          }

          this.popupGrid.instance.byKey(item.key).then(
            (dataItem) => {
              for (const col of columns) {
                if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
                  this.utilService.notify_error(this.utilService.convert('com_valid_required', this.utilService.convert(messages[col])));
                  return;
                }
              }
            }
          );
        }

        saveContent.rcvDetailList = detailList;

        if (this.popupMode === 'Add') {
          result = await this.service.save(saveContent);
        } else {
          result = await this.service.update(saveContent);
        }
        if (!result.success) {
          this.utilService.notify_error(result.msg);
          return;
        } else {
          this.utilService.notify_success('Save success');
          this.popupForm.instance.resetValues();
          this.popupVisible = false;
          this.onSearch();
        }
      } catch {
        this.utilService.notify_error('There was an error!');
      }
    }
  }

  // 그리드 더블클릭시 호출하는 함수
  rowDblClick(e): void {
    this.deleteBtn.visible = true;
    this.supplierChangedFlg = false;
    this.portChangedFlg = false;
    // Row double 클릭시 이벤트에서 해당 Row에 대한 이벤트를 접근할 수 있다.
    this.showPopup('Edit', {...e.data});
  }

  // 그리드 셀 이동시 호출하는 함수
  onFocusedCellChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);
  }

  setFocusRow(index, grid): void {
    grid.focusedRowIndex = index;
  }

  // 창고 선택 이벤트
  onSelectionChangedWarehouse(e): void {  // 창고코드
    const findValue = this.dsWarehouse.filter(code => code.uid === e.value);

    this.popupData.companyId = this.utilService.getCommonOwnerId();
    this.popupData.logisticsId = findValue.length > 0 ? findValue[0].logisticsId : null;
  }

  // 공급처 선택 이벤트
  async onChangeSupplier(e): Promise<void> {
    const filtered = this.dsSupplier.filter(el => el.uid === e.value);
    if (filtered.length > 0 && this.supplierChangedFlg) {
      const data = filtered[0];
      this.popupForm.instance.getEditor('refName').option('value', data.refName);
      this.popupForm.instance.getEditor('supplierPhone').option('value', data.phone1);
      this.popupForm.instance.getEditor('supplierCountrycd').option('value', data.countrycd);
      this.popupForm.instance.getEditor('supplierPortcd').option('value', '');
      this.popupForm.instance.getEditor('supplierZip').option('value', data.zip);
      this.popupForm.instance.getEditor('supplierAddress1').option('value', data.address1);
      this.popupForm.instance.getEditor('supplierAddress2').option('value', data.address2);
    }
  }

  // 국가 선택시 항구 필터
  onSelectionChangedCountry(e): void {
    this.dsPort = this.copyPort.filter(el => el.etcColumn1 === (e ? e.value : this.popupData.supplierCountrycd));
    if (this.portChangedFlg) {
      this.popupData.supplierPortcd = null; // 국가 선택시 항구 초기화
    }
  }

  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
  }

  onOptionChanged(e): void {
    this.gridUtil.onOptionChangedForSummary(e, this); // 합계 계산
  }

  calculateCustomSummary(options): void {
    this.gridUtil.setCustomSummary(options, this.mainGrid, this);
  }

  /**
   *  이벤트 메소드 END
   */

  /**
   *  팝업 메소드 START
   */
  showPopup(popupMode, data): void {
    this.changes = [];  // 초기화
    this.popupEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );

    this.popupDataSource = new DataSource({
      store: this.popupEntityStore
    });

    this.popupData = data;
    this.popupData = {tenant: this.G_TENANT, ...this.popupData};
    this.popupMode = popupMode;
    this.popupVisible = true;
    this.onSearchPopup();
  }

  isAllowEditing(): boolean {
    return this.popupData.sts === RcvCommonUtils.STS_IDLE && this.popupData.moveId == null;
  }

  popupShown(e): void {
    this.onSelectionChangedCountry(null); // 조회시 필터 초기화

    this.deleteBtn.visible = this.popupMode === 'Edit'; // 삭제버튼
    this.popupForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
    if (this.popupMode === 'Add') { // 신규

      this.popupData.companyId = Number(this.utilService.getCompanyId());
      this.popupForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
      this.popupForm.instance.getEditor('actFlg').option('value', RcvCommonUtils.FLAG_TRUE);
      this.popupForm.instance.getEditor('sts').option('value', RcvCommonUtils.STS_IDLE);
      this.popupForm.instance.getEditor('rcvSchDate').option('value', this.gridUtil.getToday());
      this.popupForm.instance.getEditor('rcvTypecd').option('value', RcvCommonUtils.TYPE_STD);
    } else if (this.popupMode === 'Edit') { // 수정
    }

    const disabledCond = this.popupForm.instance.getEditor('sts').option('value') !== RcvCommonUtils.STS_IDLE || this.popupData.moveId != null;

    this.deleteBtn.visible = !disabledCond && this.popupMode === 'Edit';
    this.saveBtn.visible = !disabledCond;
    this.popupForm.instance.getEditor('supplierId').option('disabled', disabledCond);         // 예정일
    this.popupForm.instance.getEditor('actFlg').option('disabled', disabledCond);             // 사용여부
    this.popupForm.instance.getEditor('rcvTypecd').option('disabled', disabledCond);          // 입고타입
    this.popupForm.instance.getEditor('rcvSchDate').option('disabled', disabledCond);         // 예정일

    this.popupForm.instance.getEditor('supplierId').option('disabled', disabledCond);         // 공급처
    this.popupForm.instance.getEditor('refName').option('disabled', disabledCond);            // 담당자
    this.popupForm.instance.getEditor('supplierPhone').option('disabled', disabledCond);      // 연락처
    this.popupForm.instance.getEditor('supplierCountrycd').option('disabled', disabledCond);  // 국가
    this.popupForm.instance.getEditor('supplierPortcd').option('disabled', disabledCond);     // 항구
    this.popupForm.instance.getEditor('supplierZip').option('disabled', disabledCond);        // 우편번호
    this.popupForm.instance.getEditor('supplierAddress1').option('disabled', disabledCond);   // 주소1
    this.popupForm.instance.getEditor('supplierAddress2').option('disabled', disabledCond);   // 주소2

    this.popupForm.instance.getEditor('actFlg').focus();
    this.supplierChangedFlg = true;
    this.portChangedFlg = true;
    this.popupGrid.instance.repaint();  // 스크롤 제거를 위해 refresh
  }

  // 닫기클릭 이벤트
  popupCancelClick(e): void {
    this.popupVisible = false;
    this.popupForm.instance.resetValues();

    // 재조회
    this.onSearch();
  }

  // 삭제클릭 이벤트
  async popupDeleteClick(e): Promise<void> {

    const confirmMsg = this.utilService.convert('confirmDelete', this.utilService.convert1('rcvTx', '입고전표'));
    if (!await this.utilService.confirm(confirmMsg)) {
      return;
    }

    try {
      const deleteContent = this.popupData as RcvExpectedVO;
      const result = await this.service.delete(deleteContent);
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.utilService.notify_success('Delete success');
        this.popupForm.instance.resetValues();
        this.popupVisible = false;
        this.onSearch();
      }
    } catch {
      this.utilService.notify_error('There was an error!');
    }
  }

  // 추가버튼 이벤트
  addClick(): void {
    // 입고상태가 예정이 아닐 경우 return
    if (this.popupData.sts !== RcvCommonUtils.STS_IDLE || this.popupData.moveId != null) {
      return;
    }
    this.popupGrid.instance.addRow().then(r => {
      const rowIdx = this.popupGrid.instance.getRowIndexByKey(this.changes[this.changes.length - 1].key);
      this.setFocusRow(rowIdx, this.popupGrid);
    });
  }

  onInitNewRow(e): void {
    // e.data.itemAdminId = this.dsItemAdmin.length > 0 ? this.dsItemAdmin[0].uid : null;
    e.data.itemAdminId = this.utilService.getCommonItemAdminId();
    e.data.damageFlg = RcvCommonUtils.FLAG_FALSE;
    e.data.noShippingFlg = RcvCommonUtils.FLAG_FALSE;
    e.data.foreignCargoFlg = RcvCommonUtils.FLAG_FALSE;
    e.data.customsReleaseFlg = RcvCommonUtils.FLAG_FALSE;
    e.data.taxFlg = RcvCommonUtils.FLAG_FALSE;
    e.data.expectQty1 = 0;
    e.data.receivedQty1 = 0;
    e.data.adjustQty1 = 0;
    e.data.whInDate = this.gridUtil.getToday();
  }

  // 삭제버튼 이벤트
  async deleteClick(): Promise<void> {
    // 입고상태가 예정이 아닐 경우 return
    if (this.popupData.sts !== RcvCommonUtils.STS_IDLE || this.popupData.moveId != null) {
      return;
    }

    if (this.popupGrid.focusedRowIndex > -1) {
      const focusedIdx = this.popupGrid.focusedRowIndex;

      this.popupGrid.instance.deleteRow(focusedIdx);
      this.popupEntityStore.push([{type: 'remove', key: this.popupGrid.focusedRowKey}]);

      // 삭제된 로우 위로 포커스
      this.popupGrid.focusedRowIndex = focusedIdx - 1;
    }
  }

  /**
   *  팝업 메소드 END
   */

}
