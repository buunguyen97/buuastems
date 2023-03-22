import {Component, Input} from '@angular/core';
import {DxDateBoxModule} from 'devextreme-angular';

@Component({
    selector: 'my-date',
    templateUrl: './my-date.component.html',
    styleUrls: ['./my-date.component.scss']
})
export class MyDateComponent {
    todayDate: Date = new Date();
    lastMonthDate: Date = new Date();
    // @Input() type = "month";
    // @Input() displayFormat = "dd/MM/yyyy";

    constructor() {
        this.lastMonthDate.setMonth(this.lastMonthDate.getMonth() - 1);
    }
}
