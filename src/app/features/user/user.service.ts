import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown-interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { DefaultUserDropdownValues } from 'src/app/models/constants/user.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { LoginMode } from 'src/app/models/enums/login-mode.enum';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { UserAPIService } from 'src/app/shared/api-services/user-api.service';
import { UserRoleAPIService } from 'src/app/shared/api-services/user-role-api.service';
import { requiredFileType } from 'src/app/shared/validators/common.validator';
import { v4 } from 'uuid';
import { cloneObject } from '../../core/utilities/core-utilities';
import { CommonMessages } from '../../models/constants/message-constant';
import { AgentAPIService } from '../../shared/api-services/agent-api.service';
import { BranchAPIService } from '../../shared/api-services/branch-api.service';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { WorkflowAPIService } from '../../shared/api-services/workflow-api.service';
import { UserValidatorService } from '../../shared/validators/user.validator';
import { IAgentQueue } from './models/agent-queue.interface';
import { IAgentView } from './models/agent-view.interface';
import { IReqUserInfo } from './models/request-user.interface';
import { IUserDropdown } from './models/user-dropdown.interface';
import { IUserInfo } from './models/user.interface';

@Injectable()
export class UserService extends AbstractComponentService {
  public UserForm: FormGroup;
  public TemplateList: IAgentView[] = [];
  public BranchSearchList = [];
  public UserDropdownData: IUserDropdown;
  public UserTagList = [];
  private SubjectQueues: Subject<IAgentQueue[]>;
  public Queues$: Observable<IAgentQueue[]>;
  private SubjectUserDropdownData: BehaviorSubject<IUserDropdown>;
  public UserDropdownData$: Observable<IUserDropdown>;
  private SubjectBranchList: BehaviorSubject<GroupResult[]>;
  public BranchList$: Observable<GroupResult[]>;
  private SubjectTemplateList: Subject<IAgentView[]>;
  public TemplateList$: Observable<IAgentView[]>;
  private OpenNewUserDialogSubject: BehaviorSubject<boolean>;
  public OpenNewUserDialog$: Observable<boolean>;
  private EmailExistsSubject: BehaviorSubject<boolean>;
  public EmailExists$: Observable<boolean>;
  private PasswordNotAllowSubject: BehaviorSubject<boolean>;
  public PasswordNotAllow$: Observable<boolean>;
  private PanelExpandSubject: BehaviorSubject<boolean>;
  public PanelExpand$: Observable<boolean>;
  private ShowOverrideCheckboxSubject: BehaviorSubject<boolean>;
  public ShowOverrideCheckbox$: Observable<boolean>;
  private IsInternalAuthenticationSubject: BehaviorSubject<boolean>;
  public IsInternalAuthentication$: Observable<boolean>;
  private SubjectUserTagList: Subject<string[]>;
  public UserTagList$: Observable<string[]>;
  public Users$: Observable<IUserInfo[]>;
  public UsersSubject: BehaviorSubject<IUserInfo[]>;
  private SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;
  public TempVariable = false;
  private ImageUrl: string;

  get PasswordControl() {
    return this.UserForm.get('password');
  }

  get UserTagControl() {
    return this.UserForm.get('tags');
  }

  get AgentTemplateControl() {
    return this.UserForm.get('agentTemplate.template');
  }

  get AgentQueueControl() {
    return this.UserForm.get('agentTemplate.queues');
  }

  get IsOverrideFormControl() {
    return this.UserForm.get('agentTemplate.isOverride');
  }

  get IsAllBranchesFormControl() {
    return this.UserForm.get('isAllBranches');
  }

  get BranchesFormControl() {
    return this.UserForm.get('branches');
  }

  get EmailFormControl() {
    return this.UserForm.get('email');
  }

  get AlertEmailFormControl() {
    return this.UserForm.get('alertEmail');
  }

  get AlertPhoneNumberFormControl() {
    return this.UserForm.get('alertPhoneNumber');
  }

  constructor(
    private authStateService: AuthStateService,
    private readonly userAPIService: UserAPIService,
    private readonly userRoleAPIService: UserRoleAPIService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly userValidatorService: UserValidatorService,
    private readonly agentAPIService: AgentAPIService,
  ) {
    super();
    this.UserDropdownData = {
      agentTemplateList: [],
      branchNameList: [],
      companyList: [],
      roleList: [],
    };
    this.SetObservables();
    this.GetWorkFlows();
    this.SetUserForm(this.SetDefaultUserValues());
    this.SubscribeValueChangeEvent();
  }

