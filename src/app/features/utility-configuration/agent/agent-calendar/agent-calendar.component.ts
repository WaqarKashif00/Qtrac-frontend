import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Appointment } from '../models/appointment/appointment.model';
import {
  IGlobalQuestion,
  IWorkFlow,
} from '../utility-services/models/workflow-models/workflow-interface';
import { AgentCalendarService } from './agent-calendar.service';
@Component({
  selector: 'lavi-agent-calendar',
  templateUrl: './agent-calendar.component.html',
  styleUrls: ['./agent-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCalendarComponent extends AbstractComponent {
  public SelectedDate: Date;
  public Events$: Observable<any[]>;
  BranchTimeZone$: Observable<any>;
  SearchData$: Observable<any>;
  workFlow: any;

  constructor(
    private calendarService: AgentCalendarService,
  ) {
    super();
    this.InitializeSelectedDate();
    this.InitializeEvents();
  }

  private InitializeEvents() {
    this.Events$ = this.calendarService.SchedularEvents$;
    this.SearchData$ = this.calendarService.SearchData$;
    this.BranchTimeZone$ = this.calendarService.BranchTimeZone$.pipe(
      map((timeZoneObj) => {
        if (timeZoneObj) {
          return timeZoneObj.id;
        }
        return null;
      })
    );

    this.workFlow = this.calendarService.WorkFlow;
  }
  private InitializeSelectedDate() {
    this.SelectedDate = new Date();
  }

  OpenAppointmentDetails(appointment: Appointment): void {
    this.calendarService.OpenAppointmentDetails(appointment);
  }

  OnAddAppointmentClick() {
    this.calendarService.OpenAddAppointmentURL();
  }

  RefreshAppointments() {
    this.calendarService.RefreshAppointments();
  }

  GetAppointmentDetails(data: Appointment, workflow: IWorkFlow) {
    return {
      appointmentDate: data.appointmentDate,
      appointmentRegistrationTimeUTCString:
        data.appointmentRegistrationTimeUTCString,
      serviceId: data.serviceId,
      appointmentStatus: data.appointmentStatus,
      appointmentTime: data.appointmentTime,
      appointmentTimeUTCString: data.appointmentTimeUTCString,
      displayField: this.GetDisplayFieldValueIfExists(data, workflow),
      id: data.id,
      preServiceQuestions: this.GetPreServiceQuestions(
        data.preServiceQuestions,
        workflow
      ),
      serviceName: this.GetServiceName(data.serviceId, workflow),
      serviceQuestions: this.GetServiceQuestions(
        data.serviceQuestions,
        workflow
      ),
      branchId: data.branchId,
      companyId: data.companyId,
      schedulerId: data.schedulerId
    };
  }

  GetDisplayFieldValueIfExists(
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

  GetPreServiceQuestions(
    preServiceQuestions: { questionId: string; answer: any }[],
    workflow: IWorkFlow
  ): {
    questionId: string;
    questionText: string;
    questionType: string;
    answer: any;
  }[] {
    const MappedQuestions = preServiceQuestions.map((x) => {
      const Question = this.getGlobalQuestion(workflow, x.questionId);
      if (!Question) {
        return null;
      }
      return {
        questionId: x.questionId,
        answer: x.answer,
        questionText: Question.question[0]?.question,
        questionType: Question.type,
      };
    });

    return MappedQuestions.filter((x) => x);
  }

  GetServiceName(serviceId: string, workflow: IWorkFlow): string {
    const service = workflow.services.find(
      (service) => service.id == serviceId
    );
    return service?.serviceNames[0].serviceName;
  }

  GetServiceQuestions(
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
      const Question = this.getServiceQuestion(
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

  getGlobalQuestion(workflow: IWorkFlow, questionId: string): IGlobalQuestion {
    return workflow.preServiceQuestions.find((x) => x.id == questionId);
  }

  getServiceQuestion(
    workflow: IWorkFlow,
    questionSetId: string,
    questionId: string
  ): IGlobalQuestion {
    const QuestionSet = workflow.questionSets.find(
      (x) => x.id == questionSetId
    );
    if (QuestionSet?.questions) {
      return QuestionSet.questions.find((x) => x.id == questionId);
    }
    return null;
  }

  Init(): void {
    this.Events$.subscribe((data) => {
      if (data) {
        data.forEach((dataItem) => {
          dataItem.dataItem = this.GetAppointmentDetails(
            dataItem.dataItem,
            this.workFlow
          );
          dataItem.serviceName = dataItem.dataItem.serviceName;
          dataItem.preServiceQuestions = dataItem.dataItem.preServiceQuestions;
          dataItem.serviceQuestions = dataItem.dataItem.serviceQuestions;
        });
      }
    });
  }
}
