import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[skip-keys]' })
export class SkipKeyDirective {

  @Input('skip-keys') SkipKeys:string[];

  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
  this.SkipKeys.forEach((skipKey)=>{
    if(event.key == skipKey){
      event.preventDefault();
    }
  });
  }
}
