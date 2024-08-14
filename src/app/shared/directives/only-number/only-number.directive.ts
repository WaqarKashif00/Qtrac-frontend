import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[lavi-app-numbers-only]'
})
export class NumberDirective {

  constructor(
    private el: ElementRef,
    private injector: Injector,
  ) {}

  @HostListener('input', ['$event']) OnInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const replacedValue = initialValue.replace(/[^0-9]*/g, '');
    this.el.nativeElement.value = replacedValue;
    this.SetNgControlValue(replacedValue);
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  private SetNgControlValue(replacedValue: string) {
    let ngControl: NgControl;
    try {
      ngControl = this.injector.get(NgControl);
    } catch (error) { }
    if (ngControl) { ngControl.control.setValue(replacedValue); }
  }
}
