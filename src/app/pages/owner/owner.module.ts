import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {TranordComponent} from './tranord/tranord.component';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user/user.component';

@NgModule({
  declarations: [
    TranordComponent,
    UserComponent
  ],
  imports: [
    DevExtremeModule,
    CommonModule
  ]
})
export class AdminModule {
}
