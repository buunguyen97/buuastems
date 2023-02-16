import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CodeService, CodeVO} from '../../mm/code/code.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {
  DxButtonComponent,
  DxDataGridComponent,
  DxFileUploaderComponent,
  DxLoadPanelComponent
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import {TranOrdMassService} from './tranordmass.service';
import * as XLSX from 'xlsx';
import {COMMONINITDATA} from '../../../shared/constants/commoninitdata';
import {CompanyService} from '../../mm/company/company.service';

@Component({
  selector: 'app-tranordmass',
  templateUrl: './tranordmass.component.html',
  styleUrls: ['./tranordmass.component.scss']
})
export class TranordmassComponent implements OnInit, AfterViewInit {

  constructor(public utilService: CommonUtilService,
              private service: CodeService,
              private codeService: CommonCodeService,
              private tranOrdMassService: TranOrdMassService,
              private companyService: CompanyService,
              public gridUtil: GridUtilService) {
    this.G_TENANT = this.utilService.getTenant();

    this.popupSaveClick = this.popupSaveClick.bind(this);
    this.popupCancelClick = this.popupCancelClick.bind(this);
  }

  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('mainGrid', {static: false}) mainGrid: DxDataGridComponent;
  @ViewChild('popupGrid', {static: false}) popupGrid: DxDataGridComponent;
  @ViewChild('popupForm', {static: false}) popupForm: DxFormComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('fileUploader', {static: false}) fileUploader: DxFileUploaderComponent;
  @ViewChild('loadPanel', {static: false}) loadPanel: DxLoadPanelComponent;

  // Global
  G_TENANT: any;
  pageInfo: any = this.utilService.getPageInfo();


