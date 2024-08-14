import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { ClassicAgentService } from '../classic-agent-template/classic-agent.service';
import { Appointment } from '../models/appointment/appointment.model';
import { AppointmentStatus } from '../models/appointment/appointment.status.enum';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';
import { ConvertAppointmentModelToSchedularEvent } from './calendar-utilities/model-binder-functions';

@Injectable()
export class AgentCalendarService extends AbstractComponentService {
  Connection: HubConnection;

  AppointmentDataSubject: BehaviorSubject<Appointment>;
  AppointmentData$: Observable<Appointment>;

  private IsAppointmentDetailsModalOpenSubject: BehaviorSubject<boolean>;
  IsAppointmentDetailsModalOpen$: Observable<boolean>;

  private AppointmentsSubject: BehaviorSubject<Appointment[]>;
  Appointments$: Observable<Appointment[]>;

  private SchedularEventsSubject: BehaviorSubject<SchedulerEvent[]>;
  SchedularEvents$: Observable<SchedulerEvent[]>;

  BranchTimeZone$: Observable<any>;
  SearchData$: Observable<any>;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

    get WorkFlow() {
      return this.stationDetailsService.Workflow;
    }

  constructor(
    private httpClient: HttpClient,
    private stationDetailsService: AgentStationDataService,
    private classicAgentService: ClassicAgentService,
    private agentAPIService: AgentAPIService
  ) {
    super();
    this.SetObservables();
    this.InitializeModelBinding();
    this.InitializeAppointments();
  }

  InitializeAppointments() {
    if (this.stationDetailsService.IsStationDetailsAvailable()) {
      this.FetchAppointments();
    } else {
      this.subs.sink = this.stationDetailsService.StationDetails$.subscribe(
        (data) => {
          this.FetchAppointments();
        }
      );
    }
  }

  private FetchAppointments() {
    const IsAppointmentAccess = this.stationDetailsService.Value?.AgentConfiguration?.displayAppointments?true: false;
    if(!IsAppointmentAccess){
      return;
    }
    const companyId = this.authService.CompanyId;
    const agentId = this.authService.UserId;
    const branchId = this.stationDetailsService.BranchId;
    const workflowId = this.stationDetailsService.WorkflowId;
    this.InitSignalR(`${branchId}_${workflowId}`);
    this.agentAPIService
      .GetAppointmentsByWorkflow(companyId, agentId, branchId, workflowId)
      .subscribe((appointments) => {
        this.AppointmentsSubject.next(appointments);
      });
  }

  public FetchAppointmentsByBranchId(changedBranchId:string) {
    const IsAppointmentAccess = this.stationDetailsService.Value?.AgentConfiguration?.displayAppointments?true: false;
    if(!IsAppointmentAccess){
      return;
    }
    const companyId = this.authService.CompanyId;
    const agentId = this.authService.UserId;
    const branchId = changedBranchId;
    const workflowId = this.stationDetailsService.WorkflowId;
    this.InitSignalR(`${branchId}_${workflowId}`);
    this.agentAPIService
      .GetAppointmentsByWorkflow(companyId, agentId, branchId, workflowId)
      .subscribe((appointments) => {
        this.AppointmentsSubject.next(appointments);
      });
  }

  RefreshAppointments() {
    this.FetchAppointments();
  }

  private SetObservables() {
    this.AppointmentsSubject = new BehaviorSubject<Appointment[]>([]);
    this.Appointments$ = this.AppointmentsSubject.asObservable();

    this.SchedularEventsSubject = new BehaviorSubject<SchedulerEvent[]>([]);
    this.SchedularEvents$ = this.SchedularEventsSubject.asObservable();

    this.AppointmentDataSubject = new BehaviorSubject<Appointment>(null);
    this.AppointmentData$ = this.AppointmentDataSubject.asObservable();

    this.IsAppointmentDetailsModalOpenSubject = new BehaviorSubject<boolean>(
      false
    );
    this.IsAppointmentDetailsModalOpen$ =
      this.IsAppointmentDetailsModalOpenSubject.asObservable();

    this.BranchTimeZone$ = this.classicAgentService.BranchTimeZone$;
    this.SearchData$ = this.classicAgentService.SearchData$
  }

