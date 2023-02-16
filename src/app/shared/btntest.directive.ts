import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appBtntest]'
})
export class BtntestDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter(): void {
    console.log('aaaaaaaaaaa');
    this.changeCss('blue');
  }

  @HostListener('mouseleave') onMouseLeave(): void {  //마우스가 나가면
    this.changeCss(null);
  }

  private changeCss(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.fontWeight = color? 'bold': 'normal';
  }
}
