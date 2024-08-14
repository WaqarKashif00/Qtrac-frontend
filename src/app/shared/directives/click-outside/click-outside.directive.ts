import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[lavi-click-outside]',
  host: {
    '(document:click)': 'onClick($event)',
   }
})
export class ClickOutsideDirective {

  @Output('lavi-click-outside')
  clickedOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  onClick(event: Event) {
   if (!this.elementRef.nativeElement.contains(event.target)) {
     this.clickedOutside.emit();
   }
  }

}
