import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { ILayoutTemplate } from 'src/app/features/branch-list/models/layout-template.interface';
import { ISchedulerTemplate } from 'src/app/features/branch-list/models/scheduler-template.interface';
import { IDropdownList } from 'src/app/models/common/dropdown-list.interface';
import { DefaultAgentConfigValues } from 'src/app/models/constants/agent-configuration.constants';
import { Validations } from 'src/app/models/constants/validation.constant';
import { AgentViewType } from 'src/app/models/enums/agent-view-type.enum';
import { AppointmentSchedulerAPIService } from 'src/app/shared/api-services/appointment-scheduler-api.service';
import { MobileAPIService } from 'src/app/shared/api-services/mobile-api.service';
import { AgentConfigurationValidatorService } from 'src/app/shared/validators/agent-configuration.validator';
import { CustomRequiredDropDownValidator } from 'src/app/shared/validators/common.validator';
import { AgentAPIService } from '../../../../shared/api-services/agent-api.service';
import { WorkflowAPIService } from '../../../../shared/api-services/workflow-api.service';
import { AgentMessages } from '../messages';
import { IAgentRequest } from './models/agent-configuration-request.interface';
import { IAgentConfiguration } from './models/agent-configuration.interface';
import { IAgentDropDowns } from './models/agent-dropdowns.interface';
import { IAgentWorkflow } from './models/agent-workflows.interface';

@Injectable()
export class AddOrEditAgentConfigurationService extends AbstractComponentService {
  private SubjectIsClassicMode: BehaviorSubject<boolean>;
  public IsClassicMode$: Observable<boolean>;
  private SubjectIsEditMode: BehaviorSubject<boolean>;
  public IsEditMode$: Observable<boolean>;
  public DropDownsData$: Observable<IAgentDropDowns>;
  private SubjectDropDownsData: BehaviorSubject<IAgentDropDowns>;
  private SubjectShowPanel: BehaviorSubject<boolean>;
  public ShowPanel$: Observable<boolean>;
  public IsEditMode: boolean;
  public AgentTemplateId = this.browserStorageService.AgentId;
  public CompanyId = this.authStateService.CompanyId;
  private AgentDropDownsData: IAgentDropDowns = {
    agentViewTypes: [],
    timeDisplayInQueues: [],
    timeFormats: [],
    workflows: [],
    mobileTemplates: [],
    schedulerTemplates: [],
  };
  AgentTemplateForm: FormGroup;

  get TabNameControl() {
    return this.AgentTemplateForm.get('classicConfiguration.tabName');
  }

  get UrlControl() {
    return this.AgentTemplateForm.get('classicConfiguration.url');
  }

  get LiteTimeFormatControl() {
    return this.AgentTemplateForm.get('liteConfiguration.timeFormat');
  }

  get ClassicTimeFormatControl() {
    return this.AgentTemplateForm.get('classicConfiguration.classicTimeFormat');
  }

  get ClassicTimeInQueueControl() {
    return this.AgentTemplateForm.get('classicConfiguration.timeInQueue');
  }

  get AgentViewTypeControl() {
    return this.AgentTemplateForm.get('generalConfiguration.viewType');
  }
  get AgentTemplateNameControl() {
    return this.AgentTemplateForm.get('generalConfiguration.name');
  }
  constructor(
    private route: ActivatedRoute,
    private authStateService: AuthStateService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly agentConfigurationValidatorService: AgentConfigurationValidatorService,
    private readonly agentAPIService: AgentAPIService,
    private readonly mobileAPIService: MobileAPIService,
    private readonly schedulerAPIService: AppointmentSchedulerAPIService
  ) {
    super();
    this.SetObservables();
    this.SetFormGroup(this.SetDefaultValuesInForm());
  }

  public SetObservables() {
    this.SubjectIsEditMode = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.SubjectIsEditMode.asObservable();
    this.SubjectIsClassicMode = new BehaviorSubject<boolean>(true);
    this.IsClassicMode$ = this.SubjectIsClassicMode.asObservable();
    this.SubjectShowPanel = new BehaviorSubject<boolean>(false);
    this.ShowPanel$ = this.SubjectShowPanel.asObservable();
    this.SubjectDropDownsData = new BehaviorSubject<IAgentDropDowns>(
      this.AgentDropDownsData
    );
    this.DropDownsData$ = this.SubjectDropDownsData.asObservable();
  }

