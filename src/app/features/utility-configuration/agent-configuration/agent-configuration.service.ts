import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { AgentAPIService } from '../../../shared/api-services/agent-api.service';
import { WorkflowAPIService } from '../../../shared/api-services/workflow-api.service';
import { IAgentRequest } from './add-or-edit-agent-configuration/models/agent-configuration-request.interface';
import { IAgentWorkflow } from './add-or-edit-agent-configuration/models/agent-workflows.interface';

@Injectable()
export class AgentConfigurationService extends AbstractComponentService {
  private CompanyId = this.authService.CompanyId;
  private SubjectAgentTemplateList: BehaviorSubject<IAgentRequest[]>;
  public AgentTemplateList$: Observable<IAgentRequest[]>;
  private SubjectWorkflow: BehaviorSubject<IAgentWorkflow[]>;
  public Workflow$: Observable<IAgentWorkflow[]>;
  private SubjectAgentViewType: BehaviorSubject<IDropdownList[]>;
  public AgentViewType$: Observable<IDropdownList[]>;

  constructor(
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly agentAPIService: AgentAPIService,
  ) {
    super();
    this.InitializeObservablesAndSetInitialValues();
  }

  private InitializeObservablesAndSetInitialValues() {
    this.SubjectAgentTemplateList = new BehaviorSubject<IAgentRequest[]>([]);
    this.AgentTemplateList$ = this.SubjectAgentTemplateList.asObservable();
    this.SubjectWorkflow = new BehaviorSubject<IAgentWorkflow[]>([]);
    this.Workflow$ = this.SubjectWorkflow.asObservable();
    this.SubjectAgentViewType = new BehaviorSubject<IDropdownList[]>([]);
    this.AgentViewType$ = this.SubjectAgentViewType.asObservable();
    this.GetWorkflow();
    this.GetAgentViewType();
    this.GetAgentTemplateList();
  }

  public GetWorkflow() {
    this.workflowAPIService
      .GetDropdownListWithNoLoading(this.CompanyId)
      .subscribe((x: IAgentWorkflow[]) => {
        this.SubjectWorkflow.next(x);
      });
  }

  public GetAgentViewType() {
    this.agentAPIService
      .GetViewTypes<IDropdownList>(this.CompanyId)
      .subscribe((x: IDropdownList[]) => {
        this.SubjectAgentViewType.next(x);
      });
  }

  public RedirectToAddAgentTemplate() {
    this.routeHandlerService.RedirectToAddAgentTemplate();
    this.browserStorageService.RemoveAgentId();
  }

  public RedirectToEditAgentTemplate(agentId: string) {
    if (agentId) {
      this.browserStorageService.SetAgentId(agentId);
    }
    this.routeHandlerService.RedirectToEditAgentTemplate();
  }

  public GetAgentTemplateList() {
    this.agentAPIService
      .GetAll<IAgentRequest>(this.CompanyId)
      .subscribe((list: IAgentRequest[]) => {
        this.SubjectAgentTemplateList.next(list);
      });
  }

  Delete(agent: IAgentRequest) {
    return this.agentAPIService.Delete(this.CompanyId, agent.id);
  }
}
