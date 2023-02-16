import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import _ from 'lodash';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {CardService} from './card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  cardList: any[] = [];

  dsCardType = [];

  // cardList: any[] =  [{
  //   ImageSrc: '/assets/images/card1.png',
  // }, {
  //   ImageSrc: '/assets/images/card2.png',
  // }, {
  //   ImageSrc: '/assets/images/card3.png',
  // }, {
  //   ImageSrc: '/assets/images/card4.png',
  // }];

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: CardService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCode();
  }

  initCode(): void {
    const data = {tenant: this.G_TENANT};

    this.codeService.getItems(Object.assign(_.cloneDeep(data), {codeCategory: 'CARDTYPE'})).subscribe(result => {
      this.dsCardType = result.data;
    });
  }

  open(data): void {
    data.userId = data.uid;
    this.input = data;
    this.popup.visible = true;
  }

  async search(data): Promise<any> {
    return await this.service.sendPost(data, 'findSales');
  }

  decide(): void {

    if (this.input.isNew) {
      this.registration();
    } else {
      this.save().then();
    }
  }

  registration(): void {
    const formData = this.popupForm.formData;
    formData.tenant = this.input.tenant;
    formData.userId = this.input.userId;
    formData.isNew = this.input.isNew;
    formData.imageSrc = '/assets/images/card_default.png';

    const cloneData = _.cloneDeep(formData);
    cloneData.operType = 'insert';

    this.output.emit(cloneData);
    this.close();
  }

  async save(): Promise<void> {
    const formData = this.popupForm.formData;
    formData.tenant = this.input.tenant;
    formData.userId = this.input.userId;
    formData.isNew = this.input.isNew;
    formData.operType = 'insert';
    // formData.validMonth = '11';
    // formData.validYear = '11';

    this.service.sendPost([formData], 'saveSales').then(result => {

      if (result.success) {
        this.output.emit(formData);
        this.close();
      }
    });
  }

  async delete(card): Promise<any> {
    return await this.service.sendPost([card], 'deleteSales');
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
    this.popupForm.formData = {};
    this.cardList = [];
  }
}