  public SetObservables() {
    this.OpenNewUserDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenNewUserDialog$ = this.OpenNewUserDialogSubject.asObservable();
    this.EmailExistsSubject = new BehaviorSubject<boolean>(false);
    this.EmailExists$ = this.EmailExistsSubject.asObservable();
    this.PasswordNotAllowSubject = new BehaviorSubject<boolean>(false);
    this.PasswordNotAllow$ = this.PasswordNotAllowSubject.asObservable();
    this.PanelExpandSubject = new BehaviorSubject<boolean>(false);
    this.PanelExpand$ = this.PanelExpandSubject.asObservable();
    this.ShowOverrideCheckboxSubject = new BehaviorSubject<boolean>(false);
    this.ShowOverrideCheckbox$ =
      this.ShowOverrideCheckboxSubject.asObservable();
    this.IsInternalAuthenticationSubject = new BehaviorSubject<boolean>(true);
    this.IsInternalAuthentication$ =
      this.IsInternalAuthenticationSubject.asObservable();
    this.UsersSubject = new BehaviorSubject<IUserInfo[]>([]);
    this.Users$ = this.UsersSubject.asObservable();

    this.SubjectQueues = new Subject<IAgentQueue[]>();
    this.Queues$ = this.SubjectQueues.asObservable();
    this.SubjectUserDropdownData = new BehaviorSubject<IUserDropdown>({
      roleList: [],
      branchNameList: [],
      agentTemplateList: [],
      companyList: [],
    });
    this.UserDropdownData$ = this.SubjectUserDropdownData.asObservable();
    this.SubjectTemplateList = new Subject<IAgentView[]>();
    this.TemplateList$ = this.SubjectTemplateList.asObservable();
    this.SubjectBranchList = new BehaviorSubject<GroupResult[]>([]);
    this.BranchList$ = this.SubjectBranchList.asObservable();
    this.SubjectUserTagList = new Subject<string[]>();
    this.UserTagList$ = this.SubjectUserTagList.asObservable();
    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();
  }

  private SubscribeValueChangeEvent() {
    this.subs.sink = this.IsOverrideFormControl.valueChanges.subscribe(
      (isOverride) => {
        if (isOverride) {
          this.AgentTemplateControl.enable();
          this.AgentQueueControl.enable();
        } else {
          this.AgentTemplateControl.setValue(null);
          this.AgentTemplateControl.disable();
          this.AgentQueueControl.setValue(null);
          this.AgentQueueControl.disable();
        }
      }
    );

    this.subs.sink = this.IsAllBranchesFormControl.valueChanges.subscribe(
      (IsAllBranches) => {
        if (IsAllBranches) {
          this.BranchesFormControl.setValue(null);
          this.BranchesFormControl.clearValidators();
        } else {
          this.BranchesFormControl.setValidators(Validators.required);
        }
        this.BranchesFormControl.updateValueAndValidity();
      }
    );
  }

  public OpenModel() {
    this.IsInternalAuthenticationSubject.next(this.authStateService.CompanyLoginMode === LoginMode.INTERNAL);
    this.OpenNewUserDialogSubject.next(true);
    this.EmailExistsSubject.next(false);
    this.PanelExpandSubject.next(false);
    this.UserTagList = [];
    this.SubjectUserTagList.next(null);
    this.checkIfPasswordAllowToAddOrNot();
  }

  public CloseModel() {
    this.PasswordNotAllowSubject.next(false);
    this.PanelExpandSubject.next(true);
    this.UserForm.reset({
      isAllBranches: true,
    });
    this.ResetTemplateList();
    this.OpenNewUserDialogSubject.next(false);
  }

  public RemoveUserId() {
    this.browserStorageService.RemoveUserId();
  }

  public SetPasswordValidator() {
    this.PasswordControl.setValidators([
      Validators.required,
      Validators.pattern(Validations.PasswordRegx),
    ]);
    this.PasswordControl.updateValueAndValidity();
  }

  public ClearPasswordValidator() {
    this.PasswordControl.clearValidators();
    this.PasswordControl.updateValueAndValidity();
  }

