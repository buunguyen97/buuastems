import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentBehaviorService {

  constructor() {
  }

  // 시스템타입 선택 이벤트
  private changedSystemTypeEvent = new BehaviorSubject<Event | null>(null);
  changedSystemTypeObserverable = this.changedSystemTypeEvent.asObservable();
  changedBookMarkEvent = new BehaviorSubject<Event | null>(null);
  changedBookMarkObserverable = this.changedBookMarkEvent.asObservable();
  // private eventToggle = new BehaviorSubject<Event | null>(null);
  // event = this.eventToggle.asObservable();

  changedSystemType(event: Event): void {
    this.changedSystemTypeEvent.next(event);
  }

  changedBookMark(event: Event): void {
    this.changedBookMarkEvent.next(event);
  }


  // private eventToggle = new BehaviorSubject<Event | null>(null);
  // event = this.eventToggle.asObservable();


  // update(event: Event): void {
  //   this.eventToggle.next(event);
  // }
}
