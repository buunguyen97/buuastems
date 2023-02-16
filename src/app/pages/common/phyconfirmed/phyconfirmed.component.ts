import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {PhyconfirmedService, PhyConfirmedVO, PhyInstructDetailVO} from './phyconfirmed.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';

@Component({
  selector: 'app-phyconfirmed',
  templateUrl: './phyconfirmed.component.html',
  styleUrls: ['./phyconfirmed.component.scss']
})
export class PhyconfirmedComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('saveBtn', {static: false}) saveBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  // Global
  G_TENANT: any;

  // ***** main ***** //
  // Form
  mainFormData: PhyConfirmedVO = {} as PhyConfirmedVO;

  // Grid
  mainDataSource: DataSource;
  mainEntityStore: ArrayStore;
  mainKey = 'uid';
  selectedRows: number[];
  // ***** main ***** //

  // ***** popup ***** //
  popupMode = 'Add';
  popupVisible = false;
  dsUser = [];
  // Form
  popupFormData: PhyConfirmedVO;
  // Grid
  popupDataSource: DataSource;
  popupEntityStore: ArrayStore;
  popupKey = 'uid';
  codeList: PhyInstructDetailVO[];

  // Changes
  popupChanges = [];
  // ***** popup ***** //

  // DataSet
  dsYN = [];

  dsPhyStatus = [];
  dsOwner = [];
  dsWarehouse = [];
  dsItemAdmin = [];
  dsItem = [];
  dsLocation = [];

  GRID_STATE_KEY = 'inv_phyconfirmed';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');

  constructor(
    public utilService: CommonUtilService,
    private service: PhyconfirmedService,
    private codeService: CommonCodeService,
    public gridUtil: GridUtilService
  ) {
    this.onPopupExcute = this.onPopupExcute.bind(this);
    // this.onValueChangedItemAdminId = this.onValueChangedItemAdminId.bind(this);
    this.G_TENANT = this.utilService.getTenant();
  }

  // 화면 생성 된 후 호출
  ngOnInit(): void {
    this.initCode();
    this.inputDataSource([], 'main');
  }

  // 화면의 컨트롤까지 다 로드 후 호출
  ngAfterViewInit(): void {
    this.mainForm.instance.focus();
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getGridHeight(this.mainGrid);
    this.initForm();
    this.inputDataSource(this.codeList, 'popup');
  }

  initCode(): void {

    // 상태
    this.codeService.getCode(this.G_TENANT, 'PHYINSTRUCTSTATUS').subscribe(result => {
      this.dsPhyStatus = result.data;
    });

    // 사용여부
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    // 품목관리사
    this.codeService.getItemAdmin(this.G_TENANT).subscribe(result => {
      this.dsItemAdmin = result.data;
    });

    // 품목
    this.codeService.getItem(this.G_TENANT).subscribe(result => {
      this.dsItem = result.data;
    });

    // 로케이션
    this.codeService.getLocation(this.G_TENANT, null).subscribe(result => {
      this.dsLocation = result.data;
    });

    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });

    // 창고
    this.codeService.getCommonWarehouse(Number(this.utilService.getUserUid())).subscribe(result => {
      this.dsWarehouse = result.data;
    });

    // 화주(공통 화주)
    this.codeService.getCommonOwner(Number(this.utilService.getUserUid())).subscribe(result => {
      this.dsOwner = result.data;
    });

    // 사용자
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
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

  // search Form 초기화
  initForm(): void {
    // 공통 조회 조건 set
    this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
    this.mainForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
    this.mainForm.instance.getEditor('itemAdminId').option('value', this.utilService.getCommonItemAdminId());

  }

  // 그리드 품목 선택시 시리얼 여부
  setItemValue(rowData: any, value: any): void {
    rowData.itemId = value;
    rowData.unit = value;
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get(this.mainFormData);

      if (this.resultMsgCallback(result, 'Search')) {
        this.inputDataSource(result.data, 'main');
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  // onValueChangedItemAdminId(e): void {
  //
  //   if (!e.value) {
  //     this.dsItem = null;
  //     this.mainFormData.itemId = null;
  //     return;
  //   }
  //
  //   const findValue = this.dsItemAdmin.filter(code => code.uid === e.value);
  //
  //   this.codeService.getItemWithItemAdminId(this.G_TENANT, findValue[0].uid).subscribe(result => {
  //     this.dsItem = result.data;
  //   });
  // }

  // 팝업 열기
  onPopupOpen(e): void {
    this.inputDataSource([], 'popup');
    this.popupMode = 'Edit';
    this.onPopupSearch(e.data);
    this.popup.visible = true;
  }

  // 팝업 닫기
  onPopupClose(): void {
    this.popup.visible = false;
  }

  onPopupAfterClose(): void {
    this.popupForm.instance.resetValues();
    this.popupForm.instance.getEditor('phyInstructKey').option('disabled', false);
    this.popupGrid.instance.cancelEditData();
    this.onSearch();
  }

  async onPopupSearch(data): Promise<void> {
    const result = await this.service.getPopup(data);

    if (this.resultMsgCallback(result, 'PopupSearch')) {
      this.popupFormData = result.data;
      const confirmedBtn = this.popup.toolbarItems[0];
      let visibleVal = true;
      let opt = {};

      if (result.data.sts === '300') {
        opt = {
          text: this.utilService.convert1('phyconfirmed_msg_confirmed', '확정'),
          type: 'normal',
          onClick: this.onPopupExcute
        };
        this.saveBtn.visible = true;
      } else if (result.data.sts === '900') {
        opt = {
          text: this.utilService.convert1('phyconfirmed_msg_cancelConfirmed', '확정취소'),
          type: 'normal',
          onClick: this.onPopupExcute
        };
        this.saveBtn.visible = false;
      } else {
        this.saveBtn.visible = true;
        visibleVal = false;
      }
      confirmedBtn.visible = visibleVal;
      confirmedBtn.options = opt;

      result.data.phyInstructDetailList.forEach((el) => {
        el.warehouseId = result.data.warehouseId;
        el.ownerId = result.data.ownerId;
        el.ownerPhyInstructKey = result.data.ownerPhyInstructKey;
        el.phyInstructDate = result.data.phyInstructDate;
        el.replace = true;
      });

      this.inputDataSource(result.data.phyInstructDetailList, 'popup');
      this.popupForm.instance.getEditor('phyInstructKey').option('disabled', true);
      this.popupGrid.focusedRowKey = null;
      this.popupGrid.paging.pageIndex = 0;
    } else {
      return;
    }
  }

  async onPopupSave(): Promise<void> {

    if (this.popupChanges.length > 0) {
      const saveData = [];

      this.popupChanges.forEach((el) => {

        this.popupGrid.instance.getDataSource().items().forEach((elChk) => {

          if (el.key === elChk.uid) {
            saveData.push(Object.assign(elChk, el.data));
          }
        });
      });
      const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('com_btn_save'));

      if (!await this.utilService.confirm(confirmMsg)) {
        return;
      }

      const result = await this.service.save(saveData);

      if (this.resultMsgCallback(result, this.utilService.convert1('phyconfirmed_msg_save', '저장'))) {
        this.onPopupClose();
        this.onSearch();
      } else {
        return;
      }
    } else {
      this.utilService.notify_error(this.utilService.convert('noChangedData'));
    }
  }

  popupShown(): void {
    this.utilService.getPopupGridHeight(this.popupGrid, this.popup, 40);

    this.popupGrid.instance.repaint();  // 팝업 그리드 스크롤 제거를 위해 추가
  }

  async onPopupExcute(): Promise<void> {

    if (this.popupChanges.length > 0) {
      this.utilService.notify_error(this.utilService.convert('validSavedData'));
    } else {

      if (!!this.popupFormData.uid) {
        const msgStr = this.popupFormData.sts === '300' ? 'phyconfirmed_msg_confirmed' : 'phyconfirmed_msg_cancelConfirmed';
        const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert(msgStr));

        if (!await this.utilService.confirm(confirmMsg)) {
          return;
        }
        const result = await this.service.execute(this.popupFormData);

        if (this.resultMsgCallback(result, this.utilService.convert1('phyconfirmed_msg_phyconfirmed', '재고조사확정'))) {
          this.onPopupClose();
          this.onSearch();
        } else {
          return;
        }
      } else {
        const msg = this.utilService.convert1('phyconfirmed_msg_NophyconfirmedData', '확정할 데이터가 없습니다.');
        this.utilService.notify_success(msg);
      }
    }
  }

  onPopupAddRow(): void {

    this.popupGrid.instance.addRow().then(() => {
      this.setFocusRow(this.popupGrid.instance.getVisibleRows().length - 1);
    });
  }

  async onPopupDeleteRow(e): Promise<void> {

    if (this.popupGrid.focusedRowIndex > -1) {
      this.popupGrid.instance.deleteRow(this.popupGrid.focusedRowIndex);
      this.popupEntityStore.push([{type: 'remove', key: this.popupGrid.focusedRowKey}]);
      this.setFocusRow(this.popupGrid.focusedRowIndex - 1);
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

  // 그리드 셀 이동시 호출하는 함수
  onFocusedCellChanging(e): void {
    this.setFocusRow(e.rowIndex);
  }

  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    this.initForm();
  }

  setFocusRow(index): void {
    this.popupGrid.focusedRowIndex = index;
  }

  onFocusedCellChangedPopupGrid(e): void {
    this.setFocusRow(e.rowIndex);
  }

  async onViewReport(): Promise<void> {
    const items = this.mainGrid.instance.getKeyByRowIndex(this.mainGrid.focusedRowIndex);
    console.log(items);
    console.log(this.mainGrid.focusedRowKey);

    const reportFile = 'file=InvCountDifferenceTable.jrf';
    const reportOption = [
      {
        dataSet: 'DataSet0',
        node: 'data',
        path: '/report-service/report/invCountDifferenceTableHeader',
        apiParam: {
          uid: this.mainGrid.focusedRowKey,
          tenant: this.G_TENANT,
        }
      },
      {
        dataSet: 'DataSet1',
        node: 'data',
        path: '/report-service/report/invCountDifferenceTableData',
        apiParam: {
          uid: this.mainGrid.focusedRowKey,
          tenant: this.G_TENANT,
        }
      }
    ];

    this.utilService.openViewReport(reportFile, reportOption);
  }
}
