import {Component, ViewChild} from '@angular/core';
import {DxButtonComponent, DxDataGridComponent} from "devextreme-angular";
import {DxFormComponent} from "devextreme-angular/ui/form";
import {Layout2Service, MenuSearchVO} from "../../common/layout2/layout2.service";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {CookieService} from "ngx-cookie-service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";
import {APPCONSTANTS} from "../../../shared/constants/appconstants";

@Component({
    selector: 'app-buuastems',
    templateUrl: './buuastems.component.html',
    styleUrls: ['./buuastems.component.scss']
})
export class BuuastemsComponent {
    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('grid1', {static: false}) grid1: DxDataGridComponent;
    @ViewChild('aaa', {static: false}) aaa: DxDataGridComponent;
    @ViewChild('grid2', {static: false}) grid2: DxDataGridComponent;
    @ViewChild('grid3', {static: false}) grid3: DxDataGridComponent;

    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

    dsActFlg = [];
    dsSystemType = [];
    dsIcon = [];

    // Global
    G_TENANT: any;
    public textThu: string = '';

    mainFormData: MenuSearchVO = {} as MenuSearchVO;

    // grid
    dataSource1: DataSource;
    dataSource2: DataSource;
    dataSource3: DataSource;
    entityStore1: ArrayStore;
    entityStore2: ArrayStore;
    entityStore3: ArrayStore;
    selectedRows1: number[];
    selectedRows2: number[];
    selectedRows3: number[];
    cainay: any = {};
    key = 'uid';
    changes1 = [];
    changes2 = [];
    changes3 = [];
    addFlg1 = false;
    addFlg2 = false;
    visible: boolean = false;
    GRID_STATE_KEY = 'mm_mmenu1';
    public testhay: string = '';
    public anHien: string = 'an';
    public texthienthi = '';

    saveState1 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_1');
    loadState1 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_1');
    saveState2 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_2');
    loadState2 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_2');
    saveState3 = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_3');
    loadState3 = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_3');

    constructor(public utilService: CommonUtilService,
                private service: Layout2Service,
                private cookieService: CookieService,
                private codeService: CommonCodeService,
                public gridUtil: GridUtilService) {
        this.G_TENANT = this.utilService.getTenant();
        this.addClick1 = this.addClick1.bind(this);
        this.addClick2 = this.addClick2.bind(this);
        this.addClick3 = this.addClick3.bind(this);
        this.deleteClick1 = this.deleteClick1.bind(this);
        this.deleteClick2 = this.deleteClick2.bind(this);
        this.deleteClick3 = this.deleteClick3.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    ngOnInit(): void {
        this.dataSource1 = this.initGridWithEntityStore(this.entityStore1);
        this.dataSource2 = this.initGridWithEntityStore(this.entityStore2);
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);

        this.changes1 = [];
        this.changes2 = [];
        this.changes3 = [];

        // 시스템타입
        this.codeService.getCode(this.G_TENANT, 'SYSTEMTYPE').subscribe(result => {
            this.dsSystemType = result.data;
        });

        this.codeService.getCode(this.G_TENANT, 'ICON').subscribe(result => {
            this.dsIcon = result.data;
        });

        this.entityStore1 = new ArrayStore(
            {
                data: [],
                key: this.key
            }
        );
        this.dataSource1 = new DataSource({
            store: this.entityStore1
        });
    }

    ngAfterViewInit(): void {
        this.bookmarkBtn.instance.option('icon', 'star');
        this.mainForm.instance.getEditor('systemType').option('value', APPCONSTANTS.DEFAULT_SYSTEMT_TYPE);
        // this.mainForm.instance.getEditor('systemType').focus();
        this.mainForm.instance.focus();
        this.utilService.getFoldable(this.mainForm, this.foldableBtn);

        this.utilService.getGridHeight(this.grid1);
        this.utilService.getGridHeight(this.grid2);
        this.utilService.getGridHeight(this.grid3);
    }

    // 조회
    async onSearch(): Promise<void> {


        this.dataSource1 = this.initGridWithEntityStore(this.entityStore1);
        this.dataSource2 = this.initGridWithEntityStore(this.entityStore2);
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);

        this.changes1 = [];
        this.changes2 = [];
        this.changes3 = [];

        const data = this.mainForm.instance.validate();
        const inputText2 = this.mainFormData.text2;
        console.log(inputText2);

