/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : jtime-zone.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-06-17 17:49:51
 */

import {Injectable} from '@angular/core';
import moment from 'moment-timezone';
import {Moment} from 'moment';

@Injectable({
  providedIn: 'root'
})
export class JTimeZoneService {

  locale = 'Asia/Seoul';

  constructor() {
  }

  use(locale: string): void {
    this.locale = locale;
  }

  currLocale(): string {
    return this.locale;
  }


  getTimeZoneNames(): string[] {
    return moment.tz.names();
  }

  getBrowserTimeZone(): string {
    return moment.tz.guess();;
  }

  getNowUtc(): Moment {
    return moment(moment.now()).utc();
  }

  getNow(): Moment {
    return moment(this.getNowUtc().tz(this.locale));
  }
}
