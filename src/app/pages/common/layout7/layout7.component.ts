import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  DxButtonComponent,
  DxDataGridComponent,
  DxFileUploaderComponent,
  DxMapComponent,
  DxPopupComponent,
  DxTreeListComponent,
  DxVectorMapComponent,
  DxRadioGroupModule,
  DxSelectBoxComponent
} from 'devextreme-angular';
import {DxFormComponent} from 'devextreme-angular/ui/form';
import {CommonUtilService} from '../../../shared/services/common-util.service';
import {CommonCodeService} from '../../../shared/services/common-code.service';
import { Layout5Service } from '../layout5/layout5.service';

@Component({
  selector: 'app-layout7',
  templateUrl: './layout7.component.html',
  styleUrls: ['./layout7.component.scss']
})
export class Layout7Component implements OnInit {
  @ViewChild('bookmarkBtn', {static: false}) bookmarkBtn: DxButtonComponent;
  @ViewChild('mainForm', {static: false}) mainForm: DxFormComponent;
  @ViewChild('modifyBtn', {static: false}) modifyBtn: DxButtonComponent;
  @ViewChild('sMap', {static: false}) sMap: DxMapComponent;
  @ViewChild('bookmarkToggleBtn', {static: false}) bookmarkToggleBtn: DxButtonComponent;
  @ViewChild('addressPopup', {static: false}) addressPopup: DxPopupComponent;
  @ViewChild('transportPopup', {static: false}) transportPopup: DxPopupComponent;
  @ViewChild('addPopup1', {static: false}) addPopup1: DxPopupComponent;
  
  //signup active step
  currentStep:number = 1;
  sideFormVisible = true;
  isBookmakExpanded = false;

  //차량 선택 팝업
  selectedNum: number; 
  transportOptions: any[] =  [{
    ImageSrc: '/assets/images/icon_transport1.png',
    text: '오토바이'
  }, {
    ImageSrc: '/assets/images/icon_transport2.png',
    text: '다마스'
  },{
    ImageSrc: '/assets/images/icon_transport3.png',
    text: '라보'
  },{
    ImageSrc: '/assets/images/icon_transport3.png',
    text: '카고/윙'
  },{
    ImageSrc: '/assets/images/icon_transport1.png',
    text: '카고'
  },{
    ImageSrc: '/assets/images/icon_transport2.png',
    text: '윙바디'
  },{
    ImageSrc: '/assets/images/icon_transport3.png',
    text: '탑'
  },{
    ImageSrc: '/assets/images/icon_transport5.png',
    text: '냉동'
  },{
    ImageSrc: '/assets/images/icon_transport5.png',
    text: '냉장'
  },{
    ImageSrc: '/assets/images/icon_transport4.png',
    text: '트레일러'
  },{
    ImageSrc: '/assets/images/icon_transport5.png',
    text: '컨테이너'
  },{
    ImageSrc: '/assets/images/icon_transport6.png',
    text: '방통차'
  },{
    ImageSrc: '/assets/images/icon_transport3.png',
    text: '사다리차'
  },{
    ImageSrc: '/assets/images/icon_transport7.png',
    text: '지게차'
  }];

  mainFormData = {};
  
  recent: string[] = [];
  constructor(
    public utilService: CommonUtilService,
    private service: Layout5Service
  ) { 

    this.addressPopupClose = this.addressPopupClose.bind(this);
    this.transportPopupClose = this.transportPopupClose.bind(this);
  }
  target; 

  ngOnInit(): void {
    //document.body.addEventListener('click',(e) => console.log(e.target))
    //document.body.addEventListener('mousewheel',(e) => console.log(e.target) )
   
   
  }



