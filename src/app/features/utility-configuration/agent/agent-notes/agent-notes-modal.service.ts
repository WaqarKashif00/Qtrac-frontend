import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '@progress/kendo-angular-conversational-ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { IAgentCustomersListItem } from '../models/agent-models';
import { NoteStatus } from '../models/notes/note-status.enum';
import { INote } from '../models/notes/note.inteface';
import { IPostNote } from '../models/notes/post-note-interface';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentNotesModalService extends AbstractComponentService {
  Connection: HubConnection;
  User: User;

  BranchId: string;

  CurrentCustomer: IAgentCustomersListItem;
  CustomerDisplayField: string;
  private MessagesSubject: BehaviorSubject<INote[]>;
  Messages$: Observable<INote[]>;

  private CustomerNameSubject: BehaviorSubject<string>;
  CustomerName$: Observable<string>;

  private IsChatDialogShowSubject: BehaviorSubject<boolean>;
  IsChatDialogShow$: Observable<boolean>;

  get ApiBaseUrl() {
    return this.appConfigService.config.AzureFunctionBaseAPIUrl;
  }

  private ShowUnread: boolean;

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
    this.ShowUnread = false;
  }

  SetObservables() {
    this.BranchId = this.stationDetailsService.BranchId;
    this.User = {
      id: this.authService.UserId,
      avatarUrl: this.authService.UserImage,
      name: this.authService.UserName,
    };
    this.IsChatDialogShowSubject = new BehaviorSubject<boolean>(false);
    this.IsChatDialogShow$ = this.IsChatDialogShowSubject.asObservable();

    this.MessagesSubject = new BehaviorSubject<INote[]>([]);
    this.Messages$ = this.MessagesSubject.asObservable();

    this.CustomerNameSubject = new BehaviorSubject<string>('');
    this.CustomerName$ = this.CustomerNameSubject.asObservable();
  }

  async ShowNotesModal(request: IAgentCustomersListItem) {
    if (
      !this.stationDetailsService?.AgentConfigurations?.allowCommentingOnTicket
    ) {
      this.AppNotificationService.NotifyError(
        CommonMessages.NotesNotAvailableMessage
      );
      return;
    }

    this.InitSignalR(request.id);

    let Messages = await this.agentAPIService
      .GetNotesByRequestId<INote>(request.id)
      .toPromise();

    const LastReadNote = await this.agentAPIService
      .GetLastReadNoteByRequestId<INote>(this.authService.UserId, request.id)
      .toPromise();

    if (Messages && Messages.length > 0) {
      await this.agentAPIService
        .UpdateLastReadNoteByRequestId<any, INote>(
          this.authService.UserId,
          request.id,
          Messages[Messages.length - 1]
        )
        .toPromise();
    }

    if (this.ShowUnread) {
      if (LastReadNote) {
        const LocalLastNote = Messages.find((x) => x.id == LastReadNote.id);
        let index = Messages.indexOf(LocalLastNote);
        if (index != Messages.length - 1) {
          Messages.splice(index + 1, 0, this.UnreadTemplate(Messages[index]));
        }
      } else {
        Messages.splice(0, 0, this.UnreadTemplate(Messages[0]));
      }
    }

    this.MessagesSubject.next(Messages);
    this.CurrentCustomer = request;
    this.CustomerNameSubject.next(this.GetCustomerName());
    this.IsChatDialogShowSubject.next(true);
  }

  UnreadTemplate(PrevNote: INote): INote {
    return {
      id: '',
      noteStatus: NoteStatus.Unread,
      noteText: null,
      noteTimeUTCString: PrevNote?.noteTimeUTCString,
      pk: null,
      senderId: this.authService.UserId,
      senderImageUrl: null,
      senderName: null,
      type: null,
    };
  }

  HideChatModal() {
    this.IsChatDialogShowSubject.next(false);
  }

  async SendNote(Text: string) {
    const Note: IPostNote = {
      id: this.uuid,
      agentId: this.authService.UserId,
      agentName: this.authService.UserName,
      customerId: this.CurrentCustomer.customerId,
      noteText: Text,
      branchId: this.BranchId,
      queueId: this.CurrentCustomer.queueId,
      senderImageUrl: this.authService.UserImage,
    };

    this.UpdateTempNote(Note);
  
    this.agentAPIService
    .SendNoteToCustomer<IPostNote, INote>(this.CurrentCustomer.id, Note)
    .subscribe((note) => {
        const notes = this.MessagesSubject.value;
        this.MessagesSubject.next(notes.filter((y) => y.id != note.id).concat(note));
      });
  }

  private UpdateTempNote(Note: IPostNote) {
    const Messages = this.MessagesSubject.value;
    this.MessagesSubject.next(
      Messages.concat({
        id: Note.id,
        type: '',
        pk: '',
        senderId: Note.agentId,
        senderName: Note.agentName,
        noteStatus: NoteStatus.SENDING,
        noteText: Note.noteText,
        senderImageUrl: Note.senderImageUrl,
        noteTimeUTCString: new Date().toUTCString(),
      })
    );
  }

  GetCustomerName(): string {
    if (this.CurrentCustomer) {
      const displayFields = this.CurrentCustomer?.displayFields[0]?.answer;
        return (displayFields) ? displayFields : this.CurrentCustomer?.ticketNumber;
      }
    return '';
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

    this.Connection.on(SignalRActions.NewNote, async (SMS: INote) => {
      if(SMS.pk == this.CurrentCustomer.id){
      const Messages = this.MessagesSubject.value;
      if (this.ShowUnread && this.IsChatDialogShowSubject.value) {
        await this.agentAPIService
          .UpdateLastReadNoteByRequestId<any, INote>(
            this.authService.UserId,
            this.CurrentCustomer.id,
            SMS
          )
          .toPromise();
      }
      this.MessagesSubject.next(
        Messages.filter((x) => x.id != SMS.id).concat(SMS)
      );
    }
    });

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
  NewNote: 'REQUEST_NOTE_NEW_OR_UPDATED',
};
