import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { Appointment } from '../../models/appointment/appointment.model';
import { IWorkFlow } from '../../utility-services/models/workflow-models/workflow-interface';

const TimePerServeInMilliseconds = 20 * 60 * 1000;

export function ConvertAppointmentModelToSchedularEvent(
  appointment: Appointment,
  workflow: IWorkFlow
): SchedulerEvent {
  if (!appointment) {
    return null;
  }
  if (!workflow) {
    return null;
  }
  const displayField = GetDisplayFieldValueIfExists(appointment, workflow);
  const serviceName = GetServiceName(appointment.serviceId, workflow);

  const appointmentDate = new Date(
    new Date(appointment.appointmentDate).getFullYear(),
    new Date(appointment.appointmentDate).getMonth(),
    new Date(appointment.appointmentDate).getDate(),
    appointment.appointmentTime.hours,
    appointment.appointmentTime.minutes
  );

  const schedulerEvent: SchedulerEvent = {
    id: appointment.id,
    start: new Date(appointmentDate),
    end: new Date(
      new Date(appointmentDate).getTime() +
        (GetAverageWaitTimeForServiceInMilliseconds(appointment.serviceId, workflow) ??
          TimePerServeInMilliseconds)
    ),
    title: displayField || serviceName,
    dataItem: appointment,
  };

  return schedulerEvent;
}

export function GetDisplayFieldValueIfExists(
  appointment: Appointment,
  workflow: IWorkFlow
): string {
  if (
    !workflow.preServiceQuestions ||
    workflow.preServiceQuestions.length == 0 ||
    !appointment.preServiceQuestions ||
    appointment.preServiceQuestions.length == 0
  ) {
    return null;
  }

  const DisplayFieldQuestions = workflow.preServiceQuestions.filter(
    (question) => question.isDisplay
  );
  if (!DisplayFieldQuestions || DisplayFieldQuestions.length == 0) {
    return null;
  }

  const FirstQuestion = DisplayFieldQuestions[0];

  const answeredQuestion = appointment.preServiceQuestions.find(
    (question) => question.questionId == FirstQuestion.id
  );

  return answeredQuestion?.answer || null;
}

export function GetServiceName(serviceId: string, workflow: IWorkFlow): string {
  const service = workflow.services.find((service) => service.id == serviceId);
  return service?.serviceNames[0].serviceName;
}

function GetAverageWaitTimeForServiceInMilliseconds(
  serviceId: string,
  workflow: IWorkFlow
): number {
  const service = workflow.services.find((x) => x.id == serviceId);
  if (!service) {
    return null;
  }

  if(! (workflow.appointmentTemplates?.length > 0)){
    return null;
  }

  const appointmentTemplateId = service.appointmentTemplate?.id;
  if(!appointmentTemplateId){
    return null;
  }

  const appointmentTemplate = workflow.appointmentTemplates.find(x=>x.id == appointmentTemplateId);

  if(!appointmentTemplate){
    return null;
  }

  const serviceTimeInMinutes = appointmentTemplate.durationOfEachTimeSlotInMinutes || 0;
  return serviceTimeInMinutes * 60 * 1000;
}
