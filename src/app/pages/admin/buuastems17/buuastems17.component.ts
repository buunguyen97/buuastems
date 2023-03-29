import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from "devextreme-angular/ui/form";
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from "devextreme-angular";
import {FormControl, FormGroup} from "@angular/forms";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {Buuastems12Service} from "../buuastems12/buuastems12.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-buuastems17',
    templateUrl: './buuastems17.component.html',
    styleUrls: ['./buuastems17.component.scss']
})

export class Buuastems17Component implements OnInit, AfterViewInit {
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
    @ViewChild('mainGrid2', {static: false}) mainGrid2: DxDataGridComponent;

    @ViewChild('popup', {static: false}) popup: DxPopupComponent;
    @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
    @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

    G_TENANT: any = this.utilService.getTenant();
    pageInfo: any = this.utilService.getPageInfo();
    public moihe: string = this.utilService.convert1('mm.code.codeCategory', 'ID');
    myForm: FormGroup;
    public tilte = "";
    public share = "";
    public discount = "";
    public model = "";
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
        "title": "배추유나카드",
        "share": "10%",
        "discount": "25%",
        "insert": "01/01/2018",
        "update": "16/10/9999",
        "model": "001",
        "price": "",


    },
        {
            "id": 2,
            "title": "한샘그룹카드",
            "share": "0%",
            "discount": "5%",
            "insert": "16/10/2012",
            "update": "31/12/9999",
            "model": "002",
            "price": "",
        }
        ,
        {
            "id": 3,
            "title": "테스트용카드",
            "share": "50%",
            "discount": "",
            "insert": "16/10/2017",
            "update": "01/10/9999",
            "model": "004",
            "price": "",
        }
        ,
        {
            "id": 4,
            "title": "Hi",
            "share": "50%",
            "discount": "50%",
            "insert": "1/07/2010",
            "update": "16/12/9999",
            "model": "005",
            "price": "4000",
        }
    ];
    dataTitle = [
        {
            "id": 1,
            "title": "No.",
            "dataField": "id",

        },

        {
            "id": 2,
            "title": "제휴카드사명",
            "dataField": "title",

        }
        ,
        {
            "id": 3,
            "title": "분담율",
            "dataField": "share",

        },
        {
            "id": 4,
            "title": "할인율",
            "dataField": "discount",
        }

    ];
    dataTest2 = [];
    dataTest2Search = [{
        "id": 1,
        "col1": "xp",
        "col2": "xp1",
        "col3": "xp2",
        "col4": "xp테스트",
        "col5": "20%",
        "model": "001"


    },
        {
            "id": 2,
            "col1": "xp",
            "col2": "xp1",
            "col3": "xp2",
            "col4": "xp테스트",
            "col5": "20%",
            "model": "001"
        }
        ,
        {
            "id": 3,
            "col1": "xp",
            "col2": "xp1",
            "col3": "xp2",
            "col4": "xp테스트",
            "col5": "20%",
            "model": "001"
        }
        ,
        {
            "id": 4,
            "col1": "xp",
            "col2": "xp1",
            "col3": "xp2",
            "col4": "xp테스트",
            "col5": "20%",
            "model": "002"
        }
        ,
        {
            "id": 5,
            "col1": "xp",
            "col2": "xp1",
            "col3": "xp2",
            "col4": "xp테스트",
            "col5": "20%",
            "model": "002"
        }
    ];
    dataTitle2 = [
        {
            "id": 1,
            "title": "대분류명",
            "dataField": "col1",
            "alignment": "left",

        },

        {
            "id": 2,
            "title": "중분류명",
            "dataField": "col2",
            "alignment": "center",

        }
        ,
        {
            "id": 3,
            "title": "소분류명",
            "dataField": "col3",
            "alignment": "left",

        },
        {
            "id": 4,
            "title": "상품명",
            "dataField": "col4",
            "alignment": "center",
        }
        ,
        {
            "id": 5,
            "title": "할인율",
            "dataField": "col5",
            "alignment": "left",
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

    async onRowClick(e): Promise<void> {
        // this.mainForm.formData.codeCategory = e.data.codeCategory;
        // this.mainForm.formData.name = e.data.name;
        // this.themText = e.data.isEditPossibleFlg;
        console.log(e.data);
        this.tilte = e.data.title;
        this.discount = e.data.discount;
        this.share = e.data.share;
        this.model = e.data.model;
        this.price = e.data.price;

        let dateStr = e.data.insert;
        let parts = dateStr.split("/");
        this.date1 = new Date(parts[2], parts[1] - 1, parts[0]);

        let dateStr1 = e.data.update;
        let parts1 = dateStr1.split("/");
        this.date2 = new Date(parts1[2], parts1[1] - 1, parts1[0]);

        this.mainGrid2.dataSource = this.dataTest2Search.filter((item) => item.model === e.data.model);


    }

    handleKeyDown(event: any) {
        console.log('Key pressed:', event.key);
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
}