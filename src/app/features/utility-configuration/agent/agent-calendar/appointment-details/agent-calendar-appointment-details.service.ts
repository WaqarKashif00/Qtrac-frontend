import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { AppointmentMessages } from 'src/app/models/validation-message/appointment-scheduler.messages';
import { DeleteAppointmentRequest } from 'src/app/shared/api-models/appointment/delete-appointment-request';
import { AppointmentSchedulerAPIService } from 'src/app/shared/api-services/appointment-scheduler-api.service';
import { KioskAPIService } from 'src/app/shared/api-services/kiosk-api.service';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { AgentMessages } from '../../../agent-configuration/messages';
import { HaveAppointmentRequestModel } from '../../../kiosk/kiosk-execution/kiosk-execution.service';
import { Appointment } from '../../models/appointment/appointment.model';
import {
  AppointmentTemplate,
  IGlobalQuestion,
  IWorkFlow
} from '../../utility-services/models/workflow-models/workflow-interface';
import { AgentStationDataService } from '../../utility-services/services/agent-station-data-service/agent-station-data.service';
import { AgentCalendarService } from '../agent-calendar.service';
import {
  GetDisplayFieldValueIfExists,
  GetServiceName
} from '../calendar-utilities/model-binder-functions';
import { AppointmentDetailsForModal } from './appointment-details-for-modal';

@Injectable()
export class AgentCalendarAppointmentDetailsService extends AbstractComponentService {
  IsAppointmentDetailsModalOpen$: Observable<boolean>;

  private AppointmentDetailsForModalSubject: BehaviorSubject<AppointmentDetailsForModal>;
  AppointmentDetailsForModal$: Observable<AppointmentDetailsForModal>;

  constructor(
    private appointmentSchedulerAPIService: AppointmentSchedulerAPIService,
    private stationDetails: AgentStationDataService,
    private calendarService: AgentCalendarService,
    private kioskAPIService: KioskAPIService
  ) {
    super();
    this.SetObservables();
  }

  private SetObservables() {
    this.IsAppointmentDetailsModalOpen$ =
      this.calendarService.IsAppointmentDetailsModalOpen$;

    this.AppointmentDetailsForModalSubject =
      new BehaviorSubject<AppointmentDetailsForModal>(null);
    this.AppointmentDetailsForModal$ =
      this.AppointmentDetailsForModalSubject.asObservable();

    this.subs.sink = this.calendarService.AppointmentData$.subscribe((data) => {
      if (data) {
        const MappedDataForDetails: AppointmentDetailsForModal =
          GetAppointmentDetailsForModalSubject(
            data,
            this.stationDetails.Workflow
          );
        this.AppointmentDetailsForModalSubject.next(MappedDataForDetails);
      } else {
        this.CloseAppointmentDetailsModal();
      }
    });
  }

  CloseAppointmentDetailsModal() {
    this.AppointmentDetailsForModalSubject.next(null);
    this.calendarService.CloseAppointmentDetailsModal();
  }

  @Confirmable(CommonMessages.ConfirmationAppointmentDeletion)
  Delete() {
    const CurrentAppointment =
      this.calendarService.AppointmentDataSubject.getValue();
    const requestModel: DeleteAppointmentRequest = {
      cancelledById: this.authService.UserId,
      appointmentId: CurrentAppointment.id,
      branchId: this.stationDetails.BranchId,
      serviceId: CurrentAppointment.serviceId,
      workflowId: CurrentAppointment.workflowId,
    };
    this.subs.sink = this.appointmentSchedulerAPIService
      .DeleteAppointment(requestModel)
      .subscribe((x) => {
        if (x.isDeleted) {
          this.calendarService.OnAppointmentRemoved([x.appointmentId]);
          this.AppointmentDetailsForModalSubject.next(null);
          this.calendarService.CloseAppointmentDetailsModal();
          this.AppNotificationService.Notify(AppointmentMessages.ApppointMentDeleted);
        }
      });
  }

  Reschedule() {
      const CurrentAppointment =this.calendarService.AppointmentDataSubject.getValue();
    this.routeHandlerService.RedirectInNewTab(`/scheduler-execution`, {
      'c-id': CurrentAppointment.companyId,
      's-id': CurrentAppointment.schedulerId,
      type: 'AB',
      'a-id': CurrentAppointment.id,
      'b-id': CurrentAppointment.branchId,
    });
  }

