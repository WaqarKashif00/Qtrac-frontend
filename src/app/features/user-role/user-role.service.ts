import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TokenService } from 'src/app/core/services/token.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import {
  IAddUserRole,
  IAgentQueueDropdownList,
  IAgentTemplate,
  IPostUserRoleData,
  IUserRoleActionType,
  IUserRoleFormWrapper
} from 'src/app/models/common/user-role/add-user-role';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { RoleActionsPageNameEnum } from 'src/app/models/enums/role-actions.enum';
import { UserRoleAPIService } from 'src/app/shared/api-services/user-role-api.service';
import { IHomeInterfaceDropdownList } from '../../models/common/home-interface/home-interface.interface';
import { CommonMessages } from '../../models/constants/message-constant';
import { AgentAPIService } from '../../shared/api-services/agent-api.service';
import { HomeInterfaceAPIService } from '../../shared/api-services/home-interface-api.service';
import { UserAPIService } from '../../shared/api-services/user-api.service';
import { WorkflowAPIService } from '../../shared/api-services/workflow-api.service';

@Injectable()
export class UserRoleService extends AbstractComponentService {
  private UserRoleSubject: BehaviorSubject<IAddUserRole>;
  UserRole$: Observable<IAddUserRole>;

  private AllRolesListSubject: BehaviorSubject<IAddUserRole[]>;
  AllRolesList$: Observable<IAddUserRole[]>;

  private OpenUserRoleDialogSubject: BehaviorSubject<boolean>;
  OpenUserRoleDialog$: Observable<boolean>;
  private AgentTemplateDropdownListSubject: BehaviorSubject<IAgentDropdown[]>;
  AgentTemplateDropdownList$: Observable<IAgentDropdown[]>;
  private AgentQueueDropdownListSubject: BehaviorSubject<
    IAgentQueueDropdownList[]
  >;
  AgentQueueDropdownList$: Observable<IAgentQueueDropdownList[]>;
  private HomeInterfaceDropdownListSubject: BehaviorSubject<IHomeInterfaceDropdownList[]>;
  HomeInterfaceDropdownList$: Observable<IHomeInterfaceDropdownList[]>;

 private EditedTemplateIdSubject: BehaviorSubject<string>;
 EditedTemplateId$: Observable<string>;
  private SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;

  constructor(
    private readonly userRoleAPIService: UserRoleAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private tokenService: TokenService,
    private readonly agentAPIService: AgentAPIService,
    private readonly userAPIService: UserAPIService,
    private readonly homeInterfaceAPIService: HomeInterfaceAPIService,
  ) {
    super();
    this.SetObservables();
    this.GetWorkFlows();
  }

  private GetCompanyId(): string {
    return this.authService.CompanyId;
  }

  public SetObservables(): void {
    this.AllRolesListSubject = new BehaviorSubject<IAddUserRole[]>([]);
    this.AllRolesList$ = this.AllRolesListSubject.asObservable();

    this.AgentTemplateDropdownListSubject = new BehaviorSubject<
      IAgentDropdown[]
    >([]);
    this.AgentTemplateDropdownList$ =
      this.AgentTemplateDropdownListSubject.asObservable();
    this.AgentQueueDropdownListSubject = new BehaviorSubject<
      IAgentQueueDropdownList[]
    >([]);
    this.AgentQueueDropdownList$ =
      this.AgentQueueDropdownListSubject.asObservable();
    this.OpenUserRoleDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenUserRoleDialog$ = this.OpenUserRoleDialogSubject.asObservable();
    this.UserRoleSubject = new BehaviorSubject<IAddUserRole>(
      this.GetDefaultUserRoleValues()
    );
    this.UserRole$ = this.UserRoleSubject.asObservable();
    this.HomeInterfaceDropdownListSubject = new BehaviorSubject<IHomeInterfaceDropdownList[]>([]);
    this.HomeInterfaceDropdownList$ = this.HomeInterfaceDropdownListSubject.asObservable();
    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();
    this.EditedTemplateIdSubject = new BehaviorSubject<string>('');
    this.EditedTemplateId$ = this.EditedTemplateIdSubject.asObservable();
  }

