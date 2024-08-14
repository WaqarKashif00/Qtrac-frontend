import { Injectable } from '@angular/core';
import {
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { DynamicVariableService } from 'src/app/core/services/dynamic-variables.service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { TranslateService } from 'src/app/core/services/translate.service';
import {
  cloneObject,
  getArrayValueIfNotEmptyElseNull
} from 'src/app/core/utilities/core-utilities';
import { IAddUserRole } from 'src/app/models/common/user-role/add-user-role';
import { ITranslations } from 'src/app/models/common/workflow/tranlations-texts.interface';
import { EstimateWaitTimeMessageRange } from 'src/app/models/common/workflow/workflow-estimate-wait-custom-range.model';
import { WorkflowEstimateWaitSettings } from 'src/app/models/common/workflow/workflow-estimate-wait-settings.model';
import { ActionType } from 'src/app/models/enums/action-type.enum';
import { Mode } from 'src/app/models/enums/mode.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import {
  DocumentType,
  VariablePurpose,
  VariableRequestDocument
} from 'src/app/models/enums/variables-related';
import { BranchAPIService } from 'src/app/shared/api-services/branch-api.service';
import { MobileAPIService } from 'src/app/shared/api-services/mobile-api.service';
import { UserRoleAPIService } from 'src/app/shared/api-services/user-role-api.service';
import { NoOfDigitToTicketNumberingFormatPipe } from 'src/app/shared/pipes/no-of-digit-to-no-of-zero.pipe';
import { WorkflowValidatorService } from 'src/app/shared/validators/workflow.validator';
import {
  IWorkFlowDetail,
  PreServiceQuestion,
  QuestionSet,
  Queue,
  Service,
  Setting,
  SurveyQuestionSet
} from '../../models/common/work-flow-detail.interface';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { WorkflowAPIService } from '../../shared/api-services/workflow-api.service';
import { IBranch } from '../branch-list/models/branch.interface';
import { ILayoutTemplate } from '../branch-list/models/layout-template.interface';
import { IRequest } from '../company-configuration/models/company-configuration-request.interface';
import { AdvanceWorkflowType } from './enums/request-document-type';
import { WorkflowMessages } from './message-constant';
import { AdvanceRules } from './models/advance-workflow-rules.interface';
import { IMobileDropdown } from './models/appointment-rule';
import {
  IBasicWorkFlowRules,
  IEmailAtPositionAndTemplate,
  ISmsAtPositionAndTemplate,
  SendSmsTemplate
} from './models/basic-workflow-behaviour-rule.interface';
import {
  ConditionVariable,
  DynamicVariable,
  EventName,
  QuestionSet as ConditionalQuestionSet
} from './models/conditional-events';
import { IGeneralSetting } from './models/general-settings-interface';
import { SupportedLanguage } from './models/supported-language';
import { IWorkflowDropDown } from './models/worflow-dropdown.interface';
import {
  AppointmentTemplate,
  EmailTemplate,
  Group,
  Group as GroupRequest,
  IWorkFlowRequest,
  PreServiceQuestion as RequestPreServiceQuestion,
  QuestionSet as QuestionSetRequest,
  Queue as RequestQueue,
  Service as ServiceRequest,
  Setting as SettingRequest
} from './models/work-flow-request.interface';
import { IWorkFlowResponse } from './models/work-flow-response.interface';


@Injectable()
export class WorkFlowService extends AbstractComponentService {

  OpenAdvanceRuleModal() {
    this.AdvanceRuleModelOpenSubject.next(true);
  }

  CloseAdvanceRuleModal() {
    this.AdvanceRuleModelOpenSubject.next(false);
  }

  AddAdvanceRuleInList(value: AdvanceRules) {
    value.id = this.uuid
    let data = this.AdvanceWorkflowListSubject.value
    data.push(value);
    this.AdvanceWorkflowListSubject.next(cloneObject(data));
    this.CloseAdvanceRuleModal()
  }

  UpdateAdvanceRuleInList(value: AdvanceRules) {
    let foundIndex = this.AdvanceWorkflowListSubject.value.findIndex(x => x.id == value.id);
    if (foundIndex >= 0) {
      this.AdvanceWorkflowListSubject.value[foundIndex] = value;
    }
    this.AdvanceWorkflowListSubject.next(cloneObject(this.AdvanceWorkflowListSubject.value));
    this.CloseAdvanceRuleModal()
  }

  get CompanyId() {
    return this.authStateService.CompanyId;
  }

  get WorkFlowNameFormControl() {
    return this.WorkFlowNameForm.get('name');
  }

  get GeneralWorkflowNameFormControl() {
    return this.GeneralSettingForm.get('name');
  }


  get HavingAdditionalLanguage() {
    return this.IsAdditionalLanguageAvailable;
  }

  get EndTicketNo() {
    return this.SettingForm?.get('ticketEnd').value;
  }

  ActionAlertCopyCount = 0;
  AddEditQuestionSetForm: FormGroup;
  AddEditSurveyQuestionSetForm: FormGroup;
  SmsAtPositionFormArray: FormArray;
  EmailAtPositionFormArray: FormArray;
  SendSMSRegistrationTemplateArray: FormArray;
  SendSMSAutoReplyTemplateArray: FormArray;
  SendSMSToJoinQueueTemplateArray: FormArray;
  SendSMSAtYourTurnTemplateArray: FormArray;
  SendSmsUponTransferTemplateArray: FormArray;
  SendSmsWhenRequeuedTemplateArray: FormArray;
  SendSmsForSurveyTemplateArray: FormArray;
  SendSMSWhenCancelledTemplateArray: FormArray;
  supportedLanguages: SupportedLanguage[] = [];
  IsAdditionalLanguageAvailable = true;
  SendEmailRegistrationTemplateArray: FormArray;
  SendEmailAtYourTurnTemplateArray: FormArray;
  SendEmailWhenCancelledTemplateArray: FormArray;
  SendEmailUponTransferTemplateArray: FormArray;
  SendEmailWhenRequeuedTemplateArray: FormArray;
  SendEmailForSurveyTemplateArray: FormArray;
  isAdditionalLanguageInvalid = true;
  AlreadySet: boolean;
  serviceIcons: any[] = [];

  BasicWorkflowRulesForm: FormGroup;
  GeneralSettingForm: FormGroup;
  SettingForm: FormGroup;
  WorkFlowNameForm: FormGroup;
  EstimateWaitSettingsForm: FormGroup;
  setting: SettingRequest;
  WorkFlow: IWorkFlowRequest;
  WorkFlowValidationMessage = '';
  Mode: string;
  workflowList$: Observable<IWorkFlowResponse[]>;
  private workflowListSubject$: BehaviorSubject<IWorkFlowResponse[]>;

  Queues$: Observable<Queue[]>;
  QueuesSubject: BehaviorSubject<Queue[]>;

  AdvanceRuleModelOpen$: Observable<boolean>;
  AdvanceRuleModelOpenSubject: BehaviorSubject<boolean>;

  AppointTemplateList$: Observable<AppointmentTemplate[]>;
  AppointTemplateListSubject: BehaviorSubject<AppointmentTemplate[]>;

  AdvanceWorkflowList$: Observable<AdvanceRules[]>;
  AdvanceWorkflowListSubject: BehaviorSubject<AdvanceRules[]>;

  EventNameList$: Observable<EventName[]>;
  EventNameListSubject: BehaviorSubject<EventName[]>;



  ConditionalList$: Observable<ConditionVariable[]>;
  ConditionalListSubject: BehaviorSubject<ConditionVariable[]>;
  ConditionalList: ConditionVariable[] = [];

  EventConditionalList$: Observable<ConditionVariable[]>;
  EventConditionalListSubject: BehaviorSubject<ConditionVariable[]>;
  EventConditionalList: ConditionVariable[] = [];

  AlertConditionalList$: Observable<ConditionVariable[]>;
  AlertConditionalListSubject: BehaviorSubject<ConditionVariable[]>;
  AlertConditionalList: ConditionVariable[] = [];

  DynamicVariablesList$: Observable<ConditionVariable[]>;
  DynamicVariablesListSubject: BehaviorSubject<ConditionVariable[]>;
  DynamicVariablesList: ConditionVariable[] = [];




  EstimateWaitSettings$: Observable<WorkflowEstimateWaitSettings>;
  private EstimateWaitSettingsSubject: BehaviorSubject<WorkflowEstimateWaitSettings>;
  IsAllowCalculateEstimateWaitTime$: Observable<boolean>;

  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;

  PreServiceQuestions$: Observable<PreServiceQuestion[]>;
  public PreServiceQuestionsSubject: BehaviorSubject<PreServiceQuestion[]>;

  Services$: Observable<Service[]>;
  public ServicesSubject: BehaviorSubject<Service[]>;

  Groups$: Observable<Group[]>;
  public GroupsSubject: BehaviorSubject<Group[]>;

  QuestionSets$: Observable<QuestionSet[]>;
  QuestionSetsSubject: BehaviorSubject<QuestionSet[]>;

  SurveyQuestionSets$: Observable<SurveyQuestionSet[]>;
  SurveyQuestionSetsSubject: BehaviorSubject<SurveyQuestionSet[]>;

  ConditionalQuestionSets$: Observable<ConditionalQuestionSet[]>;
  ConditionalQuestionSetsSubject: BehaviorSubject<ConditionalQuestionSet[]>;

  BasicWorkFlowData$: Observable<any>;
  private BasicWorkFlowDataSubject: BehaviorSubject<any>;

  SupportedLanguages$: Observable<SupportedLanguage[]>;
  private SupportedLanguagesSubject: BehaviorSubject<SupportedLanguage[]>;

  Routings$: Observable<GroupResult[]>;
  private RoutingsSubject: BehaviorSubject<GroupResult[]>;

  IsPreServiceQuestionVisible$: Observable<boolean>;
  private IsPreServiceQuestionVisibleSubject: BehaviorSubject<boolean>;

  SingleNumberingFormatEnabled$: Observable<boolean>;
  private SingleNumberingFormatEnabledSubject: BehaviorSubject<boolean>;

  workflowUsedInBranchSubject: BehaviorSubject<any[]>;
  workflowUsedInBranch$: Observable<any[]>;

  BranchesNameSubject: BehaviorSubject<any[]>;
  BranchesName$: Observable<any[]>;

  private AllRolesListSubject: BehaviorSubject<IAddUserRole[]>;
  AllRolesList$: Observable<IAddUserRole[]>;

  MobileList: IMobileDropdown[];

  constructor(
    private appNotificationService: AppNotificationService,
    private authStateService: AuthStateService,
    private noOfDigitToTicketNumberingFormatPipe: NoOfDigitToTicketNumberingFormatPipe,
    private readonly companyAPIService: CompanyAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly WorkflowValidatorService: WorkflowValidatorService,
    private readonly dynamicVariablesService: DynamicVariableService,
    private readonly translateService: TranslateService,
    private readonly branchAPIService: BranchAPIService,
    private readonly mobileApiService: MobileAPIService,
    private readonly userRoleAPIService: UserRoleAPIService,
  ) {
    super();
    this.SupportedLanguagesSubject = new BehaviorSubject<SupportedLanguage[]>(
      []
    );
    this.SupportedLanguages$ = this.SupportedLanguagesSubject.asObservable();
    this.setting = this.GetDefaultSettings();
    this.Init();
    this.InitEstimateWaitSettingsFormGroup();
  }

  Init() {
    this.isAdditionalLanguageInvalid = true;
    this.getCompanyInfo();
    this.setObservables();
    this.getWorkflowList();
    this.getUserRoleList();
    this.BranchList();
  }
  public getWorkflowList() {
    this.subs.sink = this.workflowAPIService
      .GetAll<IWorkFlowResponse>(this.CompanyId)
      .subscribe((response) => {
        this.workflowListSubject$.next(response);
      });
  }

  public getCompanyInfo() {
    this.subs.sink = this.companyAPIService
      .Get<IRequest>(this.CompanyId)
      .subscribe((response) => {
      });
  }

  public getUserRoleList() {
    this.subs.sink = this.userRoleAPIService
      .GetDropdownList<IAddUserRole[]>(this.CompanyId)
      .subscribe((response) => {
        this.AllRolesListSubject.next(response);
      });
  }
  setObservables() {
    this.workflowListSubject$ = new BehaviorSubject<IWorkFlowResponse[]>([]);
    this.workflowList$ = this.workflowListSubject$.asObservable();

    this.workflowUsedInBranchSubject = new BehaviorSubject<any[]>([]);
    this.workflowUsedInBranch$ = this.workflowListSubject$.asObservable();

    this.ConditionalListSubject = new BehaviorSubject<ConditionVariable[]>([]);
    this.ConditionalList$ = this.ConditionalListSubject.asObservable();

    this.AdvanceRuleModelOpenSubject = new BehaviorSubject<boolean>(false)
    this.AdvanceRuleModelOpen$ = this.AdvanceRuleModelOpenSubject.asObservable()
    this.EventConditionalListSubject = new BehaviorSubject<ConditionVariable[]>(
      []
    );
    this.EventConditionalList$ =
      this.EventConditionalListSubject.asObservable();

    this.AlertConditionalListSubject = new BehaviorSubject<ConditionVariable[]>(
      []
    );
    this.AlertConditionalList$ =
      this.AlertConditionalListSubject.asObservable();

    this.DynamicVariablesListSubject = new BehaviorSubject<DynamicVariable[]>(
      []
    );
    this.DynamicVariablesList$ =
      this.DynamicVariablesListSubject.asObservable();

    this.BranchesNameSubject = new BehaviorSubject<any[]>([]);
    this.BranchesName$ = this.BranchesNameSubject.asObservable();

    this.AllRolesListSubject = new BehaviorSubject<IAddUserRole[]>([]);
    this.AllRolesList$ = this.AllRolesListSubject.asObservable();

    this.GetVariables();
  }

  createCopyOfWorkflow(workflow: IWorkflowDropDown) {
    return this.workflowAPIService.CreateCopy<IWorkFlowDetail>(
      workflow.companyId,
      workflow.workFlowId,
      this.uuid
    );
  }

  deleteWorkflow(workflow: IWorkflowDropDown) {
    return this.workflowAPIService.Delete<IWorkFlowDetail>(
      workflow.companyId,
      workflow.workFlowId
    );
  }

  public InitRequiredWorkFlowConfiguration() {
    this.InitSubjectsAndObservables();
    this.InitWorkFlowNameFormGroup();
    this.InitSettingFormGroup();
    this.InitBasicWorkFlowRules();
    this.InitGeneralSettingFormGroup();
    this.InitEstimateWaitSettingsFormGroup();
    this.SetSettingFormGroup(this.GetDefaultSettings());
  }

