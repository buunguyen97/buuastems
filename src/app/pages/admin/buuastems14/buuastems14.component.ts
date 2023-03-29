import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from "devextreme-angular/ui/form";
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from "devextreme-angular";
import {FormControl, FormGroup} from "@angular/forms";
import {CommonUtilService} from "../../../shared/services/common-util.service";
import {Buuastems12Service} from "../buuastems12/buuastems12.service";
import {CommonCodeService} from "../../../shared/services/common-code.service";
import {GridUtilService} from "../../../shared/services/grid-util.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-buuastems14',
  templateUrl: './buuastems14.component.html',
  styleUrls: ['./buuastems14.component.scss']
})

export class Buuastems14Component implements OnInit, AfterViewInit {

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
  titleHeader: string;
  idHeader: number;

  imagene = 'my-css-class';
  mainKey = 'uid';
  popupKey = 'uid';

  dataTest = [{
    "id": 1,
    "title": "0000001 ~ 0000005",
    "number": "3",
    "author": "발행완료",
    "date-insert": "24/03/2023",
    "date-update": "24/03/2023",
    "tenant": 100


  },
    {
      "id": 2,
      "title": "1111111 ~ 1111111",
      "number": "5",
      "author": "발행완료",
      "date-insert": "24/03/2023",
      "date-update": "24/03/2023",
      "tenant": 100
    }
    ,
    {
      "id": 3,
      "title": "0000000 ~ 0000000",
      "number": "1",
      "author": "발행완료",
      "date-insert": "24/03/2023",
      "date-update": "24/03/2023",
      "tenant": 100
    }
  ];
  dataTitle = [
    {
      "id": 1,
      "title": "차수",
      "dataField": "id",
      "cssClass": "",

    },
    {
      "id": 2,
      "title": "카드번호",
      "dataField": "title",
      "cssClass": "title",

    }
    ,
    {
      "id": 3,
      "title": "발행매수",
      "dataField": "number",
      "cssClass": "",
    }
    ,
    {
      "id": 4,
      "title": "유효기간",
      "dataField": "date-insert",
      "cssClass": "",
    }
    ,
    {
      "id": 5,
      "title": "발행일자",
      "dataField": "date-update",
      "cssClass": "",
    }
    ,
    {
      "id": 6,
      "title": "발행구분",
      "dataField": "author",
      "cssClass": "",
    }
    ,
    {
      "id": 6,
      "title": "발행요청",
      "dataField": "author",
      "cssClass": "",
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
    this.titleHeader = this.codeService.getTitleHeader();
    this.idHeader = this.codeService.getIdHeader();
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

  return() {
    this.router.navigate(['/tr/admin/buuastems13'], {skipLocationChange: true});
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

    console.log(this.dataTest);
    this.mainGrid.dataSource = this.dataTest;
    this.mainGrid.focusedRowKey = null;
    this.mainGrid.paging.pageIndex = 0;

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

    console.log(e.column.index)
    if (e.column.index === 3) {
      this.router.navigate(['/tr/admin/buuastems15'], {skipLocationChange: true});
    }


  }

  async onDelete(): Promise<any> {
    console.log(111);
    const titleToRemove = this.mainForm.formData.codeCategory
    const indexToRemove = this.dataTest.findIndex((item) => item.title === titleToRemove);
    let deletedData = null;
    if (indexToRemove !== -1) {
      deletedData = this.dataTest.splice(indexToRemove, 1)[0];
    }
    this.mainGrid.dataSource = this.dataTest;
    return deletedData;
  }

  async onChange(): Promise<any> {
    console.log(this.mainForm.formData.id);
    const targetObject = this.dataTest.find((item) => item.id === this.mainForm.formData.id);
    if (targetObject) {
      const updatedObject = {
        id: targetObject.id,
        title: this.mainForm.formData.codeCategory,
        author: this.mainForm.formData.name,
        "date-insert": targetObject["date-insert"],
        tenant: targetObject.tenant
      };
      console.log(updatedObject);
      Object.assign(targetObject, updatedObject);
      return updatedObject;
      this.mainGrid.dataSource = this.dataTest;
    }
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
