import { Injectable } from '@angular/core';
import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/all';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CheckServiceAvailability, ServiceAvailableOrNotDefault } from 'src/app/core/utilities/workflow-service-available';
import { MobileExecution } from 'src/app/models/constants/mobile-constants';
import { MobilePageName } from 'src/app/models/enums/mobile-page-name.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import { OperationalOccurs } from 'src/app/models/enums/week-days.enum';
import { RulesDocument, RulesDocumentReference } from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { BranchAPIService } from 'src/app/shared/api-services/branch-api.service';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { KioskAPIService } from 'src/app/shared/api-services/kiosk-api.service';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { DynamicBoldTextPipe } from 'src/app/shared/pipes/dynamic-bold-text/dynamic-bold-text.pipe';
import { isDateLiesBetweenTwoDates } from 'src/app/shared/utility-functions/utility-functions.module';
import { DynamicVariableService } from '../../../../core/services/dynamic-variables.service';
import { cloneObject } from '../../../../core/utilities/core-utilities';
import { MobileAPIService } from '../../../../shared/api-services/mobile-api.service';
import { KioskExecutionPreServiceQuestionPage, KioskTemplateModel } from '../../agent/models/agent-models';
import { IHoursOfOperationOffset } from '../../agent/utility-services/models/workflow-models/workflow-interface';
import { IBranchDetails } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-branch-details.interface';
import { IHoursOfOperation, ITime, ITimeFrame, IWorkingDay, IWorkingHours } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-hours-of-operations.interface';
import { IWorkFlowDropdown, IWorkFlowServiceData } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { HaveAppointmentRequestModel } from '../../kiosk/kiosk-execution/kiosk-execution.service';
import { DefaultButtonsNames, HideAppBtnIfAppNotExist } from '../../template-shared/utilities';
import {
  IMobileButtonData, IMobileLayoutData, IMobilePreServiceQuestionPageData
} from '../models/mobile-layout-data.interface';
import {
  IMobilePreviewData, IMobilePreviewLanguagePageData, IMobilePreviewMarketingPageData, IMobilePreviewPanelItemsData,
  IMobilePreviewPanelQItemsData, IMobilePreviewServiceQuestionPageData, IMobilePreviewSurveyPageData,
  IMobilePreviewThankYouPageData, IMobilePreviewTicketPageData
} from '../models/mobile-preview-data.interface';
import { IMobileSupportedLanguage } from '../models/mobile-supported-language.interface';
import { IUrlRequestDetails } from '../models/mobile-url-request-model.interface';
import {
  IMobileWorkFlowDetail,
  IMobileWorkFlowQuestionData,
  IMobileWorkFlowServiceQuestionConditionRoute,
  IMobileWorkFlowServiceRoute
} from '../models/mobile-work-flow-detail.interface';
import { IMobilePageDetails } from '../models/pages.interface';


@Injectable()
export class MobileExecutionService extends AbstractComponentService {
  MobilePreviewData$: Observable<IMobilePreviewData>;
  MobilePreviewDataSubject: BehaviorSubject<IMobilePreviewData>;

  private SubjectWorkflows: BehaviorSubject<IWorkFlowDropdown[]>;
  public Workflows$: Observable<IWorkFlowDropdown[]>;

  private SubjectHoursOfOperationList: BehaviorSubject<any[]>;
  HoursOfOperationList$: Observable<any[]>;

  Branch$: Observable<IBranchDetails>;
  BranchSubject: BehaviorSubject<IBranchDetails>;

  CurrentPage$: Observable<IMobilePageDetails>;
  CurrentPageSubject: BehaviorSubject<IMobilePageDetails>;
  CurrentPage: IMobilePageDetails;
  CurrentPageIndex = 0;

  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  LanguageListSubject: BehaviorSubject<IMobileSupportedLanguage[]>;

  SelectedLanguageId$: Observable<string>;
  SelectedLanguageIdSubject: BehaviorSubject<string>;

  WorkFlowData: IMobileWorkFlowDetail;
  MobileLayoutData: IMobileLayoutData;
  MobileLayoutDataCopy: IMobileLayoutData;

  SubjectHoursOfOperation: BehaviorSubject<IHoursOfOperation>;
  HoursOfOperation$: Observable<IHoursOfOperation>;
  HoursOfOperation: IHoursOfOperation;

  private showBackButtonSubject: BehaviorSubject<boolean>;
  public showBackButton$: Observable<boolean>;

  UrlRequestDetails: IUrlRequestDetails;

  SelectedServiceId: string;
  RoutedQueueId: string;

  branchServices: string[];
  CompanyName$: Observable<string>;
  CompanyNameSubject: BehaviorSubject<string>;

  SelectedItemId: string;
  DefaultLanguageId: string;

  AllServiceQuestionPages = [];
  QuestionSetStack: IMobileWorkFlowServiceRoute[] = [];
  ServiceQuestionId: string;
  FooterText = { en: '@ 2021 Copyright ' + this.authService.CompanyName };
  DefaultPadding = '10';
  LogoPosition = 'center';

  ExecutionWaitingTime$: Observable<number>;

  get CurrentBranchTime(): Date {
    return this.GetCurrentBranchTime();
  }

