import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import {
  IndexDBLayoutDataKeys, IndexDBStoreNames
} from 'src/app/models/constants/index-db.constant';
import { MobilePageName } from 'src/app/models/enums/mobile-page-name.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import { RulesDocument, RulesDocumentReference } from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { IWorkFlowServiceData } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { DefaultButtonsNames, HideAppBtnIfAppNotExist } from "../../template-shared/utilities";
import {
  IMobileButtonData, IMobileLayoutData, IMobilePreServiceQuestionPageData, IMobileServicePageData, IMobileServiceQuestionPageData
} from '../models/mobile-layout-data.interface';
import {
  IMobilePreviewData, IMobilePreviewLanguagePageData, IMobilePreviewMarketingPageData,
  IMobilePreviewPanelItemsData, IMobilePreviewPanelQItemsData,
  IMobilePreviewServiceQuestionPageData,
  IMobilePreviewSurveyPageData,
  IMobilePreviewThankYouPageData,
  IMobilePreviewTicketPageData
} from '../models/mobile-preview-data.interface';
import { IMobileSupportedLanguage } from '../models/mobile-supported-language.interface';
import {
  IMobileWorkFlowDetail,
  IMobileWorkFlowQuestionData,
  IMobileWorkFlowServiceQuestionConditionRoute,
  IMobileWorkFlowServiceRoute
} from '../models/mobile-work-flow-detail.interface';
import { IMobilePageDetails } from '../models/pages.interface';

@Injectable()
export class MobilePreviewService extends AbstractComponentService {
  MobilePreviewData$: Observable<IMobilePreviewData>;
  MobilePreviewDataSubject: BehaviorSubject<IMobilePreviewData>;

  CurrentPage$: Observable<IMobilePageDetails>;
  CurrentPageSubject: BehaviorSubject<IMobilePageDetails>;

  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  LanguageListSubject: BehaviorSubject<IMobileSupportedLanguage[]>;

  SelectedLanguageId$: Observable<string>;
  SelectedLanguageIdSubject: BehaviorSubject<string>;

  WorkFlowData: IMobileWorkFlowDetail;
  MobileLayoutData: IMobileLayoutData;
  SelectedItemId;
  DefaultLanguageId: string;

