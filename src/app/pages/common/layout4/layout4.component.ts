import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxAccordionComponent, DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {Layout4Service, SeparateVO} from './layout4.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';


@Component({
  selector: 'app-layout4',
  templateUrl: './layout4.component.html',
  styleUrls: ['./layout4.component.scss']
})
export class Layout4Component implements OnInit {

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('subForm', {static: false}) subForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
  @ViewChild('acrdn', {static: false}) acrdn: DxAccordionComponent;


  // Global
  G_TENANT: any;
  changes = [];
  dsUser = [];

  // ***** main ***** //
  // Form
  mainFormData: {} = {};
  subFormData: SeparateVO = {} as SeparateVO;

  // Grid
  mainGridDataSource: DataSource;
  mainEntityStore: ArrayStore;
  key = 'uid';
  // ***** main ***** //

  dsWarehouse = [];
  dsOwner = [];
  dsItemAdmin = [];
  dsItem = [];
  dsLoc = [];
  dsYN = [];

  GRID_STATE_KEY = 'wi_separate';
  saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);
  loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);

  constructor(
    public utilService: CommonUtilService,
    private service: Layout4Service,
    private codeService: CommonCodeService,
    public gridUtil: GridUtilService
  ) {
  }

  ngOnInit(): void {
    this.G_TENANT = this.utilService.getTenant();
    this.initCode();

    this.mainEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );

    this.mainGridDataSource = new DataSource({
      store: this.mainEntityStore
    });
  }

  // 화면의 컨트롤까지 다 로드 후 호출
  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
    this.mainForm.instance.focus();
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.initForm();
    this.utilService.fnAccordionExpandAll(this.acrdn);
    this.utilService.getGridHeight(this.mainGrid,5);
// 아코디언 모두 펼치기
  }

  initForm(): void {
    // 공통 조회 조건 set
    this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
    this.mainForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
    this.mainForm.instance.getEditor('itemAdminId').option('value', this.utilService.getCommonItemAdminId());
  }

  initCode(): void {
    // 센터(창고)
    // this.codeService.getWarehouse(this.G_TENANT, null, null).subscribe(result => {
    //   this.dsWarehouse = result.data;
    // });

    // 로케이션코드
    // this.codeService.getLocation(this.G_TENANT, null).subscribe(result => {
    //   this.dsLoc = result.data;
    // });


    // 가용여부
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    // 품목
    // this.codeService.getItem(this.G_TENANT).subscribe(result => {
    //   this.dsItem = result.data;
    // });


    // 사용자
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  // 그리드 품목 선택시 시리얼 여부
  setItemValue(rowData: any, value: any): void {
    rowData.itemId = value;
    rowData.isSerial = this.dsItem.filter(el => el.uid === value)[0].isSerial;          // 시리얼여부
    rowData.unit = value;
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      const result = await this.service.get(this.mainFormData);

      if (this.resultMsgCallback(result, 'Search')) {

        this.mainEntityStore = new ArrayStore(
          {
            data: result.data,
            key: this.key
          }
        );

        this.mainGridDataSource = new DataSource({
          store: this.mainEntityStore
        });
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      } else {
        return;
      }
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

  onFocusedRowChanged(e): void {
    try {
      this.subFormData = e.row.data;
      this.subFormData.moveQty = 0;
    } catch {
    }
  }

  // 로트 변경
  async onExcute(): Promise<void> {
    const data = this.subForm.instance.validate();

    if (data.isValid) {
      const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('separate_button'));

      if (!await this.utilService.confirm(confirmMsg)) {
        return;
      }
      const result = await this.service.execute([this.subFormData]);

      if (this.resultMsgCallback(result, '재고조사확정')) {
        this.onSearch();
      } else {
        return;
      }
    } else {
      const msg = this.utilService.convert('bom_custom_qty1');
      this.utilService.notify_error(msg);
      return;
    }
  }

  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    this.initForm();
  }

}
