import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Input
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  IAgentCustomersListItem,
  IGroupDetails
} from '../../models/agent-models';
import { ServeButtonText } from '../../utility-services/constants/agent.constant';
import { AgentStationDataService } from '../../utility-services/services/agent-station-data-service/agent-station-data.service';
import { AgentGroupsModalService } from '../agent-group-modal/agent-group-modal.service';
import { AgentStationPanelService } from './agent-station-panel.service';

@Component({
  selector: 'lavi-agent-station-panel',
  styleUrls: ['./agent-station-panel.component.scss'],
  templateUrl: './agent-station-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AgentStationPanelService],
})
export class AgentStationPanelComponent extends AbstractComponent {
  @Input() teamNotesText: string;
  @Input() messageText: string;
  @Input() currentLanguage: string;
  @Input() noShowText: string;
  @Input() visitorTagText: string;
  @Input() queueText: string;
  @Input() viewText: string;
  @Input() callingText: string;
  @Input() servingText: string;

  Customers$: Observable<IAgentCustomersListItem[]>;
  OtherServingCustomers$: Observable<IAgentCustomersListItem[]>;

  IsSelectAll$: Observable<boolean>;

  IsShowOthersServing$: Observable<boolean>;
  IsExpanded$: Observable<boolean>;
  IsAnySelected$: Observable<boolean>;

  IsCanServe$: Observable<boolean>;

  MaxCallLimit$: Observable<number>;
  CanEndMultiple$: Observable<boolean>;
  CanServeMultiple$: Observable<boolean>;
  CanCallMultiple$: Observable<boolean>;
  AllowNotes$: Observable<boolean>;
  AllowTicketDeletion$: Observable<boolean>;
  AllowSMS$: Observable<boolean>;
  AllowTakeOverCustomer$: Observable<boolean>;
  AllowCancellingService$: Observable<boolean>;
  AllowGrouping$: Observable<boolean>;
  AllowTransferingService$: Observable<boolean>;
  AllowToCreateGroup$: Observable<boolean>;
  AllowSelectedVisitorCalling$: Observable<boolean>;
  HideTicketNumber$: Observable<boolean>;
  Groups$: Observable<IGroupDetails[]>;
  ServeButtonLabel$: Observable<string>;

  otherServingCustomers: IOtherServingAgentCustomer[] = [];
  AgentId: string;
  AgentName: string;
  ServeButtonText = ServeButtonText;
  get DeskName(): string {
    return this.AgentConfigurationDataService.Value?.Desk?.text || '';
  }
  get LogInAs(): string {
    return this.AgentConfigurationDataService.Value?.LoginAs || '';
  }
  DisplayNameField: string;
  MaxCallLimit: number;

  public SelectedCustomers$: Observable<IAgentCustomersListItem[]>;
  public ExpandedCustomers$: Observable<IAgentCustomersListItem[]>;

