import { ChangeDetectionStrategy, Component} from '@angular/core';
import { Message, SendMessageEvent, User } from '@progress/kendo-angular-conversational-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IRequestConversation } from '../models/phone-number-request-map.interface';
import { AgentSMSChatModalService } from './agent-sms-chat-modal.service';

@Component({
  selector: 'lavi-agent-sms-chat-modal',
  templateUrl: './agent-sms-chat-modal.component.html',
  styleUrls: ['./agent-sms-chat-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentSMSChatModalComponent extends AbstractComponent {

  IsChatDialogShow$: Observable<boolean>;

  ChatMessages$: Observable<Message[]>;

  Messages$: Observable<IRequestConversation[]>;
  CustomerName$: Observable<string>;
  CustomerName: string;

  User: User;
  AllowBiDirectional$: Observable<boolean>;
  /**
   *
   */
  constructor(private service: AgentSMSChatModalService) {
    super();
    this.IsChatDialogShow$ = service.IsChatDialogShow$;
    this.Messages$ = service.Messages$;
    this.CustomerName$ = service.CustomerName$;
    this.subs.sink = service.CustomerName$.subscribe(name => this.CustomerName = name);
    this.User = this.service.User;
    this.AllowBiDirectional$ = this.service.AllowBiDirectional$;
    this.ChatMessages$ = service.Messages$.pipe(map(messages => {
      return messages.map(x => {
        const CurrentCustomerId = this.service?.CurrentCustomer?.id;
        const msg: Message = {
          author: {
            id: x.senderId,
            name: CurrentCustomerId == x.senderId ? this.CustomerName : x.senderName
          },
          text: x.smsText,
          timestamp: new Date(x.smsTimeUTCString),
          status:'unread'
        };
        return msg;
      });
    }));
  }

  Destroy() {
    this.service.Destroy();
  }

  Close(): void {
    this.service.HideChatModal();
  }

  public SendMessage(e: SendMessageEvent): void {
    this.service.SendSMS(e.message.text);
  }

}