  GetHomeInterfaceList(): void {
    this.homeInterfaceAPIService.GetDropdownList<IHomeInterfaceDropdownList[]>(this.GetCompanyId())
      .subscribe((x) => {
        this.HomeInterfaceDropdownListSubject.next(x);
      });
  }

  OpenUserRoleDialog() {
    this.AgentQueueDropdownListSubject.next([]);
    this.OpenUserRoleDialogSubject.next(true);
  }
  CloseUserRoleDialog() {
    this.OpenUserRoleDialogSubject.next(false);
    this.EditedTemplateIdSubject.next('');
  }

  public GetAgentTemplateListFormat(agent) {
    let i;
    const agentTemplates: IAgentTemplate[] = [];
    for (i = 0; i < agent.length; i++) {
      if (agent[i].agentId) {
        const template = this.GetAgentTemplateObj(agent[i].agentId);
        const queues = this.GetQueuesByWorkflowId(
          template ? template : null,
          agent[i].queues
        );
        const list = {
          templateCode: template.id,
          templateName: template.name,
          queues,
        };
        agentTemplates.push(list);
      }
    }
    return agentTemplates;
  }

  private GetQueuesByWorkflowId(template: IAgentDropdown, queueIds: string[]) {
    let agentQueues = [];
    const queues = this.SubjectWorkflows.value.find(
      (workflow) => workflow.workFlowId === template.workflowId
    ).queues;
    queues.forEach((x) => {
      agentQueues.push({
        queueId: x.id,
        queueName: x.name,
      });
    });
    agentQueues = agentQueues.filter((queue) =>
      queueIds.includes(queue.queueId)
    );
    return agentQueues || [];
  }

  private GetAgentTemplateObj(id: string) {
    return !this.AgentTemplateDropdownListSubject.value
      ? null
      : this.AgentTemplateDropdownListSubject.value.find((x) => x.id === id);
  }

  GetRolesList(): void {
    this.userRoleAPIService
      .GetAll<IAddUserRole>(this.GetCompanyId())
      .subscribe((res: IAddUserRole[]) => {
        if (res !== undefined && res != null) {
          this.AllRolesListSubject.next(res);
        }
      });
  }

  public GetUserRolesDetails(roleId: string): void {
    this.userRoleAPIService
      .Get(this.GetCompanyId(), roleId)
      .subscribe((res: IAddUserRole) => {
        if (res !== undefined && res !== null) {
          res[0].agentTemplates = this.GetAgentTemplateListFormat(
            res[0].agentTemplates
          );
          this.AddHelpActionIfNotExists(res[0]?.roleAction);
          this.RemoveContactinfoActionIfExists(res[0]?.roleAction);
          this.UserRoleSubject.next(res[0]);
         
        }
      });
  }

  private RemoveContactinfoActionIfExists(roleAction: any) {
    const locationActions = roleAction.find((ra) => ra.actionTypeName === "Location Actions" || ra.actionTypeName === "Branch Actions")?.action;
    const contactinfoAction = {
      actionName: RoleActionsPageNameEnum.ContactInfo,
      addEdit: true,
      delete: null,
      run: null,
      view: true,
      viewName: RoleActionsPageNameEnum.BranchContactInfo
    };
    const iscontactinfoActionAvailable = locationActions?.some((action) => action.viewName === contactinfoAction.viewName);
 iscontactinfoActionAvailable && locationActions.splice(1,1);
  }

  private AddHelpActionIfNotExists(roleAction: any) {
    let companyActions = roleAction.find((ra) => ra.actionTypeName === "Company Actions")?.action;
    let findMonitorDiagnostics = companyActions.find((data) => {
      return data.actionName == "Monitor Diagnostics"
    })
    if (!findMonitorDiagnostics) {
      companyActions.push({
        "actionName": "Monitor Diagnostics",
        "viewName": "MonitorDiagnostics",
        "addEdit": null,
        "view": false,
        "delete": null,
        "run": null
      })
    }

    const helpAction = {
      actionName: RoleActionsPageNameEnum.Help,
      addEdit: null,
      delete: null,
      run: null,
      view: true,
      viewName: RoleActionsPageNameEnum.Help
    };
    const isHelpActionAvailable = companyActions?.some((action) => action.actionName === helpAction.actionName);
    !isHelpActionAvailable && companyActions?.push(helpAction);
  }

