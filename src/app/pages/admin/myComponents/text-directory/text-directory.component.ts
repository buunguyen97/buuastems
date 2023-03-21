import {Component, Input} from '@angular/core';

@Component({
    selector: 'text-directory',
    templateUrl: './text-directory.component.html',
    styleUrls: ['./text-directory.component.scss']
})
export class TextDirectoryComponent {
    @Input() text = '';
}
