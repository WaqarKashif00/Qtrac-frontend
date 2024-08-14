import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IRequestConversation, SMSDirectionType } from '../../models/phone-number-request-map.interface';

@Component({
  selector: 'lavi-agent-sms-message-row',
  templateUrl: './agent-sms-message-row.component.html',
  styleUrls: ['./agent-sms-message-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentSMSMessageRowComponent extends AbstractComponent {


  @Input() Message: IRequestConversation;

  get ClassName(): string {
    return this.GetClassNameFromType(this.Message);
  }

  /**
   *
   */
  constructor() {
    super();
  }

  private GetClassNameFromType(Message: IRequestConversation): string {
    switch (Message?.smsType) {
      case SMSDirectionType.INCOMING:
        return 'incoming-message';
      case SMSDirectionType.OUTGOING:
        return 'outgoing-message';
      default:
        return '';
    }
  }


}