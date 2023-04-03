import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from "devextreme-angular/ui/form";
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from "devextreme-angular";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {Buuastems12Service} from "../buuastems12/buuastems12.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-astems21',
    templateUrl: './astems21.component.html',
    styleUrls: ['./astems21.component.scss']
})
export class Astems21Component implements OnInit, AfterViewInit {
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainForm1', {static: false}) mainForm1: DxFormComponent;
    @ViewChild('mainForm2', {static: false}) mainForm2: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
    @ViewChild('mainGrid2', {static: false}) mainGrid2: DxDataGridComponent;
    @ViewChild('mainGrid1', {static: false}) mainGrid1: DxDataGridComponent;

    @ViewChild('popup', {static: false}) popup: DxPopupComponent;
    @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
    @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;
    @ViewChild('forminput') forminput: NgForm;

    G_TENANT: any = this.utilService.getTenant();
    pageInfo: any = this.utilService.getPageInfo();
    public moihe: string = this.utilService.convert1('mm.code.codeCategory', 'ID');
    myForm: FormGroup;
    public tilte = "";
    public share = "";
    public discount = "";
    public model = "";
    public flag = false;
    public price = "";
    imagene = 'my-css-class';
    mainKey = 'uid';
    popupKey = 'uid';
    date2: Date = new Date();
    date1: Date = new Date();
    // @Input() type = "month";
    // @Input() displayFormat = "dd/MM/yyyy";
    dataTest = [{
        "id": 1,
        "title": "20180206",
        "model": "001",


    },
        {
            "id": 2,
            "title": "0218",
            "model": "002",
        }
        ,
        {
            "id": 3,
            "title": "교육용0001대분류",
            "model": "004",
        }
        ,
        {
            "id": 4,
            "title": "대테스트0609",
            "model": "005",
        }
    ];
    dataTest1 = [{
        "id": 1,
        "title": "교육용",
        "model": "001",
        "model1": "001",


    },
        {
            "id": 2,
            "title": "교육용2",
            "model": "001",
            "model1": "002",
        }
        ,
        {
            "id": 3,
            "title": "0218",
            "model": "002",
            "model1": "003",
        }
        ,
        {
            "id": 4,
            "title": "교육용0001중분류",
            "model": "003",
            "model1": "004",
        }
    ];
    dataTitle = [

        {
            "id": 2,
            "title": "대분류명칭",
            "dataField": "title",
            "cssClass": "title",

        }


    ];
    dataTitle1 = [

        {
            "id": 2,
            "title": "중분류명칭",
            "dataField": "title",
            "cssClass": "title",

        }


    ];
    dataTitle2 = [

        {
            "id": 2,
            "title": "명칭",
            "dataField": "col1",
            "cssClass": "title",

        }
        ,

        {
            "id": 3,
            "title": "상품수",
            "dataField": "col2",

        }


    ];
    data1 = [];
    data2 = [];
    value1 = "";
    value2 = "";
    value3 = "";
    dataTest2 = [{
        "id": 1,
        "col1": "xp",
        "col2": "xp1",
        "model1": "001"


    },
        {
            "id": 2,
            "col1": "xp777",
            "col2": "xp1",
            "model1": "001"
        }
        ,
        {
            "id": 3,
            "col1": "xp666",
            "col2": "xp1",
            "model1": "001"
        }
        ,
        {
            "id": 4,
            "col1": "xp555",
            "col2": "xp1",
            "model1": "002"
        }
        ,
        {
            "id": 5,
            "col1": "xp7",
            "col2": "xp1",
            "model1": "002"
        }
    ];

    isNewPopup = true;
    changesHien = false;
    changes = [];
    public themText = '';
    dsYN = [];
    dsUser = [];
    GRID_STATE_KEY = 'mm_code';
    saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
    loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
    saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
    loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');


    // }

