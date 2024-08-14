import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IFirstAvailable } from 'src/app/features/appointment-scheduler/models/first-available.interface';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { AppointmentTextInterface } from '../../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-select-different-date',
  templateUrl: './select-different-date.component.html',
  styleUrls: ['./select-different-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDifferentDateComponent extends AbstractComponent {
  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() InActiveBackColor: string;
  @Input() ActiveBackColor: string;

  @Input() AvailableSlots: IFirstAvailable;
  @Input() SelectedDate: Date;
  @Input() MaxAppointmentBookAvailableDate: Date;
  @Input() MinAvailableDate: Date;
  @Input() AppointmentTexts: AppointmentTextInterface

  @Output() OnChangingTimeSlot: EventEmitter<ITime> = new EventEmitter<ITime>();
  @Output() OnAppointmentDateChange: EventEmitter<Date> =
    new EventEmitter<Date>();

  constructor() {
    super();
  }
  getTomorrowsDay() {
    const todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate() + 1);
    return todaysDate;
  }
  onChange(time) {
    this.OnChangingTimeSlot.emit(time);
  }
  onAppointmentDateChange(date) {
    this.OnAppointmentDateChange.emit(date);
  }
  public disabledDates = (date: Date): boolean => {
    return this.MinAvailableDate > date;
  }
}
