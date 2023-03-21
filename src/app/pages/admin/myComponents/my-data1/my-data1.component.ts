import {Component} from '@angular/core';

@Component({
    selector: 'my-data1',
    templateUrl: './my-data1.component.html',
    styleUrls: ['./my-data1.component.scss']
})
export class MyData1Component {
    todayDate: Date = new Date();

}