  CheckIn() {
      const CurrentAppointment =this.calendarService.AppointmentDataSubject.getValue();
    const SaveAppointmentModel: HaveAppointmentRequestModel = {
      appointmentId: CurrentAppointment.id,
      branchId: CurrentAppointment.branchId,
    };
    this.kioskAPIService
      .SaveCustomerRequestByAppointment<any, any>(
        CurrentAppointment.companyId,
        SaveAppointmentModel
      )
      .subscribe((response) => {
        if (response) {
          this.calendarService.OnAppointmentCheckedIn(CurrentAppointment.id);
          this.AppointmentDetailsForModalSubject.next(null);
          this.calendarService.CloseAppointmentDetailsModal();
          this.AppNotificationService.Notify(AgentMessages.CheckedInMessage);
        }
      });
    
  }

  GetAppointmentTemplate() : AppointmentTemplate {
    const appointmentId = this.stationDetails.Workflow.services.find(
      (x) => x.id == this.AppointmentDetailsForModalSubject.value.serviceId
    )?.appointmentTemplate?.id;

    return this.stationDetails.Workflow.appointmentTemplates.find(
      (x) => x.id == appointmentId
    );
  }

}
function GetAppointmentDetailsForModalSubject(
  data: Appointment,
  workflow: IWorkFlow
): AppointmentDetailsForModal {
  return {
    appointmentDate: data.appointmentDate,
    appointmentRegistrationTimeUTCString:
      data.appointmentRegistrationTimeUTCString,
    serviceId: data.serviceId,
    appointmentStatus: data.appointmentStatus,
    appointmentTime: data.appointmentTime,
    appointmentTimeUTCString: data.appointmentTimeUTCString,
    displayField: GetDisplayFieldValueIfExists(data, workflow),
    id: data.id,
    isCancelled: data.isCancelled,
    preServiceQuestions: GetPreServiceQuestions(
      data.preServiceQuestions,
      workflow
    ),
    serviceName: GetServiceName(data.serviceId, workflow),
    serviceQuestions: GetServiceQuestions(data.serviceQuestions, workflow),
    appointmentCheckInTimeUTCString: data.appointmentCheckInTimeUTCString,
    cancellationTimeUTCString: data.cancellationTimeUTCString,
    cancelledBy: data.cancelledBy,
  };
}

function GetPreServiceQuestions(
  preServiceQuestions: { questionId: string; answer: any }[],
  workflow: IWorkFlow
): {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: any;
}[] {
  const MappedQuestions = preServiceQuestions.map((x) => {
    const Question = getGlobalQuestion(workflow, x.questionId);
    if(!Question){
      return null;
    }
    return {
      questionId: x.questionId,
      answer: x.answer,
      questionText: Question.question[0]?.question,
      questionType: Question.type,
    };
  });

  return MappedQuestions.filter(x=>x);
}

function getGlobalQuestion(
  workflow: IWorkFlow,
  questionId: string
): IGlobalQuestion {
  return workflow.preServiceQuestions.find((x) => x.id == questionId);
}

function getServiceQuestion(
  workflow: IWorkFlow,
  questionSetId: string,
  questionId: string
): IGlobalQuestion {
  const QuestionSet = workflow.questionSets.find((x) => x.id == questionSetId);
  if (QuestionSet?.questions) {
    return QuestionSet.questions.find((x) => x.id == questionId);
  }
  return null;
}

function GetServiceQuestions(
  serviceQuestions: {
    questionId: string;
    questionSetId: string;
    answer: any;
  }[],
  workflow: IWorkFlow
): {
  questionId: string;
  questionText: string;
  questionType: string;
  questionSetId: string;
  answer: any;
}[] {
  const MappedQuestions = serviceQuestions.map((x) => {
    const Question = getServiceQuestion(
      workflow,
      x.questionSetId,
      x.questionId
    );
    if (!Question) return null;
    return {
      questionId: x.questionId,
      answer: x.answer,
      questionSetId: x.questionSetId,
      questionText: Question.question[0]?.question,
      questionType: Question.type,
    };
  });

  return MappedQuestions.filter((x) => x);
}
