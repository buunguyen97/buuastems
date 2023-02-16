/*
 * Copyright (c) 2021 JFLab All rights reserved.
 * File Name : create-account-form.component.ts
 * Author : jbh5310
 * Lastupdate : 2021-02-20 11:22:19
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';


@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit(e) {
    e.preventDefault();
    const { tenant, id, password } = this.formData;
    this.loading = true;

    const result = await this.authService.createAccount(tenant, id, password);
    this.loading = false;

    if (result.isOk) {
      this.router.navigate(['/login-form']);
    } else {
      notify(result.message, 'error', 2000);
    }
  }

  confirmPassword = (e: { value: string }) => {
    return e.value === this.formData.password;
  }
}
