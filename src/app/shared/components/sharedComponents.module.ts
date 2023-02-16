import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {CommonModule} from '@angular/common';
import {ChangePasswordFormComponent} from './change-password-form/change-password-form.component';
import {CreateAccountFormComponent} from './create-account-form/create-account-form.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {ResetPasswordFormComponent} from './reset-password-form/reset-password-form.component';
import {SideNavigationMenuComponent} from './side-navigation-menu/side-navigation-menu.component';
import {UserPanelComponent} from './user-panel/user-panel.component';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { TmapComponent } from './tmap/tmap.component';

@NgModule({
  declarations: [
    ChangePasswordFormComponent,
    CreateAccountFormComponent,
    FooterComponent,
    HeaderComponent,
    LoginFormComponent,
    ResetPasswordFormComponent,
    SideNavigationMenuComponent,
    UserPanelComponent,
    GlobalLoaderComponent,
    TmapComponent
  ],
  exports: [
    HeaderComponent,
    SideNavigationMenuComponent,
    GlobalLoaderComponent
  ],
  imports: [
    CommonModule,
    DevExtremeModule
  ]
})
export class SharedComponentsModule {
}
