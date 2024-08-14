import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Control } from './controls/control';

export interface IMobileResizeControlEvent {
  event: IResizeEvent;
  control: Control;
}
