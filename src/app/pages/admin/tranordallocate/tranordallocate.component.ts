import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CodeService, CodeVO} from '../../mm/code/code.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxDataGridComponent, DxSelectBoxComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {TranordallocateService} from './tranordallocate.service';
import {CompanyService} from '../../mm/company/company.service';

@Component({
  selector: 'app-tranordallocate',
  templateUrl: './tranordallocate.component.html',
  styleUrls: ['./tranordallocate.component.scss']
})
export class TranordallocateComponent implements OnInit, AfterViewInit {

  constructor(public utilService: CommonUtilService,
              private service: CodeService,
              private codeService: CommonCodeService,
              private tranOrdAllocateService: TranordallocateService,
              private companyService: CompanyService,
              public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();

    this.popupSaveClick = this.popupSaveClick.bind(this);
    this.popupCancelClick = this.popupCancelClick.bind(this);
    this.onAllocate = this.onAllocate.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('companyId', {static: false}) companyId: DxSelectBoxComponent;

  // Global
  G_TENANT: any;
  pageInfo: any = this.utilService.getPageInfo();

  // ***** main ***** //
  // Form
  mainFormData = {
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

  // ***** popup ***** //
  popupMode = 'Add';
  // Form
  popupFormData: any = {};
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
  dsCompanyList: any = [];

  // card 더보기 버튼
  cardItems: any[] = [];
  // 더보기 row 갯수
  limitCnt = 4;
  // 마지막 uid
  cardUid = 0;
  isMoreItem = false;

  reqCarKind: number;
  reqCarType: number;

  prtcl: any = {};

  popupData: any = {};
  mapObj: any;

  GRID_STATE_KEY = 'admin.tranordallocate';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.popup');
  loadStateTag = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '.tag');
  saveStateTag = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '.tag');

