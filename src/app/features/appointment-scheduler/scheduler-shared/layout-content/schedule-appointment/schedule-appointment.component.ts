import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ITime } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { IFirstAvailable } from '../../../models/first-available.interface';
import { IAppointmentDetails } from '../../../models/scheduler-execution-data.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss', './../../../scheduler-execution/scheduler-execution.component.scss'],
})
export class ScheduleAppointmentComponent extends AbstractComponent {
  constructor() {
    super();
  }

  FirstAvailable = true;
  SelectDifferentDate = false;

  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() InActiveBackColor: string;
  @Input() ActiveBackColor: string;
  @Input() AvailableTimeSlots: IFirstAvailable[];
  @Input() SelectedDatesAvailableSlots: IFirstAvailable;
  @Input() appointmentDetails: IAppointmentDetails;
  @Input() MinAvailableDate: Date;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @Input() AppointmentTexts: AppointmentTextInterface

  @Output() OnChangingFirstAvailableTimeSlot: EventEmitter<ITime> =
    new EventEmitter<ITime>();
  @Output() OnChangingTimeSlot: EventEmitter<ITime> = new EventEmitter<ITime>();
  @Output() OnSelectDifferentDateButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnFirstAvailableButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnSelectedAppointmentDateChange: EventEmitter<Date> = new EventEmitter<Date>();


  ShowFirstAvailable() {
    this.appointmentDetails.firstAvailable = true;
    this.appointmentDetails.selectDifferentDate = false;
    this.OnFirstAvailableButtonClick.emit();
  }

  ShowSelectDifferentDate() {
    this.appointmentDetails.firstAvailable = false;
    this.appointmentDetails.selectDifferentDate = true;
    this.OnSelectDifferentDateButtonClick.emit();
  }
  OnFirstAvailableTimeSlotChange(time) {
    this.OnChangingFirstAvailableTimeSlot.emit(time);
  }
  OnTimeSlotChange(time) {
    this.OnChangingTimeSlot.next(time);
  }
  OnAppointmentDateChange(date) {
    this.OnSelectedAppointmentDateChange.emit(date);
  }

  Init(): void {
    this.appointmentDetails.firstAvailable = true;
    this.appointmentDetails.selectDifferentDate = false;
  }
}
