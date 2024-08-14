import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[lavi-match-height]',
})
export class MatchHeightDirective implements AfterViewChecked {
  // class name to match height
  @Input('lavi-match-height') IsMatchHeightRequired: boolean;
  myMatchHeight: any;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked() {
    // call our matchHeight function here later
    if (this.IsMatchHeightRequired) {
      this.MatchHeight(this.el.nativeElement, this.myMatchHeight);
    }
  }

  @HostListener('window:resize')
  OnResize() {
    // call our matchHeight function here later
    if (this.IsMatchHeightRequired) {
      this.MatchHeight(this.el.nativeElement, this.myMatchHeight);
    }
  }

  MatchHeight(parent: HTMLElement, className: string) {
    // match height logic here

    if (!parent) {
      return;
    }
    const children = parent.getElementsByClassName(className);

    if (!children) {
      return;
    }

    // reset all children height
    Array.from(children).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });

    // gather all height
    const itemHeights = Array.from(children).map(
      (x) => x.getBoundingClientRect().height
    );

    // find max height
    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

    // apply max height
    Array.from(children).forEach(
      (x: HTMLElement) => (x.style.height = `${maxHeight}px`)
    );
  }
}
