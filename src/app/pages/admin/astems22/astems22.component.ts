import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from "devextreme-angular/ui/form";
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from "devextreme-angular";
import {FormControl, FormGroup} from "@angular/forms";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {Buuastems13Service} from "../buuastems13/buuastems13.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";
import {Router} from "@angular/router";
import {exportDataGrid} from "devextreme/excel_exporter";
import * as ExcelJS from 'exceljs';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-astems22',
    templateUrl: './astems22.component.html',
    styleUrls: ['./astems22.component.scss']
})

export class Astems22Component implements OnInit, AfterViewInit {
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

    @ViewChild('popup', {static: false}) popup: DxPopupComponent;
    @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
    @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

    G_TENANT: any = this.utilService.getTenant();
    pageInfo: any = this.utilService.getPageInfo();
    public moihe: string = this.utilService.convert1('mm.code.codeCategory', 'ID');
    myForm: FormGroup;
    exporting = false;
    imagene = 'my-css-class';
    mainKey = 'uid';
    popupKey = 'uid';

    dataTest = [{
        "id": 1,
        "title": "00000",
        "model": "T0000200",
        "unit": "Box(1)",
        "test1": "Box",
        "test2": "EA",
        "price1": "0",
        "price2": 27272736,
        "productName1": "",
        "productName2": "",
        "productName3": undefined,


    },
        {
            "id": 2,
            "title": "000A1234",
            "model": "T9876544",
            "unit": "Kg(10)",
            "test1": "Kg",
            "test2": "G",
            "price1": "-3276",
            "price2": 83425,
            "productName1": "",
            "productName2": "",
            "productName3": undefined,
        }
        ,
        {
            "id": 3,
            "title": "00000",
            "model": "T0000200",
            "unit": "EA",
            "test1": "",
            "test2": "EA",
            "price1": "1000",
            "price2": -180438160,
            "productName1": "",
            "productName2": "",
            "productName3": undefined,
        }
    ];

    isNewPopup = true;
    changesHien = false;

    changes = [];
    public themText = '';
    dsYN = [];
    dsUser = [];
    titleHeader: string;
    idHeader: number;

    GRID_STATE_KEY = 'mm_code';
    saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
    loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
    saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
    loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');

    // }

    function

    constructor(public utilService: CommonUtilService,
                private service: Buuastems13Service,
                private codeService: CommonCodeService,
                public gridUtil: GridUtilService,
                private router: Router) {

        this.onClickPopupSave = this.onClickPopupSave.bind(this);
        this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
        this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
        this.myForm = new FormGroup({
            title: new FormControl('')
        });
    }

    ngOnInit(): void {
        this.initCode();
    }

    onSubmit(form: any): void {
        console.log('you submitted value:', form);
    }

    calculateAreaSummary(options) {
    }

    aaa() {
        alert(1111);
    }

    // async onSearch(): Promise<void> {
    //     const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    //     this.mainForm.formData.tenant = this.G_TENANT;
    //
    //     const result = await this.service.sendPost(this.mainForm.formData, 'findCodeCategory');
    //     console.log(result);
    //     if (this.utilService.resultMsgCallback(result, executionTxt)) {
    //         this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
    //         this.mainGrid.focusedRowKey = null;
    //         this.mainGrid.paging.pageIndex = 0;
    //     }

    ngAfterViewInit(): void {

        this.utilService.getGridHeight(this.mainGrid);
        this.utilService.getFoldable(this.mainForm, this.foldableBtn);
        this.utilService.getShowBookMark(
            {
                tenant: this.G_TENANT,
                userId: this.utilService.getUserUid(),
                menuL2Id: this.pageInfo.menuL2Id
            }, this.bookmarkBtn
        ).then();
        this.mainForm.instance.focus();
        this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
    }

