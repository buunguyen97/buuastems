import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {CommonModule} from '@angular/common';
import { TranordstatusComponent } from './tranordstatus/tranordstatus.component';

@NgModule({
  declarations: [
    TranordstatusComponent
  ],
  imports: [
    DevExtremeModule,
    CommonModule
  ]
})
export class CarrierModule {
}
