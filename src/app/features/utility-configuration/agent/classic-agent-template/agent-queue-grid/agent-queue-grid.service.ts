import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AgentAgentMoveToPositionModalService } from '../../agent-move-to-position/agent-move-to-position-modal.service';
import { AgentNotesModalService } from '../../agent-notes/agent-notes-modal.service';
import { AgentSMSChatModalService } from '../../agent-sms-chat/agent-sms-chat-modal.service';
import {
  IAgentCustomersListItem,
  IGroupDetails,
  IQuestion,
  IQueueDetails
} from '../../models/agent-models';
import { sortBySortPosition } from '../../utility-services/agent-utiliti-functions';
import { ServeButtonText } from '../../utility-services/constants/agent.constant';
import { AgentGridFilterService } from '../../utility-services/services/agent-grid-filter-service/agent-grid-filter.service';
import { AgentStationDataService } from '../../utility-services/services/agent-station-data-service/agent-station-data.service';
import { AgentGroupsModalService } from '../agent-group-modal/agent-group-modal.service';
import { ClassicAgentService } from '../classic-agent.service';

@Injectable()
export class AgentQueueGridService extends AbstractComponentService {

  public Customers$: Observable<IAgentCustomersListItem[]>;
  public Queues$: Observable<IQueueDetails[]>;
  public Groups$: Observable<IGroupDetails[]>;
  DisplayFieldsHeaders$: Observable<IQuestion[]>;
  AllCustomers: IAgentCustomersListItem[];
  FilteredCustomers: IAgentCustomersListItem[];
  SubjectSelectedCustomers: BehaviorSubject<IAgentCustomersListItem[]>;
  SelectedCustomers$: Observable<IAgentCustomersListItem[]>;
  SearchData$: Observable<string>;
  SubjectExpandedCustomers: BehaviorSubject<IAgentCustomersListItem[]>;
  ExpandedCustomers$: Observable<IAgentCustomersListItem[]>;
  IsCanServe$: Observable<boolean>;
  AllowServeMultiple: boolean;
  BranchTimeZone$: Observable<any>;
  AllowNotes$: Observable<boolean>;
  AllowTicketDeletion$: Observable<boolean>;
  AllowTicketRepositioning$: Observable<boolean>;
  AllowSMS$: Observable<boolean>;
  AllowGrouping$: Observable<boolean>;
  AllowToCreateGroup$: Observable<boolean>;
  AllowSelectedVisitorCalling$: Observable<boolean>;
  TimeInQueueId$: Observable<string>;

  ServeButtonLabel$: Observable<string>;
  AllowTransferBetweenServices$:Observable<boolean>;
  HideTicketNumber$: Observable<boolean>;

