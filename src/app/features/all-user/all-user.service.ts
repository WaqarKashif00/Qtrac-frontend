import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ChipRemoveEvent } from '@progress/kendo-angular-buttons';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown.interface';
import { CompanyLoginMode } from 'src/app/models/common/company-login-mode.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { DefaultUserDropdownValues } from 'src/app/models/constants/user.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import { LoginMode } from 'src/app/models/enums/login-mode.enum';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { UserAPIService } from 'src/app/shared/api-services/user-api.service';
import { UserRoleAPIService } from 'src/app/shared/api-services/user-role-api.service';
import {
  CustomRequiredDropDownValidator,
  requiredFileType
} from 'src/app/shared/validators/common.validator';
import { CommonMessages } from '../../models/constants/message-constant';
import { AgentAPIService } from '../../shared/api-services/agent-api.service';
import { BranchAPIService } from '../../shared/api-services/branch-api.service';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { WorkflowAPIService } from '../../shared/api-services/workflow-api.service';
import { UserValidatorService } from '../../shared/validators/user.validator';
import { AllUserMessages } from './message';
import { IAgentQueue } from './models/agent-queue.interface';
import { IAgentView } from './models/agent-view.interface';
import { IReqUserInfo } from './models/request-user.interface';
import { IRole } from './models/role.interface';
import { IUserDropdown } from './models/user-dropdown.interface';
import { IUserInfo } from './models/user.interface';

@Injectable()
export class AllUserService extends AbstractComponentService {
  public UserForm: FormGroup;
  public TemplateList: IAgentView[] = [];
  public BranchSearchList = [];
  public UserDropdownData: IUserDropdown;
  public AgentTemplateData: IAgentDropdown[];

  public UserTagList = [];
  public UserDetails;

  private SubjectQueues: Subject<IAgentQueue[]>;
  public Queues$: Observable<IAgentQueue[]>;
  private SubjectAgentDropDown: BehaviorSubject<IAgentDropdown[]>;
  public agentDropDown$: Observable<IAgentDropdown[]>;
  private SubjectUserDropdownData: Subject<IUserDropdown>;
  public UserDropdownData$: Observable<IUserDropdown>;
  private SubjectBranchList: Subject<GroupResult[]>;
  public BranchList$: Observable<GroupResult[]>;
  private SubjectTemplateList: BehaviorSubject<IAgentView[]>;
  public TemplateList$: Observable<IAgentView[]>;
  private OpenNewUserDialogSubject: BehaviorSubject<boolean>;
  public OpenNewUserDialog$: Observable<boolean>;
  private SubjectUserTagList: Subject<string[]>;
  public UserTagList$: Observable<string[]>;
  private IsCustomerUserTypeSubject: BehaviorSubject<boolean>;
  public IsCustomerUserType$: Observable<boolean>;
  private RolesSubject: BehaviorSubject<IRole[]>;
  public Roles$: Observable<IRole[]>;
  private HideIsOverrideSubject: BehaviorSubject<boolean>;
  public HideIsOverride$: Observable<boolean>;
  private IsInternalAuthenticationSubject: BehaviorSubject<boolean>;
  public IsInternalAuthentication$: Observable<boolean>;
  public Users$: Observable<IUserInfo[]>;
  public UsersSubject: BehaviorSubject<IUserInfo[]>;
  private SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;
  private PasswordNotAllowSubject: BehaviorSubject<boolean>;
  public PasswordNotAllow$: Observable<boolean>;

  public TempVariable = false;
  public LaviCompanyId = null;
  private ImageUrl: string;

  private readonly CustomerUserType = UserType.Customer;

  get IsOverrideFormControl() {
    return this.UserForm.get('agentTemplate.isOverride');
  }

  get QueuesFormControl() {
    return this.UserForm.get('agentTemplate.queues');
  }

  get AgentTemplateFormControl() {
    return this.UserForm.get('agentTemplate.template');
  }

