import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {CarService, CarVO} from './car.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxPopupComponent} from 'devextreme-angular';
import {v4 as uuidv4} from 'uuid';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import _ from 'lodash';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;

  @ViewChild('popup', {static: true}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('foldableBtn', {static: false}) foldableBtn: DxButtonComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();
  userType: any = this.utilService.getUserType();

  isAdmin: boolean = this.userType === COMMONINITDATA.USERTYPE_ADMIN;

  mainKey = 'uid';

  isNewPopup = true;

  isCarRegiYn = true;

  dsYN = [];
  dsUser = [];
  dsCarType = [];
  dsCarKind = [];
  dsCarBrand = [];
  dsOilType = [];

  dsCurrUser = [];

  dsUserUploadType = [];
  imgUploadList: any[] = [];
  uploadFilePath = COMMONINITDATA.IMAGE_URL;

  GRID_STATE_KEY = this.isAdmin ? 'mm_car_admin' : 'mm_car';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: CarService,
              public gridUtil: GridUtilService) {
    this.onClickPopupSave = this.onClickPopupSave.bind(this);
    this.onClickPopupDelete = this.onClickPopupDelete.bind(this);
    this.onClickPopupCancel = this.onClickPopupCancel.bind(this);

    this.popupSaveAuth = this.popupSaveAuth.bind(this);
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
    const data = {tenant: this.G_TENANT};

    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'CARTYPE').subscribe(result => {
      this.dsCarType = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'CARKIND').subscribe(result => {
      this.dsCarKind = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'CARBRAND').subscribe(result => {
      this.dsCarBrand = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'OILTYPE').subscribe(result => {
      this.dsOilType = result.data;
    });

    if (this.isAdmin) {

      this.codeService.getItems(_.cloneDeep(data), 'user').subscribe(result => {
        this.dsUser = result.data;
      });
    } else {
      const optData = Object.assign(_.cloneDeep(data), {uid: this.utilService.getUserUid()});

      this.codeService.getItems(optData, 'user').subscribe(result => {
        this.dsUser = result.data;
      });
    }

    this.codeService.getCode(this.G_TENANT, 'USERUPLOADTYPE').subscribe(result => {
      this.dsUserUploadType = result.data;
      this.imgUploadList = _.cloneDeep(result.data);
    });
  }

  async onSearch(): Promise<void> {
    const executionTxt = this.utilService.convert1('com.btn.search', '조회');
    const mainFormData = _.cloneDeep(this.mainForm.formData);

    if (!this.isAdmin) {
      mainFormData.userId = this.utilService.getUserUid();
    }

    for (const key of Object.keys(mainFormData)) {

      if (key.includes('isOption')) {

        if (mainFormData[key]) {
          mainFormData[key] = this.utilService.checkValueConversion(mainFormData[key]);
        } else {
          mainFormData[key] = '';
        }
      }
    }
    const result = await this.service.sendPost(mainFormData, 'findCar');

    if (this.utilService.resultMsgCallback(result, executionTxt)) {
      this.mainGrid.dataSource = this.utilService.setGridDataSource(result.data, this.mainKey);
      this.mainGrid.focusedRowKey = null;
      this.mainGrid.paging.pageIndex = 0;
    }
  }

  onNew(e): void {
    this.isNewPopup = true;
    this.popup.title = this.utilService.convert1('mm.car.newCar', '차량등록 신규');
    this.popupForm.formData.oilType = this.dsOilType[1].code;
    this.popup.visible = true;

    if (!this.isAdmin) {
      this.addInitData();
    }
  }

  addInitData(): void {
    this.popupForm.formData.userId = this.dsUser[0].uid;
  }

  onRowDblClick(e): void {
    this.isNewPopup = false;
    this.popup.title = this.utilService.convert1('mm.car.editCar', '차량등록 수정');
    this.onSearchPopup(e.data).then();
  }

  onHiddenPopup(e): void {
    // this.utilService.onReset(this.popupForm);
    this.popupForm.formData = {};
    this.popupForm.instance.repaint();
    this.imgUploadList = _.cloneDeep(this.dsUserUploadType);
    this.initFiles();
    this.onSearch().then();
  }

  async onSearchPopup(eData): Promise<void> {
    const executionTxt = this.utilService.convert1('com.msg.searchDetail', '상세조회');
    const result = await this.service.sendPost(eData, 'findCarFull');
    const resultCheck = this.utilService.resultMsgCallback(result, executionTxt);

    if (resultCheck) {

      for (const key in result.data) {

        if (key.includes('isOption')) {
          result.data[key] = this.utilService.checkValueConversion(result.data[key]);
        }
      }
      this.popup.visible = resultCheck;
      this.popupForm.formData = result.data;
      this.isCarRegiYn = this.popupForm.formData.carRegiYn === COMMONINITDATA.FLAG_FALSE;

      const savedImgList = result.data.carUserAuthVOList;

      savedImgList.forEach(el => {
        const path = this.uploadFilePath + el.logUploadFile;
        const imgId = 'imgCar'.concat(el.userUploadType);

        if (path.length > 0) {
          this.imgUploadList[el.userUploadType].path = path;
          this.imgUploadList[el.userUploadType].checkPath = true;
        } else {
          this.imgUploadList[el.userUploadType].checkPath = false;
        }
        document.getElementById(imgId).parentElement.querySelector('img').src = path;
      });
    }
  }

  async onClickPopupSave(e): Promise<void> {
    const popupValidate = this.popupForm.instance.validate();
    const executionTxt = this.utilService.convert1('com.btn.save', '저장');

    if (!popupValidate.isValid) { return; }

    if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
      return;
    }
    const formData = new FormData(document.forms.namedItem('carForm'));
    const savePopupFormData: any = {};

    for (const key of Object.keys(this.popupForm.formData)) {
      savePopupFormData[key] = key.includes('isOption') ?
        this.utilService.checkValueConversion(this.popupForm.formData[key]) : this.popupForm.formData[key];
    }
    savePopupFormData.tenant = this.G_TENANT;
    savePopupFormData.operType = this.isNewPopup ? 'insert' : 'update';
    formData.append('CarVO', JSON.stringify(savePopupFormData));

    const detailList = [];

    this.imgUploadList.forEach(el => {
      const inputId = 'imgCar'.concat(el.code);
      const inputElement = document.getElementById(inputId) as HTMLInputElement;

      if (inputElement.files.length > 0) {
        const detail: any = {};
        const imgFile = inputElement.files[0];
        const imgFileExt = imgFile.name.substring(imgFile.name.lastIndexOf('.') + 1);

        const uuid = uuidv4();
        const logFileName = uuid + '.' + imgFileExt;

        detail.userUploadType = inputElement.id.replace('imgCar', '');
        detail.userId = this.popupForm.formData.userId;
        detail.logUploadFile = logFileName;
        detail.phyUploadFile = imgFile.name;
        detail.extUploadFile = imgFileExt;
        detail.sizeUploadFile = imgFile.size;
        detail.tenant = this.G_TENANT;
          // .carId(entity.getUid())
        formData.append(logFileName, imgFile);

        detailList.push(detail);
      }
    });
    formData.append('CarUserAuthVOList', JSON.stringify(detailList));

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.open('POST', this.service.httpUrl + '/saveCar');
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
      const result = await this.service.sendPost(popupFormData, 'deleteCar');

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

  initFiles(): void {

    this.imgUploadList.forEach(el => {
      const inputId = 'imgCar'.concat(el.code);
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      inputElement.value = '';
      inputElement.parentElement.querySelector('img').src = '';
    });
  }

  async popupSaveAuth(): Promise<void> {
    const executionTxt = this.utilService.convert1('mm.car.carRegiYn.Y', '인증');

    if (this.popupForm.formData.carRegiYn === COMMONINITDATA.FLAG_TRUE) {
      this.utilService.notify_error('이미 인증된 차량입니다.');
    } else {

      if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        return;
      }
      const saveData = {uid: this.popupForm.formData.uid, carRegiYn: COMMONINITDATA.FLAG_TRUE};
      const result = await this.service.sendPost(saveData, 'updateCar');

      if (this.utilService.resultMsgCallback(result, 'save')) {
        this.popup.visible = false;
        this.onSearch().then();
      }
    }
  }

  openImageModal(data): void {
    const inputId = 'imgCar'.concat(data.code);
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const imgSrc = inputElement.parentElement.querySelector('img').src;

    const imageElement = document.getElementById('fullImage') as HTMLImageElement;
    const modal = document.querySelector('.image-modal') as HTMLDivElement;
    imageElement.src = imgSrc;
    modal.style.display = 'block';
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
}

