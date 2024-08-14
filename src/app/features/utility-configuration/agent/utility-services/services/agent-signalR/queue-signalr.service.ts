import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { AgentSignalRActions } from '../../models/agent-signalr/agent-signalr-action-constants';
import { IQueue } from '../../models/agent-signalr/queue.model';
import { ConnectionMonitoringService } from 'src/app/core/services/connection-monitoring.service';
import { LaviSignalRConnection } from 'src/app/base/LaviSignalRConnection';

@Injectable()
export class QueueSignalRService extends AbstractService {
  //Connection: HubConnection;
  private SubjectQueuePositions: BehaviorSubject<IQueue>;
  public QueuePositions$: Observable<IQueue>;
  private signalR: LaviSignalRConnection;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService,
    private agentApiService: AgentAPIService,
    private connectionMonitoringService: ConnectionMonitoringService
  ) {
    super();
    this.SetObservables();
    this.signalR = new LaviSignalRConnection(this.ApiBaseUrl, httpClient, true, "AGENT-QUEUE", "Queue",
      // The connection callback, subscribe to the on here
      (c) => {
        c.on(AgentSignalRActions.QUEUE_UPDATED, (queue: IQueue) => {
          this.connectionMonitoringService.NewDataMessage(AgentSignalRActions.QUEUE_UPDATED, queue);
          const oldQueue = this.SubjectQueuePositions.getValue();
          if(queue) {
            let send = true;
            if(oldQueue) {
              if(queue._ts && oldQueue._ts && queue._ts <= oldQueue._ts) {
                send = false;
              }
            }

            if(send) {
              this.SubjectQueuePositions.next(queue);
            }
          }
        });
          },
      // When reconection happens
      () => {
        const branchId = this.signalR.id.split('_')[0];
        const workflowId = this.signalR.id.split('_')[1];

        this.agentApiService.GetQueue(branchId, workflowId).subscribe((queue) => {
          this.SubjectQueuePositions.next(queue);
        });
        },
      // Status change messages
      (m) => {
        this.connectionMonitoringService.NewStatus(this.signalR, m);
      }
    );
  }
  SetObservables() {
    this.SubjectQueuePositions = new BehaviorSubject<IQueue>(null);
    this.QueuePositions$ = this.SubjectQueuePositions.asObservable();
  }

  async StopSignalRConnection() {
    this.signalR.Stop();
  }

  UpdateQueue(queue: IQueue) {
    this.SubjectQueuePositions.next(queue);
  }

  InitSignalRConnectionWithGetDeviceId(value: string) {
    this.signalR.Start(value);
  }

  Init(value: string) {
    if (value) {
      const branchId = value.split('_')[0];
      const workflowId = value.split('_')[1];
      this.agentApiService.GetQueue(branchId, workflowId).subscribe((queue) => {
        this.SubjectQueuePositions.next(queue);
      });
    }

    this.signalR.Start(value);
  }

  /*
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

  InitSignalRConnectionWithGetDeviceId(value: string) {
    this.GetConnectionInfo(value).subscribe((info) => {
      this.StartSignalRConnectionAndSubscribeEvents(info, value);
    });
  }

  Init(value: string) {
    if (value) {
      const branchId = value.split('_')[0];
      const workflowId = value.split('_')[1];
      this.agentApiService.GetQueue(branchId, workflowId).subscribe((queue) => {
        this.SubjectQueuePositions.next(queue);
      });
    }
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
    this.Connection.on(AgentSignalRActions.QUEUE_UPDATED, (queue: IQueue) => {
      const oldQueue = this.SubjectQueuePositions.getValue();
      if(queue) {
        let send = true;
        if(oldQueue) {
          if(queue._ts && oldQueue._ts && queue._ts <= oldQueue._ts) {
            send = false;
          }
        }

        if(send) {
          this.SubjectQueuePositions.next(queue);
        }
      }
    });

    this.Connection.onclose(() => {
      console.log('disconnected');
      this.Init(value);
  });

    this.Connection.start()
      .then(() => {
        console.log('connected!');
      })
      .catch(console.error);
  }

  async StopSignalRConnection() {
    await this.Connection.stop().catch(console.error);
  }

  UpdateQueue(queue: IQueue) {
    this.SubjectQueuePositions.next(queue);
  }
  */
}
