/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : appconstants.ts
 * Author : jbh5310
 * Lastupdate : 2021-10-03 12:46:57
 */

import {environment} from '../../../environments/environment';
import {APPCONSTANTS} from './appconstants';

export class COMMONINITDATA {
  public static TENANT = '1000';
  public static USERTYPE_ADMIN = 'ADMIN';

  public static DEFAULT_COMPOPTS = {
    dxForm: {
      showColonAfterLabel: false,
      minColWidth: 300
    },
    dxButton: {
      icon: 'check',
      type: 'default'
    }
  };

  public static DEFAULT_FORM_OPT = {
    class: 'search-form-box',
    showColonAfterLabel: false,
    minColWidth: 300
  };

  /* http */
  public static DEFAULT_POST_API_ERROR = {
    success: false,
    data: null,
    code: '-999',
    msg: 'Post service api error!'
  };

  public static COMMON_RESPONSE_DATA = {
    success: {code: 0, msg: 'common.msg.success'},
    fail: {code: -1, msg: 'common.msg.fail'},
  };

  public static FLAG_TRUE = 'Y';
  public static FLAG_FALSE = 'N';

  public static TRAN_TRANPOINTTYPE = {
    STARTPOINT: 'S', S: 'startPoint',
    WAYPOINT: 'W',   W: 'wayPoint',
    ENDPOINT: 'E',   E: 'endPoint'
  };

  public static TRAN_ADDRESSTYPE = {
    JIBUNADDRESS: 'J',
    ROADADDRESS: 'R'
  };

  public static TRAN_SIDEFORMTYPE = {
    DELIVERY: 'delivery',
    ITEM: 'item',
    CAR: 'car'
  };

  public static TRAN_MAPDATA = {

    ROUTE: {
      appKey: APPCONSTANTS.T_MAP_API_KEY,
      reqCoordType: 'WGS84GEO',
      resCoordType: 'EPSG3857',
      angle: '172',
      trafficInfo: 'Y',
      truckType: '1',
      truckWidth: '100',
      truckHeight: '100',
      truckWeight: '35000',
      truckTotalWeight: '35000',
      truckLength: '200'
    }
  };

  public static MASTERSERVICE = 'master-service';

  public static DEFAULT_PHONE_MASK = '00000000000';
  public static DEFAULT_TEL_MASK = '00000000000';
  public static PHONE_RULES = { X: /[02-9]/ };
  public static VALIDATOR = 'validator';

  public static BTN_CLASS = 'dx-widget dx-button dx-button-mode-contained dx-button-form dx-button-has-text';
  public static BTN_CLASS_DSA = 'dx-widget dx-button dx-button-mode-contained dx-button-form dx-button-has-text dx-state-disabled';

  public static EXCELHEADER = {
    'admin.tranordmass.tranordgroup': 'tranOrdGroup', // 오더그룹
    'admin.tranordmass.tranpointseq': 'tranPointSeq', // 순번 tranPointSeq
    'admin.tranordmass.trantype': 'tranType',         // 배차유형
    'admin.tranordmass.tranorddate1': 'tranOrdDate1', // 배차일자
    'admin.tranordmass.tranorddate2': 'tranOrdDate2', // 배차일자
    'admin.tranordmass.companynm': 'companyNm', // 회사명
    'admin.tranordmass.address1': 'address1',  // 주소1
    // 'admin.tranordmass.address2': 'address2',  // 주소2 2022-11-04 제외
    'admin.tranordmass.refnm': 'refNm',       // 담당자
    'admin.tranordmass.reftellno': 'refTellNo', // 연락처

    'admin.tranordmass.remarks': 'remarks', // 전달사항
    'admin.tranordmass.tranordcategory': 'tranOrdCategory', // 오더분류
    'admin.tranordmass.trancartype': 'tranCarType', // 차량유형
    'admin.tranordmass.trancarkind': 'tranCarKind', // 차량종류
    'admin.tranordmass.trancarcnt': 'tranCarCnt', // 차량대수
    // 'admin.tranordmass.tranitemoption': 'tranItemOption', // 적재옵션 2022-11-04 제외, 독차만 적용
    'admin.tranordmass.tranitemcategorynm': 'tranItemCategoryNm', // 물품분류명
    'admin.tranordmass.tranitempacktype': 'tranItemPackType', // 물품포장유형
    'admin.tranordmass.tranitemweight': 'tranItemWeight', // 물품중량
    'admin.tranordmass.tranitemheight': 'tranItemHeight', // 물품높이
    'admin.tranordmass.tranitemwidth': 'tranItemWidth', // 물품가로길이
    'admin.tranordmass.tranitemlength': 'tranItemLength', // 물품세로길이
    'admin.tranordmass.tranitemcbm': 'tranItemCbm', // 물품CBM
    'admin.tranordmass.tranitemamt': 'tranItemAmt', // 물품금액
    'admin.tranordmass.tranordcompany': 'tranOrdCompany', // 운송사 companyId
    'admin.tranordmass.transalestype': 'tranSalesType', // 결제방식
    'admin.tranordmass.tranintervaltype': 'tranIntervalType' // 운송구간
  };

  public static IMAGE_URL = 'https://concplay.blob.core.windows.net/allright/';
}