  public SetFormGroup(formValues: IAgentConfiguration) {
    this.AgentTemplateForm = this.formBuilder.group({
      generalConfiguration: this.formBuilder.group({
        name: [
          formValues.generalConfiguration.name,
          {
            updateOn: 'change',
            validators: [Validators.required],
            asyncValidators: [
              this.agentConfigurationValidatorService.GeneralConfigNameAlreadyExistValidator(
                this.CompanyId,
                this.AgentTemplateId,
                formValues.generalConfiguration.name
              ),
            ],
          },
        ],
        workflow: [
          formValues.generalConfiguration.workflow,
          CustomRequiredDropDownValidator('workFlowId'),
        ],
        mobileTemplate: [formValues.generalConfiguration.mobileTemplate],
        schedulerTemplate: [formValues.generalConfiguration.schedulerTemplate],
        viewType: [formValues.generalConfiguration.viewType],
      }),
      classicConfiguration: this.formBuilder.group({
        allowTakeOverCustomer: [
          formValues.classicConfiguration.allowTakeOverCustomer,
        ],
        allowTransferBetweenServices: [
          formValues.classicConfiguration.allowTransferBetweenServices,
        ],
        allowTransferBetweenBranches: [
          formValues.classicConfiguration.allowTransferBetweenBranches,
        ],
        allowTicketRepositioning: [
          formValues.classicConfiguration.allowTicketRepositioning,
        ],
        allowTicketDeletion: [
          formValues.classicConfiguration.allowTicketDeletion,
        ],
        allowEditingCustomerInformation: [
          formValues.classicConfiguration.allowEditingCustomerInformation,
        ],
        allowCommentingOnTicket: [
          formValues.classicConfiguration.allowCommentingOnTicket,
        ],
        allowServeMultiple: [
          formValues.classicConfiguration.allowServeMultiple,
        ],
        allowGrouping: [
          formValues.classicConfiguration.allowGrouping
        ],
        allowToCreateGroup: [formValues.classicConfiguration.allowToCreateGroup
        ],
        allowDirectCall: [formValues.classicConfiguration.allowDirectCall],
        allowCancelingService: [
          formValues.classicConfiguration.allowCancelingService,
        ],
        allowSMSMessaging: [formValues.classicConfiguration.allowSMSMessaging],
        allowBiDirectionalSMSMessaging: [
          formValues.classicConfiguration.allowBiDirectionalSMSMessaging,
        ],
        displayNoOfTicketsServed: [
          formValues.classicConfiguration.displayNoOfTicketsServed,
        ],
        useDirectServedEnabled: [
          formValues.classicConfiguration.useDirectServedEnabled,
        ],
        displayAgentLogin: [
          formValues.classicConfiguration.displayAgentLogin,
        ],
        displayDeskLogin: [
          formValues.classicConfiguration.displayDeskLogin,
        ],
        allowTicketFiltering: [
          formValues.classicConfiguration.allowTicketFiltering,
        ],
        allowSelectedVisitorCalling: [
          formValues.classicConfiguration.allowSelectedVisitorCalling,
        ],
        enableEndOfDayButtonInQueue: [
          formValues.classicConfiguration.enableEndOfDayButtonInQueue,
        ],
        classicTimeFormat: [formValues.classicConfiguration.classicTimeFormat],
        timeInQueue: [formValues.classicConfiguration.timeInQueue],
        displayKiosk: [formValues.classicConfiguration.displayKiosk],
        displayAppointments: [
          formValues.classicConfiguration.displayAppointments,
        ],
        displayTodaysTickets: [
          formValues.classicConfiguration.displayTodaysTickets,
        ],
        displayCustomerURLTab: [
          formValues.classicConfiguration.displayCustomerURLTab,
        ],
        hideTicketNumber: [
          formValues.classicConfiguration.hideTicketNumber,
        ],
        tabName: [formValues.classicConfiguration.tabName],
        url: [formValues.classicConfiguration.url],
      }),
      liteConfiguration: this.formBuilder.group({
        allowMultipleCalls: [formValues.liteConfiguration.allowMultipleCalls],
        displayKiosk: [formValues.liteConfiguration.displayKiosk],
        displayTodaysTickets: [
          formValues.liteConfiguration.displayTodaysTickets,
        ],
        timeFormat: [formValues.liteConfiguration.timeFormat],
      }),
    });
  }

