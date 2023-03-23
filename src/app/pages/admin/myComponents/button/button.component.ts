import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input() text = '';
    @Output() submit: EventEmitter<void> = new EventEmitter<void>();

    onClickSubmit() {
        this.submit.emit();
    }
}
