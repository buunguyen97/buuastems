import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {


  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Backspace' || key === 'Tab' || key === 'Delete' || key === 'ArrowLeft' || key === 'ArrowRight') {
      // Allow these keys to be pressed
      return;
    }
    if (isNaN(+key)) {
      // If the key is not a number, prevent it from being pressed
      event.preventDefault();
    }
  }

}
