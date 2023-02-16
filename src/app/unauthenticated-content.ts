/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : unauthenticated-content.ts
 * Author : jbh5310
 * Lastupdate : 2021-02-14 03:21:03
 */

import {CommonModule} from '@angular/common';
import {Component, NgModule} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {SingleCardModule} from 'src/app/layouts';
import {SharedComponentsModule} from './shared/components/sharedComponents.module';

@Component({
  selector: 'app-unauthenticated-content',
  template: `
    <router-outlet></router-outlet>
    <app-global-loader></app-global-loader>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
    }
  `]
})
export class UnauthenticatedContentComponent {

  constructor(private router: Router) {
  }

  get title(): string {
    const path = this.router.url.split('/')[1];
    switch (path) {
      case 'login-form':
        return 'Sign In';
      case 'reset-password':
        return 'Reset Password';
      case 'create-account':
        return 'Sign Up';
      case 'change-password':
        return 'Change Password';
    }
  }

  get description(): string {
    const path = this.router.url.split('/')[1];
    switch (path) {
      case 'reset-password':
        return 'Please enter the email address that you used to register, and we will send you a link to reset your password via Email.';
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SingleCardModule,
    SharedComponentsModule,
  ],
  declarations: [UnauthenticatedContentComponent],
  exports: [UnauthenticatedContentComponent]
})
export class UnauthenticatedContentModule {
}