  public SetUserForm(data: IUserInfo) {
    this.UserForm = this.formBuilder.group({
      userId: [data.id],
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      profileImageUrl: [
        data.profileImageUrl,
        [requiredFileType(['png', 'jpg', 'jpeg'], 4000000)],
      ],
      displayName: [data.displayName],
      role: [data.role, [Validators.required]],
      email: [
        data.email,
        {
          updateOn: 'change',
          validators: [
            Validators.pattern(Validations.EmailRegX),
            Validators.required,
          ],
          asyncValidators: [
            this.userValidatorService.EmailAlreadyExistValidator(
              this.browserStorageService.UserId,
              data.email
            ),
          ],
        },
      ],
      alertEmail: [
        data.alertEmail,
        {
          updateOn: 'change',
          validators: [
            Validators.pattern(Validations.EmailRegX),
          ],
        },
      ],
      alertPhoneNumber: [
        data.alertPhoneNumber ],
      isUserInactive: [data.isUserInactive],
      changePasswordInFirstLogin: [data.changePasswordInFirstLogin],
      password: [data.password],
      branches: [data.branches],
      tags: [data.tags],
      isAllBranches: [data.isAllBranches],
      agentTemplate: this.formBuilder.group({
        isOverride: [data.agentTemplate.isOverride],
        template: [data.agentTemplate.agentName],
        queues: [data.agentTemplate.queues],
      }),
    });
  }

  public GetUserDetailsFromId(userId: string) {
    this.browserStorageService.SetUserId(userId);
    userId = this.browserStorageService.UserId;
    this.userAPIService
      .Get<IReqUserInfo>(this.authStateService.CompanyId, userId)
      .subscribe((x) => {
        this.TempVariable = false;
        this.SetValuesInForm(x);
        this.UserTagList = x.tags;
        this.PasswordNotAllowSubject.next(true);
        this.SubjectUserTagList.next(x.tags);
        this.ShowOverrideCheckboxSubject.next(x.isOverride);
        const isInternalAuthentication = this.authStateService.CompanyLoginMode === LoginMode.INTERNAL && x.isSignedIn !== true;
        this.IsInternalAuthenticationSubject.next(false);
        if (x.isOverride) {
          x.agentTemplate = this.GetAgentTemplateListFormat(x.agentTemplate);
          this.SubjectTemplateList.next(x.agentTemplate);
          this.TemplateList = x.agentTemplate;
          this.UpdateUnSelectedAgentTemplates();
        } else {
          if (x.roleId) {
            this.BindAgentTemplateByRoleId(x.roleId);
          }
        }
      });
  }

  public SetValuesInForm(data) {
    this.UserForm.get('userId').setValue(data.id);
    this.UserForm.get('firstName').setValue(data.firstName);
    this.UserForm.get('lastName').setValue(data.lastName);
    this.UserForm.get('displayName').setValue(data.displayName);
    this.UserForm.get('role').setValue(this.GetRoleObj(data.roleId));
    this.UserForm.get('password').setValue(data.password);
    this.EmailFormControl.clearAsyncValidators();
    this.EmailFormControl.setValue(data.email);
    this.EmailFormControl.setAsyncValidators(
      this.userValidatorService.EmailAlreadyExistValidator(
        this.browserStorageService.UserId,
        data.email
      )
    );
    this.AlertEmailFormControl.setValue(data.alertEmail);
    this.AlertPhoneNumberFormControl.setValue(data.alertPhoneNumber);
    this.UserForm.get('isUserInactive').setValue(data.isUserInactive);
    this.UserForm.get('changePasswordInFirstLogin').setValue(
      data.changePasswordInFirstLogin
    );
    this.UserForm.get('branches').setValue(data.branches);
    this.UserForm.get('profileImageUrl').setValue(data.profileImageUrl);
    this.UserForm.get('isAllBranches').setValue(data.isAllBranches);
    this.UserForm.get('agentTemplate.isOverride').setValue(data.isOverride);
    if (data.isAllBranches) {
      this.UserForm.get('branches').setValue(null);
    }
  }

  public CallMultipleApis() {
    this.formService
      .CombineAPICall(
        this.GetBranchWithTags(),
        this.GetAgentTemplate(),
        this.GetCompanies()
      )
      .subscribe(([branchNames, agentTemplates, companies]) => {
        const DropdownData = this.UserDropdownData;
        DropdownData.branchNameList = branchNames;
        DropdownData.agentTemplateList = agentTemplates;
        DropdownData.companyList = companies;

        this.UserDropdownData = DropdownData;
        this.SubjectBranchList.next(
          this.mapBranchAndTags(this.UserDropdownData)
        );
        this.SubjectUserDropdownData.next(this.UserDropdownData);
        this.UpdateUnSelectedAgentTemplates();
      });
  }

