import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxAccordionComponent, DxButtonComponent, DxDataGridComponent} from "devextreme-angular";
import {DxFormComponent} from "devextreme-angular/ui/form";
import {RcvExpectedVO} from "../../common/rcvexpected/rcvexpected.service";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {AstemsService, RcvAcceptVO, RcvTagDetailVO} from "../astems/astems.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";

@Component({
    selector: 'app-buuastems4',
    templateUrl: './buuastems4.component.html',
    styleUrls: ['./buuastems4.component.scss']
})

export class Buuastems4Component implements OnInit, AfterViewInit {
    textColor = 'red';
    bgColor = 'yellow';
    cities = [{name: 'New York', code: 'NY'}, {name: 'Los Angeles', code: 'LA'}];

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
    @ViewChild('subGrid', {static: false}) subGrid: DxDataGridComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
    @ViewChild('acrdn', {static: false}) acrdn: DxAccordionComponent;

    // Global
    G_TENANT: any;

    mainFormData: RcvExpectedVO = {} as RcvExpectedVO;

    // grid
    mainDataSource: DataSource;
    subDataSource: DataSource;
    mainEntityStore: ArrayStore;
    subEntityStore: ArrayStore;
    key = 'uid';

    dsWarehouse = []; // 창고
    dsItemAdmin = []; // 품목관리사
    dsCompany = []; // 거래처코드
    dsLocation = []; // 로케이션
    dsRcvStatus = []; // 입고상태
    dsRcvType = []; // 입고타입
    dsSupplier = []; // 공급처
    dsUser = []; // 사용자
    dsItem = []; // 품목
    dsOwner = []; // 화주
    dsAcceptType = []; // 접수타입
    dsAcceptGroup = []; // 접수그룹

    // Grid State
    GRID_STATE_KEY = 'rcv_rcvinstruct1';
    loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
    saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
    loadStateSub = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_sub');
    saveStateSub = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_sub');
    map;
    test: string;

    constructor(
        public utilService: CommonUtilService,
        private service: AstemsService,
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

        // this.codeService.getItem(this.G_TENANT).subscribe(result => {
        //   this.dsItem = result.data;
        // });


        this.codeService.getCode(this.G_TENANT, 'ACCEPTTYPE').subscribe(result => {
            this.dsAcceptType = result.data;
        });

        this.codeService.getCode(this.G_TENANT, 'ACCEPTGROUP').subscribe(result => {
            this.dsAcceptGroup = result.data;
        });
    }

    // 그리드 품목 선택시 시리얼 여부
    setItemValue(rowData: any, value: any): void {
        rowData.itemId = value;
        rowData.unit = value;
    }

    ngAfterViewInit(): void {


        this.bookmarkBtn.instance.option('icon', 'star');
        this.utilService.getFoldable(this.mainForm, this.foldableBtn);
        this.utilService.fnAccordionExpandAll(this.acrdn);  // 아코디언 모두 펼치기
        this.utilService.getGridHeight(this.subGrid, 30);
        this.initForm();
    }

    // 그리드 셀 이동시 호출하는 함수
    onFocusedCellChanging(e, grid): void {
        this.setFocusRow(e.rowIndex, grid);
    }

    onFocusedRowChanged(e): void {
        if (e.row) {
            this.onSearchSub(e.row.key);  // 상세조회
        }
    }

    setFocusRow(index, grid): void {
        grid.focusedRowIndex = index;
    }

    async onSearch(): Promise<void> {
        const data = this.mainForm.instance.validate();

        console.log(this.mainForm.formData.test);
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

    async onSearchSub(rcvAcceptId: number): Promise<void> {
        if (rcvAcceptId) {
            const searchData = {uid: rcvAcceptId} as RcvTagDetailVO;
            const result = await this.service.findRcvTagDetail(searchData);

            if (!result.success) {
                this.utilService.notify_error(result.msg);
                return;
            } else {
                this.subGrid.instance.cancelEditData();
                this.utilService.notify_success('search success');

                this.subEntityStore = new ArrayStore(
                    {
                        data: result.data,
                        key: this.key
                    }
                );
                this.subDataSource = new DataSource({
                    store: this.subEntityStore
                });
                this.subGrid.focusedRowKey = null;
                this.subGrid.paging.pageIndex = 0;

                // 횡스크롤 제거
                this.gridUtil.fnScrollOption(this.subGrid);
            }
        }
    }

    // 적치지시
    async executeInstruct(): Promise<void> {

        const idx = this.mainGrid.focusedRowIndex;
        if (idx > -1) {
            const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('executeInstruct'));
            if (!await this.utilService.confirm(confirmMsg)) {
                return;
            }
            const uid = this.mainGrid.instance.cellValue(idx, 'uid');
            const data = {uid} as RcvAcceptVO;
            data.belongingCompany = Number(this.utilService.getCompanyId());
            const result = await this.service.executeInstruct(data);
            if (!result.success) {
                this.utilService.notify_error(result.msg);
                return;
            }
        } else {
            // 입고접수완료 목록을 선택하세요.
            const msg = this.utilService.convert('com_select_obj', this.utilService.convert('rcvAcceptList'));
            this.utilService.notify_error(msg);
            return;
        }

        await this.onSearch();
    }

    async onReset(): Promise<void> {
        await this.mainForm.instance.resetValues();
        await this.initForm();
        this.mainForm.formData = {};
    }

    initForm(): void {
        // from입고예정일자 setter
        // this.mainForm.instance.getEditor('fromRcvSchDate').option('value', this.gridUtil.getToday());
        const rangeDate = this.utilService.getDateRange();

        this.mainForm.instance.getEditor('fromRcvSchDate').option('value', rangeDate.fromDate);
        this.mainForm.instance.getEditor('toRcvSchDate').option('value', rangeDate.toDate);
        this.mainForm.instance.getEditor('ownerId').option('value', this.utilService.getCommonOwnerId());
        this.mainForm.instance.getEditor('warehouseId').option('value', this.utilService.getCommonWarehouseId());
        this.mainForm.instance.getEditor('sts').option('value', '300');
        this.mainForm.instance.focus();
    }


}