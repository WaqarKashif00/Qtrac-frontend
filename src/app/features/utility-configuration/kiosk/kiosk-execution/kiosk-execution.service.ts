import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { CheckServiceAvailability, ServiceAvailableOrNotDefault } from 'src/app/core/utilities/workflow-service-available';
import { ILanguageDropdownList } from 'src/app/models/common/language-dropdownlist.interface';
import { IWorkFlowDropdown } from 'src/app/models/common/workflow-dropdown.interface';
import { KioskExecution } from 'src/app/models/constants/kiosk-constants';
import { KioskPageName } from 'src/app/models/enums/kiosk-page-name.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import { OperationalOccurs } from 'src/app/models/enums/week-days.enum';
import {
  RulesDocument,
  RulesDocumentReference
} from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { isDateLiesBetweenTwoDates } from 'src/app/shared/utility-functions/utility-functions.module';
import { DynamicVariableService } from '../../../../core/services/dynamic-variables.service';
import { TextToSpeechService } from '../../../../core/services/text-to-speech.service';
import { TicketItem } from '../../../../models/enums/ticket-items.enum';
import { BranchAPIService } from '../../../../shared/api-services/branch-api.service';
import { KioskAPIService } from '../../../../shared/api-services/kiosk-api.service';
import { WorkflowAPIService } from '../../../../shared/api-services/workflow-api.service';
import {
  GetEstimateWait,
  GetFormattedTime
} from '../../mobile/monitor-mobile/monitor-mobile.service';
import { HideAppBtnIfAppNotExist } from '../../template-shared/utilities';
import { Mode } from '../kiosk-add/kiosk-layout/Models/controls/service-panel.control';
import { IBranchDetails } from '../kiosk-add/kiosk-layout/Models/kiosk-branch-details.interface';
import {
  IHoursOfOperation,
  ITime,
  ITimeFrame,
  IWorkingDay,
  IWorkingHours
} from '../kiosk-add/kiosk-layout/Models/kiosk-hours-of-operations.interface';
import {
  IKioskButtonControlData,
  IKioskLabelControlData,
  IKioskLayoutData,
  IKioskPreServiceQuestionPageData,
  IKioskServiceQuestionPageData,
  IValidation,
  IWorkFlowDetail,
  IWorkFlowQuestionData,
  IWorkFlowServiceData,
  IWorkFlowServiceQuestionConditionRoute,
  IWorkFlowServiceRoute
} from '../kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import {
  IKioskPanelItemsData,
  IKioskPreviewData,
  IKioskPreviewPageData
} from '../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import {
  IKioskRequest,
  KioskResponse
} from '../kiosk-add/kiosk-layout/Models/kiosk-request-post-data.interface';
import { IPage } from '../kiosk-add/kiosk-layout/Models/pages.interface';

const OffsetPerformWhens = {
  StartOfDay: 'Start of the day',
  EndOfDay: 'End of the day',
  StartOfBreak: 'Start of a break',
  EndOfBreak: 'Break ends',
};

const OffsetPerformAts = {
  After: 'After',
  Before: 'Before',
};

const OffsetOperation = {
  Start: 'Start',
  End: 'Close',
};

@Injectable()
export class KioskExecutionService extends AbstractComponentService {
  get BranchId(): string {
    // ToDo : need to verify this data
    const  branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    return branchId;
  }

  get DeviceId(): string {
    // ToDo : need to verify this data
    const  browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    return browserId;
  }

  get CompanyId(): string {
    // ToDo : need to verify this data
    const  companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    return companyId;
  }

  get CurrentBranchTime(): Date {
    return this.GetCurrentBranchTime();
  }

  SelectedService: string;
  DefaultLanguageId: any;

  KendoTimeZoneData = ZonedDate;

  private ServiceId: string;
  private FirstPageName: string;

  get HomePageName(): string {
    return this.FirstPageName;
  }

  estimatedServingTimeUTCString;
  estimatedWaitRangesSettings;

  private KioskLayoutDataSubject: BehaviorSubject<IKioskPreviewData>;
  KioskLayoutData$: Observable<IKioskPreviewData>;
  private SubjectHoursOfOperationList: BehaviorSubject<any[]>;
  HoursOfOperationList$: Observable<any[]>;
  WorkFlowData: IWorkFlowDetail;
  branchHoursOfOperation: IHoursOfOperation;
  branchServices: string[];
  SubjectBranch: BehaviorSubject<IBranchDetails>;
  Branch$: Observable<IBranchDetails>;
  QuestionTypes = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];

  PageNames = { // User active inactive logic is depend upon sequence of this object keys it should be same as KioskPageName enum;
    language: 'languagePage',
    welcome: 'welcomePage',
    preService: 'preServiceQuestionPage',
    service: 'servicePage',
    serviceQuestion: 'serviceQuestion',
    thankYou: 'thankYouPage',
    NoQueuePage: 'noQueuePage',
    OffLinePage: 'offLinePage',
  };

  private SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;

  private showBackButtonSubject: BehaviorSubject<boolean>;
  public showBackButton$: Observable<boolean>;

  SubjectHoursOfOperation: BehaviorSubject<IHoursOfOperation>;
  HoursOfOperation$: Observable<IHoursOfOperation>;
  HoursOfOperation: IHoursOfOperation;

  kioskData;
  kioskLayoutData: IKioskLayoutData;
  RefKioskLayoutData: IKioskLayoutData;
  ContainerWidth: number;
  ContainerHeight: number;
  ExecutionWaitingTime$: Observable<number>;
  IsKeyBoardAllowed$: Observable<boolean>;
  CurrentLanguageId: any;
  PageSubject: BehaviorSubject<IPage>;
  Page$: Observable<IPage>;
  Page: IPage;
  currentPageDetailId: any;
  private IsKioskDeviceStandByModeSubject: BehaviorSubject<boolean>;
  IsKioskDeviceStandByMode$: Observable<boolean>;
  IsModelOpenSubject: BehaviorSubject<boolean>;
  IsOpened$: Observable<boolean>;

  LanguageListSubject: BehaviorSubject<ILanguageDropdownList[]>;
  LanguageList$: Observable<ILanguageDropdownList[]>;

  MobileInterfaceId: string;
  CurrentPageIndex = 0;
  BackButtonName = 'Back Button';
  ServiceQuestionId: string;

  AllServiceQuestionPages: IKioskPreviewPageData[] = [];
  QuestionSetStack: IWorkFlowServiceRoute[] = [];

  AlreadyCalculated: any[] = [];
  KioskDataCopy;

  constructor(
    private readonly textToSpeechService: TextToSpeechService,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService,
    private readonly kioskAPIService: KioskAPIService,
    private dynamicVariablesService: DynamicVariableService,
  ) {
    super();
    this.InitializeSubjects();
    this.InitializeBranchDetails();
    this.SubscribeToAzureSignalRObservables();
    this.ShowExecutionPage();
  }

  private SubscribeToAzureSignalRObservables() {
    this.azureSignalRService.refreshWindowSubject.subscribe(() => {
      window.location.reload();
    });

    this.azureSignalRService.kioskDeviceSendMessageSubject.subscribe(
      (value) => {
        this.AppNotificationService.Notify(value);
        this.textToSpeechService.speak(value, "en-US");
      }
    );

    this.azureSignalRService.kioskDeRegisterSubject.subscribe(() => {
      this.browserStorageService.RemoveKioskExecutionToken();
      this.browserStorageService.RemoveKioskShutDownDetails();
      this.azureSignalRService.stopSignalRConnection();
      this.routeHandlerService.RedirectToKioskRegistrationPage();
    });

    this.azureSignalRService.kioskStandBySubject.subscribe((value) => {
      this.browserStorageService.SetKioskShutDownDetails(JSON.stringify(value));
      this.SetTimerToNavigateBackAfterShutDownHour();
      this.IsKioskDeviceStandByModeSubject.next(
        this.IsKioskDeviceStandByMode()
      );
    });
    this.azureSignalRService.kioskShutdownSubject.subscribe((value) => {
      this.routeHandlerService.RedirectToKioskShutdownPage(value);
    });
  }

  async InitializeHOO() {
    const Branch = this.SubjectBranch.getValue();
    const hoursOfOperationExceptionId =
      Branch?.advanceSettings?.hoursOfOperationExceptionId;
    if (hoursOfOperationExceptionId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>(
          this.CompanyId,
          hoursOfOperationExceptionId
        )
        .toPromise();
      if (
        isDateLiesBetweenTwoDates(
          HOO.generalConfiguration.fromDate,
          HOO.generalConfiguration.toDate,
          this.CurrentBranchTime
        )
      ) {
        this.SubjectHoursOfOperation.next(HOO);
        return;
      }
    }

    const HOOId: string = Branch?.additionalSettings?.hoursOfOperationId;
    if (HOOId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>(this.CompanyId, HOOId)
        .toPromise();
      this.SubjectHoursOfOperation.next(HOO);
    } else {
      this.AppNotificationService.NotifyError(
        'Hours of operations not linked to branch.'
      );
    }
  }

  ShowExecutionPage() {
    this.IsModelOpenSubject.next(false);
    this.InitializeKioskLayoutData();
  }

  InitializeBranchDetails() {
    this.branchAPIService
      .GetExternal<IBranchDetails>(this.CompanyId, this.BranchId)
      .subscribe((branchData: IBranchDetails) => {
        this.GetBranchLanguages(branchData);
        this.SubjectBranch.next(branchData);
        this.SetWorkFlowList();
        this.InitializeHOO();
        this.InitializeKioskLayoutData();
      });
  }

  private GetBranchLanguages(branchData: IBranchDetails) {
    const languages = branchData?.supportedLanguages;
    if (languages && languages.length > 0) {
      this.DefaultLanguageId = languages.find(
        (x) => x.isDefault
      ).languageCode;
    }
    this.LanguageListSubject.next(languages);
  }

  CheckIsKioskInStandBy() {
    this.IsKioskDeviceStandByModeSubject.next(this.IsKioskDeviceStandByMode());
  }

  private InitializeKioskLayoutData() {

      this.formService.CombineAPICall(this.GetWorkFlow(),this.GetAllHorusOfOperation()).subscribe(([workflow,hooData])=>{
        this.WorkFlowData = workflow;
        this.SubjectHoursOfOperationList.next(hooData);
        this.ReplaceLanguagePageLabelIfDynamicVariables();
      })
  }


