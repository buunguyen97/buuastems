import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'my-button',
    templateUrl: './my-button.component.html',
    styleUrls: ['./my-button.component.scss']
})
export class MyButtonComponent {
    @Input() label = '조회';
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();
    @Output() submit: EventEmitter<void> = new EventEmitter<void>();

    onClickReset() {
        this.reset.emit();
    }

    onClickSubmit() {
        this.submit.emit();
    }
}
