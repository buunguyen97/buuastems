import {Component, Input} from '@angular/core';

@Component({
    selector: 'combo-input',
    templateUrl: './combo-input.component.html',
    styleUrls: ['./combo-input.component.scss']
})
export class ComboInputComponent {
    @Input() label = '';
}
