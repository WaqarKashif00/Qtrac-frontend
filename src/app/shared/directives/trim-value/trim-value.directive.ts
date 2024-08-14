import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[lavi-trim-value]'
})
export class LaviTrimValueDirective {

  constructor(
    private el: ElementRef,
    private injector: Injector
  ) {
  }

  @HostListener('blur', ['$event.target.value'])
  ApplyTrim(value) {
    const trimmedValue = this.el.nativeElement.value.trim();
    if (value != trimmedValue) {
      this.SetNgControlValue(trimmedValue);
    }
  }

  private SetNgControlValue(trimmedValue: string) {
    let ngControl: NgControl;
    try {
      ngControl = this.injector.get(NgControl);
    } catch (error) { }
    if (ngControl) { ngControl.control.setValue(trimmedValue); }
  }
}
