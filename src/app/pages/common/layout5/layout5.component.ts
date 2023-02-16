import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxAccordionComponent, DxButtonComponent, DxChartComponent, DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {SoDetailVO} from '../so/so.service';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {Layout5Service} from './layout5.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';

@Component({
  selector: 'app-layout5',
  templateUrl: './layout5.component.html',
  styleUrls: ['./layout5.component.scss']
})
export class Layout5Component implements OnInit {

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('chart', {static: false}) chart: DxChartComponent;

  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  @ViewChild('acrdn', {static: false}) acrdn: DxAccordionComponent;

  // Global
  G_TENANT: any;

  // Form
  mainFormData = {};
  // Grid
  mainDataSource: DataSource;
  mainEntityStore: ArrayStore;
  mainKey = 'uid';
  codeList: SoDetailVO[];

  // DataSet
  dsSoType = [];
  dsOwner = [];
  dsActFlg = [];
  dsWarehouse = [];
  dsSoStatus = [];
  dsItemAdmin = [];
  dsItemId = [];
  dsCompany = [];
  dsShipTo = [];
  dsCountry = [];
  dsPort = [];
  dsUser = [];

  statusChart = [];

  // summary
  searchList = [];

  GRID_STATE_KEY = 'so_sostatus';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  constructor(public utilService: CommonUtilService,
              public gridUtil: GridUtilService,
              private codeService: CommonCodeService,
              private service: Layout5Service
  ) {
    this.calculateCustomSummary = this.calculateCustomSummary.bind(this);

  }

  // 화면 생성 된 후 호출
  ngOnInit(): void {
    this.G_TENANT = this.utilService.getTenant();
    this.initCode();
    this.inputDataSource([], 'main');
  }

  // 화면의 컨트롤까지 다 로드 후 호출
  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.fnAccordionExpandAll(this.acrdn);
    this.initData(this.mainForm);
  }

  initCode(): void {

    // 창고
    // this.codeService.getWarehouse(this.G_TENANT, null, null).subscribe(result => {
    //   this.dsWarehouse = result.data;
    // });

    // 출고유형
    this.codeService.getCode(this.G_TENANT, 'SOTYPE').subscribe(result => {
      this.dsSoType = result.data;
    });

    // 출고상태
    this.codeService.getCode(this.G_TENANT, 'SOSTATUS').subscribe(result => {
      this.dsSoStatus = result.data;
    });

    // 물품
    // this.codeService.getItem(this.G_TENANT).subscribe(result => {
    //   this.dsItemId = result.data;
    // });

    // 국가
    this.codeService.getCode(this.G_TENANT, 'COUNTRY').subscribe(result => {
      this.dsCountry = result.data;
    });

    // 사용자
    this.codeService.getUser(this.G_TENANT).subscribe(result => {
      this.dsUser = result.data;
    });
  }

  inputDataSource(inputData, type): void {

    this[type + 'DataSource'] = new DataSource({
      store: new ArrayStore({
        data: inputData,
        key: this[type + 'Key']
      })
    });
  }

  async onSearch(): Promise<void> {
    const data = this.mainForm.instance.validate();
    const SOSUMQTY1 = 'soSumQty1';

    if (data.isValid) {
      const result = await this.service.get(this.mainFormData);
      this.searchList = result.data;

      if (this.resultMsgCallback(result, 'Search')) {
        await this.inputDataSource(result.data, 'main');
        const getDisplay = {};

        const tempChartData = this.dsSoStatus.map(el => {
          getDisplay[el.code] = '[' + el.code + ']' + el.codeName;

          return {
            arg: getDisplay[el.code],
            sts: el.code, soSumQty1: 0, soQty: 0
          };
        });

        const resultChartData = result.data.map(el => {
          return {
            arg: getDisplay[el.sts],
            sts: el.sts, soSumQty1: el[SOSUMQTY1], soQty: 1
          };
        });
        const chartData = resultChartData.concat(tempChartData);

        chartData.sort((objA, objB) => {

          if (objA.sts > objB.sts) {
            return 1;
          }

          if (objA.sts < objB.sts) {
            return -1;
          }

          return 0;
        });
        this.statusChart = chartData;
        this.mainGrid.focusedRowKey = null;
        this.mainGrid.paging.pageIndex = 0;
      }
    }
  }

  // async onSubSearch(data): Promise<void> {
  //   const result = await this.service.getPopup(data);
  //
  //   if (this.resultMsgCallback(result, 'SubSearch')) {
  //     console.log(result);
  //   }
  // }

  resultMsgCallback(result, msg): boolean {

    if (result.success) {
      this.utilService.notify_success(msg + ' success');
    } else {
      this.utilService.notify_error(result.msg);
    }
    return result.success;
  }

  onReset(): void {
    this.mainForm.instance.resetValues();
    this.initData(this.mainForm);
  }

  initData(form): void {
    const rangeDate = this.utilService.getDateRange();

    form.formData = {
      tenant: this.G_TENANT,
      fromShipSchDate: rangeDate.fromDate,
      toShipSchDate: rangeDate.toDate,
      warehouseId: this.utilService.getCommonWarehouseId(),
      ownerId: this.utilService.getCommonOwnerId()
    };
    form.instance.focus();
  }

  onOptionChanged(e): void {
    this.gridUtil.onOptionChangedForSummary(e, this); // 합계 계산
  }

  calculateCustomSummary(options): void {
    this.gridUtil.setCustomSummary(options, this.mainGrid, this);
  }

}