  private InitializeModelBinding() {
    this.subs.sink = this.Appointments$.subscribe((appointments) => {
      if (!appointments || appointments.length == 0) {
        this.SchedularEventsSubject.next([]);
        return;
      }
      const workflow = this.stationDetailsService.Workflow;
      const schedulerEvents: SchedulerEvent[] = appointments.map((x) =>
        ConvertAppointmentModelToSchedularEvent(x, workflow)
      );

      this.SchedularEventsSubject.next(schedulerEvents);
    });
  }

  CloseAppointmentDetailsModal() {
    // this.AppointmentDataSubject.next(null);
    this.IsAppointmentDetailsModalOpenSubject.next(false);
  }

  OpenAppointmentDetails(appointment: Appointment) {
    this.AppointmentDataSubject.next(appointment);
    this.IsAppointmentDetailsModalOpenSubject.next(true);
  }

  OnAppointmentAdded(requests: Appointment[]) {
    if (requests) {
      let PreviousRequests = this.AppointmentsSubject.getValue();
      PreviousRequests = PreviousRequests.filter(
        (x) => !requests.find((y) => y.id == x.id)
      );
      this.AppointmentsSubject.next(PreviousRequests.concat(requests));
    }
  }
  OnAppointmentCheckedIn(appointmentId: string) {
    let PreviousRequests = this.AppointmentsSubject.getValue();
    PreviousRequests.find((x) => appointmentId == x.id).appointmentStatus =
      AppointmentStatus.CHECKED_IN;
    this.AppointmentsSubject.next([].concat(PreviousRequests));
  }

  OnAppointmentRemoved(ids: string[]) {
    const requests = this.AppointmentsSubject.getValue();
    const Filtered = requests
      .filter((x) => !ids.find((y) => y == x.id))
      .concat([]);
    this.AppointmentsSubject.next(Filtered.concat([]));
  }

  private GetConnectionInfo(value: string): Observable<SignalRConnectionInfo> {
    const requestUrl = `${this.ApiBaseUrl}/negotiate`;
    return this.httpClient.get<SignalRConnectionInfo>(
      requestUrl,
      this.GetHttpHeader(value)
    );
  }

  private GetHttpHeader(value: string) {
    return {
      headers: new HttpHeaders({ 'x-ms-client-principal-id': value }),
    };
  }

  InitSignalR(value: string) {
    this.GetConnectionInfo(value).subscribe((info) => {
      this.StartSignalRConnectionAndSubscribeEvents(info, value);
    });
  }

  private StartSignalRConnectionAndSubscribeEvents(
    info: SignalRConnectionInfo,
    value: string
  ) {
    // make compatible with old and new SignalRConnectionInfo
    info.accessToken = info.accessToken || info.accessKey;
    info.url = info.url || info.endpoint;
    const options = {
      accessTokenFactory: () => info.accessToken,
    };
    this.Connection = new HubConnectionBuilder()
      .withUrl(info.url, options)
      .withAutomaticReconnect()
      .build();

    this.Connection.on(
      SignalRActions.New_OR_UPDATE_Appointment,
      async (appointments: Appointment[]) => {
        if (
          appointments &&
          Array.isArray(appointments) &&
          appointments.length > 0
        ) {
          const RemovedIds = appointments
            .filter((x) => x.isCancelled)
            .map((x) => x.id);
          const UpdatedAppointments = appointments.filter(
            (x) => !x.isCancelled
          );
          this.OnAppointmentAdded(UpdatedAppointments);
          this.OnAppointmentRemoved(RemovedIds);
        }
      }
    );

    this.Connection.onclose(() => {
      console.log('disconnected');
      this.InitSignalR(value);
    });

    this.Connection.start()
      .then(() => {
        console.log('connected!');
      })
      .catch(console.error);
  }

  async StopSignalRConnection() {
    try {
      await this.Connection.stop().catch(console.error);
    } catch {}
  }
  OpenAddAppointmentURL() {
    if (this.stationDetailsService.AgentConfigurations.schedulerTemplateId) {
      this.routeHandlerService.RedirectInNewTab('/scheduler-execution', {
        'c-id': this.authService.CompanyId,
        's-id':
          this.stationDetailsService.AgentConfigurations.schedulerTemplateId,
        type: 'AB',
        'b-id': this.stationDetailsService.BranchId,
      });
    } else {
      this.AppNotificationService.NotifyError(
        CommonMessages.SchedulerTemplateNotConnected
      );
    }
  }

  Destroy() {
    this.StopSignalRConnection();
  }
}

const SignalRActions = {
  New_OR_UPDATE_Appointment: 'New_OR_UPDATE_Appointment',
};