  public BindServicesByTemplateId(templateId: string) {
    this.AgentQueueControl.setValue(null);
    if (!templateId) {
      this.AgentQueueControl.setValue(null);
      this.SubjectQueues.next(null);
    } else {
      return this.GetAgentTemplateQueues(templateId).subscribe(
        (x: IAgentQueue[]) => {
          this.SubjectQueues.next(x);
        }
      );
    }
  }

  public BindAgentTemplateByRoleId(roleId: string) {
    this.TemplateList = [];
    this.UserForm.controls.agentTemplate.get('template').reset();
    this.UserForm.controls.agentTemplate.get('queues').reset();
    this.SubjectQueues.next(null);
    if (!roleId) {
      this.UserForm.get('role').setValue(null);
      this.ShowOverrideCheckboxSubject.next(false);
      this.ResetTemplateList();
    } else {
      this.GetTemplateByRole(roleId).subscribe((x: any[]) => {
        this.ShowOverrideCheckboxSubject.next(true);
        this.SubjectTemplateList.next(
          x && x.length > 0
            ? this.GetAgentTemplateListFormat(x[0].agentTemplates)
            : []
        );
        this.UpdateUnSelectedAgentTemplates();
      });
    }
  }

  private GetAgentTemplateListFormat(agent) {
    for (let i = 0; i < agent.length; i++) {
      const template = this.GetAgentTemplateObj(agent[i].agentId);
      const queues = this.GetQueuesByWorkflowId(
        template ? template : null,
        agent[i].queues
      );
      if (template && queues) {
        const list: IAgentView = {
          templateCode: template.id,
          templateName: template.name,
          queues,
        };
        this.TemplateList.push(list);
      }
    }
    return this.TemplateList;
  }

