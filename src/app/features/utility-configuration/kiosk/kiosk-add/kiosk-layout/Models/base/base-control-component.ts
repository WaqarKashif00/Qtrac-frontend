import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Control } from '../controls/control';
import { IKioskResizeControlEvent } from '../kiosk-contro-resize-event.interface';
import { IKioskMoveEndControlEvent } from '../kiosk-control-move-end-event.interface';

@Component({
  template: ''
})
export abstract class BaseControlComponent {
  @Input() DivLayoutDesignContainer: Component;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Output() OnResizeStop: EventEmitter<IKioskResizeControlEvent> = new EventEmitter<IKioskResizeControlEvent>();
  @Output() OnMoveEnd: EventEmitter<IKioskMoveEndControlEvent> = new EventEmitter<IKioskMoveEndControlEvent>();
  @Output() OnClick: EventEmitter<Control> = new EventEmitter<Control>();
  @Output() OnRemove: EventEmitter<Control> = new EventEmitter<Control>();

  onControlResizeStop(event, control) {
    this.OnResizeStop.emit({ event, control });
  }
  onControlMoveEnd(event, control) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.OnMoveEnd.emit({ event, control });
  }
  onControlClick(event) {
    this.OnClick.emit(event);
  }
  onControlRemove(event) {
    this.OnRemove.emit(event);
  }
}
