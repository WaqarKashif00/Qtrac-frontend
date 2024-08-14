import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  CustomerState,
  IAgentCustomersListItem,
  IGroupDetails,
  IQueueDetails
} from '../../models/agent-models';
import { AgentGridFilterService } from '../../utility-services/services/agent-grid-filter-service/agent-grid-filter.service';

@Component({
  selector: 'lavi-agent-filters',
  templateUrl: './agent-filters.component.html',
  styleUrls: ['./agent-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentFiltersComponent extends AbstractComponent {
  @Input() IsAgentAvailable: boolean;
  @Input() IsAllowGrouping: boolean;
  @Input() Queues: IQueueDetails[];
  @Input() Groups: IGroupDetails[];
  @Input() currentLanguage: string;
  @Input() byQueueText: string;
  @Input() byVisitorTagText: string;

  IsSettingMenuShow: boolean;
  AllCustomers: IAgentCustomersListItem[];

  constructor(
    private agentGridFilterService: AgentGridFilterService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  Init() {
    this.subs.sink = this.agentGridFilterService.AllCustomers$.subscribe(
      (customers) => {
        this.AllCustomers = customers;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  ToggleFilter() {}

  ToggleGroups() {}

  QueueCount(queueId: string): Observable<string> {
    return this.agentGridFilterService.AllCustomers$.pipe(
      map((customers) => {
        const Customers = customers.filter(
          (customer) =>
            customer.queueId == queueId &&
            customer.customerState == CustomerState.WAITING &&
            !customer.isDeleted &&
            customer.sortPosition !== '0'
        )
        if (Customers && Customers.length > 0) {
          const Count = Customers.length;
          return Count.toString();
        }
        return '0';
      })
    );
  }
  
  GroupCount(groupId: string): Observable<string> {
    return this.agentGridFilterService.AllCustomers$.pipe(
      map((customers) => {
        const Customers = customers.filter(
          (customer) =>
          customer.customerState == CustomerState.WAITING &&
          customer.groups.some((g) => g == groupId) &&
          !customer.isDeleted &&
          customer.sortPosition !== '0'
        )
        if (Customers && Customers.length > 0) {
          const Count = Customers.length;
          return Count.toString();
        }
        return '0';
      })
    );
  }

  CallNextFromQueue(queueId: string) {
    this.agentGridFilterService.CallNextFromQueue(queueId);
  }

  CallNextFromGroup(groupId: string) {
    this.agentGridFilterService.CallNextFromGroup(groupId);
  }

  ToggleAddVisitor() {}

  QueueChecked(queue, state) {
    if (state) {
      this.agentGridFilterService.AddQueue(queue);
    } else {
      this.agentGridFilterService.RemoveQueue(queue);
    }
  }

  GroupChecked(groups, state) {
    if (state) {
      this.agentGridFilterService.AddGroup(groups);
    } else {
      this.agentGridFilterService.RemoveGroup(groups);
    }
  }

  IsQueueSelected(queue): boolean {
    return this.agentGridFilterService.IsQueueSelected(queue);
  }

  IsGroupSelected(group): boolean {
    return this.agentGridFilterService.IsGroupSelected(group);
  }
}