  ControlType = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];
  MobileInterfaceData: IMobileLayoutData;
  KendoTimeZoneData = ZonedDate;

  PageNames = { // User active inactive logic is depend upon sequence of this object keys it should be same as MobilePageName enum;
    language: 'languagePage',
    welcome: 'welcomePage',
    globalQuestion: 'globalQuestionPage',
    service: 'servicePage',
    serviceQuestion: 'serviceQuestion',
    thankYou: 'thankYouPage',
    ticket: 'ticketPage',
    marketing: 'marketingPage',
    survey: 'surveyPage',
    NoQueuePage: 'noQueuePage',
    offlinePage: 'offLinePage'
  };
  FirstPageName: string;

  get HomePageName(): string {
    return this.FirstPageName;
  }
  BackButtonName = 'BackButton';

  constructor(
    private readonly kioskAPIService: KioskAPIService,
    private readonly workflowAPIService: WorkflowAPIService,
    private readonly branchAPIService: BranchAPIService,
    private readonly hoursOfOperationAPIService: HoursOfOperationAPIService,
    private readonly mobileAPIService: MobileAPIService,
    private readonly dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService,
    private dynamicVariablesService: DynamicVariableService,
    private dynamicBoldTextPipe: DynamicBoldTextPipe
  ) {
    super();
    this.InitializeObservables();
  }

  InitializeObservables() {
    this.CompanyNameSubject = new BehaviorSubject<string>(null);
    this.CompanyName$ = this.CompanyNameSubject.asObservable();

    this.MobilePreviewDataSubject = new BehaviorSubject<IMobilePreviewData>(
      null
    );
    this.MobilePreviewData$ = this.MobilePreviewDataSubject.asObservable();

    this.SubjectHoursOfOperationList = new BehaviorSubject<any[]>([]);
    this.HoursOfOperationList$ = this.SubjectHoursOfOperationList.asObservable();

    this.CurrentPageSubject = new BehaviorSubject<IMobilePageDetails>(null);
    this.CurrentPage$ = this.CurrentPageSubject.asObservable();

    this.LanguageListSubject = new BehaviorSubject<IMobileSupportedLanguage[]>(
      []
    );
    this.LanguageList$ = this.LanguageListSubject.asObservable();

    this.SelectedLanguageIdSubject = new BehaviorSubject<string>(null);
    this.SelectedLanguageId$ = this.SelectedLanguageIdSubject.asObservable();

    this.BranchSubject = new BehaviorSubject<IBranchDetails>(null);
    this.Branch$ = this.BranchSubject.asObservable();
    this.SubjectHoursOfOperation = new BehaviorSubject<IHoursOfOperation>(null);
    this.HoursOfOperation$ = this.SubjectHoursOfOperation.asObservable();

    this.SubjectWorkflows = new BehaviorSubject<IWorkFlowDropdown[]>([]);
    this.Workflows$ = this.SubjectWorkflows.asObservable();

    this.subs.sink = this.HoursOfOperation$.subscribe(hoo => this.HoursOfOperation = hoo);

    this.ExecutionWaitingTime$ = this.MobilePreviewData$.pipe(
      map(data => {
        return data?.designerScreen?.waitingTime ?? MobileExecution.WaitingTime;
      })
    );

    this.showBackButtonSubject = new BehaviorSubject<boolean>(true);
    this.showBackButton$ = this.showBackButtonSubject.asObservable();
  }

  InitializeURLRequestDetails(urlRequestDetails: IUrlRequestDetails) {
    this.UrlRequestDetails = urlRequestDetails;
    this.InitializeBranchDetails();
  }

  InitializeDetails() {

    this.formService.CombineAPICall(this.GetWorkFlow(), this.GetAllHorusOfOperation()).subscribe(([workflow, hooData]) => {
      this.WorkFlowData = workflow;
      this.SubjectHoursOfOperationList.next(hooData);
      this.ReplaceInitialPageLabelIfDynamicVariables();


    });
  }

  InitializeBranchDetails() {
    this.branchAPIService
    .GetExternal<IBranchDetails>(this.UrlRequestDetails.companyId, this.UrlRequestDetails.branchId)
    .subscribe((branchData: IBranchDetails) => {
      this.BranchSubject.next(branchData);
      const languages = branchData?.supportedLanguages;
      this.LanguageListSubject.next(languages);
      this.DefaultLanguageId = languages.find(x => x.isDefault).languageCode;
      this.InitializeHOO();
      this.SetWorkFlowList();
      this.InitializeDetails();
    });
   }

  GetWorkFlow() {
    return this.mobileAPIService.GetExternalMobileTemplate(this.UrlRequestDetails.companyId, this.UrlRequestDetails.mobileInterfaceId)
      .pipe(
        mergeMap((layout: IMobileLayoutData) => {
          this.MobileLayoutData = layout;
          this.MobileLayoutDataCopy = cloneObject(layout);
          this.CompanyNameSubject.next(layout?.companyName);
          return this.workflowAPIService
            .GetExternalPublished<IMobileWorkFlowDetail>(
              this.UrlRequestDetails.companyId,
              layout.designerScreen.WorkFlowId);
        })
      )
  }

  GetAllHorusOfOperation() {
    return this.hoursOfOperationAPIService.GetAllExternal(this.UrlRequestDetails.companyId);
  }

  private SetAndPassMobileLayoutData() {
    this.MobilePreviewDataSubject.next(this.GetInitialMobilePreviewData());
    if (this.FirstPageName === this.PageNames.offlinePage) {
      this.GetOfflinePageData(this.MobileLayoutData.offLinePage?.labels);
      if(!this.MobileLayoutData.offLinePage){
        this.AppNotificationService.NotifyError('No service available right now');
      }
    }
  }

  ReplaceInitialPageLabelIfDynamicVariables() {
    this.FirstPageName = this.GetPageName();
    let languageId = this.DefaultLanguageId;
    if (this.IsOnlyOneLanguage()) {
      this.SelectedLanguageIdSubject.next(this.LanguageListSubject.value[0].languageCode);
      languageId = this.SelectedLanguageIdSubject.value || this.DefaultLanguageId;
    }
    const Labels = this.MobileLayoutData[this.FirstPageName]?.labels;
    if (Labels && Labels.length > 0 && Labels.some(x => x.text[languageId]?.includes('%'))) {
      const LabelTexts = [];
      Labels.forEach(label => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId]
        });
      });
      this.CallReplaceDynamicVariableApi(LabelTexts, Labels, languageId, this.FirstPageName);
    } else {
      this.SetAndPassMobileLayoutData();
    }
  }

  private GetPageName() {
    if (this.AllServicesOffLineOrNot()) {
      this.SetPageVisibility(MobilePageName.OfflinePage);
      this.showBackButtonSubject.next(false);
      return this.PageNames.offlinePage;
    } else if (this.IsOnlyOneLanguage() && !this.HideWelcomePage()) {
      this.SetPageVisibility(MobilePageName.WelcomePage);
      return this.PageNames.welcome;
    } else if (this.IsOnlyOneLanguage() && this.HideWelcomePage()) {
      if (this.WorkFlowData.setting.enablePreServiceQuestions &&
        (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'before' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
            'after' && this.IsServicePageSkipOrNot()))) {
        this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
        return this.PageNames.globalQuestion;
      } else if (!(this.IsServicePageSkipOrNot())) {
        this.SetPageVisibility(MobilePageName.ServicePage);
        return this.PageNames.service;
      } else {
        this.SetServiceId();
        const serviceRouting = this.WorkFlowData.services.find(
          (x) => x.id === (this.SelectedServiceId || this.SelectedItemId)
        ).routing;
        if (serviceRouting.group === RoutingType.Queue) {
          this.SetPageVisibility(MobilePageName.ThankYouPage);
          return this.PageNames.service;
        } else if (serviceRouting.group === RoutingType.Questions) {
          this.SetPageVisibility(MobilePageName.ServiceQuestionPage);
          return this.PageNames.serviceQuestion;
        }
      }
    }
    this.SetPageVisibility(MobilePageName.LanguagePage);
    return this.PageNames.language;
  }

  AllServicesOffLineOrNot() {
    let serviceNotAvailable = true;
    if (!this.WorkFlowData) {
      serviceNotAvailable = false;
      return serviceNotAvailable;
    }
    this.WorkFlowData?.services?.forEach((service) => {
      if (!service?.isDeleted) {
        // if (this.branchServices?.find(x => x === service.id)) {
        if (this.IsServiceAvailable(service.id)) {
          serviceNotAvailable = false;
        }
        // }
      }
    });
    return serviceNotAvailable;
  }

  CallReplaceDynamicVariableApi(LabelTexts, Labels, languageId: string, pageName: string) {
    const req = this.GenerateKioskRequestModel();
    this.dynamicVariablesService.GetDynamicVariablesReplacedStrings(LabelTexts, this.WorkFlowData, req).
      subscribe((s: any) => {
        Labels.forEach(x => {
          x.text[languageId] = s.find(f => f.id === x.name).replacementString;
        });
        this.MobileLayoutData[pageName].labels = Labels;
        this.SetAndPassMobileLayoutData();
      });
  }

  async InitializeHOO() {
    const Branch = this.BranchSubject.getValue();
    const hoursOfOperationExceptionId = Branch?.advanceSettings?.hoursOfOperationExceptionId;
    if (hoursOfOperationExceptionId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>
        (this.UrlRequestDetails.companyId, hoursOfOperationExceptionId).toPromise();
      if (isDateLiesBetweenTwoDates(HOO.generalConfiguration.fromDate, HOO.generalConfiguration.toDate, this.CurrentBranchTime)) {
        this.SubjectHoursOfOperation.next(HOO);
        return;
      }
    }

    const HOOId: string = Branch
      ?.additionalSettings
      ?.hoursOfOperationId;
    if (HOOId) {
      const HOO = await this.hoursOfOperationAPIService
        .GetExternal<IHoursOfOperation>(this.UrlRequestDetails.companyId, HOOId).toPromise();
      this.SubjectHoursOfOperation.next(HOO);
    } else {
      this.AppNotificationService.NotifyError('Hours of operations not linked to location.');
    }
  }


  public SetWorkFlowList() {
    this.subs.sink = this.workflowAPIService
      .GetExternalDraftDropdownList(this.UrlRequestDetails.companyId)
      .subscribe((workflow: IWorkFlowDropdown[]) => {
        this.SubjectWorkflows.next(workflow);
        this.UpdateBranchServices();
      });
  }

  private UpdateBranchServices() {
    const AllWorkflows = this.SubjectWorkflows.getValue();
    const branch = this.BranchSubject.getValue();
    let branchServices = [];
    branch.workFlowUsedInBranchList?.forEach(workflow => {
      let Services: string[] = [];
      if (workflow.isAllServices) {
        Services = AllWorkflows.find(current => current.workFlowId === workflow.workFlowId)
          ?.services
          ?.map(x => x.id);
      } else {
        Services = workflow.serviceIds;
      }
      branchServices = branchServices.concat(Services);
    });
    this.branchServices = branchServices;
  }

  GetInitialMobilePreviewData(): any {
    return {
      designerScreen: {
        backGroundImage: this.MobileLayoutData.designerScreen.backGroundImage,
        fontStyle: this.MobileLayoutData.designerScreen.fontStyle,
        fontSize: this.MobileLayoutData.designerScreen.fontSize,
        font: this.MobileLayoutData.designerScreen.font,
        fontWeight: this.MobileLayoutData.designerScreen.fontWeight,
        color: this.MobileLayoutData.designerScreen.color,
        backgroundColor: this.MobileLayoutData.designerScreen.backgroundColor,
        height: this.MobileLayoutData.designerScreen.height,
        width: this.MobileLayoutData.designerScreen.width,
        languageId: '',
        waitingTime: this.MobileLayoutData.designerScreen.waitingTime
      },
      globalQuestionPage: this.GetPageDataOnPageName(),
      servicePage: this.GetPageDataOnPageName(),
      serviceQuestion: this.GetPageDataOnPageName(),
      thankYouPage: null,
      marketingPage: null,
      footerData: {
        color: this.MobileLayoutData.footerData.color,
        font: this.MobileLayoutData.footerData.font,
        fontSize: this.MobileLayoutData.footerData.fontSize,
        fontStyle: this.MobileLayoutData.footerData.fontStyle,
        fontWeight: this.MobileLayoutData.footerData.fontWeight,
        footerImage: this.MobileLayoutData.footerData.footerImage,
        text: this.MobileLayoutData.footerData.text || this.FooterText,
        isVisible: this.SetDefaultBooleanValue(this.MobileLayoutData.footerData.isVisible),
        isTextVisible: this.SetDefaultBooleanValue(this.MobileLayoutData.footerData.isTextVisible),
        isFooterImageVisible: this.SetDefaultBooleanValue(this.MobileLayoutData.footerData.isFooterImageVisible),
        isLogoVisible: this.SetDefaultBooleanValue(this.MobileLayoutData.footerData.isLogoVisible),
        footerLogo: this.MobileLayoutData.footerData.footerLogo
      },
      headerData: {
        backGroundImage: this.MobileLayoutData.headerData.backGroundImage,
        isVisible: this.MobileLayoutData.headerData.isVisible,
        verticalPadding: this.MobileLayoutData.headerData.verticalPadding || this.DefaultPadding,
        horizontalPadding: this.MobileLayoutData.headerData.horizontalPadding || this.DefaultPadding,
        logoPosition: this.MobileLayoutData.headerData.logoPosition || this.LogoPosition,
        height: this.MobileLayoutData.headerData.height || this.DefaultPadding
      },
      surveyPage: null,
      companyName: null,
      ticketPage: null,
      languagePAge: this.GetLanguagePageData(),
      welcomePage: this.GetWelcomePageDataIfOneLanguage(),
      offlinePage: null,
    };
  }


  private GetPageDataOnPageName() {
    if (this.FirstPageName === this.PageNames.globalQuestion) {
      return this.GlobalQuestionPageData(this.MobileLayoutData.globalQuestionPage.labels);
    } else if (this.FirstPageName === this.PageNames.service) {
      return this.ServicePageData(this.MobileLayoutData.servicePage.labels);
    } else if (this.FirstPageName === this.PageNames.serviceQuestion) {
      const serviceRouting = this.WorkFlowData.services.find(
        (x) => x.id === (this.SelectedServiceId || this.SelectedItemId)
      ).routing;
      return this.GetServiceQuestionData(serviceRouting);
    } else if (this.FirstPageName === this.PageNames.thankYou) {
      return this.GetThankYouPageData(this.MobileLayoutData.thankYouPage.labels);
    }
    return null;
  }

  private SetDefaultBooleanValue(element): boolean {
    return (element !== undefined) ? element : true;
  }

  private GetLanguagePageData(): IMobilePreviewLanguagePageData {
    if (!this.IsOnlyOneLanguage()) {
      return {
        images: this.MobileLayoutData.languagePage.images,
        labels: this.MobileLayoutData.languagePage.labels,
        videos: this.MobileLayoutData.languagePage.videos,
        sliders: this.MobileLayoutData.languagePage.sliders,
        panel: this.MobileLayoutData.languagePage.panel,
        items: this.GetMappedLanguageList(),
      };
    }
    return null;
  }

  IsOnlyOneLanguage() {
    return this.LanguageListSubject.value.length === 1;
  }

  private GetWelcomePageDataIfOneLanguage() {
    if (this.IsOnlyOneLanguage() && !this.HideWelcomePage()) {
      return this.WelcomePageData(this.MobileLayoutData.welcomePage.labels);
    }
    return null;
  }

  GetMappedLanguageList(): IMobilePreviewPanelItemsData[] {
    const list: IMobilePreviewPanelItemsData[] = [];
    this.LanguageListSubject.value.forEach((Language) => {
      list.push({
        itemId: Language.languageCode,
        itemText: Language.language,
        isItemSelected: true,
      });
    });
    return list;
  }
  ShowNextPage(data) {
    if (typeof data === 'string') {
      this.SelectedItemId = data;
    }
    if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.RedirectFromWelcomePage();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.RedirectFromLanguagePage();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.RedirectFromPreServiceQuestionPage();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.SelectedServiceId = this.SelectedItemId;
      const validation = this.ValidateService(this.SelectedServiceId);
      if (!validation.result) {
        if (this.MobileLayoutData.offLinePage) {
          this.RedirectToOffLine();
        } else {
          this.AppNotificationService.NotifyErrorPersistant(validation.message);
        }
        return;
      }
      this.RedirectFromServicePage();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.RedirectFromServiceQuestionPage();
    }
  }

  ShowPreviousPage() {
    if (this.CurrentPageSubject.value.IsServicePage) {
      this.RedirectToWelcomeOrGlobalQuestionPage();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.RedirectToServiceOrServiceQuestionPageOnBackButton();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.RedirectFromServiceQuestionOnBackButton();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.RedirectToLanguagePage();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.servicePage.labels, 'servicePage');
    }
    this.UpdatePreviewData();
  }

  private RedirectToLanguagePage() {
    this.SetPageVisibility(MobilePageName.LanguagePage);
    this.GetLanguagePageData();
  }

  private RedirectFromServiceQuestionOnBackButton() {
    this.QuestionSetStack.pop();
    if (this.QuestionSetStack.length > 0) {
      const LastQuestionSet = this.QuestionSetStack.pop();
      this.RedirectToServiceQuestionORQueuePage(LastQuestionSet);
    }
    else {
      this.RedirectToGlobalQuestionOrServicePage();
    }
  }

  RedirectToWelcomeOrGlobalQuestionPage() {
    if (this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.globalQuestionPage.labels, 'globalQuestionPage');
    }
    else {
      this.RedirectToLanguageOrWelcomePage();
    }
  }

  private RedirectToLanguageOrWelcomePage() {
    if (this.HideWelcomePage() && (!this.IsOnlyOneLanguage())) {
      this.RedirectToLanguagePage();
    } else {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.welcomePage.labels, 'welcomePage');
    }
  }

  private RedirectToServiceOrServiceQuestionPageOnBackButton() {
    if (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after' && (this.IsServicePageSkipOrNot()))) {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.welcomePage.labels, 'welcomePage');
    } else {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.servicePage.labels, 'servicePage');
    }
  }

  private RedirectToGlobalQuestionOrServicePage() {
    if (this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'after' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' && (this.IsServicePageSkipOrNot()))) {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.globalQuestionPage.labels, 'globalQuestionPage');
    } else {
      this.SkipServicePage();
    }
  }

  private SkipServicePage() {
    if ((!this.WorkFlowData.setting.enablePreServiceQuestions) && this.IsServicePageSkipOrNot()) {
      this.SetPageVisibility(MobilePageName.WelcomePage);
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.welcomePage.labels, 'welcomePage');
    } else {
      this.SetPageVisibility(MobilePageName.ServicePage);
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.servicePage.labels, 'servicePage');
    }
  }

  RedirectFromLanguagePage() {
    this.SelectedLanguageIdSubject.next(this.SelectedItemId);
    if (!this.HideWelcomePage()) {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.welcomePage.labels, 'welcomePage');
    } else {
      this.RedirectFromWelcomePage();
    }
  }

  private HideWelcomePage() {
    return this.MobileLayoutData.pageProperties ? (this.MobileLayoutData.pageProperties.hideWelcomePage) : false;
  }

  private GetWelcomePageData(Labels) {
    this.MobilePreviewDataSubject.value.welcomePage = this.WelcomePageData(Labels);
  }

  private GetNoQueuePageData(Labels) {
    this.MobilePreviewDataSubject.value.noQueuePage = this.NoQueuePageData(Labels);
  }

  private GetOfflinePageData(Labels) {
    this.MobilePreviewDataSubject.value.offlinePage = this.OfflinePageData(Labels);
  }

  private WelcomePageData(Labels) {
    return {
      images: this.MobileLayoutData.welcomePage.images,
      labels: Labels,
      videos: this.MobileLayoutData.welcomePage.videos,
      sliders: this.MobileLayoutData.welcomePage.sliders,
      button: this.MobileLayoutData.welcomePage.button,
    };
  }

  private NoQueuePageData(Labels) {
    return {
      images: this.MobileLayoutData?.noQueuePage?.images,
      labels: Labels,
      videos: this.MobileLayoutData?.noQueuePage?.videos,
      sliders: this.MobileLayoutData?.noQueuePage?.sliders,
      buttons: this.MobileLayoutData?.noQueuePage?.buttons,
    };
  }

  private OfflinePageData(Labels) {
    return {
      images: this.MobileLayoutData?.offLinePage?.images,
      labels: Labels,
      videos: this.MobileLayoutData?.offLinePage?.videos,
      sliders: this.MobileLayoutData?.offLinePage?.sliders,
      buttons: this.MobileLayoutData?.offLinePage?.buttons,
    };
  }

  UpdatePreviewData() {
    this.MobilePreviewDataSubject.next(this.MobilePreviewDataSubject.value);
  }

  RedirectFromWelcomePage() {
    if (
      this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before'
    ) {
      this.RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue();
    } else {
      this.SkipServicePageIfOneService();
    }
  }

  private SkipServicePageIfOneService() {
    if (this.IsServicePageSkipOrNot()) {
      this.SetServiceId();
      this.RedirectFromServicePage();
    } else {
      this.RedirectToServicePageIfDisplayPreserviceQuestionIsFalse();
    }
  }

  private IsNoAppointmentAcceptInService() {
    let IsNoAppointmentAcceptInService = true;
    this.MobileLayoutData.servicePage.items?.forEach((item) => {
      if (this.WorkFlowData.services?.find((service) => service.id === item.itemId).acceptAppointments) {
        IsNoAppointmentAcceptInService = false;
      }
    });
    return IsNoAppointmentAcceptInService;
  }

  private IsServicePageSkipOrNot() {
    let IsSkip = false;
    const selectedServices = this.MobileLayoutData.servicePage.items.filter((x) => x.isItemSelected)
    if (selectedServices.length != 1) {
      return IsSkip
    }
    if (!this.IsNoAppointmentAcceptInService()) {
      if (this.WorkFlowData.setting.enablePreServiceQuestions && this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before') {
        IsSkip = true;
      }
      else {
        IsSkip = false;
      }
    }
    else {
      IsSkip = true;
    }
    return IsSkip;
  }

  private GetServiceQuestionItems(
    workFlowQuestions: IMobileWorkFlowQuestionData[],
  ): IMobilePreviewPanelQItemsData[] {
    const items: IMobilePreviewPanelQItemsData[] = [];
    workFlowQuestions.forEach((x) => {
      if (!x.isDeleted) {
        const type = x.type;
        const itemTypeSettings = [];
        if (this.ControlType.some((questionType) => questionType === type)) {
          x.typeSetting.forEach((element) => {
            itemTypeSettings.push(
              this.GetElementWithSpecificSelectedOrDefaultLanguage(element)?.option
            );
          });
        }
        items.push({
          required: x.isRequired,
          answer: this.GetAnswerOfServiceQuestionIfPresent(x.id),
          itemId: x.id,
          visible: x.isVisible,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(x.question)?.question,
          itemType: type,
          itemTypeSetting: this.ControlType.some(
            (questionType) => questionType === type
          )
            ? itemTypeSettings
            : x.typeSetting,
        });
      }
    });
    return items;
  }

  private GetServiceQuestionButtons(buttonList: IMobileButtonData) {
    return buttonList;
  }

  RedirectFromPreServiceQuestionPage() {
    if (
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before' && (!this.IsServicePageSkipOrNot())
    ) {
      this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.servicePage.labels, 'servicePage');
    } else {
      if (this.IsServicePageSkipOrNot()) {
        this.SetServiceId();
      }
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  private SetServiceId() {
    this.SelectedServiceId = this.MobileLayoutData.servicePage.items[0].itemId;
  }

  private GetServicesItems(
    workFlowServices: IWorkFlowServiceData[]
  ): IMobilePreviewPanelItemsData[] {
    const items: IMobilePreviewPanelItemsData[] = [];
    workFlowServices.forEach((x) => {
      if (!x.isDeleted) {
        items.push({
          itemId: x.id,
          isItemSelected: this.MobileLayoutData.servicePage.items.find((m) => m.itemId === x.id)?.isItemSelected && x.acceptWalkins,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(x.serviceNames)?.serviceName,
          itemIcon: this.GetElementWithSpecificSelectedOrDefaultLanguage(x.serviceIconUrls)?.url,
          isActive: this.IsServiceAvailable(x.id)
        });
      }
    });

    return items;
  }

  RedirectFromServicePage() {
    if (
      this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions === 'After'
    ) {
      this.RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue();
    } else {
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  RedirectToOffLine() {
    this.GetDynamicVariablesReplacedFromLabel(
      this.MobileLayoutData.offLinePage?.labels,
      'offLinePage'
    );
  }

  RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue() {
    this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.globalQuestionPage.labels, 'globalQuestionPage');
  }

  private GetGlobalQuestionPageData(Labels) {
    this.MobilePreviewDataSubject.value.globalQuestionPage = this.GlobalQuestionPageData(Labels);
  }

  private GlobalQuestionPageData(Labels) {
    this.MobileLayoutData.globalQuestionPage.buttons =
      HideAppBtnIfAppNotExist(this.MobileLayoutData.globalQuestionPage.buttons, this.WorkFlowData.appointmentTemplates);
    if (!(this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
      this.MobileLayoutData.globalQuestionPage.buttons =
        this.MobileLayoutData.globalQuestionPage.buttons?.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
    }
    return {
      images: this.MobileLayoutData.globalQuestionPage.images,
      labels: Labels,
      sliders: this.MobileLayoutData.globalQuestionPage.sliders,
      panel: this.MobileLayoutData.globalQuestionPage.panel,
      videos: this.MobileLayoutData.globalQuestionPage.videos,
      items: this.GetPreServiceQuestionItems(
        this.MobileLayoutData.globalQuestionPage,
        this.WorkFlowData.preServiceQuestions
      ),
      buttons: this.GetGlobalQuestionButtons(),
    };
  }

  private GetGlobalQuestionButtons() {
    if (this.IsOnlyOneLanguage() && this.HideWelcomePage() && this.IsServicePageSkipOrNot()) {
      this.MobileLayoutData.globalQuestionPage.buttons =
        this.MobileLayoutData.globalQuestionPage.buttons.filter(x => x.name !== this.BackButtonName);
    }
    return this.MobileLayoutData.globalQuestionPage.buttons;
  }

  RedirectToServiceQuestionPageORQueuesAfterCheckingConditon() {
    const serviceRouting = this.WorkFlowData.services.find(
      (x) => x.id === (this.SelectedServiceId || this.SelectedItemId)
    ).routing;
    this.RedirectToServiceQuestionORQueuePage(serviceRouting);
  }

  RedirectFromServiceQuestionPage() {
    const previouslyAskedQuestionSets: string[] = this.GetPreviouslyAskedQuestionSetIds();
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
      documents
    };

    this.dynamicRuleProcessorAPIService.EvaluateConditionalRoute(request).subscribe(responses => {
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
        this.RoutedQueueId = response.queueId;
        this.PostCustomerRequest();
      }
      if (response.responseType == ConditionalRoutingResponseTypes.QuestionSet) {
        const questionSetId = response.questionSetId;
        this.RedirectToServiceQuestionORQueuePage({
          group: RoutingType.Questions,
          id: questionSetId,
          type: RoutingType.Questions
        });
      }
      if (response.responseType == ConditionalRoutingResponseTypes.NoQueue) {
        this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData?.noQueuePage?.labels, 'noQueuePage');
      }
    });
  }

  CalculateDefaultRoute() {
    const serviceQuestionSet = this.WorkFlowData.questionSets.find(
      (x) => x.id === this.ServiceQuestionId
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
        serviceQuestions,
        serviceId: this.SelectedServiceId,
        isWalking: true,
        isAppointment: false
      }
    };
  }
  GetServiceQuestionWithAnswers(): { id: string; answer: string; }[] {
    if (!this.AllServiceQuestionPages || this.AllServiceQuestionPages.length == 0) {
      return [];
    }

    let AllAnsweredQuestions: any[] = [];
    for (const ServiceQuestionPage of this.AllServiceQuestionPages) {
      AllAnsweredQuestions = AllAnsweredQuestions.concat(ServiceQuestionPage.items);
    }

    const mappedQuestions = AllAnsweredQuestions.map(x => {
      return {
        id: x.itemId,
        answer: x.answer
      };
    }) || [];

    return mappedQuestions;
  }

  GetWorkflowBaseDetails(): RulesDocumentReference {
    return {
      documentType: 'workflow',
      pk: this.WorkFlowData.companyId,
      id: this.WorkFlowData.workFlowId
    };
  }

  GetPreviouslyAskedQuestionSetIds(): string[] {
    const questionSets = this.AllServiceQuestionPages.map(x => x.id);
    return questionSets;
  }

  private CheckIsConditionSatisfy(
    element: IMobileWorkFlowServiceQuestionConditionRoute
  ) {
    return element.condition === 'true';
  }

  private PerformActionMentionInTheServiceQuestionSet(
    element: IMobileWorkFlowServiceQuestionConditionRoute
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

  ReDirectToThankYouPage() {
    this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.thankYouPage.labels, 'thankYouPage');
  }

  ReDirectToMarketingPage() {
    this.SetPageVisibility(MobilePageName.MarketingPage);
    this.MobilePreviewDataSubject.value.marketingPage = this.GetMarketingPageData();
    this.UpdatePreviewData();
  }
  private GetMarketingPageData(): IMobilePreviewMarketingPageData {
    return {
      images: this.MobileLayoutData.marketingPage.images,
      labels: this.MobileLayoutData.marketingPage.labels,
      sliders: this.MobileLayoutData.marketingPage.sliders,
      videos: this.MobileLayoutData.marketingPage.videos,
    };
  }
  ReDirectToTicketPage() {
    this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.ticketPage.labels, 'ticketPage');
  }
  private GetTicketPageData(Labels): IMobilePreviewTicketPageData {
    return {
      panel: {
        verticalPadding: this.MobileLayoutData.ticketPage.panel.verticalPadding,
        backgroundColor: this.MobileLayoutData.ticketPage.panel.backgroundColor,
        boxCorner: this.MobileLayoutData.ticketPage.panel.boxCorner,
        font: this.MobileLayoutData.ticketPage.panel.font,
        fontSize: this.MobileLayoutData.ticketPage.panel.fontSize,
        fontStyle: this.MobileLayoutData.ticketPage.panel.fontStyle,
        fontWeight: this.MobileLayoutData.ticketPage.panel.fontWeight,
        height: this.MobileLayoutData.ticketPage.panel.height,
        horizontalPadding: this.MobileLayoutData.ticketPage.panel
          .horizontalPadding,
        left: this.MobileLayoutData.ticketPage.panel.left,
        primaryColor: this.MobileLayoutData.ticketPage.panel.primaryColor,
        secondaryColor: this.MobileLayoutData.ticketPage.panel.secondaryColor,
        top: this.MobileLayoutData.ticketPage.panel.top,
        width: this.MobileLayoutData.ticketPage.panel.width,
      },
      buttonPanel: this.GetTicketButtons(),
      items: this.MobileLayoutData.ticketPage.items,
      images: this.MobileLayoutData.ticketPage.images,
      labels: Labels,
      sliders: this.MobileLayoutData.ticketPage.sliders,
      videos: this.MobileLayoutData.ticketPage.videos,
    };
  }

  private GetTicketButtons() {
    const buttons: IMobileButtonData[] = [];
    this.RemoveRequestMoreTimeButtonIfRequeueIsNotEnabled();
    this.MobileLayoutData.ticketPage.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.height,
        top: x.top,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.boxRoundCorners,
        color: x.color,
        backgroundColor: x.backgroundColor,
        boxRoundCorners: x.boxRoundCorners,
        font: x.font,
        fontSize: x.fontSize,
        fontWeight: x.fontWeight,
        fontStyle: x.fontStyle,
        text: x.text,
        primaryButtonSrc: x.primaryButtonSrc,
        secondaryButtonSrc: x.secondaryButtonSrc,
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
        showSecondaryButtonIcon: x.showSecondaryButtonIcon,
        isPrimaryButton: x.isPrimaryButton,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow
      });
    });
    return buttons;
  }

  private RemoveRequestMoreTimeButtonIfRequeueIsNotEnabled() {
    if (!this.WorkFlowData.setting.enableMobileInterfaceRequeue) {
      const ticketPageButtons = this.MobileLayoutData.ticketPage.buttons;
      const requestMoreTimeButtonIdentifier = 'PrimaryButton';
      const index = ticketPageButtons.findIndex(x => x.name === requestMoreTimeButtonIdentifier);
      if (index > -1) {
        ticketPageButtons.splice(index, 1);
      }
    }
  }

  // ReDirectToSurveyPage() {
  //   this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.surveyPage.labels, 'surveyPage');
  // }
  // private GetSurveyPageData(Labels): IMobilePreviewSurveyPageData {
  //   return {
  //     images: this.MobileLayoutData.surveyPage.images,
  //     labels: Labels,
  //     sliders: this.MobileLayoutData.surveyPage.sliders,
  //     videos: this.MobileLayoutData.surveyPage.videos,
  //   };
  // }

  private GetThankYouPageData(Labels): IMobilePreviewThankYouPageData {
    return {
      images: this.MobileLayoutData.thankYouPage.images,
      labels: Labels,
      sliders: this.MobileLayoutData.thankYouPage.sliders,
      videos: this.MobileLayoutData.thankYouPage.videos,
    };
  }

  private RedirectToServiceQuestionORQueuePage(
    serviceRouting: IMobileWorkFlowServiceRoute
  ) {

    if (serviceRouting.group === RoutingType.Queue) {
      // Need to do an api call for ticket
      this.RoutedQueueId = serviceRouting.id;

      this.PostCustomerRequest();
    } else if (serviceRouting.group === RoutingType.Questions) {
      this.RedirectToServiceQuestionPage(serviceRouting);
    }
  }

  ValidateService(serviceId: string): IValidation {
    if (this.branchServices.find(x => x === serviceId)) {
      if (this.IsServiceAvailable(serviceId)) {
        return this.SuccessfulValidation();
      } else {
        return this.UnSuccessfulValidation('This service is not available at this moment.');
      }
    } else {
      return this.UnSuccessfulValidation('This service is not available in this location.');
    }
  }

  SuccessfulValidation(): IValidation {
    return {
      result: true,
      message: ''
    };
  }
  UnSuccessfulValidation(msg: string): IValidation {
    return {
      result: false,
      message: msg
    };
  }

  PostCustomerRequest() {
    const TemplateModel = this.GenerateRequestModel();
    TemplateModel.workflow.setting=null;
    TemplateModel.workflow.preServiceQuestions=null;
    TemplateModel.workflow.services=null;
    TemplateModel.workflow.questionSets=null;
    TemplateModel.workflow.queues=null;
    TemplateModel.workflow.groups=null;
    TemplateModel.workflow.appointmentTemplates=null;
    this.kioskAPIService.GenerateTicketExternal<KioskTemplateModel, any>(TemplateModel)
      .subscribe(response => {
        if (response?.ticketNumber) {
          this.routeHandlerService.RedirectToMobileMonitorPage(`mobile-monitor/${TemplateModel.companyId}/${TemplateModel.branchId}/${this.UrlRequestDetails.mobileInterfaceId}/${TemplateModel.id}`);
        }
      });
  }

  GenerateRequestModel(): KioskTemplateModel {
    const MobilePreviewData = this.MobilePreviewDataSubject.value;
    const language = this.LanguageListSubject.value.find(x => x.languageCode == (this.SelectedLanguageIdSubject.value || this.DefaultLanguageId));
    return {
      kioskData: {
        designer: {
          WorkFlowId: this.WorkFlowData.workFlowId,
        },
        preServiceQuestionPage: this
          .MapQuestionToKioskTemplateModel(MobilePreviewData?.globalQuestionPage?.items),
        serviceQuestion: this.MapQuestionToKioskTemplateModel(MobilePreviewData?.serviceQuestion?.items),
      },
      queueId: this.RoutedQueueId,
      branchId: this.UrlRequestDetails.branchId,
      id: this.uuid,
      workflow: this.MapWorkflow(this.WorkFlowData),
      serviceId: this.SelectedServiceId,
      selectedLanguageId: this.SelectedLanguageIdSubject.value,
      selectedLanguageName: language.language,
      requestSourceType: 'MOBILE',
      requestSourceId: '',
      companyId: this.UrlRequestDetails.companyId,
      mobileInterfaceId: this.UrlRequestDetails.mobileInterfaceId
    };
  }


  MapWorkflow(WorkFlowData: IMobileWorkFlowDetail): any {
    return WorkFlowData;
  }

  MapQuestionToKioskTemplateModel(Questions: IMobilePreviewPanelQItemsData[]): KioskExecutionPreServiceQuestionPage {
    if (Questions) {
      return {
        items: Questions.map(question => {
          return {
            answer: question.answer,
            itemId: question.itemId,
            itemText: question.itemText,
            itemType: question.itemType,
          };
        })
      };
    }
    else {
      return {
        items: []
      };
    }
  }


  RedirectToServiceQuestionPage(serviceRouting: IMobileWorkFlowServiceRoute) {
    const languageId = this.SelectedLanguageIdSubject.value || this.DefaultLanguageId;
    const Labels = this.MobileLayoutDataCopy.serviceQuestion.labels;
    if (Labels.length > 0 && Labels.some(x => x.text[languageId]?.includes('%'))) {
      const LabelTexts = [];
      Labels.forEach(label => {
        LabelTexts.push({
          id: label.name,
          replacementString: label.text[languageId]
        });
      });
      const kioskRequest = this.GenerateKioskRequestModel();
      this.dynamicVariablesService.GetDynamicVariablesReplacedStrings(LabelTexts, this.WorkFlowData, kioskRequest).
        subscribe((s: any) => {
          this.MobileLayoutData.serviceQuestion.labels.forEach(x => {
            x.text[languageId] = s.find(f => f.id === x.name).replacementString;
          });
          this.ServiceQuestionPage(serviceRouting);
        });
    } else {
      this.ServiceQuestionPage(serviceRouting);
    }
  }

  ServiceQuestionPage(serviceRouting: IMobileWorkFlowServiceRoute) {
    this.SetPageVisibility(MobilePageName.ServiceQuestionPage);
    this.MobilePreviewDataSubject.value.serviceQuestion = this.GetServiceQuestionData(
      serviceRouting
    );
    this.ServiceQuestionId = serviceRouting.id;
    this.MobilePreviewDataSubject.value.serviceQuestion.button = this.MobilePreviewDataSubject.value.serviceQuestion.button;
    if (
      this.WorkFlowData.questionSets.find((x) => x.id == serviceRouting.id)
        .routing.group == RoutingType.Queue
    ) {
      this.MobilePreviewDataSubject.value.serviceQuestion.button =
        this.GetServiceQuestionButtons(this.MobileLayoutData.serviceQuestion.button);
    }
    this.AllServiceQuestionPages =
      this.AllServiceQuestionPages.filter(x => !(x.id === serviceRouting.id))
        .concat(this.MobilePreviewDataSubject.value.serviceQuestion);
    this.QuestionSetStack.push(serviceRouting);
    this.UpdatePreviewData();
  }

  private GetServiceQuestionData(
    serviceRouting: IMobileWorkFlowServiceRoute
  ): IMobilePreviewServiceQuestionPageData {
    return {
      id: serviceRouting.id,
      images: this.MobileLayoutData.serviceQuestion.images,
      labels: this.MobileLayoutData.serviceQuestion.labels,
      panel: this.MobileLayoutData.serviceQuestion.panel,
      videos: this.MobileLayoutData.serviceQuestion.videos,
      sliders: this.MobileLayoutData.serviceQuestion.sliders,
      button: this.GetServiceQuestionButtons(
        this.MobileLayoutData.serviceQuestion.button
      ),
      items: this.GetServiceQuestionItems(
        this.WorkFlowData.questionSets.find((x) => x.id === serviceRouting.id)
          .questions,
      ),
    };
  }

  RedirectToServicePageIfDisplayPreserviceQuestionIsFalse() {
    this.GetDynamicVariablesReplacedFromLabel(this.MobileLayoutData.servicePage.labels, 'servicePage');
  }

  private GetServicePageData(Labels) {
    this.MobilePreviewDataSubject.value.servicePage = this.ServicePageData(Labels);
  }

  private ServicePageData(Labels) {
    this.MobileLayoutData.servicePage.buttons =
      HideAppBtnIfAppNotExist(this.MobileLayoutData.servicePage.buttons, this.WorkFlowData.appointmentTemplates);
    if ((this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
      this.MobileLayoutData.servicePage.buttons =
        this.MobileLayoutData.servicePage.buttons?.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
    }
    return {
      images: this.MobileLayoutData.servicePage.images,
      sliders: this.MobileLayoutData.servicePage.sliders,
      labels: Labels,
      videos: this.MobileLayoutData.servicePage.videos,
      panel: this.MobileLayoutData.servicePage.panel,
      items: this.GetServicesItems(
        this.GetBranchSelectedServices()
      ),
      buttons: this.MobileLayoutData.servicePage.buttons
    };
  }
  GetBranchSelectedServices() {
    const BranchDetail = this.BranchSubject.value;

    const isAllWorkflowServicesSelected = BranchDetail?.workFlowUsedInBranchList?.find(
      workFlowUsedInBranch => workFlowUsedInBranch.workFlowId == this.WorkFlowData.workFlowId)?.isAllServices;

    if (isAllWorkflowServicesSelected) {
      return this.WorkFlowData.services;
    }

    const WorkFlowUsedInBranchServiceIds = BranchDetail.workFlowUsedInBranchList.find((x) => x.workFlowId === this.WorkFlowData.workFlowId).serviceIds
    const WorkflowUsedInBranchServices: IWorkFlowServiceData[] = [];
    WorkFlowUsedInBranchServiceIds.forEach((m) => {
      this.WorkFlowData.services.find((n) => {
        if (n.id === m) {
          WorkflowUsedInBranchServices.push(n);
        }
      });
    });
    return WorkflowUsedInBranchServices
  }

  private GetPreServiceQuestionItems(
    PreServiceQuestionPage: IMobilePreServiceQuestionPageData,
    workFlowQuestions: IMobileWorkFlowQuestionData[]
  ): IMobilePreviewPanelQItemsData[] {
    const items: IMobilePreviewPanelQItemsData[] = [];
    workFlowQuestions.forEach((x) => {
      if (!x.isDeleted) {
        const type = x.type;
        const itemTypeSettings = [];
        if (this.ControlType.some((questionType) => questionType === type)) {
          x.typeSetting.forEach((element) => {
            itemTypeSettings.push(
              this.GetElementWithSpecificSelectedOrDefaultLanguage(element)?.option
            );
          });
        }
        items.push({
          required: x.isRequired,
          answer: this.GetAnswerOfPreServiceQuestionIfPresent(x.id),
          itemId: x.id,
          visible: x.isVisible,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(x.question)?.question,
          itemType: type,
          itemTypeSetting: this.ControlType.some(
            (questionType) => questionType === type
          )
            ? itemTypeSettings
            : workFlowQuestions.find((m) => m.id === x.id).typeSetting,
        });
      }
    });
    return items;
  }

  GetAnswerOfPreServiceQuestionIfPresent(questionId: string): any {
    if (this.MobilePreviewDataSubject.value && this.MobilePreviewDataSubject.value.globalQuestionPage &&
      this.MobilePreviewDataSubject.value.globalQuestionPage.items &&
      this.MobilePreviewDataSubject.value.globalQuestionPage.items.length > 0) {
      const question = this.MobilePreviewDataSubject.value.globalQuestionPage.items.find(x => x.itemId === questionId);
      return question?.answer;
    }
    return '';
  }

  GetAnswerOfServiceQuestionIfPresent(questionId: string): any {
    if (this.AllServiceQuestionPages && this.AllServiceQuestionPages.length > 0) {
      let AllAnsweredQuestions = [];
      for (const ServiceQuestionPage of this.AllServiceQuestionPages) {
        AllAnsweredQuestions = AllAnsweredQuestions.concat(ServiceQuestionPage.items);
      }
      const question = AllAnsweredQuestions.find(x => x.itemId === questionId);
      return question?.answer;
    }
    return '';
  }

  /* #region  Reusable Function */

  SetPageVisibility(pageIndex) {
    this.CurrentPageIndex = pageIndex;
    this.CurrentPage = {
      IsServicePage: pageIndex === MobilePageName.ServicePage,
      IsWelcomePage: pageIndex === MobilePageName.WelcomePage,
      IsServiceQuestionPage: pageIndex === MobilePageName.ServiceQuestionPage,
      IsGlobalQuestionPage: pageIndex === MobilePageName.GlobalQuestionPage,
      IsThankYouPage: pageIndex === MobilePageName.ThankYouPage,
      IsMarketingPage: pageIndex === MobilePageName.MarketingPage,
      IsSurveyPage: pageIndex === MobilePageName.SurveyPage,
      IsTicketPage: pageIndex === MobilePageName.TicketPage,
      IsLanguagePage: pageIndex === MobilePageName.LanguagePage,
      IsNoQueuePage: pageIndex === MobilePageName.NoQueuePage,
      IsOffLinePage: pageIndex === MobilePageName.OfflinePage,
    };
    this.CurrentPageSubject.next(this.CurrentPage);
  }
  /* #endregion */

  IsServiceAvailable(serviceId: string): boolean {
    const BranchTime = this.GetCurrentBranchTime();
    const service = this.WorkFlowData.services.find((s) => s.id === serviceId);
    const workingDay = cloneObject(this.GetHOODayById(BranchTime.getDay()));
    if (!BranchTime) {
      return false;
    }
    if (service.serviceOccur?.value) {
      if (service.hoursOfOperationId && service.serviceOccur.value === OperationalOccurs.Default) {
        return ServiceAvailableOrNotDefault(this.GetDefaultWorkingDaysData(service.hoursOfOperationId), BranchTime)
      }
      return CheckServiceAvailability(service, BranchTime)
    }
    if (!this.IsOpenForDayOfTheWeek(BranchTime.getDay())) {
      return false;
    }
    const isHolidayToday = this.IsHolidayToday(BranchTime);
    if (isHolidayToday) {
      return false;
    }

    return ServiceAvailableOrNotDefault(this.HoursOfOperation.workingHours, BranchTime)
  }

  GetDefaultWorkingDaysData(hooId): IWorkingHours {
    let HoursOfOperationData: IWorkingHours = null
    this.SubjectHoursOfOperationList.value.find((x) => {
      if (x.id === hooId) {
        HoursOfOperationData = x.workingHours;
      }
    });
    return HoursOfOperationData
  }

  ConvertMinutesToTimeFrame(TotalTimeFrameMinutes: number): ITime {
    return {
      hours: parseInt((TotalTimeFrameMinutes / 60).toString()),
      minutes: parseInt((TotalTimeFrameMinutes % 60).toString()),
    };
  }


  IsTimeLiesInFrame(timeFrame: ITimeFrame, TotalMinuteOfTheDay: number): unknown {
    const fromTimeHours = timeFrame.fromTime.hours;
    const fromTimeMinutes = timeFrame.fromTime.minutes;
    const TotalFromTimeMinuteOfTheDay = (fromTimeHours * 60) + Number(fromTimeMinutes);

    const toTimeHours = timeFrame.toTime.hours;
    const toTimeMinutes = timeFrame.toTime.minutes;
    const TotalToTimeMinuteOfTheDay = (toTimeHours * 60) + Number(toTimeMinutes);

    return TotalFromTimeMinuteOfTheDay <= TotalMinuteOfTheDay
      && TotalToTimeMinuteOfTheDay >= TotalMinuteOfTheDay;

  }

  private IsHolidayToday(BranchTime: Date): boolean {
    if (this.HoursOfOperation?.nonWorkingDaysList) {
      const Holidays = this.HoursOfOperation.nonWorkingDaysList.some((holiday) =>
        isDateLiesBetweenTwoDates(
          holiday.fromDate,
          holiday.toDate,
          BranchTime
        )
      );
      return Holidays;
    }
    else {
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

  private IsOpenForDayOfTheWeek(DayId: number): boolean {
    const day = this.GetHOODayById(DayId);
    return day?.isOpen;
  }

  GetCurrentBranchTime(): Date {
    const Branch = this.BranchSubject.getValue();

    const DateConvertedToTimeZone = this.KendoTimeZoneData.fromLocalDate(new Date(), Branch.additionalSettings.timeZone.id);
    const currentBranchTime = new Date(DateConvertedToTimeZone.getFullYear(), DateConvertedToTimeZone.getMonth(), DateConvertedToTimeZone.getDate(),
      DateConvertedToTimeZone.getHours(), DateConvertedToTimeZone.getMinutes(), DateConvertedToTimeZone.getSeconds(), DateConvertedToTimeZone.getMilliseconds());
    return currentBranchTime;
  }

  private GetElementWithSpecificSelectedOrDefaultLanguage(element: any) {
    let current_element = element.find(
      (lang) => lang.languageId === this.SelectedLanguageIdSubject.value
    );
    if (!current_element) {
      current_element = element.find(
        (lang) => lang.languageId === this.DefaultLanguageId
      );
    }
    return current_element ? current_element : [];
  }


  HaveAppointment(appointmentId: string): void {
    const SaveAppointmentModel: HaveAppointmentRequestModel = {
      appointmentId,
      branchId: this.UrlRequestDetails.branchId,
      mobileInterfaceId: this.UrlRequestDetails.mobileInterfaceId
    };

    this.kioskAPIService.SaveCustomerRequestByAppointmentExternal<any, any>(SaveAppointmentModel.branchId, SaveAppointmentModel)
      .subscribe(response => {
        if (response) {
          if (response?.ticketNumber) {
            this.routeHandlerService.RedirectToMobileMonitorPage(`mobile-monitor/${this.UrlRequestDetails.companyId}/${this.UrlRequestDetails.branchId}/${this.UrlRequestDetails.mobileInterfaceId}/${response.id}`);
          }
        }
        else {
          this.RedirectFromWelcomePage();
        }
      });
  }

  GetDynamicVariablesReplacedFromLabel(Labels, pageName: string) {
    let labels = Labels || [];
    const languageId = this.SelectedLanguageIdSubject.value || this.DefaultLanguageId;
    const ReplaceDynamicFieldLabels = this.MobileLayoutDataCopy[pageName]?.labels;
    if (labels.length && ReplaceDynamicFieldLabels.length > 0 && ReplaceDynamicFieldLabels.some(x => x.text[languageId]?.includes('%'))) {
      const LabelTexts = [];
      ReplaceDynamicFieldLabels.forEach(label => {
        const replacementString = this.dynamicBoldTextPipe.transform(label.text[languageId]);
        LabelTexts.push({
          id: label.name,
          replacementString
        });
      });
      const kioskRequest = this.GenerateKioskRequestModel();
      this.dynamicVariablesService.GetDynamicVariablesReplacedStrings(LabelTexts, this.WorkFlowData, kioskRequest).
        subscribe((s: any) => {
          labels.forEach(x => {
            x.text[languageId] = s.find(f => f.id === x.name).replacementString;
          });
          this.GetDataAsPerPage(pageName, Labels);
        });
    } else {
      this.GetDataAsPerPage(pageName, labels);
    }
  }

  GenerateKioskRequestModel() {
    const MobilePreviewData = this.MobilePreviewDataSubject.value;
    return {
      designer: {
        WorkFlowId: this.WorkFlowData.workFlowId,
      },
      preServiceQuestions: this
        .MapQuestionToKioskRequestModel(MobilePreviewData?.globalQuestionPage?.items),
      serviceQuestions: this.MapQuestionToKioskRequestModel(MobilePreviewData?.serviceQuestion?.items),
      queueId: this.RoutedQueueId,
      branchId: this.UrlRequestDetails.branchId,
      id: this.uuid,
      workflow: this.MapWorkflow(this.WorkFlowData),
      serviceId: this.SelectedServiceId,
      selectedLanguageId: this.SelectedLanguageIdSubject.value,
      requestSourceType: 'MOBILE',
      requestSourceId: '',
      companyId: this.UrlRequestDetails.companyId,
      mobileInterfaceId: this.UrlRequestDetails.mobileInterfaceId
    };
  }

  MapQuestionToKioskRequestModel(Questions: IMobilePreviewPanelQItemsData[]) {
    const items = [];
    if (Questions) {
      Questions.forEach(question => {
        items.push({
          answer: question.answer,
          questionId: question.itemId,
          questionText: question.itemText,
          questionType: question.itemType,
        });
      });
    }
    return items;
  }

  GetDataAsPerPage(pageName: string, Labels) {
    if (pageName === 'globalQuestionPage') {
      this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
      this.GetGlobalQuestionPageData(Labels);
    } else if (pageName === 'servicePage') {
      this.SetPageVisibility(MobilePageName.ServicePage);
      this.GetServicePageData(Labels);
    } else if (pageName === 'thankYouPage') {
      this.SetPageVisibility(MobilePageName.ThankYouPage);
      this.MobilePreviewDataSubject.value.thankYouPage = this.GetThankYouPageData(Labels);
    } else if (pageName === 'welcomePage') {
      this.SetPageVisibility(MobilePageName.WelcomePage);
      this.GetWelcomePageData(Labels);
    } else if (pageName === 'noQueuePage') {
      this.SetPageVisibility(MobilePageName.NoQueuePage);
      this.GetNoQueuePageData(Labels);
    } else if (pageName === 'offLinePage') {
      this.SetPageVisibility(MobilePageName.OfflinePage);
      this.GetOfflinePageData(Labels);
    }
    this.UpdatePreviewData();
  }

  OnExitRedirectToInitialPage() {
    window.location.reload();
  }

}

const OffsetPerformWhens = {
  StartOfDay: 'Start of the day',
  EndOfDay: 'End of the day',
  StartOfBreak: 'Start of a break',
  EndOfBreak: 'Break ends',
};

const OffsetPerformAts = {
  After: 'After',
  Before: 'Before'
};

const OffsetOperation = {
  Start: 'Start',
  End: 'Close'
};

export interface IValidation {
  result: boolean;
  message: string;
}