  private GetQueuesByWorkflowId(template: IAgentDropdown, queueIds: string[]) {
    let agentQueues = [];
    const workflow =
      template && template.workflowId && this.SubjectWorkflows.value
        ? this.SubjectWorkflows.getValue().find(
            (workflow) => workflow.workFlowId === template.workflowId
          )
        : null;
    const queues = workflow ? workflow.queues : [];
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

  public GetTemplateListFormat(agent) {
    let i;
    for (i = 0; i <= agent.length - 1; i++) {
      const template = this.GetAgentTemplateObj(agent[i].templateCode);
      const list: IAgentView = {
        templateCode: agent[i].templateCode,
        templateName: agent[i].templateName,
        queues: agent[i].queues,
      };
      this.TemplateList.push(list);
    }
    return this.TemplateList;
  }

  public AddTemplates(formGroup: FormGroup) {
    this.AgentTemplateControl.setValidators([Validators.required]);
    this.AgentQueueControl.setValidators([Validators.required]);
    this.AgentTemplateControl.updateValueAndValidity();
    this.AgentQueueControl.updateValueAndValidity();
    this.formService.CallFormMethod(formGroup).then((data) => {
      const template: IAgentDropdown = this.UserForm.get(
        'agentTemplate.template'
      ).value;
      const queues: IAgentQueue[] = this.UserForm.get(
        'agentTemplate.queues'
      ).value;
      if (template && template.id && queues) {
        let templateData = this.TemplateList.find(
          (x) => x.templateCode === template.id
        );
        if (!templateData) {
          templateData = {
            templateCode: 's', // Generate UUID
            templateName: template.name,
            queues: [],
          };
          queues.forEach((x) => {
            templateData.queues.push(x);
          });
          this.TemplateList.push({
            templateCode: template.id, // Generate UUID
            templateName: template.name,
            queues: templateData.queues,
          });
          this.SubjectTemplateList.next(this.TemplateList);
          this.UpdateUnSelectedAgentTemplates();
          formGroup.controls.template.setValue(
            DefaultUserDropdownValues.AgentTemplateListDefaultValue
          );
          this.SubjectQueues.next(null);
          formGroup.controls.queues.clearValidators();
          formGroup.controls.queues.updateValueAndValidity();
          formGroup.controls.queues.reset();
        } else {
          this.AppNotificationService.NotifyError(
            'Selected template already exist.'
          );
        }
      }
    });
  }

  private UpdateUnSelectedAgentTemplates() {
    const unSelectedAgentTemplates = this.GetUnSelectedAgentTemplates();
    const userDropDownData = cloneObject(this.UserDropdownData);
    userDropDownData.agentTemplateList = unSelectedAgentTemplates;
    this.SubjectUserDropdownData.next(userDropDownData);
  }

  private GetUnSelectedAgentTemplates() {
    const templateList = this.TemplateList || [];
    const AgentTemplateData = this.UserDropdownData.agentTemplateList || [];
    return AgentTemplateData.filter(
      (agentTemplate) =>
        !templateList.find(
          (template) => template.templateCode === agentTemplate.id
        )
    );
  }

  public DeleteTemplates(id: string) {
    this.userAPIService.AgentOnline(id).subscribe((x) => {
      if (!x) {
        this.TemplateList = this.TemplateList.filter((x) => x.templateCode !== id);
        this.SubjectTemplateList.next(this.TemplateList);
        this.UpdateUnSelectedAgentTemplates();
      } else {
        this.AppNotificationService.NotifyError(CommonMessages.AgentTemplateUsedMessage);
      }
    });
  }

  public ResetTemplateList() {
    this.TemplateList = [];
    this.SubjectTemplateList.next(null);
  }

  public SaveUser(formGroup: FormGroup) {
    this.AgentTemplateControl.clearValidators();
    this.AgentQueueControl.clearValidators();
    this.AgentTemplateControl.updateValueAndValidity();
    this.AgentQueueControl.updateValueAndValidity();
    this.formService.CallFormMethod(formGroup).then((data: IUserInfo) => {
      if (data.profileImageUrl) {
        this.formService.GetImageUrl(data.profileImageUrl).subscribe((img) => {
          this.ImageUrl = img;
          this.PostUserDetails(data);
        });
      } else {
        this.PostUserDetails(data);
      }
    });
  }

  private PostUserDetails(data: IUserInfo) {
    const responseData = this.GetResponseData(data);
    this.userAPIService
      .Create(this.authStateService.CompanyId, responseData)
      .subscribe((result: any) => {
        if (result) {
          this.browserStorageService.SetUserId(result.id);
          this.AfterUserSaveOrUpdateSuccessFully('User created.');
          this.GetRolesAndUsersAndSetRoleAndUsersSubject();
        } else {
          this.AppNotificationService.NotifyError('Something went wrong.');
        }
      });
  }

  public GetResponseData(userData: IUserInfo) {
    userData.type = { value: UserType.Customer, text: UserType.Customer };
    const agentTemplates = [];
    this.TemplateList.forEach((ele) => {
      agentTemplates.push({
        agentId: ele.templateCode,
        queues: ele.queues.filter((x) => x.queueId).map((x) => x.queueId),
      });
    });
    const data = {
      userId: v4(),
      companyId: this.authStateService.CompanyId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: this.ImageUrl,
      displayName: userData.displayName,
      email: userData.email,
      alertEmail: userData.alertEmail,
      alertPhoneNumber: userData.alertPhoneNumber,
      password: this.IsUserAuthenticationTypeInternal()
        ? userData.password
        : null,
      roleId: userData.role ? userData.role.roleId : null,
      type: userData.type,
      isUserInactive: userData.isUserInactive,
      changePasswordInFirstLogin: userData.changePasswordInFirstLogin,
      branches: userData.branches,
      isAllBranches: userData.isAllBranches,
      tags: this.UserTagList,
      isOverride: userData.agentTemplate.isOverride,
      agentTemplate: userData.agentTemplate.isOverride ? agentTemplates : null,
    };
    return data;
  }

  public UpdateUser(req: FormGroup) {
    this.AgentTemplateControl.clearValidators();
    this.AgentQueueControl.clearValidators();
    this.AgentTemplateControl.updateValueAndValidity();
    this.AgentQueueControl.updateValueAndValidity();
    this.formService.CallFormMethod(req).then((res: IUserInfo) => {
      this.ImageUrl = res.profileImageUrl;
      const userImg: any = res.profileImageUrl;
      if (userImg && userImg.name) {
        this.formService.GetImageUrl(res.profileImageUrl).subscribe((img) => {
          this.ImageUrl = img;
          this.PutUserDetails(res);
        });
      } else {
        this.PutUserDetails(res);
      }
    });
  }

  private PutUserDetails(res: IUserInfo) {
    const updatedData = this.GetUpdatedData(res);
    this.userAPIService
      .Update(this.authStateService.CompanyId, updatedData)
      .subscribe((result: any) => {
        if (result) {
          this.browserStorageService.SetUserId(result.id);
          this.AfterUserSaveOrUpdateSuccessFully('User updated.');
          this.UpdateCurrentUserState(result);
          this.GetRolesAndUsersAndSetRoleAndUsersSubject();
        } else {
          this.AppNotificationService.NotifyError('Something went wrong.');
        }
      });
  }

  public GetUpdatedData(userData: IUserInfo) {
    userData.type = { value: UserType.Customer, text: UserType.Customer };
    const agentTemplates = [];
    this.TemplateList.forEach((ele) => {
      agentTemplates.push({
        agentId: ele.templateCode,
        queues: ele.queues.map((x) => x.queueId),
      });
    });
    const data = {
      userId: this.browserStorageService.UserId,
      companyId: this.authStateService.CompanyId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: this.ImageUrl,
      displayName: userData.displayName,
      email: userData.email,
      alertEmail: userData.alertEmail,
      alertPhoneNumber: userData.alertPhoneNumber,
      password: userData.password,
      roleId: userData.role ? userData.role.roleId : null,
      type: userData.type,
      isUserInactive: userData.isUserInactive,
      changePasswordInFirstLogin: userData.changePasswordInFirstLogin,
      branches: userData.branches,
      isAllBranches: userData.isAllBranches,
      tags: this.UserTagList,
      isOverride: userData.agentTemplate.isOverride,
      agentTemplate: userData.agentTemplate.isOverride ? agentTemplates : null,
    };
    return data;
  }

  private UpdateCurrentUserState(user: any) {
    if (this.authStateService.UserId === user.id) {
      this.mediatorService.SetInitialUserDetails({
        firstName: user.firstName,
        image: user.profileImageUrl,
        lastName: user.lastName,
        type: user.userType.value,
        role: user.roleId,
        email: user.email,
        alertEmail: user.alertEmail,
        alertPhoneNumber: user.alertPhoneNumber,
        roleName: this.SubjectUserDropdownData.value.roleList.find(x => x.roleId === user.roleId).roleName,
        agentDeskSettings:user.agentDeskSettings,
        isOnlineAsAgent: user.isOnlineAsAgent,
        agentTemplate: user.isOverride
        ? user.agentTemplate
        :[],
        isAllBranches:user.isAllBranches,
        branches :user.branches
      });
    }
  }

  public SetDefaultUserValues() {
    const data: IUserInfo = {
      id: null,
      firstName: '',
      lastName: '',
      profileImageUrl: null,
      displayName: '',
      role: null,
      type: { value: UserType.Customer, text: UserType.Customer },
      email: '',
      alertEmail: '',
      alertPhoneNumber: '',
      isUserInactive: false,
      changePasswordInFirstLogin: false,
      password: '',
      branches: [],
      tags: [],
      isAllBranches: true,
      agentTemplate: {
        isOverride: false,
        agentName: null,
        queues: [],
      },
      companyId: null
    };
    return data;
  }

  public OnEnterTag() {
    // tslint:disable-next-line: no-unused-expression
    this.UserTagControl.value !== null &&
    !Array.isArray(this.UserTagControl.value) &&
    this.UserTagControl.value.trim() !== '' &&
    !this.UserTagList.includes(this.UserTagControl.value.toLowerCase())
      ? this.UserTagList.push(this.UserTagControl.value.toLowerCase())
      : null;
    this.SubjectUserTagList.next(this.UserTagList);
    this.UserTagControl.reset();
  }

  public RemoveTags(e: ChipRemoveEvent) {
    this.UserTagList.splice(
      this.UserTagList.findIndex((c) => c === e.sender.label),
      1
    );
    this.SubjectUserTagList.next(this.UserTagList);
  }

  public OnSeparatorAddTag(tag: string) {
    const IsTagContainComma = tag.indexOf(',') > -1;
    if (IsTagContainComma) {
      this.UserTagControl.setValue(tag.replace(/,/g, ''));
      this.OnEnterTag();
    }
  }

  public GetRoles() {
    return this.userRoleAPIService.GetDropdownList(
      this.authStateService.CompanyId
    );
  }

  public GetBranchWithTags() {
    return this.branchAPIService.GetBranchNamesWithTags(
      this.authStateService.CompanyId
    );
  }

  public GetRolesAndUsersAndSetRoleAndUsersSubject(): void {
    this.formService
      .CombineAPICall(
        this.GetRoles(),
        this.userAPIService.GetAll<IUserInfo>(this.authStateService.CompanyId)
      )
      .subscribe(([roles, users]) => {
        const UserDropdownData = this.UserDropdownData;
        UserDropdownData.roleList = roles;
        this.UserDropdownData = UserDropdownData;
        this.SubjectUserDropdownData.next(this.UserDropdownData);
        this.UsersSubject.next(!users ? [] : users);
      });
  }

  public GetCompanies(): Observable<ICompanyDropDown[]> {
    return this.companyAPIService.GetDropdownList<ICompanyDropDown>();
  }

  public GetAgentTemplate() {
    return this.agentAPIService.GetDropdownList(this.authService.CompanyId);
  }

  private GetRoleObj(id: string) {
    return this.UserDropdownData === undefined
      ? null
      : this.UserDropdownData.roleList.find((x) => x.roleId === id);
  }

  private GetAgentTemplateObj(id: string) {
    return this.UserDropdownData === undefined
      ? null
      : this.UserDropdownData.agentTemplateList.find((x) => x.id === id);
  }

  public OnDestroy() {
    this.UserForm.reset();
    this.OpenNewUserDialogSubject.next(false);
  }

  private mapBranchAndTags(DropdownData: IUserDropdown) {
    const branchList = [];
    if (DropdownData.branchNameList) {
      DropdownData.branchNameList.map((b: any) => {
        if (
          b.branch !== undefined ||
          b.branch !== null ||
          Object.keys(b.branch).length !== 0
        ) {
          if (
            !branchList.find(
              (el) => el.id === b.branch.id && el.name === b.branch.name
            )
          ) {
            branchList.push({
              id: b.branch.id,
              name: b.branch.name,
              type: 'branch',
            });
          }
        }
        if (b.tags !== undefined || b.tags !== null || b.tags.length !== 0) {
          b.tags.map((t) => {
            if (
              !branchList.find((el) => el.id === t.id && el.name === t.name)
            ) {
              branchList.push({ id: t.id, name: t.name, type: 'tags' });
            }
          });
        }
      });
    }
    const sortedData = branchList.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.toString().toLowerCase() < b.name.toString().toLowerCase()
          ? -1
          : a.name.toString().toLowerCase() > b.name.toString().toLowerCase()
          ? 1
          : 0;
      }
    });

    const groupedData: GroupResult[] = groupBy(sortedData, [{ field: 'type' }]);
    this.BranchSearchList = groupedData;
    return groupedData;
  }

  private GetTemplateByRole(roleId: string) {
    return this.userRoleAPIService.GetTemplates(
      this.authService.CompanyId,
      roleId
    );
  }

  private GetAgentTemplateQueues(templateId: string) {
    return this.workflowAPIService.GetQueues(
      this.authService.CompanyId,
      templateId
    );
  }

  private AfterUserSaveOrUpdateSuccessFully(msg: string) {
    this.CloseModel();
    this.AppNotificationService.Notify(msg);
  }

  private checkIfPasswordAllowToAddOrNot() {
    if (this.IsUserAuthenticationTypeInternal()) {
      this.SetPasswordValidator();
      this.PasswordNotAllowSubject.next(false);
    } else {
      this.ClearPasswordValidator();
      this.PasswordNotAllowSubject.next(true);
    }
  }

  public FilterBranchNameOrTag(value: string) {
    const branch =
      this.BranchSearchList.length > 0
        ? this.GetBranchNamesAndTags(value, this.BranchSearchList[0])
        : [];
    const tags =
      this.BranchSearchList.length > 1
        ? this.GetBranchNamesAndTags(value, this.BranchSearchList[1])
        : [];
    this.SubjectBranchList.next(
      groupBy(branch.concat(tags), [{ field: 'type' }])
    );
  }

  private GetBranchNamesAndTags(value: string, searchList) {
    return searchList.items.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public IsUserAuthenticationTypeInternal(): boolean {
    return this.authService.CompanyLoginMode === LoginMode.INTERNAL;
  }

  public GetWorkFlows() {
    this.subs.sink = this.workflowAPIService
      .GetDropdownList(this.authService.CompanyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
      });
  }

  DeleteUser(user: IUserInfo){
    return this.userAPIService.Delete(user.companyId, user.id);
  }
}
