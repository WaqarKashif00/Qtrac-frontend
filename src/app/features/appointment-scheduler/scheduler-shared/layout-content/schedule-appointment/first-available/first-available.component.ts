import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IFirstAvailable } from 'src/app/features/appointment-scheduler/models/first-available.interface';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';

@Component({
  selector: 'lavi-first-available',
  templateUrl: './first-available.component.html',
  styleUrls: ['./first-available.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstAvailableComponent extends AbstractComponent {
  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() InActiveBackColor: string;
  @Input() ActiveBackColor: string;
  @Input() FirstAvailableSlots: IFirstAvailable[];
  @Input() NonWorkingDaysText: string;

  @Output() OnChangingTimeSlot: EventEmitter<ITime> = new EventEmitter<ITime>();
  constructor() {
    super();
  }
  OnSelectingTimeSlot(time) {
    this.OnChangingTimeSlot.emit(time);
  }
}
