import {
  AfterContentInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[lavi-fill-height]',
})
export class FillHeightDirective implements AfterContentInit {

  @Input('lavi-fill-height') IsFillHeightRequired: boolean;

  constructor(private el: ElementRef) {}

  ngAfterContentInit(): void {
    if (this.IsFillHeightRequired) {
      this.CalculateAndSetElementHeight();
    }
  }

  @HostListener('window:resize')
  OnResize() {
    if (this.IsFillHeightRequired) {
      this.CalculateAndSetElementHeight();
    }
  }

  private CalculateAndSetElementHeight() {
    this.el.nativeElement.style.overflow = 'auto';
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.GetElementOffsetTop();
    this.el.nativeElement.style.height =
      windowHeight - elementOffsetTop - 25 + 'px';
  }

  private GetElementOffsetTop() {
    return this.el.nativeElement.getBoundingClientRect().top;
  }
}
