import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DxButtonComponent, DxSelectBoxComponent, DxLinearGaugeModule} from 'devextreme-angular';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {GridUtilService} from '../../../shared/services/grid-util.service';
import {DxFormComponent} from 'devextreme-angular/ui/form';
@Component({
  selector: 'app-layout6',
  templateUrl: './layout6.component.html',
  styleUrls: ['./layout6.component.scss']
})
export class Layout6Component implements OnInit {

  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChildren(DxButtonComponent) btnCompArr: QueryList<DxButtonComponent>;
  @ViewChild('center') center: DxFormComponent;
  @ViewChild('company', {static: false}) company: DxSelectBoxComponent;

  @ViewChild('gauge', {static: false}) gauge: DxSelectBoxComponent;

  pagePath = this.utilService.getPagePath();

  selectedOpenMode = 'shrink';

  selectedPosition = 'left';

  selectedRevealMode = 'slide';

  content = 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.';


  isDrawerOpen = true;

  test = [{
    state: 1,
    stateText:"운송중",
    progress: 3
  },{
    state: 1,
    stateText:"운송중",
    progress: 4
  },{
    state: 1,
    stateText:"운송중",
    progress: 3
  },{
    state: 2,
    stateText:"배정중",
    progress: 1
  },{
    state: 3,
    stateText:"작성중",
    progress: 0
  }];

  G_TENANT: any;

  
  
  constructor(public utilService: CommonUtilService,
              public gridUtil: GridUtilService) {
  }

  customizeText(arg: any) {
    //arg.valueText = progressbar valu=[0,10,20,40]
    const progressLabel = ['예약완료','기사 매칭 완료','상차지','','하차지'];
    
    let labelIndex = arg.valueText/10 ; 
    return `<tspan>${ progressLabel[labelIndex]}</tspan>`;
  }

  // 화면 생성 된 후 호출
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
 
  }

}