        if (data.isValid) {
            const result = await this.service.getL1(this.mainFormData);

            if (!result.success) {
                this.utilService.notify_error(result.msg);

                return;
            } else {
                if (result.data.length === 0) {
                    this.utilService.notify_error('không có giá trị nào hết');
                } else {
                    this.utilService.notify_success('có kết quả rồi nè !!!');
                }
                this.aaa.visible = true;
                const resultArray = result?.data?.filter(path => path.text?.toLowerCase() === inputText2?.toLowerCase());
                console.log(result.data);
                if (resultArray.length != 0) {
                    console.log('đúng ồi đó!!!!');
                    this.textThu = resultArray[0].text;
                } else {
                    this.textThu = '';
                }
                this.grid1.instance.cancelEditData();
                this.entityStore1 = new ArrayStore(
                    {
                        data: result.data,
                        key: this.key
                    }
                );

                this.dataSource1 = new DataSource({
                    store: this.entityStore1
                });
                this.grid1.focusedRowKey = null;
                this.grid1.paging.pageIndex = 0;
                if (this.mainFormData.text1?.length && this.mainFormData.text1.trim() !== '') {
                    alert('Gia tri nhap vao: ' + this.mainFormData.text1);
                }


            }
        }
    }

    async onSearchL2(searchVO): Promise<void> {
        if (this.addFlg1 || !searchVO.uid) {
            this.addFlg1 = false;
            return;
        }
        this.mainFormData.text1 = searchVO.text;
        const result = await this.service.getL2(searchVO);

        if (!result.success) {
            this.utilService.notify_error(result.msg);

            return;

        } else {

            this.grid2.instance.cancelEditData();
            this.utilService.notify_success('search success');

            this.entityStore2 = new ArrayStore(
                {
                    data: result.data,
                    key: this.key
                }
            );
            this.dataSource2 = new DataSource({
                store: this.entityStore2
            });

            // this.setEntity(this.dataSource2, this.entityStore2, result.data);
            this.grid2.focusedRowKey = null;
            this.grid2.paging.pageIndex = 0;
        }
    }

    async onSearchApp(searchVO): Promise<void> {
        if (this.addFlg2 || !searchVO.uid) {
            this.addFlg2 = false;
            return;
        }

        const result = await this.service.getApp(searchVO);

        if (!result.success) {
            this.utilService.notify_error(result.msg);
            return;
        } else {
            this.grid3.instance.cancelEditData();
            this.utilService.notify_success('search success');
            console.log(result.data);
            this.entityStore3 = new ArrayStore(
                {
                    data: result.data,
                    key: this.key
                }
            );
            this.dataSource3 = new DataSource({
                store: this.entityStore3
            });

            this.grid3.focusedRowKey = null;
            this.grid3.paging.pageIndex = 0;
        }
    }

    async onSave(): Promise<void> {
        const messages = {text: 'mm_menu_text', title: 'mm_menu_apptitle', path: 'mm_menu_path'};
        const columns = ['text', 'path'];    // required 컬럼 dataField 정의

        const grid1Idx = this.grid1.focusedRowIndex;
        const grid2Idx = this.grid2.focusedRowIndex;

        this.grid1.instance.cellValue(grid1Idx, 'items', null);
        this.grid2.instance.cellValue(grid2Idx, 'items', null);
        if (this.changes2.length > 0) {
            const grid2Data = this.collectGridData(this.changes2);
            this.grid1.instance.cellValue(grid1Idx, 'items', grid2Data);
        }

        if (this.changes3.length > 0) {
            const grid3Data = this.collectGridData(this.changes3);
            this.grid2.instance.cellValue(grid2Idx, 'items', grid3Data);

            const grid2Data = this.collectGridData(this.changes2);
            this.grid1.instance.cellValue(grid1Idx, 'items', grid2Data);
        }

        const tempData = this.collectGridData(this.changes1);
        const tempData2 = this.collectGridData(this.changes2);
        const tempData3 = this.collectGridData(this.changes3);

        for (const item of tempData) {
            item.systemType = this.mainForm.instance.getEditor('systemType').option('value');
        }

        for (const item of tempData) {
            if (!item.key && !item.uid) {
                for (const col of columns) {
                    if ((item[col] === undefined) || (item[col] === '')) {
                        const msg = this.utilService.convert(messages[col]);
                        this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                        return;
                    }
                }
            }

            this.grid1.instance.byKey(item.key).then(
                (dataItem) => {
                    for (const col of columns) {
                        if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
                            const msg = this.utilService.convert(messages[col]);
                            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                            return;
                        }
                    }
                }
            );
        }

        for (const item of tempData2) {

            if (!item.key && !item.uid) {
                for (const col of columns) {
                    if ((item[col] === undefined) || (item[col] === '')) {
                        const msg = this.utilService.convert(messages[col]);
                        this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                        return;
                    }
                }
            }

            this.grid2.instance.byKey(item.key).then(
                (dataItem) => {
                    for (const col of columns) {
                        if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
                            const msg = this.utilService.convert(messages[col]);
                            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                            return;
                        }
                    }
                }
            );
        }

        for (const item of tempData3) {
            const validArr = ['title'];

            if (!item.key && !item.uid) {
                for (const col of validArr) {
                    if ((item[col] === undefined) || (item[col] === '')) {
                        const msg = this.utilService.convert(messages[col]);
                        this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                        return;
                    }
                }
            }

            this.grid3.instance.byKey(item.key).then(
                (dataItem) => {
                    for (const col of validArr) {
                        if ((dataItem[col] === undefined) || (dataItem[col] === '')) {
                            const msg = this.utilService.convert(messages[col]);
                            this.utilService.notify_error(this.utilService.convert('com_valid_required', msg));
                            return;
                        }
                    }
                }
            );
        }

        await this.grid1.instance.saveEditData();
        await this.grid2.instance.saveEditData();
        await this.grid3.instance.saveEditData();

        /// userId 파라메터 전송
        const userId = this.utilService.getUserUid();
        const result = await this.service.save(tempData, userId);
        if (result.success) {
            this.utilService.notify_success('save success');
            await this.onSearch();
        } else {
            this.utilService.notify_error(result.msg);
        }
    }

    addClick1(e): void {
        this.addFlg1 = true;
        this.initGrid();

        this.grid1.instance.addRow().then(r => {
            const rowIdx = this.grid1.instance.getRowIndexByKey(this.changes1[this.changes1.length - 1].key);
            this.setFocusRow(this.grid1, rowIdx);
        });
    }

    addClick2(e): void {
        this.addFlg2 = true;
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);
        this.changes3 = [];
        const grid1Idx = this.grid1.focusedRowIndex;

        if (grid1Idx > -1) {

            this.grid2.instance.addRow().then(r => {
                const rowIdx = this.grid2.instance.getRowIndexByKey(this.changes2[this.changes2.length - 1].key);
                this.setFocusRow(this.grid2, rowIdx);
            });

            this.grid1.instance.cellValue(grid1Idx, 'items', this.changes2);
        }
    }

    addClick3(e): void {
        const grid2Idx = this.grid2.focusedRowIndex;

        // 어플리케이션은 한개만 허용
        if (this.grid3.instance.totalCount() + this.changes3.length > 0) {
            return;
        }

        if (grid2Idx > -1) {

            this.grid3.instance.addRow().then(r => {
                const rowIdx = this.grid3.instance.getRowIndexByKey(this.changes3[this.changes3.length - 1].key);
                this.setFocusRow(this.grid3, rowIdx);
            });

            this.grid2.instance.cellValue(grid2Idx, 'items', this.changes2);
        }
    }

    async deleteClick1(e): Promise<void> {
        this.dataSource2 = this.initGridWithEntityStore(this.entityStore2);
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);

        this.changes2 = [];
        this.changes3 = [];

        if (this.grid1.focusedRowIndex > -1) {
            const focusedIdx = this.grid1.focusedRowIndex;

            this.grid1.instance.deleteRow(this.grid1.focusedRowIndex);
            this.entityStore1.push([{type: 'remove', key: this.grid1.focusedRowKey}]);

            this.grid1.focusedRowIndex = focusedIdx - 1;
        }
    }

    async deleteClick2(e): Promise<void> {
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);
        this.changes3 = [];

        if (this.grid2.focusedRowIndex > -1) {
            const focusedIdx = this.grid2.focusedRowIndex;
            this.grid2.instance.deleteRow(this.grid2.focusedRowIndex);
            this.entityStore2.push([{type: 'remove', key: this.grid2.focusedRowKey}]);

            this.grid2.focusedRowIndex = focusedIdx - 1;
        }
    }

    async deleteClick3(e): Promise<void> {
        if (this.grid3.focusedRowIndex > -1) {
            const focusedIdx = this.grid3.focusedRowIndex;

            this.grid3.instance.deleteRow(this.grid3.focusedRowIndex);
            this.entityStore3.push([{type: 'remove', key: this.grid3.focusedRowKey}]);

            this.grid3.focusedRowIndex = focusedIdx - 1;
        }
    }

    // 그리드 셀 이동시 호출하는 함수
    onFocusedCellChanging1(e): void {
        this.setFocusRow(this.grid1, e.rowIndex);
    }

    onFocusedRowChanging1(e): void {
        this.initGrid();
        if (e.rowIndex < 0 || !e.row || typeof e.row.data.uid === 'string') {
            return;
        } else {
            this.onSearchL2(e.row.data);
        }
    }

    onFocusedCellChanging2(e): void {
        this.setFocusRow(this.grid2, e.rowIndex);
    }

    onFocusedRowChanging2(e): Promise<void> {
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);
        this.changes3 = [];
        if (e.rowIndex < 0 || !e.row || typeof e.row.data.uid === 'string') {
            return;
        } else {
            this.onSearchApp(e.row.data);
        }
    }

    onFocusedCellChanging3(e): void {
        this.setFocusRow(this.grid3, e.rowIndex);
    }

    onFocusedRowChanging3(e): void {
        this.setFocusRow(this.grid3, e.rowIndex);
    }

    setFocusRow(grid, index): void {
        grid.focusedRowIndex = index;
    }

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

    onSelectionChanged(): void {
        // 그리드 초기화
        this.dataSource1 = this.initGridWithEntityStore(this.entityStore1);
        this.changes1 = [];
        this.initGrid();
    }

    initGrid(): void {
        this.dataSource2 = this.initGridWithEntityStore(this.entityStore2);
        this.changes2 = [];
        this.dataSource3 = this.initGridWithEntityStore(this.entityStore3);
        this.changes3 = [];
    }

    initGridWithEntityStore(entityStore: any): any {
        entityStore = new ArrayStore({data: [], key: this.key});
        return new DataSource({store: entityStore});
    }

}
