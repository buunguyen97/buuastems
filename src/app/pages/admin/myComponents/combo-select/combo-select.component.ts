import {Component, Input} from '@angular/core';

@Component({
    selector: 'combo-select',
    templateUrl: './combo-select.component.html',
    styleUrls: ['./combo-select.component.scss']
})
export class ComboSelectComponent {
    @Input() optionsl1 = '데이터가 없습니다.';
    @Input() optionsl2 = '데이터가 없습니다.';
    @Input() optionsl3 = '데이터가 없습니다.';
    @Input() label = 'Select box';
    @Input() colCount: number;
    colCount1: string = "";
    colCount2 = "";

    constructor() {
        if (this.colCount === 2) {
            this.colCount2 = "d-none";
        }
    }

    ngOnInit() {


    }

}