  ControlType = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];
  AllServiceQuestionPages = [];
  QuestionSetStack: IMobileWorkFlowServiceRoute[] = [];
  ServiceQuestionId: string;
  IsBackButtonClicked = false;
  ServiceId: string;
  FooterText = {en: '@ 2021 Copyright ' + this.authService.CompanyName};
  Count = 0;
  BackButtonName = 'BackButton';

  constructor(
    private idbService: IndexDBService,
    private dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService
  ) {
    super();
    this.InitializeObservables();
  }

  InitializeObservables() {
    this.MobilePreviewDataSubject = new BehaviorSubject<IMobilePreviewData>(
      null
    );
    this.MobilePreviewData$ = this.MobilePreviewDataSubject.asObservable();

    this.CurrentPageSubject = new BehaviorSubject<IMobilePageDetails>(null);
    this.CurrentPage$ = this.CurrentPageSubject.asObservable();

    this.LanguageListSubject = new BehaviorSubject<IMobileSupportedLanguage[]>(
      []
    );
    this.LanguageList$ = this.LanguageListSubject.asObservable();

    this.SelectedLanguageIdSubject = new BehaviorSubject<string>(null);
    this.SelectedLanguageId$ = this.SelectedLanguageIdSubject.asObservable();
  }

  async InitializeProperties() {
    await this.SetWorkFlow();
    await this.SetMobileData();
    await this.SetLanguageList();
    this.SetPageVisibility(this.IsOnlyOneLanguage() ? MobilePageName.WelcomePage : MobilePageName.LanguagePage);
    setTimeout(async () => {
      this.MobilePreviewDataSubject.next(this.GetInitialMobilePreviewData());
    }, 1000);
  }

  private async SetLanguageList() {
    this.LanguageListSubject.next((await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.CompanySupportLanguages
    )) as IMobileSupportedLanguage[]);
    this.DefaultLanguageId = this.LanguageListSubject.value.find(x => x.isDefault).languageCode;
    this.SelectedLanguageIdSubject.next(this.LanguageListSubject.value.find(
      (x) => x.isDefault
    ).languageCode);
  }

  private async SetMobileData() {
    this.MobileLayoutData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.MobileLayoutData
    )) as IMobileLayoutData;
  }
  private async SetWorkFlow() {
    this.WorkFlowData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.MobileWorkFlowData
    )) as IMobileWorkFlowDetail;
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
      globalQuestionPage: this.GetPageDataOnWorkflowSetting(),
      servicePage: this.GetPageDataOnWorkflowSetting(),
      serviceQuestion: this.GetPageDataOnWorkflowSetting(),
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
        isVisible: this.MobileLayoutData.footerData.isVisible,
        isTextVisible: this.MobileLayoutData.footerData.isTextVisible,
        isFooterImageVisible: this.MobileLayoutData.footerData.isFooterImageVisible,
        isLogoVisible: this.MobileLayoutData.footerData.isLogoVisible,
        footerLogo: this.MobileLayoutData.footerData.footerLogo
      },
      headerData: {
        backGroundImage: this.MobileLayoutData.headerData.backGroundImage,
        isVisible: this.MobileLayoutData.headerData.isVisible,
        verticalPadding: this.MobileLayoutData.headerData.verticalPadding,
        horizontalPadding: this.MobileLayoutData.headerData.horizontalPadding,
        logoPosition: this.MobileLayoutData.headerData.logoPosition,
        height: this.MobileLayoutData.headerData.height
      },
      surveyPage: null,
      companyName: null,
      ticketPage: null,
      languagePAge: this.GetLanguagePageData(),
      welcomePage: this.GetWelcomePageDataIfOnlyOneLanguage(),
    };
  }

  private GetPageDataOnWorkflowSetting(){
    if (this.IsOnlyOneLanguage() && this.HideWelcomePage() && this.Count === 0){
      if (this.WorkFlowData.setting.enablePreServiceQuestions &&
        (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after' && this.IsServicePageSkipOrNot()))) {
          this.Count ++;
          this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
          return this.GlobalQuestionData();
        }else if (!this.IsServicePageSkipOrNot()) {
          this.Count ++;
          this.SetPageVisibility(MobilePageName.ServicePage);
          return this.ServicePageData();
        }else {
            this.Count ++;
            this.SetServiceIdAndSetThankYouOrServiceQuestionPageData();
          }
    }
    return null;
  }

  private SetServiceIdAndSetThankYouOrServiceQuestionPageData(){
    this.SetServiceId();
    const serviceRouting = this.WorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.SelectedItemId
      )).routing;
    if (serviceRouting.group === RoutingType.Queue) {
      this.SetPageVisibility(MobilePageName.ThankYouPage);
      return this.GetThankYouPageData();
      }else if (serviceRouting.group === RoutingType.Questions) {
        this.SetPageVisibility(MobilePageName.ServiceQuestionPage);
        return this.GetServiceQuestionData(serviceRouting);
      }
  }

    private HideWelcomePage() {
    return this.MobileLayoutData.pageProperties.hideWelcomePage;
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

  private GetWelcomePageDataIfOnlyOneLanguage(){
    if (this.IsOnlyOneLanguage()  && (!this.HideWelcomePage())){
      return this.WelcomePageData();
    }else{
      return null;
    }
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
      this.ServiceId = this.SelectedItemId;
      this.RedirectFromServicePage();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.RedirectFromServiceQuestionPage();
    }
  }

  ShowPreviousPage() {
    this.IsBackButtonClicked = true;
    if (this.CurrentPageSubject.value.IsServicePage) {
      this.RedirectToWelcomeOrPreServiceQuestionPage();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.RedirectToServiceOrServiceQuestionPageOnBackButton();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.RedirectFromServiceQuestionOnBackButton();
    } else if (this.CurrentPageSubject.value.IsWelcomePage){
      this.RedirectToLanguagePage();
    }

    this.UpdatePreviewData();
    this.IsBackButtonClicked = false;
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
      this.RedirectToPreServiceOrServicePage();
    }
  }

  RedirectToWelcomeOrPreServiceQuestionPage() {
    if (this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') {
      this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
      this.GetGlobalQuestionData();
    }
    else {
      this.RedirectToLanguageOrWelcomePage();
    }
  }

  private RedirectToLanguageOrWelcomePage() {
    if (this.HideWelcomePage() && (!this.IsOnlyOneLanguage())) {
      this.RedirectToLanguagePage();
    } else {
      this.SetPageVisibility(MobilePageName.WelcomePage);
      this.GetWelcomePageData();
    }
  }

  private RedirectToServiceOrServiceQuestionPageOnBackButton() {
    if (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'after' && (this.IsServicePageSkipOrNot())) ){
      this.SetPageVisibility(MobilePageName.WelcomePage);
      this.GetWelcomePageData();
    } else {
      this.SetPageVisibility(MobilePageName.ServicePage);
      this.GetServicePageData();
    }
  }

  private RedirectToPreServiceOrServicePage() {
    if (this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'after' || (this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before' && (this.IsServicePageSkipOrNot()))) {
      this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
      this.GetGlobalQuestionData();
    } else {
      this.SkipServicePageIfOneService();
    }
  }

  private SkipServicePageIfOneService() {
    if ((!this.WorkFlowData.setting.enablePreServiceQuestions) && (this.IsServicePageSkipOrNot())) {
      this.SetPageVisibility(MobilePageName.WelcomePage);
      this.GetWelcomePageData();
    } else {
      this.SetPageVisibility(MobilePageName.ServicePage);
      this.GetServicePageData();
    }
  }

  RedirectFromLanguagePage() {
    if (!this.HideWelcomePage()){
    this.SetPageVisibility(MobilePageName.WelcomePage);
    this.SelectedLanguageIdSubject.next(this.SelectedItemId);
    this.GetWelcomePageData();
    this.UpdatePreviewData();
  }else{
    this.RedirectFromWelcomePage();
  }
  }

  private GetWelcomePageData() {
    this.MobilePreviewDataSubject.value.welcomePage = this.WelcomePageData();
  }

  private WelcomePageData(){
    return {
      images: this.MobileLayoutData.welcomePage.images,
      labels: this.MobileLayoutData.welcomePage.labels,
      videos: this.MobileLayoutData.welcomePage.videos,
      sliders: this.MobileLayoutData.welcomePage.sliders,
      button: this.MobileLayoutData.welcomePage.button,
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
      if (this.IsServicePageSkipOrNot()) {
        this.SetServiceId();
        this.RedirectFromServicePage();
      }else{
        this.RedirectToServicePageIfDisplayPreserviceQuestionIsFalse();
      }
    }
  }

  private SetServiceId() {
    this.ServiceId = this.MobileLayoutData.servicePage.items[0].itemId;
  }

  private IsNoAppointmentAcceptInService() {
    let IsNoAppointmentAcceptInService = true;
   this.MobileLayoutData.servicePage.items.forEach((item)=>{
     if(this.WorkFlowData.services.find((service)=>service.id === item.itemId).acceptAppointments){
       IsNoAppointmentAcceptInService = false;
     }
   });
   return IsNoAppointmentAcceptInService;
 }

  private IsServicePageSkipOrNot() {
    let IsSkip = false;
    const selectedServices = this.MobileLayoutData.servicePage.items.filter((x) => x.isItemSelected)
    if(selectedServices.length != 1){
      return IsSkip
    }
      if(!this.IsNoAppointmentAcceptInService()){
        if(this.WorkFlowData.setting.enablePreServiceQuestions){
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

  private GetServiceQuestionItems(
    serviceQuestion: IMobileServiceQuestionPageData,
    workFlowQuestions: IMobileWorkFlowQuestionData[],
    questionId: string
  ): IMobilePreviewPanelQItemsData[] {
    const items: IMobilePreviewPanelQItemsData[] = [];
    serviceQuestion.itemSet
      .find((x) => x.itemSetId === questionId)
      .items.forEach((x) => {
        const type = workFlowQuestions.find((m) => m.id === x.itemId).type;
        const itemTypeSettings = [];
        if (this.ControlType.some((questionType) => questionType === type)) {
          workFlowQuestions
            .find((m) => m.id === x.itemId)
            .typeSetting.forEach((element) => {
              itemTypeSettings.push(
                this.GetElementWithSpecificSelectedOrDefaultLanguage(element)?.option
              );
            });
        }
        items.push({
          required: workFlowQuestions.find((m) => m.id === x.itemId).isRequired,
          answer: type === QuestionType.Options.value ? itemTypeSettings[0] : this.GetAnswerOfServiceQuestionIfPresent(x.itemId),
          itemId: workFlowQuestions.find((m) => m.id === x.itemId).id,
          visible: workFlowQuestions.find((m) => m.id === x.itemId).isVisible,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(workFlowQuestions
            .find((m) => m.id === x.itemId)
            .question)?.question,
          itemType: type,
          itemTypeSetting: this.ControlType.some(
            (questionType) => questionType === type
          )
            ? itemTypeSettings
            : workFlowQuestions.find((m) => m.id === x.itemId).typeSetting,
        });
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
      this.SetPageVisibility(MobilePageName.ServicePage);
      this.GetServicePageData();
      this.UpdatePreviewData();
    } else {
      if (this.IsServicePageSkipOrNot()){
        this.ServiceId = this.MobileLayoutData.servicePage.items[0].itemId;
      }
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  private GetServicePageData() {
    this.MobilePreviewDataSubject.value.servicePage = this.ServicePageData();
  }

  private ServicePageData() {
    this.MobileLayoutData.servicePage.buttons =
    HideAppBtnIfAppNotExist(this.MobileLayoutData.servicePage.buttons, this.WorkFlowData.appointmentTemplates);
    if ((this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
        this.MobileLayoutData.servicePage.buttons =
        this.MobileLayoutData.servicePage.buttons.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
      }
    return {
      images: this.MobileLayoutData.servicePage.images,
      labels: this.MobileLayoutData.servicePage.labels,
      videos: this.MobileLayoutData.servicePage.videos,
      sliders: this.MobileLayoutData.servicePage.sliders,
      panel: this.MobileLayoutData.servicePage.panel,
      items: this.GetServicesItems(
        this.MobileLayoutData.servicePage,
        this.WorkFlowData.services
      ),
      buttons: this.MobileLayoutData.servicePage.buttons
    };
  }

  private GetServicesItems(
    ServicePage: IMobileServicePageData,
    workFlowServices: IWorkFlowServiceData[]
  ): IMobilePreviewPanelItemsData[] {
    const items: IMobilePreviewPanelItemsData[] = [];
    ServicePage.items.forEach((x) => {
      items.push({
        itemId: x.itemId,
        isItemSelected:
          x.isItemSelected &&
          workFlowServices.find((m) => m.id == x.itemId).acceptWalkins,
        itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(workFlowServices
          .find((m) => m.id === x.itemId)
          .serviceNames)?.serviceName,
        itemIcon: this.GetElementWithSpecificSelectedOrDefaultLanguage(workFlowServices
          .find((m) => m.id === x.itemId)
          .serviceIconUrls).url
      });
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

  RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue() {
    this.SetPageVisibility(MobilePageName.GlobalQuestionPage);
    this.GetGlobalQuestionData();
    this.UpdatePreviewData();
  }

  private GetGlobalQuestionData() {
    this.MobilePreviewDataSubject.value.globalQuestionPage = this.GlobalQuestionData();
  }

  private GlobalQuestionData() {
    this.MobileLayoutData.globalQuestionPage.buttons =
    HideAppBtnIfAppNotExist(this.MobileLayoutData.globalQuestionPage.buttons, this.WorkFlowData.appointmentTemplates);
    if (!(this.WorkFlowData.setting.enablePreServiceQuestions &&
      this.WorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
      'before') || this.IsNoAppointmentAcceptInService()) {
        this.MobileLayoutData.globalQuestionPage.buttons =
        this.MobileLayoutData.globalQuestionPage.buttons.filter(x => x.name !== DefaultButtonsNames.AppointmentButtonName);
      }
    return {
      images: this.MobileLayoutData.globalQuestionPage.images,
      labels: this.MobileLayoutData.globalQuestionPage.labels,
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
    if (this.IsOnlyOneLanguage() && this.HideWelcomePage() && this.IsServicePageSkipOrNot()){
      this.MobileLayoutData.globalQuestionPage.buttons =
      this.MobileLayoutData.globalQuestionPage.buttons.filter(x => x.name !== this.BackButtonName);
    }
    return this.MobileLayoutData.globalQuestionPage.buttons;
  }

  RedirectToServiceQuestionPageORQueuesAfterCheckingConditon() {
    const serviceRouting = this.WorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.SelectedItemId)
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
        const queueId = response.queueId;
        // API call for post requests in execution
        this.ReDirectToTicketPage();
      }
      if (response.responseType == ConditionalRoutingResponseTypes.QuestionSet) {
        const questionSetId = response.questionSetId;
        this.RedirectToServiceQuestionORQueuePage({
          group: RoutingType.Questions,
          id: questionSetId,
          type: RoutingType.Questions
        });
      }
      if (response.responseType == ConditionalRoutingResponseTypes.NoQueue){
        this.SetPageVisibility(MobilePageName.NoQueuePage);
        this.GetNoQueuePageData();
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

  GetRequestDetails(): RulesDocument {
    const serviceQuestions = this.GetServiceQuestionWithAnswers();
    return {
      documentType: 'customerRequest',
      document: {
        id: '',
        workflowId: this.WorkFlowData.workFlowId,
        serviceQuestions,
        serviceId: this.ServiceId,
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


  ReDirectToThankYouPage() {
    this.SetPageVisibility(MobilePageName.ThankYouPage);
    this.MobilePreviewDataSubject.value.thankYouPage = this.GetThankYouPageData();
    this.UpdatePreviewData();
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
    this.SetPageVisibility(MobilePageName.TicketPage);
    this.MobilePreviewDataSubject.value.ticketPage = this.GetTicketPageData();
    this.UpdatePreviewData();
  }
  private GetTicketPageData(): IMobilePreviewTicketPageData {
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
      items: this.MobileLayoutData.ticketPage.items,
      buttonPanel: this.GetTicketButtons(),
      images: this.MobileLayoutData.ticketPage.images,
      labels: this.MobileLayoutData.ticketPage.labels,
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
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
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
  //   this.SetPageVisibility(MobilePageName.SurveyPage);
  //   this.MobilePreviewDataSubject.value.surveyPage = this.GetSurveyPageData();
  //   this.UpdatePreviewData();
  // }
  // private GetSurveyPageData(): IMobilePreviewSurveyPageData {
  //   return {
  //     images: this.MobileLayoutData.surveyPage.images,
  //     labels: this.MobileLayoutData.surveyPage.labels,
  //     sliders: this.MobileLayoutData.surveyPage.sliders,
  //     videos: this.MobileLayoutData.surveyPage.videos,
  //   };
  // }

  private GetThankYouPageData(): IMobilePreviewThankYouPageData {
    return {
      images: this.MobileLayoutData.thankYouPage.images,
      labels: this.MobileLayoutData.thankYouPage.labels,
      sliders: this.MobileLayoutData.thankYouPage.sliders,
      videos: this.MobileLayoutData.thankYouPage.videos,
    };
  }

  private RedirectToServiceQuestionORQueuePage(
    serviceRouting: IMobileWorkFlowServiceRoute
  ) {
    if (serviceRouting.group === RoutingType.Queue) {
      // Need to do an api call for ticket
      this.ReDirectToTicketPage();
    } else if (serviceRouting.group === RoutingType.Questions) {
      this.RedirectToServiceQuestionPage(serviceRouting);
    }
  }

  RedirectToServiceQuestionPage(serviceRouting: IMobileWorkFlowServiceRoute) {
    let primaryButtonText;
    this.SetPageVisibility(MobilePageName.ServiceQuestionPage);
    this.MobilePreviewDataSubject.value.serviceQuestion = this.GetServiceQuestionData(
      serviceRouting
    );
    this.ServiceQuestionId = serviceRouting.id;
    this.MobilePreviewDataSubject.value.serviceQuestion.button = this.MobilePreviewDataSubject.value.serviceQuestion.button;
    primaryButtonText = this.MobilePreviewDataSubject.value.serviceQuestion.button.text;
    if (
      this.WorkFlowData.questionSets.find((x) => x.id == serviceRouting.id)
        .routing.group == RoutingType.Queue
    ) {
      this.MobilePreviewDataSubject.value.serviceQuestion.button.text =
        this.MobilePreviewDataSubject.value.serviceQuestion.button.secondaryButtonText;
      this.MobilePreviewDataSubject.value.serviceQuestion.button.secondaryButtonText = primaryButtonText;
      this.MobilePreviewDataSubject.value.serviceQuestion.button.isPrimaryButton = false;
    } else {
      if (this.IsBackButtonClicked) {
        this.MobilePreviewDataSubject.value.serviceQuestion.button.text =
          this.MobilePreviewDataSubject.value.serviceQuestion.button.secondaryButtonText;
        this.MobilePreviewDataSubject.value.serviceQuestion.button.secondaryButtonText = primaryButtonText;
        this.MobilePreviewDataSubject.value.serviceQuestion.button.isPrimaryButton = true;
      }
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
        this.MobileLayoutData.serviceQuestion,
        this.WorkFlowData.questionSets.find((x) => x.id === serviceRouting.id)
          .questions,
        serviceRouting.id
      ),
    };
  }

  RedirectToServicePageIfDisplayPreserviceQuestionIsFalse() {
    this.SetPageVisibility(MobilePageName.ServicePage);
    this.GetServicePageData();
    this.UpdatePreviewData();
  }

  private GetPreServiceQuestionItems(
    PreServiceQuestionPage: IMobilePreServiceQuestionPageData,
    workFlowQuestions: IMobileWorkFlowQuestionData[]
  ): IMobilePreviewPanelQItemsData[] {
    const items: IMobilePreviewPanelQItemsData[] = [];
    PreServiceQuestionPage.items.forEach((x) => {
      const type = workFlowQuestions.find((m) => m.id === x.itemId).type;
      const itemTypeSettings = [];
      if (this.ControlType.some((questionType) => questionType === type)) {
        workFlowQuestions
          .find((m) => m.id === x.itemId)
          .typeSetting.forEach((element) => {
            itemTypeSettings.push(
              this.GetElementWithSpecificSelectedOrDefaultLanguage(element)?.option
            );
          });
      }
      items.push({
        required: workFlowQuestions.find((m) => m.id === x.itemId).isRequired,
        answer: this.GetAnswerOfGlobalQuestionIfPresent(x.itemId),
        itemId: x.itemId,
        visible: workFlowQuestions.find((m) => m.id === x.itemId).isVisible,
        itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(workFlowQuestions
          .find((m) => m.id === x.itemId)
          .question)?.question,
        itemType: type,
        itemTypeSetting: this.ControlType.some(
          (questionType) => questionType === type
        )
          ? itemTypeSettings
          : workFlowQuestions.find((m) => m.id === x.itemId).typeSetting,
      });
    });
    return items;
  }

  GetAnswerOfGlobalQuestionIfPresent(questionId: string): any {
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
      const question = AllAnsweredQuestions.find(x => x.itemId == questionId);
      return question?.answer;
    }
    return '';
  }

  /* #region  Reusable Function */

  SetPageVisibility(pageIndex) {
    this.CurrentPageSubject.next({
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
    });
  }
  /* #endregion */

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

  private GetNoQueuePageData() {
    this.MobilePreviewDataSubject.value.noQueuePage = this.NoQueuePageData();
  }

  private NoQueuePageData(){
    return {
      images: this.MobileLayoutData?.noQueuePage?.images,
      labels: this.MobileLayoutData?.noQueuePage?.labels,
      videos: this.MobileLayoutData?.noQueuePage?.videos,
      sliders: this.MobileLayoutData?.noQueuePage?.sliders,
      buttons: this.MobileLayoutData?.noQueuePage?.buttons,
    };
  }

  ExitButtonClick(){
    window.location.reload();
  }
}
