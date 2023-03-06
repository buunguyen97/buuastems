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
import { Buuastems3Component } from './buuastems3/buuastems3.component';
import { Buuastems4Component } from './buuastems4/buuastems4.component';
import { Buuastems5Component } from './buuastems5/buuastems5.component';
import { Buuastems6Component } from './buuastems6/buuastems6.component';
import { MyButtonComponent } from './myComponents/my-button/my-button.component';
import { MyInputComponent } from './myComponents/my-input/my-input.component';
import { MySelectComponent } from './myComponents/my-select/my-select.component';
import { MyDateComponent } from './myComponents/my-date/my-date.component';

@NgModule({
  declarations: [
    TranordComponent,
    TranordmassComponent,
    TranordstatusComponent,
    TranordallocateComponent,
    TranordaccidentComponent,
    AstemsComponent,
    BuuastemsComponent,
    Buuastems1Component,
    Buuastems3Component,
    Buuastems4Component,
    Buuastems5Component,
    Buuastems6Component,
    MyButtonComponent,
    MyInputComponent,
    MySelectComponent,
    MyDateComponent
  ],
  imports: [
    DevExtremeModule,
    CommonModule,
    PopupModule
  ]
})
export class AdminModule {
}
