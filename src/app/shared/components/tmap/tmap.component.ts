import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tmap',
  templateUrl: './tmap.component.html',
  styleUrls: ['./tmap.component.scss']
})
export class TmapComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    // @ts-ignore
    this.map = new Tmapv2.Map('tmap', {
      // @ts-ignore
      center: new Tmapv2.LatLng(37.14662571373519, 127.5939137276295),
      width: '100%',
      height: '100%',
      zoom: 14,
      zoomControl: true,
      scrollwheel: true
    });
  }
}
