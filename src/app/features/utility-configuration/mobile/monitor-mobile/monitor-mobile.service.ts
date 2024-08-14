import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import {
  cloneObject,
  parseInteger
} from 'src/app/core/utilities/core-utilities';
import { WorkflowEstimateWaitSettings } from 'src/app/models/common/workflow/workflow-estimate-wait-settings.model';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { MobilePageName } from 'src/app/models/enums/mobile-page-name.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { EstimateWaitTime } from 'src/app/shared/api-models/mobile-execution/estimate-wate-time';
import { AgentAPIService } from 'src/app/shared/api-services/agent-api.service';
import { MobileAPIService } from 'src/app/shared/api-services/mobile-api.service';
import { Confirmable } from 'src/app/shared/decorators/confirmable.decorator';
import { DynamicBoldTextPipe } from 'src/app/shared/pipes/dynamic-bold-text/dynamic-bold-text.pipe';
import { DynamicVariableService } from '../../../../core/services/dynamic-variables.service';
import { KioskExecutionPreServiceQuestionPage } from '../../agent/models/agent-models';
import { IQueue } from '../../agent/utility-services/models/agent-signalr/queue.model';
import { QueueSignalRService } from '../../agent/utility-services/services/agent-signalR/queue-signalr.service';
import { MobileMessages } from '../messages';
import { MobileExecutionDeleteResponse } from '../models/mobile-execution-delete-respone.model';
import { PostMobileExecution } from '../models/mobile-execution-post.model';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import {
  IMobileButtonData,
  IMobileLayoutData
} from '../models/mobile-layout-data.interface';
import {
  IMobileWorkFlowDetail,
  IMobileWorkFlowQuestionData,
} from '../models/mobile-work-flow-detail.interface';
import {
  ButtonIndexes,
  CustomerState,
  MobileMonitorRequest
} from '../models/mobile-monitor-execution-model';
import {
  IMobilePreviewButtonData,
  IMobilePreviewData,
  IMobilePreviewMarketingPageData,
  IMobilePreviewPanelItemsData,
  IMobilePreviewPanelQItemsData,
  IMobilePreviewSurveyPageData,
  IMobilePreviewThankYouPageData,
  IMobilePreviewTicketItemData,
  IMobilePreviewTicketPageData
} from '../models/mobile-preview-data.interface';
import { IUrlRequestDetails } from '../models/mobile-url-request-model.interface';
import { IMobilePageDetails } from '../models/pages.interface';
import { TranslateService } from 'src/app/core/services/translate.service';
import { AppointmentTextInterface } from 'src/app/features/appointment-scheduler/models/appointment-text.interface';
import { AppointmentTextTypeEnum, AppointmentTextEnum } from 'src/app/features/appointment-scheduler/models/enum/appointment-text.enum';

@Injectable()
export class MobileMonitorService extends AbstractComponentService {
  MobilePreviewData$: Observable<IMobilePreviewData>;
  MobilePreviewDataSubject: BehaviorSubject<IMobilePreviewData>;

  private SubjectMonitorRequest: BehaviorSubject<MobileMonitorRequest>;
  public MonitorRequest$: Observable<MobileMonitorRequest>;

  CurrentPage$: Observable<IMobilePageDetails>;
  CurrentPageSubject: BehaviorSubject<IMobilePageDetails>;

  SelectedLanguageId$: Observable<string>;
  SelectedLanguageIdSubject: BehaviorSubject<string>;

  MobileLayoutData: IMobileLayoutData;

  UrlRequestDetails: IUrlRequestDetails;

  CompanyName$: Observable<string>;
  CompanyNameSubject: BehaviorSubject<string>;

  estimatedWaitTime: EstimateWaitTime;
  WorkFlowData: IMobileWorkFlowDetail;

  SelectedItemId: string;
  DefaultLanguageId: string;
  AllSurveyQuestionPages = [];

  CurrentCustomerState: BehaviorSubject<string>;

  translatedTexts$: Observable<AppointmentTextInterface>;
  translatedTextsSubject: BehaviorSubject<AppointmentTextInterface>;