  // ***** main ***** //
  // Form
  mainFormData = {
    fromRcvSchDate: null,
    toRcvSchDate: null
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
  popupDataSource: DataSource;
  popupEntityStore: ArrayStore;
  codeList: CodeVO[];

  // DataSet
  mainData = [];
  mainSearchData = [];
  dsCarType = [];
  dsCarKind = [];
  dsItemOption = [];
  dsOrdCategory = [];
  dsTranSalesType = [];
  dsIntervalType = [];
  dsCompanyList = [];
  dsItemPackType = [];

  // card 더보기 버튼
  cardItems: any[] = [];
  // 더보기 row 갯수
  limitCnt = 3;
  // 마지막 uid
  cardUid = 0;
  isMoreItem = false;

  // 시간 확인
  timeVal: number;
  dateVal: number;

  GRID_STATE_KEY = 'admin_tranordmass';
  saveStateMain = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_main');
  loadStateMain = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_main');
  saveStatePopup = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_popup');
  loadStatePopup = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_popup');
  loadStateTag = this.gridUtil.fnGridLoadState(this.GRID_STATE_KEY + '_tag');
  saveStateTag = this.gridUtil.fnGridSaveState(this.GRID_STATE_KEY + '_tag');

  // 엑셀 모음
  templateDataSource: DataSource;
  templateEntityStore: ArrayStore;

  /**
   * 엑셀 양식의 컬럼값을
   * dataField 값과 매칭시키기 위함.
   * */
  async headerMatch(mapData: {}): Promise<void> {
    for (const sheet of Object.keys(mapData)) {
      for (const row of Object.keys(mapData[sheet])) {
        // 엑셀 row 내 데이터 검증
        for (const key of Object.keys(mapData[sheet][row])) {
          // key값 변환
          for (const matchKey of Object.keys(COMMONINITDATA.EXCELHEADER)) {
            const str = this.utilService.convert(matchKey);
            if (String(key) === String(str)) {
              mapData[sheet][row][COMMONINITDATA.EXCELHEADER[matchKey]] = String(mapData[sheet][row][key]);
              delete mapData[sheet][row][key];
              break;
            }
          }
        }
      }
      break;
    }
  }

  // 운송사, 차주 확인 및 추가
  checkTranOrdCompany(rowData: any): any {
    if (Boolean(String(rowData.tranOrdCompany).trim()) && Boolean(rowData.tranOrdCompany)) {
      Object.assign(rowData, {tranOrdType: 1});
    } else {
      Object.assign(rowData, {tranOrdCompany: '차주'});
      Object.assign(rowData, {tranOrdType: 0});
    }
    return rowData;
  }

  // 경유지 체크
  checkWayPoint(sheetData: Array<any>): any {
    let isWayPointExist = false;
    let ordNum = 1;
    let count = 0;
    let list = [];
    const sheetList = [];

    // tslint:disable-next-line:typedef no-shadowed-variable
    function setListToSheetList(list: any[]) {
      if (count > 2) {
        isWayPointExist = true;
      }
      for (const item of list) {
        item.isWayPointExist = isWayPointExist;
      }
      count = 0;
      isWayPointExist = false;
      return list;
    }

    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];
      if (Number(row.tranOrdGroup) === ordNum) {
        count++;
        list.push(row);
        if (i === sheetData.length - 1) {
          list = setListToSheetList(list);
        }
      } else {
        list = setListToSheetList(list);
        ordNum = Number(row.tranOrdGroup);
      }
      if (count === 0) {
        sheetList.push(...list);
        count = 1;
        list = [];
        list.push(row);
      }
    }
    return sheetList;
  }

  // 첫화면 row 개수 확인
  getCardUid(list: any[]): any {
    const tempList: number[] = [];
    for (const item of list) {
      tempList.push(Number(item.uid));
    }
    this.cardUid = Math.min(...tempList);
  }

  // 더보기 기능
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
      sts: '101', // 대량배차
      fromRcvSchDate: this.mainFormData.fromRcvSchDate,
      toRcvSchDate: this.mainFormData.toRcvSchDate,
      limitCnt: this.limitCnt,
      cardUid: null
    };
    if (Boolean(this.cardUid)) {
      searchVO.cardUid = this.cardUid;
    }
    const searchData = await this.tranOrdMassService.get(searchVO);
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

  // 필수 데이터가 있는지 확인
  async dataValidation(rowData: object): Promise<{}> {
    /** 1. 컬럼에 출력될 필수 데이터 확인
     * 확인 후 데이터가 빠진 row는 valFlg를 false로 준다.
     *     'tranOrdGroup', // 오더그룹
     *     'tranPointSeq', // 순번
     *     'tranType',         // 배차유형
     *     'tranOrdDate1', // 배차일자
     *     tranOrdDate2', // 배차일자
     *     'companyNm', // 회사명
     *     'address1',  // 주소1
     *     address2',  // 주소2 (2022-11-04 제외)
     *     'refNm',       // 담당자
     *     'refTellNo', // 연락처
     */
    let valList = [];
    // 검사 리스트, 순번이 1번이면 전부 검사
    // @ts-ignore
    if (Number(rowData.tranPointSeq) === 1) {
      valList = Object.values(COMMONINITDATA.EXCELHEADER);
      // 1. 운송사, 차주 확인
      rowData = this.checkTranOrdCompany(rowData);
    } else {
      valList = ['tranOrdGroup', 'tranPointSeq', 'tranType', 'tranOrdDate1', 'tranOrdDate2',
        'companyNm', 'address1', 'refNm', 'refTellNo', 'remarks'];
    }

    // 데이터 검사
    let chkValue: any = false;
    let errorKey: any = '';
    for (const matchKey of valList) {
      if (typeof rowData[matchKey] === 'string') {
        rowData[matchKey] = String(rowData[matchKey]).trim();
      }
      chkValue = Boolean(rowData[matchKey]);
      if (!chkValue) {
        errorKey = matchKey;
        break;
      }
    }
    // 검사 결과
    if (chkValue) {
      // @ts-ignore
      rowData.result = this.utilService.convert1('admin.tranordmass.validationsuccess', `검증 성공`);
    } else {
      // @ts-ignore
      rowData.result = `${this.getMessageByValue(errorKey)} ${this.utilService.convert1('admin.tranordmass.validationfail', '검증 실패')}`;
    }
    // @ts-ignore
    rowData.valFlg = Boolean(chkValue);
    return rowData;
  }

  // 경유지 조건체크
  async wayPointValidation(rowData: any): Promise<{}> {
    /**
     * 1. 경유지 존재하는 경우 운송구간은 편도만 입력 가능 (tranIntervalType)
     * 2. 경유지 존재하는 경우 차량대수는 무조건 1대만 요청 가능 함 (tranCarCnt)
     * 3. 경유지 존재하지 않는 경우만 운송구간은 왕복 입력 가능 (tranIntervalType)
     * 시퀀스가 1 인 경우만 검사한다.
     * */
    if (Number(rowData.tranPointSeq) === 1) {
      const condition = rowData.isWayPointExist;
      let errorKey: any = '';
      let chkValue: any = false;
      if (condition) {
        if (rowData.tranIntervalType !== '편도') {
          errorKey = 'tranIntervalType';
        } else if (Number(rowData.tranCarCnt) !== 1) {
          errorKey = 'tranCarCnt';
        }
        chkValue = Boolean(errorKey);
        if (chkValue) {
          rowData.result = `${this.getMessageByValue(errorKey)} ${this.utilService.convert1('admin.tranordmass.validationfail', '검증 실패')}`;
          rowData.valFlg = false;
        }
      }
    }
    return rowData;
  }

  // 데이터 내 시간수정
  async dateTimeValidation(rowData: any): Promise<{}> {
    // 일자형식 확인
    const datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
    const date = String(rowData.tranOrdDate1).trim();
    if (!datePattern.test(date)) {
      rowData.tranOrdDate1 = this.fixDate(rowData.tranOrdDate1);
    }
    // 시간형식 확인
    const timePattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
    const time = String(rowData.tranOrdDate2).trim();
    if (!timePattern.test(time)) {
      rowData.tranOrdDate2 = this.fixTime(rowData.tranOrdDate2);
    }
    Object.assign(rowData, {tranDate: `${rowData.tranOrdDate1}`});
    Object.assign(rowData, {expectedDateTime: `${rowData.tranOrdDate1} ${rowData.tranOrdDate2}`});

    let chkDateValue = false;
    let errorKey = '';
    // 이전일자 체크
    const thisDate = Number(String(rowData.tranOrdDate1).replace(/\D/g, ''));
    // 첫번째 시퀀스는 저장만 함.
    if (Number(rowData.tranPointSeq) === 1) {
      this.dateVal = thisDate;
      chkDateValue = true;
    } else {
      // 두번째 시퀀스부터는 비교
      if (this.dateVal <= thisDate) {
        this.dateVal = thisDate;
        chkDateValue = true;
      } else {
        errorKey = 'tranOrdDate1';
      }
    }
    let chkTimeValue = false;
    if (chkDateValue) {
      // 이전시간 체크
      const thisTime = Number(String(rowData.tranOrdDate2).replace(/\D/g, ''));
      // 첫번째 시퀀스는 저장만 함.
      if (Number(rowData.tranPointSeq) === 1) {
        this.timeVal = thisTime;
        chkTimeValue = true;
      } else {
        // 두번째 시퀀스부터는 비교
        if (this.timeVal < thisTime) {
          this.timeVal = thisTime;
          chkTimeValue = true;
        } else {
          errorKey = 'tranOrdDate2';
        }
      }
    }
    const chkValue = chkDateValue && chkTimeValue;
    // 검사 결과
    if (chkValue) {
      // @ts-ignore
      rowData.result = this.utilService.convert1('admin.tranordmass.validationsuccess', `검증 성공`);
    } else {
      // @ts-ignore
      rowData.result = `${this.getMessageByValue(errorKey)} ${this.utilService.convert1('admin.tranordmass.validationfail', '검증 실패')}`;
    }
    // @ts-ignore
    rowData.valFlg = chkValue;

    return rowData;
  }

  // 데이터 내 주소검증
  async addrValidation(rowData: any): Promise<{}> {
    /**
     * 2. valFlg가 true일 경우
     *  (1) 주소검증 시행
     *  (2) 날짜 수정
     *  */
    if (rowData.valFlg) {
      let theAddr: string;
      // (1) 주소검증 시행
      if (Boolean(rowData.newRoadName)) {
        theAddr = rowData.newRoadName;
      } else {
        theAddr = `${String(rowData.address1).trim()}`;
      }

      let result: any;
      result = await this.tranOrdMassService.addressValidation(theAddr).then(res => result = res).catch(err => result = err);
      rowData.addressValFlg = false;
      if (Boolean(result.error)) {
        rowData.result = `검색된 주소가 없습니다.`;
      } else if (Number(result.totalCount) > 1) {
        rowData.result = `검색된 주소가 너무 많습니다.`;
      } else if (Number(result.totalCount) === 1) {
        const addrInfo = result.coordinate[0];
        rowData.addressValFlg = true;
        // 시/도 | 구/군 | 읍/면 추가
        rowData.ciDo = addrInfo.city_do;
        rowData.guGun = addrInfo.gu_gun;
        rowData.eupMyun = addrInfo.eup_myun;
        rowData.latitude = addrInfo.lat;
        rowData.longitude = addrInfo.lon;

        /*
        * 2022.10.17 주소 재입력
        * */
        const addr1KeyList = ['city_do', 'gu_gun', 'eup_myun', 'legalDong', 'ri', 'bunji'];
        const addr2KeyList = ['buildingName', 'buildingDong'];
        const newRoadNameList = ['newRoadName', 'newBuildingIndex'];
        const addr1 = addr1KeyList.map((item) => {
          if (Boolean(addrInfo[item])) {
            return addrInfo[item];
          }
        });
        const addr2 = addr2KeyList.map((item) => {
          if (Boolean(addrInfo[item])) {
            return addrInfo[item];
          }
        });
        // 검색용 주소(Tmap에서 구주소로 검색시 우편번호가 특정되지 않음.)
        const newRoadName = newRoadNameList.map((item) => {
          if (Boolean(addrInfo[item])) {
            return addrInfo[item];
          }
        });
        rowData.address1 = String(addr1.join(' ')).replace(/\s+/g, ' ').trim();
        rowData.address2 = String(addr2.join(' ')).replace(/\s+/g, ' ').trim();
        rowData.newRoadName = String(newRoadName.join(' ')).replace(/\s+/g, ' ').trim();
      }
    }
    return rowData;
  }

  // 데이터 검증
  async validationRule(rowData: any): Promise<{}> {
    // 필수 작성항목 체크 valFlg
    rowData = await this.dataValidation(rowData);
    if (!rowData.valFlg) {
      return rowData;
    }
    // 경유지가 있는경우 조건 체크 valFlg
    rowData = await this.wayPointValidation(rowData);
    if (!rowData.valFlg) {
      return rowData;
    }
    // 일자가 날짜 형식인지 확인 valFlg
    rowData = await this.dateTimeValidation(rowData);
    if (!rowData.valFlg) {
      return rowData;
    }
    // 주소 체크 addressValFlg
    rowData = await this.addrValidation(rowData);
    if (!rowData.addressValFlg) {
      return rowData;
    }
    return rowData;
  }

  // 엑셀 검증
  async excelDataValidation(mapData: object): Promise<any> {
    /**
     * 엑셀에서 불러온 각 ROW(행)의 데이터 및 실제주소 검증
     * */
    let num = 1;
    const sheetName = 'Sheet1';
    for (const sheet of Object.keys(mapData)) {
      if (sheet !== sheetName) {
        break;
      }
      let sheetData = mapData[sheet]; // array
      // 경유지 체크
      sheetData = this.checkWayPoint(sheetData);
      for (const row of Object.keys(sheetData)) {
        // 데이터 키값 생성
        let rowData = sheetData[row];
        rowData.rowNum = num;
        num++;
        // rowData 검증
        rowData = await this.validationRule(rowData);
      }
    }
    /**
     * 각 검증 이후 valFlg 및 addrFlg가 모두 true인 경우만
     * (1) 순번 1에서 뒷 데이터들을 전부 복사한다.
     * (2) 이떄 valFlg, addressValFlg 제외 후 복사
     * */
      // 순번 1번 저장용 obj
    let cloneObj = {
        valFlg: undefined,
        addressValFlg: false
      };
    for (const sheet of Object.keys(mapData)) {
      if (sheet !== sheetName) {
        break;
      }
      for (const row of Object.keys(mapData[sheet])) {
        const rowData = mapData[sheet][row];
        if (rowData.valFlg && rowData.addressValFlg && Number(rowData.tranPointSeq) === 1) {
          cloneObj = Object.assign(rowData);
        }
        if (cloneObj.valFlg && cloneObj.addressValFlg) {
          for (const cloneKey of Object.keys(cloneObj)) {
            if (String(cloneKey) !== 'tranOrdGroup' && String(cloneKey) !== 'tranPointSeq' &&
              String(cloneKey) !== 'tranType' && String(cloneKey) !== 'tranOrdDate1' &&
              String(cloneKey) !== 'tranOrdDate2' && String(cloneKey) !== 'companyNm' &&
              String(cloneKey) !== 'address1' && String(cloneKey) !== 'address2' &&
              String(cloneKey) !== 'refNm' && String(cloneKey) !== 'refTellNo' && String(cloneKey) !== 'remarks' &&
              String(cloneKey) !== 'valFlg' && String(cloneKey) !== 'addressValFlg') {
              if (!Boolean(rowData[cloneKey])) {
                Object.assign(rowData, {[cloneKey]: cloneObj[cloneKey]});
              }
            }
          }
        }
      }
    }
    return mapData;
  }

  getMessageByValue(value: string): string {
    return this.utilService.convert(this.getKeyByValue(value));
  }

  // Object에서 value로 key값 찾기
  getKeyByValue(value: string): string {
    const obj = COMMONINITDATA.EXCELHEADER;
    return Object.keys(obj).find(key => obj[key] === value);
  }

  // 시간이 소수점으로 나오는 경우 정상적인 시간으로 변경
  fixTime(time: any): string {
    let hour: any = Number(time) * 24;
    let min: any = 0;

    if (hour % 1 > 0) {
      min = Math.round(hour % 1 * 60);
    }
    if (min < 10) {
      min = `0${min}`;
    }
    hour = Math.floor(hour);
    if (hour < 10) {
      hour = `0${hour}`;
    }
    return `${hour}:${min}`;
  }

  // 날짜가 1900년부터 카운팅된 형식으로 나오는 경우 변경
  fixDate(date: any): string {
    const daysBeforeUnixEpoch = 70 * 365 + 19;
    const hour = 60 * 60 * 1000;
    const newDate = new Date(Math.round((date - daysBeforeUnixEpoch) * 24 * hour) + 12 * hour);

    return this.utilService.formatDate(newDate);
  }

  addComma(num: string): string {
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  async onTemplateFileUploader(fileUploader: DxFileUploaderComponent): Promise<void> {
    /*
          1. 팝업에서 파일첨부
          2. 파일 적용 클릭
          3. 앞단에서 주소 검증(TMAP) : 주소가 1개만 나와야한다. 이외에는 에러처리한다.
          4. row중 주소검증이 하나라도 실패할 경우 저장할 수 없도록 flg를 flase 처리한다.
          5. 전부 검증이 성공한 경우 저장버튼 클릭시 앞화면에 갈 수 있도록 한다.
          this.templateDataSource.items() + 검증flg
    */
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = fileUploader.value[0];
    if (!file) {
      return;
    }

    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      const mapData = JSON.parse(dataString);
      // 다국어 헤더명 DB 컬럼명과 매칭
      // this.headerMatch(mapData);
      this.headerMatch(mapData).then(() => this.excelDataValidation(mapData));

      this.templateEntityStore = new ArrayStore(
        {
          data: mapData.Sheet1,
          key: 'rowNum'
        }
      );

      this.templateDataSource = new DataSource({
        store: this.templateEntityStore
      });
    };

    reader.readAsBinaryString(file);

  }

  onResetFileUploader(fileUploader: DxFileUploaderComponent): void {
    this.templateEntityStore.clear();
    this.templateDataSource.reload();
    fileUploader.instance.reset();
    this.templateEntityStore = new ArrayStore(
      {data: [], key: 'rowNum'});
    this.templateDataSource = new DataSource({
      store: this.templateEntityStore
    });
  }

  onToolbarPreparingWithExtra(e): void {
    const toolbarItems = e.toolbarOptions.items;
    const newToolbarItems = [];

    newToolbarItems.push(toolbarItems.find(item => item.name === 'searchPanel'));
    newToolbarItems.push(toolbarItems.find(item => item.name === 'exportButton'));
    newToolbarItems.push(toolbarItems.find(item => item.name === 'columnChooserButton'));

    newToolbarItems.push({  // 엑셀다운로드
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'check',
        text: this.utilService.convert1('admin.tranordmass.templatedown', '양식다운로드'),
        onClick: this.downloadExcel.bind(this)
      }
    });

    e.toolbarOptions.items = newToolbarItems;
  }

  async downloadExcel(): Promise<void> {
    this.tranOrdMassService.downloadTemplateExcel();
  }

  // 신규버튼 이벤트
  async onNew(e): Promise<void> {
    // this.onResetFileUploader(fileUploader);
    this.showPopup('Add', {...e.data});
  }

  async showPopup(popupMode, data): Promise<void> {

    this.templateEntityStore = new ArrayStore(
      {data: [], key: 'rowNum'});
    this.templateDataSource = new DataSource({
      store: this.templateEntityStore
    });
    this.fileUploader.instance.reset();

    this.popupFormData = data;
    this.popupFormData = {tenant: this.G_TENANT, ...this.popupFormData};
    this.popupMode = popupMode;
    this.popupVisible = true;
  }

  popupShown(e): void {

    this.popupForm.instance.focus();
    /*
        this.templateEntityStore = new ArrayStore(
          {data: [], key: 'rowNum'});
        this.templateDataSource = new DataSource({
          store: this.templateEntityStore
        });
        this.fileUploader.instance.reset();*/
  }

  // 초기화 이벤트
  async onReset(): Promise<void> {
    await this.mainForm.instance.resetValues();
    await this.initForm();
    // 화면에 데이터가 출력되었는지 확인
    if (this.mainData.length > 0) {
      this.mainData = [];
    }
  }
  // 데이터 코드화
  async encodingData(data: any): Promise<any> {
    const theDateTime = String(`${data.expectedDateTime}:00`).trim();
    data.expectedDateTime = theDateTime;
    // 차량 타입
    for (const type of this.dsCarType) {
      if (data.tranCarType === type.codeName) {
        data.tranCarType = type.code;
      }
    }
    // 차량 종류
    for (const type of this.dsCarKind) {
      if (data.tranCarKind === type.codeName) {
        data.tranCarKind = type.code;
        data.codeCategoryId = type.codeCategoryId;
        data.codeId = type.codeId;
      }
    }
    // 물품적재옵션
    for (const type of this.dsItemOption) {
      if (data.tranItemOption === type.codeName) {
        data.tranItemOption = type.code;
      }
    }
    // 배차오더분류
    for (const type of this.dsOrdCategory) {
      if (data.tranOrdCategory === type.codeName) {
        data.tranOrdCategory = type.code;
      }
    }
    // 결제방식
    for (const type of this.dsTranSalesType) {
      if (data.tranSalesType === type.codeName) {
        data.tranSalesType = type.code;
      }
    }
    // 운송구간
    for (const type of this.dsIntervalType) {
      if (data.tranIntervalType === type.codeName) {
        data.tranIntervalType = type.code;
      }
    }
    // 운송사
    for (const type of this.dsCompanyList) {
      if (data.tranOrdCompany === type.name) {
        data.companyId = type.uid;
      }
    }
    for (const key of Object.keys(data)) {
      if (String(data[key]).includes(',')) {
        data[key] = Number(String(data[key]).replace(/,/g, ''));
      }
    }
    return data;
  }

  beforePrint(data: any): any {
    /**
     * 메인 화면에서 사용할 OBJECT를 재생성한다.
     * 상차지,경유지,하차지별로 나눈다.
     * */
    let sumData = {
      upData: {},
      downData: {},
      viaNum: 0
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
      // 배차오더분류
      for (const type of this.dsOrdCategory) {
        if (item.tranOrdCategory === type.code) {
          item.tranOrdCategory = type.codeName;
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
      const theAddr = `${String(item.address1).trim()}`;/*${String(item.address2).trim()}*/
      Object.assign(item, {addrFull: theAddr});
      // 세자리 콤마 tranItemCbm tranItemWeight tranItemAmt tranCarCnt
      item.tranCarCnt = this.addComma(String(item.tranCarCnt));
      item.tranItemCbm = this.addComma(String(item.tranItemCbm));
      item.tranItemWeight = this.addComma(String(item.tranItemWeight));
      item.tranItemAmt = this.addComma(String(item.tranItemAmt));
      item.tranTotAmt = this.addComma(String(item.tranTotAmt));

      if (item.tranPointType === 'S') {
        item.trantype = '상차';
        sumData.upData = item;
        // 일자, 시간 분리
        item.tranOrdTime = String(item.expectedDateTime).substring(String(item.tranData).length + 1, item.expectedDateTime.length - 3);

      } else if (item.tranPointType === 'W') {
        sumData.viaNum++;
      } else if (item.tranPointType === 'E') {
        item.trantype = '하차';
        sumData.downData = item;
      }
      // 초기화
      if (Object.keys(sumData.upData).length > 0 && Object.keys(sumData.downData).length > 0) {
        arrData.push(sumData);
        sumData = {
          upData: {},
          downData: {},
          viaNum: 0
        };
      }
    }
    return arrData;
  }

  // 저장버튼 이벤트
  async popupSaveClick(e): Promise<void> {
    /*
    1. 팝업에서 파일첨부
    2. 파일 적용 클릭
    3. 앞단에서 주소 검증(TMAP) : 주소가 1개만 나와야한다. 이외에는 에러처리한다.
    4. row중 주소검증이 하나라도 실패할 경우 저장할 수 없도록 flg를 flase 처리한다.
    5. 전부 검증이 성공한 경우 저장버튼 클릭시 앞화면에 갈 수 있도록 한다.
    this.templateDataSource.items() + 검증flg
    */
    if (!this.utilService.isAdminUser()) {
      await this.tranOrdMassService.confirm(this.utilService.convert1('admin.tranordmass.addrvalidationfail', '관리자만 저장 가능합니다.'));
    }
    let rowData = this.templateDataSource.items();
    // 주소 및 데이터 검증
    let isAddrVale = true;
    let isVal = true;

    for (const item of rowData) {
      // 데이터 검증 실패
      if (!item.valFlg) {
        isVal = item.valFlg;
        await this.tranOrdMassService.confirm(this.utilService.convert1('admin.tranordmass.datavalidationfail', '데이터 검증 실패'));
        break;
      }
      // 주소 검증 실패
      else if (!item.addressValFlg) {
        isAddrVale = item.addressValFlg;
        await this.tranOrdMassService.confirm(this.utilService.convert1('admin.tranordmass.addrvalidationfail', '주소 검증 실패'));
        break;
      }

    }
    if (isAddrVale && isVal) {
      if (
        !await this.utilService.confirm(this.utilService.convert('com.confirm.save', '배차정보'))) {
        return;
      }

      for (let row of rowData) {
        row = this.encodingData(row);
      }
      /**
       * estimatedTime : 예상소요시간
       * estimatedDistance : 예상소요거리
       * tollFare : 톨게이트 요금
       * */
      this.loadPanel.visible = true;
      rowData = await this.setEstimateData(rowData);
      this.loadPanel.visible = false;

      const result = await this.tranOrdMassService.save(rowData);
      this.popupVisible = false;
      this.resultMsgCallback(result, 'Adjust');
      await this.onSearch();
    }
  }

  async setEstimateData(rowData: any): Promise<any> {
    let reqCar: number;
    const resultList = [];
    let routObj: any = {};

    for (const item of rowData) {
      routObj.pass = [];
      if (item.tranType === '상차') {
        routObj.startX = item.longitude;
        routObj.startY = item.latitude;
      } else if (item.tranType === '경유') {
        routObj.pass.push(`${item.longitude},${item.latitude}`);
      } else if (item.tranType === '하차') {
        routObj.endX = item.longitude;
        routObj.endY = item.latitude;
        reqCar = Number(item.tranCarKind);
      }
      if (Boolean(routObj.startX) && Boolean(routObj.endX)) {
        routObj.passList = routObj.pass.join('_');
        // 화물 API 사용시 아래 변수 선언
        for (const car of this.dsCarKind) {
          if (reqCar === Number(car.code)) {
            routObj.truckWidth = Number(car.etcColumn2) / 10;
            routObj.truckHeight = Number(car.etcColumn3) / 10;
            routObj.truckLength = Number(car.etcColumn1) / 10;
            routObj.truckWeight = Number(car.etcColumn4) * 1000;
            routObj.truckTotalWeight = Number(car.etcColumn4) * 1000;

            const prtcl = await this.tranOrdMassService.getAddrDataByCoordinate(routObj);
            if (prtcl.hasOwnProperty('features')) {
              const result: any = {};
              result.tranOrdGroup = item.tranOrdGroup;
              result.estimatedDistance = prtcl.features[0].properties.totalDistance;
              result.estimatedTime = prtcl.features[0].properties.totalTime;
              result.tollFare = prtcl.features[0].properties.totalFare;
              // 왕복일 경우 위 데이터들을 x2를 해준다.
              if (Number(item.tranIntervalType) === 1){
                result.estimatedDistance = Number(result.estimatedDistance) * 2;
                result.estimatedTime = Number(result.estimatedTime) * 2;
                result.tollFare = Number(result.tollFare) * 2;
              }
              resultList.push(result);
            }
            routObj = {};
            break;
          }
        }
      }
    }
    for (const item of rowData) {
      if (item.tranType === '상차') {
        for (const est of resultList) {
          if (est.tranOrdGroup === item.tranOrdGroup) {
            item.estimatedDistance = est.estimatedDistance;
            item.estimatedTime = est.estimatedTime / 60;
            item.tollFare = est.tollFare;
          }
        }
      }
    }
    return rowData;
  }

  async onSearch(): Promise<any> {
    try {
      this.mainData = await this.setSearchData();
      this.utilService.notify_success('search success');
    } catch {
      this.utilService.notify_error('search error');
    }
  }

  async popupReCheck(e): Promise<void> {

    const mapData = {
      Sheet1: this.templateDataSource.items()
    };
    const changedDataSource = await this.excelDataValidation(mapData);

    this.templateEntityStore = new ArrayStore(
      {data: changedDataSource.Sheet1, key: 'rowNum'});
    // this.popupGrid.instance.option('dataSource', changedDataSource);
    // await this.templateDataSource.reload();
  }

  // 메인화면에서 등록버튼 클릭
  async onMainRegist(e): Promise<void> {

    try {
      // const registData = await this.onSearch();
      let registData: any[];
      registData = this.mainData;
      if (registData.length > 0) {
        if (
          !await this.utilService.confirm(this.utilService.convert('com.confirm.execute', '배차정보 등록'))) {
          return;
        }
        // uid만 송신
        const list = [];
        for (const item of registData) {
          const obj = {uid: null};
          obj.uid = item.upData.uid;
          list.push(obj);
        }
        await this.tranOrdMassService.regist(list);

        this.utilService.notify_success('regist success');
      } else {
        await this.tranOrdMassService.confirm(this.utilService.convert1('admin.tranordmass.registempty', '등록할 배차정보가 없습니다.'));
      }

    } catch {
      this.utilService.notify_error('regist error');

    }
    await this.onSearch();
  }

  // 메인화면에서 등록버튼 클릭 -> 보류
  async onMainDelete(uid): Promise<void> {

    try {
      if (
        !await this.utilService.confirm(this.utilService.convert('com.confirm.delete', '배차정보'))) {
        return;
      }
      const result = await this.tranOrdMassService.delete(uid);
      if (!result.success) {
        this.utilService.notify_error(result.msg);
        return;
      } else {
        this.utilService.notify_success('Delete success');
        this.popupForm.instance.resetValues();
        this.popupVisible = false;
        await this.onSearch();
      }
    } catch {
      this.utilService.notify_error('There was an error!');
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

// 닫기클릭 이벤트
  popupCancelClick(e): void {
    this.popupVisible = false;
    this.popupForm.instance.resetValues();
  }

  setFocusRow(index, grid): void {
    grid.focusedRowIndex = index;
  }

  // 그리드 셀 이동시 호출하는 함수
  onFocusedCellChanging(e, grid): void {
    this.setFocusRow(e.rowIndex, grid);
  }

  // 파일명 생성
  creatFileName(menuName: string): string {
    const today: Date = new Date();
    let thisMonth: any = today.getMonth() + 1;
    let thisDay: any = today.getDate();
    let thisHour: any = today.getHours();
    let thisMin: any = today.getMinutes();
    if (Number(thisMonth) < 10) {
      thisMonth = `0${thisMonth}`;
    }
    if (Number(thisDay) < 10) {
      thisDay = `0${thisDay}`;
    }
    if (Number(thisHour) < 10) {
      thisHour = `0${thisHour}`;
    }
    if (Number(thisMin) < 10) {
      thisMin = `0${thisMin}`;
    }
    return `${menuName}_${today.getFullYear()}${thisMonth}${thisDay}${thisHour}${thisMin}`;
  }

  // 주소 및 데이터가 검증되지 않은 row는 빨갛게 색칠한다.
  onCellPrepared(e): string {
    if (e.rowType === 'header') {
      return;
    }
    if (!e.data.valFlg || !e.data.addressValFlg) {
      e.cellElement.style.color = 'red';
    }
    if (e.data.valFlg && e.data.addressValFlg) {
      e.cellElement.style.color = 'black';
    }
  }

  ngOnInit(): void {
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
    this.initCode();
  }

  ngAfterViewInit(): void {

    const rangeDate = this.utilService.getDateRange();
    this.mainForm.instance.getEditor('fromRcvSchDate').option('value', rangeDate.fromDate);
    this.mainForm.instance.getEditor('toRcvSchDate').option('value', rangeDate.toDate);
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then(() => this.onSearch());
    // this.onSearch().then();
  }

  initCode(): void {
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
    // 물품분류옵션
    this.codeService.getCode(this.G_TENANT, 'TRANORDCATEGORY').subscribe(result => {
      this.dsOrdCategory = result.data;
    });
    // 포장방법
    this.codeService.getCode(this.G_TENANT, 'TRANITEMPACKTYPE').subscribe(result => {
      this.dsItemPackType = result.data;
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
}
