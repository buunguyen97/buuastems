import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxAccordionComponent, DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {PhongService, Order, Test} from './phong.service';

@Component({
    selector: 'app-phong',
    templateUrl: './phong.component.html',
    styleUrls: ['./phong.component.scss']
})

export class PhongComponent implements OnInit, AfterViewInit {
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
    @ViewChild('subGrid', {static: false}) subGrid: DxDataGridComponent;

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

    @ViewChild('acrdn', {static: false}) acrdn: DxAccordionComponent;

    G_TENANT: any = this.utilService.getTenant();
    pageInfo: { path: string, pathName: string, title: string, menuL2Id: number } = this.utilService.getPageInfo();

    mainKey = 'uid';

    isNewPopup = true;
    termContentValue: string;

    dsYN = [];
    oders: Order [];
    tests: Test [];

    GRID_STATE_KEY = 'mm_tran';
    saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
    loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

    saveStateSub = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_sub');
    loadStateSub = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_sub');


    constructor(public utilService: CommonUtilService,
                private codeService: CommonCodeService,
                private service: PhongService,
                public gridUtil: GridUtilService) {
        this.oders = service.getOders();
        this.tests = service.getTests();
    }

    ngOnInit(): void {
        this.initCode();
    }

    ngAfterViewInit(): void {
        this.utilService.fnAccordionExpandAll(this.acrdn);
        this.utilService.getGridHeight(this.mainGrid);
        this.utilService.getGridHeight(this.subGrid);
        this.utilService.getFoldable(this.mainForm, this.foldableBtn);
        this.utilService.getShowBookMark(
            {
                tenant: this.G_TENANT,
                userId: this.utilService.getUserUid(),
                menuL2Id: this.pageInfo.menuL2Id
            }, this.bookmarkBtn
        ).then();

        this.mainForm.instance.focus();
    }

    initCode(): void {

        this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
            this.dsYN = result.data;
        });
    }

    async onSearch(): Promise<void> {
        const executionTxt = this.utilService.convert1('com.btn.search', '조회');

        this.mainForm.formData.tenant = this.G_TENANT;

    }

    async onDelete(): Promise<void> {
        // console.log(111)
        const Remove = this.mainForm.formData.ID
        const indexToRemove = this.oders.findIndex((item) => item.ID === Remove);
        let deletedData = null;
        if (indexToRemove !== -1) {
            deletedData = this.oders.splice(indexToRemove, 1)[0];
        }
        this.mainForm.formData = {};
    }

    async onEdit(): Promise<void> {

        const editID = this.mainForm.formData.ID
        const editText = this.mainForm.formData.text1;
        const editNum = this.mainForm.formData.num;
        this.mainForm.formData.ID = editID;
        this.mainForm.formData.text1 = editText;
        this.mainForm.formData.num = editNum;
        console.log(editID, editText, editNum)
    }

    onCellClick(e): void {
        console.log(e.column.index);
        if (e.column.index === 3) {
            this.subGrid.dataSource = this.tests.filter((item) => item.model === e.data.model);
        }
        if (e.column.index === 3) {
            const Click = e.row.data.text1;
            const Click1 = e.row.data.num;
            const Click2 = e.row.data.ID;
            this.mainForm.formData.text1 = Click;
            this.mainForm.formData.num = Click1;
            this.mainForm.formData.ID = Click2;
        }
        // if (e.column.headerId === 'dx-col-16') {
        //   this.router.navigate(['/tr/admin/astemsphong20'], {skipLocationChange: true});
        // }

    }

    async onClickSave(e): Promise<void> {
        const executionTxt = this.utilService.convert1('com.btn.save', '저장');

        if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
            const saveMainData = await this.utilService.collectGridData(this.mainGrid.editing.changes);
            const saveSubData = await this.collectSubGridData(this.subGrid.editing.changes);

            console.log(saveMainData);
            console.log(saveSubData);
        }
    }

    onMainGridAddRow(): void {
        this.mainGrid.dataSource = this.mainGrid.dataSource || this.utilService.setGridDataSource([], this.mainKey);

        this.mainGrid.instance.addRow().then(() => {
            this.setFocusRow(this.mainGrid, this.mainGrid.instance.getVisibleRows().length - 1);
        });
    }

    onMainGridDeleteRow(): void {

        if (this.mainGrid.focusedRowIndex > -1) {
            this.mainGrid.instance.deleteRow(this.mainGrid.focusedRowIndex);
            this.mainGrid.instance.getDataSource().store().push([{type: 'remove', key: this.mainGrid.focusedRowKey}]);
            this.setFocusRow(this.mainGrid, this.mainGrid.focusedRowIndex - 1);
        }
    }

    setFocusRow(grid, index): void {
        grid.focusedRowIndex = index;
    }

    onFocusedCellChanged(e): void {
        this.setFocusRow(this.mainGrid, e.rowIndex);
    }

    async collectSubGridData(changes: any): Promise<any[]> {
        const gridList = [];

        for (const rowIndex in changes) {
            const changeData = await this.subGrid.instance.byKey(changes[rowIndex].key);

            if (!changeData.uid) {

                gridList.push(
                    Object.assign(
                        changeData, {operType: 'insert', uid: null, tenant: this.G_TENANT}
                    )
                );
            } else {

                gridList.push(
                    Object.assign(
                        changeData, {operType: changes[rowIndex].type}
                    )
                );
            }
        }
        return gridList;
    }

    onFocusedCellChangedSubGrid(e): void {

        if (e.column.dataField === 'standardMinute' || e.column.dataField === 'mileageAvg') {
            const cdCtgNm = this.subGrid.instance.cellValue(e.rowIndex, 'codecategoryNm');
            e.column.allowEditing = cdCtgNm === '차량옵션' ? false : true;
        }
    }
}

