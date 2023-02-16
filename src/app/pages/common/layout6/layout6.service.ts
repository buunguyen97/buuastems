import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class PowerInfo {
  name: string;

  primary: number;

  secondary: number[];
}

const powerInfo: PowerInfo[] = [{
  name: '예약완료',
  primary: 8,
  secondary: [7, 3],
}, {
  name: '기사 매칭 완료',
  primary: 7,
  secondary: [7, 5, 1],
}, {
  name: '상차지',
  primary: 5,
  secondary: [1, 3],
}, {
  name: '하차지',
  primary: 3,
  secondary: [1],
}];
export class Layout6Service {

  constructor() { }

  getPowerInfo(): PowerInfo[] {
    return powerInfo;
  }
}
