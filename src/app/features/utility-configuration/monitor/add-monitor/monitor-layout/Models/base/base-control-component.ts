import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { RoundOffProperty } from 'src/app/core/utilities/core-utilities';
import { IMoveEndControlEvent } from '../control-move-end-event.interface';
import { IResizeControlEvent } from '../control-resize-event.interface';
import { Control } from '../controls/control';

@Component({
  template: ''
})
export abstract class BaseControlComponent {
  @Input() DivLayoutDesignContainer: Component;
  @Input() GridSize;
  @Input() IsOnlyGrid: boolean;
  @Output() OnResizeStop: EventEmitter<IResizeControlEvent> = new EventEmitter<IResizeControlEvent>();
  @Output() OnMoveEnd: EventEmitter<IMoveEndControlEvent> = new EventEmitter<IMoveEndControlEvent>();
  @Output() OnClick: EventEmitter<Control> = new EventEmitter<Control>();
  @Output() OnRemove: EventEmitter<Control> = new EventEmitter<Control>();

  onControlResizeStop(event:IResizeEvent, control) {
    if(this.IsOnlyGrid){
      event.size.height = RoundOffProperty(event.size.height,this.GridSize);
      event.size.width = RoundOffProperty(event.size.width,this.GridSize);
    }
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
