import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {CompanyService} from './company.service';
import {v4 as uuidv4} from 'uuid';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import _ from 'lodash';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: {path: string, pathName: string, title: string, menuL2Id: number} = this.utilService.getPageInfo();

  mainKey = 'uid';

  isNewPopup = true;

  dsYN = [];
  dsCompany = [];

  dsUserUploadType = [];
  imgUploadList: any[] = [];
  uploadFilePath = COMMONINITDATA.IMAGE_URL;

  phoneRules = COMMONINITDATA.PHONE_RULES;
  phoneEditorOptions = this.utilService.getPhoneEditorOptions();
  telEditorOptions = this.utilService.getTelEditorOptions();

  GRID_STATE_KEY = 'mm_company';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: CompanyService,
              public gridUtil: GridUtilService) {

    this.onClickPopupSave = this.onClickPopupSave.bind(this);
    this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.utilService.getGridHeight(this.mainGrid);
    this.utilService.getFoldable(this.mainForm, this.foldableBtn);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();

    this.mainForm.instance.focus();
  }

  initCode(): void {
    const commonFormData = {tenant: this.G_TENANT};

    this.codeService.commonPostLookup(Object.assign(commonFormData, {codeCategory: 'YN'}), 'code').then(result => {
      this.dsYN = result.data;
    });

    this.codeService.commonPostLookup(Object.assign(commonFormData, {codeCategory: 'USERUPLOADTYPE'}), 'code').then(result => {
      const rData = result.data.filter(el => el.etcColumn1 === 'COMPANY');

      this.dsUserUploadType = rData;
      this.imgUploadList = _.cloneDeep(rData);
    });

    this.codeService.commonPostLookup(commonFormData, 'company').then(result => {
      this.dsCompany = result.data;
    });
  }

  async onSearch(): Promise<void> {
    // const data = this.mainForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    const result = await this.service.sendPost(this.mainForm.formData, 'findCompany');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.company.newCompany', '운송사 신규');
    this.popupForm.formData.actFlg = this.dsYN[0].code;
    this.popup.visible = true;
    // this.addInitData();
  }

  // addInitData(): void {
  //   this.popupForm.formData.actFlg = this.dsYN[0].code;
  // }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.company.editCompany', '운송사 수정');
    this.onSearchPopup(e.data).then();
  }

  onHiddenPopup(e): void {
    this.popupForm.formData = {};
    this.popupForm.instance.repaint();
    this.imgUploadList = _.cloneDeep(this.dsUserUploadType);
    this.initFiles();
    this.onSearch().then();
  }

  async onSearchPopup(eData): Promise<void> {
    const result = await this.service.sendPost(eData, 'findCompanyFull');
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.popupForm.formData = result.data;

      const savedImgList = result.data.companyAuthList;
      this.popup.visible = true;

      savedImgList.forEach(el => {
        const path = this.uploadFilePath + el.logUploadFile;
        const inputId = 'imgCompany'.concat(el.userUploadType);

        if (path.length > 0) {
          this.imgUploadList[el.userUploadType].path = path;
          this.imgUploadList[el.userUploadType].checkPath = true;
        } else {
          this.imgUploadList[el.userUploadType].checkPath = false;
        }
        document.getElementById(inputId).parentElement.querySelector('img').src = path;
      });
    }
  }

  async onClickPopupSave(e): Promise<void> {
    const popupValidate = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!popupValidate.isValid) {
      return;
    }

    if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      return;
    }

    const inputList = Array.prototype.slice.call(document.getElementsByTagName('input'));
    const inputFileList = inputList.filter(el => el.id.includes('imgCompany'));

    const formData = new FormData(document.forms.namedItem('companyForm'));

    const detailList = [];

    inputFileList.forEach(el => {
      const detail: any = {};

      if (!!el.files[0]) {
        const imgFile = el.files[0];
        const imgFileExt = imgFile.name.substring(imgFile.name.lastIndexOf('.') + 1);

        const uuid = uuidv4();
        const logFileName = uuid + '.' + imgFileExt;

        detail.userUploadType = el.id.replace('imgCompany', '');
        detail.logUploadFile = logFileName;
        detail.phyUploadFile = imgFile.name;
        detail.extUploadFile = imgFileExt;
        detail.sizeUploadFile = imgFile.size;
        detail.tenant = this.G_TENANT;

        formData.append(logFileName, imgFile);

        detailList.push(detail);
      }
    });
    const savePopupFormData: any = this.popupForm.formData;
    savePopupFormData.tenant = this.G_TENANT;
    savePopupFormData.operType = this.isNewPopup ? 'insert' : 'update';
    savePopupFormData.companyAuthList = detailList;

    formData.append('CompanyVO', JSON.stringify(savePopupFormData));

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.open('POST', this.service.httpUrl + '/saveCompany');
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
      const result = await this.service.sendPost(popupFormData, 'deleteCompany');

      if (this.utilService.resultMsgCallback(result, executionTxt)) {
        this.popup.visible = false;
      }
    }
  }

  onClickPopupCancel(e): void {
    this.popup.visible = false;
  }

  onValueChangedImg(e, data): void {
    const inputElement = e.target;
    const fileList = inputElement.files;

    if (fileList.length <= 0) {
      inputElement.value = '';
      inputElement.parentElement.querySelector('img').src = '';
    } else {
      const file = fileList[0];
      const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);

      const regexp = new RegExp(/(jpg|jpeg|png|gif|bmp)$/i);

      if (!regexp.test(fileExt)) {
        this.utilService.notify_error('이미지 파일이 아닙니다.');
        inputElement.value = '';
        inputElement.parentElement.querySelector('img').src = '';
      } else {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          const imageSource = fileReader.result as string;
          inputElement.parentElement.querySelector('img').src = imageSource;
        };
        fileReader.readAsDataURL(file);
      }
    }
  }

  async onLoadFindAddress(e, that): Promise<void> {

    // @ts-ignore
    new daum.Postcode({
      // tslint:disable-next-line:typedef
      oncomplete(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 예제를 참고하여 다양한 활용법을 확인해 보세요.
        that.popupForm.formData.address1 = data.address;
      }
    }).open();
  }

  initFiles(): void {
    // const inputList = Array.prototype.slice.call(document.getElementsByTagName('input'));
    // const inputFileList = inputList.filter(el => el.id.includes('imgCompany'));

    this.imgUploadList.forEach(el => {
      const inputId = 'imgCompany'.concat(el.code);
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      inputElement.value = '';
      inputElement.parentElement.querySelector('img').src = '';
    });
  }

  openImageModal(data): void {
    const inputId = 'imgCompany'.concat(data.code);
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const imgSrc = inputElement.parentElement.querySelector('img').src;

    const imageElement = document.getElementById('fullImage') as HTMLImageElement;
    const modal = document.querySelector('.image-modal') as HTMLDivElement;
    imageElement.src = imgSrc;
    modal.style.display = 'block';
    modal.style.zIndex = '9505';
    modal.style.position = "fixed";
  }

  closeImageModal(e): void {
    const imageElement = document.getElementById('fullImage') as HTMLImageElement;
    const modal = document.querySelector('.image-modal') as HTMLDivElement;
    imageElement.src = '';
    modal.style.display = 'none';
  }

  downloadImage(data): void {
    const aElement = document.getElementById('downloadImageEl') as HTMLAnchorElement;
    aElement.href = data.path;
    aElement.click();
  }

  setChangeMask(e): void {
    const dataField = e.target.id.split('_').pop();

    if (dataField === 'phone1' || dataField === 'phone2') {
      const popFormIsc = this.popupForm.instance;
      const getId = 'getItemID';
      const elId = popFormIsc[getId](dataField);
      let mask;

      if (elId === e.target.id) {

        if (e.type === 'focusin') {

          mask = dataField === 'phone2' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
        } else if (e.type === 'focusout') {
          const value = this.popupForm.formData[dataField];

          if (!value) {
            mask = dataField === 'phone2' ? COMMONINITDATA.DEFAULT_PHONE_MASK : COMMONINITDATA.DEFAULT_TEL_MASK;
          } else {

            if (dataField === 'phone2') {
              mask = this.utilService.getPhoneMask(value);
            } else if (dataField === 'phone1') {
              mask = this.utilService.getTelMask(value);
            }
          }
        }
        popFormIsc.getEditor(dataField).option('mask', mask);
      }
    }
  }

  getButtonClass(): string {
    return COMMONINITDATA.BTN_CLASS;
  }
}
