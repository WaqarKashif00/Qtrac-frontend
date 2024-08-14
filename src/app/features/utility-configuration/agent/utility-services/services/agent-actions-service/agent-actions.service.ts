import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AgentAPIService } from '../../../../../../shared/api-services/agent-api.service';
import {
  IAgentCustomersListItem,
  IPostCustomers,
  KioskRequest,
} from '../../../models/agent-models';
import { QueueUpdateResponse } from '../../../models/back-to-queue/delete-queued-customer.model';
import { AgentStationDataService } from '../agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentActionsService extends AbstractComponentService {
  get AgentId(): string {
    return this.authService.UserId;
  }

  constructor(
    private readonly agentStationDataService: AgentStationDataService,
    private readonly agentAPIService: AgentAPIService
  ) {
    super();
    this.Initialize();
  }

  Initialize() {}

  CallCustomers(
    customers: IAgentCustomersListItem[]
  ): Observable<KioskRequest[]> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.CallCustomers<KioskRequest[], IPostCustomers>(
      CompanyId,
      {
        agentId: this.AgentId,
        customerIds: customers.map((x) => x.id),
        branchId: this.agentStationDataService.BranchId,
        deskId: this.agentStationDataService.DeskId,
        customers: customers,
      }
    );
  }

  CallNextFromBranch(): Observable<KioskRequest[]> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.CallNextFromBranch(CompanyId, {
      agentId: this.AgentId,
      templateId: this.agentStationDataService.TemplateId,
      branchId: this.agentStationDataService.BranchId,
      deskId: this.agentStationDataService.DeskId,
      workflowId:this.agentStationDataService.WorkflowId,
      queueId: '',
      groupId: '',
    });
  }
  CallNextFromQueue(queueId: string): Observable<KioskRequest[]> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.CallNextFromBranch(CompanyId, {
      agentId: this.AgentId,
      templateId: this.agentStationDataService.TemplateId,
      branchId: this.agentStationDataService.BranchId,
      deskId: this.agentStationDataService.DeskId,
      workflowId:this.agentStationDataService.WorkflowId,
      queueId: queueId,
      groupId: '',
    });
  }
  CallNextFromGroup(groupId: string): Observable<KioskRequest[]> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.CallNextFromBranch(CompanyId, {
      agentId: this.AgentId,
      templateId: this.agentStationDataService.TemplateId,
      branchId: this.agentStationDataService.BranchId,
      deskId: this.agentStationDataService.DeskId,
      workflowId:this.agentStationDataService.WorkflowId,
      queueId: '',
      groupId: groupId,
    });
  }
  DirectServedComplete(
    customers: IAgentCustomersListItem[]
  ): Observable<QueueUpdateResponse> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.ServeCustomersAsDirectCompleteServing(
      CompanyId,
      {
        agentId: this.AgentId,
        customerIds: customers.map((x) => x.id),
        branchId: this.agentStationDataService.BranchId,
        deskId: this.agentStationDataService.DeskId,
        customers: customers,
      }
    );
  }

  StartServing(customers: IAgentCustomersListItem[]) {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.ServeCustomers<QueueUpdateResponse, IPostCustomers>(
      CompanyId,
      {
        agentId: this.AgentId,
        customerIds: customers.map((x) => x.id),
        branchId: this.agentStationDataService.BranchId,
        deskId: this.agentStationDataService.DeskId,
        customers: customers,
      }
    );
  }

  CompleteServing(customers: IAgentCustomersListItem[]): Observable<string[]> {
    const CompanyId = this.authService.CompanyId;
    return this.agentAPIService.CompleteServing<string[], IPostCustomers>(
      CompanyId,
      this.agentStationDataService.TemplateId,
      this.AgentId,
      {
        agentId: this.AgentId,
        branchId: this.agentStationDataService.BranchId,
        deskId: this.agentStationDataService.DeskId,
        customers: customers,
        customerIds: customers.map((x) => x.id),
      }
    );
  }
}