  public AddUserRole(req: IUserRoleFormWrapper): void {
    if (typeof req.userRole.roleId !== 'undefined' && req.userRole.roleId) {
      // Update User Role
      // do put call
      this.formService.CallFormMethod<any>(req.form).then((response: any) => {
        if (!this.IsAnyRoleActionSelected(req.userRole)) {
          this.AppNotificationService.NotifyError(
            'At least one action is required.'
          );
          return;
        }
        const putData = this.GetData(req, response);
        if (response) {
          this.userRoleAPIService
            .Update(this.GetCompanyId(), putData)
            .subscribe((x) => {
              req.form.reset();
              this.CloseUserRoleDialog();
              if (req.userRole.roleId == this.authService.UserRoleId) {
                this.AppNotificationService.Notify('Please Log in again to see the updated actions.');
                this.tokenService.Logout(false);
              } else {
                this.AppNotificationService.Notify('User role updated.');
                this.GetRolesList();
              }
              this.EditedTemplateIdSubject.next('');
            });
        }
      });
    } else {
      //// Add new User Role
      // do post
      this.formService.CallFormMethod<any>(req.form).then((response: any) => {
        if (!this.IsAnyRoleActionSelected(req.userRole)) {
          this.AppNotificationService.NotifyError(
            'Atleast one action is required.'
          );
          return;
        }
        const postData: IPostUserRoleData = this.GetData(req, response);
        if (response) {
          this.userRoleAPIService
            .Create<IAddUserRole, any>(this.GetCompanyId(), postData)
            .subscribe((x) => {
              this.browserStorageService.SetUserRoleId(x.roleId);
              req.form.reset();
              this.AppNotificationService.Notify('User role created.');
              this.CloseUserRoleDialog();
              this.GetRolesList();
            });
        }
      });
    }
  }

  private GetData(req: IUserRoleFormWrapper, response: any) {
    const agentTemplates = [];
    req.userRole.agentTemplates.forEach((ele) => {
      agentTemplates.push({
        agentId: ele.templateCode,
        queues: ele.queues.filter((x) => x.queueId).map((x) => x.queueId),
      });
    });
    const postData: IPostUserRoleData = {
      status: req.userRole.status,
      companyId: req.userRole.companyId,
      roleId: req.userRole.roleId ? req.userRole.roleId : this.uuid,
      roleName: response.roleName,
      roleAction: req.userRole.roleAction,
      homeInterfaceId: response?.homeInterfaces?.templateId,
      agentTemplates,
    };
    return postData;
  }

  GetHomeInterfaceById(homeInterfaceId: string){
    return this.HomeInterfaceDropdownListSubject.value.find(x => x.templateId === homeInterfaceId);
  }

  SetAgentTemplateList(): void {
    this.agentAPIService.GetDropdownList<IAgentDropdown>(this.GetCompanyId())
      .subscribe((x) => {
        this.AgentTemplateDropdownListSubject.next(x);
      });
  }

  SetAgentServiceList(workflowId: string): void {
    if (workflowId) {
      this.workflowAPIService
        .GetQueues(this.GetCompanyId(), workflowId)
        .subscribe((q: IAgentQueueDropdownList[]) => {
          this.AgentQueueDropdownListSubject.next(q);
        });
    } else {
      this.AgentQueueDropdownListSubject.next(null);
    }
  }

  IsAnyRoleActionSelected(userRole: IAddUserRole): boolean {
    for (const actionType of userRole.roleAction) {
      for (const action of actionType.action) {
        if (action.addEdit || action.view || action.delete || action.run) {
          return true;
        }
      }
    }
    return false;
  }

