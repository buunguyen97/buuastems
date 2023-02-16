/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : app-info.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 16:08:12
 */

import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title(): string {
    return 'ALPORTER';
  }

  public get currentYear(): number {
    return new Date().getFullYear();
  }
}