  public SetDefaultValuesInForm() {
    const defaultValue: IAgentConfiguration = {
      generalConfiguration: {
        name: '',
        workflow: DefaultAgentConfigValues.WorkflowDefaultValue,
        viewType: null,
        mobileTemplate: null,
        schedulerTemplate: null,
      },
      classicConfiguration: {
        allowTakeOverCustomer:false,
        allowBiDirectionalSMSMessaging: false,
        allowCancelingService: false,
        allowCommentingOnTicket: false,
        allowDirectCall: false,
        allowEditingCustomerInformation: false,
        allowGrouping: false,
        allowToCreateGroup: false,
        allowServeMultiple: false,
        allowSMSMessaging: false,
        allowTicketDeletion: false,
        allowTicketRepositioning: false,
        allowTransferBetweenServices: false,
        allowTransferBetweenBranches: false,
        displayTodaysTickets: false,
        displayAppointments: false,
        displayCustomerURLTab: false,
        displayKiosk: false,
        displayNoOfTicketsServed: false,
        hideTicketNumber: false,
        tabName: '',
        url: '',
        classicTimeFormat: null,
        timeInQueue: DefaultAgentConfigValues.TimeInQueueDefaultValue,
        useDirectServedEnabled: false,
        displayAgentLogin:true,
        displayDeskLogin:true,
        allowSelectedVisitorCalling:true,
        allowTicketFiltering: true,
        enableEndOfDayButtonInQueue: false
      },
      liteConfiguration: {
        allowMultipleCalls: false,
        displayKiosk: false,
        displayTodaysTickets: false,
        timeFormat: null,
      },
    };
    return defaultValue;
  }

