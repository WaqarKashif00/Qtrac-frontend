import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { ClassicAgentService } from '../../../classic-agent-template/classic-agent.service';
import {
  IAgentCustomersListItem,
  IGroupDetails,
  IQueueDetails
} from '../../../models/agent-models';

@Injectable()
export class AgentGridFilterService extends AbstractComponentService {
  SelectedQueues: IQueueDetails[];
  SelectedGroups: IGroupDetails[];
  private AllCustomers: IAgentCustomersListItem[];
  private SubjectFilteredCustomers: BehaviorSubject<IAgentCustomersListItem[]>;

  AllCustomers$: Observable<IAgentCustomersListItem[]>;
  FilteredCustomers$: Observable<IAgentCustomersListItem[]>;

  /**
   *
   */
  constructor(private classicService: ClassicAgentService) {
    super();
    this.SelectedQueues = [];
    this.SelectedGroups = [];

    this.AllCustomers$ = this.classicService.CustomersInQueue$;

    this.SubjectFilteredCustomers = new BehaviorSubject<
      IAgentCustomersListItem[]
    >([]);
    this.FilteredCustomers$ = this.SubjectFilteredCustomers.asObservable();

    this.AllCustomers$.subscribe((customers) => {
      this.AllCustomers = customers;
      this.Filter();
    });
  }

  private Filter(): void {
    this.SubjectFilteredCustomers.next(
      this.AllCustomers.filter(
        (x) =>
          this.IsPresentInQueue(x) &&
          this.IsPresentInGroup(x) &&
          !x.isCalled &&
          !x.isNowServing
      )
    );
  }

  private IsPresentInQueue(customer: IAgentCustomersListItem): boolean {
    if (this.SelectedQueues && this.SelectedQueues.length > 0) {
      const found = this.SelectedQueues.find((x) => x.id === customer.queueId);
      return !!found ? true : false;
    } else {
      return true;
    }
  }

  private IsPresentInGroup(customer: IAgentCustomersListItem): boolean {
    if (this.SelectedGroups && this.SelectedGroups.length > 0) {
      if (customer?.groups?.length > 0) {
        const found = customer.groups.find((groupId) =>
          this.SelectedGroups.some((group) => group.id == groupId)
        );
        return !!found ? true : false;
      }
      return false;
    } else {
      return true;
    }
  }

  AddQueue(queue: IQueueDetails): void {
    this.SelectedQueues.push(queue);
    this.Filter();
  }

  RemoveQueue(queue: IQueueDetails): void {
    this.SelectedQueues = this.SelectedQueues.filter((q) => q.id !== queue.id);
    this.Filter();
  }

  AddGroup(group: IGroupDetails): void {
    this.SelectedGroups.push(group);
    this.Filter();
  }

  RemoveGroup(group: IGroupDetails): void {
    this.SelectedGroups = this.SelectedGroups.filter((q) => q.id !== group.id);
    this.Filter();
  }

  CallNextFromGroup(groupId: string) {
    this.classicService.CallNextFromGroup(groupId);
  }

  CallNextFromQueue(queueId: string) {
    this.classicService.CallNextFromQueue(queueId);
  }

  IsQueueSelected(queue): boolean {
    if (!this.SelectedQueues) {
      return false;
    }
    if (this.SelectedQueues.length == 0) {
      return false;
    }
    return this.SelectedQueues.find((q) => q.id == queue.id) ? true : false;
  }

  IsGroupSelected(group): boolean {
    if (!this.SelectedGroups) {
      return false;
    }
    if (this.SelectedGroups.length == 0) {
      return false;
    }
    return this.SelectedGroups.find((q) => q.id == group.id) ? true : false;
  }
}
