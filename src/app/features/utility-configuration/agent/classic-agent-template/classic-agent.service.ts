import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import {
  cloneObject, GetConcatenatedArray
} from 'src/app/core/utilities/core-utilities';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { CommonMessages } from '../../../../models/constants/message-constant';
import { AgentAPIService } from '../../../../shared/api-services/agent-api.service';
import { Confirmable } from '../../../../shared/decorators/confirmable.decorator';
import {
  CustomerState,
  IAgentCustomersListItem,
  IGroupDetails,
  IMinimiumKioskRequestModel,
  IQuestion,
  IQueueDetails,
  IStationDetails,
  KioskRequest,
  Question
} from '../models/agent-models';
import { PostBackToQueue } from '../models/back-to-queue/back-to-queue-post.model';
import { IQueue } from '../utility-services/models/agent-signalr/queue.model';
import {
  IGlobalQuestion,
  IWorkFlow
} from '../utility-services/models/workflow-models/workflow-interface';
import { AgentActionsService } from '../utility-services/services/agent-actions-service/agent-actions.service';
import { AgentSignalRService } from '../utility-services/services/agent-signalR/agent-signalr.service';
import { QueueSignalRService } from '../utility-services/services/agent-signalR/queue-signalr.service';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class ClassicAgentService extends AbstractComponentService {
  private IsAnyCalled = false;
  private IsAnyServing = false;
  SubjectBranchTimeZone: BehaviorSubject<any>;
  BranchTimeZone$: Observable<any>;
  BranchTimeZone: any;
  isTimeZoneNotified: boolean;
  get BranchTimeZoneUrl(): string {
    return (
      this.appConfigService.config.BaseAPIUrlBranch +
      '/api/companies/' +
      this.authService.CompanyId +
      '/branches/' +
      this.stationDetails?.BranchId +
      '/time-zone'
    );
  }
  private _cachedLanguageId: string | undefined;


  get LanguageId(): string {
    if (!this._cachedLanguageId) {
      this._cachedLanguageId = this.stationDetails?.BranchDefaultLanguageId;
      this.watchStationDetails();
    }
    return this._cachedLanguageId;
  }

  private watchStationDetails() {
    const handler = {
      set: (target: any, prop: PropertyKey, value: any) => {
        if (prop === 'BranchDefaultLanguageId') {
          this._cachedLanguageId = undefined;
        }
        return Reflect.set(target, prop, value);
      },
    };
    this.stationDetails = new Proxy(this.stationDetails, handler);
  }
  private TemplateId: string;

  // all filtered waiting or called requests
  private CustomersInQueueSubject: BehaviorSubject<IAgentCustomersListItem[]>;
  public CustomersInQueue$: Observable<IAgentCustomersListItem[]>;

  // all filtered serving state requests
  private ServingCustomersSubject: BehaviorSubject<IAgentCustomersListItem[]>;
  public ServingCustomers$: Observable<IAgentCustomersListItem[]>;

  // all request from db
  public KioskRequests$: Observable<KioskRequest[]>;
  private KioskRequestsSubject: BehaviorSubject<KioskRequest[]>;

  private SubjectIsSelectAll: BehaviorSubject<boolean>;
  public IsSelectAll$: Observable<boolean>;

  private SubjectIsStationSectionExpand: BehaviorSubject<boolean>;
  public IsStationSectionExpand$: Observable<boolean>;

  private SubjectIsStationSectionVisible: BehaviorSubject<boolean>;
  public IsStationSectionVisible$: Observable<boolean>;

  private SubjectIsAnySelected: BehaviorSubject<boolean>;
  IsAnySelected$: Observable<boolean>;

  private SubjectGroups: BehaviorSubject<IGroupDetails[]>;
  public Groups$: Observable<IGroupDetails[]>;

  private SubjectOpenAddGroupPopup: BehaviorSubject<boolean>;
  public OpenAddGroupPopup$: Observable<boolean>;

  private SubjectAddToExistingGroupPopup: BehaviorSubject<boolean>;
  public OpenAddToExistingGroupPopup$: Observable<boolean>;

  private SubjectOpenMoveToPositionPopup: BehaviorSubject<boolean>;
  public OpenMoveToPositionPopup$: Observable<boolean>;

  private SubjectQueues: BehaviorSubject<IQueueDetails[]>;
  public Queues$: Observable<IQueueDetails[]>;

  private SubjectCustomersForGroup: BehaviorSubject<IAgentCustomersListItem[]>;
  public CustomersForGroup$: Observable<IAgentCustomersListItem[]>;

  private SubjectIsAddNewGroup: BehaviorSubject<boolean>;
  public IsAddNewGroup$: Observable<boolean>;

  private SubjectFilterQueue: BehaviorSubject<IQueueDetails>;
  public FilterQueue$: Observable<IQueueDetails>;

  private SubjectFilterGroup: BehaviorSubject<IGroupDetails>;
  public FilterGroup$: Observable<IGroupDetails>;

  private SubjectFilterText: BehaviorSubject<string>;
  public FilterText$: Observable<string>;

  private SubjectExpandedCustomersStation: BehaviorSubject<
    IAgentCustomersListItem[]
  >;
  public ExpandedCustomersStation$: Observable<IAgentCustomersListItem[]>;

  Workflow: IWorkFlow;

  private SubjectCustomerForDialog: BehaviorSubject<IAgentCustomersListItem>;
  CustomerForDialog$: Observable<IAgentCustomersListItem>;

  private SubjectIsCustomerInformationDialogOpen: BehaviorSubject<boolean>;
  IsCustomerInformationDialogOpen$: Observable<boolean>;

  private SubjectTransferServiceForDialog: BehaviorSubject<IAgentCustomersListItem>;
  TransferServiceForDialog$: Observable<IAgentCustomersListItem>;

  SearchDataSubject: BehaviorSubject<string>;
  SearchData$: Observable<string>;

  QueuePositions: IQueue;

  private SubjectIsTransferServiceDialogOpen: BehaviorSubject<boolean>;
  IsTransferServiceDialogOpen$: Observable<boolean>;
  KendoTimeZoneData = ZonedDate;

  InitialUserDetails: InitialUserDetails;
  private allWorkflowQuestionsCache = null;
  private stationDetailsCache: any;
  private selectedLanguage:any;
  private station: IStationDetails;


  constructor(
    private stationDetails: AgentStationDataService,
    private signalRService: AgentSignalRService,
    private queueSignalRService: QueueSignalRService,
    private agentActionsService: AgentActionsService,
    private readonly agentAPIService: AgentAPIService,
    private readonly appNotificationService: AppNotificationService
  ) {
    super();
    this.SetObservables();
    this.InitializeSignalR();
    this.InitializeQueueSignalR();
    this.InitializeDefaultValues();
  }
  InitializeSignalR() {
    this.subs.sink = this.stationDetails.GetState().subscribe(([previousStationState,currentStationState]) => {
      if (this.stationDetails.IsStationDetailsAvailable()) {

        if(!previousStationState && !currentStationState) {
          return;
        } else if(!previousStationState && currentStationState) {
          const BranchId = currentStationState.Branch.branchId;
          this.signalRService.Init(BranchId);
        } else if(previousStationState?.Branch?.branchId !== currentStationState?.Branch?.branchId) {
          const BranchId = currentStationState.Branch.branchId;
          this.signalRService.Init(BranchId);
        }
      }
    });

    this.subs.sink = this.signalRService.NewKioskWaitingRequests$.subscribe(
      (requests) => {
        this.OnRequestAdded(requests);
      }
    );

    this.subs.sink = this.signalRService.RemovedWaitingRequests$.subscribe(
      (ids) => {
        this.OnCustomerRequestRemoved(ids);
      }
    );

    // when you get a reconnection message from signalr, our list might be out of date - so go get it again
    this.subs.sink = this.signalRService.Reconnected$.subscribe(
      () => {
        if(this.station) {
          this.InitializeRequests(this.station);
        }
      }
    );

    // this.signalRService.Init(this.GetAgentId());
  }

  InitializeQueueSignalR() {
    this.subs.sink = this.stationDetails.GetState().subscribe(([previousStationState,currentStationState]) => {
      if (this.stationDetails.IsStationDetailsAvailable()) {

        if(!previousStationState && !currentStationState) {
          return;
        } else if(!previousStationState && currentStationState) {
          const station = currentStationState;
          const branchId = station.Branch.branchId;
          const workflowId = station.Workflow.workFlowId;
          const QueueDocId = `${branchId}_${workflowId}_Queue`;
          this.queueSignalRService.Init(QueueDocId);
        } else if(previousStationState?.Branch?.branchId !== currentStationState?.Branch?.branchId) {
          const station = currentStationState;
          const branchId = station.Branch.branchId;
          const workflowId = station.Workflow.workFlowId;
          const QueueDocId = `${branchId}_${workflowId}_Queue`;
          this.queueSignalRService.Init(QueueDocId);
        }
      }
    });

    this.subs.sink = this.queueSignalRService.QueuePositions$.subscribe(
      (queue) => {
        let shouldUpdateQueue = true;
        if(this.QueuePositions && queue && queue?._ts != 0) {
          if(this.QueuePositions._ts >= queue._ts) {
            shouldUpdateQueue = false;
          }
        }

        if(shouldUpdateQueue) {
          this.QueuePositions = queue;
          let WaitingRequests = this.KioskRequestsSubject.getValue();
          if(queue?.isEndofDay)
          {
            WaitingRequests=[];
          }
          this.KioskRequestsSubject.next(WaitingRequests.concat([]));
        }
      }
    );
  }

  SetObservables() {
    this.subs.sink = this.mediatorService.InitialUserDetails$.subscribe(
      (data) => {
        this.InitialUserDetails = data;
      }
    );
    this.SubjectBranchTimeZone = new BehaviorSubject<any>({});
    this.BranchTimeZone$ = this.SubjectBranchTimeZone.asObservable();

    this.SearchDataSubject = new BehaviorSubject<string>('');
    this.SearchData$ = this.SearchDataSubject.asObservable();

    this.CustomersInQueueSubject = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.CustomersInQueue$ = this.CustomersInQueueSubject.asObservable();

    this.SubjectIsSelectAll = new BehaviorSubject<boolean>(false);
    this.IsSelectAll$ = this.SubjectIsSelectAll.asObservable();

    this.SubjectIsAnySelected = new BehaviorSubject<boolean>(false);
    this.IsAnySelected$ = this.SubjectIsAnySelected.asObservable();

    this.SubjectIsStationSectionExpand = new BehaviorSubject<boolean>(false);
    this.IsStationSectionExpand$ =
      this.SubjectIsStationSectionExpand.asObservable();

    this.SubjectIsStationSectionVisible = new BehaviorSubject<boolean>(false);
    this.IsStationSectionVisible$ =
      this.SubjectIsStationSectionVisible.asObservable();

    this.SubjectGroups = new BehaviorSubject<IGroupDetails[]>([]);
    this.Groups$ = this.SubjectGroups.asObservable();

    this.SubjectQueues = new BehaviorSubject<IQueueDetails[]>([]);
    this.Queues$ = this.SubjectQueues.asObservable();

    this.SubjectCustomerForDialog =
      new BehaviorSubject<IAgentCustomersListItem>(null);
    this.CustomerForDialog$ = this.SubjectCustomerForDialog.asObservable();

    this.SubjectIsCustomerInformationDialogOpen = new BehaviorSubject<boolean>(
      false
    );
    this.IsCustomerInformationDialogOpen$ =
      this.SubjectIsCustomerInformationDialogOpen.asObservable();

    this.SubjectTransferServiceForDialog =
      new BehaviorSubject<IAgentCustomersListItem>(null);
    this.TransferServiceForDialog$ =
      this.SubjectTransferServiceForDialog.asObservable();

    this.SubjectIsTransferServiceDialogOpen = new BehaviorSubject<boolean>(
      false
    );
    this.IsTransferServiceDialogOpen$ =
      this.SubjectIsTransferServiceDialogOpen.asObservable();

    this.KioskRequestsSubject = new BehaviorSubject<KioskRequest[]>([]);
    this.KioskRequests$ = this.KioskRequestsSubject.asObservable().pipe(
      map((customers) => {
        let tempCustomers = customers;
        if (
          this.QueuePositions &&
          this.QueuePositions.customers &&
          this.QueuePositions.customers.length > 0
        ) {
          tempCustomers.forEach((x) => {
            let index = this.QueuePositions.customers.findIndex(
              (y) => y.id == x.id
            );

            let customerPositionObj = this.QueuePositions.customers[index];

            x.sortPosition = (index + 1).toString();
            x.estimatedServingTimeUTCString =
              customerPositionObj?.estimateWaitTimeISOString;
            x.estimatedWaitRangesSettings =
              this.QueuePositions.estimatedWaitRangesSettings;
          });
        }
        return tempCustomers;
      })
    );

    this.ServingCustomersSubject = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.ServingCustomers$ = this.ServingCustomersSubject.asObservable();

    this.SubjectExpandedCustomersStation = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.ExpandedCustomersStation$ =
      this.SubjectExpandedCustomersStation.asObservable();

    this.SetOuterSubscriptionsActions();

    this.selectedLanguage = this.stationDetails?.BranchDetails?.supportedLanguages
  }
  SetOuterSubscriptionsActions() {
    this.subs.sink = this.stationDetails.Get().subscribe((stationDetails) => {
      if (this.stationDetails?.BranchId) {
        this.subs.sink = this.GetBranchTimeZone().subscribe((x) => {
          if (x?.timeZone?.id) {
            this.SubjectBranchTimeZone.next(x.timeZone.id);
            this.BranchTimeZone = x.timeZone.id;
          } else {
            if (!this.isTimeZoneNotified) {
              this.isTimeZoneNotified = true;
              this.appNotificationService.NotifyError(
                'Please set the branch timezone, for accurate date-time.'
              );
            }
          }
          this.BindCustomerList();
        });
      }
      this.Workflow = stationDetails?.Workflow;
    });

    this.subs.sink = this.CustomersInQueue$.subscribe((customers) => {
      const anySelected = customers.some((customer) => customer.isSelected);
      this.SubjectIsAnySelected.next(anySelected);
    });

    this.subs.sink = this.CustomersInQueue$.subscribe((customers) => {
      this.IsAnyCalled = customers.some((x) => x.isCalled);
      this.SubjectIsStationSectionVisible.next(
        this.IsAnyCalled || this.IsAnyServing
      );
    });
    this.subs.sink = this.ServingCustomers$.subscribe((customers) => {
      this.IsAnyServing = customers?.length > 0;
      this.SubjectIsStationSectionVisible.next(
        this.IsAnyCalled || this.IsAnyServing
      );
    });
  }

  /*
  private allTickets: KioskRequest[] = [];
  private existingQueue: IQueue = null;

  private ConsumeTicketsAndStates(tickets: KioskRequest[]) {
    let tookActions = false;

    for(const ticket of tickets) {
      let needsToAdd = true;
      let needsToRemove = false;

      if(ticket.isDeleted === true) {
        needsToRemove = true;
      }

      switch(ticket.customerState) {
        case CustomerState.WAITING:
          break;
        case CustomerState.CALLED:
          break;
        case CustomerState.SERVING:
          break;
        case CustomerState.CANCELEDBYAGENT:
          break;
        case CustomerState.CANCELEDBYUSER:
          break;
      }

      if(needsToAdd) {
        // check to see if the ticket exists...
        const i = this.allTickets.findIndex((t) => t.id === ticket.id);
        if(i >= 0) {
          // Get the existing ticket that i have, check to see if its moved on
          const existingTicket = this.allTickets.find((t) => t.id === ticket.id);
          // Check to see if the existing ticket
          if(existingTicket._ts >= ticket._ts) {
            if(existingTicket._etag !== ticket._etag) {
              this.allTickets.splice(i,1, ticket);
              tookActions = true;
            }
          }
        } else {
          this.allTickets.push(ticket);
        }
      }

      if(needsToRemove) {
        const i = this.allTickets.findIndex((t) => t.id === ticket.id);
        if(i >= 0) {
          this.allTickets.splice(i, 1);
          tookActions = true;
        }
      }
    }

    if(tookActions) {
      this.BuildListsFromActions(this.existingQueue);
    }

  }

  private BuildListsFromActions(queue: IQueue) {

    const servingCustomers = this.allTickets.filter(
      (x) => x.customerState == CustomerState.SERVING // TODO: Should this be limited to just my queues and my tickets ?
    );

    const WaitingCustomers = this.allTickets.filter(
      (x) => !(x.customerState == CustomerState.SERVING) && this.IsInMyQueue(x.queueId)
    );

    // Build list of tickets in waiting
    const waitingCustomersModels: IAgentCustomersListItem[] =
      this.MapRequestsToModel(WaitingCustomers);
    this.CustomersInQueueSubject.next(cloneObject(this.BuildInQueueOrder(waitingCustomersModels, queue)));

    // Build list of tickets that i am serving
    const servingCustomersModels: IAgentCustomersListItem[] =
      this.MapServingToCustomers(servingCustomers);
    // TODO: Build in queue order or _ts ?
    this.ServingCustomersSubject.next(cloneObject(servingCustomersModels));
  }

  private OnQueueChanged(queue: IQueue) {
    if(this.existingQueue) {
      if(this.existingQueue._ts < queue._ts) {
        this.existingQueue = queue;
        this.BuildListsFromActions(queue);
      }
    }
  }

  private BuildInQueueOrder(tickets: IAgentCustomersListItem[], queue: IQueue): IAgentCustomersListItem[] {
    let ret = tickets;

    if(queue) {
      ret = [];
      let index = 0;
      for(const qi of queue.customers) {
        const x = tickets.find((x) => x.id === qi.id);
        if(x) {
          x.sortPosition = (++index).toString();
          ret.push(x);
        }
      }

      for(const t of tickets) {
        if(ret.findIndex((x) => x.id === t.id) < 0) {
          t.sortPosition = (++index).toString();
          ret.push(t);
        }
      }
    }

    return ret;
  }

  */

  BindCustomerList() {
    this.subs.sink = this.KioskRequests$.subscribe((KioskRequests) => {
      // check for customerState
      const servingCustomers = KioskRequests.filter(
        (x) => x.customerState == CustomerState.SERVING
      );
      const WaitingCustomers = KioskRequests.filter(
        (x) => !(x.customerState == CustomerState.SERVING)
      );

      const waitingCustomersModels: IAgentCustomersListItem[] =
        this.MapRequestsToModel(WaitingCustomers);
      this.CustomersInQueueSubject.next(cloneObject(waitingCustomersModels));

      const servingCustomersModels: IAgentCustomersListItem[] =
        this.MapServingToCustomers(servingCustomers);
      this.ServingCustomersSubject.next(cloneObject(servingCustomersModels));
    });
  }

  GetBranchTimeZone() {
    return this.formService.GetAPICall<any>(this.BranchTimeZoneUrl);
  }

  InitializeDefaultValues(): void {
    this.InitializeGroups();
    this.InitializeQueues();
    this.InitializeCustomers();
  }

  MapServingToCustomers(requests: KioskRequest[]): IAgentCustomersListItem[] {
    const servingModels: IAgentCustomersListItem[] = [];
    for (const servingRequest of requests) {
      const servingModel: IAgentCustomersListItem = this.MapRequestsToModel([
        servingRequest,
      ])[0];
      servingModel.isNowServing = true;
      servingModel.servingById = servingRequest.servingAgentId;
      servingModel.servingByName = servingRequest.servingAgentName;
      servingModel.servingStartTimeUTCString =
        servingRequest.servingStartTimeUTC;
      servingModel.servingStartTimeUTC = new Date(
        servingRequest.servingStartTimeUTC
        );
        servingModels.push(servingModel);
    }
    return servingModels;
  }

  InitializeQueues() {
    if (!this.stationDetailsCache) {
      this.subs.sink = this.stationDetails.Get().subscribe((stationDetails) => {
        this.stationDetailsCache = stationDetails;
        this.UpdateQueues();
      });
    } else {
      this.UpdateQueues();
    }
  }

  UpdateQueues() {
    let Queues: IQueueDetails[];
    if(this.stationDetailsCache) {
      Queues = this.stationDetailsCache?.Workflow?.queues?.map(
        (queue) => {
          return {
            id: queue.id,
            queueNumber: queue.name,
            count: '',
          };
        }
      );
    } else {
      Queues = this.stationDetails?.Workflow?.queues?.map(
        (queue) => {
          return {
            id: queue.id,
            queueNumber: queue.name,
            count: '',
          };
        }
      );
    }


    if (Queues && Queues.length > 0) {
      const AgentQueues = this.GetAgentQueues();
      Queues = Queues.filter((x) => AgentQueues?.find((y) => y == x.id));
    }

    this.SubjectQueues.next(Queues);

    // update cache
    if(this.stationDetailsCache) {
      this.stationDetailsCache.Workflow.queues = Queues;
    }
  }

  GetAgentQueues(): string[] {
    let AllWorkflowQueues
    if(this.stationDetailsCache){
      AllWorkflowQueues= this.stationDetailsCache?.Workflow?.queues;

    } else {
      AllWorkflowQueues= this.stationDetails?.Workflow?.queues;
    }
    const AllAgentQueues = GetConcatenatedArray(this.InitialUserDetails.agentTemplate, x => x.queues) || [];
    if (AllAgentQueues?.length && AllWorkflowQueues?.length) {
      return AllWorkflowQueues.filter(x => AllAgentQueues.includes(x.id)).map(x => x.id);
    }
    return [];
  }

  async InitializeCustomers() {
    this.subs.sink = this.stationDetails.Get().subscribe((station) => {
      this.station = station;
      if (
        this.stationDetails.IsStationDetailsAvailable() &&
        this.stationDetails.IsDetailsFetched()
      ) {
        this.InitializeRequests(station);
      }
    });
  }

  private async InitializeRequests(station: IStationDetails) {
    if (this.stationDetails.IsStationDetailsAvailable()) {
      const Queues = this.GetAgentQueues();
      if (Queues && Queues.length > 0) {
        this.agentAPIService
          .GetWaitingCustomers(
            this.authService.CompanyId,
            this.authService.UserId,
            station.Branch.branchId,
            station.Template.id,
            Queues
          )
          .subscribe((responses) => {
            let kioskRequests = [];
            for (const response of responses) {
              kioskRequests = kioskRequests.concat(response);
            }
            this.KioskRequestsSubject.next(kioskRequests.concat([]));
          });
      }
    }
  }

  MergeCustomersToObservable(customersToAdd: IAgentCustomersListItem[]) {
    let customers = this.CustomersInQueueSubject.getValue().concat([]);
    customers = customers.filter(
      (x) => !customersToAdd.find((y) => y.id === x.id)
    );
    customers = customers.concat(customersToAdd);
    this.CustomersInQueueSubject.next(customers);
  }

  MapRequestsToModel(requests: KioskRequest[]): IAgentCustomersListItem[] {
    return requests.map(request => {
      const BranchTimeZoneDate = this.BranchTimeZone ?
        this.KendoTimeZoneData.fromLocalDate(new Date(request.requestTimeUTCString), this.BranchTimeZone) :
        this.KendoTimeZoneData.fromLocalDate(new Date(request.requestTimeUTCString));
      const BranchTimeZoneDateForAppointment = request.appointmentTimeUTCString ?
        (this.BranchTimeZone ?
          this.KendoTimeZoneData.fromLocalDate(new Date(request.appointmentTimeUTCString), this.BranchTimeZone) :
          this.KendoTimeZoneData.fromLocalDate(new Date(request.appointmentTimeUTCString))) :
        null;

      const customer: IAgentCustomersListItem = {
        id: request.id,
        agentQuestions: this.MapQuestions(request),
        preServiceQuestionLength: request?.preServiceQuestions?.length || 0,
        calledById: request.calledById,
        calledByName: request.calledByName,
        calledAtDesk: request.calledAtDesk,
        customerId: request.id,
        groupNames: this.GetGroupNames(request.groups),
        isCalled: request.isCalled,
        isContextMenuVisible: false,
        isCtrlSelected: false,
        isExpanded: false,
        isGroupContextMenuVisible: false,
        isNowServing: false,
        isSelected: false,
        queueId: request.queueId,
        queueName: this.GetQueueName(request.queueId),
        queueNumber: this.GetQueueName(request.queueId),
        serviceId: request.serviceId,
        serviceName: this.GetServiceName(request.serviceId),
        servingById: request.servingAgentId,
        servingByName: request.servingAgentName,
        servingAtDesk: request.servingAtDesk,
        servingStartTimeUTCString: request.servingStartTimeUTC,
        servingStartTimeUTC: request.servingStartTimeUTC ? new Date(request.servingStartTimeUTC) : null,
        sortPosition: request.sortPosition,
        statusMessage: '',
        ticketNumber: request.ticketNumber,
        utcTime: new Date(request.requestTimeUTCString),
        branchTime: new DatePipe('en-us').transform(
          new Date(
            BranchTimeZoneDate.getFullYear(),
            BranchTimeZoneDate.getMonth(),
            BranchTimeZoneDate.getDate(),
            BranchTimeZoneDate.getHours(),
            BranchTimeZoneDate.getMinutes(),
            BranchTimeZoneDate.getSeconds(),
            BranchTimeZoneDate.getMilliseconds()
          ),
          'MMMM d, h:mm a'
        ),
        visitType: '',
        groups: request.groups,
        queue: null,
        utcTimeString: request.requestTimeUTCString,
        displayFields: this.MapDisplayFields(request),
        lastSMSMessage: request?.lastSMSMessage,
        lastNote: request?.lastNote,
        calledCount: request.calledCount,
        calledRequeueCount: request.calledRequeueCount,
        customerState: request.customerState,
        isWalking: request.isWalking,
        isTransfer: request.isTransfer,

        isAppointment: request.isAppointment,
        appointmentTimeUTCString: request.appointmentTimeUTCString,
        branchTimeForAppointment: BranchTimeZoneDateForAppointment ?
        new DatePipe('en-us').transform(
          new Date(
            BranchTimeZoneDateForAppointment.getFullYear(),
            BranchTimeZoneDateForAppointment.getMonth(),
            BranchTimeZoneDateForAppointment.getDate(),
            BranchTimeZoneDateForAppointment.getHours(),
            BranchTimeZoneDateForAppointment.getMinutes(),
            BranchTimeZoneDateForAppointment.getSeconds(),
            BranchTimeZoneDateForAppointment.getMilliseconds()
          ),
          'MMMM d, h:mm a'
        )
      : '',
        appointmentId: request.appointmentId,
        selectedLanguageId: request.selectedLanguageId,
        selectedLanguage: GetLanguageName(request.selectedLanguageId, this.selectedLanguage),
        ruleActionNotificationDetails: request.ruleActionNotificationDetails,
        priority: request.queue?.customers?.find(customer => customer.id === request.id)?.priority || 0,
        _ts : request._ts
      };

      return customer;
    });
  }

  GetQueueName(queueId: string): string {
    const Queues = this.Workflow?.queues;
    if (Queues && Queues.length > 0) {
      return Queues.find((x) => x.id == queueId)?.name;
    } else {
      return '';
    }
  }

  GetGroupNames(groupIds: string[]): string[] {
    const GroupNames = [];
    if (this.SubjectGroups.value && this.SubjectGroups.value.length > 0) {
      for (const id of groupIds) {
        GroupNames.push(
          this.SubjectGroups.value.find((x) => x.id == id)?.groupName
        );
      }
    }
    return GroupNames;
  }

  MapDisplayFields(request: KioskRequest): IQuestion[] {
    if (this.Workflow) {
      const WorkflowQuestions: IGlobalQuestion[] =
        this.Workflow.preServiceQuestions;
      const Questions: Question[] = request?.preServiceQuestions;
      let displayFieldPriority = 0;
      const AgentQuestions: IQuestion[] = Questions?.map((x) => {
        const questionIfIsDisplay = WorkflowQuestions?.find(
          (y) => y.id == x.questionId && y.isDisplay
        );
        if (questionIfIsDisplay) {
          return {
            questionText: x.questionText,
            answer: x.answer,
            isDisplayField: true,
            displayFieldPriority: displayFieldPriority++,
            shortName: questionIfIsDisplay?.shortName,
            questionType: x.questionType,
            questionId: x.questionId,
          };
        }
      });
      return AgentQuestions?.filter((x) => !!x) || [];
    } else {
      return [];
    }
  }

  GetServiceName(serviceId: string): string {
    if (this.Workflow?.services) {
      const Service = this.Workflow.services.find((x) => {
        return x.id == serviceId;
      });
      if (Service?.serviceNames) {
        return Service?.serviceNames[0].serviceName;
      }
    }
    return '';
  }
  MapQuestions(request: KioskRequest): IQuestion[] {
    const { preServiceQuestions = [] } = request || {};
    const { preServiceQuestions: WorkflowQuestions = [] } = this.Workflow || {};

    return preServiceQuestions.concat(request.serviceQuestions || []).map((x) => {
      const questionIfIsDisplay = WorkflowQuestions.find((y) => y.id === x.questionId && y.isDisplay);

      return {
        questionText: this.GetQuestionText(x.questionId, this.Workflow),
        answer: x.answer,
        isDisplayField: !!questionIfIsDisplay,
        displayFieldPriority: 0,
        shortName: questionIfIsDisplay?.shortName,
        questionType: x.questionType,
        questionId: x.questionId,
      };
    });
  }


  private GetAllWorkflowQuestions(workflow: IWorkFlow): IGlobalQuestion[] {
    if((!this.allWorkflowQuestionsCache) && workflow) {
      this.allWorkflowQuestionsCache = [];
      if (workflow?.preServiceQuestions && workflow?.preServiceQuestions[0]) {
        for (const PreQuestion of workflow?.preServiceQuestions) {
          this.allWorkflowQuestionsCache.push(PreQuestion);
        }
      }

      if (workflow?.questionSets && workflow?.questionSets[0]) {
        for (const questionSet of workflow?.questionSets) {
          const questions = questionSet?.questions || [];
          this.allWorkflowQuestionsCache.push(...questions);
        }
      }
    }

    return this.allWorkflowQuestionsCache;
  }


  GetQuestionText(questionId: string, workflow: IWorkFlow): any {
    const LanguageId = this.LanguageId;
    const AllWorkflowQuestions = this.GetAllWorkflowQuestions(workflow);

    const question = AllWorkflowQuestions?.find((x) => x.id === questionId);
    if (question) {
      return (
        question?.question?.find((x) => x.languageId === LanguageId)
          ?.question || ''
      );
    }

    return '';
  }

  InitializeGroups() {
    this.stationDetails.Get().subscribe((station) => {
      if (
        this.stationDetails.IsStationDetailsAvailable() &&
        this.stationDetails.IsDetailsFetched() &&
        this.stationDetails?.AgentConfigurations?.grouping?.allow === true
          ? true
          : false
      ) {
        this.agentAPIService
          .GetAllGroups<IGroupDetails>(
            this.authService.CompanyId,
            this.authService.UserId
          )
          .subscribe((res) => {
            const workflowGroups = this.stationDetails.Workflow?.groups
              ?.filter((m) => !m.isDeleted)
              .map((x) => {
                return {
                  id: x.id,
                  groupName: x.groupName,
                  color: x.groupColor,
                  isWorkflowGroup: true,
                };
              });
            this.SubjectGroups.next(
              (res || []).concat(workflowGroups).filter((x) => x)
            );
          });
      }
    });
  }

  private SetGroupDialog(state: boolean) {
    this.SubjectOpenAddGroupPopup.next(state);
  }
  private SetGroupDialogIsAddNew(state: boolean) {
    this.SubjectIsAddNewGroup.next(state);
  }

  CloseGroupDialog() {
    this.SetGroupDialog(false);
    this.SetGroupDialogIsAddNew(true);
  }
  OpenGroupDialog() {
    this.SetGroupDialogIsAddNew(true);
    this.SubjectCustomersForGroup.next([]);
    this.SetGroupDialog(true);
  }

  OpenAddGroupDialog(customers: IAgentCustomersListItem[]) {
    this.SubjectCustomersForGroup.next(customers);
    this.SetGroupDialogIsAddNew(false);
    this.SetGroupDialog(true);
  }

  AddToExistingGroup(customers: IAgentCustomersListItem[]) {
    this.SubjectCustomersForGroup.next(customers);
    this.SubjectAddToExistingGroupPopup.next(true);
  }

  FilterCustemersByQueue(queue: IQueueDetails) {
    this.SubjectFilterQueue.next(queue);
    this.SubjectFilterGroup.next(null);
  }

  FilterCustemersByGroup(group: IGroupDetails) {
    this.SubjectFilterGroup.next(group);
    this.SubjectFilterQueue.next(null);
  }

  ClearFilters() {
    this.SubjectFilterQueue.next(null);
    this.SubjectFilterGroup.next(null);
    this.SubjectFilterText.next('');
  }

  SetFilterText(text: any) {
    this.SubjectFilterText.next(text);
  }

  CloseAssignToGroupDialog() {
    this.SubjectCustomersForGroup.next([]);
    this.SubjectAddToExistingGroupPopup.next(false);
  }

  GetAgentId(): string {
    return this.authService.UserId;
  }

  GetAgentName(): string {
    return this.authService.UserName;
  }
  GetDeskName(): string {
    if (this.stationDetails && this.stationDetails.Value && this.stationDetails.Value.Desk) {
      return this.stationDetails.Value.Desk.text;
    } else {
      return '';
    }
  }
  Getloginas() {
    return this.stationDetails.Value.LoginAs;
  }
  CallSelectedCustomers(calledCustomers: IAgentCustomersListItem[]) {
    if(calledCustomers.length > 1){
      this.SubjectIsStationSectionExpand.next(false);
    }
    this.agentActionsService
      .CallCustomers(calledCustomers)
      .subscribe((calledResponse) => {
        this.OnRequestAdded(calledResponse);
        if (calledResponse && calledResponse.length === 1) {
          this.OnSuccessfulCalled(calledCustomers);
        }
      });
  }

  CallNextFromBranch() {
    this.agentActionsService
      .CallNextFromBranch()
      .subscribe((calledResponse) => {
        this.OnRequestAdded(calledResponse);
        if (calledResponse && calledResponse.length > 0) {
          this.OnRequestAdded(calledResponse);
            this.OnSuccessfulCalled(this.MapServingToCustomers(calledResponse));
        } else {
          this.appNotificationService.NotifyInfo(CommonMessages.NextUpIsEmpty);
        }
      });
  }

  CallNextFromQueue(queueId: string) {
    this.agentActionsService
      .CallNextFromQueue(queueId)
      .subscribe((calledResponse) => {
        this.OnRequestAdded(calledResponse);
        if (calledResponse && calledResponse.length > 0) {
          this.OnRequestAdded(calledResponse);
            this.OnSuccessfulCalled(this.MapServingToCustomers(calledResponse));
        } else {
          this.appNotificationService.NotifyInfo(CommonMessages.NextUpIsEmpty);
        }
      });
  }

  CallNextFromGroup(groupId: string) {
    this.agentActionsService
      .CallNextFromGroup(groupId)
      .subscribe((calledResponse) => {
        this.OnRequestAdded(calledResponse);
        if (calledResponse && calledResponse.length > 0) {
          this.OnRequestAdded(calledResponse);
            this.OnSuccessfulCalled(this.MapServingToCustomers(calledResponse));
        } else {
          this.appNotificationService.NotifyInfo(CommonMessages.NextUpIsEmpty);
        }
      });
  }

  OnSuccessfulCalled(expandedCustomers:IAgentCustomersListItem[]) {
      this.SetExpandedForStation(expandedCustomers[0], false,true)
      this.SubjectIsStationSectionExpand.next(true);
  }

  ServeSelectedCustomers(ServedCustomers: IAgentCustomersListItem[]) {
    if (this.stationDetails?.AgentConfigurations?.useDirectServedEnabled) {
      this.agentActionsService
        .DirectServedComplete(ServedCustomers)
        .subscribe((response) => {
          if (response) {
            this.OnCustomerRequestRemoved(response.requests);
            this.queueSignalRService.UpdateQueue(response.queue);
          }
        });
    } else {
      this.agentActionsService
        .StartServing(ServedCustomers)
        .subscribe((response) => {
          if (response) {
            this.OnRequestAdded(response.requests);
            this.queueSignalRService.UpdateQueue(response.queue);
          }
        });
    }
  }

  @Confirmable(CommonMessages.ConfirmDeleteCustomerMessage)
  DeletedSelectedCustomers(Customers: IAgentCustomersListItem[]) {
    this.agentAPIService
      .DeleteQueuedCustomers(this.authService.CompanyId, {
        agentId: this.GetAgentId(),
        branchId: this.stationDetails.BranchId,
        deskId: this.stationDetails.DeskId,
        customers: Customers,
      })
      .subscribe((response) => {
        if (response) {
          this.OnCustomerRequestRemoved(response.requests);
          this.queueSignalRService.UpdateQueue(response.queue);
        }
      });
  }

  CompleteServingCustomers(Customers: IAgentCustomersListItem[]) {
    this.agentActionsService
      .CompleteServing(Customers)
      .subscribe((response) => {
        this.OnCustomerRemoved(response);
      });
  }

  ResetSelected() {
    let customers: IAgentCustomersListItem[] =
      this.CustomersInQueueSubject.getValue();
    customers = customers.concat([]);

    customers.forEach((customer) => {
      customer.isCtrlSelected = false;
    });

    this.CustomersInQueueSubject.next(customers);
  }

  OpenMoveToPosition(customer: IAgentCustomersListItem) {
    this.SubjectOpenMoveToPositionPopup.next(true);
  }
  CloseMoveToPosition() {
    this.SubjectOpenMoveToPositionPopup.next(false);
  }

  GetBranchTimeZoneOffset(): number {
    return 330;
  }

  // region Url Generate Methods

  DeSelectAll(): void {
    const customers = this.CustomersInQueueSubject.getValue();
    customers.forEach((customer) => {
      customer.isSelected = false;
    });
    this.CustomersInQueueSubject.next(customers.concat([]));
    this.SubjectIsSelectAll.next(false);
  }

  SelectAll(): void {
    const customers = this.CustomersInQueueSubject.getValue();
    customers.forEach((customer) => {
      customer.isSelected = true;
    });
    this.CustomersInQueueSubject.next(customers.concat([]));
    this.SubjectIsSelectAll.next(true);
  }

  UpdateSelectAll() {
    const customers = this.CustomersInQueueSubject.getValue();
    const IsSelectAll = customers.every((customer) => customer.isSelected);
    this.SubjectIsSelectAll.next(IsSelectAll);
  }

  SetSelectedForGrid(id: string, status: boolean) {
    const customers = this.CustomersInQueueSubject.getValue();
    customers.forEach((customer) => {
      customer.isSelected = customer.id == id ? status : customer.isSelected;
    });
    this.CustomersInQueueSubject.next(customers.concat([]));
    this.SubjectIsSelectAll.next(true);
    this.UpdateSelectAll();
  }

  SetExpandedForGrid(id: string, status: boolean) {
    const customers = this.CustomersInQueueSubject.getValue();
    customers.forEach((customer) => {
      customer.isExpanded = customer.id == id ? status : false;
    });
    this.CustomersInQueueSubject.next(customers.concat([]));
  }

  SetExpandedForStation(customer: IAgentCustomersListItem, status: boolean,calledSingleCustomer: boolean = false) {
    let AllExpandedCustomers = this.SubjectExpandedCustomersStation.getValue();
    AllExpandedCustomers = AllExpandedCustomers.filter(
      (c) => c.id != customer.id
    );
    if (status) {
      AllExpandedCustomers.push(customer);
    }
    if (calledSingleCustomer) {
      AllExpandedCustomers = [customer];
    }
    this.SubjectExpandedCustomersStation.next(AllExpandedCustomers.concat([]));
  }

  ToggleStationExpanded(): void {
    const Expanded = this.SubjectIsStationSectionExpand.getValue();
    this.SubjectIsStationSectionExpand.next(!Expanded);
  }

  OpenCustomerInformationDialog(customer: IAgentCustomersListItem): void {
    this.SubjectCustomerForDialog.next(customer);
    this.SubjectIsCustomerInformationDialogOpen.next(true);
  }

  CloseCustomerInformationDialog(IsEditMode: boolean): void {
    if (!IsEditMode) {
      this.SubjectCustomerForDialog.next(null);
    }
    this.SubjectIsCustomerInformationDialogOpen.next(false);
  }

  OpenTransferServiceDialog(customer: IAgentCustomersListItem): void {
    this.SubjectTransferServiceForDialog.next(customer);
    this.SubjectIsTransferServiceDialogOpen.next(true);
  }
  CloseTransferServiceDialog(): void {
    this.SubjectIsTransferServiceDialogOpen.next(false);
    this.SubjectTransferServiceForDialog.next(null);
  }

  OnRequestAdded(requests: KioskRequest[] | any) {
    if (requests) {
      if (!Array.isArray(requests)) {
        requests = [requests.Customer];
      }
      requests = requests.filter((x) => x && this.IsInMyQueue(x.queueId));
      let WaitingRequests = this.KioskRequestsSubject.getValue() || [];
      let ServingRequests = this.ServingCustomersSubject.getValue() || [];

      for(let r of requests) {
        let existing: any = WaitingRequests.find((x) => r.id == x.id);
        if(!existing) {
          existing = ServingRequests.find((x) => r.id == x.id);
        }

        if(existing) {
          if(existing._ts && r._ts && existing._ts != 0 && r._ts != 0) {
            if(existing._ts >= r._ts) {
              requests.splice(requests.indexOf(r), 1);
            }
          }
        }
      }

      WaitingRequests = WaitingRequests.filter(
        (x) => !requests.find((y) => y.id == x.id)
      );
      this.KioskRequestsSubject.next(WaitingRequests.concat(requests));
    }
  }

  IsInMyQueue(queueId: string): boolean {
    const Queues = this.GetAgentQueues();
    const IsInQueue = Queues?.find((x) => x === queueId);
    return IsInQueue ? true : false;
  }

  OnCustomerRemoved(ids: string[]) {
    const requests = this.KioskRequestsSubject.getValue();

    const WaitingRequests = requests
      .filter((x) => !ids.find((y) => y == x.id))
      .concat([]);
    this.KioskRequestsSubject.next(WaitingRequests.concat([]));
  }

  OnCustomerRequestRemoved(requests: IMinimiumKioskRequestModel[]) {
    let WaitingRequests = this.KioskRequestsSubject.getValue() || [];
    let ServingRequests = this.ServingCustomersSubject.getValue() || [];

    for(let r of requests) {
      let existing: any = WaitingRequests.find((x) => r.id == x.id);
      if(!existing) {
        existing = ServingRequests.find((x) => r.id == x.id);
      }

      if(existing) {
        if(existing._ts && r._ts && existing._ts != 0 && r._ts != 0) {
          if(existing._ts >= r._ts) {
            requests.splice(requests.indexOf(r), 1);
          }
        }
      }
    }

    WaitingRequests = WaitingRequests
    .filter((x) => !requests.find((y) => y.id == x.id))
    .concat([]);
  this.KioskRequestsSubject.next(WaitingRequests.concat([]));

  }

  @Confirmable(CommonMessages.ConfirmReposition)
  Cancel(customer: IAgentCustomersListItem) {
    this.agentAPIService
      .CustomerBackToQueue<PostBackToQueue>(
        this.authService.CompanyId,
        this.authService.UserId,
        this.stationDetails.BranchId,
        this.stationDetails.TemplateId,
        {
          branchId: this.stationDetails.BranchId,
          companyId: this.authService.CompanyId,
          requestId: customer.id,
        }
      )
      .subscribe((response) => {
        this.queueSignalRService.UpdateQueue(response.Queue);
        if (response.Customer) {
          if (response.Customer.isDeleted) {
            this.OnCustomerRequestRemoved([response.Customer]);
            this.AppNotificationService.Notify(
              'Visitor deleted due to requeuing.'
            );
          } else {
            this.OnRequestAdded([response.Customer]);
            this.AppNotificationService.Notify(
              'Visitor sent back to the queue.'
            );
          }
        }
      });
  }
}
function GetLanguageName(selectedLanguageId: string, languages: any[]): string {
  let selectedLanguage: string = languages?.find((x) => x.languageCode == selectedLanguageId)?.language;
  if (!selectedLanguage) {
    selectedLanguage = languages?.find((x) => x.isDefault)?.language;
  }
  return selectedLanguage;
}
