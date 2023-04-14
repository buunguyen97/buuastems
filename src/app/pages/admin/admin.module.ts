import {NgModule} from '@angular/core';
import {PercentPipe} from '@angular/common';
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
import {MyData1Component} from './myComponents/my-data1/my-data1.component';
import {TextDirectoryComponent} from './myComponents/text-directory/text-directory.component';
import {Buuastems7Component} from './buuastems7/buuastems7.component';
import {ButtonComponent} from './myComponents/button/button.component';
import {ComboSelectComponent} from './myComponents/combo-select/combo-select.component';
import {Buuastems8Component} from './buuastems8/buuastems8.component';
import {ComboInputComponent} from './myComponents/combo-input/combo-input.component';
import {RadioComponent} from './myComponents/radio/radio.component';
import {Buuastems9Component} from './buuastems9/buuastems9.component';
import {Buuastems10Component} from './buuastems10/buuastems10.component';
import {Buuastems11Component} from './buuastems11/buuastems11.component';
import {Buuastems12Component} from './buuastems12/buuastems12.component';
import {Buuastems13Component} from './buuastems13/buuastems13.component';
import {OnlyNumberDirective} from './only-number.directive';
import {Buuastems14Component} from './buuastems14/buuastems14.component';
import {Buuastems15Component} from './buuastems15/buuastems15.component';
import {RouterModule} from '@angular/router';
import {Buuastems16Component} from './buuastems16/buuastems16.component';
import {Buuastems17Component} from './buuastems17/buuastems17.component';
import {Buuastems18Component} from './buuastems18/buuastems18.component';
import {PhongComponent} from './phong/phong.component';
import {ThienComponent} from './thien/thien.component';
import {Astems21Component} from './astems21/astems21.component';
import {Astems22Component} from './astems22/astems22.component';
import {Astems23Component} from './astems23/astems23.component';
import {DxRadioGroupModule} from 'devextreme-angular';
import { Astems24Component } from './astems24/astems24.component';
import { Astems25Component } from './astems25/astems25.component';

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
        Buuastems11Component,
        Buuastems12Component,
        Buuastems13Component,
        OnlyNumberDirective,
        Buuastems14Component,
        Buuastems15Component,
        Buuastems16Component,
        Buuastems17Component,
        Buuastems18Component,
        PhongComponent,
        ThienComponent,
        Astems21Component,
        Astems22Component,
        Astems23Component,
        Astems24Component,
        Astems25Component
    ],
    imports: [
        DevExtremeModule,
        CommonModule,
        PopupModule,
        FormsModule,
        RouterModule,
        DxRadioGroupModule
    ],
    providers: [
        PercentPipe // import pipe vào provider
    ],
})
export class AdminModule {
}
