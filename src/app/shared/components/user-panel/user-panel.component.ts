/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : user-panel.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-06-17 17:49:51
 */

import {Component, NgModule, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DxListModule} from 'devextreme-angular/ui/list';
import {DxContextMenuModule} from 'devextreme-angular/ui/context-menu';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;

  @Input()
  user: { user: string, email: string, avatarUrl: string, name: string };

  constructor() {
  }

  getAvatarUrl(): string {
    if ((this.user === undefined) || (this.user === null)) {
      return '';
    }
    return `width: 100%; height: 100%; background-size: cover; url("${this.user.avatarUrl}") no-repeat #fff`;
  }

  getUserName(): string {

    if ((this.user === undefined) || (this.user === null)) {
      return '';
    }
    return this.user.name;
  }
}
