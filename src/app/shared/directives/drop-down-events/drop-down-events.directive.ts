import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[lavi-drop-down-event]'
})
export class DropDownEventsDirective {
  @Output('lavi-drop-down-open') Open: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('open', ['$event']) onClick($event) {
    this.Open.emit();
  }
}
