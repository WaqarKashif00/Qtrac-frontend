import { Control } from './controls/control';
import { IMobileMoveEvent } from './mobile-move-event.interface';

export interface IMobileMoveEndControlEvent {
  event: IMobileMoveEvent;
  control: Control;
}
