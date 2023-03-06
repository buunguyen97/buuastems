import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {TranordComponent} from './tranord/tranord.component';
import {CommonModule} from '@angular/common';
import {TranordmassComponent} from './tranordmass/tranordmass.component';
import {TranordstatusComponent} from './tranordstatus/tranordstatus.component';
import {TranordallocateComponent} from './tranordallocate/tranordallocate.component';
import {TranordaccidentComponent} from './tranordaccident/tranordaccident.component';
import {PopupModule} from '../popup/popup.module';
import { AstemsComponent } from './astems/astems.component';
import { BuuastemsComponent } from './buuastems/buuastems.component';
import { Buuastems1Component } from './buuastems1/buuastems1.component';

@NgModule({
  declarations: [
    TranordComponent,
    TranordmassComponent,
    TranordstatusComponent,
    TranordallocateComponent,
    TranordaccidentComponent,
    AstemsComponent,
    BuuastemsComponent,
    Buuastems1Component
  ],
  imports: [
    DevExtremeModule,
    CommonModule,
    PopupModule
  ]
})
export class AdminModule {
}