  DeleteTemplate(agentTemplateCode: string): void {
    const userRole = this.UserRoleSubject.getValue();
    this.userAPIService.AgentOnline(agentTemplateCode, userRole?.roleId).subscribe((a) => {
      if (!a) {
        userRole.agentTemplates = userRole.agentTemplates.filter(
          (x) => x.templateCode !== agentTemplateCode
        );
        this.UserRoleSubject.next(userRole);
      } else {
        this.AppNotificationService.NotifyError(
          CommonMessages.AgentTemplateUsedMessage
        );
      }
    });
  }

  UpdateTemplate(agentTemplateCode: string): void{
    this.EditedTemplateIdSubject.next(agentTemplateCode);
  }


  AddAgentTemplate(AgentTemplateForm: FormGroup) {
    this.formService.CallFormMethod(AgentTemplateForm).then((response: any) => {
      if (response) {
        const userRole = this.UserRoleSubject.getValue();
        const currentTemplate = {
          templateCode: AgentTemplateForm.get('template').value.id,
          templateName: AgentTemplateForm.get('template').value.name,
          queues: AgentTemplateForm.get('queues').value,
        };
        if (
          userRole.agentTemplates.filter((filteredTemplate)=>filteredTemplate.templateCode !== this.EditedTemplateIdSubject.value)
                                  .find((x) => x.templateCode === currentTemplate.templateCode)
        ) {
          this.AppNotificationService.NotifyError('Template already added.');
          return false;
        }

        if(this.EditedTemplateIdSubject.value){
          let index = userRole?.agentTemplates?.findIndex(x=>x.templateCode == this.EditedTemplateIdSubject.value);
          userRole.agentTemplates[index] = currentTemplate;
        }
        else{
          userRole.agentTemplates.push(currentTemplate);
        }
        this.UserRoleSubject.next(userRole);
        AgentTemplateForm.get('template').reset();
        AgentTemplateForm.get('queues').reset();
        this.EditedTemplateIdSubject.next('');
      }
    });
  }

  public InitializeDefaultValues(): void {
    const userRole = this.GetDefaultUserRoleValues();
    userRole.roleAction = [];
    userRole.agentTemplates = [];
    this.userRoleAPIService
      .GetActions<Array<IUserRoleActionType>>(this.GetCompanyId())
      .subscribe((res: Array<IUserRoleActionType>) => {
        if (res !== undefined && res !== null) {
          userRole.roleAction = [];
          userRole.agentTemplates = [];
          res.forEach((x) => {
            userRole.roleAction.push(x);
          });
        }
        this.AddHelpActionIfNotExists(userRole.roleAction);
        this.RemoveContactinfoActionIfExists(userRole.roleAction);
        this.UserRoleSubject.next(userRole);
 });

  }

  public GetDefaultUserRoleValues(): IAddUserRole {
    const UserRole = {
      companyId: this.GetCompanyId(),
      roleId: '',
      roleName: '',
      status: false,
      homeInterfaceId: '',
      roleAction: [
        {
          actionTypeName: '',
          IsActive: true,
          action: [
            {
              actionName: '',
              viewName: null,
              view: null,
              addEdit: null,
              delete: null,
              run: null,
              isSelectAll: null,
            },
          ],
        },
      ],
      agentTemplates: [
        {
          templateName: '',
          templateCode: '',
          companyId: this.GetCompanyId(),
          queues: [{ queueId: '', queueName: '' }],
        },
      ],
    };
    return UserRole;
  }

  public IsRoleNameExists(value: string): Observable<boolean> {
    if (value) {
      return this.userRoleAPIService.AlreadyExists(
        this.GetCompanyId(),
        this.browserStorageService.UserRoleId,
        new HttpUrlEncodingCodec().encodeValue(value.trim())
      );
    }
  }

  private GetWorkFlows() {
    this.subs.sink = this.workflowAPIService
      .GetDropdownList(this.authService.CompanyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
      });
  }

  DeleteUserRole(userRole: IAddUserRole){
    return this.userRoleAPIService.Delete(userRole.companyId, userRole.roleId);
  }
}
