import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
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


  // Global
  G_TENANT: any;

  mainFormData = {};

  // grid
  mainDataSource: DataSource;
  subDataSource: DataSource;
  mainEntityStore: ArrayStore;
  subEntityStore: ArrayStore;
  key = 'uid';

  dsWarehouse = []; // 창고
  dsItemAdmin = []; // 품목관리사
  dsCompany = []; // 거래처코드
  dsRcvStatus = []; // 입고상태
  dsRcvType = []; // 입고타입
  dsSupplier = []; // 공급처
  dsUser = []; // 사용자
  dsOwner = []; // 화주


  constructor(
    public utilService: CommonUtilService,
    private service: Astems24Service,
    private codeService: CommonCodeService,
    public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();
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

    this.codeService.getCode(this.G_TENANT, 'RCVSTATUS').subscribe(result => {
      this.dsRcvStatus = result.data;
    });
    this.codeService.getCode(this.G_TENANT, 'RCVTYPE').subscribe(result => {
      this.dsRcvType = result.data;
    });
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
    this.utilService.getGridHeight(this.subGrid, 30);

  }


  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();

    if (data.isValid) {
      // const result = await this.service.get(this.mainFormData);
      const result = await this.service.get(this.mainFormData);
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.mainGrid.instance.cancelEditData();
        this.utilService.notify_success('search success');

        this.mainEntityStore = new ArrayStore(
          {
            data: result.data,
            key: this.key
          }
        );
        this.mainDataSource = new DataSource({
          store: this.mainEntityStore
        });
        await this.mainGrid.instance.deselectAll();
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;

        // 횡스크롤 제거
        this.gridUtil.fnScrollOption(this.mainGrid);
      }
    }
  }

  // 적치지시
  onRowDblClick(e): void {
    console.log('success');
  }

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
    this.mainForm.instance.getEditor('sts').option('value', '200');
    this.mainForm.instance.focus();
  }

  onNew(e): void {
    console.log('add success');
  }
}
