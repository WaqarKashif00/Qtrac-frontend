import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[mousedown-selectable]' })
export class MouseDownSelectableDirective {

  @Input('mousedown-selectable') MouseDownSelectable: true;

  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event'])
  clickEvent(event: any) {
    if (!this.MouseDownSelectable) { return };

    var range = document.createRange();
    range.selectNodeContents(this.el.nativeElement);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