  constructor(
    private service: AgentStationPanelService,
    private changeDetectorRef: ChangeDetectorRef,
    private groupsService: AgentGroupsModalService,
    private AgentConfigurationDataService: AgentStationDataService
  ) {
    super();
    this.InitializeOutputs();
    this.AgentId = this.service.AgentId;
    this.AgentName = this.service.AgentName;

    this.GetDisplayNameField();
    this.Customers$ = this.service.Customers$;
    this.service.OtherServingCustomers$.subscribe((customers) => {
      this.otherServingCustomers = [];
      customers.forEach(customer => {
        if (
          !this.otherServingCustomers.find(
            (c) => c.agentId == GetUniqueId(customer)
          )
        ) {
          this.otherServingCustomers.push({
            agentId: GetUniqueId(customer),
            name: customer.servingAtDesk || customer.calledAtDesk,
            customerList: customers.filter(
              (x) => GetUniqueId(customer) == GetUniqueId(x)
            ),
          });
        }
      })
    });
    this.IsExpanded$ = this.service.IsStationExpanded$;
    this.IsShowOthersServing$ = this.service.IsShowOthersServing$;
    this.IsSelectAll$ = this.service.IsSelectAll$;
    this.SelectedCustomers$ = this.service.SelectedCustomers$;
    this.ExpandedCustomers$ = this.service.ExpandedCustomers$;
    this.Groups$ = this.service.Groups$;
    this.IsAnySelected$ = this.service.SelectedCustomers$.pipe(
      map((x) => x.length > 0)
    );

    this.MaxCallLimit$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          if (
            StationDetails?.Workflow?.setting?.personMovementSettings?.isEnabled
          ) {
            this.MaxCallLimit =
              StationDetails?.Workflow?.setting?.personMovementSettings?.numberOfCalls;
          } else {
            this.MaxCallLimit = 999999;
          }
          return this.MaxCallLimit;
        })
      );

    this.CanEndMultiple$ = this.service.SelectedCustomers$.pipe(
      map((customers) => {
        return customers.every((customer) => customer.isNowServing);
      })
    );

    this.CanServeMultiple$ = this.service.SelectedCustomers$.pipe(
      map((customers) => {
        return (
          this.AgentConfigurationDataService.AgentConfigurations
            .allowServeMultiple &&
          customers.every((customer) => !customer.isNowServing)
        );
      })
    );

    this.CanCallMultiple$ = this.service.SelectedCustomers$.pipe(
      map((customers) => {
        return customers.every(
          (customer) =>
            !(
              customer.isNowServing || this.MaxCallLimit <= customer.calledCount
            )
        );
      })
    );

    this.IsCanServe$ = this.service.Customers$.pipe(
      map((customers) => {
        return (
          this.AgentConfigurationDataService.AgentConfigurations
            .allowServeMultiple ||
          !customers?.some((customer) => customer.isNowServing)
        );
      })
    );

    this.AllowNotes$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowCommentingOnTicket
          ? true
          : false;
      })
    );
    this.AllowTicketDeletion$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowTicketDeletion
          ? true
          : false;
      })
    );

    this.AllowSMS$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.sMSMessaging
          ?.allow
          ? true
          : false;
      })
    );

    this.AllowTakeOverCustomer$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowTakeOverCustomer
          ? true
          : false;
      })
    );

    this.AllowCancellingService$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.allowCancelingService) ?? false
      })
    );

    this.AllowGrouping$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          return (StationDetails?.AgentConfiguration?.grouping?.allow === true)
            ? true
            : false;
        })
      );

    this.AllowTransferingService$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          return (StationDetails?.AgentConfiguration?.allowTransferBetweenServices === true)
            ? true
            : false;
        })
      );

    this.HideTicketNumber$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          return (StationDetails?.AgentConfiguration?.hideTicketNumber === true)
            ? true
            : false;
        })
      );
    this.AllowToCreateGroup$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          return (StationDetails?.AgentConfiguration?.grouping?.allowToCreateGroup === true)
            ? true
            : false;
        })
      );

    this.AllowSelectedVisitorCalling$ = this.AgentConfigurationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.allowSelectedVisitorCalling === true ||
          StationDetails?.AgentConfiguration?.allowSelectedVisitorCalling === undefined) ?
          true : false;
      })
    );

    this.ServeButtonLabel$ =
      this.AgentConfigurationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          if (StationDetails && StationDetails.AgentConfiguration) {
            return StationDetails.AgentConfiguration.useDirectServedEnabled
              ? ServeButtonText.Served
              : ServeButtonText.Start;
          }
          return '';
        })
      );
  }

  GetDisplayNameField() {
    if (this.LogInAs === 'desk') {
      this.DisplayNameField = this.DeskName;
    } else {
      this.DisplayNameField = this.AgentName;
    }
  }
  InitializeOutputs(): void { }

  ToggleExpand(): void {
    this.service.ToggleStationExpanded();
  }

  ToggleShowOtherServe(): void {
    this.service.ToggleShowOtherServe();
  }

  Call(customer: IAgentCustomersListItem): void {
    this.service.Call(customer);
  }

  Serve(customer: IAgentCustomersListItem): void {
    this.service.Serve(customer);
  }

  EndServing(customer: IAgentCustomersListItem) {
    this.service.CompleteServingCustomers([customer]);
  }

  Delete(customer: IAgentCustomersListItem) {
    this.service.Delete([customer]);
  }

  Cancel(customer: IAgentCustomersListItem) {
    this.service.Cancel(customer);
  }

  Checked(status: boolean, customer: IAgentCustomersListItem) {
    this.service.SetSelected(customer, status);
  }

  Expanded(status: boolean, customer: IAgentCustomersListItem) {
    this.service.SetExpanded(customer, status);
  }

  CallSelected(): void {
    this.service.CallSelected();
  }

  ServeSelected(): void {
    this.service.ServeSelected();
  }

  EndServingOfSelected() {
    this.service.CompleteServingOfSelectedCustomers();
  }

  ShowSMSChat(customer: IAgentCustomersListItem) {
    this.service.ShowSMSChat(customer);
  }

  ShowNotes(customer: IAgentCustomersListItem) {
    this.service.ShowNotes(customer);
  }

  AddToGroup(customer: IAgentCustomersListItem) {
    this.groupsService.ShowGroupsDialog([customer]);
  }
  ShowTransferServiceDialog(customer: IAgentCustomersListItem) {
    this.service.ShowTransferServiceDialog(customer);
  }
}
interface IOtherServingAgentCustomer {
  agentId: string;
  name: string;
  customerList: IAgentCustomersListItem[];
}

function GetUniqueId(customer: IAgentCustomersListItem): string {
  if (customer.isNowServing) {
    if (customer.servingAtDesk == customer.servingByName) {
      return customer.servingById;
    } else {
      return customer.servingAtDesk;
    }
  } else {
    if (customer.calledAtDesk == customer.calledByName) {
      return customer.calledById;
    } else {
      return customer.calledAtDesk;
    }
  }
}
