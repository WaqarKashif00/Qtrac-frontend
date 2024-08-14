import { Appointment } from '../../models/appointment/appointment.model';
import { AppointmentStatus } from '../../models/appointment/appointment.status.enum';
import { AppointmentTemplate } from '../../utility-services/models/workflow-models/workflow-interface';

enum EventStatus {
  CHECKED_IN,
  Not_Approached_Branch,
  Missed,
}

// Set style class names based on appointment status
const Styles = new Map<EventStatus, string>();
Styles.set(EventStatus.CHECKED_IN, 'appointment-checked-in');
Styles.set(EventStatus.Not_Approached_Branch, 'appointment-not-in-branch');
Styles.set(EventStatus.Missed, 'appointment-missed');

export function GetAppointmentItemCircleClass(
  appointment: Appointment
): string {
  if (!appointment) {
    return '';
  }
  const status: EventStatus = GetEventStatus(appointment);
  return Styles.get(status) || '';
}

function GetEventStatus(appointment: Appointment): EventStatus {
  if (appointment.appointmentStatus == AppointmentStatus.CHECKED_IN) {
    return EventStatus.CHECKED_IN;
  }

  if (
    appointment.appointmentStatus == AppointmentStatus.CONFIRMED &&
    IsAppointmentTimeExceeded(appointment.appointmentTimeUTCString)
  ) {
    return EventStatus.Missed;
  }

  if (appointment.appointmentStatus == AppointmentStatus.CONFIRMED) {
    return EventStatus.Not_Approached_Branch;
  }
}

export function IsAppointmentTimeExceeded(utcAppointmentDate: string): boolean {
  const appointmentTime = new Date(utcAppointmentDate);
  const currentTime = new Date();

  return appointmentTime.getTime() < currentTime.getTime();
}
export function IsAppointmentTimeGreaterThanCurrent(utcAppointmentDate: string): boolean {
  const appointmentTime = new Date(utcAppointmentDate);
  const currentTime = new Date();

  return appointmentTime.getTime() > currentTime.getTime();
}
export function IsAppointmentComesUnderCheckInTime(
  appointmentTimeUTCString: string,
  appointmentTemplate: AppointmentTemplate
): boolean {
  const currentTime = new Date().getTime();
  const appointmentTime = new Date(appointmentTimeUTCString);

  const appTime = appointmentTime.getTime();
  const FromTimeAllowed =
    appTime - (appointmentTemplate?.earlyCheckInMinutes || 480) * 60 * 1000;
  const ToTimeAllowed =
    appTime + (appointmentTemplate?.lateCheckInMinutes || 480) * 60 * 1000;

  const isEarlySatisfied = FromTimeAllowed <= currentTime;
  const isLateSatisfied = ToTimeAllowed >= currentTime;

  return isEarlySatisfied && isLateSatisfied;
}
export function IsCheckInTimeExceeded(appointmentTimeUTCString: string,
  appointmentTemplate: AppointmentTemplate){
    const currentTime = new Date().getTime();
    const appointmentTime = new Date(appointmentTimeUTCString);

    const appTime = appointmentTime.getTime();
    const ToTimeAllowed =
    appTime + (appointmentTemplate?.lateCheckInMinutes || 480) * 60 * 1000;
   return ToTimeAllowed < currentTime;
}
