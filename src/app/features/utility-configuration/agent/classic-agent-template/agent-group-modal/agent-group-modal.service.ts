import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { IAgentCustomersListItem, IGroupDetails, IPostGroup, IPostGroupsMultipleAssignment, IResponseGroup, KioskRequest } from '../../models/agent-models';
import { AgentStationDataService } from '../../utility-services/services/agent-station-data-service/agent-station-data.service';
import { ClassicAgentService } from '../classic-agent.service';

@Injectable()
export class AgentGroupsModalService extends AbstractComponentService {


  private IsDialogShowSubject: BehaviorSubject<boolean>;
  IsDialogShow$: Observable<boolean>;

  private CustomerNameSubject: BehaviorSubject<string>;
  CustomerName$: Observable<string>;

  private AllGroupsSubject: BehaviorSubject<IGroupDetails[]>;
  private AllGroups$: Observable<IGroupDetails[]>;

  private FilteredGroupsSubject: BehaviorSubject<IGroupDetails[]>;
  FilteredGroups$: Observable<IGroupDetails[]>;

  private CustomerAddGroupsSubject: BehaviorSubject<IGroupDetails[]>;
  CustomerAddGroups$: Observable<IGroupDetails[]>;

  SelectedGroup: IGroupDetails;
  IsAllowCreateGroup$: Observable<boolean>;

  private SelectedCustomersSubject: BehaviorSubject<IAgentCustomersListItem[]>;
  SelectedCustomers$: Observable<IAgentCustomersListItem[]>;

  constructor(
    private classicAgentService: ClassicAgentService,
    private agentAPIService: AgentAPIService,
    private stationDetails: AgentStationDataService,
  ) {
    super();
    this.SetObservables();
  }

  SetObservables() {
    this.IsDialogShowSubject = new BehaviorSubject<boolean>(false);
    this.IsDialogShow$ = this.IsDialogShowSubject.asObservable();

    this.CustomerNameSubject = new BehaviorSubject<string>(DefaultTitle);
    this.CustomerName$ = this.CustomerNameSubject.asObservable();


    this.SelectedCustomersSubject = new BehaviorSubject<IAgentCustomersListItem[]>([]);
    this.SelectedCustomers$ = this.SelectedCustomersSubject.asObservable();

    this.AllGroupsSubject = new BehaviorSubject<IGroupDetails[]>([]);
    this.AllGroups$ = this.AllGroupsSubject.asObservable();

    this.FilteredGroupsSubject = new BehaviorSubject<IGroupDetails[]>([]);
    this.FilteredGroups$ = this.FilteredGroupsSubject.asObservable();

    this.CustomerAddGroupsSubject = new BehaviorSubject<IGroupDetails[]>([]);
    this.CustomerAddGroups$ = this.CustomerAddGroupsSubject.asObservable();

    this.subs.sink = this.classicAgentService.Groups$.subscribe(groups => {
      this.AllGroupsSubject.next(groups);
    })


    this.subs.sink = this.AllGroups$.subscribe(groups => {
      const Customers = this.SelectedCustomersSubject.value;
      const filteredGroups = groups.filter(group => {
        return !IsGroupsPresentInCustomer(group.id, Customers,'all')
      })
      this.FilteredGroupsSubject.next(filteredGroups)
      this.FilterCustomerAssignedGroups(groups,Customers);
    })

    this.subs.sink = this.SelectedCustomers$.subscribe(SelectedCustomers => {
      const groups = this.AllGroupsSubject.value;
      const Customers = SelectedCustomers
      const filteredGroups = groups.filter(group => {
        return !IsGroupsPresentInCustomer(group.id, Customers,'all')
      })
      this.FilteredGroupsSubject.next(filteredGroups)
      this.FilterCustomerAssignedGroups(groups,Customers);
    })
    this.IsAllowCreateGroup$ = this.stationDetails.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.grouping?.allowToCreateGroup == true)? true : false;
      })
    );

  }

  ShowGroupsDialog(SelectedCustomers: IAgentCustomersListItem[]) {
    this.SelectedCustomersSubject.next(SelectedCustomers);

    if (this.SelectedCustomersSubject.value.length == 1) {
      this.CustomerNameSubject.next(this.GetCustomerName(this.SelectedCustomersSubject.value[0]));
    }
    if (this.SelectedCustomersSubject.value.length > 1) {
      this.CustomerNameSubject.next(DefaultTitle);
    }

    this.IsDialogShowSubject.next(true);
  }

  private GetCustomerName(customer: IAgentCustomersListItem): string {
    if (customer) {
      const displayFields = customer?.displayFields[0]?.answer;
        return (displayFields) ? displayFields : customer?.ticketNumber;
      }
    return '';
  }

  CloseGroupsDialog() {
    this.IsDialogShowSubject.next(false);
  }

  async ValidateForm(form: FormGroup): Promise<boolean> {
    return this.formService.CallFormMethod<any>(form);
  }

  AssignToCustomers(Group: IGroupDetails, isCreateAndAssign: boolean = false) {
    const PostData: IPostGroup = {
      agentId: this.authService.UserId,
      color: Group.color,
      groupName: Group.groupName,
      group: Group,
      id: Group.id,
      customers: this.SelectedCustomersSubject.value?.map((customer) => customer?.id),
      branchId: this.stationDetails.BranchId,
      isCreateAndAssign: isCreateAndAssign
    }
    this.agentAPIService.UpdateGroup<IResponseGroup, IPostGroup>(this.authService.CompanyId, this.authService.UserId, PostData)
      .subscribe(data => {
        if (data?.customers) {
          this.classicAgentService.OnRequestAdded(data.customers);
        }
        if (isCreateAndAssign) {
          this.classicAgentService.InitializeGroups();
        }
        this.CloseGroupsDialog();

      });
  }

  AssignMultipleGroupsToCustomers(Groups: string[],isDeleteOperation:boolean=false) {

    if (!Groups || Groups.length == 0) {
      this.AppNotificationService.NotifyError(CommonMessages.SelectAtLeastAGroupToAssign)
      return;
    }

    const PostData: IPostGroupsMultipleAssignment = {
      agentId: this.authService.UserId,
      groupsIds: Groups,
      customers: this.SelectedCustomersSubject.value?.map((customer) => customer?.id),
      branchId: this.stationDetails.BranchId,
      isDeleteOperation:isDeleteOperation
    }
    this.agentAPIService.UpdateMultipleGroups<KioskRequest[], IPostGroupsMultipleAssignment>(this.authService.CompanyId, this.authService.UserId, PostData)
      .subscribe(customers => {
        if (customers) {
          this.classicAgentService.OnRequestAdded(customers);
        }
        this.CloseGroupsDialog();
      });
  }
  FilterCustomerAssignedGroups(groups:IGroupDetails[],customers:IAgentCustomersListItem[]):void{
    const SelectedGroups = groups.filter(group => {
      return IsGroupsPresentInCustomer(group.id, customers,'any')
    })
    if(SelectedGroups)
    this.CustomerAddGroupsSubject.next(SelectedGroups)
  }
}

const DefaultTitle = 'Assign Visitor Tag';

function IsGroupsPresentInCustomer(id: string, customers: IAgentCustomersListItem[],type:string): boolean {
  if (!customers || customers.length === 0) {
    return false;
  }

  if(type=='all')
  return customers.every(customer => customer.groups?.find(g => g == id));
  return  customers.some(customer => customer.groups?.find(g => g == id));
}
