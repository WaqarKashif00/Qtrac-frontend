import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, Input,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { TimeDisplayInQueue } from 'src/app/models/enums/time-display-in-queue.enum';
import { CommonMessages } from '../../../../../models/constants/message-constant';
import {
  IAgentCustomersListItem,
  IGroupDetails,
  IQuestion,
  IQueueDetails
} from '../../models/agent-models';
import { ServeButtonText } from '../../utility-services/constants/agent.constant';
import { AgentQueueGridService } from './agent-queue-grid.service';

@Component({
  selector: 'lavi-agent-queue-grid',
  styleUrls: ['./agent-queue-grid.component.scss'],
  templateUrl: './agent-queue-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AgentQueueGridService],
})
export class AgentQueueGridComponent extends AbstractComponent {
  @Input() IsSmallQueue: boolean;
  @Output() OnTransferServiceDailog: EventEmitter<void>;
  @Input() IsFiltersShow: boolean;
  @Input() IsGroupsSidebarShow: boolean;
  @Input() queueText: string;
  @Input() visitorTagText: string;
  @Input() currentLanguage: string;
  @Input() viewText: string;
  @Input() teamNotesText: string;
  @Input() messageText: string

  Customers$: Observable<IAgentCustomersListItem[]>;
  SearchData$: Observable<string>;
  DisplayFieldsHeaders$: Observable<IQuestion[]>;
  SelectedCustomers$: Observable<IAgentCustomersListItem[]>;
  ExpandedCustomers$: Observable<IAgentCustomersListItem[]>;
  IsSelectAll$: Observable<boolean>;
  IsAnySelected$: Observable<boolean>;
  IsCanServe$: Observable<boolean>;
  Queues$: Observable<IQueueDetails[]>;
  Groups$: Observable<IGroupDetails[]>;
  allowServeMultiple: boolean;
  TransferServiceDailogStatus: boolean = false;
  BranchTimeZone$: Observable<any>;
  AllowNotes$: Observable<boolean>;
  AllowTicketDeletion$: Observable<boolean>;
  AllowTicketRepositioning$: Observable<boolean>;
  AllowSMS$: Observable<boolean>;
  AllowGrouping$: Observable<boolean>;
  AllowToCreateGroup$: Observable<boolean>;
  AllowSelectedVisitorCalling$: Observable<boolean>;
  HideTicketNumber$: Observable<boolean>
  AllowTransferBetweenServices$: Observable<boolean>;
  ServeButtonLabel$: Observable<string>;
  IsDisplayWaitTime$: Observable<boolean>;
  PageNumber: number = 1;

  ServeButtonText = ServeButtonText;

  get IsAppointmentTemplateExist() {
    return this.service.IsAppointmentTemplateExist;
  }

  constructor(private service: AgentQueueGridService) {
    super();
    this.OnTransferServiceDailog = new EventEmitter();
    this.Customers$ = this.service.Customers$
    this.SearchData$ = this.service.SearchData$
    this.BranchTimeZone$ = this.service.BranchTimeZone$;
    this.allowServeMultiple = this.service.AllowServeMultiple;
    this.Queues$ = this.service.Queues$;
    this.Groups$ = this.service.Groups$;
    this.SelectedCustomers$ = this.service.SelectedCustomers$;
    this.ExpandedCustomers$ = this.service.ExpandedCustomers$;
    this.AllowNotes$ = this.service.AllowNotes$;
    this.AllowTicketDeletion$ = this.service.AllowTicketDeletion$;
    this.AllowTicketRepositioning$ = this.service.AllowTicketRepositioning$;
    this.AllowSMS$ = this.service.AllowSMS$;
    this.AllowGrouping$ = this.service.AllowGrouping$;
    this.AllowToCreateGroup$ = this.service.AllowToCreateGroup$;
    this.AllowSelectedVisitorCalling$ = this.service.AllowSelectedVisitorCalling$;
    this.HideTicketNumber$ = this.service.HideTicketNumber$;
    this.IsAnySelected$ = this.service.SelectedCustomers$.pipe(
      map((selected) => selected.length > 0)
    );
    this.IsDisplayWaitTime$ = this.service.TimeInQueueId$.pipe(
      map((selected) => selected === TimeDisplayInQueue.WaitingTime)
    );


    this.DisplayFieldsHeaders$ = this.service.DisplayFieldsHeaders$;

    this.IsCanServe$ = this.service.IsCanServe$;
    this.AllowTransferBetweenServices$ =
      this.service.AllowTransferBetweenServices$;
    this.ServeButtonLabel$ = this.service.ServeButtonLabel$;
      
  }




  Expanded(id): void {
    this.service.SetExpanded(id, true);
  }

  Collapsed(id): void {
    this.service.SetExpanded(id, false);
  }

  Checked(id: string, state: boolean): void {
    this.service.SetSelected(id, state);
  }

  DeSelectAll(): void {
    this.service.DeSelectAll();
  }

  SelectAll(): void {
    this.service.SelectAll();
  }

  Call(customer: IAgentCustomersListItem) {
    this.service.Call(customer);
  }

  Serve(customer: IAgentCustomersListItem) {
    this.service.Serve(customer);
  }

  Remove(customer: IAgentCustomersListItem) {
    this.service.Delete(customer);
  }

  ShowInformation(customer: IAgentCustomersListItem): void {
    this.service.ShowInformation(customer);
  }

  CallSelected(): void {
    this.service.CallSelected();
  }

  CallNext(): void {
    this.service.CallNext();
  }

  ServeSelected(): void {
    this.service.ServeSelected();
  }

  DeleteSelected(): void {
    this.service.DeleteSelected();
  }

  FeatureIsComingSoonNotification() {
    this.service.AppNotificationService.NotifyInfo(
      CommonMessages.FeatureComingSoonMessage
    );
  }

  ShowSMSChat(customer: IAgentCustomersListItem) {
    this.service.ShowSMSChat(customer);
  }

  ShowNotes(customer: IAgentCustomersListItem) {
    this.service.ShowNotes(customer);
  }

  AddToCustomerToGroup(customer: IAgentCustomersListItem) {
    this.service.AddToCustomerToGroup(customer);
  }

  OpenGroupsDialog() {
    this.service.ShowGroupsDialog();
  }

  ShowMoveToPositionDialog(customer: IAgentCustomersListItem) {
    this.service.ShowMoveToPositionDialog(customer);
  }
  ShowTransferServiceDialog(customer: IAgentCustomersListItem): void {
    this.service.ShowTransferServiceDialog(customer);
  }

  trackByCustomer(index: number, customer): number {
    return customer.id;
  }

}

