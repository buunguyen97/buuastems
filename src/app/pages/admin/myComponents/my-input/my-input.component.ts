import {Component, Input} from '@angular/core';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

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
