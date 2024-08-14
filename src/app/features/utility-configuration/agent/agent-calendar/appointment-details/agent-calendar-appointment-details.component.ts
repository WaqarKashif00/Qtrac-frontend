import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppointmentStatus } from '../../models/appointment/appointment.status.enum';
import { IsAppointmentTimeGreaterThanCurrent, IsAppointmentComesUnderCheckInTime, IsCheckInTimeExceeded } from '../calendar-utilities/appointment-item-circle-style-resolver';
import { AgentCalendarAppointmentDetailsService } from './agent-calendar-appointment-details.service';
import { AppointmentDetailsForModal } from './appointment-details-for-modal';

@Component({
  selector: 'lavi-agent-calendar-appointment-details',
  templateUrl: './agent-calendar-appointment-details.component.html',
  styleUrls: ['./agent-calendar-appointment-details.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCalendarAppointmentDetailsComponent extends AbstractComponent {
  IsAppointmentDetailsModalOpen$: Observable<boolean>;
  AppointmentData$: Observable<AppointmentDetailsForModal>;
  Appointment: AppointmentDetailsForModal;
  AppointmentTimeString: string;

  get CanDelete(): boolean {
    return this.Appointment.appointmentStatus !== AppointmentStatus.CHECKED_IN && !IsCheckInTimeExceeded(
      this.Appointment.appointmentTimeUTCString,
      this.service.GetAppointmentTemplate()
    );
  }

  get CanReschedule(): boolean {
    return (
      this.Appointment.appointmentStatus == AppointmentStatus.CONFIRMED &&
      IsAppointmentTimeGreaterThanCurrent(this.Appointment.appointmentTimeUTCString)
    );
  }
  get CanCheckIn(): boolean {
    return (
      this.Appointment.appointmentStatus == AppointmentStatus.CONFIRMED &&
      IsAppointmentComesUnderCheckInTime(
        this.Appointment.appointmentTimeUTCString,
        this.service.GetAppointmentTemplate()
      )
    );
  }

  constructor(private service: AgentCalendarAppointmentDetailsService) {
    super();
    this.SetObservables();
  }

  private SetObservables() {
    this.IsAppointmentDetailsModalOpen$ =
      this.service.IsAppointmentDetailsModalOpen$;
    this.AppointmentData$ = this.service.AppointmentDetailsForModal$;
    this.subs.sink = this.AppointmentData$.subscribe((data) => {
      this.Appointment = data;
      this.AppointmentTimeString = this.GetFormattedAppointmentTime(data);
    });
    // this.CheckUrl(this.Appointment.serviceQuestions[1])
  }




  GetFormattedAppointmentTime(Appointment): string {
    if (!Appointment) {
      return '';
    }
    return (
      `${
        Appointment.appointmentTime.hours > 12
          ? getTwoDigitNumber(Appointment.appointmentTime.hours - 12)
          : getTwoDigitNumber(Appointment.appointmentTime.hours)
      }` +
      `:${getTwoDigitNumber(Appointment.appointmentTime.minutes)} ${
        Appointment.appointmentTime.hours >= 12 ? 'PM' : 'AM'
      }`
    );
  }

  Close(): void {
    this.service.CloseAppointmentDetailsModal();
  }

  Delete(): void {
    this.service.Delete();
  }

  Reschedule(): void {
    this.service.Reschedule();
  }

  CheckIn(): void {
    this.service.CheckIn();
  }
}

function getTwoDigitNumber(number: Number): string {
  if (!number) {
    return '00';
  }
  if (number == 0) {
    return '00';
  }
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
}
