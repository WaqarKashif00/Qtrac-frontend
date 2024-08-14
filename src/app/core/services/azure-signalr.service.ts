import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';
import { MobileMonitorRequest } from 'src/app/features/utility-configuration/mobile/models/mobile-monitor-execution-model';
import { IMonitorExecutionQueue } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/monitor-execution-queue.interface';
import { SignalRConnectionInfo } from '../../models/common/signalr-connection-Info';
import { KioskAction } from '../../models/enums/kiosk-action.enum';
import { KioskAPIService } from '../../shared/api-services/kiosk-api.service';
import { AppConfigService } from './app-config.service';
import { LaviSignalRConnection } from 'src/app/base/LaviSignalRConnection';
import { ConnectionMonitoringService } from './connection-monitoring.service';

@Injectable({ providedIn: 'root' })
export class AzureSignalRService extends AbstractService {
  private signalR: LaviSignalRConnection;

  kioskDeviceCodeSubject: Subject<string> = new Subject();
  SubmitCodeResponseSubject: Subject<string> = new Subject();
  refreshWindowSubject: Subject<boolean> = new Subject();
  kioskDeviceSendMessageSubject: Subject<string> = new Subject();
  kioskDeRegisterSubject: Subject<void> = new Subject();
  kioskStandBySubject: Subject<boolean> = new Subject();
  kioskShutdownSubject: Subject<string> = new Subject();
  ReconnectedSubject: Subject<string> = new Subject();

  MonitorExecutionQueueSubject: Subject<IMonitorExecutionQueue> = new Subject();
  MonitorExecutionAnnouncementSubject: Subject<any> = new Subject();
  MobileMonitorExecutionSubject: Subject<MobileMonitorRequest> = new Subject();

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService,
    private readonly kioskAPIService: KioskAPIService,
    private connectionMonitoringService: ConnectionMonitoringService
  ) {
    super();
    this.signalR = new LaviSignalRConnection(this.ApiBaseUrl, httpClient, true, "CORE-SIGNALR", "Id",
      (c) => {
        c.on(KioskAction.DeviceCode, (otp) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.DeviceCode,otp);
          this.kioskDeviceCodeSubject.next(otp);
        });

        c.on(KioskAction.RedirectToKioskExecution, (token) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.RedirectToKioskExecution,token);
          this.SubmitCodeResponseSubject.next(token);
        });

        c.on(KioskAction.RefreshKioskDevice, (m) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.RefreshKioskDevice,m);
          this.refreshWindowSubject.next(true);
        });

        c.on(KioskAction.sendMessageKioskDevice, (message) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.sendMessageKioskDevice,message);
          this.kioskDeviceSendMessageSubject.next(message);
        });

        c.on(KioskAction.deRegisterKioskDevice, (message) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.deRegisterKioskDevice,message);
          this.kioskDeRegisterSubject.next();
        });

        c.on(KioskAction.shutDownKioskDevice, (value) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.shutDownKioskDevice,value);
          this.kioskStandBySubject.next(value);
        });


        c.on(KioskAction.updateMonitor, (value: IMonitorExecutionQueue) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.updateMonitor,value);
          this.MonitorExecutionQueueSubject.next(value);
        });

        c.on(KioskAction.updateMobileMonitor, (value: MobileMonitorRequest) => {
          this.connectionMonitoringService.NewDataMessage(KioskAction.updateMobileMonitor,value);
          this.MobileMonitorExecutionSubject.next(value);
        });

      },
      // when reconnection happens
      () => {
        this.ReconnectedSubject.next(this.signalR.id);
      },
      // Status change messages
      (m)=> {
        this.connectionMonitoringService.NewStatus(this.signalR, m);
      },
      // when start happens
      () => {
        if (this.otpRequired) {
          this.getOtpCode(this.signalR.id).subscribe();
        }
      }
    );
  }

  private otpRequired = false;

  initSignalRConnectionWithGetDeviceId(value: string) {
    this.otpRequired = true;
    this.signalR.Start(value);
  }

  init(value: string) {
    this.signalR.Start(value);
  }

  private getOtpCode(value: string): Observable<string> {
    return this.kioskAPIService.GetOTP(value);
  }

  async stopSignalRConnection() {
    await this.signalR.Stop();
  }
  /*
  private getConnectionInfo(value: string): Observable<SignalRConnectionInfo> {
    const requestUrl = `${this.ApiBaseUrl}/negotiate`;
    return this.httpClient.get<SignalRConnectionInfo>(requestUrl, this.GetHttpHeader(value));
  }

  private GetHttpHeader(value: string) {
    return {
      headers: new HttpHeaders(
        { 'x-ms-client-principal-id': value },
      )
    };
  }

  private getOtpCode(value: string): Observable<string> {
    return this.kioskAPIService.GetOTP(value);
  }

  initSignalRConnectionWithGetDeviceId(value: string) {
    this.getConnectionInfo(value).subscribe(info => {
      this.startSignalRConnectionAndSubscribeEvents(info, value, true);
    });
  }

  init(value: string) {
    this.getConnectionInfo(value).subscribe(info => {
      this.startSignalRConnectionAndSubscribeEvents(info, value, false);
    });
  }

  private startSignalRConnectionAndSubscribeEvents(info: SignalRConnectionInfo, value: string, otpRequired: boolean = false) {
    // make compatible with old and new SignalRConnectionInfo
    info.accessToken = info.accessToken || info.accessKey;
    info.url = info.url || info.endpoint;
    const options = {
      accessTokenFactory: () => info.accessToken
    };
    this.connection = new HubConnectionBuilder()
      .withUrl(info.url, options)
      .withAutomaticReconnect()
      .build();

    this.connection.on(KioskAction.DeviceCode, (otp) => {
      this.kioskDeviceCodeSubject.next(otp);
    });

    this.connection.on(KioskAction.RedirectToKioskExecution, (token) => {
      this.SubmitCodeResponseSubject.next(token);
    });

    this.connection.on(KioskAction.RefreshKioskDevice, () => {
      this.refreshWindowSubject.next(true);
    });

    this.connection.on(KioskAction.sendMessageKioskDevice, (message) => {
      this.kioskDeviceSendMessageSubject.next(message);
    });

    this.connection.on(KioskAction.deRegisterKioskDevice, () => {
      this.kioskDeRegisterSubject.next();
    });

    this.connection.on(KioskAction.shutDownKioskDevice, (value) => {
      this.kioskStandBySubject.next(value);
    });


    this.connection.on(KioskAction.updateMonitor, (value: IMonitorExecutionQueue) => {
      this.MonitorExecutionQueueSubject.next(value);
    });

    this.connection.on(KioskAction.updateMobileMonitor, (value: MobileMonitorRequest) => {
      this.MobileMonitorExecutionSubject.next(value);
    });

    this.connection.onclose(() => {
      console.log('disconnected');
      this.init(value);
    });

    this.connection.start()
      .then(() => {
        console.log('connected!');
        if (otpRequired) {
          this.getOtpCode(value).subscribe();
        }
      })
      .catch(console.error);
  }

  async stopSignalRConnection() {
    await this.connection.stop().catch(console.error);
  }
  */
}


