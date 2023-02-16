import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {DxButtonComponent, DxLoadPanelComponent} from 'devextreme-angular';
import {Router} from '@angular/router';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import {TranordstatusService} from '../../admin/tranordstatus/tranordstatus.service';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';

@Component({
  selector: 'app-tranordstatus',
  templateUrl: './tranordstatus.component.html',
  styleUrls: ['./tranordstatus.component.scss']
})
export class TranordstatusComponent implements OnInit, AfterViewInit {
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;

  @ViewChild('loadPanel', {static: false}) loadPanel: DxLoadPanelComponent;

  G_TENANT: any = this.utilService.getTenant();
  pageInfo: any = this.utilService.getPageInfo();

  tranOrdList = [];

  isNewPopup = true;

  constructor(private router: Router,
              private codeService: CommonCodeService,
              private service: TranordstatusService,
              public utilService: CommonUtilService,
              public gridUtil: GridUtilService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.utilService.getShowBookMark(
      {tenant: this.G_TENANT, userId: this.utilService.getUserUid(), menuL2Id: this.pageInfo.menuL2Id}, this.bookmarkBtn
    ).then();
  }

  async onSearch(): Promise<void> {
    this.loadPanel.visible = true;
    const result = await this.service.sendPost(this.mainForm.formData, 'findTranOrdStatus');

    if (this.utilService.resultMsgCallback(result, 'search')) {
      this.tranOrdList = result.data;
    }
    this.loadPanel.visible = false;
  }

  onClickTranOrdKey(data): void {
    this.router.navigate(['mm/menu']).then();
  }
}