  public SetFormValues(values: IAgentRequest) {
    this.AgentTemplateNameControl.clearAsyncValidators();
    this.AgentTemplateForm.get('generalConfiguration.name').setValue(
      values.name
    );
    this.AgentTemplateNameControl.setAsyncValidators(
      this.agentConfigurationValidatorService.GeneralConfigNameAlreadyExistValidator(
        this.CompanyId,
        this.AgentTemplateId,
        values.name
      )
    );
    this.AgentTemplateForm.get('generalConfiguration.workflow').setValue(
      this.GetWorkFlowObj(values.workflowId)
    );

    this.AgentTemplateForm.get('generalConfiguration.mobileTemplate').setValue(
      this.GetMobileTemplateObj(values.mobileTemplateId)
    );

    this.AgentTemplateForm.get(
      'generalConfiguration.schedulerTemplate'
    ).setValue(this.GetschedulerTemplateObj(values.schedulerTemplateId));

    this.AgentTemplateForm.get('generalConfiguration.viewType').setValue(
      this.GetViewTypeObj(values.viewTypeId)
    );
    if (
      this.GetViewTypeObj(values.viewTypeId).value === AgentViewType.Classic
    ) {
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTransferBetweenServices'
      ).setValue(values.allowTransferBetweenServices);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTakeOverCustomer'
      ).setValue(values.allowTakeOverCustomer);
      this.AgentTemplateForm.get(
        'classicConfiguration.hideTicketNumber'
      ).setValue(values.hideTicketNumber);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTransferBetweenBranches'
      ).setValue(values.allowTransferBetweenBranches);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTicketRepositioning'
      ).setValue(values.allowTicketRepositioning);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTicketDeletion'
      ).setValue(values.allowTicketDeletion);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowEditingCustomerInformation'
      ).setValue(values.allowEditingCustomerInformation);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowCommentingOnTicket'
      ).setValue(values.allowCommentingOnTicket);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowServeMultiple'
      ).setValue(values.allowServeMultiple);
      this.AgentTemplateForm.get('classicConfiguration.allowGrouping').setValue(
        values.grouping ?values.grouping.allow : null
      );
      this.AgentTemplateForm.get('classicConfiguration.allowToCreateGroup').setValue(
        values.grouping ?values.grouping.allowToCreateGroup : null
      );
      this.AgentTemplateForm.get(
        'classicConfiguration.allowDirectCall'
      ).setValue(values.allowDirectCall);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowCancelingService'
      ).setValue(values.allowCancelingService);
      this.AgentTemplateForm.get(
        'classicConfiguration.displayNoOfTicketsServed'
      ).setValue(values.displayNoOfTicketServed);
      this.AgentTemplateForm.get(
        'classicConfiguration.useDirectServedEnabled'
      ).setValue(values.useDirectServedEnabled);
      this.AgentTemplateForm.get(
        'classicConfiguration.displayAgentLogin'
      ).setValue(this.SetTrueWhenNull(values.displayAgentLogin));
      this.AgentTemplateForm.get(
        'classicConfiguration.displayDeskLogin'
      ).setValue(this.SetTrueWhenNull(values.displayDeskLogin));
      this.AgentTemplateForm.get(
        'classicConfiguration.allowTicketFiltering'
      ).setValue(this.SetTrueWhenNull(values.allowTicketFiltering));
      this.AgentTemplateForm.get(
        'classicConfiguration.allowSelectedVisitorCalling'
      ).setValue(this.SetTrueWhenNull(values.allowSelectedVisitorCalling));
      this.AgentTemplateForm.get(
        'classicConfiguration.enableEndOfDayButtonInQueue'
      ).setValue(values.enableEndOfDayButtonInQueue);
      this.AgentTemplateForm.get('classicConfiguration.displayKiosk').setValue(
        values.displayKiosk
      );
      this.AgentTemplateForm.get(
        'classicConfiguration.displayAppointments'
      ).setValue(values.displayAppointments);
      this.AgentTemplateForm.get(
        'classicConfiguration.displayTodaysTickets'
      ).setValue(values.displayTodaysTickets);
      this.AgentTemplateForm.get(
        'classicConfiguration.displayCustomerURLTab'
      ).setValue(values.displayCustomerURLTab);
      this.AgentTemplateForm.get(
        'classicConfiguration.classicTimeFormat'
      ).setValue(this.GetTimeFormatObj(values.timeFormatId));
      this.AgentTemplateForm.get('classicConfiguration.timeInQueue').setValue(
        this.GetTimeDisplayInQueueObj(values.timeDisplayInQueueId)
      );
      this.AgentTemplateForm.get('classicConfiguration.tabName').setValue(
        values.tabName
      );
      this.AgentTemplateForm.get('classicConfiguration.url').setValue(
        values.url
      );
      this.AgentTemplateForm.get(
        'classicConfiguration.allowSMSMessaging'
      ).setValue(values.sMSMessaging ? values.sMSMessaging.allow : null);
      this.AgentTemplateForm.get(
        'classicConfiguration.allowBiDirectionalSMSMessaging'
      ).setValue(
        values.sMSMessaging ? values.sMSMessaging.allowBiDirectional : null
      );
    } else {
      this.AgentTemplateForm.get(
        'liteConfiguration.allowMultipleCalls'
      ).setValue(values.allowMultipleCalls);
      this.AgentTemplateForm.get('liteConfiguration.displayKiosk').setValue(
        values.displayKiosk
      );
      this.AgentTemplateForm.get(
        'liteConfiguration.displayTodaysTickets'
      ).setValue(values.displayTodaysTickets);
      this.AgentTemplateForm.get('liteConfiguration.timeFormat').setValue(
        this.GetTimeFormatObj(values.timeFormatId)
      );
    }
  }

  public SetMode() {
    this.AgentTemplateId = this.browserStorageService.AgentId;
    if (this.AgentTemplateId) {
      this.SetEditMode();
    } else {
      this.SetAddMode();
    }
    this.SubjectIsEditMode.next(this.IsEditMode);
  }

  private SetAddMode() {
    this.IsEditMode = false;
    this.CheckIfAgentClassicMode(true);
  }

  private CheckIfAgentClassicMode(isClassicMode: boolean) {
    this.SubjectIsClassicMode.next(isClassicMode);
  }

  private SetEditMode() {
    this.IsEditMode = true;
    this.DisableWorkflowDropdown();
  }

  private DisableWorkflowDropdown() {
    this.AgentTemplateForm.get('generalConfiguration.workflow').disable();
  }

  public ValidationBasedOnAgentView(value: string) {
    if (!value) {
      this.CheckIfAgentClassicMode(null);
    } else if (value === AgentViewType.Lite) {
      this.ValidationsOnLiteAgentView();
    } else {
      this.ValidationsOnClassicAgentView();
    }
    this.AgentTemplateForm?.controls.classicConfiguration.reset({
        allowTicketFiltering: true,
        allowSelectedVisitorCalling: true,
        displayAgentLogin: true,
        displayDeskLogin: true,
    });
    this.AgentTemplateForm?.controls.liteConfiguration.reset();
  }

  private ValidationsOnClassicAgentView() {
    this.CheckIfAgentClassicMode(true);
    this.SubjectShowPanel.next(true);
    this.ClassicTimeFormatControl.setValidators(
      CustomRequiredDropDownValidator()
    );
    this.ClassicTimeInQueueControl.setValidators(
      CustomRequiredDropDownValidator()
    );
    this.clearValidationOnClassicVew();
    this.UpdateValidationsOnClassicView();
  }

  private clearValidationOnClassicVew() {
    this.LiteTimeFormatControl.clearValidators();
  }

  private UpdateValidationsOnClassicView() {
    this.LiteTimeFormatControl.updateValueAndValidity();
    this.ClassicTimeFormatControl.updateValueAndValidity();
    this.ClassicTimeInQueueControl.updateValueAndValidity();
  }

  private ValidationsOnLiteAgentView() {
    this.CheckIfAgentClassicMode(false);
    this.LiteTimeFormatControl.setValidators(CustomRequiredDropDownValidator());
    this.ClearValidationsOnLiteView();
    this.UpdateValidationsOnLiteView();
  }

  private UpdateValidationsOnLiteView() {
    this.TabNameControl.updateValueAndValidity();
    this.UrlControl.updateValueAndValidity();
    this.LiteTimeFormatControl.updateValueAndValidity();
    this.ClassicTimeFormatControl.updateValueAndValidity();
    this.ClassicTimeInQueueControl.updateValueAndValidity();
  }

  private ClearValidationsOnLiteView() {
    this.ClassicTimeFormatControl.clearValidators();
    this.ClassicTimeInQueueControl.clearValidators();
    this.TabNameControl.clearValidators();
    this.UrlControl.clearValidators();
  }

  public ResetBidirectionalCheckBox() {
    const allowSms = this.AgentTemplateForm.get(
      'classicConfiguration.allowSMSMessaging'
    ).value;
    if (allowSms) {
      this.AgentTemplateForm.get(
        'classicConfiguration.allowBiDirectionalSMSMessaging'
      ).reset();
    }
  }

  public ResetCreateGroupCheckBox() {
    const allowSms = this.AgentTemplateForm.get(
      'classicConfiguration.allowGrouping'
    ).value;
    if (allowSms) {
      this.AgentTemplateForm.get(
        'classicConfiguration.allowToCreateGroup'
      ).reset();
    }
  }

  public OnChangeOfCustomerUrlTab() {
    const customerUrlTab = this.AgentTemplateForm.get(
      'classicConfiguration.displayCustomerURLTab'
    ).value;
    if (customerUrlTab) {
      this.SetAndUpdateValidationsOnCustomerUrlTab();
    } else {
      this.ClearAndUpdateValidationsOnCustomerUrlTab();
    }
  }

  private SetAndUpdateValidationsOnCustomerUrlTab() {
    this.TabNameControl.setValidators([Validators.required]);
    this.UrlControl.setValidators([
      Validators.required,
      Validators.pattern(Validations.UrlRegX),
    ]);
    this.TabNameControl.updateValueAndValidity();
    this.UrlControl.updateValueAndValidity();
  }

  private ClearAndUpdateValidationsOnCustomerUrlTab() {
    this.TabNameControl.clearValidators();
    this.UrlControl.clearValidators();
    this.TabNameControl.updateValueAndValidity();
    this.UrlControl.updateValueAndValidity();
    this.ResetTabAndUrlControl();
  }

  private ResetTabAndUrlControl() {
    this.TabNameControl.reset();
    this.UrlControl.reset();
  }

  public CallMultipleApi() {
    this.subs.sink = this.formService
      .CombineAPICall(
        this.GetWorkflow(),
        this.GetAgentViewType(),
        this.GetTimeFormat(),
        this.GetTimeInQueue(),
        this.GetMobileTemplates(),
        this.GetschedulerTemplates()
      )
      .subscribe(
        ([
          workflows,
          agentViewTypes,
          timeFormats,
          timeDisplayInQueues,
          mobileTemplates,
          schedulerTemplates,
        ]) => {
          const DropDownsData: IAgentDropDowns = {
            workflows,
            agentViewTypes,
            timeFormats,
            timeDisplayInQueues,
            mobileTemplates,
            schedulerTemplates,
          };

          this.AgentDropDownsData = cloneObject(DropDownsData);
          DropDownsData.mobileTemplates = [];
          DropDownsData.schedulerTemplates = [];
          this.SubjectDropDownsData.next(DropDownsData);
          this.SetViewTypeDropdown(DropDownsData);
          if (this.SubjectIsEditMode.value) {
            this.GetAgentTemplate();
          }
        }
      );
  }

  OnchangeOfWorkflow(workflowId: string) {
    this.AgentTemplateForm.controls.generalConfiguration
      .get('mobileTemplate')
      .setValue(null);
    this.AgentTemplateForm.controls.generalConfiguration
      .get('schedulerTemplate')
      .setValue(null);
    this.UpdateMobileAndSchedulerTemplatesListBasedOnWorkflow(workflowId);
  }

  UpdateMobileAndSchedulerTemplatesListBasedOnWorkflow(workflowId: string) {
    let mobileDropDownData = [];
    let schedulerDropDownData = [];
    if (!workflowId) {
      mobileDropDownData = [];
      schedulerDropDownData = [];
    } else {
      mobileDropDownData = this.AgentDropDownsData.mobileTemplates?.filter(
        (x) => x.workFlowId == workflowId
      );
      schedulerDropDownData =
        this.AgentDropDownsData.schedulerTemplates?.filter(
          (x) => x.workflowId == workflowId
        );
    }
    this.SubjectDropDownsData.value.mobileTemplates = mobileDropDownData;
    this.SubjectDropDownsData.value.schedulerTemplates = schedulerDropDownData;
    this.SubjectDropDownsData.next(this.SubjectDropDownsData.value);
  }

  public GetAgentTemplate() {
    this.agentAPIService
      .Get(this.CompanyId, this.AgentTemplateId)
      .subscribe((x: IAgentRequest) => {
        this.loadingService.showLoading();
        this.ValidationBasedOnAgentView(
          this.GetViewTypeObj(x.viewTypeId).value
        );
        this.SetFormValues(x);
        this.OnChangeOfCustomerUrlTab();
        this.UpdateMobileAndSchedulerTemplatesListBasedOnWorkflow(x.workflowId);
        this.loadingService.hideLoading();
      });
  }

  private SetViewTypeDropdown(DropDownsData: IAgentDropDowns) {
    this.AgentViewTypeControl.setValue(DropDownsData.agentViewTypes[0] || null);
    this.ValidationBasedOnAgentView(
      DropDownsData.agentViewTypes[0].value || null
    );
  }

  private GetWorkflow() {
    return this.workflowAPIService.GetDropdownListWithNoLoading(this.CompanyId);
  }

  private GetAgentViewType() {
    return this.agentAPIService.GetViewTypes(this.CompanyId);
  }

  public GetMobileTemplates(): Observable<ILayoutTemplate[]> {
    return this.mobileAPIService.GetDropdownList(this.CompanyId);
  }

  public GetschedulerTemplates(): Observable<ISchedulerTemplate[]> {
    return this.schedulerAPIService.GetPublishedSchedulerTemplateLookups(
      this.CompanyId
    );
  }

  private GetTimeFormat() {
    return this.agentAPIService.GetTimeFormats(this.CompanyId);
  }

  private GetTimeInQueue() {
    return this.agentAPIService.GetTimeDisplayInQueues(this.CompanyId);
  }

  private GetWorkFlowObj(id: string): IAgentWorkflow {
    return this.AgentDropDownsData === undefined
      ? null
      : this.AgentDropDownsData.workflows.find((x) => x.workFlowId === id);
  }

  private GetMobileTemplateObj(id: string): ILayoutTemplate {
    return this.AgentDropDownsData === undefined
      ? null
      : this.AgentDropDownsData?.mobileTemplates.find(
          (x) => x.templateId === id
        );
  }

  private GetschedulerTemplateObj(id: string): ISchedulerTemplate {
    return this.AgentDropDownsData === undefined
      ? null
      : this.AgentDropDownsData?.schedulerTemplates.find(
          (x) => x.schedulerId === id
        );
  }

  private GetViewTypeObj(id: string): IDropdownList {
    return this.AgentDropDownsData
      ? this.AgentDropDownsData.agentViewTypes.find((x) => x.value === id)
      : null;
  }

  private GetTimeFormatObj(id: string): IDropdownList {
    return this.AgentDropDownsData === undefined
      ? null
      : this.AgentDropDownsData.timeFormats.find((x) => x.value === id);
  }

  private GetTimeDisplayInQueueObj(id: string): IDropdownList {
    return this.AgentDropDownsData === undefined
      ? null
      : this.AgentDropDownsData.timeDisplayInQueues.find((x) => x.value === id);
  }

  public SaveAgentConfiguration(form: FormGroup) {
    if (this.IsEditMode) {
      this.formService
        .CallFormMethod<IAgentConfiguration>(form)
        .then((response) => {
          if(response.generalConfiguration.viewType.value !== AgentViewType.Lite &&
            this.InvalidAgentLoginType(response)
           ){
             this.AppNotificationService.NotifyError(AgentMessages.AgentLoginErrorMessage);
             return;
           }
          const data =
            response.generalConfiguration.viewType.value === AgentViewType.Lite
              ? this.GetFormattedLiteData(response)
              : this.GetFormattedClassicData(response);
          this.PutApiCall(data);
        });
    } else {
      this.formService
        .CallFormMethod<IAgentConfiguration>(form)
        .then((response) => {
          if(response.generalConfiguration.viewType.value !== AgentViewType.Lite &&
            this.InvalidAgentLoginType(response)
           ){
             this.AppNotificationService.NotifyError(AgentMessages.AgentLoginErrorMessage);
             return;
           }
          const data =
            response.generalConfiguration.viewType.value === AgentViewType.Lite
              ? this.GetFormattedLiteData(response)
              : this.GetFormattedClassicData(response);

          this.PostApiCall(data);
        });
    }
  }

  private PostApiCall(data: any) {
    this.agentAPIService
      .Create(this.CompanyId, data)
      .subscribe((result: any) => {
        this.browserStorageService.SetAgentId(result.Id);
        if (result) {
          this.AppNotificationService.Notify(AgentMessages.SaveMessage);
        } else {
          this.AppNotificationService.NotifyError(AgentMessages.ErrorMessage);
        }
        this.AgentTemplateForm.reset();
        this.routeHandlerService.RedirectToAgentTemplate();
      });
  }

  private PutApiCall(data: any) {
    this.agentAPIService.Update(this.CompanyId, data).subscribe((result) => {
      if (result) {
        this.AppNotificationService.Notify(AgentMessages.UpdateMessage);
      } else {
        this.AppNotificationService.NotifyError(AgentMessages.ErrorMessage);
      }
      this.AgentTemplateForm.reset();
      this.routeHandlerService.RedirectToAgentTemplate();
    });
  }

  public GetFormattedClassicData(data: IAgentConfiguration) {
    const classic = {
      pk: this.CompanyId,
      type: 'agent_configuration_data',
      id: this.AgentTemplateId ? this.AgentTemplateId : this.uuid,
      companyId: this.CompanyId,
      name: data.generalConfiguration.name,
      viewTypeId: data.generalConfiguration.viewType.value,
      workflowId: data.generalConfiguration.workflow.workFlowId,
      mobileTemplateId: data.generalConfiguration.mobileTemplate?.templateId,
      schedulerTemplateId:
        data.generalConfiguration.schedulerTemplate?.schedulerId,
      allowTransferBetweenServices:
        data.classicConfiguration.allowTransferBetweenServices,
      allowTakeOverCustomer:
        data.classicConfiguration.allowTakeOverCustomer,
      allowTransferBetweenBranches:
        data.classicConfiguration.allowTransferBetweenBranches,
      allowTicketRepositioning:
        data.classicConfiguration.allowTicketRepositioning,
      allowTicketDeletion: data.classicConfiguration.allowTicketDeletion,
      allowEditingCustomerInformation:
        data.classicConfiguration.allowEditingCustomerInformation,
      allowCommentingOnTicket:
        data.classicConfiguration.allowCommentingOnTicket,
      allowServeMultiple: data.classicConfiguration.allowServeMultiple,
      grouping:
      data.classicConfiguration.allowGrouping === false
      ? null
      : {
          allow: data.classicConfiguration.allowGrouping,
          allowToCreateGroup:
            data.classicConfiguration.allowToCreateGroup,
        },
      allowDirectCall: data.classicConfiguration.allowDirectCall,
      allowCancelingService: data.classicConfiguration.allowCancelingService,
      sMSMessaging:
        data.classicConfiguration.allowSMSMessaging === false
          ? null
          : {
              allow: data.classicConfiguration.allowSMSMessaging,
              allowBiDirectional:
                data.classicConfiguration.allowBiDirectionalSMSMessaging,
            },
      displayNoOfTicketServed:
        data.classicConfiguration.displayNoOfTicketsServed,
      hideTicketNumber:
        data.classicConfiguration.hideTicketNumber,
      displayKiosk: data.classicConfiguration.displayKiosk,
      displayAppointments: data.classicConfiguration.displayAppointments,
      displayTodaysTickets: data.classicConfiguration.displayTodaysTickets,
      displayCustomerURLTab: data.classicConfiguration.displayCustomerURLTab,
      timeFormatId: data.classicConfiguration.classicTimeFormat?.value,
      timeDisplayInQueueId: data.classicConfiguration.timeInQueue.value,
      useDirectServedEnabled: data.classicConfiguration.useDirectServedEnabled,
      displayAgentLogin: data.classicConfiguration.displayAgentLogin,
      displayDeskLogin: data.classicConfiguration.displayDeskLogin,
      allowTicketFiltering: data.classicConfiguration.allowTicketFiltering,
      allowSelectedVisitorCalling: data.classicConfiguration.allowSelectedVisitorCalling,
      enableEndOfDayButtonInQueue: data.classicConfiguration.enableEndOfDayButtonInQueue,
      tabName:
        data.classicConfiguration.tabName !== ''
          ? data.classicConfiguration.tabName
          : null,
      url:
        data.classicConfiguration.url !== ''
          ? data.classicConfiguration.url
          : null,
    };
    return classic;
  }

  public GetFormattedLiteData(data: IAgentConfiguration) {
    const lite = {
      pk: this.CompanyId,
      type: 'agent_configuration_data',
      id: this.AgentTemplateId ? this.AgentTemplateId : this.uuid,
      companyId: this.CompanyId,
      name: data.generalConfiguration.name,
      viewTypeId: data.generalConfiguration.viewType.value,
      workflowId: data.generalConfiguration.workflow.workFlowId,
      allowMultipleCalls: data.liteConfiguration.allowMultipleCalls,
      displayKiosk: data.liteConfiguration.displayKiosk,
      displayTodaysTickets: data.liteConfiguration.displayTodaysTickets,
      timeFormatId: data.liteConfiguration.timeFormat.value,
    };
    return lite;
  }

  private InvalidAgentLoginType(agentDetails:IAgentConfiguration):boolean{
    return agentDetails.classicConfiguration.displayAgentLogin==false &&
           agentDetails.classicConfiguration.displayDeskLogin==false;
  }

  private SetTrueWhenNull(value: boolean):boolean{
    return value==null?true:value;
  }

}
