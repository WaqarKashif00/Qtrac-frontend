import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Control } from './controls/control';

export interface IResizeControlEvent {
  event: IResizeEvent;
  control: Control;
}
