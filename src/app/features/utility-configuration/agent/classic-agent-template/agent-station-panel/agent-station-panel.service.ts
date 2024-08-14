import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AgentNotesModalService } from '../../agent-notes/agent-notes-modal.service';
import { AgentSMSChatModalService } from '../../agent-sms-chat/agent-sms-chat-modal.service';
import { CustomerState, IAgentCustomersListItem, IGroupDetails } from '../../models/agent-models';
import { ClassicAgentService } from '../classic-agent.service';

@Injectable()
export class AgentStationPanelService extends AbstractComponentService {
    /**
     *
     */
    private SubjectCustomers: BehaviorSubject<IAgentCustomersListItem[]>;
    public Customers$: Observable<IAgentCustomersListItem[]>;

    private SubjectOtherServingCustomers: BehaviorSubject<IAgentCustomersListItem[]>;
    OtherServingCustomers$: Observable<IAgentCustomersListItem[]>;

    public IsSelectAll$: Observable<boolean>;


    private SubjectSelectedCustomers: BehaviorSubject<IAgentCustomersListItem[]>;
    public SelectedCustomers$: Observable<IAgentCustomersListItem[]>;

    public ExpandedCustomers$: Observable<IAgentCustomersListItem[]>;
    
    public IsStationExpanded$: Observable<boolean>;

    private SubjectIsShowOthersServing: BehaviorSubject<boolean>;
    public IsShowOthersServing$: Observable<boolean>;

    Groups$: Observable<IGroupDetails[]>;


    AgentId: string;

    private TempCalledCustomers: IAgentCustomersListItem[];
    private TempServingCustomers: IAgentCustomersListItem[];

    get AgentName(): string{
        return this.authService.UserName;
   }
 
    constructor(
        private service: ClassicAgentService,
        private chatService: AgentSMSChatModalService,
        private notesService: AgentNotesModalService
    ) {
        super();
        this.TempCalledCustomers = [];
        this.TempServingCustomers = [];
        this.SetObservables();
        this.AgentId = this.service.GetAgentId();
        this.Groups$ = this.service.Groups$;


        this.subs.sink = this.service.KioskRequests$.subscribe((KioskRequests) => {
            // check for customerState
            const servingCustomers = KioskRequests.filter(
              (x) => x.customerState == CustomerState.SERVING
            );
            const WaitingCustomers = KioskRequests.filter(
              (x) => !(x.customerState == CustomerState.SERVING)
            );
      
            const waitingCustomersModels: IAgentCustomersListItem[] = this.service.MapRequestsToModel(WaitingCustomers);
      
            const servingCustomersModels: IAgentCustomersListItem[] = this.service.MapServingToCustomers(servingCustomers);
            
           let TempCustomer = waitingCustomersModels.concat(servingCustomersModels);

           let filteredOther = TempCustomer.filter(x=>((x.customerState == CustomerState.CALLED && x.calledById !=this.AgentId)  || (x.customerState == CustomerState.SERVING && x.servingById != this.AgentId)))
           let filteredOwn = TempCustomer.filter(x=>((x.customerState == CustomerState.CALLED && x.calledById ==this.AgentId)  || (x.customerState == CustomerState.SERVING && x.servingById == this.AgentId)))

           this.SubjectCustomers.next(filteredOwn);

           this.SubjectOtherServingCustomers.next(filteredOther);
          });
            
        this.ExpandedCustomers$ = this.service.ExpandedCustomersStation$;

    }

    SetObservables() {
        this.SubjectCustomers = new BehaviorSubject<IAgentCustomersListItem[]>([]);
        this.Customers$ = this.SubjectCustomers.asObservable();

        this.IsStationExpanded$ = this.service.IsStationSectionExpand$;

        this.SubjectIsShowOthersServing = new BehaviorSubject<boolean>(true);
        this.IsShowOthersServing$ = this.SubjectIsShowOthersServing.asObservable();

        this.SubjectSelectedCustomers = new BehaviorSubject<IAgentCustomersListItem[]>([]);
        this.SelectedCustomers$ = this.SubjectSelectedCustomers.asObservable();

       

        this.SubjectOtherServingCustomers = new BehaviorSubject<IAgentCustomersListItem[]>([]);
        this.OtherServingCustomers$ = this.SubjectOtherServingCustomers.asObservable();
    }

    DeSelectAll(): void {
        this.SubjectSelectedCustomers.next([]);
    }

    SetSelected(customer: IAgentCustomersListItem, status: boolean) {
        let AllSelectedCustomers = this.SubjectSelectedCustomers.getValue();
        AllSelectedCustomers = AllSelectedCustomers.filter((c) => c.id != customer.id);
        if (status) {
            AllSelectedCustomers.push(customer);
        }
        this.SubjectSelectedCustomers.next(AllSelectedCustomers.concat([]));
    }

    SetExpanded(customer: IAgentCustomersListItem, status: boolean) {
        this.service.SetExpandedForStation(customer,status);
    }

    ToggleStationExpanded() {
        this.service.ToggleStationExpanded();
    }

    ToggleShowOtherServe() {
        const IsShowOthersServing = this.SubjectIsShowOthersServing.getValue();
        this.SubjectIsShowOthersServing.next(!IsShowOthersServing);
    }

    SelectAll(): void {
        const AllCustomers = this.SubjectCustomers.getValue();
        this.SubjectSelectedCustomers.next(AllCustomers.concat([]));
    }

    Call(customer: IAgentCustomersListItem): void {
        this.service.CallSelectedCustomers([customer]);
    }

    Serve(customer: IAgentCustomersListItem): void {
        this.service.ServeSelectedCustomers([customer]);
    }


    CompleteServingCustomers(Customers: IAgentCustomersListItem[]) {
        this.service.CompleteServingCustomers(Customers);
    }

    Delete(customer: IAgentCustomersListItem[]): void {
        this.service.DeletedSelectedCustomers(customer);
    }

    Cancel(customer: IAgentCustomersListItem) {
        this.service.Cancel(customer);
    }


    CompleteServingOfSelectedCustomers() {
        const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
        this.service.CompleteServingCustomers(SelectedCustomers);
        this.DeSelectAll();
    }

    CallSelected() {
        const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
        this.service.CallSelectedCustomers(SelectedCustomers);
        this.DeSelectAll();
    }

    ServeSelected() {
        const SelectedCustomers = this.SubjectSelectedCustomers.getValue();
        this.service.ServeSelectedCustomers(SelectedCustomers);
        this.DeSelectAll();
    }

    ShowSMSChat(request: IAgentCustomersListItem): void {
        this.chatService.ShowSMSChatModal(request);
    }

    ShowNotes(request: IAgentCustomersListItem): void {
        this.notesService.ShowNotesModal(request);
    }

    ShowTransferServiceDialog(customer: IAgentCustomersListItem){
        this.service.OpenTransferServiceDialog(customer);
      }
}
