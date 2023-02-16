import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CodeService, CodeVO} from '../../mm/code/code.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {TranordallocateService} from '../tranordallocate/tranordallocate.service';
import {CompanyService} from '../../mm/company/company.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {TranordaccidentService} from './tranordaccident.service';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';

@Component({
  selector: 'app-tranordaccident',
  templateUrl: './tranordaccident.component.html',
  styleUrls: ['./tranordaccident.component.scss']
})
export class TranordaccidentComponent implements OnInit, AfterViewInit {

  constructor(public utilService: CommonUtilService,
              private service: CodeService,
              private codeService: CommonCodeService,
              private tranOrdAllocateService: TranordallocateService,
              private tranOrdAccidentService: TranordaccidentService,
              private companyService: CompanyService,
              public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();

    this.popupSaveClick = this.popupSaveClick.bind(this);
    this.popupCancelClick = this.popupCancelClick.bind(this);
    this.onAccident = this.onAccident.bind(this);
    this.popupAccidentClick = this.popupAccidentClick.bind(this);
    this.onClickPopupAccidentSave = this.onClickPopupAccidentSave.bind(this);
    this.onClickPopupAccidentCancel = this.onClickPopupAccidentCancel.bind(this);
    this.onFindAddress = this.onFindAddress.bind(this);
  }

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;

  // Global
  G_TENANT: any;
  pageInfo: any = this.utilService.getPageInfo();

  // ***** main ***** //
  // Form
  mainFormData: any = {
    companyId: null,
    tranOrdKey: null
  };

  // Grid
  mainDataSource: DataSource;
  mainEntityStore: ArrayStore;
  key = 'uid';
  selectedRows: number[];
  // ***** main ***** //

  popupVisible = false;
  popupAccidentVisible = false;
  popupAccidentData: any;
  // ***** popup ***** //
  popupMode = 'Add';
  // Form
  popupFormData: any = {};
  popupAccidentFormData: any = {};
  // Grid

  popupEntityStore: ArrayStore;
  popupDataSource: DataSource;

  codeList: CodeVO[];
  changes = [];

  // DataSet
  mainData = [];
  mainSearchData = [];
  dsCarType = [];
  dsCarKind = [];
  dsItemOption = [];
  dsItemPackType = [];
  dsOrdCategory = [];
  dsTranSalesType = [];
  dsIntervalType = [];
  dsTranSts = [];
  displaySts = [];
  dsActFlg = [];

  dsCompanyList: any = [];
  reqCarKind: number;
  popupData: any = {};
  mapObj: any;
  tranOrdCarId: number;

  // card 더보기 버튼
  cardItems: any[] = [];
  // 더보기 row 갯수
  limitCnt = 4;
  // 마지막 uid
  cardUid = 0;
  isMoreItem = false;

  GRID_STATE_KEY = 'admin.tranordaccident';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.popup');
  loadStateTag = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.tag');
  saveStateTag = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.tag');

