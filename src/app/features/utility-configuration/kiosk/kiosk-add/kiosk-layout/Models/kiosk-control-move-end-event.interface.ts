import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Control } from './controls/control';
import { IMoveEvent } from './move-event.interface';

export interface IKioskMoveEndControlEvent {
  event: IMoveEvent;
  control: Control;
}
