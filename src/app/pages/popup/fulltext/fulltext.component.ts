import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DxPopupComponent} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';

@Component({
  selector: 'app-fulltext',
  templateUrl: './fulltext.component.html',
  styleUrls: ['./fulltext.component.scss']
})
export class FulltextComponent implements OnInit , AfterViewInit {

  @ViewChild('popup', {static: false}) popup: DxPopupComponent;

  @Output() output = new EventEmitter();

  G_TENANT: string = this.utilService.getTenant();

  input: any;

  constructor(public utilService: CommonUtilService) {
  }

  ngOnInit(): void {
    this.input = {};
  }

  ngAfterViewInit(): void {}

  open(data): void {
    this.input = data;
    this.popup.visible = true;
  }

  registration(): void {
    this.close();
  }

  close(): void {
    this.popup.visible = false;
  }

  onHidden(): void {
    this.input = {};
  }
}
