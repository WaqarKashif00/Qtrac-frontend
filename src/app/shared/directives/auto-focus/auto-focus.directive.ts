import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[lavi-auto-focus]'
})
export class AutofocusDirective implements OnChanges {

  @Input() AutoFocusRequired = false;

  constructor(private host: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.AutoFocusRequired) {
      setTimeout(() => {
        this.host.nativeElement.focus();
        this.host.nativeElement?.classList?.remove('ng-invalid');
        this.host.nativeElement?.parentElement?.classList?.remove('k-state-invalid');
      }, (0));
    }
  }

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }
}
