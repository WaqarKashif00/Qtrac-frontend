import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { TokenService } from 'src/app/core/services/token.service';
import { cloneObject, isObject } from 'src/app/core/utilities/core-utilities';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import {
  AppointmentSchedulerPageName,
  EnableTermsConditions,
  SchedulerType,
  SharableLinkType,
} from 'src/app/models/enums/appointment-scheduler.enum';
import { Language } from 'src/app/models/enums/language-enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import { SchedulerValidationMessages } from 'src/app/models/validation-message/appointment-scheduler.messages';
import { DeleteAppointmentRequest } from 'src/app/shared/api-models/appointment/delete-appointment-request';
import {
  RulesDocument,
  RulesDocumentReference,
} from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { AppointmentSchedulerAPIService } from 'src/app/shared/api-services/appointment-scheduler-api.service';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { ITime } from '../../scheduler/hours-of-operations/hours-of-operation.interface';
import { AppointmentStatus } from '../../utility-configuration/agent/models/appointment/appointment.status.enum';
import { ISupportedLanguage } from '../../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/supported-language.interface';
import { IAppointmentNotificationPreferences } from '../models/appointment-notification-preferences.interface';
import { BranchHoursOfOperation } from '../models/branch-hours-of-operation.interface';
import { IFirstAvailable } from '../models/first-available.interface';
import {
  BranchWorkingTime,
  NearestBranchDisplayData,
} from '../models/nearest-branch-display-data.interface';
import { NearestBRanchListWithHOO } from '../models/nearest-branches.interface';
import { ISchedulerData } from '../models/schedular-data.interface';
import {
  IQuestionItem,
  ISchedulerExecutionalData,
} from '../models/scheduler-execution-data.interface';
import { ISchedulerRequestData } from '../models/scheduler-reauest-data.interface';
import { ISchedularService } from '../models/sechduler-services.interface';
import { IMiles } from '../models/selection-item.interface';
import { IAppointmentSlotRequest } from '../models/slot-request.interface';
import { IStepDetails } from '../models/step-details.interface';
import { ILocation, ITextSearch } from '../models/text-search.interface';
import { IValidationMessage } from '../models/validation-message.interface';
import {
  IServiceRoute,
  IWorkFlowDetail,
  IWorkFlowQuestionData,
  Routing,
} from '../models/work-flow-detail.interface';
import { WorkingDay } from '../models/working-day';
import { AppointmentSchedulerMessages } from '../scheduler.messages';
import { ICurrentLanguage } from '../models/current-language.interface';
import { TranslateService } from 'src/app/core/services/translate.service';
import { AppointmentTextInterface } from '../models/appointment-text.interface';
import { AppointmentTextEnum, AppointmentTextTypeEnum } from '../models/enum/appointment-text.enum';
@Injectable({
  providedIn: 'root',
})
export class AppointmentSchedulerExecutionsService extends AbstractComponentService {
  IsModifiedURL: any;
  KendoTimeZoneData = ZonedDate;
  constructor(
    private readonly appointmentSchedulerAPIService: AppointmentSchedulerAPIService,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly tokenService: TokenService,
    private router: ActivatedRoute,
    private readonly dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService,
    private zone: NgZone,
    private readonly companyAPIService: CompanyAPIService,
    private notificationService: AppNotificationService,
    private readonly translateApiService: TranslateService,
  ) {
    super();
    this.SetTheQueryParamValues();
    this.InitializeSubjects();
    if (
      this.CustomerAppointmentId &&
      this.AppointmentBranchId &&
      !this.URLType
    ) {
      this.InitializeAppointmentConfirmationData();
    } else {
      if (this.router.snapshot['_routerState'].url != "/manage/appointment-scheduler") {
        this.InitializeExecutionalData();
      }
    }
    this.appointmentExistsSubject = new BehaviorSubject<boolean>(false);
    this.appointmentExists$ = this.appointmentExistsSubject.asObservable();
  }
  //#region  Property Declarations
  private SelectedPageSubject: BehaviorSubject<string>;
  SelectedPage$: Observable<string>;

  private SchedulerDataSubject: BehaviorSubject<ISchedulerData>;
  SchedulersData$: Observable<ISchedulerData>;

  private WorkflowDataSubject: BehaviorSubject<IWorkFlowDetail>;
  WorkFlowData$: Observable<IWorkFlowDetail>;

  private SubjectHoursOfOperationList: BehaviorSubject<any[]>;
  HoursOfOperationList$: Observable<any[]>;

  StepDetails$: Observable<IStepDetails>;
  private StepDetailsSubject: BehaviorSubject<IStepDetails>;

  NearestBranchList$: Observable<NearestBRanchListWithHOO[]>;
  private NearestBranchListSubject: BehaviorSubject<NearestBRanchListWithHOO[]>;

  NearestBranchDisplayData$: Observable<NearestBranchDisplayData[]>;
  private NearestBranchDisplayDataSubject: BehaviorSubject<
    NearestBranchDisplayData[]
  >;

  Miles$: Observable<IMiles[]>;
  private MilesSubject: BehaviorSubject<IMiles[]>;

  SchedulerServices$: Observable<ISchedularService[]>;
  private SchedulerServicesSubject: BehaviorSubject<ISchedularService[]>;

  WorkFlowServices$: Observable<ISchedularService[]>;
  private WorkFlowServicesSubject: BehaviorSubject<ISchedularService[]>;

  SchedulerFirstAvailableTimeSlot$: Observable<IFirstAvailable[]>;
  private SchedulerFirstAvailableTimeSlotSubject: BehaviorSubject<
    IFirstAvailable[]
  >;

  SchedulerSelectedDatesTimeSlot$: Observable<IFirstAvailable>;
  private SchedulerSelectedDatesTimeSlotSubject: BehaviorSubject<IFirstAvailable>;

  MinAvailableDate$: Observable<Date>;
  private MinAvailableDateSubjet: BehaviorSubject<Date>;

  WorkingDays$: Observable<WorkingDay[]>;
  private WorkingDaysSubject: BehaviorSubject<WorkingDay[]>;

  ShowCancelButton$: Observable<boolean>;
  private ShowCancelButtonSubject: BehaviorSubject<boolean>;

  ShowSubmitButton$: Observable<boolean>;
  private ShowSubmitButtonSubject: BehaviorSubject<boolean>;

  ShowContinueButton$: Observable<boolean>;
  private ShowContinueButtonSubject: BehaviorSubject<boolean>;

  IsModifiedAppointmentMode$: Observable<boolean>;
  private IsModifiedAppointmentModeSubject: BehaviorSubject<boolean>;

  AppointmentNotificationPreferences$: Observable<IAppointmentNotificationPreferences>;
  private AppointmentNotificationPreferencesSubject: BehaviorSubject<IAppointmentNotificationPreferences>;

  SchedulerExecutionalData$: Observable<ISchedulerExecutionalData>;
  private SchedulerExecutionalDataSubject: BehaviorSubject<ISchedulerExecutionalData>;

  ValidateOTP$: Observable<boolean>;
  private ValidateOTPSubject: BehaviorSubject<boolean>;

  ValidationMessage$: Observable<IValidationMessage>;
  private ValidationMessageSubject: BehaviorSubject<IValidationMessage>;

  CompanyId: string;
  SchedulerId: string;
  CurrentMapLocationSubject: BehaviorSubject<ILocation>;
  CurrentMapLocation$: Observable<ILocation>;

  AppointmentTexts$: Observable<AppointmentTextInterface>;
  private AppointmentTextsSubject: BehaviorSubject<AppointmentTextInterface>;

  TranslatedDays$: Observable<Object>;
  private TranslatedDaysSubject: BehaviorSubject<{}>;

  CustomerLocation: ILocation = {
    // REmove these
    lat: 0,
    lng: 0,
  };

  SearchedLocation: ILocation = null;
  SearchText: any;

