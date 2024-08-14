import { Control } from './controls/control';
import { IMoveEvent } from './move-event.interface';

export interface IMoveEndControlEvent {
  event: IMoveEvent;
  control: Control;
}
