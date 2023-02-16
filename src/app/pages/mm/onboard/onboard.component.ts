import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {OnboardService} from './onboard.service';
import {v4 as uuidv4} from 'uuid';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: {path: string, pathName: string, title: string, menuL2Id: number} = this.utilService.getPageInfo();

  mainKey = 'uid';
  popupKey = 'uid';

  isNewPopup = true;

  dsTargetType = [];
  dsTargetTypeItems = [];

  imageFiles = [];
  currentData = {idx: 0};

  uploadFilePath = COMMONINITDATA.IMAGE_URL;

  GRID_STATE_KEY = 'mm_onboard';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: OnboardService,
              public gridUtil: GridUtilService) {

    this.onClickPopupSave = this.onClickPopupSave.bind(this);
    this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);

    this.onValueChangedImg = this.onValueChangedImg.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.mainForm.instance.focus();
  }

  initCode(): void {

    this.codeService.getCode(this.G_TENANT, 'USERTYPE').subscribe(result => {
      this.dsTargetType = result.data.filter(el => el.etcColumn1 === 'ONBOARD');
    });
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    const result = await this.service.sendPost(this.mainForm.formData, 'findOnBoard');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.onboard.newOnboard', '온보드 신규');
    this.onSearchPopupCheck(e).then();
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.onboard.editOnboard', '온보드 수정');
    this.onSearchPopup(e.data).then();
  }

  onHiddenPopup(e): void {
    this.imageDataInit();
    this.popupGrid.dataSource = this.utilService.setGridDataSource([], this.popupKey);
    this.popupGrid.instance.cancelEditData();
    this.onSearch().then();
  }

  async onSearchPopupCheck(e): Promise<void> {

    const result = await this.service.sendPost({
      tenant: this.G_TENANT, codeCategory: 'USERTYPE', etcColumn1: 'ONBOARD'
    }, 'findOnBoardPopupCheck');

    if (result.data.length > 0) {
      this.popup.visible = true;
      this.dsTargetTypeItems = result.data;
      this.popupForm.formData.targetType = this.dsTargetTypeItems[0].code;
    } else {
      this.utilService.notify_error('이미 저장된 데이터가 존재합니다. 조회 후 저장해주세요');
    }
  }

  async onSearchPopup(eData): Promise<void> {
    const targetTypeData = this.dsTargetType.filter(el => el.code === eData.targetType);

    this.dsTargetTypeItems = targetTypeData;
    this.popupForm.formData.targetType = this.dsTargetTypeItems[0].code;

    const result = await this.service.sendPost(eData, 'findOnBoardFull');
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
    const resultCheck = this.utilService.resultMsgCallback(result, executionTxt);

    if (resultCheck) {
      this.popup.visible = resultCheck;
      this.popupGrid.dataSource = this.utilService.setGridDataSource(result.data, this.popupKey);
      this.imageFiles = await result.data.map((el, idx) => {
        return {idx, savedImgPath: el.filePath + el.logUploadFile};
      });
      this.setFocusImage(0);
    }
  }

  setFocusImage(idx: number): void {
    this.setFocusRow(idx);
    this.imageFilePreview(idx);
    this.currentData.idx = idx;
  }

  async onClickPopupSave(e): Promise<void> {
    // const popupValidate = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      return;
    }
    const changes = this.popupGrid.editing.changes;
    const saveChanges = this.collectGridData(changes, {targetType: this.popupForm.formData.targetType});
    const formData = new FormData(document.forms.namedItem('form'));

    for (const change of saveChanges) {

      if (change.operType !== 'remove') {
        const check = Object.keys(change).includes('phyUploadFile');
        change.customCheck = check ? 'Y' : 'N';
        // if (check) {
        //   alert('이미지업로드는 필수입니다.');
        //   return;
        // }
      }
    }
    formData.append('onBoardList', JSON.stringify(saveChanges));
    this.imageFiles.forEach(image => formData.append(image.logUploadFile, image.file));

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.open('POST', this.service.httpUrl + '/saveOnBoard');
    xhr.send(formData);

    xhr.onload = () => {
      const result = xhr.response;

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
      }
    };
  }

  async onClickPopupDelete(e): Promise<void> {
    const popupFormData = this.popupForm.formData;
    const executionTxt = this.utilService.convert1('com.btn.del', '삭제');

    if (await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      const result = await this.service.sendPost(popupFormData, 'deleteOnBoard');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
      }
    }
  }

  onClickPopupCancel(e): void {
    this.popup.visible = false;
    this.setFocusRow(-1);
  }

  onFocusedCellChangedPopupGrid(e): void {

    if (e.column.type === 'buttons') {
      this.clickImgFileUpload();
    }
    this.setFocusImage(e.rowIndex);
  }

  onClickImgFileUpload(e, data): void {
    this.clickImgFileUpload();
    this.currentData.idx = data.rowIndex;
    this.setFocusRow(data.rowIndex);
  }

  clickImgFileUpload(): void {
    const imgFileUpload = document.getElementById('imgFileUpload') as HTMLInputElement;
    imgFileUpload.click();
  }

  onValueChangedImg(e): void {
    const imgId = e.target.id;
    const imgFiles = document.getElementById(imgId) as HTMLInputElement;
    const imgFile = imgFiles.files[0];
    const imgFileExt = imgFile.name.substring(imgFile.name.lastIndexOf('.') + 1);

    const regexp = new RegExp(/(jpg|jpeg|png|gif|bmp)$/i);

    const currentData = this.currentData;

    if (regexp.test(imgFileExt)) {
      const uuid = uuidv4();
      const logFileName = uuid + '.' + imgFileExt;
      const imageFile = {idx: currentData.idx, file: imgFile, logUploadFile: logFileName};

      const sameIdxData = this.imageFiles.findIndex(el => el.idx === currentData.idx);

      if (sameIdxData > -1) {
        this.imageFiles.splice(sameIdxData, 1);
        this.imageFiles.splice(sameIdxData, 0, imageFile);
      } else {
        this.imageFiles.push(imageFile);
      }
      this.popupGrid.instance.cellValue(currentData.idx, 'filePath', this.uploadFilePath);
      this.popupGrid.instance.cellValue(currentData.idx, 'logUploadFile', logFileName);
      this.popupGrid.instance.cellValue(currentData.idx, 'phyUploadFile', imgFile.name);
      this.popupGrid.instance.cellValue(currentData.idx, 'extUploadFile', imgFileExt);
      this.popupGrid.instance.cellValue(currentData.idx, 'sizeUploadFile', imgFile.size);

      this.imageFiles.sort((a, b) => {
        return a.idx - b.idx;
      });
      this.setFocusImage(currentData.idx);
    } else {
      const previewImage = document.getElementById('previewImage') as HTMLImageElement;
      imgFiles.value = '';
      previewImage.src = '';
      this.popupGrid.instance.cellValue(currentData.idx, 'filePath', '');
      this.popupGrid.instance.cellValue(currentData.idx, 'logUploadFile', '');
      this.popupGrid.instance.cellValue(currentData.idx, 'phyUploadFile', '');
      this.popupGrid.instance.cellValue(currentData.idx, 'extUploadFile', '');
      this.popupGrid.instance.cellValue(currentData.idx, 'sizeUploadFile', '');

      this.utilService.notify_error('이미지 파일이 아닙니다.');
    }
  }

  imageFilePreview(idx): void {
    const previewImage = document.getElementById('previewImage') as HTMLImageElement;
    const currentImageFile = this.imageFiles.filter(el => el.idx === idx)[0];

    if (currentImageFile) {

      if (currentImageFile.savedImgPath) {
        previewImage.src = currentImageFile.savedImgPath;
      } else {
        const file = currentImageFile.file;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          previewImage.src = fileReader.result as string;
        };
      }
    } else {
      previewImage.src = './assets/images/no_image.png';
    }
  }

  imageDataInit(): void {
    const imgFileUpload = document.getElementById('imgFileUpload') as HTMLInputElement;
    imgFileUpload.value = '';
    const previewImage = document.getElementById('previewImage') as HTMLImageElement;
    previewImage.src = '';

    this.imageFiles = [];
    this.currentData.idx = 0;
  }

  onClickPopupPrev(): void  {
    const idx = this.currentData.idx;
    const imageFileIndex = this.imageFiles.findIndex(el => el.idx === idx) - 1;

    if (imageFileIndex < 0) {
      this.utilService.notify_error('이전 이미지가 없습니다.');
      return;
    }
    const imageFileRow = this.imageFiles[imageFileIndex];
    this.setFocusImage(imageFileRow.idx);
  }

  onClickPopupNext(): void {
    const idx = this.currentData.idx;
    const imageFileIndex = this.imageFiles.findIndex(e => e.idx === idx) + 1;

    if (imageFileIndex >= this.imageFiles.length) {
      this.utilService.notify_error('다음 이미지가 없습니다.');
      return;
    }
    const imageFileRow = this.imageFiles[imageFileIndex];
    this.setFocusImage(imageFileRow.idx);
  }

  addClick(e): void {

    this.popupGrid.instance.addRow().then(() => {
      const focusedRowIdx = this.popupGrid.instance.getVisibleRows().length - 1;
      this.setFocusRow(focusedRowIdx);
      this.imageFilePreview(focusedRowIdx);
    });
  }

  deleteClick(): void {
    const focusedRowIdx = this.popupGrid.focusedRowIndex;

    if (focusedRowIdx > -1) {
      this.popupGrid.instance.deleteRow(focusedRowIdx);
      this.popupGrid.instance.getDataSource().store().push([{type: 'remove', key: this.popupGrid.focusedRowKey}]);
      this.setFocusRow(focusedRowIdx - 1);
    }
  }

  onInitNewRowPopup(e): void {
    e.data.seq = this.popupGrid.instance.getVisibleRows().length + 1;
  }

  setFocusRow(index): void {
    this.popupGrid.focusedRowIndex = index;
  }

  collectGridData(changes: any, addData?: {}): any[] {
    const gridList = [];

    for (const rowIndex in changes) {
      // Insert일 경우 UUID가 들어가 있기 때문에 Null로 매핑한다.
      if (changes[rowIndex].type === 'insert') {
        gridList.push(Object.assign({
          operType: changes[rowIndex].type,
          uid: null,
          tenant: this.G_TENANT
        }, changes[rowIndex].data, addData));
      } else if (changes[rowIndex].type === 'remove') {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data, addData
          )
        );
      } else {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data, addData
          )
        );
      }
    }
    return gridList;
  }
}
