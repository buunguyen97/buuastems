import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {TranordComponent} from './tranord/tranord.component';
import {CommonModule} from '@angular/common';
import {TranordmassComponent} from './tranordmass/tranordmass.component';
import {TranordstatusComponent} from './tranordstatus/tranordstatus.component';
import {TranordallocateComponent} from './tranordallocate/tranordallocate.component';
import {TranordaccidentComponent} from './tranordaccident/tranordaccident.component';
import {PopupModule} from '../popup/popup.module';
import {AstemsComponent} from './astems/astems.component';
import {BuuastemsComponent} from './buuastems/buuastems.component';
import {Buuastems1Component} from './buuastems1/buuastems1.component';
import {Buuastems3Component} from './buuastems3/buuastems3.component';
import {Buuastems4Component} from './buuastems4/buuastems4.component';
import {Buuastems5Component} from './buuastems5/buuastems5.component';
import {Buuastems6Component} from './buuastems6/buuastems6.component';
import {MyButtonComponent} from './myComponents/my-button/my-button.component';
import {MyInputComponent} from './myComponents/my-input/my-input.component';
import {MySelectComponent} from './myComponents/my-select/my-select.component';
import {MyDateComponent} from './myComponents/my-date/my-date.component';
import {FormsModule} from "@angular/forms";
import { MyData1Component } from './myComponents/my-data1/my-data1.component';
import { TextDirectoryComponent } from './myComponents/text-directory/text-directory.component';
import { Buuastems7Component } from './buuastems7/buuastems7.component';
import { ButtonComponent } from './myComponents/button/button.component';
import { ComboSelectComponent } from './myComponents/combo-select/combo-select.component';
import { Buuastems8Component } from './buuastems8/buuastems8.component';
import { ComboInputComponent } from './myComponents/combo-input/combo-input.component';
import { RadioComponent } from './myComponents/radio/radio.component';
import { Buuastems9Component } from './buuastems9/buuastems9.component';
import { Buuastems10Component } from './buuastems10/buuastems10.component';
import { Buuastems11Component } from './buuastems11/buuastems11.component';

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
        MyDateComponent,
        MyData1Component,
        TextDirectoryComponent,
        Buuastems7Component,
        ButtonComponent,
        ComboSelectComponent,
        Buuastems8Component,
        ComboInputComponent,
        RadioComponent,
        Buuastems9Component,
        Buuastems10Component,
        Buuastems11Component
    ],
    imports: [
        DevExtremeModule,
        CommonModule,
        PopupModule,
        FormsModule
    ]
})
export class AdminModule {
}