    constructor(public utilService: CommonUtilService,
                private service: Buuastems12Service,
                private codeService: CommonCodeService,
                public gridUtil: GridUtilService,
                private router: Router) {

        this.onClickPopupSave = this.onClickPopupSave.bind(this);
        this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
        this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
        this.date1.setMonth(this.date1.getMonth() - 1);
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

    async onSearch(): Promise<void> {
        console.log(this.mainForm.formData.codeCategory);
        if (this.mainForm.formData.codeCategory && this.mainForm.formData.name) {
            const lastItem = this.dataTest[this.dataTest.length - 1];
            const newId = lastItem.id + 1;
            const currentDate = new Date();

            this.mainGrid.dataSource = this.dataTest;
            this.mainGrid.focusedRowKey = null;
            this.mainGrid.paging.pageIndex = 0;
            this.mainForm.formData = {};
        }
    }

    onReset1(): void {
        this.mainForm.formData = {};
    }

    onReset2(): void {
        this.mainForm1.formData.codeCategory = "";
    }

    onReset3(): void {
        this.mainForm2.formData.col1 = "";
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

        console.log(e.column)
        if (e.column.index === 3 && e.column.caption === "대분류명칭") {
            this.mainGrid1.dataSource = this.dataTest1.filter((item) => item.model === e.data.model);
            this.mainForm.formData.codeCategory = e.data.title;
            this.mainForm.formData.model = e.data.model;
            this.mainForm1.formData.codeCategory = "";
            this.mainForm1.formData.model = e.data.model;
            this.mainForm2.formData.codeCategory = "";
            this.mainGrid2.dataSource = [];
        }


    }

    async handleCellClick1(e): Promise<void> {

        console.log(e.column)
        if (e.column.index === 3 && e.column.caption === "중분류명칭") {
            this.mainGrid2.dataSource = this.dataTest2.filter((item) => item.model1 === e.data.model1);
            this.mainForm1.formData.codeCategory = e.data.title;
            this.mainForm1.formData.model1 = e.data.model1;
            this.mainForm2.formData.codeCategory = "";
            this.mainForm2.formData.model1 = e.data.model1;

        }


    }

    async handleCellClick2(e): Promise<void> {

        if (e.column.index === 3 && e.column.caption === "명칭") {
            this.mainForm2.formData.col1 = e.data.col1;
            this.mainForm2.formData.model1 = e.data.model1;
        }


    }

    onSave1() {
        console.log(this.mainForm.formData);
        if (this.mainForm.formData.codeCategory) {
            const lastItem = this.dataTest[this.dataTest.length - 1];
            let newId;
            let newModel;
            if (this.dataTest.length === 0) {
                newModel = "001";
                newId = 1;
            } else {
                newModel = (parseInt(lastItem.model) + 1).toString().padStart(3, '0');
                newId = lastItem.id + 1;
            }

            console.log(newModel);
            const newObject = {
                "id": newId,
                "title": this.mainForm.formData.codeCategory,
                "model": newModel

            };
            this.dataTest.push(newObject);
            this.mainGrid.dataSource = this.dataTest;

            this.mainGrid.focusedRowKey = null;
            this.mainGrid.paging.pageIndex = 0;
            this.mainForm.formData = {};
            this.mainForm1.formData = {};
            this.mainForm2.formData = {};
            this.mainGrid1.dataSource = [];
            this.mainGrid2.dataSource = [];
        }
        console.log(this.dataTest);
    }

    onSave2() {
        console.log(this.mainForm1.formData);
        if (this.mainForm1.formData.codeCategory && this.mainForm1.formData.model) {
            console.log(this.mainForm1.formData.model);
            const lastItem = this.dataTest1[this.dataTest1.length - 1];
            // const newId = lastItem.id + 1;
            // const newModel = (parseInt(lastItem.model) + 1).toString().padStart(3, '0');
            let newId;
            let newModel;
            if (this.dataTest.length === 0) {
                newModel = "001";
                newId = 1;
            } else {
                newModel = (parseInt(lastItem.model) + 1).toString().padStart(3, '0');
                newId = lastItem.id + 1;
            }

            const newObject = {
                "id": newId,
                "title": this.mainForm1.formData.codeCategory,
                "model": this.mainForm1.formData.model,
                "model1": newModel,

            };
            this.dataTest1.push(newObject);
            // this.mainGrid1.dataSource = this.dataTest1;
            this.mainGrid1.dataSource = this.dataTest1.filter((item) => item.model === this.mainForm1.formData.model);
            this.mainGrid1.focusedRowKey = null;
            this.mainGrid1.paging.pageIndex = 0;
            this.mainForm1.formData.codeCategory = "";
            this.mainForm2.formData = {};
            this.mainGrid2.dataSource = [];
        }
    }

    onSave3() {
        if (this.mainForm2.formData.col1 && this.mainForm2.formData.model1) {
            const lastItem = this.dataTest2[this.dataTest2.length - 1];
            let newId;
            if (this.dataTest2.length === 0) {
                newId = 1;
            } else {
                newId = lastItem.id + 1;
            }
            const newObject = {
                "id": newId,
                "col1": this.mainForm2.formData.col1,
                "col2": this.mainForm2.formData.col1,
                "model1": this.mainForm2.formData.model1

            };
            this.dataTest2.push(newObject);
            // this.mainGrid2.dataSource = this.dataTest2;
            this.mainGrid2.dataSource = this.dataTest2.filter((item) => item.model1 === this.mainForm2.formData.model1);
            this.mainGrid2.focusedRowKey = null;
            this.mainGrid2.paging.pageIndex = 0;
            this.mainForm2.formData.col1 = "";
        }
    }


    async onDelete1(): Promise<any> {
        if (this.mainForm.formData.flag) {
            this.dataTest = [];
            this.dataTest1 = [];
            this.dataTest2 = [];
            this.mainGrid.dataSource = [];
            this.mainGrid1.dataSource = [];
            this.mainGrid2.dataSource = [];
        } else {
            if (this.mainForm.formData.model) {
                console.log(this.mainForm.formData.model);
                this.mainForm1.formData = {};
                this.mainForm2.formData = {};
                this.mainGrid1.dataSource = [];
                this.mainGrid2.dataSource = [];

                const titleToRemove = this.mainForm.formData.model;
                const indexToRemove = this.dataTest.findIndex((item) => item.model === titleToRemove);
                let deletedData = null;

                if (indexToRemove !== -1) {
                    deletedData = this.dataTest.splice(indexToRemove, 1)[0];
                }
                this.dataTest1 = this.dataTest1.filter(item => item.model !== titleToRemove);
                this.mainForm.formData = {};
                this.mainGrid.dataSource = this.dataTest;
                return deletedData;
            }
        }


    }

    async onDelete2(): Promise<any> {
        if (this.mainForm1.formData.flag) {

            this.dataTest1 = [];
            this.dataTest2 = [];
            this.mainGrid1.dataSource = [];
            this.mainGrid2.dataSource = [];
        } else {

            if (this.mainForm1.formData.codeCategory && this.mainForm1.formData.model1) {
                this.mainForm2.formData = {};
                this.mainGrid2.dataSource = [];
                console.log(2222);
                const titleToRemove = this.mainForm1.formData.model1
                const indexToRemove = this.dataTest1.findIndex((item) => item.model1 === titleToRemove);
                let deletedData = null;
                this.mainForm1.formData.codeCategory = "";
                if (indexToRemove !== -1) {
                    deletedData = this.dataTest1.splice(indexToRemove, 1)[0];
                }
                this.dataTest2 = this.dataTest2.filter(item => item.model1 !== titleToRemove);
                this.mainGrid1.dataSource = this.dataTest1.filter((item) => item.model === this.mainForm1.formData.model);
                return deletedData;
            }
        }

    }

    async onDelete3(): Promise<any> {
        if (this.mainForm2.formData.flag) {
            this.dataTest2 = [];
            this.mainGrid2.dataSource = [];
        } else {

            if (this.mainForm2.formData.col1 && this.mainForm2.formData.model1) {

                const titleToRemove = this.mainForm2.formData.col1;
                const indexToRemove = this.dataTest2.findIndex((item) => item.col1 === titleToRemove);
                let deletedData = null;
                this.mainForm2.formData.col1 = "";
                if (indexToRemove !== -1) {
                    deletedData = this.dataTest2.splice(indexToRemove, 1)[0];
                }
                this.mainGrid2.dataSource = this.dataTest2.filter((item) => item.model1 === this.mainForm2.formData.model1);
                return deletedData;
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

    async onChange(): Promise<any> {
        console.log(this.mainForm.formData.id);

    }

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
                this.onSearch().then();
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

        this.onSearch().then();
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

    handleSelectionChanged(e) {
        const selectedRows = e.selectedRowsData;
        const allRows = e.component.getVisibleRows();
        if (selectedRows.length === allRows.length) {
            this.mainForm.formData.flag = true;
        }
    }

    handleSelectionChanged1(e) {
        const selectedRows = e.selectedRowsData;
        const allRows = e.component.getVisibleRows();
        if (selectedRows.length === allRows.length) {
            this.mainForm1.formData.flag = true;
        }
    }

    handleSelectionChanged2(e) {
        const selectedRows = e.selectedRowsData;
        const allRows = e.component.getVisibleRows();
        if (selectedRows.length === allRows.length) {
            this.mainForm2.formData.flag = true;
        }
    }
}