  ControlType = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];
  URLType: string;
  AppointmentServiceId: string;
  AppointmentId: string;
  CustomerAppointmentId = null;
  AppointmentBranchId: string;
  CurrentDeviceId: string;

  QuestionValidations: {
    Type: any;
    Regex: any;
  }[];

  private SelectedLanguageSubject: BehaviorSubject<ICurrentLanguage>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  DefaultLanguageSubject: BehaviorSubject<string>;
  DefaultLanguage$: Observable<string>;

  LanguageSubject: BehaviorSubject<ISupportedLanguage[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;
  currentLanguage: string = 'en';
  languageUpdated = false;
  appointmentExistsSubject: BehaviorSubject<boolean>;
  appointmentExists$: Observable<boolean>;
  stopValidation = false;


  private SetTheQueryParamValues() {
    this.CompanyId = this.router.snapshot.queryParams['c-id'];
    this.AppointmentBranchId = this.router.snapshot.queryParams['b-id'];
    this.CustomerAppointmentId = this.router.snapshot.queryParams['a-id'];
    this.SchedulerId = this.router.snapshot.queryParams['s-id'];
    this.URLType = this.router.snapshot.queryParams['type'];
    this.AppointmentServiceId = this.router.snapshot.queryParams['as-id'];
    this.IsModifiedURL = this.router.snapshot.queryParams['modify'];
  }

  InitializeAppointmentConfirmationData() {
    if (this.IsModifiedURL && this.IsModifiedURL == 'true') {
      this.IsModifiedAppointmentModeSubject.next(true);
    }
    this.appointmentSchedulerAPIService
      .ConfirmAppointment<any, ISchedulerRequestData[] | ISchedulerRequestData>(
        this.CompanyId,
        {
          appointmentId: this.CustomerAppointmentId,
          branchId: this.AppointmentBranchId,
        }
      )
      .pipe(
        mergeMap((m: ISchedulerRequestData[] | ISchedulerRequestData) => {
          let data = null;
          if (Array.isArray(m)) {
            data = m[1];
          } else {
            data = m;
          }
          if (data.selectedLanguageId) {
            this.SelectedLanguageSubject.value.selectedLanguage = data.selectedLanguageId;
            this.SelectedLanguageSubject.next(Object.create(this.SelectedLanguageSubject.value));
            this.CallLanguageListAPI();
          }
          this.SetConfirmPageData(data);
          return this.appointmentSchedulerAPIService.GetExternalPublishedData<ISchedulerData>(
            this.CompanyId,
            data.confirmationPageDisplayData.schedulerTemplateId,
            true
          );
        })
      )
      .subscribe((x) => {
        this.SchedulerDataSubject.next(x);
        this.updateSchedulerAndWorkflowData(x)
        if (x) {
          this.ChangePage(AppointmentSchedulerPageName.SuccessPage);
        } else {
          this.ChangePage(AppointmentSchedulerPageName.CancelAppointmentPage);
        }
      });
  }



  private SetConfirmPageData(m: ISchedulerRequestData) {
    this.SchedulerExecutionalDataSubject.value.isDeleted =
      m.isCancelled || m.appointmentStatus === AppointmentStatus.CANCELED;
    this.SchedulerExecutionalDataSubject.value.appointmentStatus =
      m.appointmentStatus;
    for (
      let index = 0;
      index < m.confirmationPageDisplayData.descriptions.length;
      index++
    ) {
      if (isObject(m.confirmationPageDisplayData.descriptions[index])) {
        if (m.confirmationPageDisplayData.descriptions[index]?.id == 'AvailableServiceSelectionPage') {
          this.StepDetailsSubject.value.steps.find((step) => step.id == 'AvailableServiceSelectionPage').stepDescription =
            m.confirmationPageDisplayData.descriptions[index].description;
        } else if (m.confirmationPageDisplayData.descriptions[index]?.id == 'InformationGatheringPage') {
          this.StepDetailsSubject.value.steps.find((step) => step.id == 'InformationGatheringPage').stepDescription =
            m.confirmationPageDisplayData.descriptions[index].description;
        } else if (m.confirmationPageDisplayData.descriptions[index]?.id == 'NearestBranchSelectionPage') {
          this.StepDetailsSubject.value.steps.find((step) => step.id == 'NearestBranchSelectionPage').stepDescription =
            m.confirmationPageDisplayData.descriptions[index].description;
        } else if (m.confirmationPageDisplayData.descriptions[index]?.id == 'AppointmentSchedulePage') {
          this.StepDetailsSubject.value.steps.find((step) => step.id == 'AppointmentSchedulePage').stepDescription =
            m.confirmationPageDisplayData.descriptions[index].description;
        } else if (m.confirmationPageDisplayData.descriptions[index]?.id == 'AppointmentNotificationPreferencePage') {
          this.StepDetailsSubject.value.steps.find((step) => step.id == 'AppointmentNotificationPreferencePage').stepDescription =
            m.confirmationPageDisplayData.descriptions[index].description;
        }
      } else {
        this.StepDetailsSubject.value.steps[index].stepDescription = m.confirmationPageDisplayData.descriptions[index];
      }
    }
    this.SchedulerExecutionalDataSubject.value.branchName =
      m.confirmationPageDisplayData.branchName;
    this.SchedulerExecutionalDataSubject.value.id = m.id;
    this.SchedulerExecutionalDataSubject.value.appointmentUniqueIdentifier =
      m.confirmationPageDisplayData.appointmentUniqueIdentifier;
    this.SchedulerExecutionalDataSubject.value.serviceId = m.serviceId;
    this.AppointmentNotificationPreferencesSubject.value.emailAddress =
      m.notificationPreferences.email;
    this.AppointmentNotificationPreferencesSubject.value.isEmailAddressChecked =
      m.notificationPreferences.allowEmail;
    this.AppointmentNotificationPreferencesSubject.value.phoneNumber =
      m.notificationPreferences.smsNumber;
    this.AppointmentNotificationPreferencesSubject.value.isPhonNumberChecked =
      m.notificationPreferences.allowSMS;
    this.AppointmentNotificationPreferencesSubject.next(
      this.AppointmentNotificationPreferencesSubject.value
    );
    this.StepDetailsSubject.next(this.StepDetailsSubject.value);
    this.SchedulerExecutionalDataSubject.next(
      this.SchedulerExecutionalDataSubject.value
    );
  }

  InitializeSubjects() {
    this.SelectedPageSubject = new BehaviorSubject<string>(
      AppointmentSchedulerPageName.NearestBranchSelectionPage
    );
    this.SelectedPage$ = this.SelectedPageSubject.asObservable();

    this.CurrentMapLocationSubject = new BehaviorSubject<ILocation>(null);
    this.CurrentMapLocation$ = this.CurrentMapLocationSubject.asObservable();
    this.IsModifiedAppointmentModeSubject = new BehaviorSubject<boolean>(false);
    this.IsModifiedAppointmentMode$ =
      this.IsModifiedAppointmentModeSubject.asObservable();
    this.SchedulerDataSubject = new BehaviorSubject<ISchedulerData>(null);
    this.SchedulersData$ = this.SchedulerDataSubject.asObservable();
    this.WorkflowDataSubject = new BehaviorSubject<IWorkFlowDetail>(null);
    this.WorkFlowData$ = this.WorkflowDataSubject.asObservable();
    this.ValidateOTPSubject = new BehaviorSubject<boolean>(false);
    this.ValidateOTP$ = this.ValidateOTPSubject.asObservable();
    this.SubjectHoursOfOperationList = new BehaviorSubject<any[]>([]);
    this.HoursOfOperationList$ =
      this.SubjectHoursOfOperationList.asObservable();
    this.NearestBranchListSubject = new BehaviorSubject<
      NearestBRanchListWithHOO[]
    >([]);
    this.NearestBranchList$ = this.NearestBranchListSubject.asObservable();
    this.NearestBranchDisplayDataSubject = new BehaviorSubject<
      NearestBranchDisplayData[]
    >([]);
    this.NearestBranchDisplayData$ =
      this.NearestBranchDisplayDataSubject.asObservable();
    this.MilesSubject = new BehaviorSubject<IMiles[]>(this.GetMiles());
    this.Miles$ = this.MilesSubject.asObservable();
    this.SchedulerServicesSubject = new BehaviorSubject<ISchedularService[]>(
      []
    );
    this.SchedulerServices$ = this.SchedulerServicesSubject.asObservable();

    this.WorkFlowServicesSubject = new BehaviorSubject<ISchedularService[]>([]);
    this.WorkFlowServices$ = this.WorkFlowServicesSubject.asObservable();

    this.StepDetailsSubject = new BehaviorSubject<IStepDetails>(
      this.GetDefaultSteps()
    );
    this.StepDetails$ = this.StepDetailsSubject.asObservable();
    this.WorkingDaysSubject = new BehaviorSubject<WorkingDay[]>([]);
    this.WorkingDays$ = this.WorkingDaysSubject.asObservable();
    this.SchedulerFirstAvailableTimeSlotSubject = new BehaviorSubject<
      IFirstAvailable[]
    >([]);
    this.SchedulerFirstAvailableTimeSlot$ =
      this.SchedulerFirstAvailableTimeSlotSubject.asObservable();
    this.SchedulerSelectedDatesTimeSlotSubject =
      new BehaviorSubject<IFirstAvailable>(null);
    this.SchedulerSelectedDatesTimeSlot$ =
      this.SchedulerSelectedDatesTimeSlotSubject.asObservable();
    this.MinAvailableDateSubjet = new BehaviorSubject<Date>(null);
    this.MinAvailableDate$ = this.MinAvailableDateSubjet.asObservable();
    this.ShowCancelButtonSubject = new BehaviorSubject<boolean>(false);
    this.ShowCancelButton$ = this.ShowCancelButtonSubject.asObservable();
    this.ShowSubmitButtonSubject = new BehaviorSubject<boolean>(false);
    this.ShowSubmitButton$ = this.ShowSubmitButtonSubject.asObservable();
    this.ShowContinueButtonSubject = new BehaviorSubject<boolean>(true);
    this.ShowContinueButton$ = this.ShowContinueButtonSubject.asObservable();
    this.SchedulerExecutionalDataSubject =
      new BehaviorSubject<ISchedulerExecutionalData>(
        this.GetDefaultSchedulerExecutionData()
      );
    this.SchedulerExecutionalData$ =
      this.SchedulerExecutionalDataSubject.asObservable();
    this.ValidationMessageSubject = new BehaviorSubject<IValidationMessage>(
      this.GetDefaultMessages()
    );
    this.ValidationMessage$ = this.ValidationMessageSubject.asObservable();
    this.AppointmentNotificationPreferencesSubject =
      new BehaviorSubject<IAppointmentNotificationPreferences>(
        this.GetDEfaultNotificationPreferencesData()
      );
    this.AppointmentNotificationPreferences$ =
      this.AppointmentNotificationPreferencesSubject.asObservable();

    this.SelectedLanguageSubject = new BehaviorSubject(
      this.selectedLanguages
    );

    this.LanguageSubject = new BehaviorSubject<ISupportedLanguage[]>([]);
    this.LanguageList$ = this.LanguageSubject.asObservable();
    this.DefaultLanguageSubject = new BehaviorSubject(this.DefaultLanguageCode);
    this.DefaultLanguage$ = this.DefaultLanguageSubject.asObservable();
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
    this.AppointmentTextsSubject = new BehaviorSubject<AppointmentTextInterface>(this.getDefaultAppointmentTexts());
    this.AppointmentTexts$ = this.AppointmentTextsSubject.asObservable();
    this.TranslatedDaysSubject = new BehaviorSubject<Object>(this.defaultTranslatedDays)
    this.TranslatedDays$ = this.TranslatedDaysSubject.asObservable();

  }

  defaultTranslatedDays = {
    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday'
  }

  DefaultLanguageCode = Language.English;

  selectedLanguages = {
    selectedLanguage: 'en',
    defaultLanguage: 'en'
  }

  GetDEfaultNotificationPreferencesData(): IAppointmentNotificationPreferences {
    return {
      emailAddress: null,
      isEmailAddressChecked: false,
      isPhonNumberChecked: false,
      isTermsAndConditionChecked: false,
      phoneNumber: null,
    };
  }

  InitializeExecutionalData() {
    this.InitializeValidators();
    this.appointmentSchedulerAPIService
      .GetExternalPublishedData<ISchedulerData>(
        this.CompanyId,
        this.SchedulerId,
      )
      .subscribe((data: ISchedulerData) => {
        this.updateSchedulerAndWorkflowData(data);
      });
  }

  updateSchedulerAndWorkflowData(data: ISchedulerData) {
    const tabTexts = {
      serviceTabText: { en: 'Service' },
      informationTabText: { en: 'Information' },
      locationTabText: { en: 'Location' },
      appointmentTabText: { en: 'Appointment' },
      reviewTabText: { en: 'Review' }
    }
    const headingTexts = {
      serviceHeadingText: { en: 'Services Available' },
      informationHeadingText: { en: 'GENERAL QUESTIONS' },
      locationHeadingText: { en: 'Find Nearest Location' },
      appointmentHeadingText: { en: 'Schedule Appointment' },
      reviewHeadingText: { en: 'Appointment Notification Preferences' }
    }
    if (data.announcement && typeof (data.announcement.text) === 'string') {
      data.announcement.text = { en: data.announcement.text }
    }
    if (data.designerPanel && !data.designerPanel.primaryButtonText) {
      data.designerPanel.primaryButtonText = { en: 'Continue' }
    }
    if (data.designerPanel && !data.designerPanel.secondaryButtonText) {
      data.designerPanel.secondaryButtonText = { en: 'Back' }
    }
    if (data.designerPanel && !data.designerPanel.serviceTabText) {
      data.designerPanel.serviceTabText = tabTexts.serviceTabText;

    }
    if (data.designerPanel && !data.designerPanel.informationTabText) {
      data.designerPanel.informationTabText = tabTexts.informationTabText;

    }
    if (data.designerPanel && !data.designerPanel.locationTabText) {
      data.designerPanel.locationTabText = tabTexts.locationTabText;
    }
    if (data.designerPanel && !data.designerPanel.appointmentTabText) {
      data.designerPanel.appointmentTabText = tabTexts.appointmentTabText;
    }
    if (data.designerPanel && !data.designerPanel.reviewTabText) {
      data.designerPanel.reviewTabText = tabTexts.reviewTabText;

    }
    if (data.designerPanel && !data.designerPanel.informationHeadingText) {
      data.designerPanel.informationHeadingText = headingTexts.informationHeadingText;
    }
    if (data.designerPanel && !data.designerPanel.serviceHeadingText) {
      data.designerPanel.serviceHeadingText = headingTexts.serviceHeadingText;
    }
    if (data.designerPanel && !data.designerPanel.locationHeadingText) {
      data.designerPanel.locationHeadingText = headingTexts.locationHeadingText;
    }
    if (data.designerPanel && !data.designerPanel.appointmentHeadingText) {
      data.designerPanel.appointmentHeadingText = headingTexts.appointmentHeadingText;

    } if (data.designerPanel && !data.designerPanel.reviewHeadingText) {
      data.designerPanel.reviewHeadingText = headingTexts.reviewHeadingText;

    }
    if (!data.footerProperties) {
      data.footerProperties = {
        text: { en: '' },
        color: '#ef5555',
        backColor: '#ebebeb',
      }
    }
    this.SchedulerDataSubject.next(data);
    this.formService
      .CombineAPICall(this.GetWorkFlow(data), this.GetAllHorusOfOperation())
      .subscribe(([workflow, hooData]) => {
        this.WorkflowDataSubject.next(workflow);
        this.SubjectHoursOfOperationList.next(hooData);
        this.SetSchedulerServicesOfBranch(null);
        if (this.IsModifiedURL !== 'true') {
          if (
            this.CustomerAppointmentId &&
            (this.IsAuthenTicatedUser() || this.IsAuthenticatedUserByOTP())
          ) {
            this.AppointmentId = this.CustomerAppointmentId;
            this.OnUpdatingAppointment();
          } else {
            this.AppointmentId = this.uuid;
            this.LoadBranches();
          }
        }

      });
  }

  GetWorkFlow(data) {
    return this.workflowAPIService.GetExternalPublished<IWorkFlowDetail>(
      this.CompanyId,
      data.designerPanel.workflowId
    );
  }

  GetAllHorusOfOperation() {
    return this.hoursOfOperationAPIService.GetAllExternal(this.CompanyId);
  }

  private async LoadBranches() {
    if (
      this.SchedulerDataSubject.value.designerPanel.schedulerType ==
      SchedulerType.LocationFirst
    ) {
      await this.LoadNearestBranches(
        this.CustomerLocation.lat,
        this.CustomerLocation.lng,
        this.MilesSubject.value.find((x) => x.isSelected).value,
        true
      );
    } else {

      if (this.URLType == SharableLinkType.ABranch) {
        await this.LoadNearestBranches(null, null, null, true);
      } else {
        await this.LoadNearestBranches(
          this.CustomerLocation.lat,
          this.CustomerLocation.lng,
          this.MilesSubject.value.find((x) => x.isSelected).value,
          true
        );
        this.ChangeSchedulerSteps(
          this.SchedulerDataSubject.value.designerPanel.schedulerType
        );
      }
    }
    if (this.URLType == SharableLinkType.BranchAndService) {
      if (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst) {
        this.ChangeTheSChedulerStepsIfSchedulerURLIsOfBranchType(this.StepDetailsSubject.value);
        this.ChangeTheSChedulerStepsIfSchedulerURLIsOfServiceType(this.StepDetailsSubject.value, true);
      } else {
        this.ChangeTheSChedulerStepsIfSchedulerURLIsOfBranchType(this.StepDetailsSubject.value);
        this.ChangeTheSChedulerStepsIfSchedulerURLIsOfServiceType(this.StepDetailsSubject.value);
        this.SetTheAvailableAppointmentTimeSlots();
        this.ChangePage(AppointmentSchedulerPageName.AppointmentSchedulePage);
      }
    }
  }

  OnUpdatingAppointment() {

    this.appointmentSchedulerAPIService
      .GetAppointment<ISchedulerRequestData>(
        this.CompanyId,
        this.AppointmentBranchId,
        this.CustomerAppointmentId
      )
      .subscribe(async (data) => {
        if (data.selectedLanguageId) {
          this.SelectedLanguageSubject.value.selectedLanguage = data.selectedLanguageId;
          this.SelectedLanguageSubject.next(Object.create(this.SelectedLanguageSubject.value))
          this.CallLanguageListAPI();
          if (this.SelectedLanguageSubject.value.selectedLanguage !== 'en') {
            this.UpdateLanguage(this.SelectedLanguageSubject.value.selectedLanguage)
          }
        }
        await this.LoadNearestBranches(null, null, null, true, true);
        if (data.hoursOfOperationOverride) {
          this.SchedulerExecutionalDataSubject.value.hoursOfOperationOverride = data.hoursOfOperationOverride;
        }
        this.SchedulerExecutionalDataSubject.value.branchId = data.branchId;
        this.SchedulerExecutionalDataSubject.value.serviceId = data.serviceId;
        this.SchedulerExecutionalDataSubject.value.queueId =
          data.confirmationPageDisplayData.queueId;
        data.preServiceQuestions.forEach((x) => {
          const workflowGlobalQuestion =
            this.WorkflowDataSubject.value.preServiceQuestions.find(
              (v) => v.id == x.questionId
            );
          if (
            workflowGlobalQuestion &&
            workflowGlobalQuestion.isVisible &&
            !workflowGlobalQuestion.isActive
          ) {
            this.SchedulerExecutionalDataSubject.value.globalQuestion.push({
              answer: x.answer,
              itemId: x.questionId,
              itemText: workflowGlobalQuestion?.question.find(
                (x) => x.isDefault
              )?.question,
              required: workflowGlobalQuestion?.isRequired,
              isQuestionVisible: true,
              isVisible: workflowGlobalQuestion?.isVisible,
              itemTypeSetting: this.GetQuestionTypeSetting(
                workflowGlobalQuestion
              ),
              itemType: workflowGlobalQuestion?.type,
              setId: null,
            });
          }
        });
        // this.ChangePage(AppointmentSchedulerPageName.AppointmentNotificationPreferencePage);

        data.serviceQuestions.forEach((x) => {
          const workflowQuestionSet =
            this.WorkflowDataSubject.value.questionSets.find(
              (v) => v.id == x.questionSetId
            );
          if (workflowQuestionSet) {
            const workflowQuestionFromQuestionSet =
              workflowQuestionSet.questions.find((t) => t.id == x.questionId);
            if (
              workflowQuestionFromQuestionSet &&
              workflowQuestionFromQuestionSet.isVisible &&
              !workflowQuestionFromQuestionSet.isActive
            ) {
              this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.push(
                {
                  answer: x.answer,
                  itemId: x.questionId,
                  itemText: workflowQuestionFromQuestionSet.question.find(
                    (x) => x.isDefault
                  ).question,
                  required: workflowQuestionFromQuestionSet.isRequired,
                  isQuestionVisible: true,
                  isVisible: workflowQuestionFromQuestionSet.isVisible,
                  itemTypeSetting: this.GetQuestionTypeSetting(
                    workflowQuestionFromQuestionSet
                  ),
                  itemType: workflowQuestionFromQuestionSet.type,
                  setId: x.questionSetId,
                  sortPosition: 1,
                }
              );
              if (
                !this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids.find(
                  (r) => r == x.questionSetId
                )
              ) {
                this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids.push(
                  x.questionSetId
                );
              }
            }
          }
        });
        const questionSetIds =
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids;
        if (questionSetIds.length >= 1) {
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.currentQuestionSetId =
            questionSetIds[questionSetIds.length - 1];
          if (questionSetIds.length >= 2) {
            this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.previousQuestionSetId =
              questionSetIds[questionSetIds.length - 2];
          }
        }
        this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet
          .filter(
            (k) =>
              k.setId !==
              this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId
          )
          .map((j) => (j.isQuestionVisible = false));
        this.SchedulerExecutionalDataSubject.value.appointmentDate =
          data.appointmentDate;
        this.SchedulerExecutionalDataSubject.value.appointmentTime = {
          hours: data.appointmentTime.hours,
          minutes: data.appointmentTime.minutes,
        };
        await this.SetTheAvailableAppointmentTimeSlots();
        let isNearestSlot = false;
        this.SchedulerFirstAvailableTimeSlotSubject.value.find((x) => {
          if (
            x.selectedDateValue ==
            this.SchedulerExecutionalDataSubject.value.appointmentDate &&
            x.availableSpots.find(
              (m) =>
                m.value.hours ==
                this.SchedulerExecutionalDataSubject.value.appointmentTime
                  .hours &&
                m.value.minutes ==
                this.SchedulerExecutionalDataSubject.value.appointmentTime
                  .minutes
            )
          ) {
            isNearestSlot = true;
            return (x.availableSpots.find(
              (m) =>
                m.value.hours ==
                this.SchedulerExecutionalDataSubject.value.appointmentTime
                  .hours &&
                m.value.minutes ==
                this.SchedulerExecutionalDataSubject.value.appointmentTime
                  .minutes
            ).isSelected = true);
          }
        });
        if (isNearestSlot) {
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.firstAvailable =
            true;
          this.SchedulerFirstAvailableTimeSlotSubject.next(
            this.SchedulerFirstAvailableTimeSlotSubject.value
          );
        } else {
          await this.SendCurrentSelectedDayTimeSlots(
            new Date(this.SchedulerExecutionalDataSubject.value.appointmentDate)
          );
          if (this.SchedulerSelectedDatesTimeSlotSubject.value) {
            const appointment =
              this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.find(
                (m) =>
                  m.value.hours ==
                  this.SchedulerExecutionalDataSubject.value.appointmentTime
                    .hours &&
                  m.value.minutes ==
                  this.SchedulerExecutionalDataSubject.value.appointmentTime
                    .minutes
              );
            if (appointment) {
              appointment.isSelected = true;
            }
            this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectDifferentDate =
              true;
            this.SchedulerExecutionalDataSubject.value.appointmentDetails.firstAvailable =
              false;
            this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectedDate =
              new Date(
                this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue
              );
          }
        }
        this.ChangeSchedulerSteps(
          this.SchedulerDataSubject.value.designerPanel.schedulerType
        );
        this.SetConfirmPageData(data);

        const list = this.NearestBranchDisplayDataSubject.value.filter(
          (x) =>
            x.branchId == this.SchedulerExecutionalDataSubject.value.branchId
        );
        list[0].isBranchSelected = true;
        this.NearestBranchDisplayDataSubject.next(list);
        this.SchedulerServicesSubject.value.find(
          (c) =>
            c.itemId == this.SchedulerExecutionalDataSubject.value.serviceId
        ).isSelected = true;
        this.SchedulerServicesSubject.next(this.SchedulerServicesSubject.value);

        this.ChangePage(
          AppointmentSchedulerPageName.AppointmentNotificationPreferencePage
        );
      });
  }

  ChangeSchedulerSteps(value: string) {
    let label = null;
    const stepsData = this.GetDefaultSteps();
    if (this.URLType == SharableLinkType.All) {
      if (value == SchedulerType.LocationFirst) {
        label = 'NearestBranchSelectionPage';
        this.ChangeSchedulerStepPosition(stepsData, label);
        this.ChangePage(
          AppointmentSchedulerPageName.NearestBranchSelectionPage
        );
      } else if (value == SchedulerType.ServiceFirst) {
        label = 'AvailableServiceSelectionPage';
        this.ChangePage(
          AppointmentSchedulerPageName.AvailableServiceSelectionPage
        );
        this.ChangeSchedulerStepPosition(stepsData, label);
        this.CheckAvailableServicesAndSendThemToRespectiveNextPage();
      } else if (value == SchedulerType.QuestionFirst) {
        label = 'InformationGatheringPage';
        this.ChangePage(
          AppointmentSchedulerPageName.AvailableServiceSelectionPage
        );
        let labelName = this.SchedulerDataSubject.value.designerPanel.schedulerType ===
          SchedulerType.QuestionFirst ? 'InformationGatheringPage' : 'AvailableServiceSelectionPage';
        this.StepDetailsSubject.value.steps.find(
          (x) => x.id == this.SelectedPageSubject.value
        ).stepDescription = this.SchedulerServicesSubject.value[0].name;

        this.ChangeSchedulerStepPosition(this.StepDetailsSubject.value, labelName);
        this.CheckAvailableServicesAndSendThemToRespectiveNextPage();
      }
    } else if (this.URLType == SharableLinkType.ABranch) {
      this.ChangeTheSChedulerStepsIfSchedulerURLIsOfBranchType(stepsData);
    } else if (this.URLType == SharableLinkType.AService) {
      this.ChangeTheSChedulerStepsIfSchedulerURLIsOfServiceType(stepsData);
    }
  }
  private ChangeTheSChedulerStepsIfSchedulerURLIsOfServiceType(
    stepsData: IStepDetails,
    fromServiceAndBranch?: boolean
  ) {
    const serviceName = this.SchedulerServicesSubject.value.find(
      (x) => x.itemId == this.AppointmentServiceId)?.name;
    if (serviceName) {
      let labelName = this.SchedulerDataSubject.value.designerPanel.schedulerType ===
        SchedulerType.QuestionFirst ? 'InformationGatheringPage' : 'AvailableServiceSelectionPage';
      if (!fromServiceAndBranch) {
        this.ChangeSchedulerStepPosition(stepsData, labelName, true, serviceName);
      } else {
        const stepElementIndex = stepsData.steps.findIndex((x) => x.id == 'AvailableServiceSelectionPage');
        const stepElement = stepsData.steps.find((x) => x.id == 'AvailableServiceSelectionPage');
        stepElement.isDefaultSelected = true;
        stepElement.stepDescription = serviceName;
        stepsData.steps.splice(stepElementIndex, 1, stepElement);
        this.StepDetailsSubject.next(Object.create(stepsData));
      }

      this.SchedulerExecutionalDataSubject.value.serviceId = this.AppointmentServiceId;
      this.ChangePage(
        this.SchedulerDataSubject.value.designerPanel.schedulerType ===
          SchedulerType.QuestionFirst ? AppointmentSchedulerPageName.InformationGatheringPage :
          AppointmentSchedulerPageName.NearestBranchSelectionPage);
      this.StepDetailsSubject.next(this.StepDetailsSubject.value);
      this.SchedulerExecutionalDataSubject.next(
        this.SchedulerExecutionalDataSubject.value
      );
      if (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst) {
        this.showServiceQuestionsForInformationPage()
      }

    } else {
      this.AppNotificationService.NotifyErrorPersistant(
        SchedulerValidationMessages.UnAvailableService
      );
    }
  }

  private showServiceQuestionsForInformationPage() {
    if (this.WorkflowDataSubject.value.setting.enablePreServiceQuestions) {
      if (
        this.SchedulerExecutionalDataSubject.value.globalQuestion.length ===
        0
      ) {
        this.WorkflowDataSubject.value.preServiceQuestions
          .filter((s) => s.isVisible && !s.isDeleted)
          .forEach((x) => {
            this.SchedulerExecutionalDataSubject.value.globalQuestion.push({
              answer: null,
              itemId: x.id,
              itemText: x.question.find((x) => x.isDefault) ? x.question.find((x) => x.isDefault).question : null,
              required: x.isRequired,
              isQuestionVisible: true,
              isVisible: x.isVisible,
              itemTypeSetting: this.GetQuestionTypeSetting(x),
              itemType: x.type,
              setId: null,
            });
          });
      }
      this.ShowHideButtonOnPageChangeAndShouldDoRouting(AppointmentSchedulerPageName.InformationGatheringPage)
    } else {
      this.ShowServiceQuestionsOrSendToNotificationPage(AppointmentSchedulerPageName.InformationGatheringPage);
    }
  }

  private ChangeTheSChedulerStepsIfSchedulerURLIsOfBranchType(
    stepsData: IStepDetails
  ) {
    const branchLocation = this.NearestBranchDisplayDataSubject.value.find(
      (x) => x.branchId == this.AppointmentBranchId
    )?.branchAddress;
    this.ChangeSchedulerStepPosition(
      stepsData,
      'NearestBranchSelectionPage',
      true,
      branchLocation
    );
    this.SchedulerExecutionalDataSubject.value.branchId =
      this.AppointmentBranchId;
    this.ChangePage(AppointmentSchedulerPageName.AvailableServiceSelectionPage);
    this.CheckAvailableServicesAndSendThemToRespectiveNextPage();
    this.SchedulerExecutionalDataSubject.next(
      this.SchedulerExecutionalDataSubject.value
    );
  }

  private ChangeSchedulerStepPosition(
    stepsData: IStepDetails,
    label: string,
    isDefaultSelected?: boolean,
    data?: string
  ) {
    if (label === 'InformationGatheringPage') {
      const stepElementIndex = stepsData.steps.findIndex((x) => x.id == label);
      const stepElement = stepsData.steps.find((x) => x.id == label);
      stepsData.steps.splice(stepElementIndex, 1);
      const serviceElementIndex = stepsData.steps.findIndex((x) => x.id == 'AvailableServiceSelectionPage');
      const serviceElement = stepsData.steps.find((x) => x.id == 'AvailableServiceSelectionPage');
      stepsData.steps.splice(serviceElementIndex, 1);
      if (isDefaultSelected) {
        serviceElement.isDefaultSelected = true;
        serviceElement.stepDescription = data;
      }
      stepsData.steps.unshift(serviceElement, stepElement);
      this.StepDetailsSubject.next(Object.create(stepsData));
    } else if (
      label === "NearestBranchSelectionPage" &&
      this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
    ) {
      const informationElementIndex = stepsData.steps.findIndex((x) => x.id == 'InformationGatheringPage');
      const informationElement = stepsData.steps.find((x) => x.id == 'InformationGatheringPage');
      stepsData.steps.splice(informationElementIndex, 1);
      const appointmentElementIndex = stepsData.steps.findIndex((x) => x.id == 'AppointmentSchedulePage');
      stepsData.steps.splice(appointmentElementIndex, 0, informationElement);
      const stepElementIndex = stepsData.steps.findIndex((x) => x.id == label);
      const stepElement = stepsData.steps.find((x) => x.id == label);
      stepsData.steps.splice(stepElementIndex, 1);
      if (isDefaultSelected) {
        stepElement.isDefaultSelected = true;
        stepElement.stepDescription = data;
      }
      stepsData.steps.unshift(stepElement);
      this.StepDetailsSubject.next(Object.create(stepsData));
    } else {
      const stepElementIndex = stepsData.steps.findIndex((x) => x.id == label);
      const stepElement = stepsData.steps.find((x) => x.id == label);

      stepsData.steps.splice(stepElementIndex, 1);
      if (isDefaultSelected) {
        stepElement.isDefaultSelected = true;
        stepElement.stepDescription = data;
      }
      stepsData.steps.unshift(stepElement);
      this.StepDetailsSubject.next(Object.create(stepsData));
    }

  }

  VerifyOTP(otp) {
    this.appointmentSchedulerAPIService
      .VerifyOTP<{ token: string }, any>(
        this.SchedulerDataSubject.value.companyId,
        {
          appointmentId:
            this.SchedulerExecutionalDataSubject.value.id || this.AppointmentId,
          browserId: this.CurrentDeviceId,
          otp: Number(otp),
        }
      )
      .subscribe((x) => {
        if (x && x.token) {
          this.browserStorageService.SetAppointmentVerificationToken(x.token);
          this.zone.run(() =>
            this.routeHandlerService.Redirect(
              `/scheduler-execution`,
              {
                'c-id': this.SchedulerDataSubject.value.companyId,
                's-id': this.SchedulerDataSubject.value.schedulerId,
                type: 'ABS',
                'a-id': this.SchedulerExecutionalDataSubject.value.id,
                'b-id': this.AppointmentBranchId,
                'as-id': this.AppointmentServiceId,
              },
              true
            )
          );
        } else {
          this.AppNotificationService.NotifyErrorPersistant(
            this.AppointmentTextsSubject.value.appointmentInvalidOTPMessage
          );
        }
      });
  }

  SendOTP() {
    this.CurrentDeviceId = this.uuid;
    this.appointmentSchedulerAPIService
      .SendOTP<boolean, any>(this.SchedulerDataSubject.value.companyId, {
        appointmentId:
          this.SchedulerExecutionalDataSubject.value.id || this.AppointmentId,
        browserId: this.CurrentDeviceId,
        branchId:
          this.AppointmentBranchId ||
          this.SchedulerExecutionalDataSubject.value.branchId,
      })
      .subscribe((x) => {
        if (x) {
          this.AppNotificationService.Notify(
            this.AppointmentTextsSubject.value.appointmentOTPAuthenticationMessage
          );
        }
      });
  }
  //#endregion

  //#region Executable Functions
  AskNavigatorForCurrentLocationOfCustomer() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.SetCustomerCurrentPosition(position);
        },
        (error) => {
          // alert(error);
        }
      );
    } else {
      console.log('Geolocation not supported by browser.');
    }
  }

  SetCustomerCurrentPosition(position) {
    if (
      this.SchedulerDataSubject.value &&
      this.URLType != SharableLinkType.ABranch
    ) {
      this.CustomerLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.CurrentMapLocationSubject.next(this.CustomerLocation);
      this.LoadNearestBranches(
        this.CustomerLocation.lat,
        this.CustomerLocation.lng,
        this.MilesSubject.value.find((x) => x.isSelected).value
      );
    } else if (this.URLType == SharableLinkType.All) {
      this.CustomerLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.CurrentMapLocationSubject.next(this.CustomerLocation);
      this.LoadNearestBranches(
        this.CustomerLocation.lat,
        this.CustomerLocation.lng,
        this.MilesSubject.value.find((x) => x.isSelected).value
      );
    }

  }

  async LoadNearestBranches(
    lat: number,
    lng: number,
    miles: number,
    isInitialFunctionCAll?: boolean,
    isAllBranchesNeeded?: boolean
  ) {
    if (
      (lat && lng) ||
      this.URLType == SharableLinkType.ABranch ||
      this.URLType == SharableLinkType.BranchAndService ||
      isAllBranchesNeeded
    ) {
      await new Promise((resolve, reject) => {
        this.appointmentSchedulerAPIService
          .GetExternalNearestBranchList<NearestBRanchListWithHOO>(
            this.SchedulerDataSubject.value?.companyId || null,
            this.SchedulerDataSubject.value?.designerPanel.workflowId || null,
            this.SchedulerExecutionalDataSubject.value.serviceId,
            lat,
            lng,
            miles
          )
          .subscribe((branches: NearestBRanchListWithHOO[]) => {
            this.NearestBranchListSubject.next(branches);
            const nearestBranches =
              this.GetMapNearestBranchDisplayData(branches);
            if (nearestBranches.length) {
              const languageId = this.SelectedLanguageSubject.getValue().selectedLanguage;
              this.translateHoursOfOperationTexts(languageId, true);
            }
            this.NearestBranchDisplayDataSubject.next(nearestBranches);
            if (isInitialFunctionCAll) {

              if (!this.CustomerAppointmentId) {
                this.ChangeSchedulerSteps(
                  this.SchedulerDataSubject.value.designerPanel.schedulerType
                );
              }

            }
            resolve(branches);
          });
      });
    } else {
      this.NearestBranchListSubject.next([]);
      this.NearestBranchDisplayDataSubject.next([]);
    }
  }

  GetMapNearestBranchDisplayData(
    branches: NearestBRanchListWithHOO[]
  ): NearestBranchDisplayData[] {
    const nearestBranch: NearestBranchDisplayData[] = [];
    branches.forEach((x) => {
      nearestBranch.push({
        branchAddress: x.branchAddress,
        branchDistance: x.branchDistance,
        branchId: x.branchId,
        countryCode: x.countryCode,
        branchName: x.branchName,
        branchPhoneNumber: x.branchPhoneNumber,
        branchServices: this.GetAndSetAvailableBranchServiceNames(
          x.branchServices,
          x.branchId
        ),
        workingHours: this.GetWorkingHours(
          x.hoursOfOperation,
          x.exceptionalHoursOfOperation
        ),
        isBranchSelected:
          x.branchId == this.SchedulerExecutionalDataSubject.value.branchId,
        isPreviouslyVisited: false,
        milesInDistance: null,
        branchLatitude: x.branchLatitude,
        branchLongitude: x.branchLongitude,
      });
    });
    return nearestBranch;
  }

  GetWorkingHours(
    hoursOfOperation: BranchHoursOfOperation,
    exceptionalHoursOfOperation: BranchHoursOfOperation
  ): BranchWorkingTime[] {
    const workingHours: BranchWorkingTime[] = [];
    const currentHoursOfOperation =
      this.GetCurrentHourOfOperationBasedOnCurrentDate(
        exceptionalHoursOfOperation,
        hoursOfOperation
      );
    if (currentHoursOfOperation) {
      Object.keys(currentHoursOfOperation.workingHours).forEach((element) => {
        workingHours.push({
          day: currentHoursOfOperation.workingHours[element].dayText,
          time: currentHoursOfOperation.workingHours[element]
            .availableTimeFrames,
          isOpen: currentHoursOfOperation.workingHours[element].isOpen,
        });
      });
    }
    return workingHours;
  }

  private GetCurrentHourOfOperationBasedOnCurrentDate(
    exceptionalHoursOfOperation: BranchHoursOfOperation,
    hoursOfOperation: BranchHoursOfOperation
  ) {
    let currentHoursOfOperation: BranchHoursOfOperation = null;
    if (
      exceptionalHoursOfOperation &&
      new Date() > new Date(exceptionalHoursOfOperation.fromDate) &&
      new Date() < new Date(exceptionalHoursOfOperation.toDate)
    ) {
      currentHoursOfOperation = exceptionalHoursOfOperation;
    } else {
      currentHoursOfOperation = hoursOfOperation;
    }
    return currentHoursOfOperation;
  }

  GetAndSetAvailableBranchServiceNames(
    branchServicesIds: string[],
    branchId: string
  ): string[] {
    const services: any[] = [];
    const availableServices = [];
    const workflowServices = this.WorkflowDataSubject.value.services?.filter(
      (x) => !x.isDeleted
    );
    branchServicesIds.forEach((x) => {
      if (
        workflowServices.find((m) => m.id == x) &&
        workflowServices.find((m) => m.id == x).acceptAppointments
      ) {
        const obj = {
          name: workflowServices
            .find((m) => m.id == x)
            .serviceNames.find((x) => x.isDefault).serviceName,
          id: workflowServices
            .find((m) => m.id == x).id
        }
        services.push(obj);
        if (this.SchedulerServicesSubject.value.find((t) => t.itemId == x)) {
          availableServices.push(
            this.SchedulerServicesSubject.value.find((t) => t.itemId == x)
          );
        }
      }
    });
    if (branchServicesIds.length == 0) {
      // Note: If branchServiceIds length is 0 means workflow all service access for branch
      workflowServices.forEach((service) => {
        if (service.acceptAppointments) {
          const obj = {
            name: service.serviceNames.find((x) => x.isDefault).serviceName,
            id: service.id
          }
          services.push(obj);
          // services.push(
          //   service.serviceNames.find((x) => x.isDefault).serviceName
          // );
          if (
            this.SchedulerServicesSubject.value.find(
              (t) => t.itemId == service.id
            )
          ) {
            availableServices.push(
              this.SchedulerServicesSubject.value.find(
                (t) => t.itemId == service.id
              )
            );
          }
        }
      });
    }
    if (
      this.SchedulerDataSubject.value.designerPanel.schedulerType ==
      SchedulerType.ServiceFirst &&
      this.URLType == SharableLinkType.ABranch &&
      this.AppointmentBranchId == branchId
    ) {
      this.SchedulerServicesSubject.next(availableServices);
    }
    return services;
  }

  ChangePage(pageName: string) {
    if (this.ShowHideButtonOnPageChangeAndShouldDoRouting(pageName)) {
      if (pageName == AppointmentSchedulerPageName.AvailableServiceSelectionPage && this.SchedulerExecutionalDataSubject.value.branchId) {
        this.SetBranchServices(this.SchedulerExecutionalDataSubject.value.branchId);
      } else {
        this.SchedulerServicesSubject.next(this.SchedulerServicesSubject.value);
      }
      this.ClearMessageAfterPageChange();
      this.SelectedPageSubject.next(pageName);
    }
  }

  SetBranchServices(BranchId: string) {
    const BranchServicesIds = this.NearestBranchListSubject.value.find(
      (Branch) => Branch.branchId === BranchId
    )?.branchServices;
    const BranchServices = [];

    if (BranchServicesIds && BranchServicesIds.length > 0) {
      BranchServicesIds.forEach((ServiceId) => {
        const service = this.WorkFlowServicesSubject.value.find(
          (service) => service.itemId === ServiceId
        )
        if (service) {
          BranchServices.push(
            service
          );
        }
      });
      this.SchedulerServicesSubject.next(BranchServices);
    } else {
      this.SchedulerServicesSubject.next(this.WorkFlowServicesSubject.value);
    }
  }

  UpdateBranchServices(BranchId: string, Name: string) {
    const BranchServicesIds = this.NearestBranchListSubject.value.find(
      (Branch) => Branch.branchId === BranchId
    ).branchServices;
    const BranchServices = [];

    if (BranchServicesIds.length > 0) {
      BranchServicesIds.forEach((ServiceId) => {
        BranchServices.push(
          this.WorkFlowServicesSubject.value.find(
            (service) => service.itemId === ServiceId
          )
        );
      });
      this.SchedulerServicesSubject.next(BranchServices);
    } else {
      this.SchedulerServicesSubject.next(this.WorkFlowServicesSubject.value);
    }
  }

  private ClearMessageAfterPageChange() {
    this.ValidationMessageSubject.next({
      message: '',
      showValidationMessage: false,
    });
  }

  ShowHideButtonOnPageChangeAndShouldDoRouting(pageName: string) {
    let doRouting = true;
    if (pageName == AppointmentSchedulerPageName.AppointmentSchedulePage) {
      if (this.URLType == SharableLinkType.BranchAndService) {
        if (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst) {
          this.ShowCancelButtonSubject.next(true);
        } else {
          this.ShowCancelButtonSubject.next(false);
          this.ShowContinueButtonSubject.next(true);
          this.ShowSubmitButtonSubject.next(false);
        }
      } else if (
        this.URLType == SharableLinkType.ABranch &&
        this.SchedulerServicesSubject.value.length == 1
        && this.SchedulerDataSubject.value.designerPanel.schedulerType !== SchedulerType.QuestionFirst
      ) {
        this.ShowCancelButtonSubject.next(false);
      } else {
        this.ShowCancelButtonSubject.next(true);
      }
      this.ShowContinueButtonSubject.next(true);
      this.ShowSubmitButtonSubject.next(false);
    } else if (
      pageName == AppointmentSchedulerPageName.AvailableServiceSelectionPage &&
      (this.SchedulerDataSubject.value.designerPanel.schedulerType ==
        SchedulerType.ServiceFirst ||
        this.SchedulerDataSubject.value.designerPanel.schedulerType ===
        SchedulerType.QuestionFirst)
    ) {
      this.ShowCancelButtonSubject.next(false);
      this.ShowContinueButtonSubject.next(true);
    } else if (
      pageName == AppointmentSchedulerPageName.AvailableServiceSelectionPage
    ) {
      if (this.URLType == SharableLinkType.ABranch) {
        this.ShowCancelButtonSubject.next(false);
        this.ShowContinueButtonSubject.next(true);
      } else {
        this.ShowCancelButtonSubject.next(true);
        this.ShowContinueButtonSubject.next(true);
      }
    } else if (
      pageName == AppointmentSchedulerPageName.InformationGatheringPage
    ) {
      if (
        this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
        && this.URLType === SharableLinkType.BranchAndService
      ) {
        this.ShowCancelButtonSubject.next(false);
        this.ShowSubmitButtonSubject.next(false);
        this.ShowContinueButtonSubject.next(true);
      } else if (
        this.WorkflowDataSubject.value.setting.enablePreServiceQuestions ||
        this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet
          .length !== 0
      ) {
        if (this.SchedulerDataSubject.value.designerPanel.schedulerType ===
          SchedulerType.QuestionFirst && this.URLType == SharableLinkType.AService) {
          this.ShowCancelButtonSubject.next(false);
          this.ShowSubmitButtonSubject.next(false);
          this.ShowContinueButtonSubject.next(true);
        } else {
          this.ShowCancelButtonSubject.next(true);
          this.ShowSubmitButtonSubject.next(false);
          this.ShowContinueButtonSubject.next(true);
        }
      } else {
        if (
          this.URLType == SharableLinkType.ABranch &&
          this.SchedulerServicesSubject.value.length == 1
        ) {
          this.ShowCancelButtonSubject.next(false);
        } else {
          this.ShowCancelButtonSubject.next(true);
        }
        this.ShowContinueButtonSubject.next(true);
        this.ShowSubmitButtonSubject.next(false);
        this.SelectedPageSubject.next(
          AppointmentSchedulerPageName.AppointmentSchedulePage
        );
        doRouting = false;
      }
    } else if (
      pageName ==
      AppointmentSchedulerPageName.AppointmentNotificationPreferencePage
    ) {
      this.ShowSubmitButtonSubject.next(
        this.EnableSubmitAppointmentNotificationPreferencePage()
      );
      this.ShowCancelButtonSubject.next(true);
      this.ShowContinueButtonSubject.next(false);
    } else if (
      pageName == AppointmentSchedulerPageName.NearestBranchSelectionPage &&
      (this.SchedulerDataSubject.value.designerPanel.schedulerType ==
        SchedulerType.ServiceFirst ||
        this.SchedulerDataSubject.value.designerPanel.schedulerType ==
        SchedulerType.QuestionFirst
      )
    ) {
      if (
        (this.URLType == SharableLinkType.AService ||
          this.SchedulerServicesSubject.value.length == 1)
        && this.SchedulerDataSubject.value.designerPanel.schedulerType !==
        SchedulerType.QuestionFirst
      ) {
        this.ShowCancelButtonSubject.next(false);
        this.ShowContinueButtonSubject.next(true);
      } else {
        this.ShowCancelButtonSubject.next(true);
        this.ShowContinueButtonSubject.next(true);
      }
    } else if (
      pageName == AppointmentSchedulerPageName.NearestBranchSelectionPage
    ) {
      this.ShowCancelButtonSubject.next(false);
      this.ShowContinueButtonSubject.next(true);
    }
    return doRouting;
  }
  EnableSubmitAppointmentNotificationPreferencePage(): boolean {
    return this.SchedulerDataSubject.value.ticketProperties.enableTermsConditions === EnableTermsConditions.NO ? true : false;
  }
  GetQuestionTypeSetting(question: IWorkFlowQuestionData) {
    switch (question.type) {
      case QuestionType.DropDown.value:
        return this.GetQuestionOptions(question);
      case QuestionType.MultiSelect.value:
        return this.GetQuestionOptions(question);
      case QuestionType.Options.value:
        return this.GetQuestionOptions(question);
      default:
        return question.typeSetting;
    }
  }

  GetQuestionOptions(question: IWorkFlowQuestionData) {
    const itemTypeSettings = [];
    question.typeSetting.forEach((element) => {
      itemTypeSettings.push(element.find((lang) => lang.isDefault)?.option);
    });
    return itemTypeSettings;
  }

  ChangeMiles(miles: number) {
    this.MilesSubject.value.map((x) => {
      x.isSelected = false;
    });
    this.MilesSubject.value.find((x) => x.value == miles).isSelected = true;
    this.MilesSubject.next(Object.create(this.MilesSubject.value));
    this.SearchBranchListBySearchText();
  }

  ChangeService(service) {
    this.UpdateStepSetSchedulerServiceIdAfterServiceSelectionChange(service);
    this.SchedulerServicesSubject.next(
      Object.create(this.SchedulerServicesSubject.value)
    );
    this.SchedulerFirstAvailableTimeSlotSubject.next([]);
  }

  private UpdateStepSetSchedulerServiceIdAfterServiceSelectionChange(
    serviceId: any
  ) {
    this.SchedulerExecutionalDataSubject.value.serviceId = serviceId;
    this.SchedulerServicesSubject.value.map((x) => {
      if (x) {
        x.isSelected = false;
      }
    });
    let findSchedulerServicesSubject: any = this.SchedulerServicesSubject.value.find(

      (x) => x?.itemId == serviceId
    )

    if (findSchedulerServicesSubject) {
      findSchedulerServicesSubject.isSelected = true;
    }
    this.StepDetailsSubject.value.steps.find(
      (x) => x.id == this.SelectedPageSubject.value
    ).stepDescription = this.SchedulerServicesSubject.value.find(
      (x) => x?.itemId == serviceId
    )?.name;
  }

  SelectAvailableSlots(time: ITime) {
    let previousTimeSlot = null;
    let previousSlotDate = null;
    const currentSlotTime = time;
    let currentSlotDate = null;
    let previouslySelectedSpots = null;
    this.SchedulerFirstAvailableTimeSlotSubject.value.forEach((x) => {
      const spots = x.availableSpots.find((n) => n.value == time);
      previouslySelectedSpots = x.availableSpots.find((x) => x.isSelected);
      if (spots) {
        currentSlotDate = x.selectedDateValue;
      }
      if (previouslySelectedSpots) {
        previousTimeSlot = previouslySelectedSpots.value;
        previousSlotDate = x.selectedDateValue;
      }
    });
    if (!previousTimeSlot && !previousSlotDate) {
      if (this.SchedulerSelectedDatesTimeSlotSubject.value) {
        const previouslySelectedDatesSpots =
          this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.find(
            (x) => x.isSelected
          );
        if (previouslySelectedDatesSpots) {
          previousTimeSlot = previouslySelectedDatesSpots.value;
          previousSlotDate =
            this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue;
        }
      }
    }
    const slotData: IAppointmentSlotRequest = {
      previousSlotTime: previousTimeSlot,
      previousSlotDate,
      currentSlotTime: {
        hours: currentSlotTime.hours,
        minutes: currentSlotTime.minutes,
      },
      currentSlotDate,
      appointmentId: this.AppointmentId,
      workflowId: this.SchedulerDataSubject.value.designerPanel.workflowId,
      branchId: this.SchedulerExecutionalDataSubject.value.branchId,
      serviceId: this.SchedulerExecutionalDataSubject.value.serviceId,
    };

    const previousSlotString = getSlotString(
      slotData.previousSlotDate,
      slotData.previousSlotTime
    );
    const currentSlotString = getSlotString(
      slotData.currentSlotDate,
      slotData.currentSlotTime
    );
    if (previousSlotString == currentSlotString) {
      return;
    }
    this.SendLockAppointmentAPICall(slotData, previouslySelectedSpots, time);
  }

  private SendLockAppointmentAPICall(
    slotData: IAppointmentSlotRequest,
    previouslySelectedSpots: any,
    time: ITime
  ) {
    this.loadingService.showLoading();
    this.appointmentSchedulerAPIService
      .LockAppointments<IAppointmentSlotRequest, IAppointmentSlotRequest>(
        this.SchedulerDataSubject.value.companyId,
        slotData
      )
      .pipe(delay(1000))
      .subscribe((data) => {
        if (data) {
          if (
            !previouslySelectedSpots &&
            this.SchedulerSelectedDatesTimeSlotSubject.value
          ) {
            this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.map(
              (x) => (x.isSelected = false)
            );
          }
          this.SchedulerFirstAvailableTimeSlotSubject.value.forEach((x) => {
            x.availableSpots.map((m) => (m.isSelected = false));
            const spots = x.availableSpots.find((n) => n.value == time);
            if (spots) {
              spots.isSelected = true;
              this.SchedulerExecutionalDataSubject.value.appointmentTime =
                spots.value;
              this.SchedulerExecutionalDataSubject.value.appointmentDate =
                x.selectedDateValue;
              this.UpdateStepSetSchedulerServiceIdAfterSelectingSlots(
                x.selectedDateText,
                spots.text
              );
            }
          });
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectDifferentDate =
            false;
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.firstAvailable =
            true;
          this.SchedulerExecutionalDataSubject.next(
            this.SchedulerExecutionalDataSubject.value
          );

          this.SchedulerFirstAvailableTimeSlotSubject.next(
            Object.create(this.SchedulerFirstAvailableTimeSlotSubject.value)
          );
          if (this.SchedulerSelectedDatesTimeSlotSubject.value) {
            this.SchedulerSelectedDatesTimeSlotSubject.next(
              Object.create(this.SchedulerSelectedDatesTimeSlotSubject.value)
            );
          }
        }

        this.loadingService.hideLoading();
      });
  }

  private UpdateStepSetSchedulerServiceIdAfterSelectingSlots(date, time) {
    this.StepDetailsSubject.value.steps.find(
      (x) => x.id == this.SelectedPageSubject.value
    ).stepDescription = date + ' at ' + time;
    this.StepDetailsSubject.next(this.StepDetailsSubject.value);
    this.translateSpecificTexts(this.SelectedLanguageSubject.getValue().selectedLanguage, true);
  }
  SelectSelectedDatesSlots(time: ITime) {
    let previousTimeSlot = null;
    let previousSlotDate = null;
    const currentSlotTime = time;
    let currentSlotDate = null;

    currentSlotDate =
      this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue;
    const previouslySelectedSpots =
      this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.find(
        (x) => x.isSelected
      );
    if (previouslySelectedSpots) {
      previousTimeSlot = previouslySelectedSpots.value;
      previousSlotDate =
        this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue;
    }
    if (!previousTimeSlot && !previousSlotDate) {
      if (this.SchedulerSelectedDatesTimeSlotSubject.value) {
        this.SchedulerFirstAvailableTimeSlotSubject.value.forEach((x) => {
          const previouslySelectedSpotsOfAvailableslots = x.availableSpots.find(
            (x) => x.isSelected
          );
          if (previouslySelectedSpotsOfAvailableslots) {
            previousTimeSlot = previouslySelectedSpotsOfAvailableslots.value;
            previousSlotDate = x.selectedDateValue;
          }
        });
      }
    }
    const slotData: IAppointmentSlotRequest = {
      previousSlotTime: previousTimeSlot,
      previousSlotDate,
      currentSlotTime: {
        hours: currentSlotTime.hours,
        minutes: currentSlotTime.minutes,
      },
      currentSlotDate,
      appointmentId: this.AppointmentId,
      workflowId: this.SchedulerDataSubject.value.designerPanel.workflowId,
      branchId: this.SchedulerExecutionalDataSubject.value.branchId,
      serviceId: this.SchedulerExecutionalDataSubject.value.serviceId,
    };
    this.loadingService.showLoading();
    this.appointmentSchedulerAPIService
      .LockAppointments<IAppointmentSlotRequest, IAppointmentSlotRequest>(
        this.SchedulerDataSubject.value.companyId,
        slotData
      )
      .pipe(delay(1000))
      .subscribe((data) => {
        if (data) {
          if (
            !previouslySelectedSpots &&
            this.SchedulerFirstAvailableTimeSlotSubject.value
          ) {
            this.SchedulerFirstAvailableTimeSlotSubject.value.forEach((x) => {
              x.availableSpots.map((x) => (x.isSelected = false));
            });
          }
          this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.map(
            (m) => (m.isSelected = false)
          );

          const spots =
            this.SchedulerSelectedDatesTimeSlotSubject.value.availableSpots.find(
              (n) => n.value == time
            );
          spots.isSelected = true;
          this.SchedulerExecutionalDataSubject.value.appointmentTime =
            spots.value;
          this.SchedulerExecutionalDataSubject.value.appointmentDate =
            this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue;
          this.UpdateStepSetSchedulerServiceIdAfterSelectingSlots(
            this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateText,
            spots.text
          );
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectDifferentDate =
            true;
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.firstAvailable =
            false;
          this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectedDate =
            new Date(
              this.SchedulerSelectedDatesTimeSlotSubject.value.selectedDateValue
            );
          this.SchedulerExecutionalDataSubject.next(
            this.SchedulerExecutionalDataSubject.value
          );
          if (this.SchedulerFirstAvailableTimeSlotSubject.value) {
            this.SchedulerFirstAvailableTimeSlotSubject.next(
              Object.create(this.SchedulerFirstAvailableTimeSlotSubject.value)
            );
          }
          this.SchedulerSelectedDatesTimeSlotSubject.next(
            Object.create(this.SchedulerSelectedDatesTimeSlotSubject.value)
          );
        }
        this.loadingService.hideLoading();
      });
  }

  DifferentDateSelectionButtonClick() {
    const firstAvailableDay = this.GetFirstAvailableDay();
    this.SendCurrentSelectedDayTimeSlots(firstAvailableDay);
    this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectedDate =
      firstAvailableDay;
    this.SchedulerExecutionalDataSubject.next(
      this.SchedulerExecutionalDataSubject.value
    );
  }

  GetFirstAvailableDay() {
    const firstAvailable = this.SchedulerFirstAvailableTimeSlotSubject.value;
    const appointmentTemplate = this.WorkflowDataSubject.value.services.find((service) => !service.isDeleted && service.id === this.AppointmentServiceId)?.appointmentTemplate
    const appointmentSetting = this.WorkflowDataSubject.value?.appointmentTemplates?.find((appointment) => appointment.id === appointmentTemplate?.id)
    if (firstAvailable && firstAvailable.length > 0) {
      const startDate = new Date(firstAvailable[0].selectedDateValue);
      this.MinAvailableDateSubjet.next(startDate);
      return new Date(startDate);
    }
    const startDate = new Date();
    if (appointmentSetting && appointmentSetting.bookInBefore) {
      if (appointmentSetting.bookInBeforeType === 'Hours') {
        startDate.setTime(startDate.getTime() + appointmentSetting.bookInBefore * 3600000);
      } else {
        startDate.setTime(startDate.getTime() + appointmentSetting.bookInBefore * 24 * 3600000);
      }
    }
    this.MinAvailableDateSubjet.next(startDate);
    return startDate;
  }

  OnFirstAvailableSelectionButtonClick() {
    this.SetTheAvailableAppointmentTimeSlots();
  }
  async AppointmentDateSelectionChange(date: Date) {
    await this.SendCurrentSelectedDayTimeSlots(date);
  }
  private async SendCurrentSelectedDayTimeSlots(todaysDate: Date) {
    return new Promise((resolve, reject) => {
      this.appointmentSchedulerAPIService
        .SelectBranchForAppointment<IFirstAvailable, ISchedulerExecutionalData>(
          this.SchedulerDataSubject.value.companyId,
          this.SchedulerExecutionalDataSubject.value.branchId,
          this.SchedulerDataSubject.value.designerPanel.workflowId,
          this.SchedulerExecutionalDataSubject.value.serviceId,
          this.SchedulerExecutionalDataSubject.value
        )
        .subscribe((data: any) => {
          this.SchedulerExecutionalDataSubject.next(data);
          this.appointmentSchedulerAPIService
            .GetAvailableSlots<IFirstAvailable, ISchedulerExecutionalData>(
              this.SchedulerDataSubject.value.companyId,
              this.SchedulerExecutionalDataSubject.value.branchId,
              this.SchedulerDataSubject.value.designerPanel.workflowId,
              this.SchedulerExecutionalDataSubject.value.serviceId,
              todaysDate,
              this.SchedulerExecutionalDataSubject.value
            )
            .subscribe((data) => {
              this.SchedulerSelectedDatesTimeSlotSubject.next(data[0]);
              resolve(data[0]);
            });
        });

    });
  }

  private async SetTheAvailableAppointmentTimeSlots() {

    if (!this.SchedulerFirstAvailableTimeSlotSubject.value.length) {
      return new Promise((resolve, reject) => {
        if (this.SchedulerExecutionalDataSubject.value.branchId) {
          this.appointmentSchedulerAPIService
            .SelectBranchForAppointment<IFirstAvailable, ISchedulerExecutionalData>(
              this.SchedulerDataSubject.value.companyId,
              this.SchedulerExecutionalDataSubject.value.branchId,
              this.SchedulerDataSubject.value.designerPanel.workflowId,
              this.SchedulerExecutionalDataSubject.value.serviceId,
              this.SchedulerExecutionalDataSubject.value
            )
            .subscribe((data: any) => {
              this.SchedulerExecutionalDataSubject.next(data);
              this.appointmentSchedulerAPIService
                .GetAvailableSlots<IFirstAvailable, ISchedulerExecutionalData>(
                  this.SchedulerDataSubject.value.companyId,
                  this.SchedulerExecutionalDataSubject.value.branchId,
                  this.SchedulerDataSubject.value.designerPanel.workflowId,
                  this.SchedulerExecutionalDataSubject.value.serviceId,
                  null,
                  this.SchedulerExecutionalDataSubject.value,
                  this.CustomerAppointmentId,

                )
                .subscribe((data) => {
                  this.SchedulerFirstAvailableTimeSlotSubject.next(data);
                  resolve(data);
                });
            });

        }
      });
    }
  }

  OnEmailAddressCheckBoxChecked() {
    const emailsFromGlobalQuestions =
      this.SchedulerExecutionalDataSubject.value.globalQuestion.filter(
        (x) => x.itemType == QuestionType.Email.value
      );

    if (
      this.AppointmentNotificationPreferencesSubject.value.isEmailAddressChecked
    ) {
      if (
        emailsFromGlobalQuestions.length != 0 &&
        !this.AppointmentNotificationPreferencesSubject.value.emailAddress
      ) {
        this.AppointmentNotificationPreferencesSubject.value.emailAddress =
          emailsFromGlobalQuestions[0].answer;
      }
    } else {
      this.ValidationMessageSubject.next({
        message: '',
        showValidationMessage: false,
      });
    }
  }
  OnPhoneCheckBoxChecked() {
    const smsNumberFromGlobalQuestions =
      this.SchedulerExecutionalDataSubject.value.globalQuestion.filter(
        (x) => x.itemType == QuestionType.SMSPhoneNumber.value
      );
    if (
      this.AppointmentNotificationPreferencesSubject.value.isPhonNumberChecked
    ) {
      if (
        smsNumberFromGlobalQuestions.length != 0 &&
        !this.AppointmentNotificationPreferencesSubject.value.phoneNumber
      ) {
        this.AppointmentNotificationPreferencesSubject.value.phoneNumber =
          smsNumberFromGlobalQuestions[0].answer;
      }
    } else {
      this.ValidationMessageSubject.next({
        message: '',
        showValidationMessage: false,
      });
    }
  }

  OnIAgreeTermsCheck() {
    if (
      this.AppointmentNotificationPreferencesSubject.value
        .isTermsAndConditionChecked
    ) {
      this.ShowSubmitButtonSubject.next(true);
    } else {
      this.ShowSubmitButtonSubject.next(false);
    }
  }

  private GetTimeInString(timeFrame: ITime) {
    const format = timeFrame.hours >= 12 ? 'PM' : 'AM';
    return timeFrame.hours + ':' + timeFrame.minutes + ' ' + format;
  }

  public ConvertTime12to24(fromAndToTime) {
    const [time, modifier] = fromAndToTime.split(' ');
    let [hours, minutes] = time.split(':');

    minutes = minutes === '0' ? '00' : minutes;

    if (hours === '12') {
      return `${hours}:${minutes} ${modifier}`;
    }

    if (modifier === 'PM') {
      if (hours > 12) {
        hours = parseInt(hours, 10) - 12;
      } else {
        hours = parseInt(hours, 10) + 12;
      }
    }

    if (modifier === 'AM' && hours === '0') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes} ${modifier}`;
  }
  SearchBranchList(searchText) {
    this.SearchText = searchText;
    this.SearchBranchListBySearchText();
  }

  private SearchBranchListBySearchText() {
    if (this.SearchText) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.SearchText}&key=${this.appConfigService.config.GoogleApiKey}`
      )
        .then((x) => {
          return x.json();
        })
        .then((x) => {
          const textSearchResult: ITextSearch = x;
          if (textSearchResult.results.length > 0) {
            this.SearchedLocation = {
              lat: textSearchResult.results[0].geometry.location.lat,
              lng: textSearchResult.results[0].geometry.location.lng,
            };
            this.CurrentMapLocationSubject.next(this.SearchedLocation);

            this.LoadNearestBranches(
              this.SearchedLocation.lat,
              this.SearchedLocation.lng,
              this.MilesSubject.value.find((x) => x.isSelected).value
            );
          } else {
            this.NearestBranchListSubject.next([]);
            this.NearestBranchDisplayDataSubject.next([]);
          }
        });
    } else {
      this.SearchedLocation = null;
      this.CurrentMapLocationSubject.next(this.CustomerLocation);
      this.LoadNearestBranches(
        this.CustomerLocation.lat,
        this.CustomerLocation.lng,
        this.MilesSubject.value.find((x) => x.isSelected).value
      );
    }
  }

  NextButtonClick() {
    const nextPage = this.GetNextPage();
    if (this.ValidContext()) {
      if (
        this.SelectedPageSubject.value ==
        AppointmentSchedulerPageName.InformationGatheringPage
      ) {
        this.ShowServiceQuestionsOrSendToNotificationPage(nextPage);
      } else if (
        this.SelectedPageSubject.value ==
        AppointmentSchedulerPageName.NearestBranchSelectionPage &&
        (SchedulerType.ServiceFirst ==
          this.SchedulerDataSubject.value.designerPanel.schedulerType ||
          this.URLType == SharableLinkType.AService)
      ) {
        this.SetTheAvailableAppointmentTimeSlots();
        this.ChangePage(AppointmentSchedulerPageName.AppointmentSchedulePage);
      } else if (
        this.SelectedPageSubject.value ==
        AppointmentSchedulerPageName.AvailableServiceSelectionPage &&
        this.URLType == SharableLinkType.ABranch &&
        this.SchedulerDataSubject.value.designerPanel.schedulerType !== SchedulerType.QuestionFirst
      ) {
        this.SetTheAvailableAppointmentTimeSlots();
        this.ChangePage(AppointmentSchedulerPageName.AppointmentSchedulePage);
      } else if (
        this.SelectedPageSubject.value ==
        AppointmentSchedulerPageName.AvailableServiceSelectionPage &&
        SchedulerType.ServiceFirst ==
        this.SchedulerDataSubject.value.designerPanel.schedulerType
      ) {
        this.LoadNearestBranches(
          this.CustomerLocation.lat,
          this.CustomerLocation.lng,
          this.MilesSubject.value.find((x) => x.isSelected).value
        );
        this.NearestBranchDisplayDataSubject.value.map(
          (x) => (x.isBranchSelected = false)
        );
        this.ChangePage(
          AppointmentSchedulerPageName.NearestBranchSelectionPage
        );
      } else if (
        nextPage == AppointmentSchedulerPageName.AppointmentSchedulePage
      ) {
        this.SetTheAvailableAppointmentTimeSlots();
        this.ChangePage(nextPage);
      } else if (
        nextPage == AppointmentSchedulerPageName.InformationGatheringPage
      ) {
        if (this.WorkflowDataSubject.value.setting.enablePreServiceQuestions) {
          if (
            this.SchedulerExecutionalDataSubject.value.globalQuestion.length ===
            0
          ) {
            if (!this.CustomerAppointmentId) {
              this.WorkflowDataSubject.value.preServiceQuestions
                .filter((s) => s.isVisible && !s.isDeleted)
                .forEach((x) => {
                  this.SchedulerExecutionalDataSubject.value.globalQuestion.push({
                    answer: null,
                    itemId: x.id,
                    itemText: x.question.find((x) => x.isDefault) ? x.question.find((x) => x.isDefault).question : null,
                    required: x.isRequired,
                    isQuestionVisible: true,
                    isVisible: x.isVisible,
                    itemTypeSetting: this.GetQuestionTypeSetting(x),
                    itemType: x.type,
                    setId: null,
                  });
                });
            }

          }
          this.ChangePage(nextPage);
        } else {
          this.ShowServiceQuestionsOrSendToNotificationPage(nextPage);
        }
      } else if (
        nextPage ==
        AppointmentSchedulerPageName.AppointmentNotificationPreferencePage
      ) {
        this.ResetAppNotificationPreferencesData();
        this.ChangePage(nextPage);
      } else {
        this.ChangePage(nextPage);
        this.CheckAvailableServicesAndSendThemToRespectiveNextPage();
      }
    }
  }

  ControlDataChange(id: string) {
    const nextPage = this.GetNextPage();
    this.stopValidation = true;
    if (this.ValidContext()) {
      if (
        this.SelectedPageSubject.value ==
        AppointmentSchedulerPageName.InformationGatheringPage
      ) {
        this.ShowServiceQuestions(nextPage, id);
      } else if (
        nextPage == AppointmentSchedulerPageName.InformationGatheringPage
      ) {
        if (this.WorkflowDataSubject.value.setting.enablePreServiceQuestions) {
          if (this.SchedulerExecutionalDataSubject.value.globalQuestion.length === 0) {
            this.WorkflowDataSubject.value.preServiceQuestions
              .filter((s) => s.isVisible && !s.isDeleted)
              .forEach((x) => {
                this.SchedulerExecutionalDataSubject.value.globalQuestion.push({
                  answer: null,
                  itemId: x.id,
                  itemText: x.question.find((x) => x.isDefault) ? x.question.find((x) => x.isDefault).question : null,
                  required: x.isRequired,
                  isQuestionVisible: true,
                  isVisible: x.isVisible,
                  itemTypeSetting: this.GetQuestionTypeSetting(x),
                  itemType: x.type,
                  setId: null,
                });

              });
          }
        } else {
          this.ShowServiceQuestionsOrSendToNotificationPage(nextPage, id);
        }
      }
    }
  }

  private async ShowServiceQuestions(nextPage: AppointmentSchedulerPageName, questionId: string) {
    const serviceRouting: IServiceRoute = await this.Routing(questionId);
    if (serviceRouting.group === RoutingType.NoQueue) {
      return;
    }

    if (serviceRouting.group == RoutingType.Questions) {
      this.RouteToQuestions(serviceRouting, questionId);
      if (this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.filter(s => s.setId === serviceRouting.id).some(x => x.required)) {
        this.ShowContinueButtonSubject.next(false);
      } else {
        this.ShowContinueButtonSubject.next(true);
      }

      if (
        this.SelectedPageSubject.value !==
        AppointmentSchedulerPageName.InformationGatheringPage &&
        !this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds
          .previousQuestionSetId
      ) {
        this.ShowContinueButtonSubject.next(true);
        this.ChangePage(nextPage);
      }
    } else {
      this.ShowContinueButtonSubject.next(true);
    }
  }

  private ResetAppNotificationPreferencesData() {
    this.AppointmentNotificationPreferencesSubject.value.emailAddress = null;
    this.AppointmentNotificationPreferencesSubject.value.phoneNumber = null;
    this.AppointmentNotificationPreferencesSubject.value.isEmailAddressChecked =
      false;
    this.AppointmentNotificationPreferencesSubject.value.isPhonNumberChecked =
      false;
    this.AppointmentNotificationPreferencesSubject.value.isTermsAndConditionChecked =
      false;
    this.AppointmentNotificationPreferencesSubject.next(
      this.AppointmentNotificationPreferencesSubject.value
    );
  }

  ValidContext() {
    if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.NearestBranchSelectionPage &&
      !this.NearestBranchDisplayDataSubject.value.find(
        (x) => x.isBranchSelected
      )
    ) {
      if (this.NearestBranchDisplayDataSubject.value.length != 0) {
        this.ValidationMessageSubject.next({
          message: this.AppointmentTextsSubject.value.appointmentLocationNotSelectedErrorMessage,
          showValidationMessage: true,
        });
      }
      return false;
    }
    if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AvailableServiceSelectionPage &&
      !this.SchedulerServicesSubject.value.find((x) => x.isSelected)

    ) {
      if (this.SchedulerServicesSubject.value.length != 0) {
        this.ValidationMessageSubject.next({
          message: this.AppointmentTextsSubject.value.appointmentServiceNotSelectedErrorMessage,
          showValidationMessage: true,
        });
      }
      return false;
    }
    if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AppointmentSchedulePage
    ) {
      if (
        !this.SchedulerSelectedDatesTimeSlotSubject.value?.availableSpots?.some(
          (x) => x.isSelected
        ) &&
        !this.SchedulerFirstAvailableTimeSlotSubject.value?.find((x) =>
          x.availableSpots?.some((x) => x.isSelected)
        )
      ) {
        this.ValidationMessageSubject.next({
          message: this.AppointmentTextsSubject.value.appointmentSlotNotSelectedErrorMessage,
          showValidationMessage: true,
        });
        return false;
      }
    }
    if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.InformationGatheringPage &&
      !this.IsValidated()
    ) {
      this.ValidationMessageSubject.next({
        message: this.AppointmentTextsSubject.value.appointmentRequiredFieldErrorMessage,
        showValidationMessage: true,
      });
      return false;
    }
    this.ValidationMessageSubject.next({
      message: '',
      showValidationMessage: false,
    });
    return true;
  }

  InitializeValidators() {
    this.QuestionValidations = [
      {
        Type: QuestionType.PhoneNumber.value,
        Regex: Validations.InternationalPhoneRegex,
      },
      {
        Type: QuestionType.SMSPhoneNumber.value,
        Regex: Validations.InternationalPhoneRegex,
      },
      {
        Type: QuestionType.Email.value,
        Regex: Validations.EmailRegX,
      },
    ];
  }

  IsValidated(): boolean {
    const PreServiceRequiredQuestions =
      this.SchedulerExecutionalDataSubject.value.globalQuestion.filter(
        (p) => p.required || p.answer
      );
    const ServiceRequiredQuestions =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.filter(
        (p) => p.required || p.answer
      );
    const PreServiceValidated = this.ValidateQuestions(
      PreServiceRequiredQuestions
    );
    const ServiceValidated = this.ValidateQuestions(ServiceRequiredQuestions);
    return PreServiceValidated && ServiceValidated;
  }

  ValidateQuestions(Questions: IQuestionItem[]): boolean {
    if (!Questions) {
      return true;
    }
    if (Questions.length === 0) {
      return true;
    }
    return Questions.every(
      (question) => question.answer && this.ValidateAnswer(question)
    );
  }

  ValidateAnswer(question: IQuestionItem): boolean {
    if (
      question.itemType == QuestionType.PhoneNumber.value ||
      question.itemType == QuestionType.SMSPhoneNumber.value
    ) {
      return question.isValid;
    }
    const Regex = this.QuestionValidations?.find(
      (x) => x.Type == question.itemType
    )?.Regex;
    return !Regex || question.answer.match(Regex);
  }

  private async ShowServiceQuestionsOrSendToNotificationPage(
    nextPage: AppointmentSchedulerPageName,
    questionId?: string
  ) {
    const serviceRouting: IServiceRoute = await this.Routing(questionId);
    if (serviceRouting.group === RoutingType.NoQueue) {
      return;
    }
    if (serviceRouting.group === RoutingType.Confirmation) {
      this.SchedulerExecutionalDataSubject.value.branchName =
        this.NearestBranchDisplayDataSubject.value.find(
          (x) =>
            x.branchId ==
            this.SchedulerExecutionalDataSubject.value.branchId
        )?.branchName || 'Our Branch';
      this.SchedulerExecutionalDataSubject.next(
        this.SchedulerExecutionalDataSubject.value
      );
      if (this.appointmentExistsSubject.value == true) {
        this.zone.run(() => {
          this.routeHandlerService.RedirectForFlorida('/scheduler-execution', {
            'c-id': this.CompanyId,
            'b-id': this.AppointmentBranchId,
            'a-id': this.CustomerAppointmentId || this.AppointmentId,
            modify: true,
          });
        })
      } else {
        this.ChangePage(AppointmentSchedulerPageName.SuccessPage);
      }
      return;
    }
    if (serviceRouting.group == RoutingType.Questions) {
      this.RouteToQuestions(serviceRouting, questionId);
      if (
        this.SelectedPageSubject.value !==
        AppointmentSchedulerPageName.InformationGatheringPage &&
        !this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds
          .previousQuestionSetId
      ) {
        if (
          nextPage === AppointmentSchedulerPageName.AppointmentSchedulePage &&
          (this.URLType === SharableLinkType.ABranch || this.URLType === SharableLinkType.BranchAndService)
        ) {
          this.SetTheAvailableAppointmentTimeSlots();
        }
        this.ChangePage(nextPage);
      }
    } else {
      this.SchedulerExecutionalDataSubject.value.queueId = serviceRouting.id;
      this.ResetAppNotificationPreferencesData();
      if (nextPage == AppointmentSchedulerPageName.InformationGatheringPage) {
        const nextPageAfterInformation = this.GetPageDetails().find(
          (x) => x.currentPage == nextPage
        ).nextPage;
        this.ChangePage(nextPageAfterInformation);
      } else {
        if (
          nextPage === AppointmentSchedulerPageName.AppointmentSchedulePage
          && (this.URLType === SharableLinkType.ABranch || this.URLType === SharableLinkType.BranchAndService)
        ) {
          this.SetTheAvailableAppointmentTimeSlots();
        }
        if (serviceRouting.group != RoutingType.FloridaError) {
          this.ChangePage(nextPage);
        }
      }
    }
  }

  private async Routing(questionId: string) {
    let serviceRouting: IServiceRoute = await this.GetRouting(questionId);
    if (!serviceRouting) {
      serviceRouting = this.DefaultRoute();
    }
    return serviceRouting;
  }

  private RouteToQuestions(serviceRouting: IServiceRoute, questionId?: string) {
    let questionSetSortPositionOfControl;
    if (questionId) {
      questionSetSortPositionOfControl =
        this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.find(x => x.itemId === questionId).sortPosition;
    }
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.map((x) => {
      x.isQuestionVisible = false;
    });
    let sortPosition;
    if (!(this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId === serviceRouting.id)
      && this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids.includes(serviceRouting.id)) {
      sortPosition = this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.length > 0 ?
        (this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.find
          (x => x.setId === this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId)?.sortPosition + 1) : 1;
    } else {
      sortPosition = questionSetSortPositionOfControl ? questionSetSortPositionOfControl + 1 : 1;
    }
    this.WorkflowDataSubject.value.questionSets
      .filter((x) => !x.isDeleted)

      .find((x) => x.id == serviceRouting.id)
      .questions.filter((x) => x.isVisible && !x.isDeleted)
      .forEach((x) => {
        if (!(this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.find(s => s.itemId === x.id))) {
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.push({
            answer: null,
            itemId: x.id,
            itemText: x.question.find((x) => x.isDefault) ? x.question.find((x) => x.isDefault).question : null,
            required: x.isRequired,
            isVisible: x.isVisible,
            itemTypeSetting: this.GetQuestionTypeSetting(x),
            itemType: x.type,
            setId: serviceRouting.id,
            isQuestionVisible: true,
            sortPosition
          });
        }
      });
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.previousQuestionSetId =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId;
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.currentQuestionSetId =
      serviceRouting.id;
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids.push(
      serviceRouting.id
    );
    this.SchedulerExecutionalDataSubject.next(
      cloneObject(this.SchedulerExecutionalDataSubject.value)
    );
  }

  async GetRouting(questionId: string): Promise<IServiceRoute> {

    let serviceRouting: IServiceRoute;
    if (
      !this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId
    ) {
      serviceRouting = this.WorkflowDataSubject.value.services
        .filter((x) => !x.isDeleted)
        ?.find(
          (x) => x.id == this.SchedulerExecutionalDataSubject.value.serviceId
        ).routing;
      return Promise.resolve(serviceRouting);
    }

    if (questionId) {
      const sortPosition = this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.find(x => x.itemId === questionId).sortPosition;
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet =
        this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.filter(x => x.sortPosition <= sortPosition);
      const serviceQuestionsSetIds = this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.map(x => x.setId);
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids = [...new Set(serviceQuestionsSetIds)];
    }

    const previouslyAskedQuestionSets =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids;
    const documents: Array<RulesDocument | RulesDocumentReference> = [];
    const workflow = this.GetWorkflowBaseDetails();
    if (workflow) {
      documents.push(workflow);
    }
    const customerRequest: RulesDocument = this.GetRequestDetails();
    if (customerRequest) {
      documents.push(customerRequest);
    }

    const DynamicQueryProcessorRequest = {
      previouslyAskedQuestionSets,
      documents,
    };
    this.notificationService.ClearPersistantNotifications();
    let responses: any
    if (!this.CustomerAppointmentId && !this.stopValidation) {
      responses = await this.dynamicRuleProcessorAPIService
        .EvaluateConditionalRoute(DynamicQueryProcessorRequest, true)
        .toPromise();
    }
    this.stopValidation = false;
    if (!responses || responses.length == 0) {
      return Promise.resolve(this.DefaultRoute());
    }

    if (responses.length > 1) {
      return Promise.resolve(this.DefaultRoute());
    }

    const response = responses[0];

    if (response && response.request) {

      if (response.request.appointment != null) {
        var value = this.SchedulerExecutionalDataSubject.value;
        value.hoursOfOperationOverride = response.request.appointment.hoursOfOperationOverride;
        value.hoursOfoperationOverrideId = response.request.appointment.hoursOfoperationOverrideId;
        value.serviceQuestionsSet.forEach((item) => {
          item.answer = response.request.appointment.serviceQuestions.find((x) => item.itemId == x.id || x.questionId).answer
        })
        this.SchedulerExecutionalDataSubject.next(value);
      }

      let floridaUserMessage = response.request?.floridaUserMessage;

      if (floridaUserMessage) {
        this.notificationService.NotifyPersistant(floridaUserMessage);
      }

    }
    if (response.responseType == ConditionalRoutingResponseTypes.Queue) {

      if (response.request?.floridaErrorMessage) {

        if (response.responseType == 2 && response.request.floridaErrorMessage != "" && response.request.floridaErrorMessage != null) {
          let floridaErrorMessage = response.request.floridaErrorMessage
          this.notificationService.NotifyErrorPersistant(floridaErrorMessage)
          return Promise.resolve({
            group: Routing.FloridaError,
            type: Routing.Queue,
            id: response.queueId,
          });
        }
      } else {
        return Promise.resolve({
          group: Routing.Queue,
          type: Routing.Queue,
          id: response.queueId,
        });
      }
    }
    if (response.responseType == ConditionalRoutingResponseTypes.QuestionSet) {
      return Promise.resolve({
        group: Routing.Questions,
        type: Routing.Questions,
        id: response.questionSetId,
      });
    }
    if (response.responseType == ConditionalRoutingResponseTypes.NoQueue) {
      this.AppNotificationService.NotifyErrorPersistant(AppointmentSchedulerMessages.NoQueueMessage);
      return Promise.resolve({
        group: Routing.NoQueue,
        type: Routing.NoQueue,
        id: response.queueId,
      });
    }
    if (response.responseType == ConditionalRoutingResponseTypes.Confirmation) {
      if (response.request.isAppointmentExist) {
        this.appointmentExistsSubject.next(true);
        this.AppointmentId = response.request.appointment.id;
        this.AppointmentBranchId = response.request.appointment.branchId;
      }
      return Promise.resolve({
        group: Routing.Confirmation,
        type: Routing.Confirmation,
        id: response.queueId,
      });
    }
  }
  GetRequestDetails(): RulesDocument {
    const serviceQuestions = this.GetServiceQuestionWithAnswers();
    return {
      documentType: 'customerRequest',
      document: {
        id: '',
        workflowId: this.WorkflowDataSubject.value.workFlowId,
        serviceQuestions,
        serviceId: this.SchedulerExecutionalDataSubject.value?.serviceId,
        isWalking: false,
        isAppointment: true,
        hoursOfOperationOverride: this.SchedulerExecutionalDataSubject?.value.hoursOfOperationOverride,
        hoursOfoperationOverrideId: this.SchedulerExecutionalDataSubject?.value.hoursOfoperationOverrideId,
        selectedLanguageId: this.SelectedLanguageSubject.value.selectedLanguage || this.SelectedLanguageSubject.value.defaultLanguage
      },
    };
  }

  GetServiceQuestionWithAnswers(): { id: string; answer: string }[] {
    if (this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet) {
      const Questions: { id: string; answer: string }[] = [];

      for (const serviceQuestionsSet of this.SchedulerExecutionalDataSubject
        .value.serviceQuestionsSet) {
        Questions.push({
          id: serviceQuestionsSet.itemId,
          answer: serviceQuestionsSet.answer,
        });
      }

      return Questions;
    }
    return [];
  }

  GetWorkflowBaseDetails(): RulesDocumentReference {
    return {
      documentType: 'workflow',
      pk: this.WorkflowDataSubject.value.companyId,
      id: this.WorkflowDataSubject.value.workFlowId,
    };
  }

  DefaultRoute(): any {
    let serviceRouting = this.WorkflowDataSubject.value.questionSets
      .filter((x) => !x.isDeleted)
      .find(
        (x) =>
          x.id ==
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds?.currentQuestionSetId
      )?.routing;

    if (!serviceRouting) {
      serviceRouting = this.WorkflowDataSubject.value.services
        ?.filter((x) => !x.isDeleted)
        .find(
          (x) => x.id == this.SchedulerExecutionalDataSubject.value.serviceId
        ).routing;
    }
    return serviceRouting;
  }

  SubmitButtonClick() {
    if (this.IsValidNotificationDetailsBeforeSubmit()) {
      const appointmentUTCTimeString = this.GetAppointmentUTCTime();
      const submitData: ISchedulerRequestData = this.GetCurrentAppoinemtDetails(
        appointmentUTCTimeString
      );
      const workflowAppointmentTemplateId = this.WorkflowDataSubject?.value?.services?.
        find(x => x.id == submitData?.serviceId)?.appointmentTemplate?.id;
      if (workflowAppointmentTemplateId) {
        submitData.mobileTemplateId =
          this.WorkflowDataSubject?.value?.appointmentTemplates?.find(x => x.id == workflowAppointmentTemplateId)?.mobileTemplate?.id;
      }
      if (!this.CustomerAppointmentId) {
        if (this.IsAuthenTicatedUser()) {
          this.BookingAppointmentByAgent(submitData);
        } else {
          this.BookingAppointmentByVisitors(submitData);
        }
      } else {
        this.UpdateAppointment(submitData);
      }
    }
  }
  private GetCurrentAppoinemtDetails(
    appointmentUTCTimeString: string
  ): ISchedulerRequestData {
    return {
      id: this.AppointmentId,
      companyId: this.SchedulerDataSubject.value.companyId,
      schedulerId: this.SchedulerDataSubject.value.schedulerId,
      branchId: this.SchedulerExecutionalDataSubject.value.branchId,
      workflowId: this.SchedulerDataSubject.value.designerPanel.workflowId,
      serviceId: this.SchedulerExecutionalDataSubject.value.serviceId,
      mobileTemplateId: this.SchedulerExecutionalDataSubject.value.mobileTemplateId,
      confirmationPageDisplayData: {
        schedulerTemplateId: this.SchedulerDataSubject.value.schedulerId,
        descriptions: this.getStepsDescriptionsList(),
        queueId: this.SchedulerExecutionalDataSubject.value.queueId,
        branchName: this.NearestBranchDisplayDataSubject.value.find(
          (x) =>
            x.branchId == this.SchedulerExecutionalDataSubject.value.branchId
        )?.branchName,
        appointmentUniqueIdentifier: this.SchedulerExecutionalDataSubject.value.appointmentUniqueIdentifier,
      },
      selectedLanguageId: this.currentLanguage,
      appointmentTimeUTCString: appointmentUTCTimeString,
      appointmentTimeISOString: new Date(
        appointmentUTCTimeString
      ).toISOString(),
      appointmentDate:
        this.SchedulerExecutionalDataSubject.value.appointmentDate,
      appointmentTime: {
        hours: this.SchedulerExecutionalDataSubject.value.appointmentTime.hours,
        minutes:
          this.SchedulerExecutionalDataSubject.value.appointmentTime.minutes,
      },

      notificationPreferences: {
        allowSMS:
          this.AppointmentNotificationPreferencesSubject.value
            .isPhonNumberChecked,
        smsNumber:
          this.AppointmentNotificationPreferencesSubject.value.phoneNumber,
        allowEmail:
          this.AppointmentNotificationPreferencesSubject.value
            .isEmailAddressChecked,
        email:
          this.AppointmentNotificationPreferencesSubject.value.emailAddress,
      },
      preServiceQuestions: this.GetGlobalQuestionMappedDataFromSubmitRequest(),
      serviceQuestions: this.GetServiceQuestionMappedDataFromSubmitRequest(),
      hoursOfOperationOverride: this.SchedulerExecutionalDataSubject.value.hoursOfOperationOverride
    };
  }

  private UpdateAppointment(submitData: ISchedulerRequestData) {
    this.appointmentSchedulerAPIService
      .ModifyAppointment<ISchedulerRequestData, any>(submitData)
      .subscribe((x) => {
        this.AppNotificationService.Notify(this.AppointmentTextsSubject.value.appointmentModifyMessage);
        this.routeHandlerService.Redirect('/confirm-appointment', {
          'c-id': submitData.companyId,
          'b-id': submitData.branchId,
          'a-id': submitData.id,
          modify: true,
        });
      });
  }

  private BookingAppointmentByAgent(submitData: ISchedulerRequestData) {
    this.appointmentSchedulerAPIService
      .BookAppointment<ISchedulerRequestData, any>(
        submitData,
        this.authService.CompanyId
      )
      .subscribe((data) => {
        this.SchedulerExecutionalDataSubject.value.branchName =
          this.NearestBranchDisplayDataSubject.value.find(
            (x) =>
              x.branchId == this.SchedulerExecutionalDataSubject.value.branchId
          )?.branchName || 'Our Branch';
        this.SchedulerExecutionalDataSubject.value.appointmentUniqueIdentifier =
          data[1].confirmationPageDisplayData.appointmentUniqueIdentifier;
        this.SchedulerExecutionalDataSubject.next(
          this.SchedulerExecutionalDataSubject.value
        );
        this.ChangePage(AppointmentSchedulerPageName.SuccessPage);
      });
  }

  private BookingAppointmentByVisitors(submitData: ISchedulerRequestData) {
    this.appointmentSchedulerAPIService
      .BookAppointmentExternal<ISchedulerRequestData, any>(submitData)
      .subscribe((data) => {
        if (data[1]?.appointmentStatus == AppointmentStatus.CONFIRMED) {
          this.routeHandlerService.Redirect('/confirm-appointment', {
            'c-id': submitData.companyId,
            'b-id': submitData.branchId,
            'a-id': submitData.id,
            modify: false,
          });
        } else {
          this.SchedulerExecutionalDataSubject.value.branchName =
            this.NearestBranchDisplayDataSubject.value.find(
              (x) =>
                x.branchId ==
                this.SchedulerExecutionalDataSubject.value.branchId
            )?.branchName || 'Our Branch';
          this.SchedulerExecutionalDataSubject.next(
            this.SchedulerExecutionalDataSubject.value
          );
          this.ChangePage(AppointmentSchedulerPageName.SuccessPage);
        }
      });
  }

  getStepsDescriptionsList(): string[] {
    const descriptions = [];
    this.StepDetailsSubject.value.steps.forEach((x) => {
      const obj = {
        description: x.stepDescription,
        id: x.id
      }
      descriptions.push(obj)
    });
    return descriptions;
  }
  GetAppointmentUTCTime(): string {
    const appointmentDate = new Date(
      this.SchedulerExecutionalDataSubject.value.appointmentDate
    );
    const date = appointmentDate.getDate();
    const month = appointmentDate.getMonth();
    const year = appointmentDate.getFullYear();

    const branchData = this.NearestBranchListSubject.value.find(
      (b) => b.branchId == this.SchedulerExecutionalDataSubject.value.branchId
    );
    const timezone = branchData?.branchTimezone.id;
    const branchOffset = getOffsetByTimezone(timezone);
    const branchDateString: string = toIsoString(
      branchOffset,
      year,
      month,
      date,
      this.SchedulerExecutionalDataSubject.value.appointmentTime.hours,
      this.SchedulerExecutionalDataSubject.value.appointmentTime.minutes
    );

    const UTCTimeString = new Date(branchDateString).toUTCString();

    return UTCTimeString;
  }
  IsValidNotificationDetailsBeforeSubmit() {
    if (
      this.AppointmentNotificationPreferencesSubject.value
        .isEmailAddressChecked &&
      this.AppointmentNotificationPreferencesSubject.value.emailAddress &&
      !this.ValidateNotificationPreferences(
        QuestionType.Email.value,
        this.AppointmentNotificationPreferencesSubject.value.emailAddress
      )
    ) {
      this.ValidationMessageSubject.next({
        message: this.AppointmentTextsSubject.value.appointmentRequiredFieldErrorMessage,
        showValidationMessage: true,
      });
      return false;
    } else if (
      this.AppointmentNotificationPreferencesSubject.value
        .isPhonNumberChecked &&
      this.AppointmentNotificationPreferencesSubject.value.phoneNumber &&
      !this.ValidateNotificationPreferences(
        QuestionType.PhoneNumber.value,
        this.AppointmentNotificationPreferencesSubject.value.phoneNumber
      )
    ) {
      this.ValidationMessageSubject.next({
        message: this.AppointmentTextsSubject.value.appointmentRequiredFieldErrorMessage,
        showValidationMessage: true,
      });
      return false;
    }
    return true;
  }
  ValidateNotificationPreferences(type: string, answer: any): boolean {
    const Regex = this.QuestionValidations?.find((x) => x.Type == type)?.Regex;
    return !Regex || (answer && answer.match(Regex));
  }
  GetGlobalQuestionMappedDataFromSubmitRequest() {
    const data = [];
    this.SchedulerExecutionalDataSubject.value.globalQuestion.forEach((x) => {
      data.push({ questionId: x.itemId, answer: x.answer });
    });
    return data;
  }

  GetServiceQuestionMappedDataFromSubmitRequest() {
    const data = [];
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.forEach(
      (x) => {
        data.push({
          questionId: x.itemId,
          questionSetId: x.setId,
          answer: x.answer,
        });
      }
    );
    return data;
  }

  BackButtonClick() {
    const previousPage = this.GetPreviousPage();
    if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AppointmentNotificationPreferencePage
    ) {
      this.ChangePage(previousPage);
    } else if (
      this.SelectedPageSubject.value == AppointmentSchedulerPageName.AppointmentSchedulePage
      && this.SchedulerDataSubject.value.designerPanel.schedulerType !== SchedulerType.QuestionFirst
      && this.URLType == SharableLinkType.ABranch
    ) {
      this.ShowFirstAvailableBlock();
      this.ChangePage(
        AppointmentSchedulerPageName.AvailableServiceSelectionPage
      );
    } else if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AppointmentSchedulePage &&
      (SchedulerType.ServiceFirst ==
        this.SchedulerDataSubject.value.designerPanel.schedulerType ||
        this.URLType == SharableLinkType.AService)
    ) {
      this.ShowFirstAvailableBlock();
      this.ChangePage(AppointmentSchedulerPageName.NearestBranchSelectionPage);
    } else if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.NearestBranchSelectionPage &&
      SchedulerType.ServiceFirst ==
      this.SchedulerDataSubject.value.designerPanel.schedulerType
    ) {
      this.SchedulerExecutionalDataSubject.value.branchId = null;
      this.ChangePage(
        AppointmentSchedulerPageName.AvailableServiceSelectionPage
      );
    } else if (
      this.SelectedPageSubject.value === AppointmentSchedulerPageName.AppointmentSchedulePage
      && this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
      && this.URLType === SharableLinkType.ABranch
    ) {
      this.ChangePage(previousPage);
    } else if (
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.InformationGatheringPage
    ) {
      this.ShowPreviousQuestionsOnBackButtonClick(previousPage);
    } else {
      this.ChangePage(previousPage);
      this.CheckAvailableServicesAndSendThemToRespectiveBackPage();
    }
  }

  // @Confirmable()
  Delete() {
    const allow = confirm(this.AppointmentTextsSubject?.value?.appointmentConfirmDeleteMessage)
    if (!allow) {
      return null;
    }
    const requestModel: DeleteAppointmentRequest = {
      cancelledById: this.authService.UserId,
      appointmentId: this.CustomerAppointmentId || this.AppointmentId,
      branchId:
        this.SchedulerExecutionalDataSubject.value.branchId ||
        this.AppointmentBranchId,
      serviceId:
        this.SchedulerExecutionalDataSubject.value.serviceId ||
        this.SchedulerDataSubject.value.schedulerId,
      workflowId: this.SchedulerDataSubject.value.designerPanel.workflowId,
    };
    this.subs.sink = this.appointmentSchedulerAPIService
      .DeleteAppointment(requestModel)
      .subscribe((x) => {
        this.SchedulerExecutionalDataSubject.value.isDeleted = x.isDeleted;
        this.AppNotificationService.Notify(
          this.AppointmentTextsSubject.value.appointmentCancelledMessage
        );
        this.SchedulerExecutionalDataSubject.next(
          cloneObject(this.SchedulerExecutionalDataSubject.value)
        );
      });
  }

  private ShowPreviousQuestionsOnBackButtonClick(previousPage: string) {
    const LastQuestionSet =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.filter(
        (c) =>
          c.setId ==
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds
            .currentQuestionSetId
      );
    LastQuestionSet.forEach((x) => {
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.splice(
        this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.findIndex(
          (m) => m.itemId == x.itemId
        ),
        1
      );
    });
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet
      .filter(
        (x) =>
          x.setId ==
          this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds
            .previousQuestionSetId
      )
      .map((x) => (x.isQuestionVisible = true));

    if (
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids
        .length == 1 ||
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.length == 0
    ) {
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet = [];
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.currentQuestionSetId =
        null;
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.previousQuestionSetId =
        null;

      this.ChangePage(previousPage);
    } else {
      this.SchedulerExecutionalDataSubject.next(
        cloneObject(this.SchedulerExecutionalDataSubject.value)
      );
    }
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.currentQuestionSetId =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.previousQuestionSetId;
    this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.previousQuestionSetId =
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSetIds.ids.pop();
  }

  private ShowFirstAvailableBlock() {
    this.SchedulerExecutionalDataSubject.value.appointmentDetails.firstAvailable =
      true;
    this.SchedulerExecutionalDataSubject.value.appointmentDetails.selectDifferentDate =
      false;
    this.SchedulerExecutionalDataSubject.next(
      this.SchedulerExecutionalDataSubject.value
    );
  }

  ChangeBranchSelection(branchId) {
    this.UpdateStepsDetailsAndNearestBranchDisplayDataAfterBranchSelectionChange(
      branchId
    );
    this.NearestBranchDisplayDataSubject.next(
      Object.create(this.NearestBranchDisplayDataSubject.value)
    );
  }

  private UpdateStepsDetailsAndNearestBranchDisplayDataAfterBranchSelectionChange(
    branchId: any
  ) {
    this.SchedulerExecutionalDataSubject.value.branchId = branchId;
    this.NearestBranchDisplayDataSubject.value.map((x) => {
      x.isBranchSelected = false;
    });
    this.NearestBranchDisplayDataSubject.value.find(
      (x) => x.branchId == branchId
    ).isBranchSelected = true;
    this.StepDetailsSubject.value.steps.find(
      (x) => x.id == this.SelectedPageSubject.value
    ).stepDescription = this.NearestBranchDisplayDataSubject.value.find(
      (x) => x.branchId == branchId
    ).branchAddress;
  }

  UpdateLanguage(languageID) {
    // Services
    if (languageID == 'en') {
      this.AppointmentTextsSubject.next(this.getDefaultAppointmentTexts())
      if (this.ValidationMessageSubject.value?.message) {
        this.ValidContext();
      }
      this.translateSpecificTexts(languageID, true);
    } else {
      this.getTranslatedMultipleTexts(languageID);
      this.translateSpecificTexts(languageID, false);
    }
    this.translateHoursOfOperationTexts(languageID, false);

    // update branch services name;
    if (this.NearestBranchDisplayDataSubject.value && this.NearestBranchDisplayDataSubject.value.length) {
      for (let index = 0; index <= this.NearestBranchDisplayDataSubject.value.length - 1; index++) {
        const nearestBranchServices = this.NearestBranchDisplayDataSubject.value[index]?.branchServices;
        let services: any[] = [];
        if (nearestBranchServices && nearestBranchServices.length) {
          nearestBranchServices.forEach((branch) => {
            const workflowService = this.WorkflowDataSubject.value?.services.find((service) => service.id == branch.id);
            if (workflowService) {
              const obj = {
                name: workflowService.serviceNames.find((x) => x.languageId == languageID)?.serviceName,
                id: workflowService.id
              }
              services.push(obj)

            }
          })
          this.NearestBranchDisplayDataSubject.value[index].branchServices = services;
          this.NearestBranchDisplayDataSubject.next(Object.create(this.NearestBranchDisplayDataSubject.value))
        }
      }

    }

    const selectedLanguage = {
      selectedLanguage: languageID,
      defaultLanguage: this.DefaultLanguageSubject.value
    }
    this.SelectedLanguageSubject.next(selectedLanguage);
    this.currentLanguage = languageID;
    let serviceDescription: any = '';

    let dataLength = this.WorkflowDataSubject.value?.services.filter(
      (c) => c.acceptAppointments && !c.isDeleted
    ).length;
    // descriptions update
    // service name update
    for (let i = 0; i < dataLength; i++) {
      this.WorkflowDataSubject.value?.services
        .filter((c) => c.acceptAppointments && !c.isDeleted)
        .forEach((c) =>
          c.serviceNames.forEach((c) => {
            if (c.languageId === languageID) {
              return (c.isDefault = true);
            } else {
              return (c.isDefault = false);
            }
          })
        );
    }
    this.updateSchedulerServicesOfBranch(this.SchedulerExecutionalDataSubject.value.branchId);
    for (let i = 0; i < dataLength; i++) {
      this.WorkflowDataSubject.value?.services
        .filter((c) => c.acceptAppointments && !c.isDeleted)
        .forEach((c) =>
          c.descriptions.forEach((c) => {
            if (c.languageId === languageID) {
              serviceDescription = c.description;
              return (c.isDefault = true);
            } else {
              return (c.isDefault = false);
            }
          })
        );
    }

    // serviceIconUrl update
    for (let i = 0; i < dataLength; i++) {
      this.WorkflowDataSubject.value?.services
        .filter((c) => c.acceptAppointments && !c.isDeleted)
        .forEach((c) =>
          c.serviceIconUrls.forEach((c) => {
            if (c.languageId === languageID) {
              return (c.isDefault = true);
            } else {
              return (c.isDefault = false);
            }
          })
        );
    }

    let preServicesQuestionDataLength =
      this.WorkflowDataSubject.value?.preServiceQuestions.length;
    for (let i = 0; i < preServicesQuestionDataLength; i++) {
      this.WorkflowDataSubject.value.preServiceQuestions
        .filter((c) => !c.isDeleted)
        .forEach((c) =>
          c.question.forEach((c) => {
            if (c.languageId === languageID) {
              return (c.isDefault = true);
            } else {
              return (c.isDefault = false);
            }
          })
        );
      this.WorkflowDataSubject.value?.preServiceQuestions
        .filter((c) => !c.isDeleted)
        .forEach((c) => {
          if (Array.isArray(c.typeSetting)) {
            return c.typeSetting.forEach((option) => {
              return option?.forEach((setting) => {
                if (setting.languageId === languageID) {
                  return (setting.isDefault = true);
                } else {
                  return (setting.isDefault = false);
                }
              })
            })
          }
        }
        );
    }
    this.WorkflowDataSubject.next(this.WorkflowDataSubject.value)
    // survey question

    let surveyQuestiondataLength =
      this.WorkflowDataSubject.value?.surveyQuestions ? this.WorkflowDataSubject.value?.surveyQuestions?.length : null;

    // service name update
    if (surveyQuestiondataLength !== null) {
      for (let i = 0; i < surveyQuestiondataLength; i++) {
        this.WorkflowDataSubject.value?.surveyQuestions
          .filter((c) => c.acceptAppointments && !c.isDeleted)
          .forEach((c) =>
            c.questions?.forEach((c) => {
              c.question?.forEach((question) => {
                if (question.languageId === languageID) {
                  return (question.isDefault = true);
                } else {
                  return (question.isDefault = false);
                }
              });
            })
          );
      }
    }

    // General Questions

    let generalQuestiondataLength =
      this.WorkflowDataSubject.value?.questionSets.length;

    for (let i = 0; i < generalQuestiondataLength; i++) {
      this.WorkflowDataSubject.value.questionSets
        .filter((c) => !c.isDeleted)
        .forEach((c) =>
          c.questions?.forEach((c) => {
            c.question?.forEach((question) => {
              if (question.languageId === languageID) {
                return (question.isDefault = true);
              } else {
                return (question.isDefault = false);
              }
            });
          })
        );
    }

    // TypeSetting update
    for (let i = 0; i < generalQuestiondataLength; i++) {
      this.WorkflowDataSubject.value.questionSets
        .filter((s) => !s.isDeleted)
        .forEach((c) =>
          c.questions.forEach((c) => {
            if (Array.isArray(c.typeSetting)) {
              return c.typeSetting.forEach((x) => {
                x.forEach((d) => {
                  if (d.languageId === languageID) {
                    return (d.isDefault = true);
                  } else {
                    return (d.isDefault = false);
                  }
                });

              });
            }

          })

        );
    }

    this.WorkflowDataSubject.next(Object.create(this.WorkflowDataSubject.value));

    for (let i = 0; i < generalQuestiondataLength; i++) {
      this.WorkflowDataSubject.value?.questionSets
        .filter((s) => !s.isDeleted)
        .forEach((c) =>
          c.questions.forEach((x) => {
            return this.GetQuestionTypeSetting(
              x
            )
          })
        );
    }

    this.WorkflowDataSubject.next(this.WorkflowDataSubject.value);
    if (this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.length > 0) {
      const serviceQuestions = this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet;
      this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet = [];
      this.WorkflowDataSubject.value?.questionSets
        .filter((s) => !s.isDeleted)
        .forEach((x) => {
          x.questions?.forEach((serviceQuestion, index) => {
            const workflowQuestionSet =
              x.questions.find(
                (v) => v.id == serviceQuestion.id
              );
            if (workflowQuestionSet && (workflowQuestionSet.isVisible &&
              !workflowQuestionSet.isActive) && serviceQuestions.length > 0 && serviceQuestions[index]
              && serviceQuestions[index].itemId === serviceQuestion.id) {
              this.SchedulerExecutionalDataSubject.value.serviceQuestionsSet.push({
                answer: null,
                itemId: serviceQuestion.id,
                itemText: serviceQuestion.question.find((x) => x.isDefault) ? serviceQuestion.question.find((x) => x.isDefault).question : null,
                required: serviceQuestion.isRequired,
                isQuestionVisible: true,
                isVisible: serviceQuestion.isVisible,
                itemTypeSetting: this.GetQuestionTypeSetting(serviceQuestion),
                itemType: serviceQuestion.type,
                setId: serviceQuestions[index].setId,
                sortPosition: serviceQuestions[index].sortPosition
              });
              this.SchedulerExecutionalDataSubject.next(
                this.SchedulerExecutionalDataSubject.value
              );
            }

          });
        });
    }

    if (this.SchedulerExecutionalDataSubject.value.globalQuestion.length > 0) {
      this.SchedulerExecutionalDataSubject.value.globalQuestion = [];
      this.WorkflowDataSubject.value?.preServiceQuestions
        .filter((s) => s.isVisible && !s.isDeleted)
        .forEach((x) => {
          this.SchedulerExecutionalDataSubject.value.globalQuestion.push({
            answer: null,
            itemId: x.id,
            itemText: x.question.find((x) => x.isDefault) ? x.question.find((x) => x.isDefault).question : null,
            required: x.isRequired,
            isQuestionVisible: true,
            isVisible: x.isVisible,
            itemTypeSetting: this.GetQuestionTypeSetting(x),
            itemType: x.type,
            setId: null,
          });
          this.SchedulerExecutionalDataSubject.next(
            this.SchedulerExecutionalDataSubject.value
          );
        });
    }

    this.WorkflowDataSubject.next(this.WorkflowDataSubject.value);


    this.updateStepLabel(this.SchedulerDataSubject.value.designerPanel)

  }

  private updateSchedulerServicesOfBranch(branchId: any) {
    const services = [];
    const BranchServicesIds = this.NearestBranchListSubject.value.find(
      (Branch) => Branch.branchId === branchId
    )?.branchServices;
    if (BranchServicesIds && BranchServicesIds.length > 0) {
      BranchServicesIds.forEach((ServiceId) => {
        const service = this.WorkflowDataSubject.value?.services.find(
          (service) => service.id === ServiceId && service.acceptAppointments && !service.isDeleted
        )
        if (service) {
          services.push({
            isSelected: false,
            itemId: service.id,
            name: service.serviceNames.find((n) => n.isDefault).serviceName,
            url: service.serviceIconUrls?.find((x) => x.isDefault)?.url
              ? service.serviceIconUrls?.find((x) => x.isDefault)?.url
              : '/../../assets/img/serviceplaceholder.jpg',

          });
        }
      });
    } else {
      this.WorkflowDataSubject.value?.services
        .filter((c) => c.acceptAppointments && !c.isDeleted)
        .forEach((x) => {
          if (x.serviceNames.find((n) => n.isDefault)) {
            services.push({
              isSelected: false,
              itemId: x.id,
              name: x.serviceNames.find((n) => n.isDefault).serviceName,
              url: x.serviceIconUrls?.find((x) => x.isDefault)?.url
                ? x.serviceIconUrls?.find((x) => x.isDefault)?.url
                : '/../../assets/img/serviceplaceholder.jpg',
            });
          }
        });
    }
    this.SchedulerServicesSubject.next(services);
    this.WorkFlowServicesSubject.next(services);
  }

  private SetSchedulerServicesOfBranch(branchId: any) {
    const services = [];

    this.WorkflowDataSubject.value?.services
      .filter((c) => c.acceptAppointments && !c.isDeleted)
      .forEach((x) => {
        if (x.serviceNames.find((n) => n.isDefault)) {
          services.push({
            isSelected: false,
            itemId: x.id,
            name: x.serviceNames.find((n) => n.isDefault).serviceName,
            url: x.serviceIconUrls?.find((x) => x.isDefault)?.url
              ? x.serviceIconUrls?.find((x) => x.isDefault)?.url
              : '/../../assets/img/serviceplaceholder.jpg',

          });
        }
      });

    this.SchedulerServicesSubject.next(services);
    this.WorkFlowServicesSubject.next(services);
    this.CheckIfSharableLinkIsOfServiceTypeToAddDwdaultServiceNameToSteps();
  }

  private CheckIfSharableLinkIsOfServiceTypeToAddDwdaultServiceNameToSteps() {
    if (this.URLType == SharableLinkType.AService) {
      this.ChangeSchedulerSteps(
        this.SchedulerDataSubject.value.designerPanel.schedulerType
      );
    }
  }
 ConfirmationPageCloseButtonClick() {
    let queryParams = {
      'c-id': this.SchedulerDataSubject.value.companyId,
      's-id': this.SchedulerDataSubject.value.schedulerId,
      //type: 'ABS',
      type: this.router.snapshot.queryParams['type'],
      'b-id': this.router.snapshot.queryParams['b-id'],
      'as-id': this.router.snapshot.queryParams['as-id'],
    };

    this.routeHandlerService.Redirect(
      '/scheduler-execution',
      // {
      //   'c-id': this.SchedulerDataSubject.value.companyId,
      //   's-id': this.SchedulerDataSubject.value.schedulerId,
      //   type: 'ABS',
      // },
      queryParams,
      true
    );
  }
  //#endregion

  //#region Common private functions

  private CheckAvailableServicesAndSendThemToRespectiveNextPage() {
    if (
      this.SchedulerServicesSubject.value?.length == 1 &&
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AvailableServiceSelectionPage
    ) {
      this.UpdateStepSetSchedulerServiceIdAfterServiceSelectionChange(
        this.SchedulerServicesSubject.value[0]?.itemId
      );
      this.StepDetailsSubject.value.steps.find(
        (x) => x.id == this.SelectedPageSubject.value
      ).isDefaultSelected = true;
      this.StepDetailsSubject.value.steps.find(
        (x) => x.id == this.SelectedPageSubject.value
      ).stepDescription = this.SchedulerServicesSubject.value[0].name;
      this.StepDetailsSubject.next(this.StepDetailsSubject.value);
      this.SchedulerServicesSubject.next(this.SchedulerServicesSubject.value);
      this.SchedulerExecutionalDataSubject.next(
        this.SchedulerExecutionalDataSubject.value
      );
      this.NextButtonClick();
    }
  }

  private CheckAvailableServicesAndSendThemToRespectiveBackPage() {
    if (
      this.SchedulerServicesSubject.value?.length == 1 &&
      this.SelectedPageSubject.value ==
      AppointmentSchedulerPageName.AvailableServiceSelectionPage
    ) {
      this.SchedulerExecutionalDataSubject.value.serviceId = null;
      this.SchedulerServicesSubject.value.map((x) => {
        x.isSelected = false;
      });
      this.StepDetailsSubject.value.steps.find(
        (x) => x.id == this.SelectedPageSubject.value
      ).stepDescription = '';
      this.StepDetailsSubject.value.steps.find(
        (x) => x.id == this.SelectedPageSubject.value
      ).isDefaultSelected = false;
      this.StepDetailsSubject.next(this.StepDetailsSubject.value);
      this.SchedulerServicesSubject.next(this.SchedulerServicesSubject.value);
      this.SchedulerExecutionalDataSubject.next(
        this.SchedulerExecutionalDataSubject.value
      );
      this.BackButtonClick();
    }
  }

  private IsAuthenticatedUserByOTP(): boolean {
    const token = this.browserStorageService.AppointmentVerificationToken;
    const decodedToken = new JwtHelperService().decodeToken(
      this.browserStorageService.AppointmentVerificationToken
    );
    return token && decodedToken.appointmentId == this.CustomerAppointmentId;
  }

  private GetPreviousPage() {
    return this.GetPageDetails().find(
      (x) => x.currentPage == this.SelectedPageSubject.value
    ).previousPage;
  }

  private GetNextPage() {
    return this.GetPageDetails().find(
      (x) => x.currentPage == this.SelectedPageSubject.value
    ).nextPage;
  }

  //#endregion

  //#region Common public functions

  IsAuthenTicatedUser() {
    return !this.tokenService.IsAccessTokenExpired();
  }

  //#endregion

  //#region Default Data Get Functions

  private GetDefaultSchedulerExecutionData(): ISchedulerExecutionalData {
    return {
      id: null,
      appointmentTime: null,
      mobileTemplateId: null,
      branchId: null,
      branchName: null,
      customerEmailAddress: null,
      customerPhoneNumber: null,
      appointmentDate: null,
      globalQuestion: [],
      isAgreeTermsAndCondition: false,
      appointmentUniqueIdentifier: null,
      descriptions: [],
      queueId: null,
      serviceId: null,
      serviceQuestionsSet: [],
      appointmentUTCDate: null,
      schedulerId: null,
      appointmentStatus: null,
      serviceQuestionsSetIds: {
        currentQuestionSetId: null,
        ids: [],
        previousQuestionSetId: null,
      },
      appointmentDetails: {
        selectedDate: new Date(),
        firstAvailable: true,
        selectDifferentDate: false,
        maxAppointmentBookingDate: null,
      },
    };
  }

  private GetDefaultSteps(): IStepDetails {
    const schedulerData = this.SchedulerDataSubject?.value?.designerPanel;
    const selectedLanguage = this.SelectedLanguageSubject?.value?.selectedLanguage || this.SelectedLanguageSubject?.value?.defaultLanguage;
    return {
      isLinear: true,
      steps: [
        {
          id: AppointmentSchedulerPageName.NearestBranchSelectionPage,
          label: schedulerData?.locationTabText[selectedLanguage] || 'Location',
          pageName: [
            'NearestBranchSelectionPage',
            'PreviouslyVisitedBranchSelectionPage',
          ],
          isValid: true,
          stepDescription:
            'Location 5674 -576 Spring Street, Los Angeles, CA 90014',
          isVisited: false,
          isDefaultSelected: false,
        },
        {
          label: schedulerData?.serviceTabText[selectedLanguage] || 'Service',
          id: AppointmentSchedulerPageName.AvailableServiceSelectionPage,
          pageName: ['AvailableServiceSelectionPage'],
          isValid: true,
          stepDescription: 'Open a New Account',
          isVisited: false,
          isDefaultSelected: false,
        },
        {
          label: schedulerData?.appointmentTabText[selectedLanguage] || 'Appointment',
          id: AppointmentSchedulerPageName.AppointmentSchedulePage,
          pageName: ['AppointmentSchedulePage'],
          isValid: true,
          stepDescription: '',
          isVisited: false,
          isDefaultSelected: false,
        },
        {
          id: AppointmentSchedulerPageName.InformationGatheringPage,
          label: schedulerData?.informationTabText[selectedLanguage] || 'Information',
          pageName: ['InformationGatheringPage'],
          isValid: true,
          stepDescription: schedulerData?.informationTabText[selectedLanguage] || 'Information',
          isVisited: false,
          isDefaultSelected: false,
        },
        {
          id: AppointmentSchedulerPageName.AppointmentNotificationPreferencePage,
          label: schedulerData?.reviewTabText[selectedLanguage] || 'Review',
          pageName: ['AppointmentNotificationPreferencePage'],
          isValid: true,
          stepDescription: schedulerData?.reviewTabText[selectedLanguage] || 'Review',
          isVisited: false,
          isDefaultSelected: false,
        },
      ],
    };
  }
  GetDefaultMessages(): IValidationMessage {
    return {
      message: '',
      showValidationMessage: false,
    };
  }
  private GetMiles(): IMiles[] {
    return [
      {
        text: `5 ${this.AppointmentTextsSubject?.value?.appointmentMiles || 'miles'}`,
        value: 5,
        isSelected: false,
      },
      {
        text: `10 ${this.AppointmentTextsSubject?.value?.appointmentMiles || 'miles'}`,
        value: 10,
        isSelected: false,
      },
      {
        text: `20 ${this.AppointmentTextsSubject?.value?.appointmentMiles || 'miles'}`,
        value: 20,
        isSelected: false,
      },
      {
        text: `50 ${this.AppointmentTextsSubject?.value?.appointmentMiles || 'miles'}`,
        value: 50,
        isSelected: false,
      },
      {
        text: `100 ${this.AppointmentTextsSubject?.value?.appointmentMiles || 'miles'}`,
        value: 100,
        isSelected: true,
      },
    ];
  }

  private GetSchedulerDefaultServices(): ISchedularService[] {
    const Services: ISchedularService[] = [];
    Services.push({
      itemId: '001',
      isSelected: false,
      name: 'Pickup Debit Card',
      url: '/../../assets/img/service1.PNG',
    });
    Services.push({
      itemId: '002',
      isSelected: false,
      name: 'Open New Account',
      url: '/../../assets/img/service2.PNG',
    });
    Services.push({
      itemId: '003',
      isSelected: false,
      name: 'Make a Deposit',
      url: '/../../assets/img/service-img3.png  ',
    });
    return Services;
  }

  private GetPageDetails() {
    //&& (this.URLType !== SharableLinkType.AService)
    return [
      {
        currentPage: AppointmentSchedulerPageName.NearestBranchSelectionPage,
        nextPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.AppointmentSchedulePage :
            AppointmentSchedulerPageName.AvailableServiceSelectionPage,
        previousPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.InformationGatheringPage : '',
      },
      {
        currentPage: AppointmentSchedulerPageName.AvailableServiceSelectionPage,
        nextPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.InformationGatheringPage : AppointmentSchedulerPageName.AppointmentSchedulePage,
        previousPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            '' : AppointmentSchedulerPageName.NearestBranchSelectionPage,
      },
      {
        currentPage: AppointmentSchedulerPageName.AppointmentSchedulePage,
        nextPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.AppointmentNotificationPreferencePage :
            AppointmentSchedulerPageName.InformationGatheringPage,
        previousPage:
          (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
            && (this.URLType == SharableLinkType.ABranch || this.URLType == SharableLinkType.BranchAndService)) ?
            AppointmentSchedulerPageName.InformationGatheringPage
            : (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst)
              ? AppointmentSchedulerPageName.NearestBranchSelectionPage
              : AppointmentSchedulerPageName.AvailableServiceSelectionPage,
      },
      {
        currentPage: AppointmentSchedulerPageName.InformationGatheringPage,
        nextPage:
          (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
            && this.URLType !== SharableLinkType.ABranch && this.URLType !== SharableLinkType.BranchAndService) ?
            AppointmentSchedulerPageName.NearestBranchSelectionPage
            : (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
              && this.URLType == SharableLinkType.ABranch) ? AppointmentSchedulerPageName.AppointmentSchedulePage
              : (this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst
                && this.URLType === SharableLinkType.BranchAndService) ?
                AppointmentSchedulerPageName.AppointmentSchedulePage
                : AppointmentSchedulerPageName.AppointmentNotificationPreferencePage,
        previousPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.AvailableServiceSelectionPage :
            AppointmentSchedulerPageName.AppointmentSchedulePage,
      },
      {
        currentPage:
          AppointmentSchedulerPageName.AppointmentNotificationPreferencePage,
        nextPage: null,
        previousPage:
          this.SchedulerDataSubject.value.designerPanel.schedulerType === SchedulerType.QuestionFirst ?
            AppointmentSchedulerPageName.AppointmentSchedulePage :
            AppointmentSchedulerPageName.InformationGatheringPage,
      },
    ];
  }

  //#endregion

  CallLanguageListAPI() {
    this.companyAPIService
      .GetExternalLanguages<ISupportedLanguage>(this.authService.CompanyId != null ? this.authService.CompanyId : this.CompanyId)
      .subscribe((x: ISupportedLanguage[]) => {
        if (this.SelectedLanguageSubject.value &&
          (this.SelectedLanguageSubject.value.selectedLanguage !== x.find((l) => l.isDefault).languageCode)) {
          x.forEach((lan) => {
            if (lan.languageCode == this.SelectedLanguageSubject.value.selectedLanguage) {
              return lan.isDefault = true;
            } else {
              lan.isDefault = false;
            }
          })
        }
        this.LanguageSubject.next(x);
        if (x.find((l) => l.isDefault).languageCode !== 'en') {
          this.getTranslatedMultipleTexts(x.find((l) => l.isDefault).languageCode)
        }

        this.DefaultLanguageSubject.next(
          x.find((l) => l.isDefault).languageCode
        );
      });
  }

  GetLanguageWiseSrc(urls) {
    const src = [];
    this.LanguageSubject.value.forEach((lang) => {
      src.push({
        language: lang.language,
        languageCode: lang.languageCode,
        url: lang.isDefault ? urls : [],
      });
    });
    return src;
  }

  public updateStepLabel(designerPanel: any) {
    this.StepDetailsSubject.value?.steps.forEach((step) => {
      if (step.id === 'AvailableServiceSelectionPage') {
        step.label = designerPanel.serviceTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.label;
        step.stepDescription = this.SchedulerServicesSubject.value.find(
          (x) => x.itemId == this.SchedulerExecutionalDataSubject.value.serviceId)?.name || step.stepDescription;
      } else if (step.id === 'InformationGatheringPage') {
        step.label = designerPanel.informationTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.label;
        step.stepDescription = designerPanel.informationTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.stepDescription;
      } else if (step.id === 'NearestBranchSelectionPage') {
        step.label = designerPanel.locationTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.label;
        step.stepDescription = step.stepDescription;
      } else if (step.id === 'AppointmentSchedulePage') {
        step.label = designerPanel.appointmentTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.label;
        step.stepDescription = step.stepDescription;
      } else if (step.id === 'AppointmentNotificationPreferencePage') {
        step.label = designerPanel.reviewTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.label;
        step.stepDescription = designerPanel.reviewTabText[
          this.SelectedLanguageSubject.value?.selectedLanguage ||
          this.SelectedLanguageSubject.value?.defaultLanguage] || step.stepDescription;
      }
    });
    this.StepDetailsSubject.next(Object.create(this.StepDetailsSubject.value));
  }

  getMultipleSpecificTextTranslateBody(textToTranslate): Array<object> {
    const translatedTextBody = [
      {
        text: textToTranslate,
        type: "reviewPageDate",
      },

    ];
    return translatedTextBody;

  }

  getHoursOfOperationTextTranslateBody(): Array<object> {
    const translatedTextBody = [
      {
        text: "Sunday",
        type: "Sunday",
      },
      {
        text: "Monday",
        type: "Monday",
      },
      {
        text: "Tuesday",
        type: "Tuesday",
      },
      {
        text: "Wednesday",
        type: "Wednesday",
      },
      {
        text: "Thursday",
        type: "Thursday",
      },
      {
        text: "Friday",
        type: "Friday",
      },
      {
        text: "Saturday",
        type: "Saturday",
      },

    ];
    return translatedTextBody;

  }

  getTranslatedMultipleTexts(languageId: string): any {
    this.translateApiService.TranslateMultipleTexts(this.getMultipleTextTranslateBody(), languageId, this.authService.CompanyId != null ? this.authService.CompanyId : this.CompanyId, true).subscribe((response: AppointmentTextInterface) => {
      this.AppointmentTextsSubject.next(response);
      this.MilesSubject.next(this.GetMiles())
      this.StepDetailsSubject.next(Object.create(this.StepDetailsSubject.value))
      if (this.ValidationMessageSubject.value?.message) {
        this.ValidContext();
      }
    });

  }

  translateHoursOfOperationTexts(languageId: string, loading: boolean): any {
    if (languageId == 'en') {
      this.TranslatedDaysSubject.next(this.defaultTranslatedDays);
    } else {
      this.translateApiService.TranslateMultipleTexts(this.getHoursOfOperationTextTranslateBody(), languageId, this.authService.CompanyId != null ? this.authService.CompanyId : this.CompanyId, loading).subscribe((response: any) => {
        this.TranslatedDaysSubject.next(response);
      });
    }
  }

  translateSpecificTexts(languageId: string, loading): any {
    const textToTranslate = this.StepDetailsSubject.getValue()?.steps?.find((des) => des.id === "AppointmentSchedulePage")?.stepDescription
    if (textToTranslate) {
      this.translateApiService.TranslateMultipleTexts(this.getMultipleSpecificTextTranslateBody(textToTranslate), languageId, this.authService.CompanyId != null ? this.authService.CompanyId : this.CompanyId, loading).subscribe((response: any) => {
        this.StepDetailsSubject.getValue().steps.find(obj => obj.id == "AppointmentSchedulePage").stepDescription = response.reviewPageDate;
        this.StepDetailsSubject.next(Object.create(this.StepDetailsSubject.value));
      });
    }
  }
  // whenever you add any property in this function you have to change in scheduler designer service also
  getDefaultAppointmentTexts(): AppointmentTextInterface {
    return {
      [AppointmentTextTypeEnum.appointmentNotAvailableShortType]: AppointmentTextEnum.appointmentNotAvailableShortText,
      [AppointmentTextTypeEnum.appointmentLocationAvailableTimeType]: AppointmentTextEnum.appointmentLocationAvailableTimeText,
      [AppointmentTextTypeEnum.appointmentLocationPlaceHolderType]: AppointmentTextEnum.appointmentLocationPlaceHolderText,
      [AppointmentTextTypeEnum.appointmentFirstAvailableButtonType]: AppointmentTextEnum.appointmentFirstAvailableButtonText,
      [AppointmentTextTypeEnum.appointmentSelectDifferentDateButtonType]: AppointmentTextEnum.appointmentSelectDifferentDateButtonText,
      [AppointmentTextTypeEnum.appointmentNotAvailableTextType]: AppointmentTextEnum.appointmentNotAvailableText,
      [AppointmentTextTypeEnum.appointmentSupplementalQuestionHeaderType]: AppointmentTextEnum.appointmentSupplementalQuestionHeaderText,
      [AppointmentTextTypeEnum.appointmentReviewPageHeaderType]: AppointmentTextEnum.appointmentReviewPageHEaderText,
      [AppointmentTextTypeEnum.appointmentReviewPageDataMessageType]: AppointmentTextEnum.appointmentReviewPageDataMessageText,
      [AppointmentTextTypeEnum.appointmentReviewPageEmailFieldType]: AppointmentTextEnum.appointmentReviewPageEmailFieldText,
      [AppointmentTextTypeEnum.appointmentReviewPageSubmitButtonType]: AppointmentTextEnum.appointmentReviewPageSubmitButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageThankYouMessageType]: AppointmentTextEnum.appointmentSuccessPageThankYouMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageBookedMessageType]: AppointmentTextEnum.appointmentSuccessPageBookedMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageConfirmedMessageType]: AppointmentTextEnum.appointmentSuccessPageConfirmedMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageReSchedulerMessageType]: AppointmentTextEnum.appointmentSuccessPageReSchedulerMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageCancelledMessageType]: AppointmentTextEnum.appointmentSuccessPageCancelledMessageText,
      [AppointmentTextTypeEnum.appointmentSuccessPageDetailHeaderType]: AppointmentTextEnum.appointmentSuccessPageDetailHeaderText,
      [AppointmentTextTypeEnum.appointmentSuccessPageNotificationHeaderType]: AppointmentTextEnum.appointmentSuccessPageNotificationHeaderText,
      [AppointmentTextTypeEnum.appointmentPhoneNumberFieldType]: AppointmentTextEnum.appointmentPhoneNumberFieldText,
      [AppointmentTextTypeEnum.appointmentSuccessPageExitButtonType]: AppointmentTextEnum.appointmentSuccessPageExitButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageCancelButtonType]: AppointmentTextEnum.appointmentSuccessPageCancelButtonText,
      [AppointmentTextTypeEnum.appointmentSuccessPageModifyButtonType]: AppointmentTextEnum.appointmentSuccessPageModifyButtonText,
      [AppointmentTextTypeEnum.appointmentModifyModelHeaderType]: AppointmentTextEnum.appointmentModifyModelHeaderText,
      [AppointmentTextTypeEnum.appointmentModifyModelSendCodeTitleType]: AppointmentTextEnum.appointmentModifyModelSendCodeTitleText,
      [AppointmentTextTypeEnum.appointmentCancelButtonType]: AppointmentTextEnum.appointmentCancelButtonText,
      [AppointmentTextTypeEnum.appointmentVerifyCodeButtonType]: AppointmentTextEnum.appointmentVerifyCodeButtonText,
      [AppointmentTextTypeEnum.appointmentResendVerifyCodeType]: AppointmentTextEnum.appointmentResendVerifyCodeText,
      [AppointmentTextTypeEnum.appointmentEnterCodeFieldPlaceHolderType]: AppointmentTextEnum.appointmentEnterCodeFieldPlaceHolderText,
      [AppointmentTextTypeEnum.appointmentConfirmationHeaderType]: AppointmentTextEnum.appointmentConfirmationHeaderText,
      [AppointmentTextTypeEnum.appointmentServiceNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentServiceNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentLocationNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentLocationNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentSlotNotSelectedErrorMessageType]: AppointmentTextEnum.appointmentSlotNotSelectedErrorMessageText,
      [AppointmentTextTypeEnum.appointmentRequiredFieldErrorMessageType]: AppointmentTextEnum.appointmentRequiredFieldErrorMessageText,
      [AppointmentTextTypeEnum.appointmentCancelledMessageType]: AppointmentTextEnum.appointmentCancelledMessageText,
      [AppointmentTextTypeEnum.appointmentConfirmDeleteMessageType]: AppointmentTextEnum.appointmentConfirmDeleteMessageText,
      [AppointmentTextTypeEnum.appointmentHOOHeaderType]: AppointmentTextEnum.appointmentHOOHeaderText,
      [AppointmentTextTypeEnum.appointmentServiceOfferTitleType]: AppointmentTextEnum.appointmentServiceOfferTitleText,
      [AppointmentTextTypeEnum.appointmentSelectLocationButtonType]: AppointmentTextEnum.appointmentSelectLocationButtonText,
      [AppointmentTextTypeEnum.appointmentRadiusHeaderType]: AppointmentTextEnum.appointmentRadiusHeaderText,
      [AppointmentTextTypeEnum.appointmentOTPAuthenticationMessageType]: AppointmentTextEnum.appointmentOTPAuthenticationMessageText,
      [AppointmentTextTypeEnum.appointmentOTPRequiredMessageType]: AppointmentTextEnum.appointmentOTPRequiredMessageText,
      [AppointmentTextTypeEnum.appointmentInvalidOTPMessageType]: AppointmentTextEnum.appointmentInvalidOTPMessageText,
      [AppointmentTextTypeEnum.appointmentModifyMessageType]: AppointmentTextEnum.appointmentModifyMessageText,
      [AppointmentTextTypeEnum.appointmentRequiredSpecificFieldErrorMessageType]: AppointmentTextEnum.appointmentRequiredSpecificFieldErrorMessageText,
      [AppointmentTextTypeEnum.appointmentInvalidFieldMessageType]: AppointmentTextEnum.appointmentInvalidFieldMessageText,
      [AppointmentTextTypeEnum.appointmentAgreeMessageType]: AppointmentTextEnum.appointmentAgreeMessageText,
      [AppointmentTextTypeEnum.appointmentTermConditionMessageType]: AppointmentTextEnum.appointmentTermConditionMessageText,
      [AppointmentTextTypeEnum.appointmentMilesType]: AppointmentTextEnum.appointmentMilesText,
      [AppointmentTextTypeEnum.appointmentNonWorkingDaysType]: AppointmentTextEnum.appointmentNonWorkingDaysText,
      [AppointmentTextTypeEnum.appointmentWrongPhoneType]: AppointmentTextEnum.appointmentWrongPhoneText,
      [AppointmentTextTypeEnum.appointmentWrongEmailType]: AppointmentTextEnum.appointmentWrongEmailText,
    };
  }

  getMultipleTextTranslateBody(): Array<object> {
    const translatedTextBody = [
      {
        text: AppointmentTextEnum.appointmentNotAvailableShortText,
        type: AppointmentTextTypeEnum.appointmentNotAvailableShortType,
      },
      {
        text: AppointmentTextEnum.appointmentLocationAvailableTimeText,
        type: AppointmentTextTypeEnum.appointmentLocationAvailableTimeType,
      },
      {
        text: AppointmentTextEnum.appointmentWrongEmailText,
        type: AppointmentTextTypeEnum.appointmentWrongEmailType,
      },
      {
        text: AppointmentTextEnum.appointmentWrongPhoneText,
        type: AppointmentTextTypeEnum.appointmentWrongPhoneType,
      },
      {
        text: AppointmentTextEnum.appointmentNonWorkingDaysText,
        type: AppointmentTextTypeEnum.appointmentNonWorkingDaysType,
      },
      {
        text: AppointmentTextEnum.appointmentMilesText,
        type: AppointmentTextTypeEnum.appointmentMilesType,
      },
      {
        text: AppointmentTextEnum.appointmentTermConditionMessageText,
        type: AppointmentTextTypeEnum.appointmentTermConditionMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentAgreeMessageText,
        type: AppointmentTextTypeEnum.appointmentAgreeMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentInvalidFieldMessageText,
        type: AppointmentTextTypeEnum.appointmentInvalidFieldMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentRequiredSpecificFieldErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentRequiredSpecificFieldErrorMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentModifyMessageText,
        type: AppointmentTextTypeEnum.appointmentModifyMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentInvalidOTPMessageText,
        type: AppointmentTextTypeEnum.appointmentInvalidOTPMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentOTPRequiredMessageText,
        type: AppointmentTextTypeEnum.appointmentOTPRequiredMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentLocationPlaceHolderText,
        type: AppointmentTextTypeEnum.appointmentLocationPlaceHolderType,
      },
      {
        text: AppointmentTextEnum.appointmentFirstAvailableButtonText,
        type: AppointmentTextTypeEnum.appointmentFirstAvailableButtonType,
      },
      {
        text: AppointmentTextEnum.appointmentSelectDifferentDateButtonText,
        type: AppointmentTextTypeEnum.appointmentSelectDifferentDateButtonType,
      },
      {
        text: AppointmentTextEnum.appointmentNotAvailableText,
        type: AppointmentTextTypeEnum.appointmentNotAvailableTextType,
      },
      {
        text: AppointmentTextEnum.appointmentSlotNotSelectedErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentSlotNotSelectedErrorMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentSupplementalQuestionHeaderText,
        type: AppointmentTextTypeEnum.appointmentSupplementalQuestionHeaderType,
      },
      {
        text: AppointmentTextEnum.appointmentReviewPageHEaderText,
        type: AppointmentTextTypeEnum.appointmentReviewPageHeaderType,
      },
      {
        text: AppointmentTextEnum.appointmentReviewPageDataMessageText,
        type: AppointmentTextTypeEnum.appointmentReviewPageDataMessageType,
      },
      {
        text: AppointmentTextEnum.appointmentReviewPageEmailFieldText,
        type: AppointmentTextTypeEnum.appointmentReviewPageEmailFieldType,
      },
      {
        text: AppointmentTextEnum.appointmentReviewPageSubmitButtonText,
        type: AppointmentTextTypeEnum.appointmentReviewPageSubmitButtonType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageThankYouMessageText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageThankYouMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageBookedMessageText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageBookedMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageConfirmedMessageText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageConfirmedMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageReSchedulerMessageText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageReSchedulerMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageCancelledMessageText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageCancelledMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageDetailHeaderText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageDetailHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageNotificationHeaderText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageNotificationHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageExitButtonText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageExitButtonType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageCancelButtonText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageCancelButtonType
      },
      {
        text: AppointmentTextEnum.appointmentSuccessPageModifyButtonText,
        type: AppointmentTextTypeEnum.appointmentSuccessPageModifyButtonType
      },
      {
        text: AppointmentTextEnum.appointmentPhoneNumberFieldText,
        type: AppointmentTextTypeEnum.appointmentPhoneNumberFieldType
      },
      {
        text: AppointmentTextEnum.appointmentModifyModelHeaderText,
        type: AppointmentTextTypeEnum.appointmentModifyModelHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentModifyModelSendCodeTitleText,
        type: AppointmentTextTypeEnum.appointmentModifyModelSendCodeTitleType
      },
      {
        text: AppointmentTextEnum.appointmentCancelButtonText,
        type: AppointmentTextTypeEnum.appointmentCancelButtonType
      },
      {
        text: AppointmentTextEnum.appointmentVerifyCodeButtonText,
        type: AppointmentTextTypeEnum.appointmentVerifyCodeButtonType
      },
      {
        text: AppointmentTextEnum.appointmentResendVerifyCodeText,
        type: AppointmentTextTypeEnum.appointmentResendVerifyCodeType
      },
      {
        text: AppointmentTextEnum.appointmentEnterCodeFieldPlaceHolderText,
        type: AppointmentTextTypeEnum.appointmentEnterCodeFieldPlaceHolderType
      },
      {
        text: AppointmentTextEnum.appointmentConfirmationHeaderText,
        type: AppointmentTextTypeEnum.appointmentConfirmationHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentServiceNotSelectedErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentServiceNotSelectedErrorMessageType
      },
      {
        text: AppointmentTextEnum.appointmentLocationNotSelectedErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentLocationNotSelectedErrorMessageType
      },
      {
        text: AppointmentTextEnum.appointmentSlotNotSelectedErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentSlotNotSelectedErrorMessageType
      },
      {
        text: AppointmentTextEnum.appointmentRequiredFieldErrorMessageText,
        type: AppointmentTextTypeEnum.appointmentRequiredFieldErrorMessageType
      },
      {
        text: AppointmentTextEnum.appointmentCancelledMessageText,
        type: AppointmentTextTypeEnum.appointmentCancelledMessageType
      },
      {
        text: AppointmentTextEnum.appointmentConfirmDeleteMessageText,
        type: AppointmentTextTypeEnum.appointmentConfirmDeleteMessageType
      },
      {
        text: AppointmentTextEnum.appointmentHOOHeaderText,
        type: AppointmentTextTypeEnum.appointmentHOOHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentServiceOfferTitleText,
        type: AppointmentTextTypeEnum.appointmentServiceOfferTitleType
      },
      {
        text: AppointmentTextEnum.appointmentSelectLocationButtonText,
        type: AppointmentTextTypeEnum.appointmentSelectLocationButtonType
      },
      {
        text: AppointmentTextEnum.appointmentRadiusHeaderText,
        type: AppointmentTextTypeEnum.appointmentRadiusHeaderType
      },
      {
        text: AppointmentTextEnum.appointmentOTPAuthenticationMessageText,
        type: AppointmentTextTypeEnum.appointmentOTPAuthenticationMessageType
      },
    ];
    return translatedTextBody;

  }
}

//#region Functions
function getOffsetByTimezone(timezone: string): number {
  return ZonedDate.fromLocalDate(new Date(), timezone).timezoneOffset;
}

function toIsoString(
  offset: number,
  year: number,
  month: number,
  date: number,
  hours: number,
  minutes: number
) {
  var tzo = -offset,
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      return (num < 10 ? '0' : '') + num;
    };

  return year +
    '-' + pad(month + 1) +
    '-' + pad(date) +
    'T' + pad(hours) +
    ':' + pad(minutes) +
    ':' + pad(0) +
    dif + pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' + pad(Math.abs(tzo) % 60);
}

function getSlotString(date: string, time: ITime): string {
  if (!date || !time) {
    return '';
  }
  const newDate = new Date(date);
  return `${newDate.getUTCFullYear().toString()}${newDate.getMonth() + 1
    }${newDate
      .getDate()
      .toString()}_${time.hours.toString()}${time.minutes.toString()}`;
}

//#endregion