  get IsAppointmentTemplateExist(){
    return this.service.Workflow?.services?.some(service => service.acceptAppointments);
  }
  constructor(
    private service: ClassicAgentService,
    private gridFilterService: AgentGridFilterService,
    private agentStationDataService: AgentStationDataService,
    private chatService: AgentSMSChatModalService,
    private notesService: AgentNotesModalService,
    private groupsService: AgentGroupsModalService,
    private moveToPositionService: AgentAgentMoveToPositionModalService
  ) {
    super();
    this.SubjectSelectedCustomers = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.SelectedCustomers$ = this.SubjectSelectedCustomers.asObservable();
    this.SubjectExpandedCustomers = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.ExpandedCustomers$ = this.SubjectExpandedCustomers.asObservable();
    this.Queues$ = this.service.Queues$;
    this.Groups$ = this.service.Groups$;
    this.SearchData$ = this.service.SearchData$;
    this.gridFilterService.AllCustomers$ = this.service.CustomersInQueue$;
    this.BranchTimeZone$ = this.service.BranchTimeZone$;
    this.Customers$ = this.gridFilterService.FilteredCustomers$.pipe(
      map((customers) => {
        if (customers && customers.length > 0) {
          const Customers = customers.filter((customer)=>customer.sortPosition !== '0')
          
          return Customers?.sort(sortBySortPosition);
        }
        return [];
      })
    );;

    this.subs.sink = this.service.CustomersInQueue$.subscribe((customers) => {
      this.AllCustomers = customers;
    });

    this.subs.sink = this.gridFilterService.FilteredCustomers$.subscribe(
      (customers) => {
        this.FilteredCustomers = customers;
      }
    );

    this.IsCanServe$ = this.service.ServingCustomers$.pipe(
      map((customers) => {
        return (
          this.agentStationDataService.AgentConfigurations.allowServeMultiple ||
          !customers?.some(
            (customer) =>
              customer.isNowServing &&
              customer.servingById == this.authService.UserId
          )
        );
      })
    );

    this.AllowNotes$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowCommentingOnTicket
          ? true
          : false;
      })
    );

    this.AllowTicketDeletion$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowTicketDeletion
          ? true
          : false;
      })
    );

    this.AllowTicketRepositioning$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.allowTicketRepositioning
          ? true
          : false;
      })
    );

    this.AllowSMS$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.sMSMessaging
          ?.allow
          ? true
          : false;
      })
    );

    this.HideTicketNumber$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.hideTicketNumber
          ? true
          : false;
      })
    );

    this.AllowGrouping$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.grouping?.allow === true)? true : false;
      })
    );

    this.AllowToCreateGroup$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.grouping?.allowToCreateGroup === true)? true : false;
      })
    );

    this.AllowSelectedVisitorCalling$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return (StationDetails?.AgentConfiguration?.allowSelectedVisitorCalling === true ||
          StationDetails?.AgentConfiguration?.allowSelectedVisitorCalling === undefined) ?
          true : false;
      })
    );

    this.TimeInQueueId$=this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        return StationDetails?.AgentConfiguration?.timeDisplayInQueueId
      })
    );

    this.AllowServeMultiple =
      this.agentStationDataService.AgentConfigurations.allowServeMultiple;

    this.DisplayFieldsHeaders$ =
      this.agentStationDataService.StationDetails$.pipe(
        map((StationDetails) => {
          if (
            !StationDetails ||
            !StationDetails.Workflow ||
            !StationDetails.Workflow.preServiceQuestions ||
            StationDetails.Workflow.preServiceQuestions.length == 0
          ) {
            return [];
          }
          return (
            StationDetails.Workflow.preServiceQuestions
              ?.filter((question) => question?.isDisplay)
              ?.map((question) => {
                return {
                  questionText: '',
                  answer: '',
                  isDisplayField: true,
                  displayFieldPriority: null,
                  shortName: question.shortName,
                  questionType: question.type,
                  questionId: question.id,
                };
              }) || []
          );
        })
      );

    this.ServeButtonLabel$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        if (StationDetails && StationDetails.AgentConfiguration) {
          return StationDetails.AgentConfiguration.useDirectServedEnabled
            ? ServeButtonText.Served
            : ServeButtonText.Start;
        }
        return '';
      })
    );
    this.AllowTransferBetweenServices$ = this.agentStationDataService.StationDetails$.pipe(
      map((StationDetails) => {
        if (StationDetails && StationDetails.AgentConfiguration) {
          return StationDetails.AgentConfiguration.allowTransferBetweenServices
          ? true
          : false;
        }
      })
      );
    }


  DeSelectAll(): void {
    this.SubjectSelectedCustomers.next([]);
  }

  SetSelected(id: string, status: boolean) {
    const customer = this.AllCustomers.find((x) => x.id == id);
    const SelectedCustomers = this.SubjectSelectedCustomers.getValue().filter(
      (x) => x.id != id
    );
    if (status) {
      SelectedCustomers.push(customer);
    }
    this.SubjectSelectedCustomers.next(SelectedCustomers.concat([]));
  }

  SetExpanded(id: string, status: boolean) {
    const customer = this.AllCustomers.find((x) => x.id == id);
    const ExpandedCustomers = this.SubjectExpandedCustomers.getValue().filter(
      (x) => x.id != id
    );
    if (status) {
      ExpandedCustomers.push(customer);
    }
    
    this.SubjectExpandedCustomers.next(ExpandedCustomers.concat([]));  
}



  SelectAll(): void {
    this.SubjectSelectedCustomers.next(this.FilteredCustomers.concat([]));
  }

  Call(customer: IAgentCustomersListItem): void {
    this.service.CallSelectedCustomers([customer]);
  }

  Serve(customer: IAgentCustomersListItem): void {
    this.service.ServeSelectedCustomers([customer]);
  }

  Delete(customer: IAgentCustomersListItem): void {
    this.service.DeletedSelectedCustomers([customer]);
  }

  ShowInformation(customer: IAgentCustomersListItem): void {
    this.service.OpenCustomerInformationDialog(customer);
  }

  CallSelected(): void {
    const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
    this.service.CallSelectedCustomers(SelectedCustomers);
    this.DeSelectAll();
  }

  ServeSelected(): void {
    const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
    this.service.ServeSelectedCustomers(SelectedCustomers);
    this.DeSelectAll();
  }

  DeleteSelected(): void {
    const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
    this.service.DeletedSelectedCustomers(SelectedCustomers);
    this.DeSelectAll();
  }

  CallNext() {
    if(this.gridFilterService.SelectedQueues.length || this.gridFilterService.SelectedGroups.length){
      const Customers = this.FilteredCustomers.filter((customer)=>customer.sortPosition !== '0')
      Customers?.sort(sortBySortPosition);
      this.service.CallSelectedCustomers([Customers[0]]);
    }else{
    this.service.CallNextFromBranch();
    }
  }

  ShowSMSChat(request: IAgentCustomersListItem): void {
    this.chatService.ShowSMSChatModal(request);
  }

  ShowNotes(request: IAgentCustomersListItem): void {
    this.notesService.ShowNotesModal(request);
  }

  ShowGroupsDialog(): void {
    const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
    this.groupsService.ShowGroupsDialog(SelectedCustomers);
    this.SubjectSelectedCustomers.next([]);
  }

  AddToCustomerToGroup(request: IAgentCustomersListItem): void {
    this.SubjectSelectedCustomers.next([]);
    this.groupsService.ShowGroupsDialog([request]);
  }

  ShowMoveToPositionDialog(request: IAgentCustomersListItem): void {
    this.moveToPositionService.ShowMoveToPositionDialog(request);
  }
  ShowTransferServiceDialog(customer: IAgentCustomersListItem): void {
    this.service.OpenTransferServiceDialog(customer);
  }
}


