/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : common-code.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-03-17 11:03:04
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {JHttpService} from './jhttp.service';
import {APPCONSTANTS} from '../constants/appconstants';
import {ApiResult} from '../vo/api-result';
import {CommonUtilService} from './common-util.service';

@Injectable({
  providedIn: 'root'
})
export class BizCodeService {

  constructor(private http: JHttpService,
              private commonUtil: CommonUtilService) {
  }

  // changes -> savedata 변환
  collectGridData(changes: any, g, g_tenant): any[] {
    const gridList = [];
    const grid = g.instance.getVisibleRows();

    for (const rowIndex in changes) {
      // Insert일 경우 UUID가 들어가 있기 때문에 Null로 매핑한다.
      if (changes[rowIndex].type === 'insert') {
        gridList.push(Object.assign({
          operType: changes[rowIndex].type,
          uid: null,
          tenant: g_tenant
        }, changes[rowIndex].data));
      } else if (changes[rowIndex].type === 'remove') {
        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data)
        );
      } else {

        var rowItem = grid.find(function (el) {
          if (el.key === changes[rowIndex].key) {
            return true;
          }
        });

        gridList.push(
          Object.assign(
            {operType: changes[rowIndex].type, uid: changes[rowIndex].key}, changes[rowIndex].data, rowItem.data
          )
        );
      }
    }
    return gridList;
  }

  // 특정 컬럼에 중복된 값이 있는지 체크
  getIndexWhenDup(g, colName) {

    var gridRows = g.instance.getVisibleRows();

    var gridDatas = [];
    for (const d of gridRows) {
      gridDatas.push(d.data);
    }

    var unique = new Set();
    var ix = -1;
    var dup = gridDatas.some(function (o, i) {
      var b = unique.size === unique.add(o[colName]).size;
      if (b) ix = i;
      return b;
    });
    return ix;
  }

  // 일자 조회
  getDay(pDay, pOprt): string {
    const d = new Date();
    const year = d.getFullYear(); // 년
    const month = d.getMonth();   // 월
    const day = d.getDate();      // 일

    const today = new Date(year, month, pOprt == '+' ? day + pDay : day - pDay);
    const seperator = '-';
    const yyyy = today.getFullYear();
    const MM = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    return yyyy + seperator + MM + seperator + dd;
  }
}

export interface LookupItemVO {
  tenant: string;
  uid: number;
  warehouse: string;
  logisticsId: number;
  name: string;
  display: string;
}

export interface LookupExptVO {
  tenant: string;
  uid: number;
  warehouse: string;
  logisticsId: number;
  name: string;
  display: string;
}

export interface LookupImptVO {
  tenant: string;
  uid: number;
  warehouse: string;
  logisticsId: number;
  name: string;
  display: string;
}

export interface LookupPtrnVO {
  tenant: string;
  uid: number;
  warehouse: string;
  logisticsId: number;
  name: string;
  display: string;
}


export interface InftVO {
}

export interface paramVO {
}
