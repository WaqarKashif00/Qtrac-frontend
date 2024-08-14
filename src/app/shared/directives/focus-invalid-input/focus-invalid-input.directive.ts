import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[lavi-focus-invalid-Input]',
})
export class FocusInvalidInputDirective {
  @Input('lavi-focus-invalid-Input') IsFocusOnInvalidInputRequired: boolean;

  constructor(private el: ElementRef) {}

  @HostListener('submit')
  OnFormSubmit() {
    if (this.IsFocusOnInvalidInputRequired) {
      let invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
      if (invalidControl) {
        while (
          invalidControl.querySelector('.ng-invalid') !== undefined &&
          invalidControl.querySelector('.ng-invalid') !== null
        ) {
          invalidControl = invalidControl.querySelector('.ng-invalid');
        }
        const panel = invalidControl.closest('.panel-expand'); // for expand panel on invalid control
        if (panel) {
          invalidControl.closest('.panel-expand').click();
        }
        setTimeout(() => {
          invalidControl.focus();
        }, 0);
      }
    }
  }
}
