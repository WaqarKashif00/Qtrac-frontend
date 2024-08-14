import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { TokenService } from 'src/app/core/services/token.service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { IMinimiumKioskRequestModel, KioskRequest } from '../../../models/agent-models';
import { AgentSignalRActions } from '../../models/agent-signalr/agent-signalr-action-constants';
import { LaviSignalRConnection } from 'src/app/base/LaviSignalRConnection';
import { ConnectionMonitoringService } from 'src/app/core/services/connection-monitoring.service';

@Injectable()
export class AgentSignalRService extends AbstractService {

  Connection: HubConnection;
  private SubjectKioskWaitingRequests: BehaviorSubject<KioskRequest[]>;
  public NewKioskWaitingRequests$: Observable<KioskRequest[]>;

  private SubjectRemovedWaitingRequests: BehaviorSubject<IMinimiumKioskRequestModel[]>;
  public RemovedWaitingRequests$: Observable<IMinimiumKioskRequestModel[]>;

  private SubjectReconnected: BehaviorSubject<any>;
  public Reconnected$: Observable<any>;

  private signalR: LaviSignalRConnection;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService,
    private tokenService: TokenService,
    private connectionMonitoringService: ConnectionMonitoringService
  ) {
    super();
    this.SetObservables();
    this.signalR = new LaviSignalRConnection(this.ApiBaseUrl, httpClient, true, "AGENT-TICKET", "Request",
      // The connection callback, subscribe to the on here
      (c) => {
        c.on(AgentSignalRActions.WAITING_UPDATED, (requests) => {
          this.connectionMonitoringService.NewDataMessage(AgentSignalRActions.WAITING_UPDATED,requests);
          if (requests && Array.isArray(requests) && requests.length > 0) {
            const RemovedIds = requests.filter(x => x.isDeleted);
            const UpdatedWaitings = requests.filter(x => !(x.isDeleted));
            this.SubjectKioskWaitingRequests.next(UpdatedWaitings);
            this.SubjectRemovedWaitingRequests.next(RemovedIds);
          }
        });
        c.on(AgentSignalRActions.USER_DELETED, (requests) => {
          this.connectionMonitoringService.NewDataMessage(AgentSignalRActions.USER_DELETED,requests);
          this.tokenService.Logout(false);
        });
      },
      // When reconection happens
      () => {
        this.SubjectReconnected.next(this.signalR.id);
      },
      // Status change messages
      (m) => {
        this.connectionMonitoringService.NewStatus(this.signalR, m);
      }
    );
  }
  SetObservables() {
    this.SubjectRemovedWaitingRequests = new BehaviorSubject<IMinimiumKioskRequestModel[]>([]);
    this.RemovedWaitingRequests$ = this.SubjectRemovedWaitingRequests.asObservable();

    this.SubjectKioskWaitingRequests = new BehaviorSubject<KioskRequest[]>([]);
    this.NewKioskWaitingRequests$ = this.SubjectKioskWaitingRequests.asObservable();

    this.SubjectReconnected = new BehaviorSubject<any>("");
    this.Reconnected$ = this.SubjectReconnected.asObservable();
  }

  InitSignalRConnectionWithGetDeviceId(value: string) {
    this.signalR.Start(value);
  }

  Init(value: string) {
    this.signalR.Start(value);
  }

  async StopSignalRConnection() {
    this.signalR.Stop();
  }
}