GetWorkFlow(){
 return this.kioskAPIService
  .GetByDeviceId(this.CompanyId, this.BranchId, this.DeviceId)
  .pipe(
    mergeMap((data: IKioskLayoutData) => {
      this.kioskLayoutData = data;
      this.KioskDataCopy = cloneObject(data);
      this.MobileInterfaceId = data.mobileInterfaceId;
      const CompanyId = data.companyId;
      return this.workflowAPIService.GetExternalPublished(
        CompanyId ? CompanyId : this.CompanyId,
        data.designerScreen.WorkFlowId
      );
    })
  )
}

GetAllHorusOfOperation(){
  return this.hoursOfOperationAPIService.GetAllExternal(this.CompanyId);
}

  ReplaceLanguagePageLabelIfDynamicVariables() {
    this.FirstPageName = this.GetPageName();
    let languageId = this.DefaultLanguageId;
    if (this.FirstPageName !== 'languagePage'){
      this.CurrentLanguageId = (this.LanguageListSubject && this.LanguageListSubject?.value[0].languageCode) || this.DefaultLanguageId;
      languageId =  this.CurrentLanguageId || this.DefaultLanguageId;
    }
    const Labels = (this.kioskLayoutData && this.FirstPageName) ? this.kioskLayoutData[this.FirstPageName].labels : [];
    if (
      Labels.length > 0 &&
      Labels.some((x) => x.text[languageId]?.includes('%'))
    ) {
      const LabelTexts = [];
      Labels.forEach((label) => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId],
        });
      });
      this.CallReplaceDynamicVariableApi(LabelTexts, Labels, languageId, this.FirstPageName);
    } else {
      this.SetAndPassKioskLayoutData(this.kioskLayoutData);
    }
  }

  private GetPageName(){
    if (this.AllServicesOffLineOrNot()){
      this.SetPageVisibilityByPageName(KioskPageName.OffLinePage);
      this.showBackButtonSubject.next(false);
      this.SetOfflinePage();
      return this.PageNames.OffLinePage;
    }else if (this.IsOnlyOneLanguage() && !this.HideWelcomePage()){
      this.SetPageVisibilityByPageName(KioskPageName.WelcomePage);
      return this.PageNames.welcome;
    }else if (this.IsOnlyOneLanguage() && this.HideWelcomePage()){
      if (this.WorkFlowData.setting.enablePreServiceQuestions &&
        (this.DisplayPreServiceQuestionBefore() || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after' && this.IsServicePageSkipOrNot()))) {
          this.SetPageVisibilityByPageName(KioskPageName.PreServiceQuestionPage);
          return this.PageNames.preService;
        }else if (!(this.IsServicePageSkipOrNot())){
          this.SetPageVisibilityByPageName(KioskPageName.ServicePage);
          return this.PageNames.service;
        }else {
          this.SetServiceId();
          const serviceRouting = this.SetServiceRouting();
          this.SelectedService = this.ServiceId || this.currentPageDetailId;
          if (serviceRouting.group === RoutingType.Queue) {
            this.SetPageVisibilityByPageName(KioskPageName.ThankYouPage);
            return this.PageNames.service;
          }else if (serviceRouting.group === RoutingType.Questions) {
            this.SetPageVisibilityByPageName(KioskPageName.ServiceQuestionPage);
            return this.PageNames.serviceQuestion;
          }
        }
    }
    this.SetPageVisibilityByPageName(KioskPageName.LanguagePage);
    return this.PageNames.language;
  }

  private SetOfflinePage() {
    if (!this.kioskLayoutData[this.PageNames.OffLinePage]) {
      this.kioskLayoutData[this.PageNames.OffLinePage] = this.GetDefaultOfflinePage();
      this.KioskDataCopy[this.PageNames.OffLinePage] = this.GetDefaultOfflinePage();
    }
  }

  GetDefaultOfflinePage() {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      buttons: [
        {
          name: "Back Button",
          height: 50,
          width: 100,
          text: {
            en: "Back"
          },
          color: "#fee060",
          font: "Arial",
          fontSize: 13,
          fontStyle: "Normal",
          fontWeight: "normal",
          backgroundColor: "#435d92",
          selected: true,
          left: 700,
          top: 450,
          src: [],
          showIcon: false,
          boxRoundCorners: "10",
          border: "2",
          borderColor: "#ffffff",
          shadow: false
        }
      ],
      controlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0
      }
    };
  }


  AllServicesOffLineOrNot() {
    let serviceAvailable = true;
    if (!this.branchServices || !this.WorkFlowData){
      serviceAvailable = false;
      return serviceAvailable;
    }
    this.WorkFlowData?.services?.forEach((service) => {
      if (!service?.isDeleted) {
        if (this.branchServices?.find(x => x === service.id)) {
          if (this.IsServiceAvailable(service.id)) {
            serviceAvailable = false;
          }
        }
      }
    });
    return serviceAvailable;
  }

  private DisplayPreServiceQuestionBefore() {
    return this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before';
  }

  private IsOnlyOneLanguage() {
    return this.LanguageListSubject?.value?.length === 1;
  }

  private HideWelcomePage() {
    return this.kioskLayoutData.pageProperties ? (this.kioskLayoutData?.pageProperties?.hideWelcomePage) : false;
  }

  CallReplaceDynamicVariableApi(LabelTexts, Labels: IKioskLabelControlData[], languageId: string, pageName: string) {
    const req = this.GetKioskRequest();
    this.dynamicVariablesService
      .GetDynamicVariablesReplacedStrings(LabelTexts, this.WorkFlowData, req)
      .subscribe((s: any) => {
        Labels.forEach((x) => {
          x.text[languageId] = s.find(
            (f) => f.id === x.name
          ).replacementString;
        });
        this.kioskLayoutData[pageName].labels = Labels;
        this.SetAndPassKioskLayoutData(this.kioskLayoutData);
      });
  }

  ShowNextPage(data) {
    if (typeof data === 'string') {
      this.currentPageDetailId = data;
    }
    if (this.Page.IsWelcomePage) {
      this.RedirectFromWelcomePage();
    } else if (this.Page.IsLanguagePage) {
      this.CurrentLanguageId = this.currentPageDetailId;
      this.currentPageDetailId = null;
      this.RedirectFromLanguagePage();
    } else if (this.Page.IsPreServiceQuestionPage) {
      this.RedirectFromPreServiceQuestionPage();
    } else if (this.Page.IsServicePage) {
      if (this.currentPageDetailId !== this.BackButtonName) {
        this.SelectedService = this.ServiceId = this.currentPageDetailId;
        const validation = this.ValidateService(this.ServiceId);
        if (!this.IsServiceAvailable(this.ServiceId)) {
          this.showBackButtonSubject.next(true);
          this.RedirectToOffLine();
          return;
        }
        if (!validation.result) {
          this.AppNotificationService.NotifyError(validation.message);
          return;
        }
      }
      this.RedirectFromServicePage();
      this.currentPageDetailId = null;
    } else if (this.Page.IsServiceQuestionPage) {
      this.ServiceQuestionId =
        this.currentPageDetailId === DefaultButtonsNames.BackButtonName
          ? null
          : this.currentPageDetailId;
      this.RedirectFromServiceQuestionPage();
      this.ServiceQuestionId = this.currentPageDetailId;
      this.currentPageDetailId = null;
    } else if (this.Page.IsThankYouPage) {
      this.RedirectFromThankYouPage();
    }
    this.currentPageDetailId = null;
  }

  RedirectFromLanguagePage() {
    if (!this.HideWelcomePage()) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.welcomePage.labels,
        'welcomePage'
      );
    } else {
      this.RedirectFromWelcomePage();
    }
  }

  private GetWelcomePageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.welcomePage = this.WelcomePageData(Labels);
  }

  private WelcomePageData(Labels: IKioskLabelControlData[]){
    return {
      images: this.kioskLayoutData.welcomePage.images,
      labels: Labels,
      videos: this.kioskLayoutData.welcomePage.videos,
      sliders: this.kioskLayoutData.welcomePage.sliders,
      buttons: this.GetWelcomePageButtons(),
    };
  }

  private GetNoQueuePageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.noQueuePage = this.NoQueuePageData(Labels);
  }

  private NoQueuePageData(Labels: IKioskLabelControlData[]){
    return {
      images: this.kioskLayoutData?.noQueuePage?.images,
      labels: Labels,
      videos: this.kioskLayoutData?.noQueuePage?.videos,
      sliders: this.kioskLayoutData?.noQueuePage?.sliders,
      buttons: this.kioskLayoutData?.noQueuePage?.buttons,
    };
  }

  private GetOffLinePageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.offLinePage = this.OffLinePageData(Labels);
  }
  private OffLinePageData(Labels: IKioskLabelControlData[]){
    return {
      images: this.kioskLayoutData?.offLinePage?.images,
      labels: Labels,
      videos: this.kioskLayoutData?.offLinePage?.videos,
      sliders: this.kioskLayoutData?.offLinePage?.sliders,
      buttons: this.kioskLayoutData?.offLinePage?.buttons,
    };
  }

  private GetWelcomePageButtons(): IKioskButtonControlData[] {
    if (this.IsOnlyOneLanguage() && this.GetFirstPageName(this.PageNames.welcome)) {
    return this.kioskLayoutData.welcomePage.buttons =
    this.kioskLayoutData.welcomePage.buttons.filter(x => x.name === DefaultButtonsNames.NextButtonName);
    }
    else {
    return this.kioskLayoutData.welcomePage.buttons;
    }
  }

  private PerformActionMentionInTheServiceQuestionSet(
    element: IWorkFlowServiceQuestionConditionRoute
  ) {
    element.actions.forEach((x) => {
      if (x.actionType === 'routing') {
        this.RedirectToServiceQuestionORQueuePage({
          id: x.routingId,
          type: x.routingType,
          group: x.group,
        });
      }
    });
  }
  RedirectFromServiceQuestionPage() {
    if (this.currentPageDetailId === DefaultButtonsNames.BackButtonName) {
      this.QuestionSetStack.pop();

      if (this.QuestionSetStack.length > 0) {
        const LastQuestionSet = this.QuestionSetStack.pop();
        this.RedirectToServiceQuestionORQueuePage(LastQuestionSet);
        return;
      } else {
        this.RedirectToPreServiceOrServicePage();
        return;
      }
    }
    this.RedirectFromServiceQuestionPageOnWorkflowSettings();
  }

  private RedirectToPreServiceOrServicePage() {
    if (
      (this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after'  || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' && this.IsServicePageSkipOrNot()))
    ) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.preServiceQuestionPage.labels,
        'preServiceQuestionPage'
      );
    } else {
      this.SkipServicePageIfOneService();
    }
  }

  private SkipServicePageIfOneService() {
    if ((!this.WorkFlowData.setting.enablePreServiceQuestions) && this.IsServicePageSkipOrNot()) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.welcomePage.labels,
        'welcomePage'
      );
    } else {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.servicePage.labels,
        'servicePage'
      );
    }
  }

  private IsNoAppointmentAcceptInService() {
    let IsNoAppointmentAcceptInService = true;
   this.kioskLayoutData.servicePage.services?.forEach((item)=>{
     if(this.WorkFlowData.services?.find((service)=>service.id === item.questionId)?.acceptAppointments){
       IsNoAppointmentAcceptInService = false;
     }
   });
   return IsNoAppointmentAcceptInService;
 }
  private IsServicePageSkipOrNot() {
    let IsSkip = false;
    const selectedServices = this.kioskLayoutData.servicePage.services.filter((x) => x.isVisible)
    if(selectedServices.length != 1){
      return IsSkip
    }
      if(!this.IsNoAppointmentAcceptInService()){
        if(this.WorkFlowData.setting.enablePreServiceQuestions && this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before'){
          IsSkip = true;
        }
        else {
          IsSkip = false;
        }
      }
      else{
        IsSkip = true;
      }
    return IsSkip;
  }

  private RedirectFromServiceQuestionPageOnWorkflowSettings() {
    const previouslyAskedQuestionSets: string[] =
      this.GetPreviouslyAskedQuestionSetIds();
    const documents: Array<RulesDocument | RulesDocumentReference> = [];
    const workflow = this.GetWorkflowBaseDetails();
    if (workflow) {
      documents.push(workflow);
    }
    const customerRequest: RulesDocument = this.GetRequestDetails();
    if (customerRequest) {
      documents.push(customerRequest);
    }

    const request = {
      previouslyAskedQuestionSets,
      documents,
    };

    this.dynamicRuleProcessorAPIService
      .EvaluateConditionalRoute(request)
      .subscribe((responses) => {
        if (!responses || responses.length == 0) {
          this.CalculateDefaultRoute();
          return;
        }

        if (responses.length > 1) {
          this.CalculateDefaultRoute();
          return;
        }

        const response = responses[0];
        if (response.responseType == ConditionalRoutingResponseTypes.Queue) {
          this.RedirectToServiceQuestionORQueuePage({
            group: RoutingType.Queue,
            id: response.queueId,
            type: RoutingType.Queue,
          });
          return;
        }

        if (
          response.responseType == ConditionalRoutingResponseTypes.QuestionSet
        ) {
          const questionSetId = response.questionSetId;
          this.RedirectToServiceQuestionORQueuePage({
            group: RoutingType.Questions,
            id: questionSetId,
            type: RoutingType.Questions,
          });
          return;
        }

        if (response.responseType == ConditionalRoutingResponseTypes.NoQueue){
          this.GetDynamicVariablesReplacedFromLabel(
            this.kioskLayoutData?.noQueuePage?.labels,
            'noQueuePage'
          );
        }
      });
  }

  CalculateDefaultRoute() {
    const serviceQuestionSet = this.WorkFlowData.questionSets.find(
      (x) => x.id === (this.ServiceQuestionId || this.currentPageDetailId)
    );
    let counter = 0;
    serviceQuestionSet.conditionRoutings.forEach((element, index) => {
      if (element.condition === null && index === counter) {
        this.PerformActionMentionInTheServiceQuestionSet(element);
        return;
      } else if (this.CheckIsConditionSatisfy(element) && index === counter) {
        this.PerformActionMentionInTheServiceQuestionSet(element);
        return;
      }
      counter++;
    });
    if (counter === serviceQuestionSet.conditionRoutings.length) {
      alert('Sorry not able to add you in queue.');
    }
  }

  GetRequestDetails(): RulesDocument {
    const serviceQuestions = this.GetServiceQuestionWithAnswers();
    return {
      documentType: 'customerRequest',
      document: {
        id: '',
        workflowId: this.WorkFlowData.workFlowId,
        serviceId: this.ServiceId,
        serviceQuestions,
        isWalking: true,
        isAppointment: false
      },
    };
  }

  GetServiceQuestionWithAnswers(): { id: string; answer: string }[] {
    if (
      !this.AllServiceQuestionPages ||
      this.AllServiceQuestionPages.length == 0
    ) {
      return [];
    }

    let AllAnsweredQuestions: IKioskPanelItemsData[] = [];
    for (const ServiceQuestionPage of this.AllServiceQuestionPages) {
      if(ServiceQuestionPage && ServiceQuestionPage.items){
        AllAnsweredQuestions = AllAnsweredQuestions.concat(
          ServiceQuestionPage.items
        );
      }

    }

    const mappedQuestions =
      AllAnsweredQuestions.map((x) => {
        return {
          id: x.itemId,
          answer: x.answer,
        };
      }) || [];

    return mappedQuestions;
  }

  GetWorkflowBaseDetails(): RulesDocumentReference {
    return {
      documentType: 'workflow',
      pk: this.WorkFlowData.companyId,
      id: this.WorkFlowData.workFlowId,
    };
  }

  GetPreviouslyAskedQuestionSetIds(): string[] {
    const questionSets = this.AllServiceQuestionPages.map((x) => x.id);
    return questionSets;
  }

  private CheckIsConditionSatisfy(
    element: IWorkFlowServiceQuestionConditionRoute
  ) {
    return element.condition === 'true';
  }

  RedirectFromServicePage() {
    if (this.currentPageDetailId === this.BackButtonName) {
      this.RedirectToWelcomeOrPreServiceQuestionPage();
    } else {
      this.RedirectFromServicePageOnWorkflowSettings();
    }
  }

  RedirectToWelcomeOrPreServiceQuestionPage() {
    if (
      this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before'
    ) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.preServiceQuestionPage.labels,
        'preServiceQuestionPage'
      );
    } else {
      this.RedirectToLanguageOrWelcomePage();
    }
  }

  private RedirectToLanguageOrWelcomePage() {
    if (this.HideWelcomePage()) {
      this.RedirectToLanguagePage();
    } else {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.welcomePage.labels,
        'welcomePage'
      );
    }
  }

  private SetServiceId() {
    this.ServiceId = this.kioskLayoutData.servicePage.services[0].questionId;
  }

  private RedirectFromServicePageOnWorkflowSettings() {
    if (
      this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after'
    ) {
      this.RedirectToPreServiceQuestionPageIfDisplayPreServiceQuestionIsTrue();
    } else {
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingCondition();
    }
  }

  ReDirectToThankYouPage(timeInSeconds?: number) {
    this.GetDynamicVariablesReplacedFromLabel(
      this.kioskLayoutData.thankYouPage.labels,
      'thankYouPage'
    );
    if (timeInSeconds) {
      setTimeout(() => {
        window.location.reload();
      }, timeInSeconds * 1000);
    }
  }

  GetThankYouPageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.thankYouPage = this.ThankYouPageData(Labels);
  }

  private ThankYouPageData(Labels: IKioskLabelControlData[]) {
    return {
      images: this.kioskLayoutData.thankYouPage.images,
      videos: this.kioskLayoutData.thankYouPage.videos,
      sliders: this.kioskLayoutData.thankYouPage.sliders,
      labels: Labels,
      buttons: this.kioskLayoutData.thankYouPage.buttons,
      thankYouControl: {
        items: this.kioskLayoutData.thankYouPage?.panel?.items,
        primaryColor: this.kioskLayoutData.thankYouPage?.panel?.primaryColor,
        secondaryColor: this.kioskLayoutData.thankYouPage?.panel?.secondaryColor,
        backgroundColor:
          this.kioskLayoutData.thankYouPage?.panel?.backgroundColor,
        horizontalPadding:
          this.kioskLayoutData.thankYouPage?.panel?.horizontalPadding,
        verticalPadding:
          this.kioskLayoutData.thankYouPage?.panel?.verticalPadding,
        messageDisplayTimeInSeconds:
          this.kioskLayoutData.thankYouPage?.panel?.messageDisplayTimeInSeconds,
        itemBackgroundColor:
          this.kioskLayoutData.thankYouPage?.panel?.itemBackgroundColor,
        fontSize: this.kioskLayoutData.thankYouPage?.panel?.fontSize,
        fontStyle: this.kioskLayoutData.thankYouPage?.panel?.fontStyle,
        height: this.kioskLayoutData.thankYouPage?.panel?.height,
        font: this.kioskLayoutData.thankYouPage?.panel?.font,
        fontWeight: this.kioskLayoutData.thankYouPage?.panel?.fontWeight,
        left: this.kioskLayoutData.thankYouPage?.panel?.left,
        width: this.kioskLayoutData.thankYouPage?.panel?.width,
        top: this.kioskLayoutData.thankYouPage?.panel?.top,
      },
    };
  }
  RedirectFromPreServiceQuestionPage() {
    if (this.currentPageDetailId === this.BackButtonName) {
      this.RedirectToServiceOrServiceQuestionPage();
    } else {
      this.RedirectFromPreServiceQuestionPageOnWorkflowSetting();
    }
  }

  private RedirectToServiceOrServiceQuestionPage() {
    if (this.HideWelcomePage() && (!this.IsOnlyOneLanguage())){
      this.RedirectToLanguagePage();
    }else if (
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before' || (this.DisplayPreServiceQuestionsAfter() && this.IsServicePageSkipOrNot())
    ) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.welcomePage.labels,
        'welcomePage'
      );
    } else {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.servicePage.labels,
        'servicePage'
      );
    }
  }

  private DisplayPreServiceQuestionsAfter() {
    return this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'after';
  }

  private RedirectFromPreServiceQuestionPageOnWorkflowSetting() {
    if (
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before'  && (!this.IsServicePageSkipOrNot())
    ) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.servicePage.labels,
        'servicePage'
      );
    } else {
      this.SetServiceIdIfOnlyOneService();
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingCondition();
    }
  }

  private SetServiceIdIfOnlyOneService() {
    if (this.IsServicePageSkipOrNot()) {
      this.SetServiceId();
    }
  }

  private GetServicePageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.servicePage = this.ServicePageData(Labels);
  }

  private ServicePageData(Labels: IKioskLabelControlData[]) {
    this.kioskLayoutData.servicePage.buttons =
    HideAppBtnIfAppNotExist(this.kioskLayoutData.servicePage.buttons, this.WorkFlowData.appointmentTemplates);
    if ((this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
        this.kioskLayoutData.servicePage.buttons =
        this.kioskLayoutData.servicePage.buttons.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
      }
    return {
      id: null,
      images: this.kioskLayoutData.servicePage.images,
      labels: Labels,
      videos: this.kioskLayoutData.servicePage.videos,
      sliders: this.kioskLayoutData.servicePage.sliders,
      panel: this.kioskLayoutData.servicePage.panel,
      buttons: this.ServicePageButtons(),
      items: this.GetServicesItems(
        this.GetBranchSelectedServices()
      ),
    };
  }

  private ServicePageButtons() {
    if (this.HideWelcomePage && this.IsOnlyOneLanguage()
    && this.DisplayPreServiceQuestionsAfter() && this.GetFirstPageName(this.PageNames.service)){
      this.kioskLayoutData.servicePage.buttons =
      this.kioskLayoutData.servicePage.buttons.filter(x => x.name !== DefaultButtonsNames.BackButtonName);
    }
    return this.kioskLayoutData.servicePage.buttons;
  }

  private GetBranchSelectedServices() {
    const BranchDetail = this.SubjectBranch.value;

    const isAllWorkflowServicesSelected = BranchDetail?.workFlowUsedInBranchList?.find(
      workFlowUsedInBranch => workFlowUsedInBranch.workFlowId == this.WorkFlowData.workFlowId)?.isAllServices;

    if (isAllWorkflowServicesSelected) {
      return this.WorkFlowData.services;
    }

    const WorkFlowUsedInBranchServiceIds = BranchDetail.workFlowUsedInBranchList
    .find((x) => x.workFlowId === this.WorkFlowData.workFlowId).serviceIds
    const WorkflowUsedInBranchServices: IWorkFlowServiceData[] = [];
    WorkFlowUsedInBranchServiceIds.forEach((m) => {
      this.WorkFlowData.services.find((n) => {
        if (n.id === m) {
          WorkflowUsedInBranchServices.push(n);
        }
      });
    });
    return WorkflowUsedInBranchServices;
  }

  RedirectToServiceQuestionPageORQueuesAfterCheckingCondition() {
    const serviceRouting = this.SetServiceRouting();
    this.SelectedService = this.ServiceId || this.currentPageDetailId;
    this.RedirectToServiceQuestionORQueuePage(serviceRouting);
  }

  private SetServiceRouting(){
    return this.WorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.currentPageDetailId)
    ).routing;
  }

  ValidateService(serviceId: string): IValidation {
    if (this.branchServices.find((x) => x === serviceId)) {
        return this.SuccessfulValidation();
    } else {
      return this.UnSuccessfulValidation(
        'This service is not available in this branch.'
      );
    }
  }

  SuccessfulValidation(): IValidation {
    return {
      result: true,
      message: '',
    };
  }
  UnSuccessfulValidation(msg: string): IValidation {
    return {
      result: false,
      message: msg,
    };
  }

  GetServiceQuestionData(
    serviceRouting: IWorkFlowServiceRoute,
    Labels: IKioskLabelControlData[]
  ) {
    return {
      id: serviceRouting.id,
      images: this.kioskLayoutData.serviceQuestion.images,
      videos: this.kioskLayoutData.serviceQuestion.videos,
      sliders: this.kioskLayoutData.serviceQuestion.sliders,
      labels: Labels,
      panel: this.kioskLayoutData.serviceQuestion.panel,
      buttons: this.kioskLayoutData.serviceQuestion.buttons,
      items: this.GetServiceQuestionItems(
        this.kioskLayoutData.serviceQuestion,
        this.WorkFlowData.questionSets.find((x) => x.id === serviceRouting.id)
          ?.questions
      ),
    };
  }

  GetServiceQuestionItems(
    ServiceQuestion: IKioskServiceQuestionPageData,
    workFlowQuestions: IWorkFlowQuestionData[]
  ): IKioskPanelItemsData[] {
    const items: IKioskPanelItemsData[] = [];
    const serviceQuestionItem = ServiceQuestion.questionSet[0].questions[0];
    workFlowQuestions.forEach((x) => {
      if (!x.isDeleted){
          const type = x.type;
          const itemTypeSettings = [];
          if (
            this.QuestionTypes.some((questionType) => questionType === type)
          ) {
            workFlowQuestions
              .find((m) => m.id === x.id)
              .typeSetting.forEach((element) => {
                itemTypeSettings.push(
                  this.GetElementWithSpecificSelectedOrDefaultLanguage(element)
                    ?.option
                );
              });
          }
          items.push({
            required: x.isRequired,
            answer: this.GetAnswerOfServiceQuestionIfPresent(x.id),
            backgroundColor: serviceQuestionItem.backgroundColor,
            color: serviceQuestionItem.color,
            font: serviceQuestionItem.font,
            fontSize: serviceQuestionItem.fontSize,
            fontStyle: serviceQuestionItem.fontStyle,
            fontWeight: serviceQuestionItem.fontWeight,
            itemId: x.id,
            selected: x.isVisible,
            itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
              x.question
            )?.question,
            itemType: type,
            itemTypeSetting: this.QuestionTypes.some(
              (questionType) => questionType === type
            )
              ? itemTypeSettings
              : x.typeSetting,
          });
        }
      });
    if (
      items.length !== 0 &&
      ServiceQuestion.panel.questionDisplayMode === Mode.Single
    ) {
      items.map((x) => (x.selected = false));
      items[0].selected = true;
    }
    return items;
  }

  private GetElementWithSpecificSelectedOrDefaultLanguage(element: any) {
    let current_element = element.find(
      (lang) => lang.languageId === this.CurrentLanguageId
    );
    if (!current_element) {
      current_element = element.find(
        (lang) => lang.languageId === this.DefaultLanguageId
      );
    }
    return current_element ? current_element : [];
  }
  RedirectToServiceQuestionPage(serviceRouting: IWorkFlowServiceRoute) {
    const languageId = this.CurrentLanguageId || this.DefaultLanguageId;
    const Labels = this.KioskDataCopy.serviceQuestion.labels;
    if (
      Labels.length > 0 &&
      Labels.some((x) => x.text[languageId]?.includes('%'))
    ) {
      const LabelTexts = [];
      Labels.forEach((label) => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId],
        });
      });
      const kioskRequest = this.GetKioskRequest();
      this.dynamicVariablesService
        .GetDynamicVariablesReplacedStrings(
          LabelTexts,
          this.WorkFlowData,
          kioskRequest
        )
        .subscribe((s: any) => {
          this.kioskLayoutData.serviceQuestion.labels.forEach((x) => {
            x.text[languageId] = s.find(
              (f) => f.id === x.name
            ).replacementString;
          });
          this.ServiceQuestionPage(
            serviceRouting,
            this.kioskLayoutData.serviceQuestion.labels
          );
        });
    } else {
      this.ServiceQuestionPage(
        serviceRouting,
        this.kioskLayoutData.serviceQuestion.labels
      );
    }
  }
  private ServiceQuestionPage(
    serviceRouting: IWorkFlowServiceRoute,
    Labels: IKioskLabelControlData[]
  ) {
    this.SetPageVisibilityByPageName(KioskPageName.ServiceQuestionPage);
    this.kioskData.serviceQuestion = this.GetServiceQuestionData(
      serviceRouting,
      Labels
    );
    this.AllServiceQuestionPages = this.AllServiceQuestionPages.filter(
      (x) => !(x.id == this.kioskData.serviceQuestion.id)
    ).concat(this.kioskData.serviceQuestion);
    this.QuestionSetStack.push(serviceRouting);

    this.Iterate(this.kioskData.serviceQuestion);
  }

  private RedirectToServiceQuestionORQueuePage(
    serviceRouting: IWorkFlowServiceRoute
  ) {
    if (serviceRouting.group === RoutingType.Queue) {
      // Need to do an api call for ticket
      const kioskData = this.kioskData;
      const queueId = serviceRouting.id;
      const kioskRequest: any = {
        kioskData,
        queueId,
        id: this.uuid,
        ticketNumber: '',
        workflow: this.WorkFlowData,
        branchId: this.BranchId,
        serviceId: this.SelectedService,
        selectedLanguageId: this.CurrentLanguageId,
        requestSourceType: 'KIOSK',
        requestSourceId: this.DeviceId,
        companyId: this.CompanyId,
        mobileInterfaceId: this.MobileInterfaceId,
      };
      kioskRequest.workflow.advanceRules=null;
      kioskRequest.workflow.services=null;
      kioskRequest.workflow.setting=null;
      kioskRequest.workflow.preServiceQuestions=null;
      kioskRequest.workflow.services=null;
      kioskRequest.workflow.questionSets=null;
      kioskRequest.workflow.groups=null;
      kioskRequest.workflow.appointmentTemplates=null;
      this.kioskAPIService
        .GenerateTicketExternal<IKioskRequest, KioskResponse>(kioskRequest)
        .subscribe((x) => {
          if (x) {
            // assing ticket number to thank you page
            x.estimatedWaitTime = GetEstimateWait(x);

            this.estimatedServingTimeUTCString = x?.estimatedServingTimeUTCString;
            this.estimatedWaitRangesSettings = x?.estimatedWaitRangesSettings;

            this.kioskLayoutData.thankYouPage.panel.items.find(
              (item) => item.type === TicketItem.TicketNumber
            ).value = x.ticketNumber;
            this.kioskLayoutData.thankYouPage.panel.items.find(
              (item) => item.type === TicketItem.PlaceInLine
            ).value = (x.sortPosition || '-').toString();
            this.kioskLayoutData.thankYouPage.panel.items.find(
              (item) => item.type === TicketItem.EstimatedWait
            ).value = GetFormattedTime(x.estimatedWaitTime);
            const redirectionTimeInSeconds =
              this.kioskLayoutData.thankYouPage.panel
                .messageDisplayTimeInSeconds;
            this.ReDirectToThankYouPage(redirectionTimeInSeconds);
          } else {
            // some error message
            this.RedirectFromWelcomePage();
          }
        });
    } else if (serviceRouting.group === RoutingType.Questions) {
      this.RedirectToServiceQuestionPage(serviceRouting);
    }
  }

  RedirectFromWelcomePage() {
    if (this.currentPageDetailId === this.BackButtonName) {
      this.RedirectToLanguagePage();
    } else {
      this.RedirectFromWelcomePageOnWorkflowSettings();
    }
  }

  RedirectToLanguagePage() {
    this.SetPageVisibilityByPageName(KioskPageName.LanguagePage);
    this.kioskLayoutData.languagePage = this.LanguagePageData();
  }



  private RedirectFromWelcomePageOnWorkflowSettings() {
    if (
      this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before'
    ) {
      this.RedirectToPreServiceQuestionPageIfDisplayPreServiceQuestionIsTrue();
    } else {
      this.SkipServicePageIfOnlyOneService();
    }
  }

  private SkipServicePageIfOnlyOneService() {
    if ((!this.IsServicePageSkipOrNot())) {
      this.RedirectToServicePageIfDisplayPreserviceQuestionIsFalse();
    } else {
      this.SetServiceId();
      this.RedirectFromServicePageOnWorkflowSettings();
    }
  }

  RedirectToServicePageIfDisplayPreserviceQuestionIsFalse() {
    this.GetDynamicVariablesReplacedFromLabel(
      this.kioskLayoutData.servicePage.labels,
      'servicePage'
    );
  }

  GetServicesItems(
    workFlowServices: IWorkFlowServiceData[]
  ): IKioskPanelItemsData[] {
    const serviceItem = this.kioskLayoutData.servicePage.services[0];
    const itemsM: IKioskPanelItemsData[] = [];
    workFlowServices.forEach((x) => {
      if (!x.isDeleted){
        itemsM.push({
          required: false,
          answer: '',
          backgroundColor: serviceItem.backgroundColor,
          color: serviceItem.color,
          font: serviceItem.font,
          fontSize: serviceItem.fontSize,
          fontStyle: serviceItem.fontStyle,
          fontWeight: serviceItem.fontWeight,
          itemId: x.id,
          selected: x.acceptWalkins,
          isVisible: this.GetIsVisible(x),
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
            x.serviceNames
          )?.serviceName,
          itemType: null,
          itemTypeSetting: null,
          itemIcon: this.GetElementWithSpecificSelectedOrDefaultLanguage(
            x?.serviceIconUrls
          ).url,
          isActive: this.IsServiceAvailable(x.id)
        });
      }
    });

    return itemsM;
  }

  private GetIsVisible(x: IWorkFlowServiceData): boolean {
    const isVisible = this.kioskLayoutData.servicePage.services.find(s => s.questionId === x.id)?.isVisible;
    return isVisible == undefined ? true : isVisible;
  }

  RedirectToPreServiceQuestionPageIfDisplayPreServiceQuestionIsTrue() {
    this.GetDynamicVariablesReplacedFromLabel(
      this.kioskLayoutData.preServiceQuestionPage.labels,
      'preServiceQuestionPage'
    );
  }

  RedirectToOffLine() {
    this.SetOfflinePage();
    this.GetDynamicVariablesReplacedFromLabel(
      this.kioskLayoutData.offLinePage.labels,
      'offLinePage'
    );
  }

  private GetPreServicePageData(Labels: IKioskLabelControlData[]) {
    this.kioskData.preServiceQuestionPage = this.PreServicePageData(Labels);
  }

  private PreServicePageData(Labels: IKioskLabelControlData[]){
    this.kioskLayoutData.preServiceQuestionPage.buttons =
    HideAppBtnIfAppNotExist(this.kioskLayoutData.preServiceQuestionPage.buttons, this.WorkFlowData.appointmentTemplates);
    if (!(this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
        this.kioskLayoutData.preServiceQuestionPage.buttons =
        this.kioskLayoutData.preServiceQuestionPage.buttons.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
      }
    return {
          id: null,
          images: this.kioskLayoutData.preServiceQuestionPage.images,
          labels: Labels,
          videos: this.kioskLayoutData.preServiceQuestionPage.videos,
          sliders: this.kioskLayoutData.preServiceQuestionPage.sliders,
          panel: this.kioskLayoutData.preServiceQuestionPage.panel,
          buttons: this.GetPreServiceButtons(),
          items: this.GetPreServiceQuestionItems(
            this.kioskLayoutData.preServiceQuestionPage,
            this.WorkFlowData.preServiceQuestions
          ),
        };
  }

  private GetPreServiceButtons() {
    if (this.IsOnlyOneLanguage() && this.HideWelcomePage() && this.GetFirstPageName(this.PageNames.preService)){
      this.kioskLayoutData.preServiceQuestionPage.buttons =
      this.kioskLayoutData.preServiceQuestionPage.buttons.filter(x => x.name !== DefaultButtonsNames.BackButtonName);
    }
    return this.kioskLayoutData.preServiceQuestionPage.buttons;
  }

  private GetFirstPageName(pageName: string) {
    return this.FirstPageName === pageName;
  }

  GetPreServiceQuestionItems(
    PreServiceQuestionPage: IKioskPreServiceQuestionPageData,
    workFlowQuestions: IWorkFlowQuestionData[]
  ): IKioskPanelItemsData[] {
    const items: IKioskPanelItemsData[] = [];
    const preServiceItem = PreServiceQuestionPage.questions[0];
    workFlowQuestions.forEach((x) => {
      if (!x.isDeleted){
      const type = x.type;

      const itemTypeSettings = [];
      if (this.QuestionTypes.some((questionType) => questionType === type)) {
            // PreServiceQuestionPage.questions
            //   .find((m) => { if (m.questionId === x.id){

            // }
            x.typeSetting.forEach((element) => {
              itemTypeSettings.push(
                this.GetElementWithSpecificSelectedOrDefaultLanguage(element)
                  ?.option
              );
            });
          // });
        }

      items.push({
                  required: x.isRequired,
                  answer: this.GetAnswerOfPreServiceQuestionIfPresent(x.id),
                  backgroundColor: preServiceItem.backgroundColor,
                  color: preServiceItem.color,
                  font: preServiceItem.font,
                  fontSize: preServiceItem.fontSize,
                  fontStyle: preServiceItem.fontStyle,
                  fontWeight: preServiceItem.fontWeight,
                  itemId: x.id,
                  selected: x.isVisible,
                  itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
                    x.question
                  )?.question,
                  itemType: x.type,
                  itemTypeSetting: this.QuestionTypes.some(
                    (questionType) => questionType === type
                  )
                    ? itemTypeSettings
                    : x.typeSetting,
                });
      }
    }
    );


    if (
      items.length !== 0 &&
      PreServiceQuestionPage.panel.questionDisplayMode === Mode.Single
    ) {
      items.map((x) => (x.selected = false));
      items[0].selected = true;
    }
    return items;
  }

  private SetAndPassKioskLayoutData(data: IKioskLayoutData) {
    this.ContainerHeight = data.designerScreen.height;
    this.ContainerWidth = data.designerScreen.width;
    this.kioskData = this.GetInitialKioskPreviewData();
    this.RefKioskLayoutData = cloneObject(data);
    this.Iterate(this.kioskData);
    this.KioskLayoutDataSubject.next(this.kioskData);
  }

  GetInitialKioskPreviewData() {
    return {
      designer: {
        backGroundImage: this.kioskLayoutData.designerScreen.backGroundImage,
        fontStyle: this.kioskLayoutData.designerScreen.fontStyle,
        fontSize: this.kioskLayoutData.designerScreen.fontSize,
        font: this.kioskLayoutData.designerScreen.font,
        fontWeight: this.kioskLayoutData.designerScreen.fontWeight,
        color: this.kioskLayoutData.designerScreen.color,
        backgroundColor: this.kioskLayoutData.designerScreen.backgroundColor,
        height: this.kioskLayoutData.designerScreen.height,
        width: this.kioskLayoutData.designerScreen.width,
        WorkFlowId: this.kioskLayoutData.designerScreen.WorkFlowId,
        waitingTime: this.kioskLayoutData.designerScreen.waitingTime,
        enableVirtualKeyboard: this.kioskLayoutData.designerScreen.enableVirtualKeyboard,
      },
      preServiceQuestionPage: this.GetPageDataOnPageName(),
      servicePage: this.GetPageDataOnPageName(),
      serviceQuestion: this.GetPageDataOnPageName(),
      thankYouPage: this.GetPageDataOnPageName(),
      languagePage: this.LanguagePageData(),
      welcomePage: this.GetWelcomePageDataIfOneLanguage(),
      offLinePage: this.GetPageDataOnPageName(),
    };
  }

  private GetPageDataOnPageName(){
    if (this.FirstPageName === this.PageNames.preService){
      return this.PreServicePageData(this.kioskLayoutData.preServiceQuestionPage.labels);
    }else if (this.FirstPageName === this.PageNames.service){
      return this.ServicePageData(this.kioskLayoutData.servicePage.labels);
    }else if (this.FirstPageName === this.PageNames.serviceQuestion){
      const serviceRouting = this.SetServiceRouting();
      return this.GetServiceQuestionData(serviceRouting, this.kioskLayoutData.serviceQuestion.labels);
    }else if (this.FirstPageName === this.PageNames.thankYou){
      return this.ThankYouPageData(this.kioskLayoutData.thankYouPage.labels);
    }else if (this.FirstPageName === this.PageNames.OffLinePage){
      return this.OffLinePageData(this.kioskLayoutData.offLinePage.labels);
    }
    return null;
  }

  private LanguagePageData() {
    if (!this.IsOnlyOneLanguage()) {
    return {
      buttons: [],
      images: [].concat(this.kioskLayoutData.languagePage.images),
      labels: this.kioskLayoutData.languagePage.labels,
      sliders: this.kioskLayoutData.languagePage.sliders,
      videos: this.kioskLayoutData.languagePage.videos,
      panel: this.kioskLayoutData.languagePage.panel,
      controlsCount: this.kioskLayoutData.languagePage.controlsCount,
    };
    }else{
      return null;
    }
  }


  private  GetWelcomePageDataIfOneLanguage(){
    if (this.IsOnlyOneLanguage()) {
      return this.WelcomePageData(this.kioskLayoutData.welcomePage.labels);
    }else{
      return null;
    }

  }

  GetDynamicVariablesReplacedFromLabel(
    Labels: IKioskLabelControlData[],
    pageName: string
  ) {
    const languageId = this.CurrentLanguageId || this.DefaultLanguageId;
    const ReplaceDynamicFieldLabels = this.KioskDataCopy[pageName].labels;
    if (
      ReplaceDynamicFieldLabels.length > 0 &&
      ReplaceDynamicFieldLabels.some((x) => x.text[languageId]?.includes('%'))
    ) {
      const LabelTexts = [];
      ReplaceDynamicFieldLabels.forEach((label) => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId],
        });
      });
      const kioskRequest = this.GetKioskRequest();
      this.dynamicVariablesService
        .GetDynamicVariablesReplacedStrings(
          LabelTexts,
          this.WorkFlowData,
          kioskRequest
        )
        .subscribe((s: any) => {
          Labels.forEach((x) => {
            x.text[languageId] = s.find(
              (f) => f.id === x.name
            ).replacementString;
          });
          this.GetDataAsPerPage(pageName, Labels);
        });
    } else {
      this.GetDataAsPerPage(pageName, Labels);
    }
  }

  private GetKioskRequest() {
    return {
      workflowId: this.WorkFlowData.workFlowId,
      branchId: this.BranchId,
      serviceId: this.SelectedService,
      selectedLanguageId: this.CurrentLanguageId,
      requestSourceType: 'KIOSK',
      requestSourceId: this.DeviceId,
      companyId: this.CompanyId,
      mobileInterfaceId: this.MobileInterfaceId,
      estimatedServingTimeUTCString: this.estimatedServingTimeUTCString,
      estimatedWaitRangesSettings: this.estimatedWaitRangesSettings,
      preServiceQuestions: this.kioskData?.preServiceQuestionPage?.items?.map(
        (x) => {
          return {
            questionId: x.itemId,
            questionText: x.itemText,
            answer: x.answer,
            questionType: x.itemType,
          };
        }
      ),
      serviceQuestions: this.kioskData?.serviceQuestion?.items.map((y) => {
        return {
          questionId: y.itemId,
          answer: y.answer,
          questionType: y.itemType,
        };
      }),
    };
  }

  GetDataAsPerPage(pageName: string, Labels: IKioskLabelControlData[]) {
    if (pageName === 'preServiceQuestionPage') {
      this.SetPageVisibilityByPageName(KioskPageName.PreServiceQuestionPage);
      this.GetPreServicePageData(Labels);
      this.Iterate(this.kioskData.preServiceQuestionPage);
    } else if (pageName === 'servicePage') {
      this.SetPageVisibilityByPageName(KioskPageName.ServicePage);
      this.GetServicePageData(Labels);
      this.Iterate(this.kioskData.servicePage);
    } else if (pageName === 'thankYouPage') {
      this.SetPageVisibilityByPageName(KioskPageName.ThankYouPage);
      this.GetThankYouPageData(Labels);
      this.Iterate(this.kioskData.thankYouPage);
    } else if (pageName === 'welcomePage') {
      this.SetPageVisibilityByPageName(KioskPageName.WelcomePage);
      this.GetWelcomePageData(Labels);
      this.Iterate(this.kioskData.welcomePage);
    } else if (pageName === 'noQueuePage') {
      this.SetPageVisibilityByPageName(KioskPageName.NoQueuePage);
      this.GetNoQueuePageData(Labels);
      this.Iterate(this.kioskData.noQueuePage);
    } else if (pageName === 'offLinePage') {
      this.SetPageVisibilityByPageName(KioskPageName.OffLinePage);
      this.GetOffLinePageData(Labels);
      this.Iterate(this.kioskData.offLinePage);
    }
  }

  private InitializeSubjects() {
    this.KioskLayoutDataSubject = new BehaviorSubject<IKioskPreviewData>(null);
    this.KioskLayoutData$ = this.KioskLayoutDataSubject.asObservable();

    this.SubjectHoursOfOperationList = new BehaviorSubject<any[]>([]);
    this.HoursOfOperationList$ = this.SubjectHoursOfOperationList.asObservable();

    this.IsModelOpenSubject = new BehaviorSubject<boolean>(true);
    this.IsOpened$ = this.IsModelOpenSubject.asObservable();

    this.LanguageListSubject = new BehaviorSubject<ILanguageDropdownList[]>([]);
    this.LanguageList$ = this.LanguageListSubject.asObservable();

    this.PageSubject = new BehaviorSubject<IPage>(null);
    this.Page$ = this.PageSubject.asObservable();

    this.SubjectBranch = new BehaviorSubject<IBranchDetails>(null);
    this.Branch$ = this.SubjectBranch.asObservable();
    this.SubjectHoursOfOperation = new BehaviorSubject<IHoursOfOperation>(null);
    this.HoursOfOperation$ = this.SubjectHoursOfOperation.asObservable();

    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();

    this.IsKioskDeviceStandByModeSubject = new BehaviorSubject<boolean>(
      this.IsKioskDeviceStandByMode()
    );
    this.IsKioskDeviceStandByMode$ =
      this.IsKioskDeviceStandByModeSubject.asObservable();

    this.showBackButtonSubject = new BehaviorSubject<boolean>(true);
    this.showBackButton$ = this.showBackButtonSubject.asObservable();

    this.subs.sink = this.HoursOfOperation$.subscribe(
      (hoo) => (this.HoursOfOperation = hoo)
    );

    this.ExecutionWaitingTime$ = this.KioskLayoutData$.pipe(
      map((data) => {
        return data?.designer?.waitingTime ?? KioskExecution.WaitingTime;
      })
    );

    this.IsKeyBoardAllowed$ = this.KioskLayoutData$.pipe(

      map((data) => {
        return data?.designer?.enableVirtualKeyboard ?? false;
      })
    );

  }

  public SetWorkFlowList() {
    this.subs.sink = this.workflowAPIService
      .GetExternalDraftDropdownList(this.CompanyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
        this.UpdateBranchServices();
      });
  }

  UpdateBranchServices() {
    const AllWorkflows = this.SubjectWorkflows.getValue();
    const branch = this.SubjectBranch.getValue();
    let branchServices = [];
    branch.workFlowUsedInBranchList?.forEach((workflow) => {
      let Services: string[] = [];
      if (workflow.isAllServices) {
        Services = AllWorkflows.find(
          (current) => current.workFlowId === workflow.workFlowId
        )?.services?.map((x) => x.id);
      } else {
        Services = workflow.serviceIds;
      }
      branchServices = branchServices.concat(Services);
    });
    this.branchServices = branchServices;
  }

  SetPageVisibilityByPageName(pageIndex) {
    this.CurrentPageIndex = pageIndex;
    this.Page = {
      IsLanguagePage: pageIndex === KioskPageName.LanguagePage,
      IsServicePage: pageIndex === KioskPageName.ServicePage,
      IsWelcomePage: pageIndex === KioskPageName.WelcomePage,
      IsServiceQuestionPage: pageIndex === KioskPageName.ServiceQuestionPage,
      IsPreServiceQuestionPage:
        pageIndex === KioskPageName.PreServiceQuestionPage,
      IsThankYouPage: pageIndex === KioskPageName.ThankYouPage,
      IsNoQueuePage: pageIndex === KioskPageName.NoQueuePage,
      IsOffLinePage: pageIndex === KioskPageName.OffLinePage
    };
    this.PageSubject.next(this.Page);
  }

  Iterate = (obj) => {
    const Present = this.AlreadyCalculated.find((x) => x == obj);

    if (Present) {
      return Present;
    }

    Object.keys(obj).forEach((key) => {
      if (key === 'width' || key === 'fontSize' || key === 'left') {
        obj[key] = this.ResizeElementWidth(Number(obj[key]));
      } else if (key === 'height' || key === 'top') {
        obj[key] = this.ResizeElementHeight(Number(obj[key]));
      }
      if (typeof obj[key] === 'object' && obj[key]) {
        this.Iterate(obj[key]);
      }
    });

    this.AlreadyCalculated.push(obj);
  }

  ResizeElementWidth(element) {
    const percentage =
      (window.innerWidth * 100) / this.RefKioskLayoutData.designerScreen.width -
      100;
    return (element * percentage) / 100 + element;
  }

  ResizeElementHeight(element) {
    const percentage =
      (window.innerHeight * 100) /
        this.RefKioskLayoutData.designerScreen.height -
      100;
    return (element * percentage) / 100 + element;
  }

  InitAzureSignalRService() {
    this.azureSignalRService.init(this.GetBrowserId());
  }

  GetBrowserId() {
    const tokenPayload = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId
    return !tokenPayload ? this.uuid : tokenPayload;
  }

  private IsKioskDeviceStandByMode() {
    const shutdownDetails = this.browserStorageService.KioskShutDownDetails;
    if (!shutdownDetails) {
      return false;
    }
    const currentDateTime = new Date();
    const shutDownUpToDateTime = new Date(shutdownDetails.shutDownUpto);
    return shutDownUpToDateTime.getTime() >= currentDateTime.getTime();
  }

  SetTimerToNavigateBackAfterShutDownHour() {
    const shutDownDetails = this.browserStorageService.KioskShutDownDetails;
    const currentDateTime = new Date();
    const shutDownUpToDateTime = new Date(shutDownDetails.shutDownUpto);
    const isShutDown =
      shutDownUpToDateTime.getTime() >= currentDateTime.getTime();
    const timeout = shutDownUpToDateTime.getTime() - currentDateTime.getTime();
    if (isShutDown) {
      setTimeout(() => {
        this.CheckIsKioskInStandBy();
      }, timeout);
    }
  }

  // service avia


  IsServiceAvailable(serviceId: string): boolean {
    const BranchTime = this.GetCurrentBranchTime();
    const service = this.WorkFlowData.services.find((s) => s.id === serviceId);
    const workingDay = cloneObject(this.GetHOODayById(BranchTime.getDay()));
    if (!BranchTime) {
      return false;
    }
    if(service.serviceOccur?.value){
    if(service.hoursOfOperationId && service.serviceOccur.value === OperationalOccurs.Default ){
      return ServiceAvailableOrNotDefault(this.GetDefaultWorkingDaysData(service.hoursOfOperationId),BranchTime)
    }
    return CheckServiceAvailability(service,BranchTime)
    }
    if (!this.IsOpenForDayOfTheWeek(BranchTime.getDay())) {
      return false;
    }
    const isHolidayToday = this.IsHolidayToday(BranchTime);
    if (isHolidayToday) {
      return false;
    }
    return ServiceAvailableOrNotDefault(this.HoursOfOperation.workingHours,BranchTime)
  }

  GetDefaultWorkingDaysData(hooId):IWorkingHours{
    let HoursOfOperationData : IWorkingHours = null
     this.SubjectHoursOfOperationList.value.find((x) =>{
       if(x.id === hooId){
        HoursOfOperationData = x.workingHours;
       }
      });
      return HoursOfOperationData
  }

  private IsOpenForDayOfTheWeek(DayId: number): boolean {
    const day = this.GetHOODayById(DayId);
    return day?.isOpen;
  }

  ConvertMinutesToTimeFrame(TotalTimeFrameMinutes: number): ITime {
    return {
      hours: parseInt((TotalTimeFrameMinutes / 60).toString()),
      minutes: parseInt((TotalTimeFrameMinutes % 60).toString()),
    };
  }

  IsTimeLiesInFrame(
    timeFrame: ITimeFrame,
    TotalMinuteOfTheDay: number
  ): unknown {
    const fromTimeHours = timeFrame.fromTime.hours;
    const fromTimeMinutes = timeFrame.fromTime.minutes;
    const TotalFromTimeMinuteOfTheDay =
      fromTimeHours * 60 + Number(fromTimeMinutes);

    const toTimeHours = timeFrame.toTime.hours;
    const toTimeMinutes = timeFrame.toTime.minutes;
    const TotalToTimeMinuteOfTheDay = toTimeHours * 60 + Number(toTimeMinutes);

    return (
      TotalFromTimeMinuteOfTheDay <= TotalMinuteOfTheDay &&
      TotalToTimeMinuteOfTheDay >= TotalMinuteOfTheDay
    );
  }


  private IsHolidayToday(BranchTime: Date): boolean {
    if (this.HoursOfOperation?.nonWorkingDaysList) {
      const Holidays = this.HoursOfOperation.nonWorkingDaysList.some(
        (holiday) =>
          isDateLiesBetweenTwoDates(
            holiday.fromDate,
            holiday.toDate,
            BranchTime
          )
      );
      return Holidays;
    } else {
      return false;
    }
  }

  private GetHOODayById(DayId: number): IWorkingDay {
    // tslint:disable-next-line: forin
    for (const dayProp in this.HoursOfOperation?.workingHours) {
      const Day = this.HoursOfOperation.workingHours[dayProp];
      if (DayId === Day.dayId) {
        return Day;
      }
    }
    return null;
  }


  GetCurrentBranchTime(): Date {
    const Branch = this.SubjectBranch.getValue();
    const DateConvertedToTimeZone = this.KendoTimeZoneData.fromLocalDate(
      new Date(),
      Branch.additionalSettings.timeZone.id
    );
    const currentBranchTime = new Date(
      DateConvertedToTimeZone.getFullYear(),
      DateConvertedToTimeZone.getMonth(),
      DateConvertedToTimeZone.getDate(),
      DateConvertedToTimeZone.getHours(),
      DateConvertedToTimeZone.getMinutes(),
      DateConvertedToTimeZone.getSeconds(),
      DateConvertedToTimeZone.getMilliseconds()
    );
    return currentBranchTime;
  }

  RedirectFromThankYouPage() {
    if (this.currentPageDetailId === this.BackButtonName) {
      this.RedirectToServiceOrServiceQuestionPAgeFromThankYouPage();
    } else {
      window.location.reload();
    }
  }

  private RedirectToServiceOrServiceQuestionPAgeFromThankYouPage() {
    const serviceRouting = this.WorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.currentPageDetailId)
    ).routing;
    if (serviceRouting.group === RoutingType.Queue) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.kioskLayoutData.servicePage.labels,
        'servicePage'
      );
    } else {
      this.SetPageVisibilityByPageName(this.CurrentPageIndex - 1);
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingCondition();
    }
  }

  GetAnswerOfPreServiceQuestionIfPresent(questionId: string): any {
    if (
      this.kioskData &&
      this.kioskData.preServiceQuestionPage &&
      this.kioskData.preServiceQuestionPage.items &&
      this.kioskData.preServiceQuestionPage.items.length > 0
    ) {
      const question = this.kioskData.preServiceQuestionPage?.items.find(
        (x) => x.itemId == questionId
      );
      return question?.answer;
    }
    return '';
  }

  GetAnswerOfServiceQuestionIfPresent(questionId: string): any {
    if (
      this.AllServiceQuestionPages &&
      this.AllServiceQuestionPages.length > 0
    ) {
      let AllAnsweredQuestions: IKioskPanelItemsData[] = [];
      for (const ServiceQuestionPage of this.AllServiceQuestionPages) {
        if(ServiceQuestionPage && ServiceQuestionPage.items){
          AllAnsweredQuestions = AllAnsweredQuestions.concat(
            ServiceQuestionPage.items
          );
        }
      }
      const question = AllAnsweredQuestions.find((x) => x.itemId == questionId);
      return question?.answer;
    }
    return '';
  }

  HaveAppointment(appointmentId: string): void {
    // TODO API call if fail goto welcome_page

    const SaveAppointmentModel: HaveAppointmentRequestModel = {
      appointmentId,
      branchId: this.BranchId,
      mobileInterfaceId: this.DeviceId
    };


    this.kioskAPIService
      .SaveCustomerRequestByAppointmentExternal<any, any>(
        this.BranchId,
        SaveAppointmentModel
      )
      .subscribe((response) => {
        if (response) {
          this.kioskLayoutData.thankYouPage.panel.items.find(
            (item) => item.type === TicketItem.TicketNumber
          ).value = response.ticketNumber;
          this.kioskLayoutData.thankYouPage.panel.items.find(
            (item) => item.type === TicketItem.PlaceInLine
          ).value = (response.sortPosition || '-').toString();
          this.kioskLayoutData.thankYouPage.panel.items.find(
            (item) => item.type === TicketItem.EstimatedWait
          ).value = '-';
          const redirectionTimeInSeconds =
            this.kioskLayoutData.thankYouPage.panel.messageDisplayTimeInSeconds;
          this.ReDirectToThankYouPage(redirectionTimeInSeconds);
        } else {
          this.RedirectFromWelcomePage();
        }
      });
  }

  OnExitButton(){
    window.location.reload();
  }
  OnClickBackButton(){
    this.GetDynamicVariablesReplacedFromLabel(
      this.kioskLayoutData.servicePage.labels,
      'servicePage'
    );
  }
}

export class HaveAppointmentRequestModel {
  appointmentId: string;
  branchId: string;
  mobileInterfaceId?: string;
}

const DefaultButtonsNames = {
  BackButtonName: 'Back Button',
  FinishButtonName: 'Finish Button',
  NextButtonName: 'Next Button',
  AppointmentButtonName: 'Appointment Button',
};
