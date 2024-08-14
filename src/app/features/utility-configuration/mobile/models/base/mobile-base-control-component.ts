import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Control } from '../controls/control';
import { IMobileMoveEndControlEvent } from '../mobile-control-move-end-event.interface';
import { IMobileResizeControlEvent } from '../mobile-control-resize-event.interface';

@Component({
  template: ''
})
export abstract class MobileBaseControlComponent {
  @Input() DivLayoutDesignContainer: Component;
  @Output() OnResizeStop: EventEmitter<IMobileResizeControlEvent> = new EventEmitter<IMobileResizeControlEvent>();
  @Output() OnMoveEnd: EventEmitter<IMobileMoveEndControlEvent> = new EventEmitter<IMobileMoveEndControlEvent>();
  @Output() OnClick: EventEmitter<Control> = new EventEmitter<Control>();
  @Output() OnRemove: EventEmitter<Control> = new EventEmitter<Control>();

  onControlResizeStop(event, control) {
    this.OnResizeStop.emit({ event, control });
  }
  onControlMoveEnd(event, control) {
    this.OnMoveEnd.emit({ event, control });
  }
  onControlClick(event) {
    this.OnClick.emit(event);
  }
  onControlRemove(event) {
    this.OnRemove.emit(event);
  }
}
