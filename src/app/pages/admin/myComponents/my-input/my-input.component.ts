import {Component, Input} from '@angular/core';

@Component({
    selector: 'my-input',
    templateUrl: './my-input.component.html',
    styleUrls: ['./my-input.component.scss']
})
export class MyInputComponent {
    @Input() label = '';
    @Input() type = 'text';
    @Input() name: string = '';
    @Input() value: string = '';

    inputValue: string = '';
}