  addComma(num: string): string {
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
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
      for (const item of this.cardItems ){
        this.mainData.push(item);
      }
      // 스크롤 내리기, 스크롤 고정 찾는중...
      setTimeout(() => {
        const element = document.querySelector('.layout-body').getElementsByClassName('dx-scrollable-container')[0];
        element.scrollTo({left: 0, top: element.scrollHeight, behavior: 'smooth'});
      }, 1);
    }
  }

  async setSearchData(): Promise<any>{
    const searchVO = {
      tranOrdKey: this.mainFormData.tranOrdKey,
      companyId: this.mainFormData.companyId,
      limitCnt: this.limitCnt,
      cardUid: null
    };
    if (Boolean(this.cardUid)) {
      searchVO.cardUid = this.cardUid;
    }
    const searchData = await this.tranOrdAllocateService.get(searchVO);
    if (searchData.data.length < this.limitCnt || !Boolean(searchData)){
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
  beforePrint(data: any): any {
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

      // 대차건은 대차료를 총 운임료로 표현한다.
      if (item.accidentYn === 'Y') {
        item.tranTotAmt = this.addComma(String(item.tranAccidentAmt));
      } else {
        item.tranTotAmt = this.addComma(String(item.tranTotAmt));
      }

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
    if (Boolean(this.cardUid)) {
      this.cardUid = null;
    }
    try {
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

  async onSearchCarInfo(tranOrdId?: number, tranOrdKey?: string, companyId?: number): Promise<any[]> {
    const searchVO: any = {
      tranOrdId,
      tranOrdKey,
      companyId
    };
    searchVO.tranOrdId = tranOrdId;
    searchVO.tranOrdKey = tranOrdKey;
    searchVO.companyId = companyId;

    const result = await this.tranOrdAllocateService.carInfoGet(searchVO);

    // 요청한 차량 유형이 더 높아야 함.
    // 2022.10.17 코드ID -> 우선순위로 변경 -> 2022.11.18 다시 원상복귀
    for (const type of this.dsCarKind) {
      if (this.popupData.upData.tranCarKind === type.codeName) { // type.codeName) {
        this.reqCarKind = Number(type.code);
        // this.reqCarKind = Number(type.priority);
        break;
      }
    }

    // 요청한 차량 종류와 같아야함
    for (const type of this.dsCarType) {
      if (this.popupData.upData.tranCarType === type.codeName) {
        this.reqCarType = Number(type.code);
        break;
      }
    }

    const reqList = [];
    for (const item of result.data) {
      if (Number(item.carKind) >= this.reqCarKind && Number(item.carType) === this.reqCarType) {
        reqList.push(item);
      }
    }
    // @ts-ignore
    for (const item of reqList) {
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
    return reqList;
  }
  // 신규버튼 이벤트
  async onAllocate(data: any): Promise<void> {

    this.popupData = data;
    const companyId = data.upData.companyId;
    const tranOrdKey = data.upData.tranOrdKey;
    const tranOrdId = data.upData.uid;
    const reqList = await this.onSearchCarInfo(tranOrdId, tranOrdKey, companyId);
    await this.showPopup('Add', reqList);
  }
  // 팝업 셀렉트박스 조회
  async onValueChanged(e): Promise<any>{
    const result = await this.onSearchCarInfo(this.popupData.upData.uid, this.popupData.upData.tranOrdKey, e.value);
    this.popupEntityStore = new ArrayStore(
      {
        data: result,
        key: this.key
      }
    );
    this.popupDataSource = new DataSource({
      store: this.popupEntityStore
    });
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

    const tranOrdType = this.popupData.upData.tranOrdType;
    if (Number(tranOrdType) !== 0) {
      const companyNm = this.popupData.upData.tranOrdCompany;
    }

    // 지도 초기화
    if (Boolean(this.mapObj)) {
      this.destroyMap(this.mapObj).then().catch(null);
    }
    this.mapObj = this.initMap();
    // this.popupGrid.dataSource = this.utilService.setGridDataSource(this.gridResource, this.key);
  }
  // 저장버튼 이벤트
  async popupSaveClick(e): Promise<void> {
/*    if (!this.utilService.isAdminUser()) {
      await this.tranOrdAllocateService.confirm(this.utilService.convert1('admin.tranordmass.addrvalidationfail', '관리자만 저장 가능합니다.'));
    }*/
    const data = this.popupDataSource.items();

    const changeList = [];
    for (const change of this.changes) {
      const chkChanges = change.data.check === true;
      if (chkChanges) {

        for (const item of data) {
          if (item.uid === change.key) {
            const tranCharge: any = {};
            tranCharge.accidentYn = this.popupData.upData.accidentYn; // 사고여부
            tranCharge.tranOrdKey = this.popupData.upData.tranOrdKey;
            // @ts-ignore
            changeList.push(Object.assign(item, tranCharge));
          }
        }
      }
    }
    /* 배차된 차량 대수 count
    * deliveryOrdCar table에서 tranOrdId를 가지고 배차된 차량이 있는지 대수 확인
    * tranOrd의 해당건이 200 혹은 250인지 확인 - done
    * */
    const allocatedCarCount: any = await this.tranOrdAllocateService.getAllocatedCarCount(this.popupData.upData.tranOrdId);
    let leftCarCount: number;
    if (Boolean(allocatedCarCount)) {
      leftCarCount = Number(this.popupData.upData.tranCarCnt) - Number(allocatedCarCount.data);
    } else {
      leftCarCount = Number(this.popupData.upData.tranCarCnt);
    }

    if (leftCarCount < changeList.length) {
      await this.tranOrdAllocateService.confirm(this.utilService.convert1('admin.tranordallocate.overAllocate', '배차 대수를 초과했습니다.'));
      return;
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
      await this.tranOrdAllocateService.confirm(this.utilService.convert1('admin.tranordallocate.validationfail', '저장할 배차정보가 없습니다.'));
    }
  }

  // 닫기클릭 이벤트
  popupCancelClick(e): void {
    // 지도 초기화
    if (Boolean(this.mapObj)) {
      this.destroyMap(this.mapObj).then();
    }
    this.popupVisible = false;
    // 초기화
    // this.destroyMap(this.mapObj).then();
    this.mapObj = {};
    this.changes = [];
  }

  setFocusRow(index, grid): void {
    grid.focusedRowIndex = index;
  }

  // 그리드 셀 이동시 호출하는 함수
  onFocusedCellChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);
  }

  ngOnInit(): void {
    this.initCode();
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
      if (this.reqCarKind === Number(item.code)) {
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
      this.prtcl = prtcl;
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
