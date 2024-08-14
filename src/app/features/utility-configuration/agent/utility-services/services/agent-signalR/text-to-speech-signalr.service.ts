import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { TextToSpeechSignalRActions } from '../../models/agent-signalr/text-to-speech-action-constants';

@Injectable()
export class TextToSpeechSignalRService extends AbstractService {

  Connection: HubConnection;
  public SubjectTextToSpeech: BehaviorSubject<any>;
  public TextToSpeech$: Observable<any>;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService,
  ) {
    super();
    this.SetObservables();
  }
  SetObservables() {
    this.SubjectTextToSpeech = new BehaviorSubject<any>(null);
    this.TextToSpeech$ = this.SubjectTextToSpeech.asObservable();
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

  InitSignalRConnectionWithGetDeviceId(value: string) {
    this.GetConnectionInfo(value).subscribe((info) => {
      this.StartSignalRConnectionAndSubscribeEvents(info, value);
    });
  }

  Init(value: string) {
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

    this.Connection.on(TextToSpeechSignalRActions.queueAnnouncement, (data) => {
      this.SubjectTextToSpeech.next(data);
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

}