  addComma(num: string): string {
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  onToolbarPreparingWithExtra(e): void {
    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));
    e.toolbarOptions.items = newToolbarItems;
  }

  // 초기화 이벤트
  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
    this.mainForm.instance.getEditor('sts').option('value', '결제완료');
  }

  getCardUid(list: any[]): any {
    const tempList: number[] = [];
    for (const item of list) {
      tempList.push(Number(item.uid));
    }
    this.cardUid = Math.min(...tempList);
  }

  async addCardItem(e): Promise<void> {
    this.cardItems = await this.setSearchData();
    if (this.cardItems.length > 0) {
      for (const item of this.cardItems) {
        this.mainData.push(item);
      }
      console.log(e);
      // 스크롤 내리기, 스크롤 고정 찾는중...
      setTimeout(() => {
        const element = document.querySelector('.layout-body').getElementsByClassName('dx-scrollable-container')[0];
        element.scrollTo({left: 0, top: element.scrollHeight, behavior: 'smooth'});
      }, 1);
    }
  }

  async setSearchData(): Promise<any> {
    const searchVO = {
      tranOrdKey: this.mainFormData.tranOrdKey,
      sts: this.mainFormData.sts,
      accidentYn: this.mainFormData.accidentYn,
      limitCnt: this.limitCnt,
      cardUid: null
    };
    if (Boolean(this.cardUid)) {
      searchVO.cardUid = this.cardUid;
    }
    const searchData = await this.tranOrdAccidentService.get(searchVO);
    if (searchData.data.length < this.limitCnt || !Boolean(searchData)) {
      this.isMoreItem = false;
    } else if (searchData.data.length === this.limitCnt) {
      this.isMoreItem = true;
    }
    this.getCardUid(searchData.data);
    const list = [];
    for (const item of searchData.data) {
      for (const detail of item.tranOrdMassDetailList) {
        const itemDetail = {};
        Object.assign(itemDetail, Object.assign(item, detail));
        list.push(itemDetail);
      }
    }
    return this.beforePrint(list);
  }

  /**
   * 메인 화면에서 사용할 OBJECT를 재생성한다.
   * 상차지,경유지,하차지별로 나눈다.
   */
  beforePrint(data: any): any[] {
    let sumData = {
      upData: {},
      downData: {},
      viaNum: 0,
      viaData: []
    };
    const arrData = [];

    for (const item of data) {
      // lookup을 이용하여 운송사 이름 가져와야함. dataField = tranOrdCompany
      // 차량 타입
      for (const type of this.dsCarType) {
        if (item.tranCarType === type.code) {
          item.tranCarType = type.codeName;
        }
      }
      // 차량 종류
      for (const type of this.dsCarKind) {
        if (item.tranCarKind === type.code) {
          item.tranCarKind = type.codeName;
        }
      }
      // 물품적재옵션
      for (const type of this.dsItemOption) {
        if (item.tranItemOption === type.code) {
          item.tranItemOption = type.codeName;
        }
      }
      // 포장방법
      for (const type of this.dsItemPackType) {
        if (item.tranItemPackType === type.code) {
          item.tranItemPackType = type.codeName;
        }
      }
      // 배차오더분류
      for (const type of this.dsOrdCategory) {
        if (item.tranOrdCategory === type.code) {
          item.tranOrdCategory = type.codeName;
        }
      }
      this.codeService.getCode(this.G_TENANT, 'STS').subscribe(result => {
        this.dsTranSts = result.data;
      });
      // 배차오더상태
      for (const type of this.dsTranSts) {
        if (item.sts === type.code) {
          item.sts = type.codeName;
        }
      }
      // 결제방식
      for (const type of this.dsTranSalesType) {
        if (item.tranSalesType === type.code) {
          item.tranSalesType = type.codeName;
        }
      }
      // 운송구간
      for (const type of this.dsIntervalType) {
        if (item.tranIntervalType === type.code) {
          item.tranIntervalType = type.codeName;
        }
      }
      // 운송사
      if (Number(item.tranOrdType) === 0) {
        item.tranOrdCompany = '차주';
      } else {
        for (const type of this.dsCompanyList) {
          if (item.companyId === type.uid) {
            item.tranOrdCompany = type.name;
          }
        }
      }

      // 주소1,2 합치기
      const theAddr = `${String(item.address1).trim()} ${String(item.address2).trim()}`;
      Object.assign(item, {addrFull: theAddr});
      // 세자리 콤마 tranItemCbm tranItemWeight tranItemAmt tranCarCnt
      item.tranCarCnt = this.addComma(String(item.tranCarCnt));
      item.tranItemCbm = this.addComma(String(item.tranItemCbm));
      item.tranItemWeight = this.addComma(String(item.tranItemWeight));
      item.tranItemAmt = this.addComma(String(item.tranItemAmt));
      item.tranTotAmt = this.addComma(String(item.tranTotAmt));

      if (item.tranPointType === 'S' && !sumData.upData.hasOwnProperty('tranPointType')) {
        item.trantype = '상차';
        sumData.upData = item;
        // 일자, 시간 분리
        item.tranOrdTime = String(item.expectedDateTime).substring(String(item.tranData).length + 1, item.expectedDateTime.length - 3);
      } else if (item.tranPointType === 'W') {
        sumData.viaNum++;
        sumData.viaData.push(item);
      } else if (item.tranPointType === 'E') {
        item.trantype = '하차';
        sumData.downData = item;
      }
      if (item.tranPointType === 'A') {
        item.trantype = '상차';
        sumData.upData = item;
      }
      // 초기화
      if (Object.keys(sumData.upData).length > 0 && Object.keys(sumData.downData).length > 0) {
        arrData.push(sumData);
        sumData = {
          upData: {},
          downData: {},
          viaNum: 0,
          viaData: []
        };
      }
    }
    return arrData;
  }

  async onSearch(): Promise<any> {
    try {
      if (Boolean(this.cardUid)) {
        this.cardUid = null;
      }
      this.mainData = await this.setSearchData();
      this.utilService.notify_success('search success');
    } catch {
      this.utilService.notify_error('search error');
    }
  }

  resultMsgCallback(result, msg): boolean {

    if (result.success) {
      this.utilService.notify_success(msg + ' success');
    } else {
      this.utilService.notify_error(result.msg);
    }
    return result.success;
  }

  async onSearchCarInfo(tranOrdId?: string, companyId?: number): Promise<any[]> {
    const searchVO = {
      tranOrdId,
      companyId
    };
    const result = await this.tranOrdAccidentService.carInfoGet(searchVO);


    for (const item of result.data) {
      // 차량 타입
      for (const type of this.dsCarType) {
        if (item.carType === type.code) {
          item.carType = type.codeName;
        }
      }
      // 차량 종류
      for (const type of this.dsCarKind) {
        if (item.carKind === type.code) {
          item.carKind = type.codeName;
        }
      }
    }
    return result.data;
  }

  // 신규버튼 이벤트
  async onAccident(data: any): Promise<void> {

    this.popupData = data;
    this.reqCarKind = data.upData.tranCarKind;
    const companyId = data.upData.companyId;
    const tranOrdId = data.upData.tranOrdId;
    const reqList = await this.onSearchCarInfo(tranOrdId, companyId);
    await this.showPopup('Add', reqList);
  }

  async showPopup(popupMode, result): Promise<void> {
    this.popupEntityStore = new ArrayStore(
      {
        data: result,
        key: this.key
      }
    );
    this.popupDataSource = new DataSource({
      store: this.popupEntityStore
    });
    this.popupMode = popupMode;
    this.popupVisible = true;
  }

  popupShown(e): void {
    // 지도 초기화
    if (Boolean(this.mapObj)) {
      this.destroyMap(this.mapObj).then();
    }
    this.mapObj = this.initMap();
  }
  // 저장버튼 이벤트
  async popupSaveClick(e): Promise<void> {
    const data = this.popupDataSource.items();
    console.log(this.popupData);
    const changeList = [];
    for (const change of this.changes) {
      const chkChanges = change.data.check === true;
      if (chkChanges) {

        for (const item of data) {
          if (item.uid === change.key) {
            // @ts-ignore
            changeList.push(Object.assign(item, {tranOrdKey: this.popupData.upData.tranOrdKey}));
          }
        }
      }
    }
    if (changeList.length > 0) {
      if (
        !await this.utilService.confirm(this.utilService.convert('com.confirm.save', '배차정보'))) {
        return;
      }
      try {
        await this.tranOrdAllocateService.save(changeList);
        this.utilService.notify_success('save success');
      } catch {
        this.utilService.notify_success('save fail');
      }

      this.popupVisible = false;
      await this.onSearch();

    } else {
      await this.tranOrdAccidentService.confirm(this.utilService.convert1('admin.tranordallocate.validationfail', '저장할 배차정보가 없습니다.'));
    }
  }

  // 주소 검색창
  async onFindAddress(): Promise<void> {
    const that = this;
    const width = 500; // 팝업의 너비
    const height = 600; // 팝업의 높이
    // @ts-ignore
    new daum.Postcode({
      // 팝업창 Key값 설정 (영문+숫자 추천)
      popupKey: 'searchAddrPopup',
      /*      width, // 생성자에 크기 값을 명시적으로 지정해야 합니다.
            height,*/
      // tslint:disable-next-line:typedef
      oncomplete(data) {
        that.popupAccidentFormData.address1 = data.address;
      }
    }).open(
      /*      left: (window.screen.width / 2) - (width / 2),
            top: (window.screen.height / 2) - (height / 2)*/
    );
  }

  // 닫기클릭 이벤트
  popupCancelClick(e): void {
    // 지도 초기화
    if (Boolean(this.mapObj)) {
      this.destroyMap(this.mapObj).then().catch(null);
    }
    this.popupVisible = false;
    // 초기화
    // this.destroyMap(this.mapObj).then();
    this.mapObj = {};
    this.changes = [];
  }

  onRowClick(e): void {
    this.tranOrdCarId = e.key;
  }

  // 그리드 더블클릭시 호출하는 함수
  popupAccidentClick(e): void {
    this.popupAccidentVisible = true;
    // console.log(this.popupDataSource);

  }

  async onClickPopupAccidentSave(e): Promise<void> {

    const resultAddr: any = await this.tranOrdAccidentService.searchAddress(this.popupAccidentFormData.address1);
    const addrInfo = resultAddr.coordinateInfo.coordinate[0];
    this.popupAccidentFormData.tranOrdId = this.popupData.upData.tranOrdId;
    this.popupAccidentFormData.tranOrdKey = this.popupData.upData.tranOrdKey;
    this.popupAccidentFormData.tranOrdCarId = this.tranOrdCarId;

    this.popupAccidentFormData.latitude = addrInfo.newLat;
    this.popupAccidentFormData.longitude = addrInfo.newLon;
    this.popupAccidentFormData.ciDo = addrInfo.city_do;
    this.popupAccidentFormData.guGun = addrInfo.gu_gun;
    this.popupAccidentFormData.eupMyun = addrInfo.eup_myun;
    /*    console.log(addrInfo);
        console.log(this.popupAccidentFormData);*/

    try {
      const result = await this.tranOrdAccidentService.saveAccident(this.popupAccidentFormData);
      console.log(result);
      this.utilService.notify_success('save success');
      this.popupAccidentVisible = false;
      this.popupVisible = false;
      const reqList = await this.onSearchCarInfo(this.popupData.upData.tranOrdId);
      console.log(result);
    } catch {
      this.utilService.notify_success('save fail');
    }
  }

  onClickPopupAccidentCancel(e): void {
    this.popupAccidentFormData = {};
    this.popupAccidentData = {};
    this.popupAccidentVisible = false;

  }

  ngOnInit(): void {
    this.initCode();
    this.mainEntityStore = new ArrayStore(
      {
        data: [],
        key: this.key
      }
    );
    this.mainDataSource = new DataSource({
      store: this.mainEntityStore
    });

    this.G_TENANT = this.utilService.getTenant();
  }

  ngAfterViewInit(): void {
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then(() => this.onSearch());
  }

  initCode(): void {
    // 배차상태
    this.codeService.getCode(this.G_TENANT, 'STS').subscribe(async result => {
      this.dsTranSts = result.data;
      this.displaySts = result.data.filter((x) => Number(x.code) >= 250 && Number(x.code) <= 550);
    });
    // 차량유형
    this.codeService.getCode(this.G_TENANT, 'CARTYPE').subscribe(result => {
      this.dsCarType = result.data;
    });
    // 차량종류
    this.codeService.getCode(this.G_TENANT, 'CARKIND').subscribe(result => {
      this.dsCarKind = result.data;
    });
    // 물품적재옵션
    this.codeService.getCode(this.G_TENANT, 'TRANITEMOPTION').subscribe(result => {
      this.dsItemOption = result.data;
    });
    // 포장방법
    this.codeService.getCode(this.G_TENANT, 'TRANITEMPACKTYPE').subscribe(result => {
      this.dsItemPackType = result.data;
    });
    // 물품분류옵션
    this.codeService.getCode(this.G_TENANT, 'TRANORDCATEGORY').subscribe(result => {
      this.dsOrdCategory = result.data;
    });
    // 결제방식
    this.codeService.getCode(this.G_TENANT, 'TRANSALESTYPE').subscribe(result => {
      this.dsTranSalesType = result.data;
    });
    // 운송구간
    this.codeService.getCode(this.G_TENANT, 'TRANINTERVALTYPE').subscribe(result => {
      this.dsIntervalType = result.data;
    });
    // AccidentYn
    this.codeService.getCode(this.G_TENANT, 'YN').subscribe(result => {
      this.dsActFlg = result.data;
    });

    // 운송사
    const searchCompanyVO = {
      tenant: this.G_TENANT,
      actFlg: 'Y'
    };
    this.companyService.sendPost(searchCompanyVO, 'findCompany').then((result) => {
      this.dsCompanyList = result.data;
    });
  }

  initForm(): void {

  }

  /*지도 데이터*/
  initMapData(): {} {
    const popupData = this.popupData;
    const routObj: any = {};

    routObj.startX = popupData.upData.longitude;
    routObj.startY = popupData.upData.latitude;
    // 왕복일 경우
    const isRoundTrip = popupData.upData.tranIntervalType === '1' || popupData.upData.tranIntervalType === '왕복';
    if (isRoundTrip) {
      routObj.endX = popupData.viaData[0].longitude;
      routObj.endY = popupData.viaData[0].latitude;
      routObj.pass = [];
    } else {
      routObj.endX = popupData.downData.longitude;
      routObj.endY = popupData.downData.latitude;
      routObj.pass = popupData.viaData;
    }
    routObj.passList = '';
    if (routObj.pass.length > 0) {
      for (const pass of routObj.pass) {
        if (routObj.passList !== '') {
          routObj.passList += `_${pass.longitude},${pass.latitude}`;
        } else {
          routObj.passList += `${pass.longitude},${pass.latitude}`;
        }
      }
    }
    // 화물 API 사용시 아래 변수 선언
    for (const item of this.dsCarKind) {
      if (this.reqCarKind === item.codeName) {
        routObj.truckWidth = Number(item.etcColumn2) / 10;
        routObj.truckHeight = Number(item.etcColumn3) / 10;
        routObj.truckLength = Number(item.etcColumn1) / 10;
        routObj.truckWeight = Number(item.etcColumn4) * 1000;
        routObj.truckTotalWeight = Number(item.etcColumn4) * 1000;
        break;
      }
    }
    return routObj;
  }

  /*지도 생성*/
  initMap(): any {
    const routData = this.initMapData();
    // @ts-ignore
    const map = new Tmapv2.Map('map_div', {
      // @ts-ignore
      center: new Tmapv2.LatLng(routData.startY, routData.startX),
      width: '100%',
      height: '250px',
      zoom: 14
    });
    this.drawLineOnMap(map, routData).then();
    return map;
  }

  /*지도 삭제*/
  async destroyMap(map: any): Promise<void> {
    try {
      map.destroy();
    } catch (e) {

    }

  }

  /*경로 그리기*/
  async drawLineOnMap(map: any, routObj: any): Promise<void> {

    const newPolyLine = [];
    let geoData: any;

    function drawData(data): void {
      // 지도위에 선은 다 지우기
      const newData = [];
      let equalData = [];
      let pointId1 = '-1234567';
      let arLine = [];

      for (const feature of data.features) {
        // 배열에 경로 좌표 저장
        if (feature.geometry.type === 'LineString') {
          arLine = [];
          for (const coordinate of feature.geometry.coordinates) {
            // @ts-ignore
            const startPt = new Tmapv2.LatLng(coordinate[1], coordinate[0]);
            arLine.push(startPt);
            pointArray.push(coordinate);
          }
          // @ts-ignore
          const polyline = new Tmapv2.Polyline({
            path: arLine,
            strokeColor: '#00ff40',
            strokeWeight: 6,
            map
          });
          newPolyLine.push(polyline);
        }
        const pointId2 = feature.properties.viaPointId;
        if (pointId1 !== pointId2) {
          equalData = [];
          equalData.push(feature);
          newData.push(equalData);
          pointId1 = pointId2;
        } else {
          equalData.push(feature);
        }
      }
      geoData = newData;
    }

    function addMarker(status, lon, lat, tag): void {
      // 출도착경유구분
      // 이미지 파일 변경.
      let imgURL: string;
      switch (status) {
        case 'llStart':
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_s.png';
          break;
        case 'llPass':
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_g_m_p.png';
          break;
        case 'llEnd':
          imgURL = 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
          break;
        default:
      }
      // @ts-ignore
      const marker = new Tmapv2.Marker({
        // @ts-ignore
        position: new Tmapv2.LatLng(lat, lon),
        icon: imgURL,
        map
      });
      return marker;
    }

    // 2. 시작, 도착 심볼찍기
    const pointArray = [];
    // 시작
    addMarker('llStart', routObj.startX, routObj.startY, 1);

    // 도착
    addMarker('llEnd', routObj.endX, routObj.endY, 2);
    // 3. 경유지 심볼 찍기
    if (Boolean(routObj.passList)) {
      let idx = 3;
      for (const pass of routObj.pass) {
        addMarker('llPass', pass.longitude, pass.latitude, idx);
        idx++;
      }
    }

    // 4. 경로탐색 API 사용요청
    try {
      const prtcl = await this.tranOrdAllocateService.getAddrDataByCoordinate(routObj);

      if (prtcl.hasOwnProperty('features')) {
        // 5. 경로탐색 결과 Line 그리기
        drawData(prtcl);

        // 6. 경로탐색 결과 반경만큼 지도 레벨 조정
        const newData = geoData[0];
        // @ts-ignore
        const PTbounds = new Tmapv2.LatLngBounds();
        for (const mData of newData) {
          const type = mData.geometry.type;
          if (type === 'Point') {
            // @ts-ignore
            const linePt = new Tmapv2.LatLng(mData.geometry.coordinates[1], mData.geometry.coordinates[0]);
            PTbounds.extend(linePt);
          } else {
            for (const data of mData.geometry.coordinates) {
              // @ts-ignore
              const linePt = new Tmapv2.LatLng(data[1], data[0]);
              PTbounds.extend(linePt);
            }
          }
        }
        map.fitBounds(PTbounds);
      } else {
        console.log('fail if');
      }
    } catch {
      console.log('fail catch');
    }
  }
}