  get UserTypeFormControl() {
    return this.UserForm.get('type');
  }

  get CompanyFormControl() {
    return this.UserForm.get('company');
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

  get PasswordControl() {
    return this.UserForm.get('password');
  }

  get UserTagControl() {
    return this.UserForm.get('tags');
  }

  get userIdFormControl() {
    return this.UserForm.get('userId');
  }

  constructor(
    private readonly userAPIService: UserAPIService,
    private readonly userRoleAPIService: UserRoleAPIService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly userValidatorService: UserValidatorService,
    private readonly agentAPIService: AgentAPIService,
    ) {
    super();
    this.SetObservables();
    this.SetUserForm(this.SetDefaultUserValues());
    this.SubscribeValueChangeEvent();
  }

  private SubscribeValueChangeEvent() {
    this.subs.sink = this.UserForm.get('isAllBranches').valueChanges.subscribe(
      (value) => {
        const branchesFormControl = this.UserForm.get('branches');
        const typeFormControlValue = this.UserForm.get('type').value;
        if (value) {
          branchesFormControl.setValue(null);
        }
        if (
          typeFormControlValue &&
          typeFormControlValue.value === this.CustomerUserType
        ) {
          if (value) {
            branchesFormControl.setValidators(null);
          } else {
            branchesFormControl.setValidators(Validators.required);
          }
          branchesFormControl.updateValueAndValidity();
        }
      }
    );
    this.subs.sink = this.IsOverrideFormControl.valueChanges.subscribe(isOverride => {
      if (isOverride) {
        this.AgentTemplateFormControl.enable();
        this.QueuesFormControl.enable();
      } else {
        this.AgentTemplateFormControl.setValue(null);
        this.AgentTemplateFormControl.disable();
        this.QueuesFormControl.setValue(null);
        this.QueuesFormControl.disable();
      }
    });
  }

  public SetObservables() {
    this.OpenNewUserDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenNewUserDialog$ = this.OpenNewUserDialogSubject.asObservable();
    this.SubjectAgentDropDown = new BehaviorSubject<IAgentDropdown[]>([]);
    this.agentDropDown$ = this.SubjectAgentDropDown.asObservable();
    this.SubjectQueues = new Subject<IAgentQueue[]>();
    this.Queues$ = this.SubjectQueues.asObservable();
    this.SubjectUserDropdownData = new Subject<IUserDropdown>();
    this.UserDropdownData$ = this.SubjectUserDropdownData.asObservable();
    this.SubjectTemplateList = new BehaviorSubject<IAgentView[]>([]);
    this.TemplateList$ = this.SubjectTemplateList.asObservable();
    this.SubjectBranchList = new Subject<GroupResult[]>();
    this.BranchList$ = this.SubjectBranchList.asObservable();
    this.SubjectUserTagList = new Subject<string[]>();
    this.UserTagList$ = this.SubjectUserTagList.asObservable();
    this.IsCustomerUserTypeSubject = new BehaviorSubject<boolean>(false);
    this.IsCustomerUserType$ = this.IsCustomerUserTypeSubject.asObservable();
    this.RolesSubject = new BehaviorSubject<IRole[]>([]);
    this.Roles$ = this.RolesSubject.asObservable();
    this.HideIsOverrideSubject = new BehaviorSubject<boolean>(true);
    this.HideIsOverride$ = this.HideIsOverrideSubject.asObservable();
    this.IsInternalAuthenticationSubject = new BehaviorSubject<boolean>(true);
    this.IsInternalAuthentication$ = this.IsInternalAuthenticationSubject.asObservable();
    this.UsersSubject = new BehaviorSubject<IUserInfo[]>([]);
    this.Users$ = this.UsersSubject.asObservable();
    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();
    this.PasswordNotAllowSubject = new BehaviorSubject<boolean>(false);
    this.PasswordNotAllow$ = this.PasswordNotAllowSubject.asObservable();
  }

  public OpenModel() {
    this.IsInternalAuthenticationSubject.next(true);
    this.OpenNewUserDialogSubject.next(true);
    this.UserTagList = [];
    this.SubjectUserTagList.next(null);
    this.checkIfPasswordAllowToAddOrNot();
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

  public RemoveUserIdAndCompanyId() {
    this.browserStorageService.RemoveAllUserId();
  }

  public CloseModel() {
    this.UserForm.reset();
    this.UserTypeFormControl.enable();
    this.CompanyFormControl.enable();
    this.ResetTemplateList();
    this.IsCustomerUserTypeSubject.next(false);
    this.OpenNewUserDialogSubject.next(false);
    this.UserDetails = {};
    this.PasswordNotAllowSubject.next(false);
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
      role: [data.role],
      type: [data.type, CustomRequiredDropDownValidator()],
      company: [data.company],
      email: [
        data.email,
        {
          updateOn: 'change',
          validators: [Validators.pattern(Validations.EmailRegX),Validators.required],
          asyncValidators: [
            this.userValidatorService.EmailAlreadyExistValidator(data.id, data.email)
          ]
        }
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
      alertPhoneNumber: [data.alertPhoneNumber],
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

  public GetUserDetailsFromId(userId: string, companyId: string) {
    this.userAPIService.Get<IReqUserInfo>(companyId, userId)
      .subscribe((x) => {
        this.UserDetails = x;
        this.TempVariable = false;
        this.PasswordNotAllowSubject.next(true);
        if (x.companyId) {
          this.GetWorkFlows(companyId, false);
          this.browserStorageService.SetAllUserCompanyId(x.companyId);
          this.BindRolesByCompanyId(x.companyId);
        }
        this.IsInternalAuthenticationSubject.next(false);
        this.GetAgentTemplate(x.companyId).subscribe(a => {
          this.AgentTemplateData = a;
          this.UpdateUnSelectedAgentTemplates();
          this.SetValuesInForm(x);
          this.UserTypeFormControl.disable();
          this.CompanyFormControl.disable();
          const type = this.UserForm.get('type').value;
          if (type && type.value === this.CustomerUserType) {
            this.IsCustomerUserTypeSubject.next(true);
          }
          this.UserTagList = x.tags;
          this.SubjectUserTagList.next(x.tags);
          if (x.isOverride) {
            this.HideIsOverrideSubject.next(false);
            x.agentTemplate = this.GetAgentTemplateListFormat(x.agentTemplate);
            this.SubjectTemplateList.next(x.agentTemplate);
            this.TemplateList = x.agentTemplate ? x.agentTemplate : [];
            this.UpdateUnSelectedAgentTemplates();
          } else {
            if (x.roleId && x.companyId) {
              this.GetWorkFlows(x.companyId, true, x.roleId);
            }
          }
        });

      });
  }

  private GetAgentTemplateListFormat(agent = []) {
    for (let i = 0; i <= (agent.length - 1); i++) {
      const template = this.GetAgentTemplateObj(agent[i].agentId);
      const queues = this.GetQueuesByWorkflowId((template ? template : null), agent[i].queues);
      if (template && queues) {
        const list: IAgentView = {
          templateCode: template.id,
          templateName: template.name,
          queues
        };
        this.TemplateList.push(list);
      }
    }
    return this.TemplateList;
  }

  private GetQueuesByWorkflowId(template: IAgentDropdown, queueIds: string[]) {
    let agentQueues = [];
    const workflow = template && template.workflowId && this.SubjectWorkflows.value ?
      this.SubjectWorkflows.getValue().find(workflow => workflow.workFlowId === template.workflowId) : null;
    const queues = workflow ? workflow.queues : [];
    queues.forEach(x => {
      agentQueues.push({
        queueId: x.id,
        queueName: x.name
      });
    });
    agentQueues = agentQueues.filter(queue => queueIds.includes(queue.queueId));
    return agentQueues || [];
  }

  private GetRoleObj(id: string) {
    return (!this.RolesSubject.value)
      ? null
      : this.RolesSubject.value.find(
        (x) => x.roleId === id
      );
  }

  private GetAgentTemplateObj(id: string) {
    return (!this.SubjectAgentDropDown.value)
      ? null
      : this.SubjectAgentDropDown.value.find(
        (x) => x.id === id
      );
  }

  private GetCompanyObj(id: string) {
    return this.UserDropdownData === undefined
      ? null
      : this.UserDropdownData.companies.find(
        (x) => x.companyId === id
      );
  }

  public GetAllUserId(): string {
    return this.browserStorageService.AllUserId;
  }

  public GetAllUserCompanyId(): string {
    return this.browserStorageService.AllUserCompanyId;
  }

  public SetValuesInForm(data) {
    this.UserForm.get('userId').setValue(data.id);
    this.UserForm.get('firstName').setValue(data.firstName);
    this.UserForm.get('lastName').setValue(data.lastName);
    this.UserForm.get('displayName').setValue(data.displayName);
    this.UserForm.get('profileImageUrl').setValue(data.profileImageUrl);
    this.UserForm.get('role').setValue(this.GetRoleObj(data.roleId));
    this.UserForm.get('type').setValue(data.userType);
    this.UserForm.get('company').setValue(this.GetCompanyObj(data.companyId));
    this.UserForm.get('password').setValue(data.password);

    this.EmailFormControl.clearAsyncValidators();
    this.EmailFormControl.setValue(data.email);
    this.EmailFormControl.setAsyncValidators(
      this.userValidatorService.EmailAlreadyExistValidator(data.id, data.email)
    );
    this.AlertEmailFormControl.setValue(data.alertEmail);
    this.AlertPhoneNumberFormControl.setValue(data.alertPhoneNumber);
    this.UserForm.get('isUserInactive').setValue(data.isUserInactive);
    this.UserForm.get('changePasswordInFirstLogin').setValue(
      data.changePasswordInFirstLogin
    );
    this.UserForm.get('branches').setValue(data.branches);
    this.UserForm.get('isAllBranches').setValue(data.isAllBranches);
    this.UserForm.get('agentTemplate.isOverride').setValue(data.isOverride);
  }

  public CallMultipleApis() {
    this.formService
      .CombineAPICall(
        this.GetCompanies(),
        this.GetUserTypes()
      )
      .pipe(delay(2000))
      .subscribe(([companies, userTypes]) => {
        const DropdownData: IUserDropdown = {
          companies,
          userTypes,
        };
        this.UserDropdownData = DropdownData;
        this.SubjectUserDropdownData.next(DropdownData);
      });
  }

  public BindQueuesByTemplateId(templateId: string) {
    this.UserForm.get('agentTemplate.queues').setValue(null);
    if (!templateId) {
      this.UserForm.get('agentTemplate.queues').setValue(null);
      this.SubjectQueues.next([]);
    } else {
      this.GetAgentTemplateQueues(templateId);
    }
  }

  public ResetControlsOnChangeType() {
    const type = this.UserForm.get('type').value;
    if (type) {
      const roleFormControl = this.UserForm.get('role');
      const companyFormControl = this.UserForm.get('company');
      const branchesFormControl = this.UserForm.get('branches');
      if (type && type.value === this.CustomerUserType) {
        this.IsCustomerUserTypeSubject.next(true);
        roleFormControl.reset();
        companyFormControl.reset();
        this.RolesSubject.next([]);
        branchesFormControl.reset();
        this.SubjectTemplateList.next([]);
        roleFormControl.setValidators(
          CustomRequiredDropDownValidator('roleId')
        );
        companyFormControl.setValidators(
          CustomRequiredDropDownValidator('companyId')
        );
        branchesFormControl.setValidators(Validators.required);
      } else {
        this.IsCustomerUserTypeSubject.next(false);
        roleFormControl.setValidators(null);
        companyFormControl.setValidators(null);
        branchesFormControl.setValidators(null);
      }
      this.IsInternalAuthenticationSubject.next(true);
      roleFormControl.updateValueAndValidity({ emitEvent: false });
      companyFormControl.updateValueAndValidity({ emitEvent: false });
      branchesFormControl.updateValueAndValidity();
    }
  }

  public BindRolesByCompanyId(companyId: string) {
    this.UserForm.get('role').setValue(
      DefaultUserDropdownValues.RoleListDefaultValue
    );
    this.RolesSubject.next([]);
    this.SubjectTemplateList.next([]);
    this.SubjectBranchList.next([]);
    this.HideIsOverrideSubject.next(true);
    this.UserForm.get('branches').setValue(null);
    if (companyId) {
      this.browserStorageService.SetAllUserCompanyId(companyId);
      this.GetBranchNamesAndTags(companyId);
      this.GetAgentTemplate(companyId).subscribe(a => {
        this.AgentTemplateData = a;
        this.UpdateUnSelectedAgentTemplates();
      });
      this.GetRoles(companyId);
    }
  }

  public BindAgentTemplateByRoleId(roleId: string) {
    this.TemplateList = [];
    this.UserForm.controls.agentTemplate.get('template').reset();
    this.UserForm.controls.agentTemplate.get('queues').reset();
    this.UserForm.controls.agentTemplate.get('isOverride').reset();
    this.GetTemplateByRole(
      this.browserStorageService.AllUserCompanyId,
      roleId
    ).subscribe((x) => {
      this.HideIsOverrideSubject.next(!roleId ? true : false);
      this.SubjectQueues.next(null);
      this.SubjectTemplateList.next(
        this.GetAgentTemplateListFormat((x && x[0]?.agentTemplates) || [])
      );
      this.UpdateUnSelectedAgentTemplates();
    });
  }

  public GetTemplateListFormat(agent) {
    let i;
    for (i = 0; i <= agent.length - 1; i++) {
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
    formGroup.controls.template.setValidators([Validators.required]);
    formGroup.controls.queues.setValidators([
      CustomRequiredDropDownValidator('queueId'),
    ]);
    formGroup.controls.template.updateValueAndValidity();
    formGroup.controls.queues.updateValueAndValidity();
    this.formService.CallFormMethod(formGroup).then((data) => {
      const template: IAgentDropdown = this.UserForm.get(
        'agentTemplate.template'
      ).value;
      const queues: IAgentQueue[] = this.UserForm.get('agentTemplate.queues')
        .value;
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
          formGroup.controls.queues.reset();
          formGroup.updateValueAndValidity();
        } else {
          this.AppNotificationService.NotifyError(
            AllUserMessages.TemplateExistMessage
          );
        }
      }
    });
  }

  private UpdateUnSelectedAgentTemplates() {
    const unSelectedAgentTemplates = this.GetUnSelectedAgentTemplates();
    this.SubjectAgentDropDown.next(unSelectedAgentTemplates || []);
  }

  private GetUnSelectedAgentTemplates() {
    const templateList = this.TemplateList || [];
    const agentTemplates = this.AgentTemplateData || [];
    return agentTemplates.filter((agentTemplate) => !templateList.find(template => (template.templateCode === agentTemplate.id)));
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
    formGroup?.get('agentTemplate.template').clearValidators();
    formGroup?.get('agentTemplate.queues').clearValidators();
    formGroup?.get('agentTemplate.template').updateValueAndValidity();
    formGroup?.get('agentTemplate.queues').updateValueAndValidity();
    this.formService.CallFormMethod(formGroup).then((data: IUserInfo) => {
      if (data.profileImageUrl) {
        this.formService.GetImageUrl(data.profileImageUrl).subscribe((image) => {
          this.ImageUrl = image;
          this.PostUserDetails(data);
        });
      }
      else {
        this.PostUserDetails(data);
      }
    });
  }

  private PostUserDetails(data: IUserInfo) {
    const responseData = this.GetCreateUserRequest(data);
    this.userAPIService.Create(responseData.companyId, responseData).subscribe((result: any) => {
      if (result) {
        this.browserStorageService.SetAllUserId(result.id);
        this.browserStorageService.SetAllUserCompanyId(
          result.userType.value === this.CustomerUserType
            ? this.GetCompanyIdOrNull(result.company)
            : this.LaviCompanyId
        );
        this.AfterUserSaveSuccessFully();
        this.GetUsersAndSetUsersSubject();
      } else {
        this.AppNotificationService.NotifyError(AllUserMessages.ErrorMessage);
      }
    });
  }

  public GetCreateUserRequest(userData: IUserInfo) {
    const agentTemplates = [];
    this.TemplateList.forEach(ele => {
      agentTemplates.push({
        agentId: ele.templateCode,
        queues: ele.queues.filter(x => x.queueId).map(x => x.queueId)
      });
    });
    const data = {
      userId: this.uuid,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: this.ImageUrl,
      displayName: userData.displayName,
      email: userData.email,
      alertEmail: userData.alertEmail,
      alertPhoneNumber: userData.alertPhoneNumber,
      password: userData.password,
      type: userData.type,
      companyId: userData.company ? userData.company.companyId : null,
      roleId: userData.role ? userData.role.roleId : null,
      isUserInactive: userData.isUserInactive,
      changePasswordInFirstLogin: userData.changePasswordInFirstLogin,
      branches: userData.branches,
      isAllBranches: userData.isAllBranches,
      tags: this.UserTagList,
      isOverride: userData.agentTemplate.isOverride,
      agentTemplate: userData.agentTemplate.isOverride
        ? agentTemplates
        : null,
    };
    return data;
  }

  private GetCompanyIdOrNull<T extends ICompanyDropDown>(company: T) {
    if (!company) {
      return null;
    }
    if (!company.companyId) {
      return null;
    }
    return company.companyId;
  }

  private AfterUserSaveSuccessFully() {
    this.CloseModel();
    this.AppNotificationService.Notify(AllUserMessages.SaveMessage);
  }

  public UpdateUser(req: FormGroup) {
    req?.get('agentTemplate.template').clearValidators();
    req?.get('agentTemplate.queues').clearValidators();
    req?.get('agentTemplate.template').updateValueAndValidity();
    req?.get('agentTemplate.queues').updateValueAndValidity();
    this.UserDetails = {};
    this.formService.CallFormMethod(req).then((res: IUserInfo) => {
      this.ImageUrl = res.profileImageUrl;
      const userImg: any = res.profileImageUrl;
      if (userImg && userImg.name) {
        this.formService.GetImageUrl(res.profileImageUrl).subscribe((image) => {
          this.ImageUrl = image;
          this.PutUserDetails(res);
        });
      }
      else {
        this.PutUserDetails(res);
      }
    });
  }

  private PutUserDetails(res: IUserInfo) {
    const updatedData = this.GetUpdatedData(res);
    const companyId = this.GetCompanyIdOrNull(updatedData.company);
    this.userAPIService.Update(companyId, updatedData).subscribe((result: any) => {
      if (result) {
        this.browserStorageService.SetAllUserId(result.id);
        this.browserStorageService.SetAllUserCompanyId(
          result.userType.value === this.CustomerUserType
            ? this.GetCompanyIdOrNull(result.company)
            : this.LaviCompanyId
        );
        this.AfterUserUpdatedSuccessFully();
        this.UpdateCurrentUserState(result);
        this.GetUsersAndSetUsersSubject();
      } else {
        this.AppNotificationService.NotifyError(AllUserMessages.ErrorMessage);
      }
    });
  }

  public GetUpdatedData(userData: any) {
    const agentTemplates = [];
    this.TemplateList.forEach(ele => {
      agentTemplates.push({
        agentId: ele.templateCode,
        queues: ele.queues.filter(x => x.queueId).map(x => x.queueId)
      });
    });
    const data = {
      userId: userData.userId,
      companyId:
        userData.type.value === this.CustomerUserType
          ? this.GetCompanyIdOrNull(userData.company)
          : this.LaviCompanyId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: this.ImageUrl,
      displayName: userData.displayName,
      email: userData.email,
      alertEmail: userData.alertEmail,
      alertPhoneNumber: userData.alertPhoneNumber,
      password: userData.password,
      type: userData.type,
      company: userData.company,
      roleId: userData.role ? userData.role.roleId : null,
      isUserInactive: userData.isUserInactive,
      changePasswordInFirstLogin: userData.changePasswordInFirstLogin,
      branches: userData.branches,
      isAllBranches: userData.isAllBranches,
      tags: this.UserTagList,
      isOverride: userData.agentTemplate.isOverride,
      agentTemplate: userData.agentTemplate.isOverride
        ? agentTemplates
        : null,
    };
    return data;
  }

  private AfterUserUpdatedSuccessFully() {
    this.CloseModel();
    this.AppNotificationService.Notify(AllUserMessages.UpdateMessage);
  }

  private UpdateCurrentUserState(user: any) {
    if (this.authService.UserId === user.id) {
      this.mediatorService.SetInitialUserDetails({
        firstName: user.firstName,
        image: user.profileImageUrl,
        lastName: user.lastName,
        type: user.userType.value,
        role: user.roleId,
        email: user.email,
        alertEmail: user.alertEmail,
        alertPhoneNumber: user.alertPhoneNumber,
        roleName: this.RolesSubject.value.find(x => x.roleId === user.roleId).roleName,
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

  // Below Code Need To Check
  public FilterBranch(value: string) {
    const branch = this.BranchSearchList.length > 0 ? this.GetFilteredBranchNamesAndTags(value, this.BranchSearchList[0]) : [];
    const tags = this.BranchSearchList.length > 1 ? this.GetFilteredBranchNamesAndTags(value, this.BranchSearchList[1]) : [];
    this.SubjectBranchList.next(
      groupBy(branch.concat(tags), [{ field: 'type' }])
    );
  }

  private GetFilteredBranchNamesAndTags(value: string, searchList) {
    return searchList.items.filter(s => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  public DisableBranches() {
    const checkIsAllBranches = this.UserForm.get('isAllBranches').value;
    if (!checkIsAllBranches) {
      this.UserForm.get('branches').setValue(null);
      this.UserForm.get('branches').disable();
    } else {
      this.UserForm.get('branches').enable();
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
      roleName: '',
      company: null,
      type: null,
      email: '',
      alertEmail: '',
      alertPhoneNumber: '',
      isUserInactive: false,
      changePasswordInFirstLogin: false,
      password: '',
      branches: [],
      tags: [],
      isAllBranches: false,
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
    const tag = this.UserTagControl.value;
    if (this.IsValidTag(tag)) {
      this.UserTagList.push(tag.toLowerCase());
    }
    this.SubjectUserTagList.next(this.UserTagList);
    this.UserTagControl.reset();
  }

  private IsValidTag(tag: string) {
    return (
      tag !== null &&
      !Array.isArray(tag) &&
      tag.trim() !== '' &&
      !this.UserTagList.includes(tag.toLowerCase())
    );
  }

  public RemoveTags(e: ChipRemoveEvent) {
    this.UserTagList.splice(
      this.UserTagList.findIndex((c) => c === e.sender.label),
      1
    );
    this.SubjectUserTagList.next(this.UserTagList);
  }

  private CheckIfEmailExists(
    emailId: string,
    userId: string
  ): Observable<boolean> {
    return this.userAPIService.EmailExists({ email: emailId, userId });
  }

  public OnSeparatorAddTag(tag: string) {
    const IsTagContainComma = tag.indexOf(',') > -1;
    if (IsTagContainComma) {
      this.UserTagControl.setValue(tag.replace(/,/g, ''));
      this.OnEnterTag();
    }
  }

  // Default values

  public GetCompanies(): Observable<ICompanyDropDown[]> {
    return this.companyAPIService.GetDropdownList<ICompanyDropDown>();
  }

  public GetCompanyLoginMode(companyId: string) {
    if (companyId) {
      this.companyAPIService.GetLoginMode<CompanyLoginMode>(companyId)
        .subscribe((companyLoginMode) => {
          let isInternalAuthentication = companyLoginMode.loginMode === LoginMode.INTERNAL && this.UserDetails.isSignedIn !== true;
          this.IsInternalAuthenticationSubject.next(isInternalAuthentication);
        });
    }
  }

  public GetRoles(companyId: string) {
    this.userRoleAPIService.GetDropdownList(companyId)
      .subscribe((roles: IRole[]) => {
        this.RolesSubject.next(roles);
      });
  }

  public GetBranchNamesAndTags(companyId) {
    this.branchAPIService.GetBranchNamesWithTags(companyId)
      .subscribe((branch) => {
        this.SubjectBranchList.next(this.MapBranchAndTags(branch));
      });
  }

  private MapBranchAndTags(branchNamesAndTags) {
    const branchList = [];
    if (branchNamesAndTags) {
      branchNamesAndTags.map((b: any) => {
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
        if (b.tags && b.tags.length !== 0) {
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
        return (a.name.toString().toLowerCase() < b.name.toString().toLowerCase() ? -1
          : a.name.toString().toLowerCase() > b.name.toString().toLowerCase() ? 1 : 0);
      }
    });

    const groupedData: GroupResult[] = groupBy(sortedData, [{ field: 'type' }]);
    this.BranchSearchList = groupedData;
    return groupedData;
  }

  public GetAgentTemplate(companyId) {
    return this.agentAPIService.GetDropdownList<IAgentDropdown>(companyId);
  }

  private GetAgentTemplateQueues(templateId: string) {
    const workflowId = this.AgentTemplateData.find(
      (t) => t.id === templateId
    ).workflowId;
    this.workflowAPIService.GetQueues(this.GetAllUserCompanyId(),workflowId)
      .subscribe((q: IAgentQueue[]) => {
        this.SubjectQueues.next(q);
      });
  }

  private GetTemplateByRole(companyId: string, roleId: string) {
    return this.userRoleAPIService.GetTemplates(companyId, roleId);
  }

  GetUserTypes(): Observable<IDropdown[]> {
    const UserTypes: IDropdown[] = [];

    Object.keys(UserType).forEach((key) => {
      UserTypes.push({ text: key, value: UserType[key] });
    });
    return of(UserTypes);
  }

  public IsUserAuthenticationTypeInternal(): boolean {
    return this.authService.CompanyLoginMode === LoginMode.INTERNAL;
  }

  public GetUsersAndSetUsersSubject(): void {
    this.userAPIService.GetAll<IUserInfo>(this.LaviCompanyId)
      .subscribe((users) => {
        this.UsersSubject.next(!users ? [] : users);
      });
  }

  public GetWorkFlows(companyId: string, bindRoles: boolean, roleId?: string) {
    this.subs.sink = this.workflowAPIService.GetDropdownList(companyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
        if (bindRoles) {
          this.BindAgentTemplateByRoleId(roleId);
        }
      });
  }

  public DeleteUser(user: IUserInfo){
    return this.userAPIService.Delete(user.companyId, user.id);
  }

}
