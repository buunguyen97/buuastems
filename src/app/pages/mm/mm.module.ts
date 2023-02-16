import {DevExtremeModule} from 'devextreme-angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleMapsModule} from '@angular/google-maps';
import {PgmauthorityComponent} from './pgmauthority/pgmauthority.component';
import {MenuComponent} from './menu/menu.component';
import {CodeComponent} from './code/code.component';
import {MessageComponent} from './message/message.component';
import {TermComponent} from './term/term.component';
import {GradeComponent} from './grade/grade.component';
import {OnboardComponent} from './onboard/onboard.component';
import {UserComponent} from './user/user.component';
import {UsermanagementComponent} from './usermanagement/usermanagement.component';
import {CarComponent} from './car/car.component';
import {CompanyComponent} from './company/company.component';
import {PrecardComponent} from './precard/precard.component';
import {TranComponent} from './tran/tran.component';
import {UserprofileComponent} from './userprofile/userprofile.component';
import {PopupModule} from '../popup/popup.module';


@NgModule({
  declarations: [
    PgmauthorityComponent,
    MenuComponent,
    CodeComponent,
    MessageComponent,
    TermComponent,
    GradeComponent,
    OnboardComponent,
    UserComponent,
    UsermanagementComponent,
    CarComponent,
    CompanyComponent,
    PrecardComponent,
    TranComponent,
    UserprofileComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    DevExtremeModule,
    PopupModule
  ]
})
export class MmModule {
}
