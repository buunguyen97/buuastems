import {NgModule} from '@angular/core';
import {DevExtremeModule} from 'devextreme-angular';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account/account.component';
import { CardComponent } from './card/card.component';
import { PasswordComponent } from './password/password.component';
import { CaruserbookmarkComponent } from './caruserbookmark/caruserbookmark.component';
import { UserbookmarkComponent } from './userbookmark/userbookmark.component';
import { PrepaidcardComponent } from './prepaidcard/prepaidcard.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TransportComponent } from './transport/transport.component';
import { FulltextComponent } from './fulltext/fulltext.component';

@NgModule({
  declarations: [
    AccountComponent,
    CardComponent,
    PasswordComponent,
    CaruserbookmarkComponent,
    UserbookmarkComponent,
    PrepaidcardComponent,
    VehicleComponent,
    TransportComponent,
    FulltextComponent
  ],
  exports: [
      AccountComponent,
      CardComponent,
      PasswordComponent,
      CaruserbookmarkComponent,
      UserbookmarkComponent,
      PrepaidcardComponent,
      VehicleComponent,
      TransportComponent,
      FulltextComponent
  ],
  imports: [
    DevExtremeModule,
    CommonModule
  ]
})
export class PopupModule {
}
