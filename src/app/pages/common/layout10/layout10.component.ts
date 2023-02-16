import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-layout10',
  templateUrl: './layout10.component.html',
  styleUrls: ['./layout10.component.scss']
})
export class Layout10Component implements OnInit {
/*calendar*/
now: Date = new Date();

currentValue: Date = new Date();

firstDay = 0;

minDateValue: Date | null = null;

maxDateValue: Date | null = null;

disabledDates: Function | null = null;

zoomLevels: string[] = [
  'month', 'year', 'decade', 'century',
];

cellTemplate = 'cell';

holydays: any = [[1, 0], [4, 6], [25, 11]];

isWeekend(date) {
  const day = date.getDay();

  return day === 0 || day === 6;
}



/*bar chart*/

dataSource: any = [{
  day: 'Monday',
  '운송비': 3,
}, {
  day: 'Tuesday',
  '운송비': 2,
}, {
  day: 'Wednesday',
  '운송비': 3,
}, {
  day: 'Thursday',
  '운송비': 4,
}, {
  day: 'Friday',
  '운송비': 6,
}, {
  day: 'Saturday',
  '운송비': 11,
}, {
  day: 'Sunday',
  '운송비': 4,
}];

/*도넛 차트*/
donutSource: any = [{
  country: '수도권',
  medals: 110,
}, {
  country: '경상권',
  medals: 100,
}, {
  country: '충청권',
  medals: 100,
}, {
  country: '전라권',
  medals: 72,
}, {
  country: '강원역',
  medals: 47,
}];
pointClickHandler(arg) {
  arg.target.select();
}

/*line chart*/
lineSource: any = [
  { day: '2', val: 1382500000 },
  { day: '3', val: 1314300000 },
  { day: '4', val: 324789000 },
  { day: '5', val: 261600000 },
  { day: '6', val: 207332000 },
  { day: '7', val: 196865000 },
  { day: '8', val: 188500000 },
  { day: '9', val: 162240000 },
  { day: '10', val: 146400000 },
  { day: '11', val: 126760000 },
  { day: '12', val: 122273000 },
  { day: '13', val: 104345000 },
  { day: '14', val: 103906000 },
  { day: '15', val: 92847800 },
];
constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}

// platformBrowserDynamic().bootstrapModule(AppModule)
// .catch(err => console.log(err));