  ControlType = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];
  MobileInterfaceData: IMobileLayoutData;
  FooterText = { en: '@ 2021 Copyright ' + this.authService.CompanyName };
  DefaultPadding = '10';
  Position = 'center';

  QueuePositions: IQueue;
  companyId: string;

  constructor(
    private readonly translateApiService: TranslateService,
    private readonly mobileAPIService: MobileAPIService,
    private agentAPIService: AgentAPIService,
    private dynamicVariablesService: DynamicVariableService,
    private queueSignalRService: QueueSignalRService,
    private dynamicBoldTextPipe: DynamicBoldTextPipe,
    private readonly workflowAPIService: WorkflowAPIService,
  ) {
    super();
    this.InitializeObservables();
  }

  InitializeQueueSignalR() {

    const branchId = this.UrlRequestDetails.branchId;

    const workflowId = this.MobileLayoutData.designerScreen.WorkFlowId;

    const QueueDocId = `${branchId}_${workflowId}_Queue`;
    this.queueSignalRService.Init(QueueDocId);

    this.subs.sink = this.queueSignalRService.QueuePositions$.subscribe(
      (queue) => {

        this.QueuePositions = queue;
        UpdateSubject(this.SubjectMonitorRequest);
      }
    );

  }

  InitializeObservables() {

    this.CompanyNameSubject = new BehaviorSubject<string>(null);
    this.CompanyName$ = this.CompanyNameSubject.asObservable();
    this.MobilePreviewDataSubject = new BehaviorSubject<IMobilePreviewData>(
      null
    );
    this.MobilePreviewData$ = this.MobilePreviewDataSubject.asObservable();

    this.CurrentPageSubject = new BehaviorSubject<IMobilePageDetails>(null);
    this.CurrentPage$ = this.CurrentPageSubject.asObservable();

    this.SelectedLanguageIdSubject = new BehaviorSubject<string>(null);
    this.SelectedLanguageId$ = this.SelectedLanguageIdSubject.asObservable();

    this.SubjectMonitorRequest = new BehaviorSubject<MobileMonitorRequest>(
      null
    );

    this.translatedTextsSubject = new BehaviorSubject<AppointmentTextInterface>(this.getDefaultTexts());
    this.translatedTexts$ = this.translatedTextsSubject.asObservable();

    this.CurrentCustomerState = new BehaviorSubject<string>('');

    this.MonitorRequest$ = this.SubjectMonitorRequest.asObservable()
      .pipe(map((customers) => MapPosition(customers, this.QueuePositions)))
      .pipe(
        mergeMap((x) => {
          if (x) {
            this.estimatedWaitTime = GetEstimateWait(x);
          }
          return of(x);
        })
      );

    this.subs.add(this.MonitorRequest$.subscribe((request) => {
      if (request) {
        if (request.customerState === "SERVING" && !request.estimatedServingTimeUTCString && this.CurrentCustomerState.value === request.customerState) {
          this.CurrentCustomerState.next("SERVED");
        } else {
          this.CurrentCustomerState.next(request.customerState);
        }
        if (this.CurrentCustomerState.value !== 'SERVED') {
          this.GetDynamicVariablesReplacedFromLabel(
            this.MobileLayoutData.ticketPage.labels,
            'ticketPage',
            request.selectedLanguageId
          );
        } else {

          const showSurveyPage = this.validateSurveyPage();
          if (showSurveyPage) {
            this.GetDynamicVariablesReplacedFromLabel(
              this.MobileLayoutData.surveyPage.labels,
              'surveyPage',
              request.selectedLanguageId
            );
          } else {
            this.GetDynamicVariablesReplacedFromLabel(
              this.MobileLayoutData.thankYouPage.labels,
              'thankYouPage',
              request.selectedLanguageId
            );
          }
        }
      }
    }));
  }

  validateSurveyPage() {
    const serviceId = this.SubjectMonitorRequest.value.serviceId;
    const surveyTemplate = this.WorkFlowData?.services.find((x) => x.id == serviceId).surveyTemplate;
    const surveyQuestions = this.SubjectMonitorRequest.value.surveyQuestions;
    let surveyAnswersExist = false;
    if (surveyQuestions) {
      const surveyAnswers = surveyQuestions.filter((question) => question.answer);
      if (surveyAnswers.length) {
        surveyAnswersExist = true;
      }
    }
    if (surveyTemplate && !surveyAnswersExist) {
      return true;
    } else {
      return false;
    }

  }

  InitializeURLRequestDetails(urlRequestDetails: IUrlRequestDetails) {
    this.UrlRequestDetails = urlRequestDetails;
    this.InitializeDetails();
    this.SubscribeToAzureSignalRObservables();
  }

  SubscribeToAzureSignalRObservables() {
    this.azureSignalRService.init(this.UrlRequestDetails.kioskRequestId);
    this.azureSignalRService.MobileMonitorExecutionSubject.subscribe(
      (value: MobileMonitorRequest) => {
        this.SubjectMonitorRequest.next(value);
      }
    );
  }

  InitializeDetails() {
    this.companyId = this.UrlRequestDetails.companyId;
    this.mobileAPIService
      .GetExternalMobileTemplate(
        this.UrlRequestDetails.companyId,
        this.UrlRequestDetails.mobileInterfaceId
      )
      .subscribe((layout: IMobileLayoutData) => {
        this.MobileLayoutData = layout;
        this.InitializeQueueSignalR();
        this.GetWorkFlow().subscribe((workFlow) => {
          this.WorkFlowData = workFlow;
          if (this.CurrentCustomerState.value && this.CurrentCustomerState.value !== "SERVED") {
            this.InitializeQueueSignalR();
          }
          this.CompanyNameSubject.next(layout?.companyName);
          this.MobilePreviewDataSubject.next(this.GetInitialMobilePreviewData());
          this.mobileAPIService
            .GetMobileMonitorRequest<MobileMonitorRequest>(
              this.UrlRequestDetails.companyId,
              this.UrlRequestDetails.branchId,
              this.UrlRequestDetails.kioskRequestId
            )
            .subscribe((request) => {
              if (!request) {
                return;
              }
              this.SubjectMonitorRequest.next(request);
              if (this.CurrentCustomerState.value === "SERVED") {
                this.InitializeQueueSignalR();
              }
              this.SelectedLanguageIdSubject.next(request.selectedLanguageId);
              this.getTranslatedMultipleTexts(this.SelectedLanguageIdSubject.getValue());
            });
        });
      });
  }

  GetWorkFlow() {
    return this.workflowAPIService
      .GetExternalPublished<IMobileWorkFlowDetail>(
        this.UrlRequestDetails.companyId,
        this.MobileLayoutData.designerScreen.WorkFlowId);

  }

  GetInitialMobilePreviewData(): IMobilePreviewData {
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
        waitingTime: this.MobileLayoutData.designerScreen.waitingTime,
      },
      globalQuestionPage: null,
      servicePage: null,
      serviceQuestion: null,
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
        isVisible: this.SetDefaultBooleanValue(
          this.MobileLayoutData.footerData.isVisible
        ),
        isTextVisible: this.SetDefaultBooleanValue(
          this.MobileLayoutData.footerData.isTextVisible
        ),
        isFooterImageVisible: this.SetDefaultBooleanValue(
          this.MobileLayoutData.footerData.isFooterImageVisible
        ),
        isLogoVisible: this.SetDefaultBooleanValue(
          this.MobileLayoutData.footerData.isLogoVisible
        ),
        footerLogo: this.MobileLayoutData.footerData.footerLogo,
      },
      headerData: {
        backGroundImage: this.MobileLayoutData.headerData.backGroundImage,
        isVisible: this.MobileLayoutData.headerData.isVisible,
        verticalPadding:
          this.MobileLayoutData.headerData.verticalPadding ||
          this.DefaultPadding,
        horizontalPadding:
          this.MobileLayoutData.headerData.horizontalPadding ||
          this.DefaultPadding,
        logoPosition:
          this.MobileLayoutData.headerData.logoPosition || this.Position,
          height: this.MobileLayoutData.headerData.height || this.DefaultPadding,
      },
      surveyPage: null,
      companyName: null,
      ticketPage: null,
      languagePAge: {
        images: this.MobileLayoutData.languagePage.images,
        labels: this.MobileLayoutData.languagePage.labels,
        videos: this.MobileLayoutData.languagePage.videos,
        sliders: this.MobileLayoutData.languagePage.sliders,
        panel: this.MobileLayoutData.languagePage.panel,
        items: this.GetMappedLanguageList(),
      },
      welcomePage: null,
      noQueuePage: null,
      offlinePage: null,
    };
  }

  private SetDefaultBooleanValue(element): boolean {
    return element !== undefined ? element : true;
  }

  GetMappedLanguageList(): IMobilePreviewPanelItemsData[] {
    const list: IMobilePreviewPanelItemsData[] = [];
    return list;
  }

  UpdatePreviewData() {
    this.MobilePreviewDataSubject.next(this.MobilePreviewDataSubject.value);
  }

  GetDynamicVariablesReplacedFromLabel(Labels, pageName: string, languageId) {
    if (
      Labels?.length > 0 &&
      Labels?.some((x) => x.text[languageId]?.includes('%'))
    ) {
      const LabelTexts = [];
      Labels.forEach((label) => {
        const replacementString = this.dynamicBoldTextPipe.transform(
          label.text[languageId]
        );
        LabelTexts.push({
          id: label.name,
          replacementString,
        });
      });
      const kioskRequest = this.GenerateRequestModel();
      const documentData = {
        id: kioskRequest.id,
        pk: kioskRequest.pk,
      }
      const workflowData = {
        workFlowId: this.MobileLayoutData.designerScreen.WorkFlowId,
        pk: this.UrlRequestDetails.companyId,
      };
      this.dynamicVariablesService
        .GetDynamicVariablesReplacedStringsWithId(
          LabelTexts,
          workflowData,
          documentData
        )
        .subscribe((s: any) => {
          Labels.forEach((x) => {
            x.text[languageId] = s.find(
              (f) => f.id === x.name
            ).replacementString;
          });
          this.GetDataAsPerPage(pageName, Labels, languageId);
        });
    } else {
      this.GetDataAsPerPage(pageName, Labels, languageId);
    }
  }

  async GetDataAsPerPage(pageName: string, Labels, languageId: string) {
    if (pageName === 'ticketPage') {
      this.SetPageVisibility(MobilePageName.TicketPage);
      this.UpdatePreviewBasedOnRequest();
      this.MobilePreviewDataSubject.value.ticketPage =
        this.GetTicketPageData(Labels);
      if (this.MobileLayoutData.ticketPage.items.length > 0) {
        let item = this.MobileLayoutData.ticketPage.items.filter(x => x.type.toLowerCase() === 'estimated wait')[0];
        if (item) {
          await this.translateApiService.GetExternalTranslatedTexts(item.value, this.UrlRequestDetails.companyId).subscribe((data) => {
            let selectedLanguage = data.filter(x => x.languageId === languageId);
            if (selectedLanguage.length > 0) {
              this.MobileLayoutData.ticketPage.items.filter(x => x.type.toLowerCase() === 'estimated wait')[0].value = selectedLanguage[0].translatedText;
            }
          })
        }
      }
    } else if (pageName === 'thankYouPage') {
      this.SetPageVisibility(MobilePageName.ThankYouPage);
      this.MobilePreviewDataSubject.value.thankYouPage =
        this.GetThankYouPageData(Labels);
    } else if (pageName === 'surveyPage') {
      let serviceId = this.SubjectMonitorRequest.value.serviceId;
      let surveyTemplate = this.WorkFlowData.services.find((x) => x.id == serviceId).surveyTemplate
      if (surveyTemplate) {
        this.SetPageVisibility(MobilePageName.SurveyPage);
        this.MobilePreviewDataSubject.value.surveyPage =
          this.GetSurveyPageData(surveyTemplate.questions);
      }
    }
    else if (pageName === 'marketingPage') {
      this.MobilePreviewDataSubject.value.marketingPage = this.GetMarketingPageData();
      this.SetPageVisibility(MobilePageName.MarketingPage);
    }

    this.UpdatePreviewData();
  }

  GenerateRequestModel() {
    const MobileMonitorReq = this.SubjectMonitorRequest.value;
    return {
      designer: {
        WorkFlowId: this.MobileLayoutData.designerScreen.WorkFlowId,
      },
      preServiceQuestions: MobileMonitorReq?.preServiceQuestions,
      serviceQuestions: MobileMonitorReq?.serviceQuestions,
      branchId: this.UrlRequestDetails.branchId,
      id: MobileMonitorReq.id,
      pk: this.SubjectMonitorRequest.value.branchId,
      ticketNumber: this.SubjectMonitorRequest.value.ticketNumber,
      selectedLanguageId: this.SelectedLanguageIdSubject.value,
      requestSourceType: 'MOBILE',
      requestSourceId: '',
      companyId: this.UrlRequestDetails.companyId,
      serviceId: this.SubjectMonitorRequest.value.serviceId,
      mobileInterfaceId: this.UrlRequestDetails.mobileInterfaceId,
      queueId: this.SubjectMonitorRequest.value.queueId,
      estimatedServingTimeUTCString:
        this.SubjectMonitorRequest.value.estimatedServingTimeUTCString,
      estimatedWaitRangesSettings:
        this.SubjectMonitorRequest.value.estimatedWaitRangesSettings,
    };
  }

  MapQuestionToKioskTemplateModel(
    Questions: IMobilePreviewPanelQItemsData[]
  ): KioskExecutionPreServiceQuestionPage {
    if (Questions) {
      return {
        items: Questions.map((question) => {
          return {
            answer: question.answer,
            itemId: question.itemId,
            itemText: question.itemText,
            itemType: question.itemType,
          };
        }),
      };
    } else {
      return {
        items: [],
      };
    }
  }

  ReDirectToThankYouPage() {
    if (!this.HideThankYouPage() && this.MobileLayoutData.thankYouPage) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.MobileLayoutData.thankYouPage?.labels,
        'thankYouPage',
        this.SelectedLanguageIdSubject.value
      );
    }
    this.SetPageVisibility(MobilePageName.ThankYouPage);
    this.MobileLayoutData.thankYouPage = null;
  }

  private HideThankYouPage() {
    return this.MobileLayoutData.pageProperties
      ? this.MobileLayoutData.pageProperties.hideThankYouPage
      : false;
  }

  ReDirectToMarketingPage() {
    this.GetDynamicVariablesReplacedFromLabel(
      this.MobileLayoutData.marketingPage.labels,
      'marketingPage',
      this.SelectedLanguageIdSubject.value
    );
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
    this.GetDynamicVariablesReplacedFromLabel(
      this.MobileLayoutData.ticketPage.labels,
      'ticketPage',
      this.SelectedLanguageIdSubject.value
    );
  }

  UpdatePreviewBasedOnRequest() {
    const MonitorRequest = this.SubjectMonitorRequest.value;
    if (MonitorRequest) {
      if (MonitorRequest.isDeleted) {
        this.ReDirectToThankYouPage();
        return;
      }

      switch (MonitorRequest.customerState) {
        case CustomerState.WAITING:
          this.SetPageVisibility(MobilePageName.TicketPage);
          break;
        case CustomerState.CALLED:
          this.ReDirectToMarketingPage();
          break;
        case CustomerState.SERVING:
          this.ReDirectToMarketingPage();
          break;
        case CustomerState.SERVED:
          let serviceId = this.SubjectMonitorRequest.value.serviceId;
          let surveyTemplate = this.WorkFlowData.services.find((x) => x.id == serviceId).surveyTemplate
          if (surveyTemplate) {
            this.ReDirectToSurveyPage();
          } else {
            this.ReDirectToThankYouPage();
          }
          break;
        default:
          this.ReDirectToThankYouPage();
          break;
      }
    }
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
        horizontalPadding:
          this.MobileLayoutData.ticketPage.panel.horizontalPadding,
        left: this.MobileLayoutData.ticketPage.panel.left,
        primaryColor: this.MobileLayoutData.ticketPage.panel.primaryColor,
        secondaryColor: this.MobileLayoutData.ticketPage.panel.secondaryColor,
        top: this.MobileLayoutData.ticketPage.panel.top,
        width: this.MobileLayoutData.ticketPage.panel.width,
      },
      buttonPanel: this.GetTicketButtons(),
      items: this.GetTicketItems(),
      images: this.MobileLayoutData.ticketPage.images,
      labels: Labels,
      sliders: this.MobileLayoutData.ticketPage.sliders,
      videos: this.MobileLayoutData.ticketPage.videos,
    };
  }

  GetTicketItems(): IMobilePreviewTicketItemData[] {
    let Items: IMobilePreviewTicketItemData[] =
      this.MobileLayoutData?.ticketPage?.items;
    Items[ButtonIndexes.CalledMessage].index = ButtonIndexes.CalledMessage;
    Items[ButtonIndexes.CalledByDynamicMessageIndex].index =
      ButtonIndexes.CalledByDynamicMessageIndex;

    const MonitorRequest = this.SubjectMonitorRequest.value;
    if (MonitorRequest) {
      switch (MonitorRequest.customerState) {
        case CustomerState.WAITING:
          Items = this.SetWaitingState(Items, MonitorRequest);
          break;
        case CustomerState.CALLED:
          Items = this.SetCalledState(Items, MonitorRequest);
          break;
        case CustomerState.SERVING:
          Items = this.SetServingState(Items, MonitorRequest);
          break;
        default:
          break;
      }
    }
    return Items;
  }

  SetWaitingState(
    Items: IMobilePreviewTicketItemData[],
    MonitorRequest: MobileMonitorRequest
  ): IMobilePreviewTicketItemData[] {
    Items[ButtonIndexes.TicketNumberIndex].visible = true;
    Items[ButtonIndexes.PlaceInLine].visible = true;
    Items[ButtonIndexes.EstimatedWait].visible = true;
    Items[ButtonIndexes.CalledMessage].visible = false;
    Items[ButtonIndexes.CalledByDynamicMessageIndex].visible = false;
    Items[ButtonIndexes.TicketNumberIndex].value = MonitorRequest.ticketNumber;
    Items[ButtonIndexes.PlaceInLine].value = MonitorRequest.sortPosition;
    Items[ButtonIndexes.EstimatedWait].value = GetFormattedTime(
      this.estimatedWaitTime
    );
    return Items;
  }

  SetCalledState(
    Items: IMobilePreviewTicketItemData[],
    MonitorRequest: MobileMonitorRequest
  ): IMobilePreviewTicketItemData[] {
    Items[ButtonIndexes.TicketNumberIndex].visible = true;
    Items[ButtonIndexes.TicketNumberIndex].value = MonitorRequest.ticketNumber;

    Items[ButtonIndexes.PlaceInLine].visible = false;
    Items[ButtonIndexes.EstimatedWait].visible = false;

    Items[ButtonIndexes.CalledMessage].visible = true;
    // Items[ButtonIndexes.CalledMessage].text[MonitorRequest.selectedLanguageId] =
    //   'Your Number has been Called!';
    Items[ButtonIndexes.CalledMessage].value = CalledByDynamicMessage.split(
      'xx_AgentName_xx'
    )
      .join(MonitorRequest.AgentName)
      .split('xx_Desk_xx')
      .join(MonitorRequest.Desk);

    Items[ButtonIndexes.CalledByDynamicMessageIndex].visible = false;
    Items[ButtonIndexes.CalledByDynamicMessageIndex].value = '';

    Items[ButtonIndexes.CalledByDynamicMessageIndex].text[
      MonitorRequest.selectedLanguageId
    ] = '';

    return Items;
  }

  SetServingState(
    Items: IMobilePreviewTicketItemData[],
    MonitorRequest: MobileMonitorRequest
  ): IMobilePreviewTicketItemData[] {
    Items[ButtonIndexes.TicketNumberIndex].visible = true;
    Items[ButtonIndexes.PlaceInLine].visible = true;
    Items[ButtonIndexes.EstimatedWait].visible = true;
    Items[ButtonIndexes.CalledMessage].visible = false;
    Items[ButtonIndexes.CalledByDynamicMessageIndex].visible = false;
    Items[ButtonIndexes.TicketNumberIndex].value = MonitorRequest.ticketNumber;
    Items[ButtonIndexes.PlaceInLine].value = '-';
    Items[ButtonIndexes.EstimatedWait].value = '-';
    return Items;
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
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private RemoveRequestMoreTimeButtonIfRequeueIsNotEnabled() {
    if (!this.MobileLayoutData.enableMobileInterfaceRequeue) {
      const ticketPageButtons = this.MobileLayoutData.ticketPage.buttons;
      const requestMoreTimeButtonIdentifier = 'PrimaryButton';
      const index = ticketPageButtons.findIndex(x => x.name === requestMoreTimeButtonIdentifier);
      if (index > -1) {
        ticketPageButtons.splice(index, 1);
      }
    }
  }

  ReDirectToSurveyPage() {
    if (this.MobileLayoutData.surveyPage) {
      this.GetDynamicVariablesReplacedFromLabel(
        this.MobileLayoutData.surveyPage?.labels,
        'surveyPage',
        this.SelectedLanguageIdSubject.value
      );
    } else {
      this.ReDirectToThankYouPage()
    }
  }

  private GetSurveyQuestionButtons(buttonList: IMobileButtonData) {
    return buttonList;
  }

  private GetSurveyQuestionItems(
    questions: IMobileWorkFlowQuestionData[],
  ): IMobilePreviewPanelQItemsData[] {
    const items: IMobilePreviewPanelQItemsData[] = [];
    questions.forEach((x) => {
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
          answer: this.GetAnswerOfSurveyQuestionIfPresent(x.id),
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

  GetAnswerOfSurveyQuestionIfPresent(questionId: string): any {
    if (this.AllSurveyQuestionPages && this.AllSurveyQuestionPages.length > 0) {
      let AllAnsweredQuestions = [];
      for (const ServiceQuestionPage of this.AllSurveyQuestionPages) {
        AllAnsweredQuestions = AllAnsweredQuestions.concat(ServiceQuestionPage.items);
      }
      const question = AllAnsweredQuestions.find(x => x.itemId === questionId);
      return question?.answer;
    }
    return '';
  }

  private GetElementWithSpecificSelectedOrDefaultLanguage(element: any) {
    let current_element = element.find(
      (lang) => lang.languageId === this.SelectedLanguageIdSubject.value
    );
    // if (!current_element) {
    //   current_element = element.find(
    //     (lang) => lang.languageId === this.DefaultLanguageId
    //   );
    // }
    return current_element ? current_element : [];
  }

  async saveSurveyPageAnswersAndExitSurvey(companyId: string, branchId: string, requestId: string, items: IMobilePreviewPanelQItemsData) {

    this.mobileAPIService
      .SaveSurveyQuestionAnswers(
        companyId,
        branchId,
        requestId,
        items
      ).subscribe((result) => {
        if (result) {
          this.AppNotificationService.Notify(this.translatedTextsSubject.getValue()?.mobileMonitorSurveyPageSubmitMessage);

        } else {
          this.AppNotificationService.NotifyError(this.translatedTextsSubject.getValue()?.mobileMonitorSurveyNotSaveMessage);
        }
        return this.ExitSurveyPage();
      });
  }

  async ExitSurveyPage() {
    this.ReDirectToThankYouPage()
  }

  private GetSurveyPageData(
    questions: IMobileWorkFlowQuestionData[]
  ): IMobilePreviewSurveyPageData {
    return {
      images: this.MobileLayoutData.surveyPage.images,
      labels: this.MobileLayoutData.surveyPage.labels,
      panel: this.MobileLayoutData.surveyPage.panel,
      videos: this.MobileLayoutData.surveyPage.videos,
      sliders: this.MobileLayoutData.surveyPage.sliders,
      button: this.GetSurveyQuestionButtons(
        this.MobileLayoutData.serviceQuestion.button
      ),
      items: this.GetSurveyQuestionItems(
        questions
      ),
    };
  }

  private GetThankYouPageData(Labels): IMobilePreviewThankYouPageData {
    return {
      images: this.MobileLayoutData.thankYouPage.images,
      labels: Labels,
      sliders: this.MobileLayoutData.thankYouPage.sliders,
      videos: this.MobileLayoutData.thankYouPage.videos,
    };
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
  /* #end region */

  TicketPageButtonClicked(button: IMobilePreviewButtonData) {

    if (button) {
      switch (button.name) {
        case TicketPageButtonName.Cancel:
          this.CancelTicket();
          break;
        case TicketPageButtonName.RunningLate:
          this.RunningLate();
          break;
      }
    }
  }

  RunningLate() {
    const requireMoreTime = confirm(this.translatedTextsSubject.getValue()?.mobileMonitorAskMoreTime);
    if (!requireMoreTime) {
      return null;
    }
    const Request = this.SubjectMonitorRequest.getValue();
    this.agentAPIService
      .RunningLateMobileExternal<PostMobileExecution, MobileMonitorRequest>(
        Request.companyId,
        {
          requestId: Request.id,
          branchId: Request.branchId,
          companyId: Request.companyId,
        }
      )
      .subscribe((request) => {
        if (request) {
          this.SubjectMonitorRequest.next(request['Customer']);
          this.AppNotificationService.Notify(this.translatedTextsSubject.getValue()?.mobileMonitorRequeueMessage);
        }
      });
  }

  CancelTicket() {
    const wantToLeave = confirm(this.translatedTextsSubject.getValue()?.mobileMonitorLeaveQueue);
    if (!wantToLeave) {
      return null;
    }
    const Request = this.SubjectMonitorRequest.getValue();
    this.agentAPIService
      .DeleteQueuedCustomersExternal<
        PostMobileExecution,
        MobileExecutionDeleteResponse
      >(Request.companyId, {
        requestId: Request.id,
        branchId: Request.branchId,
        companyId: Request.companyId,
      })
      .subscribe((response) => {
        if (response.isDeleted) {
          this.AppNotificationService.Notify(
            this.translatedTextsSubject.getValue()?.mobileMonitorRemoveFromQueueMessage
          );
        }
      });
  }

  getTranslatedMultipleTexts(languageId: string): any {
    if (languageId && languageId !== 'en' && this.companyId) {
      this.translateApiService.TranslateMultipleTexts(this.getMultipleTextTranslateBody(), languageId, this.companyId, false).subscribe((response: AppointmentTextInterface) => {
        this.translatedTextsSubject.next(response)
      });
    } else {
      this.translatedTextsSubject.next(this.getDefaultTexts())
    }

  }

  getDefaultTexts(): AppointmentTextInterface {
    return {
      [AppointmentTextTypeEnum.mobileMonitorAskMoreTimeType]: AppointmentTextEnum.mobileMonitorAskMoreTimeText,
      [AppointmentTextTypeEnum.mobileMonitorLeaveQueueType]: AppointmentTextEnum.mobileMonitorLeaveQueueText,
      [AppointmentTextTypeEnum.mobileMonitorRequeueMessageType]: AppointmentTextEnum.mobileMonitorRequeueMessageText,
      [AppointmentTextTypeEnum.mobileMonitorRemoveFromQueueMessageType]: AppointmentTextEnum.mobileMonitorRemoveFromQueueMessageText,
      [AppointmentTextTypeEnum.mobileMonitorSurveyPageSubmitMessageType]: AppointmentTextEnum.mobileMonitorSurveyPageSubmitMessageText,
      [AppointmentTextTypeEnum.mobileMonitorSurveyNotSaveMessageType]: AppointmentTextEnum.mobileMonitorSurveyNotSaveMessageText,
    };
  }

  getMultipleTextTranslateBody(): Array<object> {
    const translatedTextBody = [
      {
        text: AppointmentTextEnum.mobileMonitorAskMoreTimeText,
        type: AppointmentTextTypeEnum.mobileMonitorAskMoreTimeType,
      },
      {
        text: AppointmentTextEnum.mobileMonitorLeaveQueueText,
        type: AppointmentTextTypeEnum.mobileMonitorLeaveQueueType,
      },
      {
        text: AppointmentTextEnum.mobileMonitorRequeueMessageText,
        type: AppointmentTextTypeEnum.mobileMonitorRequeueMessageType,
      },
      {
        text: AppointmentTextEnum.mobileMonitorRemoveFromQueueMessageText,
        type: AppointmentTextTypeEnum.mobileMonitorRemoveFromQueueMessageType,
      },
      {
        text: AppointmentTextEnum.mobileMonitorSurveyPageSubmitMessageText,
        type: AppointmentTextTypeEnum.mobileMonitorSurveyPageSubmitMessageType,
      },
      {
        text: AppointmentTextEnum.mobileMonitorSurveyNotSaveMessageText,
        type: AppointmentTextTypeEnum.mobileMonitorSurveyNotSaveMessageType,
      },

    ];
    return translatedTextBody;

  }
}

const TicketPageButtonName = {
  Cancel: 'SecondaryButton',
  RunningLate: 'PrimaryButton',
};

const CalledByDynamicMessage =
  'Please proceed to xx_AgentName_xx at xx_Desk_xx.';

export function GetFormattedTime(estimatedWaitTime: EstimateWaitTime): string {
  if (estimatedWaitTime) {
    return `${estimatedWaitTime.hours ? estimatedWaitTime.hours + ' hours ' : ''
      }${estimatedWaitTime.minutes} minutes`;
  } else {
    return '-';
  }
}

export function GetEstimateWait(x: {
  estimatedServingTimeUTCString: string;
  estimatedWaitRangesSettings: WorkflowEstimateWaitSettings;
}): EstimateWaitTime {
  const CurrentTime = new Date().getTime();
  if (x?.estimatedWaitRangesSettings?.allowCalculateEstimateWaitTime) {
    const defaultRange = parseInteger(
      x?.estimatedWaitRangesSettings.defaultRange
    );

    let WaitTime =
      new Date(x.estimatedServingTimeUTCString).getTime() - CurrentTime;
    WaitTime = WaitTime < 0 ? 0 : WaitTime;

    let WaitTimeMin = parseInteger(WaitTime / 1000 / 60);

    if (!(WaitTimeMin % defaultRange == 0)) {
      WaitTimeMin = WaitTimeMin + defaultRange - (WaitTimeMin % defaultRange);
    }

    return ConvertToEstimateWait(WaitTimeMin);
  }
}

export function ConvertToEstimateWait(WaitTimeMin: number): EstimateWaitTime {
  if (WaitTimeMin) {
    return {
      hours: parseInteger(WaitTimeMin / 60),
      minutes: parseInteger(WaitTimeMin % 60),
      seconds: 0,
    };
  } else {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
}

function UpdateSubject<T>(subject: BehaviorSubject<T>) {
  const oldValue = subject.getValue();
  subject.next(cloneObject(oldValue));
}

function MapPosition(
  customer: any,
  QueuePositions: IQueue
): MobileMonitorRequest {
  if (
    QueuePositions &&
    QueuePositions.customers &&
    QueuePositions.customers.length > 0 &&
    customer
  ) {
    customer = customer.Customer ? customer.Customer : customer;
    const index = QueuePositions.customers.findIndex((y) => y.id == customer.id);
    let sortPosition = index;

    if (index >= 0) {
      const queueId = QueuePositions.customers[index]?.queueId;
      if (queueId) {
        sortPosition = QueuePositions.customers.filter((y) => y?.queueId == queueId).findIndex((y) => y?.id == customer?.id);
        if (sortPosition < 0) {
          sortPosition = index;
        }
      }
    }

    customer.sortPosition = (sortPosition + 1).toString();
    customer.estimatedServingTimeUTCString = index > 0 ?
      QueuePositions.customers[index]?.estimateWaitTimeISOString : customer.estimatedServingTimeUTCString;

  }

  return customer;
}
