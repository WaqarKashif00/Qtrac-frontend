import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAgentCustomersListItem, IGroupDetails, IQuestion } from 'src/app/features/utility-configuration/agent/models/agent-models';
import { QuestionType } from '../../../../../../models/enums/question-type.enum';


@Component({
    selector: 'lavi-agent-station-panel-item',
    styleUrls: ['./agent-station-panel-item.component.scss'],
    templateUrl: './agent-station-panel-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AgentStationPanelItemComponent extends AbstractComponent {
    @Input() Customer: IAgentCustomersListItem;

    @Input() SelectedCustomers: IAgentCustomersListItem[];
    @Input() ExpandedCustomers: IAgentCustomersListItem[];
    @Input() IsServingByOther: boolean;
    @Input() IsCanServe: boolean;
    @Input() IsFullView: boolean;
    @Input() AllowedNotes: boolean;
    @Input() AllowTicketDeletion: boolean;
    @Input() AllowedSMS: boolean;
    @Input() AllowGrouping: boolean;
    @Input() AllowTransferingService: boolean;
    @Input() AllowTakeOverCustomer: boolean;
    @Input() AllowCancellingService: boolean;
    @Input() AllowSelectedVisitorCalling: boolean;
    @Input() AllowToCreateGroup: boolean;
    @Input() Groups: IGroupDetails[];
    @Input() MaxCallLimit: number;
    @Input() ServeButtonLabel: string;
    @Input() HideTicketNumber:boolean;
    @Input() messageText: string;
    @Input() teamNotesText: string;
    @Input() currentLanguage: string;
    @Input() noShowText: string;
    @Input() visitorTagText: string;
    @Input() queueText: string;
    @Input() viewText: string;
    @Input() callingText: string;
    @Input() servingText: string;

    @Output() OnCall: EventEmitter<IAgentCustomersListItem>;
    @Output() OnServe: EventEmitter<IAgentCustomersListItem>;
    @Output() OnEndServing: EventEmitter<IAgentCustomersListItem>;
    @Output() OnDelete: EventEmitter<IAgentCustomersListItem>;
    @Output() OnChecked: EventEmitter<boolean>;
    @Output() OnExpanded: EventEmitter<boolean>;
    @Output() OnShowSMSChat: EventEmitter<void>;
    @Output() OnShowNotes: EventEmitter<void>;
    @Output() OnAddToGroup: EventEmitter<void>;
    @Output() OnCancel: EventEmitter<void>;
    @Output() OnTransferServiceDailog: EventEmitter<void>;

    // IsExpanded: boolean;
    QuestionType = QuestionType;


    get ClientTimeZoneOffset(): string {
        return (new Date()).getTimezoneOffset().toString();
    }

    get TimerStle(): any {
        return {

        };
    }

    get IsSelected(): boolean {
        const IsSelected = this.SelectedCustomers?.find(x => x.id == this.Customer.id);
        if (IsSelected) {
            return true;
        } else {
            return false;
        }
    }

    get IsExpanded(): boolean {
        const IsExpanded = this.ExpandedCustomers?.find(x => x.id == this.Customer.id);
        if (IsExpanded) {
            return true;
        } else {
            return false;
        }
    }

    get PrimaryDisplayFieldValue(): any {
        if (this.Customer && this.Customer.agentQuestions) {
            const displayField = this.Customer.agentQuestions
                .find(question => question.displayFieldPriority == 1);
            if (displayField) {
                return displayField.answer;
            }
            else {
                return this.Customer?.ticketNumber;
            }
        } else {
            return this.Customer?.ticketNumber;
        }
    }

    get DisplayFieldsExcludePrimary(): IQuestion[] {
        if (this.Customer) {
            return this.Customer.agentQuestions?.filter(question => question.displayFieldPriority > 1);
        } else {
            return [];
        }
    }

    get CustomerGroups(): IGroupDetails[] {
        if (this.Customer?.groups && this.Groups) {
            return this.Groups.filter(g => this.Customer?.groups.find(x => x == g.id));
        }
        return [];
    }

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
        this.IsFullView = false;
        this.InitializeOutputs();
    }

    InitializeOutputs() {
        this.OnCall = new EventEmitter<IAgentCustomersListItem>();
        this.OnServe = new EventEmitter<IAgentCustomersListItem>();
        this.OnEndServing = new EventEmitter<IAgentCustomersListItem>();
        this.OnDelete = new EventEmitter<IAgentCustomersListItem>();
        this.OnChecked = new EventEmitter<boolean>();
        this.OnExpanded = new EventEmitter<boolean>();
        this.OnShowSMSChat = new EventEmitter();
        this.OnShowNotes = new EventEmitter();
        this.OnAddToGroup = new EventEmitter();
        this.OnCancel = new EventEmitter();
        this.OnTransferServiceDailog = new EventEmitter();
    }

    ToggleExpand(): void {
        this.OnExpanded.emit(!this.IsExpanded);
    }



    Call(): void {
        this.OnCall.emit(this.Customer);
    }

    Serve(): void {
        this.OnServe.emit(this.Customer);
    }

    EndServing(Customer): void {
        this.OnEndServing.emit(this.Customer);
    }

    Delete(Customer): void {
        this.OnDelete.emit(this.Customer);
    }

    Cancel(): void {
        this.OnCancel.emit();
    }

    Checked() {
        this.OnChecked.emit(!this.IsSelected);
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

    OpenTransferServiceDialog():void {
        this.OnTransferServiceDailog.emit();
     }

     CheckUrl(data: string, index: number) {
        const isValidUrl = data => {
          var urlPattern = new RegExp('^(http(s?):\\/\\/)' + // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
          return !!urlPattern.test(data);
        }
        if (isValidUrl(data)) {
          this.Customer.agentQuestions[index].IsHyperLink = true;
    
        }
    
      }
    
    
      Init(): void {
        for (let i = 0; i < this.Customer.agentQuestions?.length; i++) {
          this.Customer.agentQuestions[i].IsHyperLink = false;
          this.CheckUrl(this.Customer.agentQuestions[i].answer, i);
    
        }
      }
     
}
