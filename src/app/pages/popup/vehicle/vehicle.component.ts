import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import _ from 'lodash';
import {VehicleService} from './vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements  OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  dsCarType = [];
  dsCarKind = [];
  dsCarBrand = [];
  dsOilType = [];
  dsYN = [];

  isCarRegiYn = true;

  dsUserUploadType = [];
  imgUploadList: any[] = [];

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: VehicleService) {
    this.saveAuth = this.saveAuth.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {}

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARTYPE'})).subscribe(result => {
      this.dsCarType = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARKIND'})).subscribe(result => {
      this.dsCarKind = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARBRAND'})).subscribe(result => {
      this.dsCarBrand = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'OILTYPE'})).subscribe(result => {
      this.dsOilType = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'YN'})).subscribe(result => {
      this.dsYN = result.data;
    });

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'USERUPLOADTYPE'})).subscribe(result => {
      this.dsUserUploadType = result.data;
      this.imgUploadList = _.cloneDeep(result.data);
    });
  }

  open(data): void {
    this.input = data;
    this.search(this.input).then();
  }

  async searchList(data): Promise<any> {
    return await this.service.sendPost(data, 'findCar');
  }

  async search(data): Promise<void> {
    const result = await this.service.sendPost(data, 'findCarFull');
    const uploadFilePath = COMMONINITDATA.IMAGE_URL;

    if (result.success) {
      const rData = result.data;

      for (const key in rData) {

        if (key.includes('isOption')) {
          rData[key] = this.utilService.checkValueConversion(rData[key]);
        }
      }
      this.popupForm.formData = rData;
      this.isCarRegiYn = rData.carRegiYn === COMMONINITDATA.FLAG_TRUE;
      console.log( rData.carRegiYn )

      if (rData.carUserAuthVOList?.length > 0) {
        const savedImgList = rData.carUserAuthVOList;

        savedImgList.forEach(el => {
          const path = uploadFilePath + el.logUploadFile;

          if (path.length > 0) {
            this.imgUploadList[el.userUploadType].path = path;
            this.imgUploadList[el.userUploadType].checkPath = true;
          } else {
            this.imgUploadList[el.userUploadType].checkPath = false;
          }
        });
      }
      this.popup.visible = true;
    }
  }

  async saveAuth(): Promise<void> {
    const executionTxt = this.utilService.convert1('mm.car.carRegiYn.Y', '인증');
    const formData = this.popupForm.formData;

    if (formData.carRegiYn === COMMONINITDATA.FLAG_TRUE) {
      this.utilService.notify_error('이미 인증된 차량입니다.');
    } else {

      if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        return;
      }
      const saveData = {tenant: formData.tenant, uid: formData.uid, carRegiYn: COMMONINITDATA.FLAG_TRUE};
      this.save(saveData).then();
    }
  }

  async save(data?): Promise<void> {

    if (!data) {
      const validData = this.popupForm.instance.validate();
      const executionTxt = this.utilService.convert1('com.btn.save', '저장');

      if (!validData.isValid) { return; }

      if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', executionTxt))) {
        return;
      }
    }
    data = data || this.popupForm.formData;
    const saveData = _.cloneDeep(data);

    for (const key of Object.keys(saveData)) {
      saveData[key] = key.includes('isOption') ?
        this.utilService.checkValueConversion(saveData[key]) : saveData[key];
    }

    this.service.sendPost(saveData, 'updateCar').then(result => {

      if (result.success) {
        this.output.emit(saveData);
        this.close();
      }
    });
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
    this.popupForm.formData = {};
    this.imgUploadList = _.cloneDeep(this.dsUserUploadType);
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
