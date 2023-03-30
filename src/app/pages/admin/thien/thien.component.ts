import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {ThienService, UserVO, MenuSearchVO, Order, Food, Eat} from './thien.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {CookieService} from 'ngx-cookie-service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {APPCONSTANTS} from '../../../shared/constants/appconstants';
import {Router} from '@angular/router';


@Component({
    selector: 'app-thien',
    templateUrl: './thien.component.html',
    styleUrls: ['./thien.component.scss']
})

export class ThienComponent implements OnInit, AfterViewInit {


    @ViewChild('Form', {static: false}) Form: DxFormComponent;
    @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
    @ViewChild('mainForm1', {static: false}) mainForm1: DxFormComponent;
    @ViewChild('mainForm2', {static: false}) mainForm2: DxFormComponent;
    @ViewChild('mainForm3', {static: false}) mainForm3: DxFormComponent;
    @ViewChild('mainForm4', {static: false}) mainForm4: DxFormComponent;
    @ViewChild('mainForm5', {static: false}) mainForm5: DxFormComponent;
    @ViewChild('mainForm6', {static: false}) mainForm6: DxFormComponent;
    @ViewChild('mainForm7', {static: false}) mainForm7: DxFormComponent;
    @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

    @ViewChild('popup', {static: false}) popup: DxPopupComponent;
    @ViewChild('push', {static: false}) push: DxPopupComponent;
    @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
    @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
    @ViewChild('newBtn', {static: false}) newBtn: DxButtonComponent;
    @ViewChild('deleteBtn', {static: false}) deleteBtn: DxButtonComponent;
    @ViewChild('resetPwdBtn', {static: false}) resetPwdBtn: DxButtonComponent;


    @ViewChild('pwdPopup', {static: false}) pwdPopup: DxPopupComponent;
    @ViewChild('pwdPopupForm', {static: false}) pwdPopupForm: DxFormComponent;
    @ViewChild('pwdBtn', {static: false}) pwdBtn: DxButtonComponent;

    @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
    @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

    @ViewChild('addPopup1', {static: false}) addPopup1: DxPopupComponent;
    @ViewChild('addCardBtn', {static: false}) addCardBtn: DxButtonComponent;
    @ViewChild('addPopup2', {static: false}) addPopup2: DxPopupComponent;

    //카드 추가 팝업
    cardOptions: any[] = [{
        ImageSrc: '/assets/images/card1.png',
    }, {
        ImageSrc: '/assets/images/card2.png',
    }, {
        ImageSrc: '/assets/images/card3.png',
    }, {
        ImageSrc: '/assets/images/card4.png',
    }];

    Data = [
        {Bill_No: 'J01', 상품코드: 'Thien', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J02', 상품코드: 'Buu', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J03', 상품코드: 'Phong', 현금매출: 'Vinhomes Golden', 고객명: 'N'},
        {Bill_No: 'J04', 상품코드: 'Tinh', 현금매출: 'Vinhomes Golden', 고객명: 'N'}];

    public inputText1 = '';

    orders: Order[];
    foods: Food[];
    eats: Eat[];

    V

    // Global
    G_TENANT: any;
    pageInfo: any = this.utilService.getPageInfo();

    // ***** main ***** //
    // Form
    // mainFormData = {};
    mainFormData: MenuSearchVO = {} as MenuSearchVO;
    keys = 'ID';
    popupVisible = false;
    // Grid
    mainGridDataSource: DataSource;
    mainEntityStore: ArrayStore;
    key = 'uid';
    mainKey = 'text';
    // ***** main ***** //

    // ***** popup ***** //
    popupMode = 'Add';
    // Form
    popupFormData: UserVO;
    // ***** popup ***** //

    // DataSets
    dsOwnerId = [];
    popupKey = 'uid';
    dsActFlg = [];
    dsCompany = [];
    dsUserGroup = [];
    dsUser = [];
    changes = [];
    dsUserType = [];
    isNewPopup = true;
    selectedRowIndex = -1;
    public qr = '';
    public pion = '';
    public pions = '';
    public money = '';

    pwdPopupData = {
        changePassword: ''
    };


