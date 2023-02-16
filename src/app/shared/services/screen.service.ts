/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : screen.service.ts
 * Author : jbh5310
 * Lastupdate : 2021-09-21 18:01:54
 */

import {Output, Injectable, EventEmitter} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable()
export class ScreenService {
  @Output() changed = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      // .subscribe(() => this.changed.next());
      .subscribe(() => this.changed.next(true));
  }

  private isLargeScreen(): boolean {
    const isLarge = this.breakpointObserver.isMatched(Breakpoints.Large);
    const isXLarge = this.breakpointObserver.isMatched(Breakpoints.XLarge);

    return isLarge || isXLarge;
  }

  public get sizes(): any {
    return {
      'screen-x-small': this.breakpointObserver.isMatched(Breakpoints.XSmall),
      'screen-small': this.breakpointObserver.isMatched(Breakpoints.Small),
      'screen-medium': this.breakpointObserver.isMatched(Breakpoints.Medium),
      'screen-large': this.isLargeScreen(),
    };
  }
}
