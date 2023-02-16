import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxLoadPanelComponent, DxPopupComponent, DxSwitchComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import _ from 'lodash';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {TranordService} from './tranord.service';
import {CompanyService} from '../../mm/company/company.service';
import {TermService} from '../../mm/term/term.service';
import {UserService} from '../../mm/user/user.service';
import {UserbookmarkComponent} from '../../popup/userbookmark/userbookmark.component';
import ArrayStore from 'devextreme/data/array_store';
import {CardComponent} from '../../popup/card/card.component';
import {TransportComponent} from '../../popup/transport/transport.component';
import {FulltextComponent} from '../../popup/fulltext/fulltext.component';

@Component({
  selector: 'app-tranord',
  templateUrl: './tranord.component.html',
  styleUrls: ['./tranord.component.scss']
})
export class TranordComponent implements  OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;

  @ViewChild('usbookmark', {static: false}) usbookmark: UserbookmarkComponent;
  @ViewChild('card', {static: false}) card: CardComponent;
  @ViewChild('transport', {static: false}) transport: TransportComponent;
  @ViewChild('fulltext', {static: false}) fulltext: FulltextComponent;

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('loadPanel', {static: false}) loadPanel: DxLoadPanelComponent;
  @ViewChild('bookmarkToggleBtn', {static: false}) bookmarkToggleBtn: DxButtonComponent;

  @ViewChild('switchLocation', {static: false}) switchLocation: DxSwitchComponent;

  G_TENANT: string = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  currentStep = 1;
  isBookmakExpanded = false;

  startPointInfo: any = {};
  endPointInfo: any = {};
  wayPointInfoList: any = [];
  wayPointList: any = [];

  mainFormInfo: any = {};
  tranOrdList = [];

  tranItemCategoryIdDs = [];
  tranItemPackTypeDs = [];
  tranItemOptionDs = [];
  tranOrdCategoryDs = [];
  tranOrdTypeDs = [];
  tranCarTypeDs = [];
  tranCarKindDs = [];
  tranIntervalTypeDs = [];

  totPrice = 0;

  tranSalesTypeDs = [];
  allTranSalesTypeDs = [];

  salesTypeDs = [];
  allSalesTypeDs = [];

  cardTypeDs = [];
  companyDs = [];

  isRecordCarbon = false;
  isPaymentMethod: string;

  termList = [];
  termData: any = {};

  addressList = [];
  bookmarkAddress = [];

  carTypeList = [];
  selectedNum: number;


  onActiveCardNum = 1;
  cardWidth = 170;
  isActivePanel: string;
  salesList = [];
  preCard;

  cardOptions: any[] =  [{
    ImageSrc: '/assets/images/card1.png',
  }, {
    ImageSrc: '/assets/images/card2.png',
  }, {
    ImageSrc: '/assets/images/card3.png',
  }, {
    ImageSrc: '/assets/images/card4.png',
  }];


  checkWayPoint = true;

  // T Map
  map;
  drawInfoArr = [];
  infoWindow = null;

  weatherAddress: string;
  weather: any;
  weatherForecast: any;

  // disabledDates: Date[] = [
  //   new Date(2017, 0, 1),
  //   new Date(2017, 0, 2),
  //   new Date(2017, 0, 16),
  //   new Date(2017, 1, 20),
  //   new Date(2017, 4, 29),
  //   new Date(2017, 6, 4),
  //   new Date(2017, 8, 4),
  //   new Date(2017, 9, 9),
  //   new Date(2022, 11, 11),
  //   new Date(2022, 11, 23),
  //   new Date(2022, 11, 25),
  // ];

  constructor(public utilService: CommonUtilService,
              private codeService: CommonCodeService,
              private service: TranordService,
              private userService: UserService,
              private companyService: CompanyService,
              private termService: TermService) {
    this.calculateCbm = this.calculateCbm.bind(this);
    this.onValueChangedItemCategoryId = this.onValueChangedItemCategoryId.bind(this);
    this.onValueChangedExpectedDateTime = this.onValueChangedExpectedDateTime.bind(this);
  }

  ngOnInit(): void {
    this.initCode();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.setLocationMap(this.switchLocation.value);
    this.bookmarkToggleBtn.instance.option('icon', 'chevrondown');

    this.getUserBookmarkAddress().then(result => {
      console.log(result);
      console.log(result.data);
      this.bookmarkAddress = result.data;
      console.log(this.bookmarkAddress);
    });
  }

  async getUserBookmarkAddress(): Promise<any> {
    const data = {
      tenant: this.G_TENANT,
      uid: this.utilService.getUserUid()
    };
    return await this.userService.sendPost(data, 'findUserBookmark');
  }

  initCode(): void {

    this.codeService.getCode(this.G_TENANT, 'TRANITEMCATEGORYID').subscribe(result => {
      this.tranItemCategoryIdDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANITEMPACKTYPE').subscribe(result => {
      this.tranItemPackTypeDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANITEMOPTION').subscribe(result => {
      this.tranItemOptionDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANORDCATEGORY').subscribe(result => {
      this.tranOrdCategoryDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANORDTYPE').subscribe(result => {
      this.tranOrdTypeDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'CARTYPE').subscribe(result => {
      this.tranCarTypeDs = result.data;
      this.carTypeList = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'CARKIND').subscribe(result => {
      this.tranCarKindDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANINTERVALTYPE').subscribe(result => {
      this.tranIntervalTypeDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'TRANSALESTYPE').subscribe(result => {
      this.allTranSalesTypeDs = result.data;
    });

    this.codeService.getCode(this.G_TENANT, 'SALESTYPE').subscribe(result => {
      this.allSalesTypeDs = result.data;
    });

    const commonFormData = {tenant: this.G_TENANT};

    this.companyService.sendPost(commonFormData, 'findCompany').then(result => {
      this.companyDs = result.data;
    });

    this.termService.sendPost({tenant: this.G_TENANT, termType: '1'}, 'findTerm').then(result => {
      this.termList = result.data;
    });
  }

  initData(): void {
    this.map.destroy();
    this.initMap();
    this.drawInfoArr = [];

    this.mainForm.formData = {};
    this.wayPointList = [];

    this.startPointInfo = {};
    this.wayPointInfoList = [];
    this.endPointInfo = {};
    this.mainFormInfo = {};
    this.mainForm.instance.repaint();

    this.isPaymentMethod = null;
  }

  initMap(): void {
    // @ts-ignore
    this.map = new Tmapv2.Map('maps', {
      // @ts-ignore
      center: new Tmapv2.LatLng(37.14662571373519, 127.5939137276295),
      width: '100%',
      height: '100%',
      zoom: 14,
      zoomControl: true,
      scrollwheel: true
    });
  }

  openTransportOrder(): void {

    if (this.isBookmakExpanded) {
      this.isBookmakExpanded = false ;
      this.bookmarkToggleBtn.instance.option('icon', 'chevrondown');
    } else{

      this.onSearch().then(() => {
        this.isBookmakExpanded = true;
        this.bookmarkToggleBtn.instance.option('icon', 'chevronup');
      });
    }
  }

  async setLocationMap(data): Promise<void> {
    let latitude = null;
    let longitude = null;

    if (!data) {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(async (position: any) => {
            if (position) {
              // console.log(position);
              //
              // console.log('Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude);

              latitude = position.coords.latitude;
              longitude = position.coords.longitude;

              // @ts-ignore
              this.map.setCenter(new Tmapv2.LatLng(latitude, longitude));
              this.map.setZoom(14);

              const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});

              // console.log(result);
              // console.log(result.addressInfo);
              this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;

              this.weather = await this.service.getCurrentWeather(latitude, longitude, null);

              // console.log(this.weather);

              const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);

              this.weather.currentTime = weatherDate.getHours();

              this.weatherForecast = await this.service.getForecast(latitude, longitude, null);

              this.weatherForecast.list.forEach(el => {
                const forecastDate = this.utilService.convertUTCDateTime(el.dt);

                el.currentTime = forecastDate.getHours();
              });

              console.log(this.weatherForecast.list);
            }
          },
          async (error: any) => {
            console.log(error);

            if (this.weatherAddress == null && this.weather == null) {
              latitude = this.map.getCenter().lat();
              longitude = this.map.getCenter().lng();

              const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});

              this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;

              this.weather = await this.service.getCurrentWeather(latitude, longitude, null);

              const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);

              this.weather.currentTime = weatherDate.getHours();

              this.weatherForecast = await this.service.getForecast(latitude, longitude, null);

              this.weatherForecast.list.forEach(el => {
                const forecastDate = this.utilService.convertUTCDateTime(el.dt);

                el.currentTime = forecastDate.getHours();
              });
            } else {
              this.utilService.notify_error('위치 정보에 대한 권한이 없습니다.');
            }
          });
      }
    } else {
      const mainFormData = this.mainForm.formData;

      if (mainFormData.endPoint) {
        latitude = mainFormData.endPoint.latitude;
        longitude = mainFormData.endPoint.longitude;

        // @ts-ignore
        this.map.setCenter(new Tmapv2.LatLng(latitude, longitude));
        this.map.setZoom(14);

        const result = await this.service.reverseGeocoding({lat: latitude, lon: longitude});

        this.weatherAddress = result.addressInfo.city_do + ' ' + result.addressInfo.gu_gun + ' ' + result.addressInfo.legalDong;

        this.weather = await this.service.getCurrentWeather(latitude, longitude, null);

        const weatherDate = this.utilService.convertUTCDateTime(this.weather.dt);

        this.weather.currentTime = weatherDate.getHours();

        this.weatherForecast = await this.service.getForecast(latitude, longitude, null);

        this.weatherForecast.list.forEach(el => {
          const forecastDate = this.utilService.convertUTCDateTime(el.dt);

          el.currentTime = forecastDate.getHours();
        });
      } else {
        this.utilService.notify_error('입력 된 하차지가 없습니다.');
      }
    }
  }

  async onSearch(): Promise<void> {
    const result = await this.service.sendPost({tenant: this.G_TENANT, userId: this.utilService.getUserUid()}, 'findTranOrd');
    this.tranOrdList = result.data;

    this.tranOrdList.forEach(tranOrd => {
      let cnt = 0;
      const sbList = ['tranItemPackType', 'tranItemOption', 'tranCarType', 'tranCarKind', 'tranIntervalType'];
      const cmList = ['tranItemPackCnt', 'tranItemAmt', 'tranItemCbm',
                      'tranItemWeight', 'tranItemWidth', 'tranItemLength', 'tranItemHeight'];
      const endPointIdx = tranOrd.tranOrdDetailList.findIndex(
        dtEl => dtEl.tranType === 'UP' && dtEl.tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.WAYPOINT
      );

      for (const sb of sbList) {
        tranOrd[sb.concat('Nm')] = this.getSelectBoxCodeName(this[sb.concat('Ds')], tranOrd[sb]);
      }

      for (const cm of cmList) {
        tranOrd[cm.concat('Comma')] = this.utilService.setNumberComma(tranOrd[cm]);
      }

      if (endPointIdx === -1) {

        for (const elDetail of tranOrd.tranOrdDetailList) {

          if (elDetail.tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.STARTPOINT) {
            tranOrd.companyNmS = elDetail.companyNm;
          } else if (elDetail.tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.ENDPOINT) {
            tranOrd.companyNmE = elDetail.companyNm;
          } else if (elDetail.tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.WAYPOINT) {
            cnt++;
          }
        }
      } else {
        tranOrd.tranOrdDetailList.length = endPointIdx;

        for (let i = 0; i < endPointIdx; i++) {

          if (tranOrd.tranOrdDetailList[i].tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.STARTPOINT) {
            tranOrd.companyNmS = tranOrd.tranOrdDetailList[i].companyNm;
          } else if (tranOrd.tranOrdDetailList[i].tranPointType === COMMONINITDATA.TRAN_TRANPOINTTYPE.WAYPOINT) {

            if (i === endPointIdx - 1) {
              tranOrd.companyNmE = tranOrd.tranOrdDetailList[i].companyNm;
              tranOrd.tranOrdDetailList[i].tranPointType = 'E';
              tranOrd.tranOrdDetailList[i].trnaType = 'DOWN';
            } else {
              cnt++;
            }
          }
        }
      }
      tranOrd.pointCntW = cnt;
    });
  }

  onSearchDetail(data): void {
    this.initData();

    const cloneData = _.cloneDeep(data);
    const detailList = cloneData.tranOrdDetailList;
    const mainFormData = this.mainForm.formData = cloneData;
    let wayIdx = 0;

    for (const key of Object.keys(mainFormData)) {

      if (key === 'tranCarOption') {

        if (Boolean(mainFormData[key])) {
          const tranCarOption = JSON.parse(mainFormData[key]);

          for (const optionKey of Object.keys(tranCarOption)) {
            mainFormData[optionKey] = this.utilService.checkValueConversion(tranCarOption[optionKey]);
          }
        }
      }
    }
    mainFormData.checkRegister = true;
    this.mainFormInfo = _.cloneDeep(mainFormData);

    // @ts-ignore
    const PTbounds = new Tmapv2.LatLngBounds();

    for (const detail of detailList) {

      if (detail.tranPointType === 'A') { continue; }

      const type = detail.tranPointType;
      const dataNameList = [
        'companyNm', 'refNm', 'address1', 'address2', 'refTellNo',
        'refTellNo2', 'remarks', 'latitude', 'longitude',
        'ciDo', 'guGun', 'eupMyun'
      ];
      let formName = COMMONINITDATA.TRAN_TRANPOINTTYPE[type];

      if (type === COMMONINITDATA.TRAN_TRANPOINTTYPE.WAYPOINT) {
        formName = formName.concat(wayIdx);
        wayIdx++;
      }
      mainFormData[formName] = mainFormData[formName] || {};
      mainFormData[formName].checkRegister = true;
      mainFormData[formName].marker = this.getMarker({markerLat: detail.latitude, markerLon: detail.longitude}, formName);
      dataNameList.forEach(dataName => mainFormData[formName][dataName] = detail[dataName]);

      // @ts-ignore
      const latLng = new Tmapv2.LatLng(detail.latitude, detail.longitude);
      PTbounds.extend(latLng);

      const cloneMainFormData = _.cloneDeep(mainFormData[formName]);

      if (type === COMMONINITDATA.TRAN_TRANPOINTTYPE.WAYPOINT) {
        this.wayPointList.push(cloneMainFormData);
      } else {
        this[formName.concat('Info')] = cloneMainFormData;
      }
    }
    this.wayPointInfoList = _.cloneDeep(this.wayPointList);
    this.checkWayPoint = this.wayPointInfoList.length > 0 ? false : true;
    this.map.fitBounds(PTbounds);
    this.onChangeStep(1);
  }

  getSelectBoxCodeName(codeList, code): string {
    return codeList.filter(el => el.code === code).map(rEl => rEl.codeName).pop();
  }

  checkChangeWayPoint(): boolean {
    return this.wayPointList.filter(el => !el.customHide).length === 0 ? true : false;
  }

  async setDsInitData(): Promise<void> {
    const mainFormData = this.mainForm.formData;
    const sbList = ['tranItemCategoryId', 'tranItemPackType', 'tranItemOption',
      'tranOrdCategory', 'tranOrdType', 'tranIntervalType', 'tranSalesType'];

    for (const sb of sbList) {
      const dsData = await this[sb.concat('Ds')][0];
      mainFormData[sb] = dsData.code;

      if (sb === 'tranItemCategoryId') {
        mainFormData.tranItemCategoryNm = dsData.codeName;
      }
    }
  }

  async onFindAddress(e): Promise<void> {
    const formName = e.target.id.replace('Btn', '');
    this.mainForm.formData[formName] = this.mainForm.formData[formName] || {};
    await this.findAddressKaKao(formName, true);
  }

  async findAddressKaKao(formName, findType?: boolean): Promise<any> {
    const that = this;
    const mainFormData = that.mainForm.formData;
    // @ts-ignore
    new daum.Postcode({
      // 팝업창 Key값 설정 (영문+숫자 추천)
      popupKey: 'searchAddrPopup',
      // tslint:disable-next-line:typedef
      oncomplete(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        const selectedAddress = that.setSelectedAddress(data);
        mainFormData[formName].address1 = selectedAddress;

        if (findType) {

          that.findAddressTMap({address: selectedAddress}).then(result => {
            that.initDrawMap();

            if (result.coordinateInfo.coordinate.length !== 0) {
              const resultCoordinate = result.coordinateInfo.coordinate[0];
              const markerInfo = that.getMarkerBefore(resultCoordinate, data.userSelectedType);

              if (Boolean(mainFormData[formName].marker)) {
                mainFormData[formName].marker.setMap(null);
              }
              mainFormData[formName].latitude = markerInfo.markerLat;
              mainFormData[formName].longitude = markerInfo.markerLon;
              mainFormData[formName].marker =  that.getMarker(markerInfo, formName);

              mainFormData[formName].ciDo = resultCoordinate.city_do;
              mainFormData[formName].eupMyun = resultCoordinate.eup_myun;
              mainFormData[formName].guGun = resultCoordinate.gu_gun;

              that.map.setCenter(mainFormData[formName].marker._marker_data.options.position);
              that.map.setZoom(17);
            } else {
              this.utilService.notify_error('데이터가 없습니다.');
            }
          });
        }
      }
    }).open();
  }

  setSelectedAddress(data): string {
    const selectedType = data.userSelectedType;
    return selectedType === COMMONINITDATA.TRAN_ADDRESSTYPE.JIBUNADDRESS ? data.jibunAddress : data.roadAddress;
  }

  async findAddressTMap(data): Promise<any> {
    return await this.service.searchAddress(data.address);
  }

  getMarkerBefore(data, selectedType): {markerLat, markerLon} {
    let markerLat;
    let markerLon;

    if (selectedType === COMMONINITDATA.TRAN_ADDRESSTYPE.JIBUNADDRESS) {
      markerLat = data.lat;
      markerLon = data.lon;
    } else if (selectedType === COMMONINITDATA.TRAN_ADDRESSTYPE.ROADADDRESS) {
      markerLat = data.newLat;
      markerLon = data.newLon;
    }
    return {markerLat, markerLon};
  }

  getMarker(data, formName): any {
    let markerIcon;

    if (formName === COMMONINITDATA.TRAN_TRANPOINTTYPE.S)  {
      markerIcon = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
    }  else if (formName === COMMONINITDATA.TRAN_TRANPOINTTYPE.E) {
      markerIcon = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_e.png';
    } else {
      markerIcon = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_p.png';
    }
    // @ts-ignore
    const markerPosition = new Tmapv2.LatLng(Number(data.markerLat), Number(data.markerLon));
    // @ts-ignore
    const marker = new Tmapv2.Marker({
      position: markerPosition,
      icon: markerIcon,
      map: this.map
    });
    return marker;
  }

  onClickChangePoint(): void {
    this.initDrawMap();

    const mainFormData = this.mainForm.formData;

    if (!mainFormData.startPoint || !mainFormData.endPoint) {
      this.utilService.notify_error('상하차지 정보가 필요합니다.');
      return;
    }
    const newEndPoint = _.cloneDeep(mainFormData.startPoint);
    const newStartPoint = _.cloneDeep(mainFormData.endPoint);

    if (!!mainFormData.startPoint || !!mainFormData.startPoint.marker) {
      mainFormData.startPoint.marker.setMap(null);
    }

    if (!!mainFormData.startPoint || !!mainFormData.endPoint.marker) {
      mainFormData.endPoint.marker.setMap(null);
    }

    mainFormData.startPoint = newStartPoint;
    mainFormData.endPoint = newEndPoint;

    mainFormData.startPoint.marker = this.getMarker({markerLat: newStartPoint.latitude, markerLon: newStartPoint.longitude}, 'startPoint');
    mainFormData.endPoint.marker = this.getMarker({markerLat: newEndPoint.latitude, markerLon: newEndPoint.longitude}, 'endPoint');
  }

  async onClickSave(e): Promise<void> {
    const saveData = this.mainFormInfo;
    // const userInfo = JSON.parse(sessionStorage.getItem(APPCONSTANTS.ISLOGIN));
    const data = {
      tenant: this.G_TENANT,
      uid: this.utilService.getUserUid()
    };
    const userLookup = await this.codeService.commonPostLookup(data, 'user');
    const userInfo = userLookup.data[0];
    const validateData = this.mainForm.instance.validate();

    if (!validateData.isValid) {
      validateData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
      return;
    }

    if (userInfo.permissionYn !== 'Y') {
      this.utilService.notify_error('인증이 필요합니다.');
      return;
    }
    let wayPointInfoList;

    if (this.mainForm.formData.tranSalesType === '0') {

      if (!this.isPaymentMethod) {
        this.utilService.notify_error('결제수단을 선택해주세요');
        return;
      } else {
        const value = this.isPaymentMethod;

        if (value === '1') {

          if (this.mainFormInfo.tranTotAmt > this.preCard.remainAmt) {
            this.utilService.notify_error('금액이 부족합니다.');
            return;
          }
        }
      }
    }
    let checkTerm = true;

    this.termList.forEach((el, i) => {
      const checkElement = document.getElementById('termCheck'.concat(i.toString())) as HTMLInputElement;

      if (el.requiredYn === 'Y' && !checkElement.checked) {
        checkTerm = false;
      }
    });

    if (!checkTerm) {
      this.utilService.notify_error('동의가 필요합니다.');
      return;
    }
    /* TODO 확인 필요 현재는 총운임료를 입력함. */
    console.log(saveData.tranTotAmt);
    this.setMainFormInfoPayment(saveData.tranTotAmt);

    if (!await this.utilService.confirm(this.utilService.convert('com.confirm.execute', '결제'))) {
      return;
    }

    if (this.wayPointInfoList.length > 0) {
      wayPointInfoList = _.cloneDeep(this.wayPointInfoList.filter(el => !el.customHide));
    }
    const tranOrdDetailList = [
      this.startPointInfo,
      ...wayPointInfoList || [],
      this.endPointInfo
    ];
    saveData.uid = null;
    saveData.tenant = userInfo.tenant;
    saveData.userId = userInfo.uid;
    saveData.userNm = userInfo.usr;
    saveData.userHpNo = '11111111';
    saveData.sts = '200';
    saveData.tranSalesType = this.mainForm.formData.tranSalesType;
    /* 사용안함 */
    // saveData.tranIncludeYn =  this.utilService.checkValueConversion(saveData.tranIncludeYn);
    saveData.tranDate = this.startPointInfo.expectedDateTime.split(' ')[0];
    saveData.salesType = this.isPaymentMethod;
    saveData.tranOrdDetailList = tranOrdDetailList;
    saveData.cardNo = this.salesList[this.onActiveCardNum - 1].cardNo;

    const result = await this.service.sendPost(saveData, 'saveTranOrd');

    if (this.utilService.resultMsgCallback(result)) {
      /* TODO 저장시간 확인해야됨.*/
      this.onSearch().then(() => {
        this.initData();
        this.onChangeStep(1);
      });
    }
  }

  onClickAddWayPoint(): void {
    const cnt = this.wayPointList.filter(el => !el.customHide).length;

    if (cnt >= 5) {
      this.utilService.notify_error('경유지는 5곳 이상은 추가할 수 없습니다.');
    } else {
      this.wayPointList.push({});
      this.checkWayPoint  = this.checkChangeWayPoint();

      setTimeout(() => {
        const addedItemTop = document.getElementById('item' + this.wayPointList.length).offsetTop - 20;
        document.getElementById('contentsList').scrollTo({ left: 0, top: addedItemTop});
      }, 100);
    }
  }

  onClickDeleteWayPoint(index): void {
    this.initDrawMap();

    const mainFormData = this.mainForm.formData;
    const formName = 'wayPoint'.concat(index);

    this.wayPointList[index].customHide = true;
    mainFormData[formName] = mainFormData[formName] || {};
    mainFormData[formName].customHide = true;

    if (Boolean(mainFormData[formName].marker)) {
      mainFormData[formName].marker.setMap(null);
    }
    this.checkWayPoint = this.checkChangeWayPoint();
    // delete this.mainForm.formData['wayPoint'.concat(index)];
    // this.wayPointList.splice(index, 1);
  }

  onChangeStep(step): void {
    const mainFormData = this.mainForm.formData;
    this.isPaymentMethod = null;

    if (step === 1) {

    } else if (step === 2) {

      if (this.currentStep <= step) {
        const validateData = this.mainForm.instance.validate();

        if (!validateData.isValid) {
          validateData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
          return;
        }
      }
      const ptExpDateTime = [];
      ptExpDateTime.push({startPoint: mainFormData.startPoint.expectedDateTime});
      const wayPointList =
        Object.keys(mainFormData)
          .filter(el => el.includes('wayPoint'))
          .map(elKey => {
            mainFormData[elKey].tranPointType = 'W';
            mainFormData[elKey].tranType = 'DOWN';
            mainFormData[elKey].checkRegister = true;
            ptExpDateTime.push({[elKey]: mainFormData[elKey].expectedDateTime});
            return mainFormData[elKey];
          });
      ptExpDateTime.push({endPoint: mainFormData.endPoint.expectedDateTime});

      if (!this.compareDateTime(ptExpDateTime)) { return; }

      ['startPoint', 'endPoint'].forEach(point => {
        mainFormData[point] = mainFormData[point] || {};
        mainFormData[point].checkRegister = true;
        mainFormData[point].tranPointType = point === 'startPoint' ? 'S' : 'E';
        mainFormData[point].tranType = point === 'startPoint' ? 'UP' : 'DOWN';
      });
      mainFormData.tranCarCnt = this.checkWayPoint ? mainFormData.tranCarCnt || 0 : 1;
      mainFormData.tranIntervalType = this.checkWayPoint ? mainFormData.tranIntervalType || '' : '0';

      this.startPointInfo = _.cloneDeep(mainFormData.startPoint);
      this.wayPointInfoList = _.cloneDeep(wayPointList.map(({marker, ...wayPointData}) => wayPointData));
      this.endPointInfo = _.cloneDeep(mainFormData.endPoint);

      delete this.startPointInfo.marker;
      delete this.endPointInfo.marker;

      if (!mainFormData.checkRegister) {
        mainFormData.tranItemOption = this.tranItemOptionDs[0].code;
        // this.setDsInitData().then();
      }
    } else if (step === 3) {
      const validateData = this.mainForm.instance.validate();
      this.onActiveCardNum = 1;

      if (!validateData.isValid) {
        validateData.brokenRules[0][COMMONINITDATA.VALIDATOR].focus();
        return;
        // const name = validateData.brokenRules[0][COMMONINITDATA.VALIDATOR].element().firstChild.name;
        // this.mainForm.instance.getEditor(name).focus();
      } else {

        if (mainFormData.tranCarCnt <= 0) {
          this.utilService.notify_error('차량대수는 1대이상 가능합니다.');
          return;
        }
      }
      this.mainFormInfo.tranDate = this.startPointInfo.expectedDateTime.split(' ')[0];

      const tranCarKind = this.tranCarKindDs.filter(el => el.code === this.mainForm.formData.tranCarKind)[0];
      const dataFieldList =  this.utilService.getDataField(_.cloneDeep(this.mainForm.items), []);
      const tranData = {
        tenant: this.G_TENANT,
        inquiryDate: this.mainFormInfo.tranDate
      };
      const tranChargeData = {
        tenant: this.G_TENANT,
        codeId: tranCarKind.codeId,
        codecategoryId: tranCarKind.codeCategoryId
      };

      this.service.sendPost({tranList: [tranData], tranChargeList: [tranChargeData]}, 'findTran').then(tranInfo => {
        this.onClickSearchRoute(tranInfo.data).then(() => this.loadPanel.visible = false);
      });

      this.service.sendPost({uid: this.utilService.getUserUid()}, 'findUserPayment').then(rs => {
        const info = rs.data;

        this.tranSalesTypeDs = [];
        this.salesTypeDs = [];

        ['cardYn', 'preCardYn', 'billYn'].forEach(name => {

          if (info[name] === 'Y') {

            if (name === 'cardYn' || name === 'preCardYn') {

              if (this.tranSalesTypeDs.filter(el => el.code === '0').length === 0) {
                const tranSalesData = this.allTranSalesTypeDs.filter(el => el.code === '0')[0];
                this.tranSalesTypeDs.push(tranSalesData);
              }

              if (name === 'cardYn') {
                const salesTypeData = this.allSalesTypeDs.filter(el => el.code === '0')[0];
                this.salesTypeDs.push(salesTypeData);
              } else {
                const salesTypeData = this.allSalesTypeDs.filter(el => el.code === '1')[0];
                this.salesTypeDs.push(salesTypeData);
              }
            } else if (name === 'billYn') {
              const tranSalesData = this.allTranSalesTypeDs.filter(el => el.code === '1')[0];
              this.tranSalesTypeDs.push(tranSalesData);
            }
          }
        });

        this.salesList = info.salesList;
        this.preCard = info.preCardList[0];

        this.salesList.forEach(el => {
          el.imageSrc = '/assets/images/card1.png';
          el.cardNoMasking = this.utilService.getCardMask(el.cardNo);
        });
        this.preCard.remainAmtComma = this.utilService.setNumberComma(this.preCard.remainAmt);
      });
      const isOption = {};

      for (const name of dataFieldList) {

        if (name.includes('isOption')) {
          isOption[name] = this.utilService.checkValueConversion(mainFormData[name] || false);
        } else {
          this.mainFormInfo[name] = mainFormData[name];
        }
      }
      this.mainFormInfo.tranCarOption = JSON.stringify(isOption);

      const sbList = ['tranItemPackType', 'tranItemOption', 'tranCarType', 'tranCarKind', 'tranIntervalType'];
      const cmList = ['tranItemPackCnt', 'tranItemAmt', 'tranItemCbm',
                      'tranItemWeight', 'tranItemWidth', 'tranItemLength', 'tranItemHeight'];

      for (const sb of sbList) {
        this.mainFormInfo[sb.concat('Nm')] = this.getSelectBoxCodeName(this[sb.concat('Ds')], this.mainFormInfo[sb]);
      }

      for (const cm of cmList) {
        this.mainFormInfo[cm.concat('Comma')] = this.utilService.setNumberComma(this.mainFormInfo[cm]);
      }
      mainFormData.checkRegister = true;
      this.mainFormInfo.checkRegister = true;
    }
    this.currentStep = step;
  }

  compareDateTime(ptExpDateTime: any[]): boolean {

    if (this.currentStep !== 3) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];

      console.log(time);
      const nowDateTime = (date + ' ' + time);

      if (nowDateTime) {

        if (ptExpDateTime[0].startPoint < nowDateTime) {
          this.utilService.notify_error('상차일자는 현재날짜보다 빠를수 없습니다.');
          return false;
        }
      }
      const dateTime: any = {check: true};

      for (let i = 0; i < ptExpDateTime.length; i++) {

        if (i < ptExpDateTime.length - 1) {
          const currData = Object.entries(ptExpDateTime[i])[0];
          const nextData = Object.entries(ptExpDateTime[i + 1])[0];

          if (currData[1] > nextData[1]) {
            dateTime.check = false;
            dateTime.name = nextData[0];
            break;
          }
        }
      }

      if (!dateTime.check) {
        this.utilService.notify_error('하차일자는 상차일자보다 빠를수 없습니다.');
      }
      return dateTime.check;
    } else {
      return true;
    }
  }

  onValueChangedItemCategoryId(e): void {
    const comp = this.mainForm;
    const check = comp.formData.tranItemCategoryId === '9999';

    comp.formData.tranItemCategoryNm = !check ? comp.instance.getEditor('tranItemCategoryId').option('displayValue') : '';
    // comp.instance.getEditor('tranItemCategoryNm').option('disabled', !check);
  }

  onValueChangedExpectedDateTime(e): void {
    console.log(e);
  }


  async onClickSearchRoute(data): Promise<void> {
    this.loadPanel.visible = true;
    /*
    <option value="0" selected="selected">교통최적+추천</option>
    <option value="1">교통최적+무료우선</option>
    <option value="2">교통최적+최소시간</option>
    <option value="3">교통최적+초보</option>
    <option value="4">교통최적+고속도로우선</option>
    <option value="10">최단거리+유/무료</option>
    <option value="12">이륜차도로우선</option>
    */
    // var searchOption = $("#selectLevel").val();
    const searchOption = '10';
    const mainFormData = this.mainForm.formData;

    const tranData = data.tranList[0];
    const tranChargeData = data.tranChargeList[0];

    const carKind = await this.tranCarKindDs.filter(el => el.code === this.mainForm.formData.tranCarKind)[0];
    const passList: string =
      Object.keys(mainFormData)
        .filter(el => {
          if (el.includes('wayPoint')) {
            return !mainFormData[el].customHide;
          }
        })
        .map(rEl => [mainFormData[rEl].longitude, mainFormData[rEl].latitude].join(','))
        .join('_');
    const mapData = {
      startX: mainFormData.startPoint.longitude,
      startY: mainFormData.startPoint.latitude,
      endX: mainFormData.endPoint.longitude,
      endY: mainFormData.endPoint.latitude,
      truckWidth: Number(carKind.etcColumn2) / 10,
      truckHeight: Number(carKind.etcColumn3) / 10,
      truckLength: Number(carKind.etcColumn1) / 10,
      truckWeight: Number(carKind.etcColumn4) * 1000,
      truckTotalWeight: Number(carKind.etcColumn4) * 1000,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'WGS84GEO',
      passList,
      searchOption
    };
    const result = await this.service.searchRoute(Object.assign(COMMONINITDATA.TRAN_MAPDATA.ROUTE, mapData));
    const resultData = result.features;
    const properties = resultData[0].properties;

    const totalDistance = properties.totalDistance;
    const totalTime = properties.totalTime;
    const tDistance = this.utilService.getTotalDistance(totalDistance);
    const tTime = this.utilService.getTotalTime(totalTime);

    this.mainFormInfo.tranData = tranData;
    this.mainFormInfo.estimatedDistance = totalDistance;
    this.mainFormInfo.estimatedTime = totalTime;
    this.mainFormInfo.tDistance = tDistance;
    this.mainFormInfo.tTime = tTime;

    const tranChargeAmt = this.utilService.getTranChargeAmt(tranData, tranChargeData, tDistance, tTime);

    this.setMainFormInfoPayment(tranChargeAmt, 'order');

    this.setDisplayData(tDistance, totalTime);

    this.drawMapData(resultData);
  }

  setDisplayData(tDistance, totalTime): void {
    const displayDistance = this.utilService.setNumberComma(tDistance).concat('km');
    const displayTime = this.getDisplayTime(totalTime);

    console.log(displayTime);

    this.mainFormInfo.displayDistance = displayDistance;
    this.mainFormInfo.displayTime = displayTime;
  }

  setMainFormInfoPayment(tranChargeAmt, type?): void {
    /* TODO 오피넷 확인필요 운행거리 내 소요 톨게이트 통행료 */
    /* 운임료  tranChargeAmt */
    /* 총 운임료 */
    console.log(tranChargeAmt);
    console.log(this.mainFormInfo.tranData);
    let tranTotAmt = tranChargeAmt + (tranChargeAmt * this.mainFormInfo.tranData.serviceRate / 100);

    /* 부가세 */
    let tranSaleVat = tranTotAmt - Math.round(tranTotAmt / 1.1 / 100) * 100;

    /* 공급가 */
    let tranSaleAmt = tranTotAmt - tranSaleVat;

    /* 수수료 */
    let tranServiceAmt = tranTotAmt - tranSaleAmt;

    if (type === 'order') {
      const tranCarCnt = this.mainForm.formData.tranCarCnt || 1;
      tranChargeAmt = tranChargeAmt * tranCarCnt;
      tranTotAmt = tranTotAmt * tranCarCnt;
      tranSaleVat = tranSaleVat * tranCarCnt;
      tranSaleAmt = tranSaleAmt * tranCarCnt;
      tranServiceAmt = tranServiceAmt * tranCarCnt;

      if (this.mainForm.formData.tranIntervalType === '1') {
        tranChargeAmt = tranChargeAmt * 2;
        tranTotAmt = tranTotAmt * 2;
        tranServiceAmt = tranServiceAmt * 2;
        tranSaleVat = tranSaleVat * 2;
        tranSaleAmt = tranSaleAmt * 2;
      }
    }
    this.mainFormInfo.tranChargeAmt = tranChargeAmt;

    this.mainFormInfo.tranTotAmt = tranTotAmt;
    this.mainFormInfo.orgTranTotAmt = _.cloneDeep(tranTotAmt);

    this.mainFormInfo.tranServiceAmt = tranServiceAmt;
    this.mainFormInfo.tranSaleVat = tranSaleVat;
    this.mainFormInfo.tranSaleAmt = tranSaleAmt;

    this.mainFormInfo.displayTranTotAmt = this.utilService.setNumberComma(this.mainFormInfo.tranTotAmt);
  }

  initDrawMap(): void {

    if (this.drawInfoArr.length > 0) {

      for (const dInfoArr of this.drawInfoArr) {
        dInfoArr.setMap(null);
      }
    }
    this.drawInfoArr = [];

    if (!!this.infoWindow && !!this.infoWindow.getMap()) {
      this.infoWindow.setMap(null);
    }
  }

  drawMapData(resultData): void {
    // @ts-ignore
    const PTbounds = new Tmapv2.LatLngBounds();
    this.initDrawMap();

    for (const rData of resultData) {
      const geometry = rData.geometry;
      const properties = rData.properties;
      const polylineArr = [];
      let polyline: any = {};

      if (geometry.type === 'Point') {
        // @ts-ignore
        const latLng = new Tmapv2.LatLng(geometry.coordinates[1], geometry.coordinates[0]);
        PTbounds.extend(latLng);

        if (properties.pointType === 'E') {
          const content =
            `<div class='m-pop' style='position: static; top: 180px; left : 320px; width: max-content; display: flex; font-size: 14px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; background-color: #FFFFFF; align-items: center; padding: 5px;'>
              <div class='info-box' style='margin: 10px'>
                <p style='margin-bottom: 7px;'>
                  <span style=' font-size: 18px; font-weight: bold; color: #005cbf'> ${this.mainFormInfo.displayTime} </span>
                  <span style=' font-size: 12px; font-weight: bold; color: #005cbf'> ${this.mainFormInfo.displayDistance} (예상)</span>
                  <p>
                    <span style=' font-size: 12px;'>결제예정금액 ${this.mainFormInfo.displayTranTotAmt}원</span>
                  </p>
                </div>
              </div>`;

          // @ts-ignore
          this.infoWindow = new Tmapv2.InfoWindow({
            // @ts-ignore
            position: latLng,
            content,
            border: '0px solid #FF0000',
            type: 2,
            background: false,
            map: this.map,
          });
        }
      } else if (geometry.type === 'LineString') {

        for (const gCoordinates of geometry.coordinates) {
          // @ts-ignore
          const latLng = new Tmapv2.LatLng(gCoordinates[1], gCoordinates[0]);
          polylineArr.push(latLng);
          PTbounds.extend(latLng);
        }

        // @ts-ignore
        polyline = new Tmapv2.Polyline({
          path: polylineArr,
          // strokeColor: "#FF0000", // RED
          strokeColor: '#0000FF', // BLUE
          strokeWeight: 6,
          map: this.map
        });
        this.drawInfoArr.push(polyline);
      }
    }
    this.map.fitBounds(PTbounds);
  }

  setMapFitBounds(): void {
    const mapBound = this.map.getBounds();
    this.map.setZoom(10);
    this.map.fitBounds(mapBound, 50);
  }

  private getDisplayTime(totalTime): any {
    const seconds = totalTime;
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    let displayTime = ' ';
    minutes %= 60;

    if (days > 0) {
      displayTime += days + '일';
    }

    if (hours > 0 && hours < 24) {

      if (displayTime.length > 0) {
        displayTime += ' ';
      }
      displayTime += hours + '시간';
    }

    if (minutes > 0 && minutes < 60) {

      if (displayTime.length > 0) {
        displayTime += ' ';
      }
      displayTime += minutes + '분';
    }
    return displayTime;
  }

  initItemCbm(e): void {
    const mainDataForm = this.mainForm.formData;
    // mainDataForm.tranItemWeight = 0;
    // mainDataForm.tranItemCbm = 0;
    // mainDataForm.tranItemWidth = 0;
    // mainDataForm.tranItemLength = 0;
    // mainDataForm.tranItemHeight = 0;
  }

  calculateCbm(e): void {
    const mainDataForm = this.mainForm.formData;

    if (Boolean(mainDataForm.tranItemWidth) && Boolean(mainDataForm.tranItemLength) && Boolean(mainDataForm.tranItemHeight)) {
      const orgCBM = mainDataForm.tranItemWidth * mainDataForm.tranItemLength * mainDataForm.tranItemHeight;
      mainDataForm.tranItemCbm = orgCBM / 1000;
    } else {
      mainDataForm.tranItemCbm = 0;
    }
  }

  onActivePanel(e): void {
    console.log(11111);
    console.log(e);
    this.isPaymentMethod = e.value.code;
  }

  onPrevCard(e): void{

    if (this.onActiveCardNum === 1) {
      console.log(e.component);
      console.log(e.component.class);
      e.component.class = 'disabled';
      return;
    }

    this.onActiveCardNum--;
    const slide = document.getElementById('slideList');
    slide.style.left = (slide.offsetLeft + this.cardWidth ).toString().concat('px');

  }

  onNextCard(e): void{

    if (this.onActiveCardNum === this.salesList.length) { return; }

    this.onActiveCardNum++;

    const slide = document.getElementById('slideList');
    slide.style.left = (slide.offsetLeft - this.cardWidth ).toString().concat('px');

  }

  /* 주소록 팝업  */
  addressPopupOpen(e, name): void {
    console.log(e);
    console.log(name);

    const data = {
      tenant: this.G_TENANT,
      uid: this.utilService.getUserUid(),
      isSimple: true,
      formName: name
    };
    this.usbookmark.open(data);
  }

  getSimpleBookmark(data): void {
    const mainDataForm = this.mainForm.formData;
    const dataNameList = [
      'companyNm', 'refNm', 'address1', 'address2', 'refTellNo'
    ];

    dataNameList.forEach(name => {
      mainDataForm[data.formName] = mainDataForm[data.formName] || {};
      mainDataForm[data.formName][name] = data[name];
    });

    this.findAddressTMap({address: mainDataForm[data.formName].address1}).then(result => {
      console.log(222);
      console.log(mainDataForm[data.formName].address1);
      console.log(result);
      console.log(mainDataForm);
    });
  }

  /* 차량제원 팝업  */
  transportPopupOpen(e): void {
    const tranCarCnt =  this.checkWayPoint ? 0 : 1;
    this.transport.open({checkWayPoint: this.checkWayPoint, tranCarCnt});
  }

  getTransport(data): void {

    for (const key of Object.keys(data)) {
      this.mainForm.formData[key] = data[key];
    }
  }

  /* 카드등록 팝업  */
  cardPopupOpen(e): void {
    // console.log(this.mainForm.formData);
    const cloneData = _.cloneDeep({
      tenant: this.G_TENANT,
      uid: this.utilService.getUserUid()
    });
    this.card.open(cloneData);
  }

  getCards(data): void {

    this.card.search(data).then(result => {
      this.salesList = result.data;
    });
  }

  /* 전문 팝업  */
  viewFullText(data): void {
    this.fulltext.open(data);
  }

  focusoutTranTotAmt(e): void {
    const totPrice = document.getElementById('totPrice') as HTMLInputElement;
    const price = Number(e.target.value);

    if (price > 0) {

      if (this.mainFormInfo.orgTranTotAmt > price) {
        this.utilService.notify_error('금액이 더 커야 합니다.');
        totPrice.value = this.utilService.setNumberComma(this.mainFormInfo.orgTranTotAmt);
        totPrice.focus();
        return;
      } else {
        this.mainFormInfo.tranTotAmt = price;
        totPrice.value = this.utilService.setNumberComma(Number(e.target.value));
      }
    }
  }
}
