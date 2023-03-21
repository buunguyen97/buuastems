import {Component, Input} from '@angular/core';

@Component({
    selector: 'my-select',
    templateUrl: './my-select.component.html',
    styleUrls: ['./my-select.component.scss']
})
export class MySelectComponent {
    @Input() optionsl = '데이터가 없습니다.';
    @Input() label = '';
}