  initMap(): void {
    this.sMap.apiKey = {google: 'AIzaSyDI3ChJAmSoajg3HmNQNvIoViojmg7HOTo'};
    // this.sMap.center = '37.482489, 126.878240';
    this.sMap.zoom = 17;
    this.sMap.height = 'calc( 100vh - 75px ) ';
    this.sMap.width = '100%';

    this.sMap.markers = [{
      location: [37.14662571373519, 127.5939137276295],
      // tooltip: {
      //   isShown: true,
      //   text:'test'
      // },
    }];
  }
  ngAfterViewInit(): void {
    this.bookmarkBtn.instance.option('icon', 'star');
    this.bookmarkToggleBtn.instance.option('icon', 'chevrondown');
    this.initMap();
    this.onChangeStep(1);

  }
  onSideFormOpen(): void {
    this.sideFormVisible = true;
  }
  onSideFormClose(): void {
    this.sideFormVisible = false;
  }
  onBookmarkAdjust(): void {

    if (this.isBookmakExpanded ) {
      this.isBookmakExpanded = false ;
      this.bookmarkToggleBtn.instance.option('icon', 'chevrondown');

    } else{
      this.isBookmakExpanded = true ;
      this.bookmarkToggleBtn.instance.option('icon', 'chevronup');
      
    }
  }
  onChangeStep(step): void {
    this.currentStep = step;
  }
  addressPopupOpen():void {
    this.addressPopup.visible = true; 
  }

  addressPopupClose():void {
    this.addressPopup.visible = false; 
  }
  transportPopupOpen():void {
    this.transportPopup.visible = true; 
  }

  transportPopupClose():void {
    this.transportPopup.visible = false; 
  }
  onSelectItem(num): void{
    this.selectedNum = num; 
  }


  //경유지 추가 삭제
  stops: any[] =[];
  stopsNum = 0;

  onAddStop(): void{
    this.stops.push('item');
    this.stopsNum = this.stops.length;
  }
  onRemoveStop(index): void{
    this.stops.splice(index,1);
  }
 

  //step3 카드 간편형 결제
  isActivePanel: string
  onActivePanel(e: { value: string }):void{
    this.isActivePanel = e.value;
  }

  cardOptions: any[] =  [{
    ImageSrc: '/assets/images/card1.png',
  }, {
    ImageSrc: '/assets/images/card2.png',
  }, {
    ImageSrc: '/assets/images/card3.png',
  }, {
    ImageSrc: '/assets/images/card4.png',
  }];
  
  
  addPopupOpen():void {
    this.addPopup1.visible = true; 
  }

  addPopupClose():void {
    this.addPopup1.visible = false; 
  }
   //step3 카드 슬라이드
  onActiveCardNum = 1; 
  
  onPrevCard(index): void{

    if( this.onActiveCardNum == 1 ) return; 
    this.onActiveCardNum = index;

    const nextButton = document.getElementById('cardNextBtn');
    const prevButton = document.getElementById('cardPrevBtn');

    nextButton.classList.remove('disabled');

    this.cardImageActive(this.onActiveCardNum);
    this.cardSlide(174);

    if( this.onActiveCardNum == 1 ) {
      prevButton.classList.add('disabled');
    }
  }
  onNextCard(index): void{
    
    if( this.onActiveCardNum == this.cardOptions.length ) return;
    this.onActiveCardNum = index;

    const nextButton = document.getElementById('cardNextBtn');
    const prevButton = document.getElementById('cardPrevBtn');
    
    prevButton.classList.remove('disabled');

    this.cardImageActive(this.onActiveCardNum);
    this.cardSlide(-174);
    
    if( this.onActiveCardNum == this.cardOptions.length ){
      nextButton.classList.add('disabled')
    }
  }

  cardSlide(witdh):void  {
    const slide = document.getElementById('slideList');
    slide.style.left = (slide.offsetLeft + witdh )+'px';
  }
 
  cardImageActive(index):void {
    const cards = document.querySelectorAll('.card-slide');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('selected');
    }
    cards[index-1].classList.add('selected');
  }

  selectCard(index):void {
    if ( index == this.onActiveCardNum ){
      return ;
    } else if( index > this.onActiveCardNum ){
      this.onNextCard(index)
    }else if( index < this.onActiveCardNum ){
      this.onPrevCard(index)
    }
  }

}
