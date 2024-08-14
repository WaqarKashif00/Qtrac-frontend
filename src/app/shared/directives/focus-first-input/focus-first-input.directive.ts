import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[lavi-first-control-focus]',
})
export class SelectFirstInputDirective implements AfterViewInit {

  @Input('lavi-first-control-focus') IsFocusFirstInputRequired: boolean;

  constructor(private ref: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.IsFocusFirstInputRequired) {
      const formChildren = [].slice.call(this.ref.nativeElement.children);
      formChildren.every((child) => {
        const input = this.GetInputElement(child);
        if (input) {
          (input as any).focus();
          input.parentElement.classList.add('k-state-focused');
          return false;
        }
        return true;
      });
    }
  }


  private GetInputElement(nativeElement: HTMLElement): HTMLElement {
    if (!nativeElement || !nativeElement.children) {
      return undefined;
    }
    if (!nativeElement.children.length && !nativeElement.hidden) {
      return nativeElement;
    }
    let input;
    [].slice.call(nativeElement.children).every((c) => {
      input = this.GetInputElement(c);
      if (input) {
        return false;
      }
      return true;
    });
    return input;
  }

}