    // Grid State
    GRID_STATE_KEY = 'mm_user1';
    loadState = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY);
    saveState = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY);
    data1 = this.service.data1;
    data2 = this.service.data2;
    data3 = this.service.data3;
    data4 = this.service.data4;
    trNum = 4;

    constructor(public utilService: CommonUtilService,
                private router: Router,
                private service: ThienService,
                private cookieService: CookieService,
                private codeService: CommonCodeService,
                public gridUtil: GridUtilService) {
        this.onSearch = this.onSearch.bind(this);
        this.pwdPopupSaveClick = this.pwdPopupSaveClick.bind(this);
        this.pwdPopupCancelClick = this.pwdPopupCancelClick.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

        this.addPopupClose = this.addPopupClose.bind(this);
        this.addPopupClose2 = this.addPopupClose2.bind(this);
        this.addCard = this.addCard.bind(this);
        this.delCard = this.delCard.bind(this);
        this.addBankTr = this.addBankTr.bind(this);

        this.orders = service.getOrders();
        this.foods = service.getFoods();
        this.eats = service.getEats();


        // this.addPhoneButtonOptions = {
        //   icon: 'add',
        //   text: 'Add phone',
        //   onClick: () => {
        //     this.employee.Phones.push('');
        //     this.phoneOptions = this.getPhonesOptions(this.employee.Phones);
        //   },
        // };

    }

    calculateSelectedRow(options) {
        if (options.name === 'name1') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestFlight;
                }
            }

        }
        if (options.name === 'name2') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestNight;
                }
            }

        }
        if (options.name === 'name3') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestSchool;
                }
            }

        }
        if (options.name === 'name4') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestClass;
                }
            }

        }
        if (options.name === 'name5') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestCase;
                }
            }

        }
        if (options.name === 'name6') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestSure;
                }
            }

        }
        if (options.name === 'name7') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestTer;
                }
            }

        }
        if (options.name === 'name8') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestDate;
                }
            }

        }
        if (options.name === 'name9') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if (options.component.isRowSelected(options.value.ID)) {
                    options.totalValue += options.value.TestDay;
                }
            }

        }
    }

    onRowDblClick(e): void {
        this.popup.title = this.utilService.convert1('2-11-1 선불카드발행', '2-11-1 선불카드발행');
        this.popup.visible = true;
        this.orders = this.service.getOrders();
    }

    onRowBdlClick(e): void {
        this.push.title = this.utilService.convert1('2-11-1 선불카드발행', '2-11-1 선불카드발행');
        this.push.visible = true;
        this.orders = this.service.getOrders();
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

    ngAfterViewInit(): void {
        // this.newBtn.visible = this.utilService.isAdminUser();
        this.mainForm.instance.focus();
        this.utilService.getFoldable(this.mainForm, this.foldableBtn);
        this.initForm();
        this.utilService.getGridHeight(this.mainGrid);
        this.utilService.getShowBookMark(
            {
                tenant: this.G_TENANT,
                userId: this.utilService.getUserUid(),
                menuL2Id: this.pageInfo.menuL2Id
            }, this.bookmarkBtn
        ).then();
    }

    initForm(): void {
        this.mainForm.instance.getEditor('companyId').option('value', this.utilService.getCommonOwnerId());
        this.mainForm.instance.getEditor('actFlg').option('value', 'Y');

    }

    initCode(): void {
        // 사용여부
        this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
            this.dsActFlg = result.data;
        });

        // 사용자그룹
        this.codeService.getCode(this.G_TENANT, 'USERGROUP').subscribe(result => {
            this.dsUserGroup = result.data;
        });


        this.codeService.getUser(this.G_TENANT).subscribe(result => {
            this.dsUser = result.data;
        });
    }

    async onSearch(): Promise<void> {
        // const arr = [];
        // const data = this.mainForm.formData;
        // arr.push(data);
        // this.orders.push(data);
        // this.mainGrid.dataSource = arr;

        // const currentData = new Date();
        // currentData.toISOString();
        // const data = this.mainForm.formData;

        // const lastItem = this.orders[this.orders.length -1];
        // const newId = lastItem.ID + 1;
        // const currentDate = new Date();
        // const arr = {
        //   "ID" : newId,
        //   "model": this.mainForm.formData.text0,
        //   "text1": this.mainForm.formData.text1,
        //   "remainAmt": this.mainForm.formData.remainAmt,
        //   "createdDatetime": currentDate.toISOString()
        // };
        // this.orders.push(arr);
        // this.mainGrid.dataSource = this.orders;
        // this.mainGrid.focusedRowKey = null;
        // this.mainGrid.paging.pageIndex = 0;


        // const lastItems = this.foods[this.foods.length -1];
        // const newIds = lastItems.name + 1;
        // const add = {
        //   "name" : newIds,
        //   "text2": this.mainForm.formData.text2,
        //   "text3": this.mainForm.formData.text3,
        //   "text4": this.mainForm.formData.text4,
        //   "fromdate": this.mainForm.formData.fromdate,
        //   "todate": this.mainForm.formData.todate,
        //   "model": this.mainForm.formData.model,
        //   "qr": this.mainForm.formData.qr,
        // };
        // this.foods.push(add);
        // this.mainGrid.dataSource = this.foods;
        // this.mainGrid.focusedRowKey = null;
        // this.mainGrid.paging.pageIndex = 0;


        // const executionTxt = this.utilService.convert1('등록', '등록');
        // const result = await this.service.getOrders();

        // if (this.utilService.resultMsgCallback(result, executionTxt)) {
        //   this.mainGrid.dataSource = this.utilService.setGridDataSource(this.orders, this.mainKey);
        //   this.mainGrid.focusedRowKey = null;
        //   this.mainGrid.paging.pageIndex = 0;
        // }


    }

    async onReset(): Promise<void> {
        await this.mainForm1.instance.resetValues();
        await this.mainForm2.instance.resetValues();
        await this.mainForm3.instance.resetValues();
        await this.mainForm4.instance.resetValues();
        await this.mainForm5.instance.resetValues();
        this.qr = "";
        await this.initForm();
    }

    async onDelete(): Promise<void> {
        const titleToRemove = this.mainForm.formData.ID;
        const indexToRemove = this.orders.findIndex((item) => item.ID === titleToRemove);
        let deletedData = null;
        if (indexToRemove !== -1) {
            deletedData = this.orders.splice(indexToRemove, 1)[0];
        }
    }

    onRowClick(e): void {
        console.log(e.data.index);
        const Text2 = e.data.text2;
        this.mainForm1.formData.text2 = Text2;
        const Qr = e.data.qr;
        this.mainForm1.formData.qr = Qr;
        const Text3 = e.data.text3;
        this.mainForm2.formData.text3 = Text3;
        const Text4 = e.data.text4;
        this.mainForm3.formData.text4 = Text4;
        const FromDate = e.data.fromDate;
        this.mainForm4.formData.fromDate = FromDate;
        const ToDate = e.data.toDate;
        this.mainForm4.formData.toDate = ToDate;
        const Text5 = e.data.hi;
        this.mainForm5.formData.text5 = Text5;

        this.qr = e.data.qr;
        this.pion = e.data.text4;
        this.pions = e.data.text3;
        this.money = e.data.hi;


        this.popupVisible = true;
        this.mainGrid.dataSource = this.eats.filter((item) => item.model === e.data.model)
        // this.mainForm5.formData.text5 = this.foods.filter((item) => item.hi === e.data.hi)


        // if (e.column.index === 1) {
        //   const Click = e.row.data.text2;
        //   this.mainForm1.formData.text2=Click;
        //   const Click1 = e.row.data.text3;
        //   this.mainForm2.formData.text3=Click1;
        //   const Click2 = e.row.data.text4;
        //   this.mainForm3.formData.text4=Click2;
        // }


    }

    onCollClick(e): void {
        console.log(e.column.index);
        // if (e.column.index === 3) {
        //   const Click = e.row.data.text2;
        //   this.mainForm.formData.text2=Click;
        //   this.mainGrid.dataSource = this.foods.filter((item) => item.text2 === e.data.text2);
        // }


    }

    resultMsgCallback(result, msg): boolean {
        if (result.success) {
            this.utilService.notify_success(msg + ' success');
        } else {
            this.utilService.notify_error(result.msg);
        }
        return result.success;
    }

    // 팝업 열기
    onPopupOpen(e): void {
        if (e.element.id === 'Open') {
            this.deleteBtn.visible = false;
            // this.resetPwdBtn.visible = false;
            this.popupMode = 'Add';
            this.onPopupInitData();
        } else {
            this.deleteBtn.visible = true;
            // this.resetPwdBtn.visible = this.utilService.isAdminUser();  // 관리자용 비밀번호 초기화
            this.popupMode = 'Edit';
            this.onPopupSearch(e.data);
        }
        // if (this.utilService.isAdminUser()) {
        //   this.resetPwdBtn.disabled = true;
        // } else {
        //   this.resetPwdBtn.disabled = false;
        // }

        this.popup.visible = true;
    }

    // 생성시 초기데이터
    onPopupInitData(): void {
        this.popupFormData = Object.assign({tenant: this.G_TENANT, usr: '', name: '', shortName: '', email: ''});
    }

    onPopupAfterOpen(): void {
        // 사용자 계정이 아닌 경우 수정 불가
        this.popupForm.instance.getEditor('companyId').option('disabled', !this.utilService.isAdminUser());

        // 관리자용 비밀번호 초기화
        if (this.utilService.isAdminUser()) {
            this.resetPwdBtn.visible = true;
            this.resetPwdBtn.disabled = false;
        }

        // this.popupForm.instance.getEditor('companyId').option('value', this.utilService.getCommonOwnerId());
        if (this.popupMode === 'Add') {
            this.pwdBtn.disabled = true;
            this.resetPwdBtn.disabled = true;

            this.popupForm.instance.getEditor('usr').focus();
        }
    }

    // 팝업 닫기
    onPopupClose(): void {
        this.popup.visible = false;
    }

    onPopupAfterClose(): void {
        this.popupForm.instance.resetValues();
        this.popupForm.instance.getEditor('usr').option('disabled', false);
        this.pwdBtn.disabled = false;

        // 관리자용 비밀번호 초기화
        if (this.utilService.isAdminUser()) {
            this.resetPwdBtn.visible = true;
            this.resetPwdBtn.disabled = false;
        }

        this.onSearch();
    }

    async onPopupSearch(data): Promise<void> {
        const result = await this.service.getPopup(data);

        if (this.resultMsgCallback(result, 'PopupSearch')) {
            this.popupFormData = result.data;
        } else {
            return;
        }
    }

    async onPopupSave(): Promise<void> {
        const popData = this.popupForm.instance.validate();

        if (popData.isValid) {
            if (await this.execSave()) {
                this.onPopupClose();
            }
        }
    }

    async execSave(): Promise<boolean> {
        try {
            let result;

            if (this.popupMode === 'Add') {
                result = await this.service.save(this.popupFormData);
            } else {
                result = await this.service.update(this.popupFormData);
            }

            if (this.resultMsgCallback(result, 'Save')) {
                const data = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));

                if (data.user === this.popupFormData.usr) {
                    const company = this.dsOwnerId.filter(el => el.uid === this.popupFormData.companyId);
                    data.companyId = this.popupFormData.companyId;
                    data.userGroup = this.popupFormData.userGroup;
                    data.company = company[0].company;

                    sessionStorage.setItem(APPCONSTANTS.ISLOGIN, JSON.stringify(data));
                }
                this.popupFormData = result.data;
                return true;
            } else {
                return false;
            }
        } catch {
            this.utilService.notify_error('There was an error!');
            return false;
        }
    }

    async onPopupDelete(): Promise<void> {

        try {
            const result = await this.service.delete(this.popupFormData);

            if (this.resultMsgCallback(result, 'Delete')) {
                this.onPopupClose();
            }
        } catch {
            this.utilService.notify_error('There was an error!');
        }
    }

    pwdPopupOpenClick(): void {
        this.pwdPopup.visible = true;
    }

    async resetPassword(): Promise<void> {
        // 비밀번호 초기화를 하시겠습니까?
        const confirmMsg = this.utilService.convert('confirmExecute', this.utilService.convert('비밀번호 초기화'));
        if (!await this.utilService.confirm(confirmMsg)) {
            return;
        }

        try {
            const result = await this.service.resetPassword(this.popupFormData);

            if (!result.success) {
                this.utilService.notify_error(result.msg);
                return;
            } else {
                this.utilService.notify_success('Save success');
                this.pwdPopupCancelClick();
            }
        } catch {
            this.utilService.notify_error('There was an error!');
        }
    }

    async pwdPopupSaveClick(): Promise<void> {
        const pwdPopData = this.pwdPopupForm.instance.validate();
        const saveData = Object.assign(this.popupFormData, this.pwdPopupData);

        if (pwdPopData.isValid) {

            try {
                const result = await this.service.updatePwd(saveData);

                if (!result.success) {
                    this.utilService.notify_error(result.msg);
                    return;
                } else {
                    this.utilService.notify_success('Save success');
                    this.pwdPopupCancelClick();
                }
            } catch {
                this.utilService.notify_error('There was an error!');
            }
        }
    }

    pwdPopupCancelClick(): void {
        this.pwdPopup.visible = false;
    }

    pwdPopupAfterClose(): void {
        this.pwdPopupForm.instance.resetValues();
    }

    passwordComparison = () => this.pwdPopupData.changePassword;

    //카드등록, 계좌추가
    addPopupOpen(): void {
        this.addPopup1.visible = true;
    }

    addPopupOpen2(): void {
        this.addPopup2.visible = true;
    }

    addPopupClose(): void {
        this.addPopup1.visible = false;
    }

    addPopupClose2(): void {
        this.addPopup2.visible = false;
    }

    addCard(): void {
        this.cardOptions.push({
            ImageSrc: '/assets/images/card_default.png',
        });
        this.addPopup1.visible = false;
    }

    delCard(cardNum): void {
        this.cardOptions.splice(cardNum, 1);
    }

    addBankTr(): void {

        const table = document.getElementById('bankTable') as HTMLTableElement | null;
        const newRow = table?.insertRow();
        const newCell1 = newRow.insertCell(0);
        const newCell2 = newRow.insertCell(1);
        const newCell3 = newRow.insertCell(2);

        newRow.id = 'tr' + this.trNum;
        newCell1.innerHTML = '<img src="/assets/images/icon_bank_kb.png" alt="kb">';
        newCell2.innerText = '하나 212****5959';
        newCell3.innerHTML = '<dx-button type="form"  icon="trash" (onClick)="delBankTr(#tr' + this.trNum + ')" ></dx-button>'
        this.trNum = this.trNum + 1;

        this.addPopup2.visible = false;
    }

    delBankTr(tr): void {
        document.querySelector('#bankRow').querySelector(tr).remove();
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