  private InitSubjectsAndObservables() {
    this.BasicWorkFlowDataSubject = new BehaviorSubject<any>({});
    this.BasicWorkFlowData$ = this.BasicWorkFlowDataSubject.asObservable();

    this.QueuesSubject = new BehaviorSubject<Queue[]>([]);
    this.Queues$ = this.QueuesSubject.asObservable();

    this.AppointTemplateListSubject = new BehaviorSubject<AppointmentTemplate[]>([]);
    this.AppointTemplateList$ = this.AppointTemplateListSubject.asObservable();

    this.AdvanceWorkflowListSubject = new BehaviorSubject<any>([]);
    this.AdvanceWorkflowList$ = this.AdvanceWorkflowListSubject.asObservable();

    this.PreServiceQuestionsSubject = new BehaviorSubject<PreServiceQuestion[]>([]);
    this.PreServiceQuestions$ = this.PreServiceQuestionsSubject.asObservable();

    this.ServicesSubject = new BehaviorSubject<Service[]>([]);
    this.Services$ = this.ServicesSubject.asObservable();

    this.GroupsSubject = new BehaviorSubject<Group[]>([]);
    this.Groups$ = this.GroupsSubject.asObservable();

    this.QuestionSetsSubject = new BehaviorSubject<QuestionSet[]>([]);
    this.QuestionSets$ = this.QuestionSetsSubject.asObservable();

    this.SurveyQuestionSetsSubject = new BehaviorSubject<SurveyQuestionSet[]>([]);
    this.SurveyQuestionSets$ = this.SurveyQuestionSetsSubject.asObservable();

    this.ConditionalQuestionSetsSubject = new BehaviorSubject<
      ConditionalQuestionSet[]
    >([]);
    this.ConditionalQuestionSets$ =
      this.ConditionalQuestionSetsSubject.asObservable();

    this.RoutingsSubject = new BehaviorSubject<GroupResult[]>([]);
    this.Routings$ = this.RoutingsSubject.asObservable();

    this.IsPreServiceQuestionVisibleSubject = new BehaviorSubject<boolean>(
      false
    );
    this.IsPreServiceQuestionVisible$ =
      this.IsPreServiceQuestionVisibleSubject.asObservable();

    this.IsPreServiceQuestionVisibleSubject = new BehaviorSubject<boolean>(
      false
    );
    this.IsPreServiceQuestionVisible$ =
      this.IsPreServiceQuestionVisibleSubject.asObservable();

    this.SingleNumberingFormatEnabledSubject = new BehaviorSubject<boolean>(
      false
    );
    this.SingleNumberingFormatEnabled$ =
      this.SingleNumberingFormatEnabledSubject.asObservable();

    this.EventNameListSubject = new BehaviorSubject<EventName[]>([]);
    this.EventNameList$ = this.EventNameListSubject.asObservable();

    this.EstimateWaitSettingsSubject =
      new BehaviorSubject<WorkflowEstimateWaitSettings>(
        this.GetDefaultEstimateSettings()
      );
    this.EstimateWaitSettings$ =
      this.EstimateWaitSettingsSubject.asObservable();

    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();

    this.IsAllowCalculateEstimateWaitTime$ = this.EstimateWaitSettings$.pipe(
      map((x) => {
        if (x) {
          return x.allowCalculateEstimateWaitTime;
        }
        return false;
      })
    );

    if (
      !this.ConditionalList ||
      !Array.isArray(this.ConditionalList) ||
      !this.ConditionalList[0]
    ) {
      this.subs.sink = this.ConditionalList$.subscribe((conditionVariables) => {
        this.ConditionalList =
          conditionVariables &&
          conditionVariables.map<ConditionVariable>((x: any) => {
            return this.CreateConditionListOnSubscribe(x);
          });
      });
    }

    if (
      !this.EventConditionalList ||
      !Array.isArray(this.EventConditionalList) ||
      !this.EventConditionalList[0]
    ) {
      this.subs.sink = this.EventConditionalList$.subscribe(
        (conditionVariables) => {
          this.EventConditionalList =
            conditionVariables &&
            conditionVariables.map<ConditionVariable>((x: any) => {
              return this.CreateConditionListOnSubscribe(x);
            });
        }
      );
    }

    if (
      !this.AlertConditionalList ||
      !Array.isArray(this.AlertConditionalList) ||
      !this.AlertConditionalList[0]
    ) {
      this.subs.sink = this.AlertConditionalList$.subscribe(
        (conditionVariables) => {
          this.AlertConditionalList =
            conditionVariables &&
            conditionVariables.map<ConditionVariable>((x: any) => {
              return this.CreateConditionListOnSubscribe(x);
            });
        }
      );
    }

    if (
      !this.DynamicVariablesList ||
      !Array.isArray(this.DynamicVariablesList) ||
      !this.DynamicVariablesList[0]
    ) {
      this.subs.sink = this.DynamicVariablesList$.subscribe(
        (dynamicVariables) => {
          this.DynamicVariablesList =
            dynamicVariables &&
            dynamicVariables.map<DynamicVariable>((x: any) => {
              return {
                data_type: x.data_type,
                id: x.id,
                shortName: x.friendlyName,
                type: x.type,
                fieldName: x.shortName,
              };
            });
        }
      );
    }
  }

  GetDefaultEstimateSettings(): WorkflowEstimateWaitSettings {
    return {
      allowCalculateEstimateWaitTime: false,
      isIncludeAppointmentsIntoConsiderations: false,
      customRangesForTimeDisplayMessages: [],
      defaultRange: 5,
      idleTimeBetweenServices: 5,
    };
  }

  private CreateConditionListOnSubscribe(x: any): any {
    return {
      data_type: x.data_type,
      id: x.id,
      shortName: x.friendlyName,
      type: x.type,
      fieldName: x.shortName,
      data: x.data ? x.data : null,
    };
  }

  private InitWorkFlowNameFormGroup() {
    this.WorkFlowNameForm = this.formBuilder.group({
      name: [null, Validators.required],
    });
  }

  GetDefaultBasicWorkFLowRules(): any {
    return {
      id: null,
      enableSendRegistrationSms: null,
      sendRegistrationSmsTemplate: null,
      sendAutoReplySmsTemplate: null,
      smsAtPositionTemplate: [
        {
          enableSendSmsWhenCustomerIsAtLine: null,
          sendSmsWhenCustomerIsAtLineTemplate: null,
          sendSmsWhenCustomerIsAtLine: null,
        },
      ],
      enableSendSmsAtYourTurn: null,
      sendSmsAtYourTurnTemplate: null,
      enableSendSmsWhenCancelled: null,
      sendSmsWhenCancelledTemplate: null,
      sendJoinQueueSmsTemplate: null,
    };
  }

  SetBasicWorkFlowRules(basicWorkFlowData: IBasicWorkFlowRules) {
    if (this.Mode == Mode.Edit) {
      this.BasicWorkflowRulesForm.controls.enableSendRegistrationSms.setValue(
        basicWorkFlowData.enableSendRegistrationSms
      );

      this.BasicWorkflowRulesForm.controls.enableTextToJoin.setValue(
        true
      );

      this.BasicWorkflowRulesForm.controls.enableAutoReplySMS.setValue(
        basicWorkFlowData.enableAutoReplySMS
      );

      this.BasicWorkflowRulesForm.controls.enableSendSmsAtYourTurn.setValue(
        basicWorkFlowData.enableSendSmsAtYourTurn
      );
      this.BasicWorkflowRulesForm.controls.enableSendSmsWhenCancelled.setValue(
        basicWorkFlowData.enableSendSmsWhenCancelled
      );

      this.BasicWorkflowRulesForm.controls.enableSendRegistrationEmail.setValue(
        basicWorkFlowData.enableSendRegistrationEmail
      );
      this.BasicWorkflowRulesForm.controls.enableSendEmailAtYourTurn.setValue(
        basicWorkFlowData.enableSendEmailAtYourTurn
      );
      this.BasicWorkflowRulesForm.controls.enableSendEmailWhenCancelled.setValue(
        basicWorkFlowData.enableSendEmailWhenCancelled
      );

      this.BasicWorkflowRulesForm.controls.enableSendSmsUponTransfer.setValue(
        basicWorkFlowData.enableSendSmsUponTransfer
      );
      this.BasicWorkflowRulesForm.controls.enableSendSmsForSurvey.setValue(
        basicWorkFlowData.enableSendSmsForSurvey
      );
      this.BasicWorkflowRulesForm.controls.enableSendSmsWhenRequeued.setValue(
        basicWorkFlowData.enableSendSmsWhenRequeued
      );

      this.BasicWorkflowRulesForm.controls.enableSendEmailUponTransfer.setValue(
        basicWorkFlowData.enableSendEmailUponTransfer
      );
      this.BasicWorkflowRulesForm.controls.enableSendEmailForSurvey.setValue(
        basicWorkFlowData.enableSendEmailForSurvey
      );
      this.BasicWorkflowRulesForm.controls.enableSendEmailWhenRequeued.setValue(
        basicWorkFlowData.enableSendEmailWhenRequeued
      );
      this.clearAllTemplates();

      this.GetDynamicVariables().subscribe((x) => {
        this.DynamicVariablesListSubject.next(cloneObject(x));
      });

      if (
        this.supportedLanguages &&
        Array.isArray(this.supportedLanguages) &&
        this.supportedLanguages[0]
      ) {
        this.setAllDefaultTemplateArrays();
        this.setAllTemplateArrays(basicWorkFlowData);
      } else {
        this.subs.sink = this.SupportedLanguages$.subscribe(x => {
          this.setAllDefaultTemplateArrays();
          this.setAllTemplateArrays(basicWorkFlowData);
        });
      }
    }
  }

  setAllDefaultTemplateArrays() {
    this.setDefaultSmsTemplateArray(this.SendSMSAtYourTurnTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailAtYourTurnTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSMSWhenCancelledTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailWhenCancelledTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSMSRegistrationTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSMSAutoReplyTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSMSToJoinQueueTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailRegistrationTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailForSurveyTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSmsForSurveyTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailUponTransferTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSmsUponTransferTemplateArray);
    this.setDefaultEmailTemplateArray(this.SendEmailWhenRequeuedTemplateArray);
    this.setDefaultSmsTemplateArray(this.SendSmsWhenRequeuedTemplateArray);
  }

  setAllTemplateArrays(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setRegisterSMSTemplateArray(basicWorkFlowData);

    this.setAutoReplySMSTemplateArray(basicWorkFlowData);

    this.setJoinQueueSMSTemplateArray(basicWorkFlowData);

    this.setCancelledSMSTemplateArray(basicWorkFlowData);

    this.setTurnSMSTemplateArray(basicWorkFlowData);

    this.setRegisterEmailTemplateArray(basicWorkFlowData);

    this.setCancelledEmailTemplateArray(basicWorkFlowData);

    this.setTurnEmailTemplateArray(basicWorkFlowData);

    this.setTransferSMSTemplateArray(basicWorkFlowData);

    this.setRequeuedSMSTemplateArray(basicWorkFlowData);

    this.setSurveySmsTemplateArray(basicWorkFlowData);

    this.setTransferEmailTemplateArray(basicWorkFlowData);

    this.setRequeuedEmailTemplateArray(basicWorkFlowData);

    this.setSurveyEmailTemplateArray(basicWorkFlowData);

    this.setAtLineSMSTemplateArray(basicWorkFlowData);

    this.setAtLineEmailTemplateArray(basicWorkFlowData);
  }

  setAtLineSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.SmsAtPositionFormArray.clear();
    if (Array.isArray(basicWorkFlowData.smsAtPositionTemplate)) {
      basicWorkFlowData.smsAtPositionTemplate.forEach((element) => {
        const form = this.formBuilder.group({
          enableSendSmsWhenCustomerIsAtLine: [
            element.enableSendSmsWhenCustomerIsAtLine,
          ],
          sendSmsWhenCustomerIsAtLineTemplate: this.formBuilder.array([]),
          sendSmsWhenCustomerIsAtLine: [
            element.sendSmsWhenCustomerIsAtLine
              ? element.sendSmsWhenCustomerIsAtLine
              : 1,
          ],
        });
        this.AddDataInSMSAtLineTemplateArray(form, element);
        this.SmsAtPositionFormArray.push(form);
      });
    }
  }

  setAtLineEmailTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.EmailAtPositionFormArray.clear();
    if (Array.isArray(basicWorkFlowData.emailAtPositionTemplate)) {
      basicWorkFlowData.emailAtPositionTemplate.forEach((element) => {
        const form = this.formBuilder.group({
          sendEmailWhenCustomerIsAtLine: [
            element.sendEmailWhenCustomerIsAtLine,
          ],
          enableSendEmailWhenCustomerIsAtLine: [
            element.enableSendEmailWhenCustomerIsAtLine,
          ],
          sendEmailWhenCustomerIsAtLineTemplate: this.formBuilder.array([]),
        });
        this.AddDataInEmailAtLineTemplateArray(form, element);
        this.EmailAtPositionFormArray.push(form);
      });
    }
  }

  AddDataInEmailAtLineTemplateArray(
    form: FormGroup,
    element: IEmailAtPositionAndTemplate
  ) {
    this.setDefaultEmailAtLineTemplateArray(form);

    if (
      Array.isArray(element.sendEmailWhenCustomerIsAtLineTemplate) &&
      element.sendEmailWhenCustomerIsAtLineTemplate[0]
    ) {
      const fa = form.controls
        .sendEmailWhenCustomerIsAtLineTemplate as FormArray;
      this.setIndividualEmailAtLineTemplateArray(element, fa);
    }
  }

  AddDataInSMSAtLineTemplateArray(
    form: FormGroup,
    element: ISmsAtPositionAndTemplate
  ) {
    this.setDefaultSMSAtLineTemplateArray(form);

    if (
      Array.isArray(element.sendSmsWhenCustomerIsAtLineTemplate) &&
      element.sendSmsWhenCustomerIsAtLineTemplate[0]
    ) {
      const fa = form.controls.sendSmsWhenCustomerIsAtLineTemplate as FormArray;
      this.setIndividualSMSAtLineTemplateArray(element, fa);
    }
  }

  private setTurnSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendSmsAtYourTurnTemplate,
      this.SendSMSAtYourTurnTemplateArray,
      basicWorkFlowData.enableSendSmsAtYourTurn
    );
  }

  private setTurnEmailTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendEmailAtYourTurnTemplate,
      this.SendEmailAtYourTurnTemplateArray,
      basicWorkFlowData.enableSendEmailAtYourTurn
    );
  }

  private setCancelledSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendSmsWhenCancelledTemplate,
      this.SendSMSWhenCancelledTemplateArray,
      basicWorkFlowData.enableSendSmsWhenCancelled
    );
  }

  private setCancelledEmailTemplateArray(
    basicWorkFlowData: IBasicWorkFlowRules
  ) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendEmailWhenCancelledTemplate,
      this.SendEmailWhenCancelledTemplateArray,
      basicWorkFlowData.enableSendEmailWhenCancelled
    );
  }

  private setRegisterSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendRegistrationSmsTemplate,
      this.SendSMSRegistrationTemplateArray,
      basicWorkFlowData.enableSendRegistrationSms
    );
  }

  private setAutoReplySMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendAutoReplySmsTemplate,
      this.SendSMSAutoReplyTemplateArray,
      basicWorkFlowData.enableAutoReplySMS
    );
  }

  private setJoinQueueSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendJoinQueueSmsTemplate,
      this.SendSMSToJoinQueueTemplateArray,
      false
    );
  }

  private setRegisterEmailTemplateArray(
    basicWorkFlowData: IBasicWorkFlowRules
  ) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendRegistrationEmailTemplate,
      this.SendEmailRegistrationTemplateArray,
      basicWorkFlowData.enableSendRegistrationEmail
    );
  }

  private setSurveyEmailTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendEmailForSurveyTemplate,
      this.SendEmailForSurveyTemplateArray,
      basicWorkFlowData.enableSendEmailForSurvey
    );
  }

  private setSurveySmsTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendSmsForSurveyTemplate,
      this.SendSmsForSurveyTemplateArray,
      basicWorkFlowData.enableSendSmsForSurvey
    );
  }

  private setTransferEmailTemplateArray(
    basicWorkFlowData: IBasicWorkFlowRules
  ) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendEmailUponTransferTemplate,
      this.SendEmailUponTransferTemplateArray,
      basicWorkFlowData.enableSendEmailUponTransfer
    );
  }

  private setTransferSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendSmsUponTransferTemplate,
      this.SendSmsUponTransferTemplateArray,
      basicWorkFlowData.enableSendSmsUponTransfer
    );
  }

  private setRequeuedEmailTemplateArray(
    basicWorkFlowData: IBasicWorkFlowRules
  ) {
    this.setIndividualEmailTemplate(
      basicWorkFlowData.sendEmailWhenRequeuedTemplate,
      this.SendEmailWhenRequeuedTemplateArray,
      basicWorkFlowData.enableSendEmailWhenRequeued
    );
  }

  private setRequeuedSMSTemplateArray(basicWorkFlowData: IBasicWorkFlowRules) {
    this.setIndividualSMSTemplate(
      basicWorkFlowData.sendSmsWhenRequeuedTemplate,
      this.SendSmsWhenRequeuedTemplateArray,
      basicWorkFlowData.enableSendEmailWhenRequeued
    );
  }

  setIndividualSMSTemplate(
    languageTemplateArray: any[],
    formArray: FormArray,
    addValidation: boolean
  ) {
    if (
      languageTemplateArray &&
      Array.isArray(languageTemplateArray) &&
      languageTemplateArray[0]
    ) {
      languageTemplateArray.forEach((template: SendSmsTemplate) => {
        formArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageCode == template.languageCode) {
            form.controls.smsTemplate.setValue(template.smsTemplate);
            if (addValidation && addValidation === true) {
              form.controls.smsTemplate.setValidators(Validators.required);
              form.controls.smsTemplate.updateValueAndValidity();
            }
          }
        });
      });
    }
  }

  setIndividualEmailTemplate(
    languageTemplateArray: any[],
    formArray: FormArray,
    addValidation: boolean
  ) {
    if (
      languageTemplateArray &&
      Array.isArray(languageTemplateArray) &&
      languageTemplateArray[0]
    ) {
      languageTemplateArray.forEach((template: EmailTemplate) => {
        formArray.controls.forEach((form: FormGroup) => {
          if (form.value.languageCode == template.languageCode) {
            form.controls.emailTemplate.setValue(template.emailTemplate);
            form.controls.emailSubject.setValue(template.emailSubject);
            if (addValidation && addValidation === true) {
              form.controls.emailTemplate.setValidators(Validators.required);
              form.controls.emailSubject.setValidators(Validators.required);
              form.controls.emailTemplate.updateValueAndValidity();
              form.controls.emailSubject.updateValueAndValidity();
            }
          }
        });
      });
    }
  }

  private setIndividualEmailAtLineTemplateArray(
    element: IEmailAtPositionAndTemplate,
    fa: FormArray
  ) {
    if (Array.isArray(element.sendEmailWhenCustomerIsAtLineTemplate)) {
      element.sendEmailWhenCustomerIsAtLineTemplate.forEach(
        (emailTemplate: EmailTemplate) => {
          fa.controls.forEach((form: FormGroup) => {
            if (emailTemplate.languageCode == form.value.languageCode) {
              form.controls.emailTemplate.setValue(emailTemplate.emailTemplate);
              form.controls.emailSubject.setValue(emailTemplate.emailSubject);
              if (element.enableSendEmailWhenCustomerIsAtLine) {
                form.controls.emailTemplate.setValidators(Validators.required);
                form.controls.emailSubject.setValidators(Validators.required);
                form.controls.emailTemplate.updateValueAndValidity();
                form.controls.emailSubject.updateValueAndValidity();
              }
            }
          });
        }
      );
    }
  }

  private setIndividualSMSAtLineTemplateArray(
    element: ISmsAtPositionAndTemplate,
    fa: FormArray
  ) {
    if (Array.isArray(element.sendSmsWhenCustomerIsAtLineTemplate)) {
      element.sendSmsWhenCustomerIsAtLineTemplate.forEach(
        (smsTemplate: SendSmsTemplate) => {
          fa.controls.forEach((form: FormGroup) => {
            if (smsTemplate.languageCode == form.value.languageCode) {
              form.controls.smsTemplate.setValue(smsTemplate.smsTemplate);
              if (element.enableSendSmsWhenCustomerIsAtLine) {
                form.controls.smsTemplate.setValidators(Validators.required);
                form.controls.smsTemplate.updateValueAndValidity();
              }
            }
          });
        }
      );
    }
  }

  newSMSAndEmailAtPositionForm(ruleType: string) {
    if (ruleType === 'SMS') {
      const form = this.formBuilder.group({
        enableSendSmsWhenCustomerIsAtLine: [null],
        sendSmsWhenCustomerIsAtLineTemplate: this.formBuilder.array([]),
        sendSmsWhenCustomerIsAtLine: [1, Validators.required],
      });
      form.controls.sendSmsWhenCustomerIsAtLine.valueChanges.subscribe((x) => {
        if (x != '' && x <= 0) {
          form.controls.sendSmsWhenCustomerIsAtLine.setValue(1);
        }
      });
      this.setDefaultSMSAtLineTemplateArray(form);

      return form;
    } else {
      const form = this.formBuilder.group({
        enableSendEmailWhenCustomerIsAtLine: [null],
        sendEmailWhenCustomerIsAtLine: [1, Validators.required],
        sendEmailWhenCustomerIsAtLineTemplate: this.formBuilder.array([]),
      });
      form.controls.sendEmailWhenCustomerIsAtLine.valueChanges.subscribe(
        (x) => {
          if (x != '' && x <= 0) {
            form.controls.sendEmailWhenCustomerIsAtLine.setValue(1);
          }
        }
      );
      this.setDefaultEmailAtLineTemplateArray(form);

      return form;
    }
  }

  setDefaultSMSAtLineTemplateArray(form: FormGroup) {
    const smsArray = form.controls
      .sendSmsWhenCustomerIsAtLineTemplate as FormArray;
    smsArray.clear();
    this.supportedLanguages.forEach((x: SupportedLanguage) => {
      const smsForm = this.formBuilder.group({
        isDefault: [x.isDefault],
        language: [x.language],
        languageCode: [x.languageCode],
        smsTemplate: [null],
      });
      smsArray.push(smsForm);
    });
  }

  setDefaultEmailAtLineTemplateArray(form: FormGroup) {
    const emailArray = form.controls
      .sendEmailWhenCustomerIsAtLineTemplate as FormArray;
    emailArray.clear();

    this.supportedLanguages.forEach((x: SupportedLanguage) => {
      const emailForm = this.formBuilder.group({
        isDefault: [x.isDefault],
        language: [x.language],
        languageCode: [x.languageCode],
        emailTemplate: [null],
        emailSubject: [null],
      });
      emailArray.push(emailForm);
    });
  }

  InitBasicWorkFlowRules() {
    this.SmsAtPositionFormArray = this.formBuilder.array([]);

    this.EmailAtPositionFormArray = this.formBuilder.array([]);
    this.SendSMSRegistrationTemplateArray = this.formBuilder.array([]);
    this.SendSMSToJoinQueueTemplateArray = this.formBuilder.array([]);
    this.SendSMSAutoReplyTemplateArray = this.formBuilder.array([]);
    this.SendEmailRegistrationTemplateArray = this.formBuilder.array([]);

    this.SendSMSAtYourTurnTemplateArray = this.formBuilder.array([]);
    this.SendEmailAtYourTurnTemplateArray = this.formBuilder.array([]);

    this.SendSMSWhenCancelledTemplateArray = this.formBuilder.array([]);
    this.SendEmailWhenCancelledTemplateArray = this.formBuilder.array([]);

    this.SendSmsUponTransferTemplateArray = this.formBuilder.array([]);
    this.SendEmailUponTransferTemplateArray = this.formBuilder.array([]);

    this.SendSmsWhenRequeuedTemplateArray = this.formBuilder.array([]);
    this.SendEmailWhenRequeuedTemplateArray = this.formBuilder.array([]);

    this.SendSmsForSurveyTemplateArray = this.formBuilder.array([]);
    this.SendEmailForSurveyTemplateArray = this.formBuilder.array([]);

    this.BasicWorkflowRulesForm = this.formBuilder.group({
      enableSendRegistrationSms: [null],
      sendRegistrationSmsTemplate: this.SendSMSRegistrationTemplateArray,

      enableAutoReplySMS: [null],
      sendAutoReplySmsTemplate: this.SendSMSAutoReplyTemplateArray,

      enableTextToJoin: [true],
      sendJoinQueueSmsTemplate: this.SendSMSToJoinQueueTemplateArray,

      enableSendRegistrationEmail: [null],
      sendRegistrationEmailTemplate: this.SendEmailRegistrationTemplateArray,

      smsAtPositionTemplate: this.SmsAtPositionFormArray,
      emailAtPositionTemplate: this.EmailAtPositionFormArray,

      enableSendSmsAtYourTurn: [null],
      sendSmsAtYourTurnTemplate: this.SendSMSAtYourTurnTemplateArray,

      enableSendEmailAtYourTurn: [null],
      sendEmailAtYourTurnTemplate: this.SendEmailAtYourTurnTemplateArray,

      enableSendSmsWhenCancelled: [null],
      sendSmsWhenCancelledTemplate: this.SendSMSWhenCancelledTemplateArray,

      enableSendEmailWhenCancelled: [null],
      sendEmailWhenCancelledTemplate: this.SendEmailWhenCancelledTemplateArray,

      enableSendSmsUponTransfer: [null],
      sendSmsUponTransferTemplate: this.SendSmsUponTransferTemplateArray,

      enableSendEmailUponTransfer: [null],
      sendEmailUponTransferTemplate: this.SendEmailUponTransferTemplateArray,

      enableSendSmsWhenRequeued: [null],
      sendSmsWhenRequeuedTemplate: this.SendSmsWhenRequeuedTemplateArray,

      enableSendEmailWhenRequeued: [null],
      sendEmailWhenRequeuedTemplate: this.SendEmailWhenRequeuedTemplateArray,

      enableSendSmsForSurvey: [null],
      sendSmsForSurveyTemplate: this.SendSmsForSurveyTemplateArray,

      enableSendEmailForSurvey: [null],
      sendEmailForSurveyTemplate: this.SendEmailForSurveyTemplateArray,
    });

    if (this.Mode != Mode.Edit) {
      if (
        this.supportedLanguages &&
        Array.isArray(this.supportedLanguages) &&
        this.supportedLanguages[0]
      ) {
        this.setDefaultSMSAndEmailTemplateArrays();
        this.BasicWorkFlowDataSubject.next({
          supportedLanguages: this.supportedLanguages,
        });
      } else {
        this.subs.sink = this.SupportedLanguages$.subscribe((x) => {
          this.supportedLanguages = x;
          this.setDefaultSMSAndEmailTemplateArrays();
          this.BasicWorkFlowDataSubject.next({ supportedLanguages: x });
        });
      }
    }
  }

  setDefaultSMSAndEmailTemplateArrays() {
    this.clearAllTemplates();
    this.setAllDefaultTemplateArrays();
  }

  private clearAllTemplates() {
    this.SendSMSRegistrationTemplateArray.clear();
    this.SendSMSAutoReplyTemplateArray.clear();
    this.SendSMSToJoinQueueTemplateArray.clear();
    this.SendEmailRegistrationTemplateArray.clear();
    this.SendSMSAtYourTurnTemplateArray.clear();
    this.SendEmailAtYourTurnTemplateArray.clear();
    this.SendSMSWhenCancelledTemplateArray.clear();
    this.SendEmailWhenCancelledTemplateArray.clear();

    this.SendSmsUponTransferTemplateArray.clear();
    this.SendEmailUponTransferTemplateArray.clear();
    this.SendSmsWhenRequeuedTemplateArray.clear();
    this.SendEmailWhenRequeuedTemplateArray.clear();
    this.SendSmsForSurveyTemplateArray.clear();
    this.SendEmailForSurveyTemplateArray.clear();

    this.SmsAtPositionFormArray.clear();
    this.EmailAtPositionFormArray.clear();
  }

  AddDataInEmailTemplateArray(formArray: FormArray, template: EmailTemplate) {
    formArray.push(
      this.formBuilder.group({
        isDefault: [template.isDefault],
        language: [template.language],
        languageCode: [template.languageCode],
        emailTemplate: [template.emailTemplate],
        emailSubject: [template.emailSubject],
      })
    );
  }

  AddDataInSMSTemplateArray(formArray: FormArray, template: SendSmsTemplate) {
    formArray.push(
      this.formBuilder.group({
        isDefault: [template.isDefault],
        language: [template.language],
        languageCode: [template.languageCode],
        smsTemplate: [template.smsTemplate],
      })
    );
  }

  setDefaultEmailTemplateArray(formArray: FormArray) {
    formArray.clear();
    this.supportedLanguages.forEach((x: SupportedLanguage) => {
      this.AddDataInEmailTemplateArray(formArray, {
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        emailSubject: null,
        emailTemplate: null,
      });
    });
  }

  setDefaultSmsTemplateArray(formArray: FormArray) {
    formArray.clear();
    this.supportedLanguages.forEach((x: SupportedLanguage) => {
      this.AddDataInSMSTemplateArray(formArray, {
        language: x.language,
        languageCode: x.languageCode,
        isDefault: x.isDefault,
        smsTemplate: null,
      });
    });
  }

  SetGeneralSettingForm(generalSetting: IGeneralSetting) {
    this.GeneralWorkflowNameFormControl.clearAsyncValidators();
    this.GeneralSettingForm.patchValue(generalSetting);
    this.GeneralWorkflowNameFormControl.setAsyncValidators(
      this.WorkflowValidatorService.WorkflowNameAlreadyExistValidator(
        this.CompanyId,
        this.browserStorageService.WorkFlowId,
        generalSetting.name
      )
    );
  }

  InitGeneralSettingFormGroup() {
    this.GeneralSettingForm = this.formBuilder.group({
      id: [],
      name: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
          asyncValidators: [
            this.WorkflowValidatorService.WorkflowNameAlreadyExistValidator(
              this.CompanyId,
              this.browserStorageService.WorkFlowId,
              null
            ),
          ],
        },
      ],
      description: [null],
    });
  }

  public GetDefaultGeneralSettings() {
    return {
      id: null,
      name: null,
      description: null,
    };
  }

  InitSettingFormGroup() {
    this.SettingForm = this.formBuilder.group(
      {
        clearTicketsEndOfTheDay: [],
        allowTransferBetweenServices: [],
        allowTransferBetweenBranches: [],
        enablePreServiceQuestions: [],
        displayPreServiceQuestions: [],
        enableSingleNumberFormat: [],
        moveVisitorToFront: [false],
        singleNumberFormat: this.formBuilder.group({
          prefix: [],
          middlefix: [],
          postfix: [],
        }),
        enableMobileInterfaceRequeue: [],
        personMovementSettings: this.formBuilder.group({
          isEnabled: [],
          numberOfCalls: [1],
          numberOfPositionsBack: [1],
          mobilePositionOnRequeue: [1],
          numberOfRequeueCalls: [1],
        }),
        enableDeleteOnRequeue: [],
        ticketStart: [0],
        ticketEnd: [99],
      },
      { validator: this.CheckForZeroValidation }
    );

    this.WorkflowBehaviorValueChangeEvent();
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.GetRequestDocument(this.WorkFlow, true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            const TranslatedTexts = ConvertTranslatedLanguageArrayToObject(TranslateResponses);
            this.SetTextFormArray(TranslatedTexts);
          }
        });
    }
  }

  UpdateTranslatedTexts(translations, rangeId: number) {


    const controls: FormArray = this.EstimateWaitSettingsForm.get('customRangesForTimeDisplayMessages') as FormArray;
    const MappedTranslations: ITranslations[] = translations.map(translationControl => {
      const translation = translationControl.value;
      return {
        languageId: translation.languageCode,
        text: translation.text
      };
    });
    controls.controls[rangeId].get('messages').setValue(MappedTranslations);

    this.CloseTranslateDialog();
  }

  OpenTranslateDialogForEstimateWaitSettings(rangeId: number) {
    const SubjectValue = this.EstimateWaitSettingsSubject.value;
    const TranslatedTexts: ITranslations[] = SubjectValue.customRangesForTimeDisplayMessages[rangeId].messages;
    const ConvertedTexts = ConvertFormArrayToObject(TranslatedTexts);
    this.SetTextFormArray(ConvertedTexts);
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseTranslateDialog() {
    this.OpenTranslateDialogSubject.next(false);
  }

  private SetTextFormArray(text: object) {
    this.LabelTextFormArraySubject.next(this.formBuilder.array([]));
    if (this.SupportedLanguagesSubject.value) {
      this.SupportedLanguagesSubject.value.forEach(ele => {
        this.LabelTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: text[ele.languageCode] || ''
        }));
      });
    }
  }




  SetEstimatedWaitSettingForm(
    estimateWaitSettings: WorkflowEstimateWaitSettings
  ) {

    this.EstimateWaitSettingsSubject.next(estimateWaitSettings);
    const customRangesForTimeDisplayMessages = this.EstimateWaitSettingsForm.get('customRangesForTimeDisplayMessages') as FormArray;
    estimateWaitSettings?.customRangesForTimeDisplayMessages?.forEach(element => {
      customRangesForTimeDisplayMessages.controls.push(
        this.GetCustomRangesFormGroups(element)
      );
    });
    this.EstimateWaitSettingsForm.patchValue(estimateWaitSettings);
  }

  GetCustomRangesFormGroups(customRangesForTimeDisplayMessages: EstimateWaitTimeMessageRange): FormGroup {
    return this.formBuilder.group({
      from: customRangesForTimeDisplayMessages.from,
      to: customRangesForTimeDisplayMessages.to,
      messages: customRangesForTimeDisplayMessages.messages,
    });
  }


  InitEstimateWaitSettingsFormGroup() {
    this.EstimateWaitSettingsForm = this.formBuilder.group({
      allowCalculateEstimateWaitTime: false,
      isIncludeAppointmentsIntoConsiderations: false,
      defaultRange: 5,
      idleTimeBetweenServices: 5,
      customRangesForTimeDisplayMessages: this.formBuilder.array([])
    });
    this.EstimateWaitSettingsValueChangeEvent();
  }

  WaitTimeChanged(waitTime: number, serviceId: string) {
    const services = this.ServicesSubject.value;
    const service = services.find(x => x.id == serviceId);
    const serviceIndex = services.indexOf(service);
    service.averageWaitTime = waitTime;
    services[serviceIndex] = service;
    this.ServicesSubject.next(cloneObject(services));
  }

  private EstimateWaitSettingsValueChangeEvent() {
    // on main checkbox change
    this.subs.sink =
      this.EstimateWaitSettingsForm.controls.allowCalculateEstimateWaitTime.valueChanges.subscribe(
        (x) => {
          const waitSettings = this.EstimateWaitSettingsSubject.value;
          waitSettings.allowCalculateEstimateWaitTime = x == true;
          this.EstimateWaitSettingsSubject.next(cloneObject(waitSettings));
        }
      );

    // on appointment consideration change
    this.subs.sink =
      this.EstimateWaitSettingsForm.controls.isIncludeAppointmentsIntoConsiderations.valueChanges.subscribe(
        (x) => {
          const waitSettings = this.EstimateWaitSettingsSubject.value;
          waitSettings.isIncludeAppointmentsIntoConsiderations = x == true;
          this.EstimateWaitSettingsSubject.next(cloneObject(waitSettings));
        }
      );

    // on defaultRange change
    this.subs.sink =
      this.EstimateWaitSettingsForm.controls.defaultRange.valueChanges.subscribe(
        (x) => {
          const waitSettings = this.EstimateWaitSettingsSubject.value;
          waitSettings.defaultRange = x;
          this.EstimateWaitSettingsSubject.next(cloneObject(waitSettings));
        }
      );

    // on idleTimeBetweenServices change
    this.subs.sink =
      this.EstimateWaitSettingsForm.controls.idleTimeBetweenServices.valueChanges.subscribe(
        (x) => {
          const waitSettings = this.EstimateWaitSettingsSubject.value;
          waitSettings.idleTimeBetweenServices = x;
          this.EstimateWaitSettingsSubject.next(cloneObject(waitSettings));
        }
      );

    // on ranges change
    this.subs.sink =
      this.EstimateWaitSettingsForm.controls.customRangesForTimeDisplayMessages.valueChanges.subscribe(
        (x) => {
          const waitSettings = this.EstimateWaitSettingsSubject.value;
          waitSettings.customRangesForTimeDisplayMessages = x;
          this.EstimateWaitSettingsSubject.next(cloneObject(waitSettings));
        }
      );
  }

  private WorkflowBehaviorValueChangeEvent() {
    this.subs.sink =
      this.SettingForm.controls.enableSingleNumberFormat.valueChanges.subscribe(
        (x) => {
          const singleNumberFormat = this.SettingForm.controls
            .singleNumberFormat as FormGroup;
          if (x) {
            singleNumberFormat.controls.prefix.setValidators(
              Validators.required
            );
            singleNumberFormat.controls.prefix.updateValueAndValidity();
          } else {
            singleNumberFormat.controls.prefix.clearValidators();
            singleNumberFormat.controls.prefix.updateValueAndValidity();
          }
          this.SingleNumberingFormatEnabledSubject.next(!x);
        }
      );
    this.subs.sink = this.SettingForm.get(
      'personMovementSettings.numberOfCalls'
    ).valueChanges.subscribe((x) => {
      const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
      if (x != removedLeadingZeroFromNumberString) {
        this.SettingForm.get('personMovementSettings.numberOfCalls').setValue(
          removedLeadingZeroFromNumberString
        );
      }
    });

    this.subs.sink = this.SettingForm.get(
      'personMovementSettings.numberOfPositionsBack'
    ).valueChanges.subscribe((x) => {
      const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
      if (x != removedLeadingZeroFromNumberString) {
        this.SettingForm.get(
          'personMovementSettings.numberOfPositionsBack'
        ).setValue(removedLeadingZeroFromNumberString);
      }
    });

    this.subs.sink = this.SettingForm.get(
      'personMovementSettings.mobilePositionOnRequeue'
    ).valueChanges.subscribe((x) => {
      const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
      if (x != removedLeadingZeroFromNumberString) {
        this.SettingForm.get(
          'personMovementSettings.mobilePositionOnRequeue'
        ).setValue(removedLeadingZeroFromNumberString);
      }
    });

    this.subs.sink =
      this.SettingForm.controls.ticketStart.valueChanges.subscribe((x) => {
        if (x + '' != '0') {
          const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
          if (x != removedLeadingZeroFromNumberString) {
            this.SettingForm.controls.ticketStart.setValue(
              removedLeadingZeroFromNumberString
            );
          }
        }
      });
    this.subs.sink = this.SettingForm.get(
      'personMovementSettings.numberOfRequeueCalls'
    ).valueChanges.subscribe((x) => {
      const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
      if (x != removedLeadingZeroFromNumberString) {
        this.SettingForm.get('personMovementSettings.numberOfRequeueCalls').setValue(
          removedLeadingZeroFromNumberString
        );
      }
    });

    this.subs.sink = this.SettingForm.controls.ticketEnd.valueChanges.subscribe(
      (x) => {
        const removedLeadingZeroFromNumberString = this.checkLeadingZero(x);
        if (x != removedLeadingZeroFromNumberString) {
          this.SettingForm.controls.ticketEnd.setValue(
            removedLeadingZeroFromNumberString
          );
        }
        const singleNumberFormatGroup = this.SettingForm.controls
          .singleNumberFormat as FormGroup;
        singleNumberFormatGroup.controls.middlefix.setValue(
          this.GetMiddleFix()
        );
      }
    );
  }

  private checkLeadingZero(number: Number | string) {
    const x = '' + number;
    if (x) {
      const index = x?.indexOf('0', 0);
      if (index == 0) {
        number = x.replace(/^0+/, '');
      }
    }
    return number ? number : number + '0';
  }

  CheckForZeroValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    const personMovementControls = control.get(
      'personMovementSettings'
    ) as FormGroup;
    let errorData = null;
    if (personMovementControls.controls.isEnabled.value) {
      const numberOfCalls = personMovementControls.controls
        .numberOfCalls as FormControl;
      if (this.setErrorIfZeroOrLess(numberOfCalls)) {
        errorData = { isZeroValueError: true };
      }

      const numberOfPositionsBack = personMovementControls.controls
        .numberOfPositionsBack as FormControl;
      if (this.setErrorIfZeroOrLess(numberOfPositionsBack)) {
        errorData = { isZeroValueError: true };
      }

      const mobilePositionOnRequeue = personMovementControls.controls
        .mobilePositionOnRequeue as FormControl;
      if (this.setErrorIfZeroOrLess(mobilePositionOnRequeue)) {
        errorData = { isZeroValueError: true };
      }
      const numberOfRequeueCalls = personMovementControls.controls
        .numberOfRequeueCalls as FormControl;
      if (this.setErrorIfZeroOrLess(numberOfRequeueCalls)) {
        errorData = { isZeroValueError: true };
      }
    }

    const ticketEnd = control.controls.ticketEnd as FormControl;
    if (this.setErrorIfZeroOrLess(ticketEnd)) {
      errorData = { isZeroValueError: true };
    }
    return errorData;
  }

  private setErrorIfZeroOrLess(formControl: FormControl) {
    if (formControl && Number(formControl.value) <= 0) {
      formControl.setErrors({ isZeroValueError: true });
      formControl.markAsDirty();
      return true;
    }
    return false;
  }

  GetDefaultSettings() {
    const setting: Setting = {
      allowTransferBetweenBranches: null,
      allowTransferBetweenServices: null,
      clearTicketsEndOfTheDay: null,
      displayPreServiceQuestions: 'After',
      enablePreServiceQuestions: null,
      enableSingleNumberFormat: null,
      singleNumberFormat: {
        prefix: null,
        middlefix: this.GetMiddleFix(),
        postfix: null,
      },
      enableMobileInterfaceRequeue: null,
      personMovementSettings: {
        isEnabled: null,
        mobilePositionOnRequeue: 1,
        numberOfCalls: 1,
        numberOfPositionsBack: 1,
        numberOfRequeueCalls: 1,
      },
      enableDeleteOnRequeue: false,
      ticketStart: 0,
      ticketEnd: 99,
      moveVisitorToFront: false,
    };
    return setting;
  }

  private GetMiddleFix() {
    const endTicket = this.noOfDigitToTicketNumberingFormatPipe.transform(
      Number(this.EndTicketNo)
    );
    return endTicket;
  }

  SetSettingFormGroup(setting: Setting) {
    this.SettingForm.patchValue({
      clearTicketsEndOfTheDay: setting.clearTicketsEndOfTheDay,
      allowTransferBetweenServices: setting.allowTransferBetweenServices,
      allowTransferBetweenBranches: setting.allowTransferBetweenBranches,
      enablePreServiceQuestions: setting.enablePreServiceQuestions,
      displayPreServiceQuestions: setting.displayPreServiceQuestions,
      enableSingleNumberFormat: setting.enableSingleNumberFormat,
      singleNumberFormat: {
        prefix: setting.singleNumberFormat?.prefix,
        middlefix: this.GetMiddleFix(),
        postfix: setting.singleNumberFormat?.postfix,
      },
      enableMobileInterfaceRequeue: setting.enableMobileInterfaceRequeue,
      personMovementSettings: {
        isEnabled: setting.personMovementSettings.isEnabled,
        numberOfCalls: setting.personMovementSettings.numberOfCalls,
        numberOfPositionsBack:
          setting.personMovementSettings.numberOfPositionsBack,
        mobilePositionOnRequeue:
          setting.personMovementSettings.mobilePositionOnRequeue,
        numberOfRequeueCalls: (setting.personMovementSettings?.numberOfRequeueCalls || 1),
      },
      enableDeleteOnRequeue: (setting.enableDeleteOnRequeue || false),
      ticketStart: setting.ticketStart,
      ticketEnd: setting.ticketEnd,
      moveVisitorToFront: setting.moveVisitorToFront,
    });
  }

  SetPreviousSettingStateOncancel() {
    this.SetSettingFormGroup(this.setting);
  }

  Get(workFlowId: string): void {
    this.subs.sink = this.workflowAPIService
      .GetDrafted<IWorkFlowDetail>(this.CompanyId, workFlowId)
      .subscribe((response) => {
        this.OnGetApiResponse(response);
      });
  }

  OnGetApiResponse(workFlow: IWorkFlowDetail) {
    this.WorkFlow = workFlow;
    if (!workFlow) {
      return;
    }
    this.WorkFlowNameFormControl.setValue(workFlow.name);

    this.GetMobileInterfaceList();
    if (workFlow.queues) {
      this.QueuesSubject.next(workFlow.queues);
      this.PushQueueAndQuestionSetInRoutingSubject();
    }
    if (workFlow.appointmentTemplates) {
      this.AppointTemplateListSubject.next(workFlow.appointmentTemplates);
    }

    if (workFlow.preServiceQuestions) {
      this.PreServiceQuestionsSubject.next(workFlow.preServiceQuestions);
    }
    if (workFlow.services) {
      this.ServicesSubject.next(workFlow.services);
    }

    if (workFlow.estimateWaitSettings) {
      this.EstimateWaitSettingsSubject.next(workFlow.estimateWaitSettings);
    }
    if (workFlow.groups) {
      this.GroupsSubject.next(workFlow.groups);
    }
    if (workFlow.questionSets) {
      this.QuestionSetsSubject.next(workFlow.questionSets);
      const conditionQuestionset: ConditionalQuestionSet[] = [];
      workFlow.questionSets.forEach((x) => {
        conditionQuestionset.push({
          id: x.id,
          questionSetName: x.questionSetName,
        });
      });
      this.ConditionalQuestionSetsSubject.next(conditionQuestionset);
      this.PushQueueAndQuestionSetInRoutingSubject();
    }

    if (workFlow.surveyQuestions && workFlow.surveyQuestions.length) {
      const surveys = []
      const unsetSurvey = {
        id: '',
        questionSetName: '',
        questions: [],
        isDeleted: true
      }
      surveys.push(unsetSurvey);
      for (let index = 0; index < workFlow.surveyQuestions.length; index++) {
        if (!workFlow.surveyQuestions[index].isDeleted) {
          surveys.push(workFlow.surveyQuestions[index])
        }
      }
      this.SurveyQuestionSetsSubject.next(surveys);
    }
    this.GetVariables();
    if (workFlow.setting) {
      this.setting = workFlow.setting;
      this.SetSettingFormGroup(workFlow.setting);
    }

    if (workFlow.advanceRules) {
      this.AdvanceWorkflowListSubject.next(workFlow.advanceRules);
    }
    if (workFlow.basicWorkflowRules) {
      this.SetBasicWorkflowData(this.CompanyId, workFlow.basicWorkflowRules);
    }
    if (workFlow.generalSetting) {
      this.SetGeneralSettingForm(workFlow.generalSetting);
    }
    if (workFlow.estimateWaitSettings) {
      this.SetEstimatedWaitSettingForm(workFlow.estimateWaitSettings);
    }
  }

  GetMobileInterfaceList() {
    this.mobileApiService.GetDropdownList(this.authService.CompanyId).subscribe((x: ILayoutTemplate[]) => {
      this.MobileList = x?.filter(x => x.workFlowId == this.WorkFlow?.workFlowId).map<IMobileDropdown>(x => {
        return {
          id: x.templateId,
          name: x.templateName
        };
      });
    });
  }

  CreateAsDraft(request: IWorkFlowRequest): Observable<IWorkFlowDetail> {
    this.isAdditionalLanguageInvalid = true;
    return this.workflowAPIService.SaveAsDraft(this.CompanyId, request);
  }

  create(request: IWorkFlowRequest): Observable<IWorkFlowDetail> {
    this.isAdditionalLanguageInvalid = true;
    return this.workflowAPIService.Save(this.CompanyId, request);
  }

  SetBasicWorkflowData(
    CompanyId: string,
    basicWorkflowRules: IBasicWorkFlowRules
  ) {
    this.loadingService.showLoading();
    this.subs.sink = this.companyAPIService
      .GetLanguages<SupportedLanguage>(this.authService.CompanyId, false)
      .subscribe((response) => {
        if (response.length <= 1) {
          this.IsAdditionalLanguageAvailable = false;
        }
        this.SupportedLanguagesSubject.next(response);
        this.SetBasicWorkFlowRules(basicWorkflowRules);

        this.BasicWorkFlowDataSubject.next({
          supportedLanguages: response,
          basicWorkflowData: basicWorkflowRules,
        });
        this.loadingService.hideLoading();
      });
  }
  GetSupportedLanguages(companyId: string): void {
    this.subs.sink = this.companyAPIService
      .GetLanguages<SupportedLanguage>(this.authService.CompanyId)
      .subscribe((response) => {
        if (response.length <= 1) {
          this.IsAdditionalLanguageAvailable = false;
        }
        this.SupportedLanguagesSubject.next(response);
      });
  }

  GetVariables() {
    this.GetAlertConditionalVariables().subscribe((x) => {
      this.AlertConditionalListSubject.next(cloneObject(x));
    });

    this.subs.sink = this.GetConditionalRoutingVariables().subscribe((x) => {
      this.ConditionalListSubject.next(cloneObject(x));
    });

    this.GetDynamicVariables().subscribe((x) => {
      this.DynamicVariablesListSubject.next(cloneObject(x));
    });
  }

  GetEventConditionalVariables(questionSetId?: string) {
    return this.dynamicVariablesService.GetEventVariables(
      {
        preServiceQuestions: this.PreServiceQuestionsSubject?.value,
        questionSets: this.QuestionSetsSubject?.value,
      },
      questionSetId,
      true
    );
  }

  GetDynamicVariables(isAppointment?: boolean) {
    return this.dynamicVariablesService.GetDynamicVariables(
      {
        preServiceQuestions: this.PreServiceQuestionsSubject?.value,
        questionSets: this.QuestionSetsSubject?.value,
      },
      true,
      isAppointment
    );
  }

  GetConditionalRoutingVariables(questionSetId?: string) {
    return this.dynamicVariablesService.GetConditionalVariables(
      {
        preServiceQuestions: this.PreServiceQuestionsSubject?.value,
        questionSets: this.QuestionSetsSubject?.value,
      },
      questionSetId,
      true
    );
  }

  GetAlertConditionalVariables() {
    return this.dynamicVariablesService.GetAlertVariables(
      {
        preServiceQuestions: this.PreServiceQuestionsSubject?.value,
        questionSets: this.QuestionSetsSubject?.value,
      },
      true
    );
  }

  AddQueue(queue: RequestQueue) {
    this.QueuesSubject.value.push(queue);
    this.QueuesSubject.next(cloneObject(this.QueuesSubject.value));
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  AddAppointTemplate(appointmentTemplate: AppointmentTemplate) {
    appointmentTemplate.noOfPeopleInTimeSlot = this.convertToNumber(
      appointmentTemplate.noOfPeopleInTimeSlot
    );
    appointmentTemplate.durationOfEachTimeSlotInMinutes = this.convertToNumber(
      appointmentTemplate.durationOfEachTimeSlotInMinutes
    );
    appointmentTemplate.bookInBefore = this.convertToNumber(
      appointmentTemplate.bookInBefore
    );
    appointmentTemplate.bookInAdvance = this.convertToNumber(
      appointmentTemplate.bookInAdvance
    );
    appointmentTemplate.earlyCheckInMinutes = this.convertToNumber(
      appointmentTemplate.earlyCheckInMinutes
    );
    appointmentTemplate.lateCheckInMinutes = this.convertToNumber(
      appointmentTemplate.lateCheckInMinutes
    );
    this.AppointTemplateListSubject.value.push(appointmentTemplate);
    this.AppointTemplateListSubject.next(
      cloneObject(this.AppointTemplateListSubject.value)
    );
  }

  EditQueue(queue: RequestQueue) {
    const editQueueIndex = this.QueuesSubject.value.findIndex(
      (que) => que.id === queue.id
    );
    this.QueuesSubject.value[editQueueIndex] = queue;
    this.QueuesSubject.next(cloneObject(this.QueuesSubject.value));

    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  EditAppointmentTemplate(appointmentTemplate: AppointmentTemplate) {
    const appointmentTemplateIndex =
      this.AppointTemplateListSubject.value.findIndex(
        (que) => que.id === appointmentTemplate.id
      );

    appointmentTemplate.noOfPeopleInTimeSlot = this.convertToNumber(
      appointmentTemplate.noOfPeopleInTimeSlot
    );
    appointmentTemplate.durationOfEachTimeSlotInMinutes = this.convertToNumber(
      appointmentTemplate.durationOfEachTimeSlotInMinutes
    );
    appointmentTemplate.bookInBefore = this.convertToNumber(
      appointmentTemplate.bookInBefore
    );
    appointmentTemplate.bookInAdvance = this.convertToNumber(
      appointmentTemplate.bookInAdvance
    );
    appointmentTemplate.earlyCheckInMinutes = this.convertToNumber(
      appointmentTemplate.earlyCheckInMinutes
    );
    appointmentTemplate.lateCheckInMinutes = this.convertToNumber(
      appointmentTemplate.lateCheckInMinutes
    );
    this.AppointTemplateListSubject.value[appointmentTemplateIndex] =
      appointmentTemplate;
    this.AppointTemplateListSubject.next(
      cloneObject(this.AppointTemplateListSubject.value)
    );
  }

  DeleteQueue(id: string) {
    const data = this.QueuesSubject.value;
    data.forEach((x, index) => {
      if (id == x.id) {
        x.isDeleted = true;
      }
    });
    this.QueuesSubject.next(cloneObject(data));
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  DeleteAppointmentTemplate(id: string) {
    const templateName = this.AppointTemplateListSubject.value.find(
      (x) => x.id == id
    )?.templateName;
    let isAlreadyInUse = false;
    let serviceName = '';
    this.ServicesSubject.value.forEach((x) => {
      if (
        id === x.appointmentTemplate?.id &&
        !x.isDeleted &&
        x.acceptAppointments
      ) {
        isAlreadyInUse = true;
        serviceName = x.serviceNames.find((x) => x.isDefault).serviceName;
      }
    });
    if (!isAlreadyInUse) {
      if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        const data = this.AppointTemplateListSubject.value;
        data.forEach((x, index) => {
          if (id == x.id) {
            x.isDeleted = true;
          }
        });
        this.AppointTemplateListSubject.next(
          cloneObject(this.AppointTemplateListSubject.value)
        );
      }
    } else {
      this.appNotificationService.NotifyError(
        'Template already in use with service : ' + serviceName
      );
    }
  }

  AddService(service: ServiceRequest) {
    this.serviceIcons.push({
      serviceId: service.id,
      serviceIcons: service.serviceIconUrls,
    });
    this.ServicesSubject.value.push(service);
    this.ServicesSubject.next(cloneObject(this.ServicesSubject.value));
    this.loadingService.hideLoading();
  }

  UploadServiceIconApis(services: ServiceRequest[]) {
    const ImageApis = [];
    services?.forEach((service) => {
      const serviceIconUrls = this.serviceIcons?.find(
        (x) => x.serviceId == service.id
      )?.serviceIcons;

      serviceIconUrls?.forEach((serviceIcon) => {
        const imageServiceIcon: any = serviceIcon[serviceIcon.languageId];
        if (imageServiceIcon && imageServiceIcon.name) {
          ImageApis.push(this.formService.GetImageUrl(imageServiceIcon));
        }
      });
    });
    services?.forEach((service) => {
      service?.serviceIconUrls?.forEach((icons) => {
        icons[icons.languageId] = '';
      });
    });

    return ImageApis;
  }

  async EditService(service: ServiceRequest, serviceIcons?: any[]) {
    const editIconIndex = serviceIcons.findIndex(
      (x) => x.serviceId == service.id
    );
    if (editIconIndex < 0) {
      serviceIcons.push({
        serviceId: service.id,
        serviceIcons: service.serviceIconUrls,
      });
    } else {
      serviceIcons[editIconIndex] = {
        serviceId: service.id,
        serviceIcons: service.serviceIconUrls,
      };
    }

    const editServiceIndex = this.ServicesSubject.value.findIndex(
      (que) => que.id === service.id
    );
    this.ServicesSubject.value[editServiceIndex] = service;
    this.ServicesSubject.next(cloneObject(this.ServicesSubject.value));
    this.loadingService.hideLoading();
  }

  DeleteService(id: string) {
    this.subs.sink = this.workflowAPIService.GetBranchWorkflow(this.WorkFlow.companyId, this.WorkFlow.workFlowId).subscribe(x => {
      this.workflowUsedInBranchSubject.next(x);
      const branchWorkflow = this.workflowUsedInBranchSubject.value?.find(x => !x.isAllServices);
      const IsServiceInUse = branchWorkflow?.serviceIds?.find(x => x == id);

      if (IsServiceInUse) {
        this.appNotificationService.NotifyError(WorkflowMessages.ServiceUseByBranch);
        return;
      }
      if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        const data = this.ServicesSubject.value;
        data.forEach((x, index) => {
          if (x.id == id) {
            x.isDeleted = true;
          }
        });

        this.serviceIcons.forEach((x, index) => {
          if (x.serviceId == id) {
            this.serviceIcons.splice(index, 1);
          }
        });
        this.ServicesSubject.next(cloneObject(this.ServicesSubject.value));
      }
    });

  }

  AddGroup(group: GroupRequest) {
    this.GroupsSubject.value.push(group);
    this.GroupsSubject.next(cloneObject(this.GroupsSubject.value));
  }

  EditGroup(group: GroupRequest) {
    const editGroupIndex = this.GroupsSubject.value.findIndex(
      (que) => que.id === group.id
    );
    this.GroupsSubject.value[editGroupIndex] = group;
    this.GroupsSubject.next(cloneObject(this.GroupsSubject.value));
  }

  DeleteGroup(id: string) {
    const data = this.GroupsSubject.value;
    data.forEach((x, index) => {
      if (x.id == id) {
        x.isDeleted = true;
      }
    });
    this.GroupsSubject.next(cloneObject(data));
  }

  AddQuestionSet(questionSet: QuestionSetRequest) {
    this.QuestionSetsSubject.value.push(questionSet);
    this.QuestionSetsSubject.next(cloneObject(this.QuestionSetsSubject.value));
    let conditionQuestionSet: ConditionalQuestionSet;
    conditionQuestionSet = {
      id: questionSet.id,
      questionSetName: questionSet.questionSetName,
    };
    this.ConditionalQuestionSetsSubject.value.push(conditionQuestionSet);
    this.ConditionalQuestionSetsSubject.next(
      cloneObject(this.ConditionalQuestionSetsSubject.value)
    );
    this.AddEditQuestionSetForm.controls.id.reset();
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  EditQuestionSet(questionSet: QuestionSetRequest) {
    const editQuestionSetIndex = this.QuestionSetsSubject.value.findIndex(
      (que) => que.id === questionSet.id
    );
    this.QuestionSetsSubject.value[editQuestionSetIndex] = questionSet;

    const editconditionalQuestionIndex =
      this.ConditionalQuestionSetsSubject.value.findIndex(
        (ques) => ques.id == questionSet.id
      );
    this.ConditionalQuestionSetsSubject.value[editconditionalQuestionIndex] = {
      id: questionSet.id,
      questionSetName: questionSet.questionSetName,
    };

    this.QuestionSetsSubject.next(cloneObject(this.QuestionSetsSubject.value));
    this.ConditionalQuestionSetsSubject.next(
      cloneObject(this.ConditionalQuestionSetsSubject.value)
    );
    this.AddEditQuestionSetForm.controls.id.reset();
    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  DeleteQuestionSet(id: string) {
    const data = this.QuestionSetsSubject.value;
    data.forEach((x, index) => {
      if (id == x.id) {
        x.isDeleted = true;
      }
    });
    this.QuestionSetsSubject.next(cloneObject(this.QuestionSetsSubject.value));

    const conditionalQsData = this.ConditionalQuestionSetsSubject.value;
    conditionalQsData.forEach((x, index) => {
      if (id == x.id) {
        this.ConditionalQuestionSetsSubject.value.splice(index, 1);
      }
    });
    this.ConditionalQuestionSetsSubject.next(
      cloneObject(this.ConditionalQuestionSetsSubject.value)
    );

    this.PushQueueAndQuestionSetInRoutingSubject();
  }

  AddSurveyQuestionSet(questionSet: SurveyQuestionSet) {
    this.SurveyQuestionSetsSubject.value.push(questionSet);
    this.SurveyQuestionSetsSubject.next(cloneObject(this.SurveyQuestionSetsSubject.value));
    this.AddEditSurveyQuestionSetForm.controls.id.reset();
  }

  EditSurveyQuestionSet(questionSet: any) {
    const editQuestionSetIndex = this.SurveyQuestionSetsSubject.value.findIndex(
      (que) => que.id === questionSet.id
    );
    for (let index = 0; index < this.ServicesSubject.value.length; index++) {
      if (this.ServicesSubject.value[index].surveyTemplate && this.ServicesSubject.value[index].surveyTemplate.id === questionSet.id) {
        this.ServicesSubject.value[index].surveyTemplate = questionSet;
        this.ServicesSubject.next(cloneObject(this.ServicesSubject.value));
      }
    }

    this.SurveyQuestionSetsSubject.value[editQuestionSetIndex] = questionSet;

    this.SurveyQuestionSetsSubject.next(cloneObject(this.SurveyQuestionSetsSubject.value));

    this.AddEditSurveyQuestionSetForm.controls.id.reset();
  }

  DeleteSurveyQuestionSet(id: string) {
    const data = this.SurveyQuestionSetsSubject.value;
    data.forEach((x, index) => {
      if (id == x.id) {
        x.isDeleted = true;
      }
    });
    this.SurveyQuestionSetsSubject.next(cloneObject(this.SurveyQuestionSetsSubject.value));
  }

  InitAddEditQuestionSetForm() {
    return (this.AddEditQuestionSetForm = this.formBuilder.group({
      id: [],
      routing: [null],
      questionSetName: [null],
      conditionRouting: this.formBuilder.group({
        id: [],
        name: [null, Validators.required],
        isConditionalRouting: [false],
        condition: [],
        routing: [],
        actionType: [],
        color: [],
        actions: this.formBuilder.array([]),
      }),
    }));
  }

  InitAddEditSurveyQuestionSetForm() {
    return (this.AddEditSurveyQuestionSetForm = this.formBuilder.group({
      id: [],
      questionSetName: [null],
    }));
  }

  public PushQueueAndQuestionSetInRoutingSubject(questionSetId?: string) {
    const routings = [];
    this.QueuesSubject.value.forEach((queue) => {
      if (!queue.isDeleted) {
        routings.push({
          id: queue.id,
          type: queue.name,
          group: RoutingType.Queue,
        });
      }
    });
    const referredByIds = [];
    let questionSetData: QuestionSet;

    if (questionSetId) {
      questionSetData = this.QuestionSetsSubject.value.find(
        (x) => x.id == questionSetId
      );
    }
    this.QuestionSetsSubject.value.forEach((questionSet) => {
      // this is to remove the self routing and deadlock routing
      if (!questionSet.isDeleted) {
        if (questionSetData) {
          if (questionSetData?.id != questionSet.id) {
            if (questionSetData?.id != questionSet?.routing?.id) {
              if (
                !referredByIds.some((x) => x.id == questionSet?.routing?.id)
              ) {
                routings.push({
                  id: questionSet.id,
                  type: questionSet.questionSetName,
                  group: RoutingType.Questions,
                });
              } else {
                referredByIds.push(questionSet);
              }
            } else {
              referredByIds.push(questionSet);
            }
          }
        } else {
          if (
            this.AddEditQuestionSetForm?.controls.id.value != questionSet.id
          ) {
            if (
              !this.AddEditQuestionSetForm?.controls.id.value ||
              this.AddEditQuestionSetForm?.controls.id.value !=
              questionSet?.routing?.id
            ) {
              if (
                !referredByIds.some((x) => x.id == questionSet?.routing?.id)
              ) {
                routings.push({
                  id: questionSet.id,
                  type: questionSet.questionSetName,
                  group: RoutingType.Questions,
                });
              } else {
                referredByIds.push(questionSet);
              }
            } else {
              referredByIds.push(questionSet);
            }
          }
        }
      }
    });
    const groupResults: GroupResult[] = groupBy(routings, [{ field: 'group' }]);
    this.RoutingsSubject.next(cloneObject(groupResults));
  }

  AddPreQuestion(preServiceQuestion: RequestPreServiceQuestion) {
    this.GetQuestionType(preServiceQuestion);
    this.PreServiceQuestionsSubject.value.push(preServiceQuestion);
    this.PreServiceQuestionsSubject.next(
      cloneObject(this.PreServiceQuestionsSubject.value)
    );
  }

  private GetQuestionType(preServiceQuestion: RequestPreServiceQuestion) {
    if (typeof preServiceQuestion.type === 'object') {
      let dummyType: any;
      dummyType = preServiceQuestion.type;
      preServiceQuestion.type = dummyType.value;
    }
  }

  EditPreQuestion(preServiceQuestion: RequestPreServiceQuestion) {
    this.GetQuestionType(preServiceQuestion);
    const editPreServiceQuestionIndex =
      this.PreServiceQuestionsSubject.value.findIndex(
        (que) => que.id === preServiceQuestion.id
      );
    this.PreServiceQuestionsSubject.value[editPreServiceQuestionIndex] =
      preServiceQuestion;
    this.PreServiceQuestionsSubject.next(
      cloneObject(this.PreServiceQuestionsSubject.value)
    );
  }

  DeletePreQuestion(id: string) {
    if (!this.HandleIfQuestionOrEventUsedInAdvancedWorkflow(id)) {
      if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
        const data = this.PreServiceQuestionsSubject.value;
        data.forEach((x, index) => {
          if (x.id == id) {
            x.isDeleted = true;
          }
        });
        this.PreServiceQuestionsSubject.next(
          cloneObject(this.PreServiceQuestionsSubject.value)
        );
      }

    }
    else {
      return this.appNotificationService.NotifyError(WorkflowMessages.QuestionSetAlreadyUse);
    }
  }

  SaveSetting(setting) {
    this.setting = setting;
    this.IsPreServiceQuestionVisibleSubject.next(
      this.setting.enablePreServiceQuestions
    );
    this.SingleNumberingFormatEnabledSubject.next(
      this.setting.enableSingleNumberFormat
    );
  }

  SaveAsDraft() {
    if (this.GeneralSettingForm.controls.name.invalid) {
      this.formService.ValidateAllFormFields(this.GeneralSettingForm);
      if (this.GeneralSettingForm.controls.name.errors.required) {
        this.appNotificationService.NotifyError(
          WorkflowMessages.workflowNameMessage
        );
        this.NavigateTOWorkflowDescription();
        return;
      }

      if (this.GeneralSettingForm.controls.name.errors.isExists) {
        this.appNotificationService.NotifyError(
          WorkflowMessages.WorkflowNameAlreadyExistMessage
        );
        this.NavigateTOWorkflowDescription();
        return;
      }
      return;
    }
    this.isAdditionalLanguageInvalid = true;

    // this.SingleNumberFormatEnabledClearQueueNumberingRuleFormat();
    if (this.Mode === Mode.Add) {
      this.AddWorkFlowAsDraft();
    } else {
      this.EditWorkFlowDraft();
    }
  }

  private AddWorkFlowAsDraft() {
    this.DeleteEmptySurveys();
    const request: IWorkFlowRequest = {
      basicWorkflowRules: this.BasicWorkflowRulesForm.value,
      generalSetting: this.GeneralSettingForm.value,
      companyId: this.CompanyId,
      isPublished: false,
      name: this.GeneralSettingForm.value
        ? this.GeneralSettingForm.value.name.trim()
        : null,
      preServiceQuestions: getArrayValueIfNotEmptyElseNull(
        this.PreServiceQuestionsSubject.value
      ),
      questionSets: getArrayValueIfNotEmptyElseNull(
        this.QuestionSetsSubject.value
      ),
      surveyQuestions: getArrayValueIfNotEmptyElseNull(
        this.SurveyQuestionSetsSubject.value
      ),
      queues: getArrayValueIfNotEmptyElseNull(this.QueuesSubject.value),
      services: getArrayValueIfNotEmptyElseNull(this.ServicesSubject.value),
      groups: getArrayValueIfNotEmptyElseNull(this.GroupsSubject.value),
      setting: this.SettingForm.value,
      appointmentTemplates: getArrayValueIfNotEmptyElseNull(
        this.AppointTemplateListSubject.value
      ),

      advanceRules: getArrayValueIfNotEmptyElseNull(
        this.AdvanceWorkflowListSubject.value
      ),
      workFlowId: this.browserStorageService.WorkFlowId || this.uuid,
      estimateWaitSettings: this.EstimateWaitSettingsSubject.value,
    };

    this.convertRequireWorkflowDataInNumber(request);

    const ImageApis = this.UploadServiceIconApis(request.services);

    if (ImageApis && ImageApis[0]) {
      this.formService
        .CombineAPICall(ImageApis)
        .subscribe((imageUrls: string[]) => {
          let index = 0;
          request.services.forEach((service) => {
            const serviceIconUrls = this.serviceIcons?.find(
              (x) => x.serviceId == service.id
            )?.serviceIcons;
            if (serviceIconUrls) {
              service.serviceIconUrls.forEach((serviceIcon) => {
                const icontobeUploaded = serviceIconUrls?.find(
                  (x) => x.languageId == serviceIcon.languageId
                );
                const imageServiceIcon: any =
                  icontobeUploaded[serviceIcon.languageId];
                if (imageServiceIcon && imageServiceIcon.name) {
                  serviceIcon.url = imageUrls[index];
                  serviceIcon[serviceIcon.languageId] = imageUrls[index];
                  index = index + 1;
                }
              });
            }
          });
          this.serviceIcons = [];
          this.ApiCallToSaveWorkFlowDraft(request);
        });
    } else {
      this.ApiCallToSaveWorkFlowDraft(request);
    }
  }

  private EditWorkFlowDraft() {
    this.DeleteEmptySurveys();
    const request: IWorkFlowRequest = {
      companyId: this.CompanyId,
      isPublished: false,
      basicWorkflowRules: this.BasicWorkflowRulesForm.value,
      generalSetting: this.GeneralSettingForm.value,
      name: this.GeneralSettingForm.value
        ? this.GeneralSettingForm.value.name
        : null,
      preServiceQuestions: getArrayValueIfNotEmptyElseNull(
        this.PreServiceQuestionsSubject.value
      ),
      questionSets: getArrayValueIfNotEmptyElseNull(
        this.QuestionSetsSubject.value
      ),
      surveyQuestions: getArrayValueIfNotEmptyElseNull(
        this.SurveyQuestionSetsSubject.value
      ),
      queues: getArrayValueIfNotEmptyElseNull(this.QueuesSubject.value),
      services: getArrayValueIfNotEmptyElseNull(this.ServicesSubject.value),
      appointmentTemplates: getArrayValueIfNotEmptyElseNull(
        this.AppointTemplateListSubject.value
      ),

      advanceRules: getArrayValueIfNotEmptyElseNull(
        this.AdvanceWorkflowListSubject.value
      ),
      setting: this.SettingForm.value,
      workFlowId: this.WorkFlow.workFlowId,
      groups: getArrayValueIfNotEmptyElseNull(this.GroupsSubject.value),
      estimateWaitSettings: this.EstimateWaitSettingsSubject.value,
    };
    this.convertRequireWorkflowDataInNumber(request);
    const ImageApis = this.UploadServiceIconApis(request.services);

    if (ImageApis && ImageApis[0]) {
      this.formService
        .CombineAPICall(ImageApis)
        .subscribe((imageUrls: string[]) => {
          let index = 0;
          request.services.forEach((service) => {
            const serviceIconUrls = this.serviceIcons?.find(
              (x) => x.serviceId == service.id
            )?.serviceIcons;
            if (serviceIconUrls) {
              service.serviceIconUrls.forEach((serviceIcon) => {
                const icontobeUploaded = serviceIconUrls?.find(
                  (x) => x.languageId == serviceIcon.languageId
                );
                const imageServiceIcon: any =
                  icontobeUploaded[serviceIcon.languageId];
                if (imageServiceIcon && imageServiceIcon.name) {
                  serviceIcon.url = imageUrls[index];
                  serviceIcon[serviceIcon.languageId] = imageUrls[index];
                  index = index + 1;
                }
              });
            }
          });
          this.serviceIcons = [];
          this.ApiCallToSaveWorkFlowDraft(request);
        });
    } else {
      this.ApiCallToSaveWorkFlowDraft(request);
    }
  }
  private convertRequireWorkflowDataInNumber(request: IWorkFlowRequest) {
    request.appointmentTemplates &&
      request.appointmentTemplates.forEach((appointmentTemplate) => {
        appointmentTemplate.noOfPeopleInTimeSlot = this.convertToNumber(
          appointmentTemplate.noOfPeopleInTimeSlot
        );
        appointmentTemplate.durationOfEachTimeSlotInMinutes =
          this.convertToNumber(
            appointmentTemplate.durationOfEachTimeSlotInMinutes
          );
        appointmentTemplate.bookInBefore = this.convertToNumber(
          appointmentTemplate.bookInBefore
        );
        appointmentTemplate.bookInAdvance = this.convertToNumber(
          appointmentTemplate.bookInAdvance
        );
        appointmentTemplate.earlyCheckInMinutes = this.convertToNumber(
          appointmentTemplate.earlyCheckInMinutes
        );
        appointmentTemplate.lateCheckInMinutes = this.convertToNumber(
          appointmentTemplate.lateCheckInMinutes
        );
      });
    request.setting.ticketEnd = this.convertToNumber(request.setting.ticketEnd);
    request.setting.ticketStart = this.convertToNumber(
      request.setting.ticketStart
    );
    request.setting.personMovementSettings.mobilePositionOnRequeue =
      this.convertToNumber(
        request.setting.personMovementSettings.mobilePositionOnRequeue
      );
    request.setting.personMovementSettings.numberOfCalls = this.convertToNumber(
      request.setting.personMovementSettings.numberOfCalls
    );
    request.setting.personMovementSettings.numberOfPositionsBack =
      this.convertToNumber(
        request.setting.personMovementSettings.numberOfPositionsBack
      );
    request.setting.personMovementSettings.numberOfRequeueCalls = this.convertToNumber(
      request.setting.personMovementSettings.numberOfRequeueCalls
    );
  }

  convertToNumber(value) {
    if (value && !isNaN(value)) {
      return Number(value);
    }
    return 0;
  }
  // TODO: need to remove after workflow list implementation
  private SetWorkFlowIdInSession(response: IWorkFlowDetail) {
    if (response) {
      this.browserStorageService.SetWorkFlowId(response.workFlowId);
    }
  }

  private ApiCallToSaveWorkFlowDraft(request: IWorkFlowRequest) {
    this.subs.sink = this.CreateAsDraft(request).subscribe((response) => {
      this.SetWorkFlowIdInSession(response);
      this.NotifySaveAsDraft();
      this.isAdditionalLanguageInvalid = true;
      this.Cancel();
    });
  }

  private NotifySaveAsDraft() {
    this.appNotificationService.Notify(WorkflowMessages.SaveDraftMessage);
  }

  SaveAsPublish() {
    if (this.GeneralSettingForm.controls.name.invalid) {
      this.formService.ValidateAllFormFields(this.GeneralSettingForm);
      if (this.GeneralSettingForm.controls.name.errors.required) {
        this.appNotificationService.NotifyError(
          WorkflowMessages.workflowNameMessage
        );
        this.NavigateTOWorkflowDescription();
        return;
      }

      if (this.GeneralSettingForm.controls.name.errors.isExists) {
        this.appNotificationService.NotifyError(
          WorkflowMessages.WorkflowNameAlreadyExistMessage
        );
        this.NavigateTOWorkflowDescription();
        return;
      }
      return;
    }
    this.formService.ValidateAllFormFields(this.SettingForm);
    if (this.SettingForm.invalid) {
      const prefix = this.SettingForm.controls.singleNumberFormat.get('prefix');
      const postfix =
        this.SettingForm.controls.singleNumberFormat.get('postfix');

      if (prefix.invalid && postfix.invalid) {
        prefix.updateValueAndValidity();
        postfix.updateValueAndValidity();
      } else if (prefix.invalid) {
        prefix.updateValueAndValidity();
      } else if (postfix.invalid) {
        postfix.updateValueAndValidity();
      } else {
        this.appNotificationService.NotifyError(
          WorkflowMessages.valueGreaterThanZeroMessage
        );
        this.NavigateToWorkflowBehavior();
        return;
      }
    }
    if (this.SetValidationMessageAndCheckIsInValid()) {
      this.appNotificationService.NotifyError(this.WorkFlowValidationMessage);
      return;
    }
    if (this.Mode === Mode.Add) {
      this.AddWorkFlowAsPublish();
    } else {
      this.EditWorkFlowPublish();
    }
  }

  private SetValidationMessageAndCheckIsInValid() {
    this.WorkFlowValidationMessage = '';
    if (
      this.SettingForm &&
      this.SettingForm.controls.enableSingleNumberFormat.value &&
      !this.SettingForm.controls.singleNumberFormat.value.postfix &&
      !this.SettingForm.controls.singleNumberFormat.value.prefix
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.AddSingleNumberingRulesErrorMessage;
      this.NavigateToWorkflowBehavior();
      return true;
    }

    if (
      this.SettingForm &&
      this.SettingForm.controls.personMovementSettings.value.isEnabled &&
      Number(this.SettingForm.value.ticketStart) >
      Number(this.SettingForm.value.ticketEnd)
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.StartTicketNumberIsGreaterErrorMessage;
      this.NavigateToWorkflowBehavior();
      return true;
    }

    if (
      this.ServicesSubject.value.length === 0 ||
      !this.ServicesSubject?.value?.find((x) => !x.isDeleted)
    ) {
      this.WorkFlowValidationMessage = WorkflowMessages.AddServicesErrorMessage;
      this.NavigateToService();
      return true;
    }

    if (
      this.QueuesSubject.value.length === 0 ||
      !this.QueuesSubject?.value?.find((x) => !x.isDeleted)
    ) {
      this.WorkFlowValidationMessage = WorkflowMessages.AddQueuesErrorMessage;
      this.NavigateToQueue();
      return true;
    }

    if (
      this.SettingForm &&
      this.SettingForm.controls.enablePreServiceQuestions.value &&
      (this.PreServiceQuestionsSubject.value.length === 0 ||
        !this.PreServiceQuestionsSubject?.value?.find((x) => !x.isDeleted))
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.AddPreServiceQuestionsErrorMessage;
      this.NavigateToGlobalQuestion();
      return true;
    }

    if (
      this.ServicesSubject.value.some(
        (service) => !service.routing && !service.isDeleted
      )
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.ServicesMissingRoutingErrorMessage;
      this.NavigateToService();
      return true;
    }

    if (
      this.QuestionSetsSubject.value.some(
        (questionSet) => !questionSet.questions && !questionSet.isDeleted
      )
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.QuestionSetMissingQuestionsErrorMessage;
      this.NavigateToQuestionSet();
      return true;
    }

    if (
      this.QuestionSetsSubject.value.some(
        (questionSet) =>
          !questionSet.conditionRoutings && !questionSet.isDeleted
      )
    ) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.QuestionSetMissingConditionRoutingsErrorMessage;
      this.NavigateToQuestionSet();
      return true;
    }

    const IsEveryConditionRoutingHaveOneRoutingActionType =
      this.QuestionSetsSubject.value
        ?.filter((x) => !x.isDeleted)
        ?.every((questionSet) =>
          questionSet.conditionRoutings?.every((conditionRouting) =>
            conditionRouting.actions.some(
              (action) => action.actionType === ActionType.Routing
            )
          )
        );

    if (!IsEveryConditionRoutingHaveOneRoutingActionType) {
      this.WorkFlowValidationMessage =
        WorkflowMessages.ConditionRoutingMissingActionErrorMessage;
      return true;
    }

    this.formService
      .CallFormMethod<IBasicWorkFlowRules>(this.BasicWorkflowRulesForm, true)
      .catch((err) => {
        this.CheckAndSetLanguageOfBasicWorkflowRule();
        this.NavigateToBasicWorkflowRules();
      });
    this.BasicWorkflowRulesForm.updateValueAndValidity();
    if (this.BasicWorkflowRulesForm.invalid) {
      this.WorkFlowValidationMessage = WorkflowMessages.AddSMSTemplateMessage;
      this.NavigateToBasicWorkflowRules();
      return true;
    }
    return false;
  }

  public CheckAndSetLanguageOfBasicWorkflowRule() {
    this.isAdditionalLanguageInvalid = true;
    if (this.SendSMSRegistrationTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSMSRegistrationTemplateArray);
    }
    if (this.SendSMSToJoinQueueTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSMSToJoinQueueTemplateArray);
    }
    if (this.SendEmailRegistrationTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailRegistrationTemplateArray
      );
    }
    if (this.SendSMSAtYourTurnTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSMSAtYourTurnTemplateArray);
    }
    if (this.SendEmailAtYourTurnTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailAtYourTurnTemplateArray
      );
    }
    if (this.SendSMSWhenCancelledTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(
        this.SendSMSWhenCancelledTemplateArray
      );
    }
    if (this.SendEmailWhenCancelledTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailWhenCancelledTemplateArray
      );
    }
    if (this.SendSmsUponTransferTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSmsUponTransferTemplateArray);
    }
    if (this.SendEmailUponTransferTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailUponTransferTemplateArray
      );
    }
    if (this.SendSmsWhenRequeuedTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSmsWhenRequeuedTemplateArray);
    }
    if (this.SendEmailWhenRequeuedTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailWhenRequeuedTemplateArray
      );
    }
    if (this.SendSmsForSurveyTemplateArray.invalid) {
      this.CheckSMSTranslationValidation(this.SendSmsForSurveyTemplateArray);
    }
    if (this.SendEmailForSurveyTemplateArray.invalid) {
      this.CheckEmailsTranslationValidation(
        this.SendEmailForSurveyTemplateArray
      );
    }

    if (this.SmsAtPositionFormArray.invalid) {
      this.SmsAtPositionFormArray.controls.forEach((x: FormGroup) => {
        const faSMS = x.controls
          .sendSmsWhenCustomerIsAtLineTemplate as FormArray;
        this.CheckSMSTranslationValidation(faSMS);
      });
    }

    if (this.EmailAtPositionFormArray.invalid) {
      this.EmailAtPositionFormArray.controls.forEach((x: FormGroup) => {
        const faEmail = x.controls
          .sendEmailWhenCustomerIsAtLineTemplate as FormArray;
        this.CheckEmailsTranslationValidation(faEmail);
      });
    }
  }

  private CheckSMSTranslationValidation(formArray: FormArray) {
    formArray.controls.forEach((x: FormGroup) => {
      if (x.controls.isDefault.value !== true) {
        if (x.controls.smsTemplate.invalid) {
          formArray.setErrors({ invalidTranslation: true });
          this.isAdditionalLanguageInvalid = false;
        }
      }
    });
  }

  private CheckEmailsTranslationValidation(formArray: FormArray) {
    formArray.controls.forEach((x: FormGroup) => {
      if (x.controls.isDefault.value !== true) {
        if (
          x.controls.emailSubject.invalid ||
          x.controls.emailTemplate.invalid
        ) {
          formArray.setErrors({ invalidTranslation: true });
          this.isAdditionalLanguageInvalid = false;
        }
      }
    });
  }
  private AddWorkFlowAsPublish() {
    this.DeleteEmptySurveys();
    const request: IWorkFlowRequest = {
      basicWorkflowRules: this.BasicWorkflowRulesForm.value,
      generalSetting: this.GeneralSettingForm.value,
      companyId: this.CompanyId,
      isPublished: true,
      name: this.GeneralSettingForm.value
        ? this.GeneralSettingForm.value.name
        : null,
      preServiceQuestions: getArrayValueIfNotEmptyElseNull(
        this.PreServiceQuestionsSubject.value
      ),
      questionSets: getArrayValueIfNotEmptyElseNull(
        this.QuestionSetsSubject.value
      ),
      surveyQuestions: getArrayValueIfNotEmptyElseNull(
        this.SurveyQuestionSetsSubject.value
      ),
      queues: getArrayValueIfNotEmptyElseNull(this.QueuesSubject.value),
      services: getArrayValueIfNotEmptyElseNull(this.ServicesSubject.value),
      groups: getArrayValueIfNotEmptyElseNull(this.GroupsSubject.value),
      appointmentTemplates: getArrayValueIfNotEmptyElseNull(
        this.AppointTemplateListSubject.value
      ),

      advanceRules: getArrayValueIfNotEmptyElseNull(
        this.AdvanceWorkflowListSubject.value
      ),
      setting: this.SettingForm.value,
      workFlowId: this.browserStorageService.WorkFlowId || this.uuid,
      estimateWaitSettings: this.EstimateWaitSettingsSubject.value,
    };
    this.convertRequireWorkflowDataInNumber(request);

    const ImageApis = this.UploadServiceIconApis(request.services);

    if (ImageApis && ImageApis[0]) {
      this.formService
        .CombineAPICall(ImageApis)
        .subscribe((imageUrls: string[]) => {
          let index = 0;
          request.services.forEach((service) => {
            const serviceIconUrls = this.serviceIcons?.find(
              (x) => x.serviceId == service.id
            )?.serviceIcons;
            if (serviceIconUrls) {
              service.serviceIconUrls.forEach((serviceIcon) => {
                const icontobeUploaded = serviceIconUrls?.find(
                  (x) => x.languageId == serviceIcon.languageId
                );
                const imageServiceIcon: any =
                  icontobeUploaded[serviceIcon.languageId];
                if (imageServiceIcon && imageServiceIcon.name) {
                  serviceIcon.url = imageUrls[index];
                  serviceIcon[serviceIcon.languageId] = imageUrls[index];
                  index = index + 1;
                }
              });
            }
          });
          this.serviceIcons = [];
          this.ApiCallToSaveWorkflowAsPublish(request);
        });
    } else {
      this.ApiCallToSaveWorkflowAsPublish(request);
    }
  }

  private ApiCallToSaveWorkflowAsPublish(request: IWorkFlowRequest) {
    this.subs.sink = this.create(request).subscribe((response) => {
      this.SetWorkFlowIdInSession(response);
      this.NotifySaveAsPublish();
      this.Cancel();
    });
  }

  private EditWorkFlowPublish() {
    this.DeleteEmptySurveys();
    const request: IWorkFlowRequest = {
      companyId: this.CompanyId,
      isPublished: false,
      basicWorkflowRules: this.BasicWorkflowRulesForm.value,
      generalSetting: this.GeneralSettingForm.value,
      name: this.GeneralSettingForm.value
        ? this.GeneralSettingForm.value.name
        : null,
      preServiceQuestions: getArrayValueIfNotEmptyElseNull(
        this.PreServiceQuestionsSubject.value
      ),
      questionSets: getArrayValueIfNotEmptyElseNull(
        this.QuestionSetsSubject.value
      ),
      surveyQuestions: getArrayValueIfNotEmptyElseNull(
        this.SurveyQuestionSetsSubject.value
      ),
      queues: getArrayValueIfNotEmptyElseNull(this.QueuesSubject.value),
      services: getArrayValueIfNotEmptyElseNull(this.ServicesSubject.value),
      groups: getArrayValueIfNotEmptyElseNull(this.GroupsSubject.value),
      appointmentTemplates: getArrayValueIfNotEmptyElseNull(
        this.AppointTemplateListSubject.value
      ),

      advanceRules: getArrayValueIfNotEmptyElseNull(
        this.AdvanceWorkflowListSubject.value
      ),
      setting: this.SettingForm.value,
      workFlowId: this.WorkFlow.workFlowId,
      estimateWaitSettings: this.EstimateWaitSettingsSubject.value,
    };
    this.convertRequireWorkflowDataInNumber(request);

    const ImageApis = this.UploadServiceIconApis(request.services);

    if (ImageApis && ImageApis[0]) {
      this.formService
        .CombineAPICall(ImageApis)
        .subscribe((imageUrls: string[]) => {
          let index = 0;
          request.services.forEach((service) => {
            const serviceIconUrls = this.serviceIcons?.find(
              (x) => x.serviceId == service.id
            )?.serviceIcons;
            if (serviceIconUrls) {
              service.serviceIconUrls.forEach((serviceIcon) => {
                const icontobeUploaded = serviceIconUrls?.find(
                  (x) => x.languageId == serviceIcon.languageId
                );
                const imageServiceIcon: any =
                  icontobeUploaded[serviceIcon.languageId];
                if (imageServiceIcon && imageServiceIcon.name) {
                  serviceIcon.url = imageUrls[index];
                  serviceIcon[serviceIcon.languageId] = imageUrls[index];
                  index = index + 1;
                }
              });
            }
          });
          this.serviceIcons = [];
          this.ApiCallToSaveWorkflowAsPublish(request);
        });
    } else {
      this.ApiCallToSaveWorkflowAsPublish(request);
    }
  }

  private NotifySaveAsPublish() {
    this.appNotificationService.Notify(WorkflowMessages.SavePublishMessage);
  }

  Cancel() {
    this.isAdditionalLanguageInvalid = true;
    this.routeHandlerService.RedirectWorkFlowList();
  }

  GetRoutingById(id: string) {
    let routing: any;
    this.RoutingsSubject.value.forEach((group) => {
      if (!routing) {
        routing = group.items.find((item: any) => item.id === id);
      }
    });
    return routing;
  }

  GetWorkFlowId() {
    return this.browserStorageService.WorkFlowId;
  }

  clearWorkflowIdFromSession() {
    this.browserStorageService.RemoveWorkFlowId();
  }

  RemoveWorkFlowIdAndNavigateToAddPage() {
    this.clearWorkflowIdFromSession();
    this.NavigateToWorkFlowConfigPage();
  }

  NavigateToEditPage() {
    this.NavigateToWorkFlowConfigPage();
  }

  private NavigateToWorkFlowConfigPage() {
    this.routeHandlerService.RedirectToWorkFlowConfigPage();
  }

  GetAdvanceRule() {
    return this.AdvanceWorkflowListSubject.value;
  }
  GetPreServiceQuestions() {
    return this.PreServiceQuestionsSubject.value;
  }

  GetServices() {
    return this.ServicesSubject.value;
  }

  GetGroups() {
    return this.GroupsSubject.value;
  }

  GetQuestionSets() {
    return this.QuestionSetsSubject.value;
  }

  GetAppointmentTemplates() {
    return this.AppointTemplateListSubject.value;
  }

  GetQueues() {
    return this.QueuesSubject.value;
  }

  public ValueAlreadyExist(value: string): Observable<boolean> {
    return this.workflowAPIService.AlreadyExists(
      this.CompanyId,
      this.browserStorageService.WorkFlowId,
      value.trim()
    );
  }

  ValidateName(): AsyncValidatorFn {
    return (input: FormControl) => {
      return timer(1000).pipe(
        switchMap(() => this.ValueAlreadyExist(input.value)),
        map((response) => {
          return response ? { isExists: true } : null;
        })
      );
    };
  }

  public OnSelectionChangeSMSValidation(formArray: FormArray, value: boolean) {
    formArray.controls.forEach((formGroup: FormGroup) => {
      if (value) {
        formGroup.controls.smsTemplate.setValidators(Validators.required);
      } else {
        formGroup.controls.smsTemplate.clearValidators();
      }
      formGroup.controls.smsTemplate.markAsUntouched();
      formGroup.controls.smsTemplate.markAsPristine();
      formGroup.controls.smsTemplate.updateValueAndValidity();
    });
    formArray.markAsUntouched();
    formArray.updateValueAndValidity();
  }

  public OnSelectionChangeEmailValidation(
    formArray: FormArray,
    value: boolean
  ) {
    formArray.controls.forEach((formGroup: FormGroup) => {
      if (value) {
        formGroup.controls.emailTemplate.setValidators(Validators.required);
        formGroup.controls.emailSubject.setValidators(Validators.required);
      } else {
        formGroup.controls.emailTemplate.clearValidators();
        formGroup.controls.emailSubject.clearValidators();
      }
      formGroup.controls.emailTemplate.markAsUntouched();
      formGroup.controls.emailSubject.markAsUntouched();
      formGroup.controls.emailTemplate.markAsPristine();
      formGroup.controls.emailSubject.markAsPristine();
      formGroup.controls.emailTemplate.updateValueAndValidity();
      formGroup.controls.emailSubject.updateValueAndValidity();
    });
    formArray.updateValueAndValidity();
  }

  // Advance Workflow
  findChoices(searchText: string) {
    const choices = this.DynamicVariablesList.filter((variables) =>
      variables.shortName.toLowerCase().includes(searchText.toLowerCase())
    )?.map((x) => {
      return x.shortName;
    });
    return choices;
  }

  getChoiceLabel(choice: string) {
    const displayText = (this.DynamicVariablesList as any)?.find((variable: any) => variable.shortName == choice)?.fieldName;
    return `%${displayText}%`;
  }
  GetDefaultWorkflow() {
    const WorkFlow: IWorkFlowRequest = {
      appointmentTemplates: [],
      advanceRules: [],
      basicWorkflowRules: {
        emailAtPositionTemplate: [],
        enableSendEmailAtYourTurn: false,
        enableSendEmailForSurvey: false,
        enableSendEmailUponTransfer: false,
        enableSendEmailWhenCancelled: false,
        enableSendEmailWhenRequeued: false,
        enableSendRegistrationEmail: false,
        enableTextToJoin: true,
        enableAutoReplySMS: false,
        enableSendRegistrationSms: false,
        enableSendSmsAtYourTurn: false,
        enableSendSmsForSurvey: false,
        enableSendSmsUponTransfer: false,
        enableSendSmsWhenCancelled: false,
        enableSendSmsWhenRequeued: false,
        id: null,
        sendEmailAtYourTurnTemplate: [],
        sendEmailForSurveyTemplate: [],
        sendEmailUponTransferTemplate: [],
        sendEmailWhenCancelledTemplate: [],
        sendEmailWhenRequeuedTemplate: [],
        sendRegistrationEmailTemplate: [],
        sendRegistrationSmsTemplate: [],
        sendAutoReplySmsTemplate: [],
        sendJoinQueueSmsTemplate: [],
        sendSmsAtYourTurnTemplate: [],
        sendSmsForSurveyTemplate: [],
        sendSmsUponTransferTemplate: [],
        sendSmsWhenCancelledTemplate: [],
        sendSmsWhenRequeuedTemplate: [],
        smsAtPositionTemplate: [],
      },
      companyId: null,
      generalSetting: null,
      groups: [],
      isPublished: false,
      name: null,
      preServiceQuestions: [],
      questionSets: [],
      surveyQuestions: [],
      queues: [],
      services: [],
      setting: {
        allowTransferBetweenBranches: false,
        allowTransferBetweenServices: false,
        clearTicketsEndOfTheDay: false,
        displayPreServiceQuestions: 'After',
        enablePreServiceQuestions: false,
        enableSingleNumberFormat: false,
        enableMobileInterfaceRequeue: false,
        personMovementSettings: {
          isEnabled: false,
          mobilePositionOnRequeue: 1,
          numberOfCalls: 1,
          numberOfPositionsBack: 1,
          numberOfRequeueCalls: 1,
        },
        singleNumberFormat: {
          middlefix: this.GetMiddleFix(),
          postfix: null,
          prefix: null,
        },
        enableDeleteOnRequeue: false,
        ticketEnd: 99,
        ticketStart: 0,
        moveVisitorToFront: false,
      },
      workFlowId: null,
      estimateWaitSettings: null,
    };
    return WorkFlow;
  }

  HandleIfQuestionOrEventUsedInAdvancedWorkflow(
    id: string,
    setId?: string,
    isEvent?: boolean
  ) {
    let data = this.AdvanceWorkflowListSubject.value.some(x => x.conditions.some(x => x.conditions.some(x => x.condition.id == id)))
    return data;
  }

  private CheckQuestionOrEventUsed(usedInConditionalsList, id) {
    let usedInConditions;
    usedInConditionalsList?.forEach((x) => {
      if (!x.isDeleted) {
        usedInConditions = usedInConditions
          ? usedInConditions
          : x?.conditions?.find((x) => x.condition.id == id);
      }
    });
    return usedInConditions;
  }

  private NavigateTOWorkflowDescription() {
    this.routeHandlerService.RedirectToWorkFlowConfigPage();
  }

  private NavigateToBasicWorkflowRules() {
    this.routeHandlerService.RedirectToWorkFlowBasicWorkflow();
  }

  private NavigateToGlobalQuestion() {
    this.routeHandlerService.RedirectToWorkFlowGlobalQuestion();
  }

  private NavigateToQueue() {
    this.routeHandlerService.RedirectToWorkFlowQueue();
  }

  private NavigateToQuestionSet() {
    this.routeHandlerService.RedirectToWorkFlowQuestionSet();
  }

  private NavigateToService() {
    this.routeHandlerService.RedirectToWorkFlowService();
  }

  private NavigateToWorkflowBehavior() {
    this.routeHandlerService.RedirectToWorkFlowBehavior();
  }

  GetQuestionSetIndex(questionSetId: string) {
    return this.QuestionSetsSubject.value.findIndex(
      (x) => x.id == questionSetId
    );
  }

  public GetRequestDocument(
    WorkFlow: IWorkFlowRequest,
    isDoc?: boolean,
    isAppointment?: boolean
  ) {
    const documents = [
      this.GetWorkFlowDocument(WorkFlow, isDoc),
      {
        documentType: DocumentType.CustomerRequest,
        document: {},
      },
    ];

    if (isAppointment) {
      documents.push({
        documentType: DocumentType.Appointment,
        document: {},
      });
    }

    return {
      purpose: VariablePurpose.Dynamic,
      documents,
    };
  }

  public GetWorkFlowDocument(
    WorkFlow: IWorkFlowRequest,
    isDoc: boolean
  ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null,
    };
  }

  public BranchList() {
    return this.branchAPIService.GetAll<IBranch>(this.authService.CompanyId).subscribe(x => {
      this.BranchesNameSubject.next(x.map((branch: any) => {
        return branch.branchName;
      }));
    });
  }

  CheckConditionsAndDeleteQueue(queueId: string) {
    this.subs.sink = this.workflowAPIService.GetBranchWorkflow(this.WorkFlow.companyId, this.WorkFlow.workFlowId).subscribe((b: any) => {
      const branchIds = b.map(x => x.branchId);
      this.workflowAPIService.CheckCustomersInQueue(queueId, this.WorkFlow.companyId, branchIds).subscribe(x => {
        const IsQueueIsAlreadyInUseOfService = this.IsQueueIsAlreadyInUseOfService(queueId);
        const IsQueueIsAlreadyInUseOfServiceQuestion = this.IsQueueIsAlreadyInUseOfQuestionSet(queueId);
        const IsQueueAlreadyInUseByAdvanceRule = this.IsQueueAlreadyInUseByAdvanceRule(queueId);
        const IsQueueAlreadyBookedService = this.IsQueueAlreadyBookedService(queueId);




        if (IsQueueIsAlreadyInUseOfService) {
          this.appNotificationService.NotifyError(WorkflowMessages.QueueAlreadyInUseOfServiceMessage);
          return;
        }
        if (IsQueueIsAlreadyInUseOfServiceQuestion) {
          this.appNotificationService.NotifyError(WorkflowMessages.QueueAlreadyInUseOfQuestionSetMessage);
          return;
        }
        if (IsQueueAlreadyInUseByAdvanceRule) {
          return this.appNotificationService.NotifyError(WorkflowMessages.QueueAlreadyInUseByAdvanceRule);
        }
        if (IsQueueAlreadyBookedService) {
          this.appNotificationService.NotifyError(WorkflowMessages.QueueAlreadyInUseOfServiceMessage);
          return;
        }

        if (x) {
          this.appNotificationService.NotifyError(WorkflowMessages.QueueWithCustomerMessage);
          return;
        }
        if (confirm(WorkflowMessages.ConfirmDeleteMessage)) {
          this.DeleteQueue(queueId);
        }
      });
    });
  }

  IsQueueAlreadyInUseByAdvanceRule(queueid: string) {
    return this.GetAdvanceRule().
      some(advanceRule => advanceRule.type == AdvanceWorkflowType[0].value && !advanceRule.isDeleted && advanceRule.actions.some(advanceRuleQueueAction => advanceRuleQueueAction.action.type == "Route" && advanceRuleQueueAction.routing.id == queueid));
  }

  IsQueueIsAlreadyInUseOfService(queueId: string) {
    return this.GetServices()
      .some(service => service.routing !== null && service.routing.id === queueId && !service.isDeleted);
  }

  IsQueueAlreadyBookedService(queueId: string) {
    return this.GetAppointmentTemplates()
      .some(appointment => appointment.id !== null && appointment.id === queueId && !appointment.isDeleted);
  }

  IsQueueIsAlreadyInUseOfQuestionSet(queueId: string) {
    return this.GetQuestionSets()
      .some(questionSet => questionSet.routing != null && questionSet.routing.id === queueId && !questionSet.isDeleted);
  }

  private DeleteEmptySurveys() {
    const surveyArray: any[] = this.SurveyQuestionSetsSubject.getValue();
    if (surveyArray && surveyArray.length) {
      surveyArray.forEach((item, index) => {
        if (item && !item.id) { surveyArray.splice(index, 1); }
      });
      this.SurveyQuestionSetsSubject.next(surveyArray);
    }
  }

}


function ConvertTranslatedLanguageArrayToObject(arr) {
  if (!arr) { return {}; }
  const obj = {};
  for (const element of arr) {
    obj[element.languageId] = element.translatedText;
  }
  return obj;
}

function ConvertFormArrayToObject(arr: ITranslations[]) {
  if (!arr) { return {}; }
  const obj = {};
  for (const element of arr) {
    obj[element.languageId] = element.text;
  }
  return obj;
}