    initCode(): void {

        this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
            this.dsYN = result.data;
        });

        this.codeService.getUser(this.G_TENANT).subscribe(result => {
            this.dsUser = result.data;
        });
    }

    onReset(): void {
        console.log(111);
        this.mainForm.formData = {};
    }

    onNew(e): void {
        this.isNewPopup = true;
        this.popup.title = this.utilService.convert1('mm.code.newCode', '코드 신규');
        this.popupForm.formData.isUsingSystemFlg = this.dsYN[1].code;
        this.popupForm.formData.isEditPossibleFlg = this.dsYN[0].code;
        this.popup.visible = true;
    }

    onRowDblClick(e): void {
        this.isNewPopup = false;
        this.popup.title = this.utilService.convert1('mm.code.editCode', '코드 수정');
        this.onSearchPopup(e.data).then();
    }

    async onSearchPopup(eData): Promise<void> {
        const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
        const result = await this.service.sendPost(eData, 'findCodeCategoryFull');
        console.log(result.data.name);
        if (this.utilService.resultMsgCallback(result, executionTxt)) {
            this.popupForm.formData = result.data;
            this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data.codeList, this.popupKey);
            this.popup.visible = true;
        }
    }

    async handleCellClick(e): Promise<void> {
        console.log(e.column.index);
        if (e.column.index === 3) {
            this.router.navigate(['/tr/admin/buuastems14'], {skipLocationChange: true});
            this.codeService.setTitleHeader(e.data.title);
            this.codeService.setIdHeader(e.data.id);
        }
        if (e.column.index === 2) {
            console.log(e.data.title);
            this.mainForm.formData.codeCategory = e.data.title;
            this.mainForm.formData.name = e.data.author;
            this.mainForm.formData.id = e.data.id;
            this.changesHien = true;
        }


    }

    async onDelete(): Promise<any> {
        console.log(111);
        const titleToRemove = this.mainForm.formData.codeCategory
        const indexToRemove = this.dataTest.findIndex((item) => item.title === titleToRemove);
        let deletedData = null;
        this.mainForm.formData = {};
        if (indexToRemove !== -1) {
            deletedData = this.dataTest.splice(indexToRemove, 1)[0];
        }
        this.mainGrid.dataSource = this.dataTest;
        return deletedData;

    }

    changeInput() {
        this.dataTest = this.mainGrid.instance.getDataSource().items();
        console.log(this.dataTest);
        for (let i = 0; i < this.dataTest.length; i++) {
            if (this.dataTest[i].productName1 !== '') {
                if (this.dataTest[i].test1 === 'Box') {
                    this.dataTest[i].unit = 'Box(' + this.dataTest[i].productName1 + ')';
                }
                if (this.dataTest[i].test1 === 'Kg') {
                    this.dataTest[i].unit = 'Kg(' + this.dataTest[i].productName1 + ')';
                }
                if (this.dataTest[i].test1 === '') {
                    this.dataTest[i].unit = 'EA(' + this.dataTest[i].productName1 + ')';
                }
            }
            if (this.dataTest[i].productName2 !== '') {
                this.dataTest[i].price1 = this.dataTest[i].productName2;
            }
            if (this.dataTest[i].productName3 !== undefined) {
                this.dataTest[i].price2 = this.dataTest[i].productName3;
            }
            this.dataTest[i].productName1 = '';
            this.dataTest[i].productName2 = '';
            this.dataTest[i].productName3 = undefined;
        }
        this.mainGrid.dataSource = this.dataTest;
    }

    exportGrid() {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        const columnWidths = [5, 20, 40, 20, 30, 30]; // Change these values to set the desired column widths
        columnWidths.forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });
        // Add column headers
        const columns = this.mainGrid.instance.getVisibleColumns().filter(col => col.dataField !== 'productName1' && col.dataField !== 'productName2' && col.dataField !== 'productName3');

        const headerRow = [];
        columns.forEach((column) => {
            headerRow.push(column.caption);
        });
        worksheet.addRow(headerRow);
        // Make headers bold
        const firstRow = worksheet.getRow(1);
        firstRow.eachCell((cell) => {
            cell.font = {bold: true};
        });

        // Add rows
        const rows = this.mainGrid.instance.getDataSource().items();
        console.log(rows)
        rows.forEach((row) => {
            const dataRow = [];
            columns.forEach((column) => {
                dataRow.push(row[column.dataField]);
            });
            worksheet.addRow(dataRow);
        });


// Set borders
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, columnNumber) => {
                cell.border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
            });
        });
        // Export the file
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            saveAs(blob, 'data.xlsx');
        });
    }

    onExporting(e) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid({
            component: this.mainGrid.instance,
            worksheet: worksheet,
        }).then(function () {
            workbook.xlsx.writeBuffer()
                .then(function (buffer: BlobPart) {
                    saveAs(new Blob([buffer], {type: 'application/octet-stream'}), 'Datatable.xlsx');
                });
        });
    }

    calculateSelectedRow(options) {
        if (options.name === 'price2') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue += options.value.price2;
            }
        }
    }

    // async onChange(): Promise<any> {
    //     console.log(this.mainForm.formData.uid);
    //     const targetObject = this.dataTest.find((item) => item.id === this.mainForm.formData.id);
    //     if (targetObject) {
    //         targetObject.title = this.mainForm.formData.codeCategory;
    //         targetObject.author = this.mainForm.formData.name;
    //     }
    // }


    async onClickPopupSave(e): Promise<void> {
        const popupValidate = this.popupForm.instance.validate();
        const popupFormData = this.popupForm.formData;
        const detailList = this.collectGridData(this.changes);
        const executionTxt = this.utilService.convert1('com.btn.save', '저장');

        if (popupValidate.isValid) {
            let result;
            popupFormData.tenant = this.G_TENANT;
            popupFormData.codeList = detailList;

            if (this.isNewPopup) {
                result = await this.service.sendPost(popupFormData, 'saveCodeCategory');
            } else {
                result = await this.service.sendPost(popupFormData, 'updateCodeCategory');
            }

            if (this.utilService.resultMsgCallback(result, executionTxt)) {
                this.popup.visible = false;

            }
        }
    }

    async onClickPopupDelete(e): Promise<void> {
        const popupFormData = this.popupForm.formData;
        const executionTxt = this.utilService.convert1('com.btn.del', '삭제');

        if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
            const result = await this.service.sendPost(popupFormData, 'deleteCodeCategory');

            if (this.utilService.resultMsgCallback(result, executionTxt)) {
                this.popup.visible = false;
            }
        }
    }

    onInitNewRow(e): void {
        e.data.tenant = this.G_TENANT;
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

    onClickPopupCancel(e): void {
        this.popup.visible = false;
    }

    onHiddenPopup(e): void {
        this.popupForm.formData = {};
        this.popupForm.instance.repaint();
        this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
        this.popupGrid.instance.cancelEditData();
        this.popupGrid.focusedRowKey = null;
        this.popupGrid.paging.pageIndex = 0;

    }

    setFocusRow(index, grid): void {
        grid.focusedRowIndex = index;
    }

    onFocusedCellChanging(e, grid): void {
        this.setFocusRow(e.rowIndex, grid);
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
}