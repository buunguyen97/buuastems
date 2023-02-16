/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : single-card.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-02-14 03:21:03
 */

import {Component, NgModule, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxScrollViewModule} from 'devextreme-angular/ui/scroll-view';

@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent {
  @Input()
  title: string;

  @Input()
  description: string;

  constructor() {
  }
}

@NgModule({
  imports: [CommonModule, DxScrollViewModule],
  exports: [SingleCardComponent],
  declarations: [SingleCardComponent]
})
export class SingleCardModule {

}
