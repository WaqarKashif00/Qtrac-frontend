import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  IAgentCustomersListItem,
  IQuestion
} from 'src/app/features/utility-configuration/agent/models/agent-models';
import { AppNotificationService } from '../../../../../../core/services/notification.service';
import { CommonMessages } from '../../../../../../models/constants/message-constant';
import { ServeButtonText } from '../../../utility-services/constants/agent.constant';

@Component({
  selector: 'lavi-agent-station-action-buttons',
  styleUrls: ['./agent-station-action-buttons.component.scss'],
  templateUrl: './agent-station-action-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentStationActionButtonsComponent extends AbstractComponent {
  @Input() Customer: IAgentCustomersListItem;
  @Input() IsFullView: boolean;
  @Input() IsServingByOther: boolean;
  @Input() IsCanServe: boolean;
  @Input() AllowedNotes: boolean;
  @Input() AllowTicketDeletion: boolean;
  @Input() AllowedSMS: boolean;
  @Input() AllowTransferingService: boolean;
  @Input() MaxCallLimit: number;
  @Input() ServeButtonLabel: string;
  @Input() AllowTakeOverCustomer: boolean
  @Input() HideTicketNumber: boolean
  @Input() AllowSelectedVisitorCalling: boolean;
  @Input() AllowCancellingService: boolean;
  @Input() teamNotesText: string;
  @Input() messageText: string;
  @Input() currentLanguage: string;
  @Input() noShowText: string;
  @Input() callingText: string;
  @Input() servingText: string;

  @Output() OnCall: EventEmitter<void>;
  @Output() OnServe: EventEmitter<void>;
  @Output() OnEndServing: EventEmitter<void>;
  @Output() OnDelete: EventEmitter<void>;
  @Output() OnShowSMSChat: EventEmitter<void>;
  @Output() OnShowNotes: EventEmitter<void>;
  @Output() OnCancel: EventEmitter<void>;
  @Output() OnTransferServiceDailog: EventEmitter<void>;

  ServeButtonText = ServeButtonText;

  get ClientTimeZoneOffset(): string {
    return new Date().getTimezoneOffset().toString();
  }

  get TimerStle(): any {
    return {};
  }

  get PrimaryDisplayFieldValue(): any {
    if (this.Customer && this.Customer?.displayFields?.length > 0) {
      const displayField = this.Customer.displayFields[0];
      if (displayField?.answer) {
        return displayField.answer;
      }
    }
    return this.Customer?.ticketNumber;
  }

  get DisplayFieldsExcludePrimary(): IQuestion[] {
    if (this.Customer) {
      return this.Customer.agentQuestions?.filter(
        (question) => question.displayFieldPriority > 1
      );
    } else {
      return [];
    }
  }

  constructor(private readonly appNotificationService: AppNotificationService) {
    super();
    this.IsFullView = false;
    this.InitializeOutputs();
  }

  InitializeOutputs() {
    this.OnCall = new EventEmitter();
    this.OnServe = new EventEmitter();
    this.OnEndServing = new EventEmitter();
    this.OnDelete = new EventEmitter();
    this.OnShowSMSChat = new EventEmitter();
    this.OnShowNotes = new EventEmitter();
    this.OnCancel = new EventEmitter();
    this.OnTransferServiceDailog = new EventEmitter();
  }

  Call(): void {
    this.OnCall.emit();
  }

  Serve(): void {
    this.OnServe.emit();
  }

  EndServing(): void {
    this.OnEndServing.emit();
  }

  Delete(): void {
    this.OnDelete.emit();
  }

  FeatureIsComingSoonNotification() {
    this.appNotificationService.NotifyInfo(
      CommonMessages.FeatureComingSoonMessage
    );
  }

  OpenTransferServiceDailog(): void {
    this.OnTransferServiceDailog.emit();
  }

  OpenSMSChatDialog(): void {
    this.OnShowSMSChat.emit();
  }

  OpenNotesDialog(): void {
    this.OnShowNotes.emit();
  }


  Cancel(): void {
    this.OnCancel.emit();
  }
}
