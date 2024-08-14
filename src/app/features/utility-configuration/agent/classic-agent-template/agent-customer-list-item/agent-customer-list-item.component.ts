import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  IAgentCustomersListItem,
  IGroupDetails,
  IQuestion,
  IQueueDetails
} from 'src/app/features/utility-configuration/agent/models/agent-models';
import { AppNotificationService } from '../../../../../core/services/notification.service';
import { CommonMessages } from '../../../../../models/constants/message-constant';
import { OnChange } from '../../../../../shared/decorators/onchange.decorator';
import { ServeButtonText } from '../../utility-services/constants/agent.constant';

@Component({
  selector: 'lavi-agent-customer-list-item',
  styleUrls: ['./agent-customer-list-item.component.scss'],
  templateUrl: './agent-customer-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCustomerListItemComponent extends AbstractComponent {
  // Inputs Properties
  @Input() Customer: IAgentCustomersListItem;
  @Input() IsSelectAll: boolean;
  @Input() IsCanServe: boolean;
  @Input() IsSmallQueue: boolean;
  @Input() AllowedNotes: boolean;
  @Input() AllowTicketDeletion: boolean;
  @Input() AllowTicketRepositioning: boolean;
  @Input() AllowedSMS: boolean;
  @Input() AllowedGrouping: boolean;
  @Input() AllowToCreateGroup: boolean;
  @Input() AllowTransferBetweenServices: boolean;
  @Input() AllowSelectedVisitorCalling: boolean;
  @Input() HideTicketNumber: boolean;
  @Input() Queues: IQueueDetails[];
  @Input() Groups: IGroupDetails[];
  @Input() timeZone: string = '';
  @Input() ServeButtonLabel: string = '';
  @Input() IsDisplayWaitTime: boolean = true;
  @Input() IsAppointmentTemplateExist: boolean;
  @Input() viewText: string;
  @Input() currentLanguage: string;
  @Input() teamNotesText: string;
  @Input() messageText: string

  @OnChange('UpdateIsSelectedProperty')
  @Input()
  SelectedCustomers: IAgentCustomersListItem[];

  @OnChange('UpdateIsExpandedProperty')
  @Input()
  ExpandedCustomers: IAgentCustomersListItem[];

  @Input() DisplayFieldsHeaders: IQuestion[];

  // Output properties
  @Output() OnExpand: EventEmitter<void>;
  @Output() OnCollapse: EventEmitter<void>;
  @Output() OnChecked: EventEmitter<boolean>;
  @Output() OnCall: EventEmitter<void>;
  @Output() OnServe: EventEmitter<void>;
  @Output() OnRemove: EventEmitter<void>;
  @Output() OnShowInformation: EventEmitter<void>;
  @Output() OnTransferServiceDailog: EventEmitter<void>;
  @Output() OnShowSMSChat: EventEmitter<void>;
  @Output() OnShowNotes: EventEmitter<void>;
  @Output() OnAddToGroup: EventEmitter<void>;
  @Output() OnShowMoveToPosition: EventEmitter<void>;

  // fields
  IsExpanded: boolean;
  IsSelected: boolean;

  IsSMSChatOpen: boolean;

  ClientTimeZoneOffset: string;

  ServeButtonText = ServeButtonText;

  get UtcTime(): Date {
    return new Date(this.Customer.utcTimeString);
  }

  get QueueName(): string {
    if (this.Queues && this.Queues.length > 0) {
      return this.Queues.find((x) => x.id === this.Customer.queueId)
        ?.queueNumber;
    } else {
      return '';
    }
  }

  get CustomerGroups(): IGroupDetails[] {
    if (this.Customer?.groups && this.Groups) {
      return this.Groups.filter((g) =>
        this.Customer?.groups.find((x) => x == g.id)
      );
    }
    return [];
  }

  get ActualTimeFormat(): string {
    if(!this.Customer.utcTimeString){
      return  'HH:mm';
    }
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let customerRegisterDate = new Date(new Date(this.Customer.utcTimeString).toLocaleString()).setHours(0, 0, 0, 0);
    return customerRegisterDate==currentDate? 'HH:mm'
      : 'MMM d, y HH:mm';
  }
  constructor(private readonly appNotificationService: AppNotificationService) {
    super();
    this.Queues = [];
    this.SelectedCustomers = [];
    this.ClientTimeZoneOffset = new Date().getTimezoneOffset().toString();
    this.OnExpand = new EventEmitter();
    this.OnCollapse = new EventEmitter();
    this.OnCall = new EventEmitter();
    this.OnServe = new EventEmitter();
    this.OnRemove = new EventEmitter();
    this.OnChecked = new EventEmitter<boolean>();
    this.OnShowInformation = new EventEmitter();
    this.OnTransferServiceDailog = new EventEmitter();
    this.OnShowSMSChat = new EventEmitter();
    this.OnShowNotes = new EventEmitter();
    this.OnAddToGroup = new EventEmitter();
    this.OnShowMoveToPosition = new EventEmitter();
    this.IsExpanded = false;
    this.IsSelected = false;    
  }

  Init() {
    this.UpdateIsSelectedProperty();
    this.UpdateIsExpandedProperty();
  }

  private UpdateIsExpandedProperty() {
    this.IsExpanded = this.Customer
      ? this.ExpandedCustomers.some((x) => x.id === this.Customer.id)
      : false;

  }

  private UpdateIsSelectedProperty() {
    this.IsSelected = this.Customer
      ? this.SelectedCustomers.some((x) => x.id === this.Customer.id)
      : false;
      
  }

  GetAnswer(id: string): any {
    if (!id) {
      return null;
    }
    if (!this.Customer) {
      return null;
    }
    if (!this.Customer.displayFields) {
      return null;
    }

    const question = this.Customer.displayFields.find(
      (c) => c.questionId === id
    );
    return question;
  }

  ToggleExpand(): void {
    this.IsExpanded = !this.IsExpanded;
    this.IsExpanded ? this.OnExpand.emit() : this.OnCollapse.emit();
  }

  Checked(): void {
    this.IsSelected = !this.IsSelected;
    this.OnChecked.emit(this.IsSelected);
  }

  Call(): void {
    this.OnCall.emit();
  }

  Serve(): void {
    this.OnServe.emit();
  }

  Remove(): void {
    this.OnRemove.emit();
  }

  ShowInformation(): void {
    this.OnShowInformation.emit();
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

  AddToGroup(): void {
    this.OnAddToGroup.emit();
  }

  MoveToPosition(): void {
    this.OnShowMoveToPosition.emit();
  }
}
