/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : window-ref.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-03-17 11:03:04
 */

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor() {
  }

  get nativeWindow(): ICustomWindow {
    return getWindow();
  }
}

export interface ICustomWindow extends Window {
  __custom_global_stuff: string;
}

function getWindow(): any {
  return window;
}
