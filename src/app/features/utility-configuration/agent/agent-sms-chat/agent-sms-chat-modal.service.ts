import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '@progress/kendo-angular-conversational-ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { IAgentCustomersListItem } from '../models/agent-models';
import {
  IPostSMS,
  IRequestConversation
} from '../models/phone-number-request-map.interface';
import { IWorkFlow } from '../utility-services/models/workflow-models/workflow-interface';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentSMSChatModalService extends AbstractComponentService {
  Connection: HubConnection;
  User: User;
  CurrentCustomer: IAgentCustomersListItem;
  CustomerDisplayField: string;
  private MessagesSubject: BehaviorSubject<IRequestConversation[]>;
  Messages$: Observable<IRequestConversation[]>;

  private CustomerNameSubject: BehaviorSubject<string>;
  CustomerName$: Observable<string>;

  private IsChatDialogShowSubject: BehaviorSubject<boolean>;
  IsChatDialogShow$: Observable<boolean>;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }
  private AllowBiDirectionalSubject: BehaviorSubject<boolean>;
  AllowBiDirectional$: Observable<boolean>;
  /**
   *
   */
  constructor(
    private httpClient: HttpClient,
    private stationDetailsService: AgentStationDataService,
    private agentAPIService: AgentAPIService
  ) {
    super();
    this.SetObservables();
  }

  SetObservables() {
    this.User = {
      id: this.authService.UserId,
      avatarUrl: this.authService.UserImage,
      name: this.authService.UserName,
    };
    this.IsChatDialogShowSubject = new BehaviorSubject<boolean>(false);
    this.IsChatDialogShow$ = this.IsChatDialogShowSubject.asObservable();

    this.MessagesSubject = new BehaviorSubject<IRequestConversation[]>([]);
    this.Messages$ = this.MessagesSubject.asObservable();

    this.CustomerNameSubject = new BehaviorSubject<string>('');
    this.CustomerName$ = this.CustomerNameSubject.asObservable();

    this.AllowBiDirectionalSubject = new BehaviorSubject<boolean>(false);
    this.AllowBiDirectional$ = this.AllowBiDirectionalSubject.asObservable();
  }

  async ShowSMSChatModal(request: IAgentCustomersListItem) {
 
    if (!this.stationDetailsService?.BranchDetails?.smsPhoneNumber?.id) {
      this.AppNotificationService.NotifyError(CommonMessages.SMSNotLinked);
      return;
    }

    this.InitSignalR(request.id);
    const Messages = await this.agentAPIService
      .GetSMSListByRequestId<IRequestConversation>(request.id)
      .toPromise();

    this.MessagesSubject.next(Messages);
    this.CurrentCustomer = request;
    this.CustomerNameSubject.next(this.GetCustomerName());
    this.AllowBiDirectionalSubject.next(this.stationDetailsService?.AgentConfigurations?.sMSMessaging.allowBiDirectional);
    this.IsChatDialogShowSubject.next(true);
  }

  HideChatModal() {
    this.IsChatDialogShowSubject.next(false);
  }

  async SendSMS(Text: string) {
     if (
      !this.stationDetailsService?.AgentConfigurations?.sMSMessaging
        ?.allowBiDirectional
    ) {
      this.AppNotificationService.NotifyError(
        CommonMessages.SMSNotAvailableMessage
      );
      return;
    }
    const SMS: IPostSMS = {
      id: this.uuid,
      agentId: this.authService.UserId,
      agentName: this.authService.UserName,
      customerId: this.CurrentCustomer.id,
      smsText: Text,
      customerName: this.GetCustomerName(),
      customerNumber: this.GetCustomerNumber(),
    };
    if (!SMS?.customerNumber) {
      this.AppNotificationService.NotifyError(CommonMessages.SMSNotProvided);
      return;
    }
    
    this.agentAPIService
      .SendSMSToCustomer<IPostSMS,IRequestConversation>(this.CurrentCustomer.id, SMS).subscribe(x=>{
        const messages = this.MessagesSubject.value;
        this.MessagesSubject.next(messages.concat(x));
      })
    //   .toPromise();
  }

  GetCustomerNumber(): string {
    const workflow = this.stationDetailsService.Workflow;
   
    if (this.CurrentCustomer) {
      let CustomerNumber = this.CurrentCustomer?.agentQuestions?.find(
        (x) => this.IsSmsType(x.questionId, workflow) && x.answer
      )?.answer;
      return CustomerNumber;
    }
    return '';
  }

  GetCustomerName(): string {
    if (this.CurrentCustomer) {
      const displayFields = this.CurrentCustomer?.displayFields[0]?.answer;
        return (displayFields) ? displayFields : this.CurrentCustomer?.ticketNumber;

      }
    return '';
  }

  IsSmsType(id: string, workflow: IWorkFlow): boolean {
    const isInPreService = workflow?.preServiceQuestions?.find(
      (x) => x.id == id && x.type == QuestionType.SMSPhoneNumber.value
    );

    if (isInPreService) {
      return true;
    }

    const ServiceQuestions = GetConcatenatedArray(
      workflow.questionSets,
      (x) => x.questions
    );

    const isInServiceQuestions = ServiceQuestions?.find(
      (x) => x.id == id && x.type == QuestionType.SMSPhoneNumber.value
    );

    return isInServiceQuestions ? true : false;
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
      SignalRActions.NewSMSMessage,
      (SMS: IRequestConversation) => {
        if(SMS.pk == this.CurrentCustomer.id){
        const Messages = this.MessagesSubject.value;
        this.MessagesSubject.next(
          Messages.filter((x) => x.id != SMS.id).concat(SMS)
        );
      }
    }
    );

    this.Connection.onclose(() => console.log('disconnected'));

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

  Destroy() {
    this.StopSignalRConnection();
  }
}

const SignalRActions = {
  NewSMSMessage: 'SMS_NEW_OR_UPDATED',
};

function GetConcatenatedArray<T, F>(arr: T[], resolver: (x: T) => F[]): F[] {
  return arr?.reduce((prev, curr) => {
    return prev.concat(resolver(curr) || []);
  }, []);
}
