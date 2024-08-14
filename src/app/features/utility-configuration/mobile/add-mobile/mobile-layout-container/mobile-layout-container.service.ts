import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { MobileExecution } from 'src/app/models/constants/mobile-constants';
import { MobilePageName } from 'src/app/models/enums/mobile-page-name.enum';
import { TicketItem } from 'src/app/models/enums/ticket-items.enum';
import { DynamicVariableService } from '../../../../../core/services/dynamic-variables.service';
import { getTimeStampSplitedFileName } from '../../../../../core/utilities/core-utilities';
import { IDynamicVariable } from '../../../../../models/common/dynamic-variable.interface';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';
import { Language } from '../../../../../models/enums/language-enum';
import { MobileAPIService } from '../../../../../shared/api-services/mobile-api.service';
import { IWorkFlowServiceData } from '../../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { ISliderControlPostPreview } from '../../../kiosk/kiosk-add/kiosk-layout/Models/slider-control-preview.interface';
import { MobileListService } from '../../list-mobiles/list-mobiles.service';
import { ButtonControl } from '../../models/controls/button.control';
import { Control } from '../../models/controls/control';
import { DesignerPanelControl } from '../../models/controls/designer-panel.control';
import { FooterControl } from '../../models/controls/footer.control';
import { HeaderControl } from '../../models/controls/header.control';
import { ImageControl } from '../../models/controls/image.control';
import { ItemsControl } from '../../models/controls/items.control';
import { LabelControl } from '../../models/controls/label.control';
import { PageProperties } from '../../models/controls/page-properties';
import { PanelControl } from '../../models/controls/panel.control';
import { SliderControl } from '../../models/controls/slider.control';
import { Styles } from '../../models/controls/styles';
import { TicketControl } from '../../models/controls/ticket-control';
import { TicketItemControl } from '../../models/controls/ticket-item-control';
import { VideoControl } from '../../models/controls/video.control';
import { ICurrentLanguage } from '../../models/current-language.interface';
import { IMobileMoveEndControlEvent } from '../../models/mobile-control-move-end-event.interface';
import { IMobileResizeControlEvent } from '../../models/mobile-control-resize-event.interface';
import { IMobileDropdown } from '../../models/mobile-drop-down-Item';
import { IGlobalQuestionPageData } from '../../models/mobile-global-question-page-data.interface';
import { ILanguagePageData } from '../../models/mobile-language-page-data.interface';
import {
  IMobileButtonData,
  IMobileFooterData,
  IMobileHeaderData,
  IMobileImageControlData,
  IMobileLabelControlData,
  IMobileLayoutData,
  IMobilePanelItemsData,
  IMobileQuestionSetData,
  IMobileSliderControlData,
  IMobileTicketControlItemData,
  IMobileVideoControlData
} from '../../models/mobile-layout-data.interface';
import { IMarketingPageData } from '../../models/mobile-marketing-page-data.interface';
import { IMobileMoveEvent } from '../../models/mobile-move-event.interface';
import { INoQueuePageData } from '../../models/mobile-no-queue-page-data.interface';
import { IMobileOtherControls } from '../../models/mobile-other-controls.interface';
import { IMobileData } from '../../models/mobile-page-data.interface';
import { IServicePageData } from '../../models/mobile-service-page-data.interface';
import { IServiceQuestionPageData } from '../../models/mobile-service-question-page-data.interface';
import { IMobileSliderControlPostPreview } from '../../models/mobile-slider-control-preview.interface';
import { IMobileSupportedLanguage } from '../../models/mobile-supported-language.interface';
import { ISurveyPageData } from '../../models/mobile-survey-page-data.interface';
import { IThankYouPageData } from '../../models/mobile-thank-you-page-data.interface';
import { ITicketPageData } from '../../models/mobile-ticket-page-data.interface';
import { IWelcomePageData } from '../../models/mobile-welcome-page-data.interface';
import { MobileOtherControlsCountDetail } from '../../models/mobile-other-controls-count-details.interface';
import {
  IMobileWorkFlowDetail,
  IMobileWorkFlowQuestionData,
  IMobileWorkFlowServiceQuestionData,
  IMobileWorkFlowSurveyQuestionData
} from '../../models/mobile-work-flow-detail.interface';
import { IOtherControlDDL } from '../../models/other-control-drop-down.interface';
import { IMobilePageDetails } from '../../models/pages.interface';
import { AddMobileService } from '../add-mobile.service';
import { IOffLinePage } from '../../models/off-line-page.interface';
import {
  DocumentType,
  VariablePurpose,
  VariableRequestDocument
} from 'src/app/models/enums/variables-related';


@Injectable()
export class MobileLayoutContainerService extends AbstractComponentService {
  MobileInterfaceData: IMobileData;
  WorkFlowData: IMobileWorkFlowDetail;
  DefaultLanguageCode = Language.English;
  GeneralFontStyles: Styles;
  DefaultControlFontStyles: Styles;
  DefaultButtonControlFontStyles: Styles;

  PageList$: Observable<IMobileDropdown[]>;
  private PageListSubject: BehaviorSubject<IMobileDropdown[]>;

  CurrentPage$: Observable<IMobilePageDetails>;
  private CurrentPageSubject: BehaviorSubject<IMobilePageDetails>;

  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  private LanguageListSubject: BehaviorSubject<IMobileSupportedLanguage[]>;

  private SelectedLanguageSubject: BehaviorSubject<ICurrentLanguage>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  DesignerPanel$: Observable<DesignerPanelControl>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;

  PageProperties$: Observable<PageProperties>;
  private PagePropertiesSubject: BehaviorSubject<PageProperties>;

  FooterControl$: Observable<FooterControl>;
  private FooterControlSubject: BehaviorSubject<FooterControl>;

  HeaderControl$: Observable<HeaderControl>;
  private HeaderControlSubject: BehaviorSubject<HeaderControl>;

  WelcomePageData$: Observable<IWelcomePageData>;
  private WelcomePageDataSubject: BehaviorSubject<IWelcomePageData>;

  LanguagePageData$: Observable<ILanguagePageData>;
  private LanguagePageDataSubject: BehaviorSubject<ILanguagePageData>;

  GlobalQuestionPageData$: Observable<IGlobalQuestionPageData>;
  private GlobalQuestionPageDataSubject: BehaviorSubject<IGlobalQuestionPageData>;

  ServicePageData$: Observable<IServicePageData>;
  private ServicePageDataSubject: BehaviorSubject<IServicePageData>;

  ServiceQuestionPageData$: Observable<IServiceQuestionPageData>;
  private ServiceQuestionPageDataSubject: BehaviorSubject<IServiceQuestionPageData>;

  TicketPageData$: Observable<ITicketPageData>;
  private TicketPageDataSubject: BehaviorSubject<ITicketPageData>;

  ThankYouPageData$: Observable<IThankYouPageData>;
  private ThankYouPageDataSubject: BehaviorSubject<IThankYouPageData>;

  NoQueuePageData$: Observable<INoQueuePageData>;
  private NoQueuePageDataSubject: BehaviorSubject<INoQueuePageData>;

  MarketingPageData$: Observable<IMarketingPageData>;
  private MarketingPageDataSubject: BehaviorSubject<IMarketingPageData>;

  SurveyPageData$: Observable<ISurveyPageData>;
  private SurveyPageDataSubject: BehaviorSubject<ISurveyPageData>;

  DynamicVariables$: Observable<IDynamicVariable[]>;
  private DynamicVariablesSubject: BehaviorSubject<IDynamicVariable[]>;

  private OffLinePageDataSubject: BehaviorSubject<IOffLinePage>;
  OffLinePage$: Observable<IOffLinePage>;

  // IsOnlyGrid$: Observable<boolean>;
  // GridSize$: Observable<number>;

  isValidLayoutData = true;
  SaveMobileAsDraft = 'saveAsDraft';
  SaveMobile = 'save';
  VerticalPadding = '15';
  HorizontalPadding = '20';
  QuestionColor = '#ffffff';
  ServiceQuestionItems = [];
  SurveyQuestionItems = []
  ContinueButtonName = 'Continue Button';
  StartButtonName = 'Start Button';
  AppointmentButtonName = 'Appointment Button';
  ContinueButtonText = { en: 'Continue' };
  AppointmentButtonText = { en: 'Appointment' };
  FooterImage = '../../../../../../assets/back-button.png';
  FooterLogo = '../../../../../../assets/img/QtracVR-Logo-only-TM-grey.png';
  Alignment = 'center';
  ExitButtonName = 'Exit Button';
  FooterData = this.GetFooterDefaultData();
  BackButtonName = 'Back Button';
  BackButtonText = { en: 'Back' };

  ButtonStyles = {
    border: '2',
    borderColor: '#6fb557',
    shadow: false,
  };

  TicketItemStyles = {
    height: 80,
    width: 250,
  };

  BackgroundColor = 'rgba(0, 0, 0, 0)';

  OtherControlCountData: {
    totalImageCount: 0;
    totalLabelCount: 0;
    totalSliderCount: 0;
    totalVideoCount: 0;
  };

  constructor(
    private addMobileService: AddMobileService,
    private readonly mobileAPIService: MobileAPIService,
    private dynamicVariablesService: DynamicVariableService,
    private mobileListService: MobileListService
  ) {
    super();
    this.InitializeDefaultData();
    this.InitializeSubjects();
    this.SubscribeLanguagesObservables();
  }
  SubscribeLanguagesObservables() {
    this.subs.sink = this.addMobileService.LanguageList$.subscribe((x) => {
      this.LanguageListSubject.next(x);
      if (x.length > 0) {
        const data: ICurrentLanguage = {
          defaultLanguage: x.find((x) => x.isDefault).languageCode,
          selectedLanguage: x.find((x) => x.isDefault).languageCode,
        };
        this.SendNextLanguageSubject(data);
      }
      this.SetCurrentModeData();
    });
  }
  SetCurrentModeData() {
    if (this.IsMobileTemplateIdExistInSession()) {
      this.SetEditModeData();
    } else {
      this.SetAddModeData();
    }
  }
  SetAddModeData() {
    this.SubscribeObservables();
    this.CreateAndSetItemsToServicePanel(
      this.DefaultControlFontStyles.height,
      this.DefaultControlFontStyles.top,
      this.DefaultControlFontStyles.backgroundColor,
      this.DefaultControlFontStyles.color,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      '0',
      '10',
      false,
      [],
      this.WorkFlowData.services?.filter(x => !x.isDeleted),
      [],
      false
    );

    this.CreateAndSetItemsToWelcomePage(
      this.DefaultButtonControlFontStyles.backgroundColor,
      this.DefaultButtonControlFontStyles.color,
      this.DefaultButtonControlFontStyles.font,
      this.DefaultButtonControlFontStyles.fontStyle,
      this.DefaultButtonControlFontStyles.fontSize,
      this.DefaultButtonControlFontStyles.fontWeight,
      this.DefaultButtonControlFontStyles.boxRoundCorners,
      { en: 'Start' },
      82,
      200,
      false,
      [],
      this.ButtonStyles.border,
      this.ButtonStyles.borderColor,
      this.ButtonStyles.shadow
    );
    this.CreateAndSetItemsToLanguagePage(
      this.DefaultControlFontStyles.height,
      this.DefaultControlFontStyles.top,
      this.DefaultControlFontStyles.backgroundColor,
      this.DefaultControlFontStyles.color,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      '0',
      '10'
    );
    this.CreateAndSetItemsToTicketPage(
      225,
      80,
      this.DefaultControlFontStyles.backgroundColor,
      this.DefaultControlFontStyles.color,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      '0',
      '10'
    );
    this.CreateAndSetItemsToServiceQuestionPanel(
      -1,
      this.DefaultControlFontStyles.top,
      this.DefaultControlFontStyles.backgroundColor,
      this.QuestionColor,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      this.DefaultButtonControlFontStyles.backgroundColor,
      this.DefaultButtonControlFontStyles.color,
      this.DefaultButtonControlFontStyles.font,
      this.DefaultButtonControlFontStyles.fontStyle,
      this.DefaultButtonControlFontStyles.fontSize,
      this.DefaultButtonControlFontStyles.fontWeight,
      this.DefaultButtonControlFontStyles.boxRoundCorners,
      { en: 'Continue' },
      200,
      '15',
      '20',
      82,
      false,
      false,
      [],
      [],
      { en: 'Submit' },
      '10',
      '0',
      this.WorkFlowData.questionSets?.filter(x => !x.isDeleted),
      this.ButtonStyles.border,
      this.ButtonStyles.borderColor,
      this.ButtonStyles.shadow
    );
    this.CreateAndSetItemsToSurveyQuestionPanel(
      -1,
      this.DefaultControlFontStyles.top,
      this.DefaultControlFontStyles.backgroundColor,
      this.QuestionColor,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      this.DefaultButtonControlFontStyles.backgroundColor,
      this.DefaultButtonControlFontStyles.color,
      this.DefaultButtonControlFontStyles.font,
      this.DefaultButtonControlFontStyles.fontStyle,
      this.DefaultButtonControlFontStyles.fontSize,
      this.DefaultButtonControlFontStyles.fontWeight,
      this.DefaultButtonControlFontStyles.boxRoundCorners,
      { en: 'Exit' },
      200,
      '15',
      '20',
      82,
      false,
      false,
      [],
      [],
      { en: 'Submit' },
      '10',
      '0',
      this.WorkFlowData.surveyQuestions?.filter(x => !x.isDeleted),
      this.ButtonStyles.border,
      this.ButtonStyles.borderColor,
      this.ButtonStyles.shadow
    );
    this.CreateAndSetItemsToNowServing();
    this.CreateAndSetItemsToThankYouPage();
    this.CreateAndSetItemsNoQueuePage([]);
    this.CreateItemsOfOffLinePage([]);
    this.CreateAndSetItemsToGlobalQuestionPanel(
      this.DefaultControlFontStyles.height,
      this.DefaultControlFontStyles.top,
      this.DefaultControlFontStyles.backgroundColor,
      this.QuestionColor,
      this.DefaultControlFontStyles.font,
      this.DefaultControlFontStyles.fontStyle,
      this.DefaultControlFontStyles.fontSize,
      this.DefaultControlFontStyles.fontWeight,
      this.DefaultControlFontStyles.boxRoundCorners,
      this.DefaultButtonControlFontStyles.backgroundColor,
      this.DefaultButtonControlFontStyles.color,
      this.DefaultButtonControlFontStyles.font,
      this.DefaultButtonControlFontStyles.fontStyle,
      this.DefaultButtonControlFontStyles.fontSize,
      this.DefaultButtonControlFontStyles.fontWeight,
      this.DefaultButtonControlFontStyles.boxRoundCorners,
      { en: 'Continue' },
      '10',
      '0',
      this.WorkFlowData.preServiceQuestions?.filter(x => !x.isDeleted),
      []
    );

  }

  private CreateItemsOfOffLinePage(buttons) {
    this.AddButtonPanelItemsToOffLinePage(buttons);
    this.UpdateValuesOfOfflinePageSubject()
  }

  private CreateAndSetItemsToNowServing() {
    const NowServingLabel = this.CreateDefaultLabelControl(
      'Now Serving',
      { en: 'Now Serving' },
      200,
      'center'
    );
    this.MobileInterfaceData.marketingPageData.labels =
      new Array<LabelControl>();
    this.MobileInterfaceData.marketingPageData.labels.push(NowServingLabel);
    this.AddControlToOtherControlList(NowServingLabel, 'marketingPageData');
  }

  private CreateAndSetItemsToThankYouPage() {
    const ThankYouLabel = this.CreateDefaultLabelControl(
      'Thank You',
      { en: 'Thank You' },
      200,
      'center'
    );
    this.MobileInterfaceData.thankYouPageData.labels =
      new Array<LabelControl>();
    this.MobileInterfaceData.thankYouPageData.labels.push(ThankYouLabel);
    this.AddControlToOtherControlList(ThankYouLabel, 'thankYouPageData');
  }

  private CreateAndSetItemsNoQueuePage(buttons: IMobileButtonData[]) {
    this.AddButtonPanelItemsToNoQueuePage(buttons);
    this.UpdateValuesOfNoQueuePageSubject();
  }

  private AddButtonPanelItemsToNoQueuePage(buttons: IMobileButtonData[]) {
    this.MobileInterfaceData.noQueuePageData.buttons =
      new Array<ButtonControl>();
    this.MobileInterfaceData.noQueuePageData.buttons.push(
      this.CreateButtonControl(
        'PrimaryButton',
        (buttons && buttons[0]?.text) || { en: 'Exit' },
        (buttons && buttons[0]?.color) || '#ffffff',
        (buttons && buttons[0]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[0]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[0]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) || 'bold',
        (buttons && buttons[0]?.backgroundColor) || '#6fb557',
        (buttons && buttons[0]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[0]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[0]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[0]?.height) || 82,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[0]?.top) || 300,
        true,
        (buttons && buttons[0]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[0]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[0]?.primaryButtonSrc) || [],
        (buttons && buttons[0]?.secondaryButtonSrc) || [],
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || '#6fb557',
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow,
        null,
      )
    );
  }

  private AddButtonPanelItemsToOffLinePage(buttons: IMobileButtonData[]) {
    this.MobileInterfaceData.offLinePageData.buttons = new Array<ButtonControl>();
    this.MobileInterfaceData.offLinePageData.buttons.push(
      this.CreateButtonControl(
        'PrimaryButton',
        (buttons && buttons[0]?.text) || { en: 'Exit' },
        (buttons && buttons[0]?.color) || '#ffffff',
        (buttons && buttons[0]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[0]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[0]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) || 'bold',
        (buttons && buttons[0]?.backgroundColor) || '#6fb557',
        (buttons && buttons[0]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[0]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[0]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[0]?.height) || 82,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[0]?.top) || 300,
        true,
        (buttons && buttons[0]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[0]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[0]?.primaryButtonSrc) || [],
        (buttons && buttons[0]?.secondaryButtonSrc) || [],
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || '#6fb557',
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow,
        null,
      )
    );
  }

  private AddControlToOtherControlList(
    NowServingLabel: LabelControl,
    pageName: string
  ) {
    this.MobileInterfaceData[pageName].otherControlList =
      new Array<IOtherControlDDL>();
    this.MobileInterfaceData[pageName].otherControlList.push({
      control: NowServingLabel,
      isImageControl: false,
      isLabelControl: true,
      isSliderControl: false,
      isVideoControl: false,
      showPropertyWindow: true,
    });
  }

  SetEditModeData() {
    this.subs.sink = this.addMobileService.WorkFlow$.subscribe((workflow) => {
      this.WorkFlowData = workflow;
      if (workflow) {
        this.dynamicVariablesService
          .GetDynamicVariables(workflow)
          .subscribe((allVariables) => {
            this.GetVariables(allVariables);
          });
      }
    });
    this.subs.sink = this.addMobileService.MobileInterface$.subscribe(
      (data) => {
        if (data) {
          this.MapOtherControlsCountOfAllPages(data);
          this.CreateAndSetItemsToLanguagePage(
            data.languagePage.panel.height,
            data.languagePage.panel.top,
            data.languagePage.panel.backgroundColor,
            data.languagePage.panel.primaryColor,
            data.languagePage.panel.font,
            data.languagePage.panel.fontStyle,
            data.languagePage.panel.fontSize,
            this.GetDefaultFontWeight(data.languagePage.panel.fontWeight),
            data.languagePage.panel.boxCorner,
            data.languagePage.panel.horizontalPadding,
            data.languagePage.panel.verticalPadding
          );
          this.AddEditableDataToDesignerPanel(data);
          this.AddPagePropertiesEditableData(data);
          this.AddHeaderEditableData(data);
          this.AddFooterEditableData(data);
          this.AddImagesInAllPagesOnEdit(data);
          this.AddVideosInAllPagesOnEdit(data);
          this.AddLabelsInAllPagesOnEdit(data);
          this.AddSlidersInAllPagesOnEdit(data);
          this.UpdateValuesOfMarketingPageSubject();
          this.CreateItemsOfOffLinePage(data?.offLinePage?.buttons || []);
          this.CreateAndSetItemsToServicePanel(
            data.servicePage.panel.height,
            data.servicePage.panel.top,
            data.servicePage.panel.backgroundColor,
            data.servicePage.panel.primaryColor,
            data.servicePage.panel.font,
            data.servicePage.panel.fontStyle,
            data.servicePage.panel.fontSize,
            this.GetDefaultFontWeight(data.servicePage.panel.fontWeight),
            data.servicePage.panel.boxCorner,
            data.servicePage.panel.horizontalPadding,
            data.servicePage.panel.verticalPadding,
            true,
            data.servicePage.items,
            this.WorkFlowData.services?.filter(x => !x.isDeleted),
            data.servicePage.buttons,
            data.servicePage.panel.showServiceIcons
          );
          this.CreateAndSetItemsToServiceQuestionPanel(
            -1,
            data.serviceQuestion.panel.top,
            data.serviceQuestion.panel.backgroundColor,
            data.serviceQuestion.panel.primaryColor,
            data.serviceQuestion.panel.font,
            data.serviceQuestion.panel.fontStyle,
            data.serviceQuestion.panel.fontSize,
            this.GetDefaultFontWeight(data.serviceQuestion.panel.fontWeight),
            data.serviceQuestion.panel.boxCorner,
            data.serviceQuestion.button?.backgroundColor,
            data.serviceQuestion.button?.color,
            data.serviceQuestion.button?.font,
            data.serviceQuestion.button?.fontStyle,
            data.serviceQuestion.button?.fontSize,
            this.GetDefaultFontWeight(data.serviceQuestion.button?.fontWeight),
            data.serviceQuestion.button?.boxCorner,
            data.serviceQuestion.button?.text || { en: 'Continue' },
            data.serviceQuestion.button?.top,
            data.serviceQuestion.button?.verticalPadding,
            data.serviceQuestion.button?.horizontalPadding,
            data.serviceQuestion.button?.height,
            Boolean(data.serviceQuestion.button?.showPrimaryButtonIcon),
            Boolean(data.serviceQuestion.button?.showSecondaryButtonIcon),
            data.serviceQuestion.button?.primaryButtonSrc,
            data.serviceQuestion.button?.secondaryButtonSrc,
            data.serviceQuestion.button?.secondaryButtonText || { en: 'Submit' },
            data.serviceQuestion.panel?.verticalPadding,
            data.serviceQuestion.panel?.horizontalPadding,
            this.WorkFlowData.questionSets?.filter(x => !x.isDeleted),
            data.serviceQuestion.button?.border,
            data.serviceQuestion.button?.borderColor,
            data.serviceQuestion.button?.shadow
          );
          this.CreateAndSetItemsToSurveyQuestionPanel(
            -1,
            data.surveyPage?.panel?.top || 74,
            data.surveyPage?.panel?.backgroundColor || '#ffffff',
            data.surveyPage?.panel?.primaryColor || '#ffffff',
            data.surveyPage?.panel?.font || 'Arial',
            data.surveyPage?.panel?.fontStyle || 'Normal',
            data.surveyPage?.panel?.fontSize || 13,
            this.GetDefaultFontWeight(data.surveyPage?.panel?.fontWeight),
            data.surveyPage?.panel?.boxCorner || '10',
            data.surveyPage?.button?.backgroundColor || "#8d8254",
            data.surveyPage?.button?.color || "#ffffff",
            data.surveyPage?.button?.font || "Arial",
            data.surveyPage?.button?.fontStyle || "Normal",
            data.surveyPage?.button?.fontSize || 13,
            this.GetDefaultFontWeight(data.surveyPage?.button?.fontWeight),
            data.surveyPage?.button?.boxCorner || '10',
            data.surveyPage?.button?.text || { en: 'Exit' },
            data.surveyPage?.button?.top,
            data.surveyPage?.button?.verticalPadding || '15',
            data.surveyPage?.button?.horizontalPadding || '20',
            data.surveyPage?.button?.height || 82,
            Boolean(data.surveyPage?.button?.showPrimaryButtonIcon) || false,
            Boolean(data.surveyPage?.button?.showSecondaryButtonIcon) || false,
            data.surveyPage?.button?.primaryButtonSrc || [],
            data.surveyPage?.button?.secondaryButtonSrc || [],
            data.surveyPage?.button?.secondaryButtonText || { en: 'Submit' },
            data.surveyPage?.panel?.verticalPadding || '10',
            data.surveyPage?.panel?.horizontalPadding || '0',
            this.WorkFlowData.surveyQuestions?.filter(x => !x.isDeleted),
            data.surveyPage?.button?.border || '2',
            data.surveyPage?.button?.borderColor || "#0b0f09",
            data.surveyPage?.button?.shadow || false
          );
   
          this.CreateAndSetItemsToTicketPage(
            data.ticketPage.panel?.height,
            data.ticketPage.panel?.top,
            data.ticketPage.panel?.backgroundColor,
            data.ticketPage.panel?.secondaryColor,
            data.ticketPage.panel?.font,
            data.ticketPage.panel?.fontStyle,
            data.ticketPage.panel?.fontSize,
            this.GetDefaultFontWeight(data.ticketPage.panel?.fontWeight),
            data.ticketPage.panel?.boxCorner,
            data.ticketPage.panel?.horizontalPadding,
            data.ticketPage.panel?.verticalPadding,
            data.ticketPage.buttons,
            data.ticketPage.items
          );
          this.CreateAndSetItemsToWelcomePage(
            data.welcomePage?.button?.backgroundColor,
            data.welcomePage?.button?.color,
            data.welcomePage?.button?.font,
            data.welcomePage?.button?.fontStyle,
            data.welcomePage?.button?.fontSize,
            this.GetDefaultFontWeight(data.welcomePage?.button?.fontWeight),
            data.welcomePage?.button?.boxCorner,
            data.welcomePage?.button?.text,
            data.welcomePage?.button.height,
            data.welcomePage?.button?.top,
            Boolean(data.welcomePage?.button?.showPrimaryButtonIcon),
            data.welcomePage?.button?.primaryButtonSrc,
            data.welcomePage?.button?.border,
            data.welcomePage?.button?.borderColor,
            data.welcomePage?.button?.shadow
          );
          this.CreateAndSetItemsNoQueuePage(
            data?.noQueuePage?.buttons || []
          )
          this.CreateAndSetItemsToGlobalQuestionPanel(
            data.globalQuestionPage.panel?.height ||
            this.DefaultControlFontStyles.height,
            data.globalQuestionPage.panel?.top ||
            this.DefaultControlFontStyles.top,
            data.globalQuestionPage.panel?.backgroundColor ||
            this.DefaultControlFontStyles.backgroundColor,
            data.globalQuestionPage.panel?.primaryColor || this.QuestionColor,
            data.globalQuestionPage.panel?.font ||
            this.DefaultControlFontStyles.font,
            data.globalQuestionPage.panel?.fontStyle ||
            this.DefaultControlFontStyles.fontStyle,
            data.globalQuestionPage.panel?.fontSize ||
            this.DefaultControlFontStyles.fontSize,
            this.GetDefaultFontWeight(
              data.globalQuestionPage.panel?.fontWeight
            ) || this.DefaultControlFontStyles.fontWeight,
            data.globalQuestionPage.panel?.boxCorner ||
            this.DefaultControlFontStyles.boxRoundCorners,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.backgroundColor) ||
            this.DefaultButtonControlFontStyles.backgroundColor,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.color) ||
            this.DefaultButtonControlFontStyles.color,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.font) ||
            this.DefaultButtonControlFontStyles.font,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.fontStyle) ||
            this.DefaultButtonControlFontStyles.fontStyle,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.fontSize) ||
            this.DefaultButtonControlFontStyles.fontSize,
            this.GetDefaultFontWeight(
              data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.fontWeight
            ) || this.DefaultButtonControlFontStyles.fontWeight,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.boxCorner) ||
            this.DefaultButtonControlFontStyles.boxRoundCorners,
            (data.globalQuestionPage?.buttons &&
              data.globalQuestionPage?.buttons[0]?.text) || {
              en: 'Continue',
            },
            data.globalQuestionPage.panel?.horizontalPadding,
            data.globalQuestionPage.panel?.verticalPadding,
            this.WorkFlowData.preServiceQuestions?.filter(x => !x.isDeleted),
            data.globalQuestionPage.buttons
          );
          this.UpdateExistingData();
          this.UpdateValuesOfLanguagePageSubject();
        }
      }
    );
  }

  private GetVariables(allVariables: IDynamicVariable[]) {
    if (allVariables && Array.isArray(allVariables)) {
      const DynamicVariables = [];
      allVariables.forEach((variables: any) => {
        DynamicVariables.push({
          data_type: variables.data_type,
          id: variables.id,
          shortName: variables.friendlyName,
          type: variables.type,
          fieldName: variables.shortName,
        });
      });
      this.DynamicVariablesSubject.next(DynamicVariables);
    }
  }

  GetDefaultFontWeight(fontWeight) {
    return typeof fontWeight === 'number' || !fontWeight
      ? this.DefaultControlFontStyles.fontWeight
      : fontWeight;
  }

  private MapOtherControlsCountOfAllPages(data: IMobileLayoutData) {
    if (data.globalQuestionPage.otherControlsCount) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlsCount =
        data.globalQuestionPage.otherControlsCount;
    }
    if (data.servicePage.otherControlsCount) {
      this.MobileInterfaceData.servicePageData.otherControlsCount =
        data.servicePage.otherControlsCount;
    }
    if (data.serviceQuestion.otherControlsCount) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlsCount =
        data.serviceQuestion.otherControlsCount;
    }
    if (data.welcomePage.otherControlsCount) {
      this.MobileInterfaceData.welcomePageData.otherControlsCount =
        data.welcomePage.otherControlsCount;
    }
    if (data.ticketPage.otherControlsCount) {
      this.MobileInterfaceData.ticketPageData.otherControlsCount =
        data.ticketPage.otherControlsCount;
    }
    if (data.surveyPage.otherControlsCount) {
      this.MobileInterfaceData.surveyPageData.otherControlsCount =
        data.surveyPage.otherControlsCount;
    }
    if (data.marketingPage.otherControlsCount) {
      this.MobileInterfaceData.marketingPageData.otherControlsCount =
        data.marketingPage.otherControlsCount;
    }
    if (data.thankYouPage.otherControlsCount) {
      this.MobileInterfaceData.thankYouPageData.otherControlsCount =
        data.thankYouPage.otherControlsCount;
    }
    if (data.languagePage && data.languagePage.otherControlsCount) {
      this.MobileInterfaceData.languagePageData.otherControlsCount =
        data.languagePage.otherControlsCount;
    }
  }

  private UpdateExistingData() {
    const pages = [
      'servicePageData',
      'welcomePageData',
      'languagePageData',
      'globalQuestionPageData',
      'serviceQuestionPageData',
      'marketingPageData',
      'ticketPageData',
      'thankYouPageData',
      'surveyPageData',
    ];
    pages.forEach((p) => {
      if (this.MobileInterfaceData) {
        for (const img of this.MobileInterfaceData[p].images) {
          img.src = this.UpdateImageVideoSrcInExistingMobile(img.src);
        }
        for (const video of this.MobileInterfaceData[p].videos) {
          video.src = this.UpdateImageVideoSrcInExistingMobile(video.src);
        }
        for (const slider of this.MobileInterfaceData[p].sliders) {
          slider.src = this.UpdateSliderSrcInExistingMobile(slider.src);
        }
      }
    });
  }

  UpdateImageVideoSrcInExistingMobile(src) {
    if (typeof src === 'string' && this.LanguageListSubject.value) {
      const imageSrc = [];
      this.LanguageListSubject.value.forEach((lang) => {
        imageSrc.push({
          languageCode: lang.languageCode,
          language: lang.language,
          url: lang.isDefault ? src : '',
        });
      });
      return imageSrc;
    }
    return src;
  }

  UpdateSliderSrcInExistingMobile(src) {
    const data: ISliderControlPostPreview[] = [];
    if (src.some((s) => typeof s.url === 'string')) {
      this.LanguageListSubject.value.forEach((lang) => {
        src.forEach((x) => {
          if (x.url) {
            data.push({
              type: x.type,
              url: lang.isDefault ? x.url : [],
              name: lang.isDefault ? this.GetFileName(x.url) : '',
              version: 'Old',
              languageCode: lang.languageCode,
            });
          }
        });
      });
      return this.GetLanguageWiseSrc(data);
    }
    return src;
  }

  GetFileName(url: string) {
    const extractedFileName = url.split('/');
    return getTimeStampSplitedFileName(
      extractedFileName[extractedFileName.length - 1]
    );
  }

  GetLanguageWiseSrc(urls) {
    const src = [];
    this.LanguageListSubject.value.forEach((lang) => {
      src.push({
        language: lang.language,
        languageCode: lang.languageCode,
        url: lang.isDefault ? urls : [],
      });
    });
    return src;
  }

  AddSlidersInAllPagesOnEdit(data: IMobileLayoutData) {
    data.globalQuestionPage.sliders.forEach((slider) => {
      this.AddSliderToTheGlobalQuestionPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.welcomePage.sliders.forEach((slider) => {
      this.AddSliderToTheWelcomePage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.servicePage.sliders.forEach((slider) => {
      this.AddSliderToTheServicePage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.serviceQuestion.sliders.forEach((slider) => {
      this.AddSliderToTheServiceQuestionPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.marketingPage.sliders.forEach((slider) => {
      this.AddSliderToTheMarketingPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.thankYouPage.sliders.forEach((slider) => {
      this.AddSliderToTheThankYouPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.ticketPage.sliders.forEach((slider) => {
      this.AddSliderToTheTicketPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.surveyPage.sliders.forEach((slider) => {
      this.AddSliderToTheSurveyPage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data.languagePage.sliders.forEach((slider) => {
      this.AddSliderToTheLanguagePage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data?.noQueuePage?.sliders.forEach((slider) => {
      this.AddSliderToTheNoQueuePage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
    data?.offLinePage?.sliders.forEach((slider) => {
      this.AddSliderToTheOfflinePage(
        this.CreateSliderControl(
          slider.name,
          slider.width,
          slider.height,
          slider.top,
          slider.left,
          slider.zindex,
          this.SetURL(slider.src),
          slider.verticalPadding,
          slider.horizontalPadding,
          slider.boxCorner
        )
      );
    });
  }
  SetURL(
    urls: IMobileSliderControlPostPreview[]
  ): IMobileSliderControlPostPreview[] {
    let data: IMobileSliderControlPostPreview[] = [];
    urls.forEach((x) => {
      if (typeof x.url !== 'string') {
        for (const u of x.url) {
          data.push({
            type: u.type,
            url: u.url,
            name: u.name,
            version: 'Old',
            languageCode: u.languageCode,
          });
        }
        x.url = data;
        data = [];
      }
    });
    return urls;
  }
  AddLabelsInAllPagesOnEdit(data: IMobileLayoutData) {
    data.globalQuestionPage.labels.forEach((label) => {
      this.AddLabelToTheGlobalQuestionPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.welcomePage.labels.forEach((label) => {
      this.AddLabelToTheWelcomePage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.servicePage.labels.forEach((label) => {
      this.AddLabelToTheServicePage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.serviceQuestion.labels.forEach((label) => {
      this.AddLabelToTheServiceQuestionPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.marketingPage.labels.forEach((label) => {
      this.AddLabelToTheMarketingPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.thankYouPage.labels.forEach((label) => {
      this.AddLabelToTheThankYouPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.ticketPage.labels.forEach((label) => {
      this.AddLabelToTheTicketPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.surveyPage.labels.forEach((label) => {
      this.AddLabelToTheSurveyPage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data.languagePage.labels.forEach((label) => {
      this.AddLabelToTheLanguagePage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data?.noQueuePage?.labels.forEach((label) => {
      this.AddLabelToTheNoQueuePage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
    data?.offLinePage?.labels.forEach((label) => {
      this.AddLabelToTheOfflinePage(
        this.CreateLabelControl(
          label.name,
          label.text,
          label.hyperLink,
          label.color,
          label.width,
          label.height,
          label.top,
          label.left,
          label.zindex,
          label.font,
          label.fontStyle,
          label.fontSize,
          this.GetDefaultFontWeight(label.fontWeight),
          label.backgroundColor,
          label.verticalPadding,
          label.horizontalPadding,
          label.boxCorner,
          label.alignment
        )
      );
    });
  }

  AddVideosInAllPagesOnEdit(data: IMobileLayoutData) {
    data.globalQuestionPage.videos.forEach((video) => {
      this.AddVideoToTheGlobalQuestionPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.languagePage.videos.forEach((video) => {
      this.AddVideoToTheLanguagePage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.welcomePage.videos.forEach((video) => {
      this.AddVideoToTheWelcomePage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.servicePage.videos.forEach((video) => {
      this.AddVideoToTheServicePage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.serviceQuestion.videos.forEach((video) => {
      this.AddVideoToTheServiceQuestionPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.marketingPage.videos.forEach((video) => {
      this.AddVideoToTheMarketingPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.thankYouPage.videos.forEach((video) => {
      this.AddVideoToTheThankYouPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.ticketPage.videos.forEach((video) => {
      this.AddVideoToTheTicketPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data.surveyPage.videos.forEach((video) => {
      this.AddVideoToTheSurveyPage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data?.noQueuePage?.videos.forEach((video) => {
      this.AddVideoToTheNoQueuePage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
    data?.offLinePage?.videos.forEach((video) => {
      this.AddVideoToTheOfflinePage(
        this.CreateVideoControl(
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex,
          video.verticalPadding,
          video.horizontalPadding,
          video.boxCorner
        )
      );
    });
  }

  private AddImagesInAllPagesOnEdit(data: IMobileLayoutData) {
    data.globalQuestionPage.images.forEach((image) => {
      this.AddImageToTheGlobalQuestionPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.welcomePage.images.forEach((image) => {
      this.AddImageToTheWelcomePage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.languagePage.images.forEach((image) => {
      this.AddImageToTheLanguagePage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.servicePage.images.forEach((image) => {
      this.AddImageToTheServicePage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.serviceQuestion.images.forEach((image) => {
      this.AddImageToTheServiceQuestionPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.marketingPage.images.forEach((image) => {
      this.AddImageToTheMarketingPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.thankYouPage.images.forEach((image) => {
      this.AddImageToTheThankYouPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.ticketPage.images.forEach((image) => {
      this.AddImageToTheTicketPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data.surveyPage.images.forEach((image) => {
      this.AddImageToTheSurveyPage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data?.noQueuePage?.images.forEach((image) => {
      this.AddImageToTheNoQueuePage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
    data?.offLinePage?.images.forEach((image) => {
      this.AddImageToTheOfflinePage(
        this.CreateImageControl(
          image.name,
          image.src,
          image.hyperLink,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex,
          image.verticalPadding,
          image.horizontalPadding,
          image.boxCorner
        )
      );
    });
  }

  private AddEditableDataToDesignerPanel(data: IMobileLayoutData) {
    this.MobileInterfaceData.designerScreen.workFlowId =
      this.WorkFlowData.workFlowId;
    this.MobileInterfaceData.designerScreen.workFlowName =
      this.WorkFlowData.name;
    this.MobileInterfaceData.designerScreen.templateId =
      data.designerScreen.templateId;
    this.MobileInterfaceData.designerScreen.name =
      data.designerScreen.templateName;
    this.MobileInterfaceData.designerScreen.styles.height =
      data.designerScreen.height;
    this.MobileInterfaceData.designerScreen.backgroundImage =
      data.designerScreen.backGroundImage;
    this.MobileInterfaceData.designerScreen.styles.backgroundColor =
      data.designerScreen.backgroundColor;
    this.MobileInterfaceData.designerScreen.styles.font =
      data.designerScreen.font;
    this.MobileInterfaceData.designerScreen.styles.fontSize =
      data.designerScreen.fontSize;
    this.MobileInterfaceData.designerScreen.styles.fontStyle =
      data.designerScreen.fontStyle;
    this.MobileInterfaceData.designerScreen.styles.fontWeight =
      this.GetDefaultFontWeight(data.designerScreen.fontWeight);
    this.MobileInterfaceData.designerScreen.styles.color =
      data.designerScreen.color;
    this.MobileInterfaceData.designerScreen.name =
      data.designerScreen.templateName;
    this.MobileInterfaceData.designerScreen.waitingTime =
      data.designerScreen.waitingTime ?? MobileExecution.WaitingTime;

    this.MobileInterfaceData.designerScreen.form.patchValue({
      height: data.designerScreen.height,
      name: data.designerScreen.templateName,
      backgroundImage: data.designerScreen.backGroundImage,
      backgroundColor: data.designerScreen.backgroundColor,
      color: data.designerScreen.color,
      font: data.designerScreen.font,
      fontStyle: data.designerScreen.fontStyle,
      fontSize: data.designerScreen.fontSize,
      fontWeight: this.GetDefaultFontWeight(data.designerScreen.fontWeight),
      workFlowId: data.designerScreen.WorkFlowId,
      waitingTime:
        data.designerScreen.waitingTime ?? MobileExecution.WaitingTime,
    });
    this.UpdateValuesOfDesignerScreenPanelSubject();
  }
  private AddHeaderEditableData(data: IMobileLayoutData) {
    this.MobileInterfaceData.headerData.backgroundImage =
      data.headerData.backGroundImage;
    this.MobileInterfaceData.headerData.isVisible = data.headerData.isVisible;
    this.MobileInterfaceData.headerData.verticalPadding = data.headerData.verticalPadding || this.GetHeaderDefaultData().verticalPadding;
    this.MobileInterfaceData.headerData.horizontalPadding =
      (data.headerData.horizontalPadding || this.GetHeaderDefaultData().horizontalPadding);
    this.MobileInterfaceData.headerData.logoPosition = data.headerData.logoPosition || this.GetHeaderDefaultData().logoPosition;
    this.MobileInterfaceData.headerData.height = data.headerData.height || this.GetHeaderDefaultData().logoPosition;

    this.MobileInterfaceData.headerData.form.patchValue({
      backgroundImage: data.headerData.backGroundImage,
      isVisible: data.headerData.isVisible,
      verticalPadding: data.headerData.verticalPadding || this.GetHeaderDefaultData().verticalPadding,
      horizontalPadding: data.headerData.horizontalPadding || this.GetHeaderDefaultData().horizontalPadding,
      logoPosition: data.headerData.logoPosition || this.GetHeaderDefaultData().logoPosition,
      height: data.headerData.height || this.GetHeaderDefaultData().height
    });
    this.UpdateValuesOfHeaderControlPanelSubject();
  }

  private AddPagePropertiesEditableData(data: IMobileLayoutData) {
    this.MobileInterfaceData.pageProperties.hideWelcomePage = this.SetDefaultBooleanValue(data?.pageProperties?.hideWelcomePage);
    this.MobileInterfaceData.pageProperties.hideThankYouPage = this.SetDefaultBooleanValue(data?.pageProperties?.hideThankYouPage);
    this.MobileInterfaceData.pageProperties.form.patchValue({
      hideWelcomePage: this.SetDefaultBooleanValue(data?.pageProperties?.hideWelcomePage),
      hideThankYouPage: this.SetDefaultBooleanValue(data?.pageProperties?.hideThankYouPage),
    });
    this.UpdateValuesOfPagePropertiesSubject();
  }

  private AddFooterEditableData(data: IMobileLayoutData) {
    this.MobileInterfaceData.footerData.styles.font = data.footerData.font;
    this.MobileInterfaceData.footerData.styles.fontSize =
      this.GetFooterDefaultData().fontSize;
    this.MobileInterfaceData.footerData.styles.fontStyle =
      data.footerData.fontStyle;
    this.MobileInterfaceData.footerData.styles.fontWeight =
      this.GetDefaultFontWeight(data.footerData.fontWeight);
    this.MobileInterfaceData.footerData.styles.color = data.footerData.color;
    this.MobileInterfaceData.footerData.footerImage =
      data.footerData.footerImage || this.FooterImage;
    this.MobileInterfaceData.footerData.text =
      data.footerData.text || this.FooterData.text;
    this.MobileInterfaceData.footerData.isVisible = this.SetDefaultBooleanValue(data.footerData.isVisible);
    this.MobileInterfaceData.footerData.isTextVisible = this.SetDefaultBooleanValue(data.footerData.isTextVisible);
    this.MobileInterfaceData.footerData.isFooterImageVisible = this.SetDefaultBooleanValue(data.footerData.isFooterImageVisible);
    this.MobileInterfaceData.footerData.isLogoVisible = this.SetDefaultBooleanValue(data.footerData.isLogoVisible);
    this.MobileInterfaceData.footerData.footerLogo = data.footerData.footerLogo || this.FooterData.footerLogo;
    this.MobileInterfaceData.footerData.form.patchValue({
      color: data.footerData.color,
      font: data.footerData.font,
      fontStyle: data.footerData.fontStyle,
      fontSize: data.footerData.fontSize,
      fontWeight: this.GetDefaultFontWeight(data.footerData.fontWeight),
      footerImage: data.footerData.footerImage || this.FooterImage,
      text: data.footerData.text || this.FooterData.text,
      isVisible: this.SetDefaultBooleanValue(data.footerData.isVisible),
      isTextVisible: this.SetDefaultBooleanValue(data.footerData.isTextVisible),
      isFooterImageVisible: this.SetDefaultBooleanValue(data.footerData.isFooterImageVisible),
      isLogoVisible: this.SetDefaultBooleanValue(data.footerData.isLogoVisible),
      footerLogo: data.footerData.footerLogo || this.FooterData.footerLogo,
    });
    this.UpdateValuesOfFooterControlPanelSubject();
  }

  private SetDefaultBooleanValue(element): boolean {
    return (element !== undefined) ? element : true;
  }

  IsMobileTemplateIdExistInSession() {
    return this.browserStorageService.MobileInterfaceId;
  }

  SubscribeObservables() {
    this.subs.sink = this.addMobileService.WorkFlow$.subscribe((workflow) => {
      this.SetWorkFlowData(workflow);
    });
  }

  private SetWorkFlowData(workflow: IMobileWorkFlowDetail) {
    this.dynamicVariablesService
      .GetDynamicVariables(workflow)
      .subscribe((allVariables) => {
        this.GetVariables(allVariables);
      });
    this.WorkFlowData = workflow;
    this.MobileInterfaceData.designerScreen.workFlowId = workflow.workFlowId;
    this.MobileInterfaceData.designerScreen.workFlowName = workflow.name;
    this.UpdateValuesOfDesignerScreenPanelSubject();
  }

  InitializeDefaultData() {
    this.GeneralFontStyles = this.GetGeneralStyles();
    this.DefaultControlFontStyles = this.GetDefaultControlsStyles();
    this.DefaultButtonControlFontStyles = this.GetDefaultButtonControlsStyles();

    const HeaderData = this.GetHeaderDefaultData();
    const FooterData = this.GetFooterDefaultData();
    const PagePropertiesData = this.GetPagePropertiesData();
    this.MobileInterfaceData = {
      designerScreen: this.GetDesignPanelControl(
        '',
        '',
        this.IsMobileTemplateIdExistInSession()
          ? ''
          : this.GetDefaultTemplateName(),
        '',
        this.GeneralFontStyles.backgroundColor,
        this.GeneralFontStyles.color,
        this.GeneralFontStyles.height,
        this.GeneralFontStyles.fontSize,
        this.GeneralFontStyles.font,
        this.GeneralFontStyles.fontStyle,
        this.GeneralFontStyles.fontWeight,
        this.IsMobileTemplateIdExistInSession()
          ? null
          : MobileExecution.WaitingTime
      ),
      pageProperties: this.GetPageProperties(
        PagePropertiesData.hideWelcomePage,
        PagePropertiesData.hideThankYouPage
      ),
      headerData: this.GetHeaderControl(
        HeaderData.backgroundImage,
        HeaderData.isVisible,
      ),
      footerData: this.GetFooterControl(
        FooterData.color,
        FooterData.fontSize,
        FooterData.font,
        FooterData.fontStyle,
        FooterData.fontWeight,
        FooterData.footerImage,
        FooterData.text,
        FooterData.footerLogo
      ),
      welcomePageData: this.GetDefaultWelcomePageData(),
      languagePageData: this.GetDefaultLanguagePageData(),
      servicePageData: this.GetDefaultServicePageData(),
      globalQuestionPageData: this.GetDefaultGlobalQuestionPageData(),
      serviceQuestionPageData: this.GetDefaultServiceQuestionPageData(),
      thankYouPageData: this.GetDefaultThankYouPageData(),
      noQueuePageData: this.GetDefaultNoQueuePageData(),
      ticketPageData: this.GetDefaultTicketPageData(),
      marketingPageData: this.GetDefaultMarketingPageData(),
      surveyPageData: this.GetDefaultSurveyPageData(),
      offLinePageData: this.GetDefaultOffLinePageData()
    };
  }

  InitializeSubjects() {
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(
      this.MobileInterfaceData.designerScreen
    );
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();

    this.PagePropertiesSubject = new BehaviorSubject<PageProperties>(
      this.MobileInterfaceData.pageProperties
    );


    this.PageProperties$ = this.PagePropertiesSubject.asObservable();
    this.LanguageListSubject = new BehaviorSubject<IMobileSupportedLanguage[]>(
      []
    );
    this.HeaderControlSubject = new BehaviorSubject<HeaderControl>(
      this.MobileInterfaceData.headerData
    );
    this.HeaderControl$ = this.HeaderControlSubject.asObservable();
    this.FooterControlSubject = new BehaviorSubject<FooterControl>(
      this.MobileInterfaceData.footerData
    );
    this.FooterControl$ = this.FooterControlSubject.asObservable();
    this.LanguageList$ = this.LanguageListSubject.asObservable();
    this.PageListSubject = new BehaviorSubject<IMobileDropdown[]>(
      this.GetPageList()
    );
    this.PageList$ = this.PageListSubject.asObservable();
    this.SelectedLanguageSubject = new BehaviorSubject<ICurrentLanguage>({
      defaultLanguage: this.DefaultLanguageCode,
      selectedLanguage: this.DefaultLanguageCode,
    });
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
    this.CurrentPageSubject = new BehaviorSubject<IMobilePageDetails>(
      this.GetCurrentPage(MobilePageName.LanguagePage.toString())
    );
    this.CurrentPage$ = this.CurrentPageSubject.asObservable();

    this.WelcomePageDataSubject = new BehaviorSubject<IWelcomePageData>(
      this.GetDefaultWelcomePageData()
    );
    this.WelcomePageData$ = this.WelcomePageDataSubject.asObservable();
    this.LanguagePageDataSubject = new BehaviorSubject<ILanguagePageData>(
      this.GetDefaultLanguagePageData()
    );
    this.LanguagePageData$ = this.LanguagePageDataSubject.asObservable();

    this.GlobalQuestionPageDataSubject =
      new BehaviorSubject<IGlobalQuestionPageData>(
        this.GetDefaultGlobalQuestionPageData()
      );
    this.GlobalQuestionPageData$ =
      this.GlobalQuestionPageDataSubject.asObservable();

    this.ServicePageDataSubject = new BehaviorSubject<IServicePageData>(
      this.GetDefaultServicePageData()
    );
    this.ServicePageData$ = this.ServicePageDataSubject.asObservable();

    this.ServiceQuestionPageDataSubject =
      new BehaviorSubject<IServiceQuestionPageData>(
        this.GetDefaultServiceQuestionPageData()
      );
    this.ServiceQuestionPageData$ =
      this.ServiceQuestionPageDataSubject.asObservable();

    this.TicketPageDataSubject = new BehaviorSubject<ITicketPageData>(
      this.GetDefaultTicketPageData()
    );
    this.TicketPageData$ = this.TicketPageDataSubject.asObservable();

    this.ThankYouPageDataSubject = new BehaviorSubject<IThankYouPageData>(
      this.GetDefaultThankYouPageData()
    );
    this.ThankYouPageData$ = this.ThankYouPageDataSubject.asObservable();

    this.NoQueuePageDataSubject = new BehaviorSubject<INoQueuePageData>(
      this.GetDefaultNoQueuePageData()
    );
    this.NoQueuePageData$ = this.NoQueuePageDataSubject.asObservable();

    this.MarketingPageDataSubject = new BehaviorSubject<IMarketingPageData>(
      this.GetDefaultMarketingPageData()
    );
    this.MarketingPageData$ = this.MarketingPageDataSubject.asObservable();

    this.SurveyPageDataSubject = new BehaviorSubject<ISurveyPageData>(
      this.GetDefaultSurveyPageData()
    );
    this.SurveyPageData$ = this.SurveyPageDataSubject.asObservable();

    this.DynamicVariablesSubject = new BehaviorSubject<IDynamicVariable[]>([]);
    this.DynamicVariables$ = this.DynamicVariablesSubject.asObservable();

    this.OffLinePageDataSubject = new BehaviorSubject<IOffLinePage>(
      this.GetDefaultOffLinePageData()
    );
    this.OffLinePage$ = this.OffLinePageDataSubject.asObservable();
  }

  private GetDefaultOffLinePageData(): IOffLinePage {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      buttons: [],
      otherControlList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsPanelSelected: false,
        IsButtonSelected: false,
        IsOtherControlSelected: false,
        IsHeaderSelected: false,
        IsFooterSelected: false,
      },
    };
  }

  private GetDefaultTemplateName(): string {
    const ExistingTemplateNameList: number[] = [];

    if (
      this.mobileListService.Mobiles$ != null &&
      this.mobileListService.Mobiles$ != undefined
    ) {
      this.mobileListService.Mobiles$.subscribe((response) => {
        response
          .map((x) => x.designerScreen.templateName)
          .forEach((x) => {
            const regexp = new RegExp('^template-\\d+$');
            if (regexp.test(x.toLowerCase())) {
              const digit = x.match(/\d+/);
              if (digit != null) {
                ExistingTemplateNameList.push(parseInt(digit[0]));
              }
            }
          });

        if (
          ExistingTemplateNameList != null &&
          ExistingTemplateNameList != undefined &&
          ExistingTemplateNameList.length > 0
        ) {
          ExistingTemplateNameList.sort(function (x, y) {
            return x - y;
          });
        }
      });
    }

    if (
      ExistingTemplateNameList == null ||
      ExistingTemplateNameList == undefined ||
      ExistingTemplateNameList.length <= 0
    ) {
      if (
        (this.mobileListService.Mobiles$ == null ||
          this.mobileListService.Mobiles$ == undefined) &&
        this.browserStorageService.MobileInterfaceName
      ) {
        return this.browserStorageService.MobileInterfaceName;
      }

      this.browserStorageService.SetMobileInterfaceName('Template-1');
      return 'Template-1';
    }

    const count = ExistingTemplateNameList.slice(-1)[0] + 1;
    const missing = new Array();

    for (let i = 1; i <= count; i++) {
      if (ExistingTemplateNameList.indexOf(i) == -1) {
        missing.push(i);
      }
    }

    this.browserStorageService.SetMobileInterfaceName('Template-' + missing[0]);
    return 'Template-' + missing[0];
  }

  SetCurrentPage(pageNumber: string) {
    this.CurrentPageSubject.next(this.GetCurrentPage(pageNumber));
  }

  ChangeLayoutLanguage(value: string) {
    this.SelectedLanguageSubject.value.selectedLanguage = value;
    this.SendNextLanguageSubject(this.SelectedLanguageSubject.value);
  }
  SendNextLanguageSubject(value: ICurrentLanguage) {
    this.SelectedLanguageSubject.next(value);
  }

  UpdateSelectedControlZIndex(IsIncrease: boolean, page: IMobileOtherControls): number {
    const totalControlsCount =
      page.images.length +
      page.videos.length +
      page.labels.length +
      page.sliders.length;
    return (IsIncrease) ? 50 + totalControlsCount : 50 - totalControlsCount;
  }

  UpdatePageDataControlZIndex(IsFront: boolean, pageInfo: {
    kioskPagePropertyName: string,
    pageSubjectPropertyName: string
  }) {
    const controlTypes = ['labels', 'images', 'videos', 'sliders'];
    for (const controlType of controlTypes) {
      this.MobileInterfaceData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
        if (IsFront ? x.styles.zindex > 50 : x.styles.zindex < 50) {
          x.styles.zindex = x.form.controls.zindex.value += IsFront ? -1 : 1;
        }
      });
    }


    this[pageInfo.pageSubjectPropertyName].next(this.MobileInterfaceData[pageInfo.kioskPagePropertyName]);
  }

  ResolvePageInfo(page: IMobilePageDetails): {
    kioskPagePropertyName: string,
    pageSubjectPropertyName: string
  } {
    if (page.IsLanguagePage) {
      return {
        kioskPagePropertyName: 'languagePageData',
        pageSubjectPropertyName: 'LanguagePageDataSubject'
      };
    }
    if (page.IsWelcomePage) {
      return {
        kioskPagePropertyName: 'welcomePageData',
        pageSubjectPropertyName: 'WelcomePageDataSubject'
      };
    }
    if (page.IsGlobalQuestionPage) {
      return {
        kioskPagePropertyName: 'globalQuestionPageData',
        pageSubjectPropertyName: 'GlobalQuestionPageDataSubject'
      };
    }
    if (page.IsServicePage) {
      return {
        kioskPagePropertyName: 'servicePageData',
        pageSubjectPropertyName: 'ServicePageDataSubject'
      };
    }
    if (page.IsServiceQuestionPage) {
      return {
        kioskPagePropertyName: 'serviceQuestionPageData',
        pageSubjectPropertyName: 'ServiceQuestionPageDataSubject'
      };
    }
    if (page.IsThankYouPage) {
      return {
        kioskPagePropertyName: 'thankYouPageData',
        pageSubjectPropertyName: 'ThankYouPageDataSubject'
      };
    }
    if (page.IsNoQueuePage) {
      return {
        kioskPagePropertyName: 'noQueuePageData',
        pageSubjectPropertyName: 'NoQueuePageDataSubject'
      };
    }
    if (page.IsTicketPage) {
      return {
        kioskPagePropertyName: 'ticketPageData',
        pageSubjectPropertyName: 'TicketPageDataSubject'
      };
    }
    if (page.IsSurveyPage) {
      return {
        kioskPagePropertyName: 'surveyPageData',
        pageSubjectPropertyName: 'SurveyPageDataSubject'
      };
    }
    if (page.IsMarketingPage) {
      return {
        kioskPagePropertyName: 'marketingPageData',
        pageSubjectPropertyName: 'MarketingPageDataSubject'
      };
    }
    if (page.IsOffLinePage) {
      return {
        kioskPagePropertyName: 'offLinePageData',
        pageSubjectPropertyName: 'OffLinePageDataSubject'
      };
    }
  }



  IncreaseZIndex() {
    const pageInfo: {
      kioskPagePropertyName: string,
      pageSubjectPropertyName: string
    } = this.ResolvePageInfo(this.CurrentPageSubject.value);

    const controlTypes = ['labels', 'images', 'videos', 'sliders'];
    for (const controlType of controlTypes) {
      this.MobileInterfaceData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
        if (x.selected) {
          x.styles.zindex = x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(true, this.MobileInterfaceData[pageInfo.kioskPagePropertyName]);
        }
      });
    }
    this.UpdatePageDataControlZIndex(true, pageInfo);
  }

  DecreaseZIndex() {
    const pageInfo: {
      kioskPagePropertyName: string,
      pageSubjectPropertyName: string
    } = this.ResolvePageInfo(this.CurrentPageSubject.value);
    const controlTypes = ['labels', 'images', 'videos', 'sliders'];
    for (const controlType of controlTypes) {
      this.MobileInterfaceData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
        if (x.selected) {
          x.styles.zindex = x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(false, this.MobileInterfaceData[pageInfo.kioskPagePropertyName]);
        }
      });
    }
    this.UpdatePageDataControlZIndex(false, pageInfo);
  }

  HandleAllControlZIndex(deletedControlZIndex: number) {
    const pageInfo: {
      kioskPagePropertyName: string,
      pageSubjectPropertyName: string
    } = this.ResolvePageInfo(this.CurrentPageSubject.value);
    const controlTypes = ['labels', 'images', 'videos', 'sliders'];
    for (const controlType of controlTypes) {
      this.MobileInterfaceData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
        if (x.styles.zindex > 50 && 50 < deletedControlZIndex && deletedControlZIndex < x.styles.zindex) {
          x.styles.zindex -= 1;
          x.form.controls.zindex.value -= 1;
        }
        if (x.styles.zindex < 50 && 50 > deletedControlZIndex && deletedControlZIndex > x.styles.zindex) {
          x.styles.zindex += 1;
          x.form.controls.zindex.value += 1;
        }
      });
    }
  }

  SaveAsDraft() {
    const postData = this.GetModifiedLayoutDetails();
    this.ValidateLayoutData(this.MobileInterfaceData);
    if (this.isValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveMobileAsDraft,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveMobileAsDraft,
          postData
        );
      }
    } else {
      this.isValidLayoutData = true;
    }
  }
  AfterUploadingFilesSuccessFullySendDataToDB(
    url: string,
    postData: IMobileLayoutData
  ) {
    if (url === this.SaveMobile) {
      this.mobileAPIService
        .Save(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.AppNotificationService.Notify('Mobile saved.');
          this.routeHandlerService.RedirectToMobileInterfaceListPage();
        });
    } else {
      this.mobileAPIService
        .SaveAsDraft(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.AppNotificationService.Notify('Mobile drafted.');
          this.routeHandlerService.RedirectToMobileInterfaceListPage();
        });
    }
  }

  Save() {
    const postData = this.GetModifiedLayoutDetails();
    this.ValidateLayoutData(this.MobileInterfaceData);
    if (this.isValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveMobile,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveMobile,
          postData
        );
      }
    } else {
      this.isValidLayoutData = true;
    }
  }

  //#region File upload urls
  GetFileUploadUrlApis(postData: IMobileLayoutData) {
    const fileUploadAPIs = [];
    if (this.MobileInterfaceData.headerData.backgroundImageFile) {
      fileUploadAPIs.push(
        this.UploadHeaderBackGroundImageAndSetBackGroundURLInPostData(postData)
      );
    }
    if (this.MobileInterfaceData.footerData.footerImageFile) {
      fileUploadAPIs.push(this.UploadFooterImageAndSetURLInPostData(postData));
    }
    if (this.MobileInterfaceData.footerData.footerLogoFile) {
      fileUploadAPIs.push(this.UploadFooterLogoAndSetURLInPostData(postData));
    }
    if (this.MobileInterfaceData.designerScreen.backgroundImageFile) {
      fileUploadAPIs.push(
        this.UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
          postData
        )
      );
    }
    if (this.MobileInterfaceData.welcomePageData.button) {
      this.UploadButtonImageFiles(
        this.MobileInterfaceData.welcomePageData?.button,
        fileUploadAPIs,
        postData,
        'welcomePage'
      );
    }
    if (this.MobileInterfaceData.globalQuestionPageData.buttons.length > 0) {
      this.MobileInterfaceData.globalQuestionPageData.buttons.forEach(
        (button) => {
          this.UploadButtonImageFiles(
            button,
            fileUploadAPIs,
            postData,
            'globalQuestionPage'
          );
        }
      );
    }
    if (this.MobileInterfaceData.servicePageData.buttons.length > 0) {
      this.MobileInterfaceData.servicePageData.buttons.forEach((button) => {
        this.UploadButtonImageFiles(
          button,
          fileUploadAPIs,
          postData,
          'servicePage'
        );
      });
    }
    if (this.MobileInterfaceData.serviceQuestionPageData.button) {
      this.UploadButtonImageFiles(
        this.MobileInterfaceData.serviceQuestionPageData.button,
        fileUploadAPIs,
        postData,
        'serviceQuestion'
      );
    }
    if (this.MobileInterfaceData.surveyPageData.button) {
      this.UploadButtonImageFiles(
        this.MobileInterfaceData.surveyPageData.button,
        fileUploadAPIs,
        postData,
        'surveyPage'
      );
    }
    if (this.MobileInterfaceData.ticketPageData.buttonPanel.length > 0) {
      this.MobileInterfaceData.ticketPageData.buttonPanel.forEach((button) => {
        this.UploadButtonImageFiles(
          button,
          fileUploadAPIs,
          postData,
          'ticketPage'
        );
      });
    }
    if (this.MobileInterfaceData.globalQuestionPageData.images.length > 0) {
      this.MobileInterfaceData.globalQuestionPageData.images.forEach(
        (image) => {
          this.UploadImageFiles(
            image,
            fileUploadAPIs,
            postData.globalQuestionPage.images
          );
        }
      );
    }
    if (this.MobileInterfaceData.marketingPageData.images.length > 0) {
      this.MobileInterfaceData.marketingPageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.marketingPage.images
        );
      });
    }
    if (this.MobileInterfaceData.surveyPageData.images.length > 0) {
      this.MobileInterfaceData.surveyPageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.surveyPage.images
        );
      });
    }
    if (this.MobileInterfaceData.ticketPageData.images.length > 0) {
      this.MobileInterfaceData.ticketPageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.ticketPage.images
        );
      });
    }
    if (this.MobileInterfaceData.serviceQuestionPageData.images.length > 0) {
      this.MobileInterfaceData.serviceQuestionPageData.images.forEach(
        (image) => {
          this.UploadImageFiles(
            image,
            fileUploadAPIs,
            postData.serviceQuestion.images
          );
        }
      );
    }
    if (this.MobileInterfaceData.servicePageData.images.length > 0) {
      this.MobileInterfaceData.servicePageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.servicePage.images
        );
      });
    }
    if (this.MobileInterfaceData.thankYouPageData.images.length > 0) {
      this.MobileInterfaceData.thankYouPageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.thankYouPage.images
        );
      });
    }
    if (this.MobileInterfaceData.welcomePageData.images.length > 0) {
      this.MobileInterfaceData.welcomePageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.welcomePage.images
        );
      });
    }
    if (this.MobileInterfaceData.languagePageData.images.length > 0) {
      this.MobileInterfaceData.languagePageData.images.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData.languagePage.images
        );
      });
    }
    if (this.MobileInterfaceData.welcomePageData.videos.length > 0) {
      this.MobileInterfaceData.welcomePageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.welcomePage.videos
        );
      });
    }
    if (this.MobileInterfaceData.globalQuestionPageData.videos.length > 0) {
      this.MobileInterfaceData.globalQuestionPageData.videos.forEach(
        (video) => {
          this.UploadVideoFiles(
            video,
            fileUploadAPIs,
            postData.globalQuestionPage.videos
          );
        }
      );
    }
    if (this.MobileInterfaceData.languagePageData.videos.length > 0) {
      this.MobileInterfaceData.languagePageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.languagePage.videos
        );
      });
    }
    if (this.MobileInterfaceData.servicePageData.videos.length > 0) {
      this.MobileInterfaceData.servicePageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.servicePage.videos
        );
      });
    }
    if (this.MobileInterfaceData.serviceQuestionPageData.videos.length > 0) {
      this.MobileInterfaceData.serviceQuestionPageData.videos.forEach(
        (video) => {
          this.UploadVideoFiles(
            video,
            fileUploadAPIs,
            postData.serviceQuestion.videos
          );
        }
      );
    }
    if (this.MobileInterfaceData.thankYouPageData.videos.length > 0) {
      this.MobileInterfaceData.thankYouPageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.thankYouPage.videos
        );
      });
    }
    if (this.MobileInterfaceData.marketingPageData.videos.length > 0) {
      this.MobileInterfaceData.marketingPageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.marketingPage.videos
        );
      });
    }
    if (this.MobileInterfaceData.surveyPageData.videos.length > 0) {
      this.MobileInterfaceData.surveyPageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.welcomePage.videos
        );
      });
    }
    if (this.MobileInterfaceData.ticketPageData.videos.length > 0) {
      this.MobileInterfaceData.ticketPageData.videos.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData.ticketPage.videos
        );
      });
    }

    if (this.MobileInterfaceData.welcomePageData.sliders.length > 0) {
      this.MobileInterfaceData.welcomePageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.welcomePage.sliders
          );
        }
      });
    }
    if (this.MobileInterfaceData.languagePageData.sliders.length > 0) {
      this.MobileInterfaceData.languagePageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.languagePage.sliders
          );
        }
      });
    }
    // TODO Need to change
    if (this.MobileInterfaceData.globalQuestionPageData.sliders.length > 0) {
      this.MobileInterfaceData.globalQuestionPageData.sliders.forEach(
        (slider) => {
          if (slider.src && slider.src.length > 0) {
            this.UploadSliderFiles(
              slider,
              fileUploadAPIs,
              postData.globalQuestionPage.sliders
            );
          }
        }
      );
    }
    if (this.MobileInterfaceData.servicePageData.sliders.length > 0) {
      this.MobileInterfaceData.servicePageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.servicePage.sliders
          );
        }
      });
    }
    if (this.MobileInterfaceData.serviceQuestionPageData.sliders.length > 0) {
      this.MobileInterfaceData.serviceQuestionPageData.sliders.forEach(
        (slider) => {
          if (slider.src && slider.src.length > 0) {
            this.UploadSliderFiles(
              slider,
              fileUploadAPIs,
              postData.serviceQuestion.sliders
            );
          }
        }
      );
    }
    if (this.MobileInterfaceData.thankYouPageData.sliders.length > 0) {
      this.MobileInterfaceData.thankYouPageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.thankYouPage.sliders
          );
        }
      });
    }
    if (this.MobileInterfaceData.ticketPageData.sliders.length > 0) {
      this.MobileInterfaceData.ticketPageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.ticketPage.sliders
          );
        }
      });
    }
    if (this.MobileInterfaceData.marketingPageData.sliders.length > 0) {
      this.MobileInterfaceData.marketingPageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.marketingPage.sliders
          );
        }
      });
    }
    if (this.MobileInterfaceData.surveyPageData.sliders.length > 0) {
      this.MobileInterfaceData.surveyPageData.sliders.forEach((slider) => {
        if (slider.src && slider.src.length > 0) {
          this.UploadSliderFiles(
            slider,
            fileUploadAPIs,
            postData.surveyPage.sliders
          );
        }
      });
    }
    return fileUploadAPIs;
  }

  private UploadSliderFiles(
    slider: SliderControl,
    fileUploadAPIs: any[],
    sliders: IMobileSliderControlData[]
  ) {
    if (slider.src && slider.src.length > 0 && typeof slider.src !== 'string') {
      slider.src.forEach((i) => {
        if (i[i.languageCode]) {
          for (const item of i[i.languageCode]) {
            if (!this.ObjectIsEmpty(item.file)) {
              fileUploadAPIs.push(
                this.UploadSlidersAndSetURLInPostData(
                  item.file,
                  slider.name,
                  sliders,
                  item.languageCode,
                  item.file.name
                )
              );
            }
          }
        }
      });
    }
  }

  UploadSlidersAndSetURLInPostData(
    file: File,
    name: string,
    sliders: IMobileSliderControlData[],
    languageCode: string,
    fileName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        sliders
          .find((x) => x.name === name)
          .src.find((y) => y.languageCode === languageCode)
          .url.find((n) => n.name === fileName).url = url;
      })
    );
  }

  private UploadVideoFiles(
    video: VideoControl,
    fileUploadAPIs: any[],
    videos: IMobileVideoControlData[]
  ) {
    if (video.src && video.src.length > 0 && typeof video.src !== 'string') {
      video.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadVideosAndSetRLInPostData(
              i[i.languageCode],
              video.name,
              i.languageCode,
              videos
            )
          );
        }
      });
    }
  }

  UploadVideosAndSetRLInPostData(
    file: File,
    fileName: string,
    languageCode: string,
    videos: IMobileVideoControlData[]
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        videos
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  private UploadImageFiles(
    image: ImageControl,
    fileUploadAPIs: any[],
    images: IMobileImageControlData[]
  ) {
    if (image.src && image.src.length > 0 && typeof image.src !== 'string') {
      image.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadImagesAndSetURLInPostData(
              i[i.languageCode],
              image.name,
              images,
              i.languageCode
            )
          );
        }
      });
    }
  }

  UploadImagesAndSetURLInPostData(
    file: File,
    fileName: string,
    images: IMobileImageControlData[],
    languageCode: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        images
          .find((x) => x.name === fileName)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  private UploadButtonImageFiles(
    button: ButtonControl,
    fileUploadAPIs: any[],
    postData: IMobileLayoutData,
    pageName: string
  ) {
    if (button && button.primaryButtonSrc && button.primaryButtonSrc.length > 0) {
      button.primaryButtonSrc.forEach((i) => {
        this.UploadPrimaryButtonImages(
          i,
          pageName,
          fileUploadAPIs,
          postData,
          button
        );
      });
    } else if (
      button && button.secondaryButtonSrc &&
      button.secondaryButtonSrc.length > 0
    ) {
      button.secondaryButtonSrc.forEach((b) => {
        this.UploadSecondaryButtonImages(pageName, fileUploadAPIs, b, postData);
      });
    }
  }

  private UploadSecondaryButtonImages(
    pageName: string,
    fileUploadAPIs: any[],
    b: ILanguageControl,
    postData: IMobileLayoutData
  ) {
    if (pageName === 'serviceQuestion') {
      fileUploadAPIs.push(
        this.UploadServiceQuestionSecondaryButtonImagesAndSetURLInPostData(
          b[b.languageCode],
          postData,
          b.languageCode,
          pageName
        )
      );
    } else if (pageName === 'surveyPage') {
      fileUploadAPIs.push(
        this.UploadSurveyQuestionSecondaryButtonImagesAndSetURLInPostData(
          b[b.languageCode],
          postData,
          b.languageCode,
          pageName
        )
      );
    }
  }

  private UploadPrimaryButtonImages(
    i: ILanguageControl,
    pageName: string,
    fileUploadAPIs: any[],
    postData: IMobileLayoutData,
    button: ButtonControl
  ) {
    if (
      i[i.languageCode] &&
      typeof i[i.languageCode] === 'object' &&
      !this.ObjectIsEmpty(i[i.languageCode])
    ) {
      if (pageName === 'welcomePage') {
        fileUploadAPIs.push(
          this.UploadWelcomeButtonImagesAndSetURLInPostData(
            i[i.languageCode],
            postData,
            i.languageCode,
            pageName
          )
        );
      } else if (pageName === 'serviceQuestion') {
        fileUploadAPIs.push(
          this.UploadServiceQuestionPrimaryButtonImagesAndSetURLInPostData(
            i[i.languageCode],
            postData,
            i.languageCode,
            pageName
          )
        );
      } else if (pageName === 'surveyPage') {
        fileUploadAPIs.push(
          this.UploadSurveyQuestionPrimaryButtonImagesAndSetURLInPostData(
            i[i.languageCode],
            postData,
            i.languageCode,
            pageName
          )
        );
      } else {
        fileUploadAPIs.push(
          this.UploadButtonImagesAndSetURLInPostData(
            i[i.languageCode],
            button?.name,
            postData,
            i.languageCode,
            pageName
          )
        );
      }
    }
  }

  UploadWelcomeButtonImagesAndSetURLInPostData(
    file: File,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName] && postData[pageName].button) {
          postData[pageName].button.primaryButtonSrc.find(
            (s) => s.languageCode === languageCode
          ).url = url;
        }
      })
    );
  }

  UploadServiceQuestionPrimaryButtonImagesAndSetURLInPostData(
    file: File,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName] && postData[pageName].button) {
          postData[pageName].button.primaryButtonSrc.find(
            (s) => s.languageCode === languageCode
          ).url = url;
        }
      })
    );
  }

  UploadServiceQuestionSecondaryButtonImagesAndSetURLInPostData(
    file: File,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName] && postData[pageName].button) {
          postData[pageName].button.secondaryButtonSrc.find(
            (s) => s.languageCode === languageCode
          ).url = url;
        }
      })
    );
  }

  UploadSurveyQuestionPrimaryButtonImagesAndSetURLInPostData(
    file: File,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName] && postData[pageName].button) {
          postData[pageName].button.primaryButtonSrc.find(
            (s) => s.languageCode === languageCode
          ).url = url;
        }
      })
    );
  }

  UploadSurveyQuestionSecondaryButtonImagesAndSetURLInPostData(
    file: File,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName] && postData[pageName].button) {
          postData[pageName].button.secondaryButtonSrc.find(
            (s) => s.languageCode === languageCode
          ).url = url;
        }
      })
    );
  }

  UploadButtonImagesAndSetURLInPostData(
    file: File,
    fileName: string,
    postData: IMobileLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        if (postData[pageName].buttons
          .find((x) => x.name === fileName)) {
          postData[pageName].buttons
            .find((x) => x.name === fileName)
            .primaryButtonSrc.find((s) => s.languageCode === languageCode).url =
            url;
        }

      })
    );
  }

  UploadHeaderBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMobileLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.MobileInterfaceData.headerData.backgroundImageFile)
      .pipe(
        tap((url) => {
          postData.headerData.backGroundImage = url;
        })
      );
  }

  UploadFooterImageAndSetURLInPostData(postData: IMobileLayoutData) {
    return this.formService
      .GetImageUrl(this.MobileInterfaceData.footerData.footerImageFile)
      .pipe(
        tap((url) => {
          postData.footerData.footerImage = url;
        })
      );
  }

  UploadFooterLogoAndSetURLInPostData(postData: IMobileLayoutData) {
    return this.formService
      .GetImageUrl(this.MobileInterfaceData.footerData.footerLogoFile)
      .pipe(
        tap((url) => {
          postData.footerData.footerLogo = url;
        })
      );
  }

  UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
    postData: IMobileLayoutData
  ) {
    return this.formService
      .GetImageUrl(this.MobileInterfaceData.designerScreen.backgroundImageFile)
      .pipe(
        tap((url) => {
          postData.designerScreen.backGroundImage = url;
        })
      );
  }
  //#endregion

  //#region validate data
  ValidateLayoutData(data) {
    Object.keys(data).forEach((key) => {
      if (key === 'form' && !data[key].valid) {
        this.AppNotificationService.NotifyError(
          data.uniqueName + ' name field is required.'
        );
        this.isValidLayoutData = false;
      }
      if (
        this.isValidLayoutData &&
        key !== 'form' &&
        typeof data[key] === 'object' &&
        data[key]
      ) {
        this.ValidateLayoutData(data[key]);
      }
    });
  }
  //#endregion

  //#region Fetch modified template data

  GetModifiedLayoutDetails() {
    const MobileDetail: IMobileLayoutData = {
      designerScreen: null,
      pageProperties: null,
      globalQuestionPage: null,
      servicePage: null,
      serviceQuestion: null,
      thankYouPage: null,
      welcomePage: null,
      companyId: this.authService.CompanyId,
      marketingPage: null,
      surveyPage: null,
      ticketPage: null,
      footerData: null,
      headerData: null,
      languagePage: null,
      noQueuePage: null,
      offLinePage: null
    };
    MobileDetail.designerScreen =
      this.GetMappedDesignScreenDataByCurrentMobileData();
    MobileDetail.pageProperties = this.GetMappedPagePropertiesDataByCurrentMobileData();

    const pre_service_images = this.GetPreServiceQuestionImages();
    const pre_service_slider = this.GetPreServiceQuestionSliders();
    const pre_service_Videos = this.GetPreServiceQuestionVideos();
    const pre_service_labels = this.GetPreServiceQuestionLabels();
    const pre_service_questions = this.GetPreServiceQuestionQuestions();

    MobileDetail.globalQuestionPage =
      this.GetMappedPreServiceQuestionPageDataByCurrentMobileData(
        pre_service_images,
        pre_service_labels,
        pre_service_Videos,
        pre_service_questions,
        pre_service_slider
      );
    const service_images = this.GetServiceImages();
    const service_labels = this.GetServiceLabels();
    const service_slider = this.GetServicesSliders();
    const service_videos = this.GetServiceVideos();
    const serviceData = this.GetServicesData();
    MobileDetail.servicePage = this.GetMappedServicePageDataByCurrentMobileData(
      service_images,
      service_labels,
      service_videos,
      serviceData,
      service_slider
    );
    const welcome_images = this.GetWelcomePageImages();
    const welcome_labels = this.GetWelcomePageLabels();
    const welcome_slider = this.GetWelcomeSliders();
    const welcome_videos = this.GetWelcomePageVideos();
    MobileDetail.welcomePage = this.GetMappedWelcomePageDataByCurrentMobileData(
      welcome_images,
      welcome_labels,
      welcome_videos,
      welcome_slider
    );
    const no_queue_images = this.GetNoQueuePageImages();
    const no_queue_labels = this.GetNoQueuePageLabels();
    const no_queue_sliders = this.GetNoQueueSliders();
    const no_queue_videos = this.GetNoQueuePageVideos();
    MobileDetail.noQueuePage = this.GetMappedNoQueuePageDataByCurrentMobileData(
      no_queue_images,
      no_queue_labels,
      no_queue_videos,
      no_queue_sliders
    );
    const offline_images = this.GetOfflinePageImages();
    const offline_labels = this.GetOfflinePageLabels();
    const offline_sliders = this.GetOfflineSliders();
    const offline_videos = this.GetOfflinePageVideos();
    MobileDetail.offLinePage = this.GetMappedOfflinePageDataByCurrentMobileData(
      offline_images,
      offline_labels,
      offline_sliders,
      offline_videos
    );
    const language_images = this.GetLanguagePageImages();
    const language_labels = this.GetLanguagePageLabels();
    const language_slider = this.GetLanguageSliders();
    const language_videos = this.GetLanguagePageVideos();
    MobileDetail.languagePage =
      this.GetMappedLanguagePageDataByCurrentMobileData(
        language_images,
        language_labels,
        language_videos,
        language_slider
      );
    const marketing_Page_images = this.GetMarketingPageImages();
    const marketing_Page_labels = this.GetMarketingPageLabels();
    const marketing_Page_slider = this.GetMarketingSliders();
    const marketing_Page_videos = this.GetMarketingPageVideos();
    MobileDetail.marketingPage =
      this.GetMappedOtherControlPageDataByCurrentMobileData(
        marketing_Page_images,
        marketing_Page_labels,
        marketing_Page_videos,
        marketing_Page_slider
      );
    MobileDetail.marketingPage.otherControlsCount =
      this.MobileInterfaceData.marketingPageData.otherControlsCount;

    const ticket_Page_images = this.GetTicketPageImages();
    const ticket_Page_labels = this.GetTicketPageLabels();
    const ticket_Page_videos = this.GetTicketPageVideos();
    const ticket_Page_slider = this.GetTicketSliders();
    MobileDetail.ticketPage = this.GetMappedTicketPageDataByCurrentMobileData(
      ticket_Page_images,
      ticket_Page_labels,
      ticket_Page_videos,
      ticket_Page_slider
    );
    const survey_Page_images = this.GetSurveyPageImages();
    const survey_Page_labels = this.GetSurveyPageLabels();
    const survey_Page_videos = this.GetSurveyPageVideos();
    const survey_Page_slider = this.GetSurveySliders();
    const survey_question_questionSet = this.GetSurveyQuestionsData();
    MobileDetail.surveyPage =
      this.GetMappedSurveyQuestionPageDataByCurrentMobileData(
        survey_Page_images,
        survey_Page_labels,
        survey_question_questionSet,
        survey_Page_videos,
        survey_Page_slider,
      );
    MobileDetail.surveyPage.otherControlsCount =
      this.MobileInterfaceData.surveyPageData.otherControlsCount;

    const thank_you_images = this.GetThankYouImages();
    const thank_you_labels = this.GetThankYouPageLabels();
    const thank_you_slider = this.GetThankYouSliders();
    const thank_you_videos = this.GetThankYouVideos();
    MobileDetail.thankYouPage =
      this.GetMappedThankYouPageDataByCurrentMobileData(
        thank_you_images,
        thank_you_labels,
        thank_you_videos,
        thank_you_slider
      );
    const service_question_images = this.GetServiceQuestionImages();
    const service_question_slider = this.GetServiceQuestionSliders();
    const service_question_labels = this.GetServiceQuestionLabels();
    const service_question_videos = this.GetServiceQuestionVideos();
    const service_question_questionSet = this.GetServiceQuestionsData();
    MobileDetail.serviceQuestion =
      this.GetMappedServiceQuestionPageDataByCurrentMobileData(
        service_question_images,
        service_question_labels,
        service_question_questionSet,
        service_question_videos,
        service_question_slider
      );
    MobileDetail.headerData = this.GetMappedHeaderData();
    MobileDetail.footerData = this.GetMappedFooterData();

    return MobileDetail;
  }

  GetMappedFooterData(): IMobileFooterData {
    return {
      color: this.MobileInterfaceData.footerData.styles.color,
      font: this.MobileInterfaceData.footerData.styles.font,
      fontSize: this.MobileInterfaceData.footerData.styles.fontSize,
      fontStyle: this.MobileInterfaceData.footerData.styles.fontStyle,
      fontWeight: this.MobileInterfaceData.footerData.styles.fontWeight,
      footerImage: this.MobileInterfaceData.footerData.footerImage,
      text: this.MobileInterfaceData.footerData.text,
      isVisible: this.MobileInterfaceData.footerData.isVisible,
      isTextVisible: this.MobileInterfaceData.footerData.isTextVisible,
      isFooterImageVisible: this.MobileInterfaceData.footerData.isFooterImageVisible,
      isLogoVisible: this.MobileInterfaceData.footerData.isLogoVisible,
      footerLogo: this.MobileInterfaceData.footerData.footerLogo
    };
  }
  GetMappedHeaderData(): IMobileHeaderData {
    return {
      isVisible: this.MobileInterfaceData.headerData.isVisible,
      backGroundImage: this.MobileInterfaceData.headerData.backgroundImage,
      verticalPadding: this.MobileInterfaceData.headerData.verticalPadding,
      horizontalPadding: this.MobileInterfaceData.headerData.horizontalPadding,
      logoPosition: this.MobileInterfaceData.headerData.logoPosition,
      height: this.MobileInterfaceData.headerData.height
    };
  }

  private GetMappedDesignScreenDataByCurrentMobileData() {
    return {
      height: this.MobileInterfaceData.designerScreen.styles.height,
      workFlowName: this.MobileInterfaceData.designerScreen.workFlowName,
      WorkFlowId: this.MobileInterfaceData.designerScreen.workFlowId,
      backGroundImage: this.MobileInterfaceData.designerScreen.backgroundImage,
      color: this.MobileInterfaceData.designerScreen.styles.color,
      backgroundColor:
        this.MobileInterfaceData.designerScreen.styles.backgroundColor,
      font: this.MobileInterfaceData.designerScreen.styles.font,
      fontSize: this.MobileInterfaceData.designerScreen.styles.fontSize,
      fontStyle: this.MobileInterfaceData.designerScreen.styles.fontStyle,
      fontWeight: this.MobileInterfaceData.designerScreen.styles.fontWeight,
      templateName: this.MobileInterfaceData.designerScreen.name,
      workFlowId: this.MobileInterfaceData.designerScreen.workFlowId,
      templateId: this.browserStorageService.MobileInterfaceId
        ? this.browserStorageService.MobileInterfaceId
        : this.uuid,
      width: this.MobileInterfaceData.designerScreen.styles.width,
      languageId: null,
      waitingTime: this.MobileInterfaceData.designerScreen.waitingTime,
    };
  }

  private GetMappedPagePropertiesDataByCurrentMobileData() {
    return {
      hideWelcomePage: this.MobileInterfaceData.pageProperties.hideWelcomePage,
      hideThankYouPage: this.MobileInterfaceData.pageProperties.hideThankYouPage
    };
  }

  private GetMappedServicePageDataByCurrentMobileData(
    service_images: IMobileImageControlData[],
    service_labels: IMobileLabelControlData[],
    service_videos: IMobileVideoControlData[],
    item: IMobilePanelItemsData[],
    service_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: service_images,
      labels: service_labels,
      sliders: service_sliders,
      videos: service_videos,
      otherControlsCount:
        this.MobileInterfaceData.servicePageData.otherControlsCount,
      panel: {
        boxCorner:
          this.MobileInterfaceData.servicePageData.panel?.styles.boxRoundCorners,
        fontWeight:
          this.MobileInterfaceData.servicePageData.panel?.styles.fontWeight,
        backgroundColor:
          this.MobileInterfaceData.servicePageData.panel?.styles.backgroundColor,
        font: this.MobileInterfaceData.servicePageData.panel?.styles.font,
        fontSize:
          this.MobileInterfaceData.servicePageData.panel?.styles.fontSize,
        fontStyle:
          this.MobileInterfaceData.servicePageData.panel?.styles.fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.servicePageData.panel?.horizontalPadding,
        height: this.MobileInterfaceData.servicePageData.panel?.styles.height,
        left: this.MobileInterfaceData.servicePageData.panel?.styles.left,
        top: this.MobileInterfaceData.servicePageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.servicePageData.panel?.verticalPadding,
        width: this.MobileInterfaceData.servicePageData.panel?.styles.width,
        primaryColor:
          this.MobileInterfaceData.servicePageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.servicePageData.panel?.dynamicTextColor,
        showServiceIcons:
          this.MobileInterfaceData.servicePageData.panel?.showServiceIcons,
      },
      buttons: this.GetServiceButtons(),
      items: item,
    };
  }

  GetServiceButtons() {
    const buttons: IMobileButtonData[] = [];
    this.MobileInterfaceData.servicePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        backgroundColor: x.styles.backgroundColor,
        text: x.text,
        boxRoundCorners: x.styles.boxRoundCorners,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        top: x.styles.top,
        height: x.styles.height,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        primaryButtonSrc: x?.primaryButtonSrc,
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
        isPrimaryButton: x.isPrimaryButtonSelected,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetMappedServiceQuestionPageDataByCurrentMobileData(
    service_question_images: IMobileImageControlData[],
    service_question_labels: IMobileLabelControlData[],
    item: IMobileQuestionSetData[],
    service_question_videos: IMobileVideoControlData[],
    service_question_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: service_question_images,
      labels: service_question_labels,
      sliders: service_question_sliders,
      videos: service_question_videos,
      otherControlsCount:
        this.MobileInterfaceData.serviceQuestionPageData.otherControlsCount,
      panel: {
        boxCorner:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
            .boxRoundCorners,
        backgroundColor:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
            .backgroundColor,
        font: this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
          .font,
        fontSize:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
            .fontSize,
        fontStyle:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
            .fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.serviceQuestionPageData.panel
            ?.horizontalPadding,
        height:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles.height,
        left: this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
          .left,

        top: this.MobileInterfaceData.serviceQuestionPageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.serviceQuestionPageData.panel
            ?.verticalPadding,
        width:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles.width,
        fontWeight:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles
            .fontWeight,
        primaryColor:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.serviceQuestionPageData.panel
            ?.dynamicTextColor,
      },
      button: {
        top: null,
        color:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .color,
        backgroundColor:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .backgroundColor,
        boxCorner:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .boxRoundCorners,
        fontSize:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .fontSize,
        fontWeight:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .fontWeight,
        font: this.MobileInterfaceData.serviceQuestionPageData.panel?.button
          ?.styles.font,
        fontStyle:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .fontStyle,
        text: this.MobileInterfaceData.serviceQuestionPageData.panel?.button
          ?.text,
        name: this.MobileInterfaceData.serviceQuestionPageData.panel?.button
          ?.name,
        verticalPadding:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.verticalPadding,
        horizontalPadding:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.horizontalPadding,
        height:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .height,
        boxRoundCorners:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.styles
            .boxRoundCorners,
        secondaryButtonText:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.secondaryButtonText,
        primaryButtonSrc:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.primaryButtonSrc,
        secondaryButtonSrc:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.secondaryButtonSrc,
        showPrimaryButtonIcon:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.showPrimaryButtonIcon,
        showSecondaryButtonIcon:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.showSecondaryButtonIcon,
        isPrimaryButton:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.isPrimaryButtonSelected,
        border:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.border,
        borderColor:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button
            ?.borderColor,
        shadow:
          this.MobileInterfaceData.serviceQuestionPageData.panel?.button?.shadow,
      },
      itemSet: item,
    };
  }

  private GetMappedSurveyQuestionPageDataByCurrentMobileData(
    survey_question_images: IMobileImageControlData[],
    survey_question_labels: IMobileLabelControlData[],
    item: IMobileQuestionSetData[],
    survey_question_videos: IMobileVideoControlData[],
    survey_question_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: survey_question_images,
      labels: survey_question_labels,
      sliders: survey_question_sliders,
      videos: survey_question_videos,
      otherControlsCount:
        this.MobileInterfaceData.surveyPageData.otherControlsCount,
      panel: {
        boxCorner:
          this.MobileInterfaceData.surveyPageData.panel?.styles
            .boxRoundCorners,
        backgroundColor:
          this.MobileInterfaceData.surveyPageData.panel?.styles
            .backgroundColor,
        font: this.MobileInterfaceData.surveyPageData.panel?.styles
          .font,
        fontSize:
          this.MobileInterfaceData.surveyPageData.panel?.styles
            .fontSize,
        fontStyle:
          this.MobileInterfaceData.surveyPageData.panel?.styles
            .fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.surveyPageData.panel
            ?.horizontalPadding,
        height:
          this.MobileInterfaceData.surveyPageData.panel?.styles.height,
        left: this.MobileInterfaceData.surveyPageData.panel?.styles
          .left,

        top: this.MobileInterfaceData.surveyPageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.surveyPageData.panel
            ?.verticalPadding,
        width:
          this.MobileInterfaceData.surveyPageData.panel?.styles.width,
        fontWeight:
          this.MobileInterfaceData.surveyPageData.panel?.styles
            .fontWeight,
        primaryColor:
          this.MobileInterfaceData.surveyPageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.surveyPageData.panel
            ?.dynamicTextColor,
      },
      button: {
        top: null,
        color:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .color,
        backgroundColor:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .backgroundColor,
        boxCorner:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .boxRoundCorners,
        fontSize:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .fontSize,
        fontWeight:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .fontWeight,
        font: this.MobileInterfaceData.surveyPageData.panel?.button
          ?.styles.font,
        fontStyle:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .fontStyle,
        text: this.MobileInterfaceData.surveyPageData.panel?.button
          ?.text,
        name: this.MobileInterfaceData.surveyPageData.panel?.button
          ?.name,
        verticalPadding:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.verticalPadding,
        horizontalPadding:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.horizontalPadding,
        height:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .height,
        boxRoundCorners:
          this.MobileInterfaceData.surveyPageData.panel?.button?.styles
            .boxRoundCorners,
        secondaryButtonText:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.secondaryButtonText,
        primaryButtonSrc:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.primaryButtonSrc,
        secondaryButtonSrc:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.secondaryButtonSrc,
        showPrimaryButtonIcon:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.showPrimaryButtonIcon,
        showSecondaryButtonIcon:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.showSecondaryButtonIcon,
        isPrimaryButton:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.isPrimaryButtonSelected,
        border:
          this.MobileInterfaceData.surveyPageData.panel?.button?.border,
        borderColor:
          this.MobileInterfaceData.surveyPageData.panel?.button
            ?.borderColor,
        shadow:
          this.MobileInterfaceData.surveyPageData.panel?.button?.shadow,
      },
      itemSet: item,
    };
  }

  private GetMappedPreServiceQuestionPageDataByCurrentMobileData(
    pre_service_images: IMobileImageControlData[],
    pre_service_labels: IMobileLabelControlData[],
    pre_service_videos: IMobileVideoControlData[],
    item: IMobilePanelItemsData[],
    pre_service_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: pre_service_images,
      labels: pre_service_labels,
      videos: pre_service_videos,
      sliders: pre_service_sliders,
      otherControlsCount:
        this.MobileInterfaceData.globalQuestionPageData.otherControlsCount,
      panel: {
        boxCorner:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles
            .boxRoundCorners,
        backgroundColor:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles
            .backgroundColor,
        font: this.MobileInterfaceData.globalQuestionPageData.panel?.styles
          .font,
        fontSize:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles
            .fontSize,
        fontStyle:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles
            .fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.globalQuestionPageData.panel
            ?.horizontalPadding,
        height:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles.height,
        left: this.MobileInterfaceData.globalQuestionPageData.panel?.styles
          .left,
        top: this.MobileInterfaceData.globalQuestionPageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.globalQuestionPageData.panel
            ?.verticalPadding,
        width:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles.width,
        fontWeight:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles
            .fontWeight,
        primaryColor:
          this.MobileInterfaceData.globalQuestionPageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.globalQuestionPageData.panel
            ?.dynamicTextColor,
      },
      buttons: this.MobileInterfaceData.globalQuestionPageData.panel
        ? this.GetGlobalQuestionButtons()
        : null,
      items: item,
    };
  }

  private GetGlobalQuestionButtons() {
    const buttons = [];
    buttons.push({
      top: null,
      color:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .color,
      backgroundColor:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .backgroundColor,
      boxCorner:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .boxRoundCorners,
      fontSize:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .fontSize,
      fontWeight:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .fontWeight,
      font: this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
        .font,
      fontStyle:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .fontStyle,
      text: this.MobileInterfaceData.globalQuestionPageData.panel?.button?.text,
      name: this.MobileInterfaceData.globalQuestionPageData.panel?.button?.name,
      verticalPadding:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button
          ?.verticalPadding,
      horizontalPadding:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button
          ?.horizontalPadding,
      height:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          ?.height,
      boxRoundCorners:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button?.styles
          .boxRoundCorners,
      primaryButtonSrc:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button
          ?.primaryButtonSrc,
      showPrimaryButtonIcon:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button
          ?.showPrimaryButtonIcon,
      isPrimaryButton:
        this.MobileInterfaceData.globalQuestionPageData.panel?.button
          ?.isPrimaryButtonSelected,
    });
    this.MobileInterfaceData.globalQuestionPageData.buttons.forEach((x) => {
      if (x && x.name !== this.ContinueButtonName) {
        buttons.push({
          top: x.styles.top,
          color: x.styles.color,
          backgroundColor: x.styles.backgroundColor,
          boxCorner: x.styles.boxRoundCorners,
          fontSize: x.styles.fontSize,
          fontWeight: x.styles.fontWeight,
          font: x.styles.font,
          fontStyle: x.styles.fontStyle,
          text: x.text,
          name: x.name,
          verticalPadding: x.verticalPadding,
          horizontalPadding: x.horizontalPadding,
          height: x.styles.height,
          boxRoundCorners: x.styles.boxRoundCorners,
          primaryButtonSrc: x?.primaryButtonSrc,
          showPrimaryButtonIcon: x.showPrimaryButtonIcon,
          isPrimaryButton: x.isPrimaryButtonSelected,
        });
      }
    });
    return buttons;
  }

  private GetMappedThankYouPageDataByCurrentMobileData(
    thank_you_images: IMobileImageControlData[],
    thank_you_labels: IMobileLabelControlData[],
    thank_you_videos: IMobileVideoControlData[],
    thank_You_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: thank_you_images,
      labels: thank_you_labels,
      videos: thank_you_videos,
      sliders: thank_You_sliders,
      otherControlsCount:
        this.MobileInterfaceData.thankYouPageData.otherControlsCount,
    };
  }
  private GetMappedOtherControlPageDataByCurrentMobileData(
    welcome_images: IMobileImageControlData[],
    welcome_labels: IMobileLabelControlData[],
    welcome_videos: IMobileVideoControlData[],
    welcome_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: welcome_images,
      labels: welcome_labels,
      videos: welcome_videos,
      sliders: welcome_sliders,
      otherControlsCount: null,
      // buttons: welcome_buttons
    };
  }
  private GetMappedTicketPageDataByCurrentMobileData(
    welcome_images: IMobileImageControlData[],
    welcome_labels: IMobileLabelControlData[],
    welcome_videos: IMobileVideoControlData[],
    welcome_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: welcome_images,
      labels: welcome_labels,
      videos: welcome_videos,
      sliders: welcome_sliders,
      otherControlsCount:
        this.MobileInterfaceData.ticketPageData.otherControlsCount,
      panel: {
        boxCorner:
          this.MobileInterfaceData.ticketPageData.panel?.styles.boxRoundCorners,
        backgroundColor:
          this.MobileInterfaceData.ticketPageData.panel?.styles.backgroundColor,
        font: this.MobileInterfaceData.ticketPageData.panel?.styles.font,
        fontSize:
          this.MobileInterfaceData.ticketPageData.panel?.styles.fontSize,
        fontStyle:
          this.MobileInterfaceData.ticketPageData.panel?.styles.fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.ticketPageData.panel?.horizontalPadding,
        height: this.MobileInterfaceData.ticketPageData.panel?.styles.height,
        left: this.MobileInterfaceData.ticketPageData.panel?.styles.left,
        top: this.MobileInterfaceData.ticketPageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.ticketPageData.panel?.verticalPadding,
        width: this.MobileInterfaceData.ticketPageData.panel?.styles.width,
        fontWeight:
          this.MobileInterfaceData.ticketPageData.panel?.styles.fontWeight,
        primaryColor:
          this.MobileInterfaceData.ticketPageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.ticketPageData.panel?.dynamicTextColor,
      },
      buttons: this.GetTicketPageButtons(),
      items: this.GetTicketControlItems(),
    };
  }

  GetTicketControlItems() {
    const items: IMobileTicketControlItemData[] = [];
    this.MobileInterfaceData.ticketPageData.panel.items.forEach((x) => {
      items.push({
        type: x.type,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontWeight: x.styles.fontWeight,
        fontStyle: x.styles.fontStyle,
        text: x.text,
        visible: x.visible,
        value: x.value,
        color: x.styles.color,
        backgroundColor: x.styles.backgroundColor,
        boxRoundCorners: x.styles.boxRoundCorners,
        height: x.styles.height,
        width: x.styles.width,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        showItem: x.showItem,
        valuesFont: x.valuesFont,
        valuesFontSize: x.valuesFontSize,
        valuesFontStyle: x.valuesFontStyle,
        valuesFontWeight: x.valuesFontWeight,
      });
    });
    return items;
  }

  private GetMappedWelcomePageDataByCurrentMobileData(
    welcome_images: IMobileImageControlData[],
    welcome_labels: IMobileLabelControlData[],
    welcome_videos: IMobileVideoControlData[],
    welcome_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: welcome_images,
      labels: welcome_labels,
      videos: welcome_videos,
      sliders: welcome_sliders,
      otherControlsCount:
        this.MobileInterfaceData.welcomePageData.otherControlsCount,
      button: {
        top: this.MobileInterfaceData.welcomePageData.button?.styles.top,

        color: this.MobileInterfaceData.welcomePageData.button?.styles.color,
        backgroundColor:
          this.MobileInterfaceData.welcomePageData.button?.styles
            .backgroundColor,
        boxCorner:
          this.MobileInterfaceData.welcomePageData.button?.styles
            .boxRoundCorners,
        fontSize:
          this.MobileInterfaceData.welcomePageData.button?.styles.fontSize,
        fontWeight:
          this.MobileInterfaceData.welcomePageData.button?.styles.fontWeight,
        font: this.MobileInterfaceData.welcomePageData.button?.styles.font,
        fontStyle:
          this.MobileInterfaceData.welcomePageData.button?.styles.fontStyle,
        text: this.MobileInterfaceData.welcomePageData.button?.text,
        name: this.MobileInterfaceData.welcomePageData.button?.name,
        verticalPadding:
          this.MobileInterfaceData.welcomePageData.button?.verticalPadding,
        horizontalPadding:
          this.MobileInterfaceData.welcomePageData.button?.horizontalPadding,
        height: this.MobileInterfaceData.welcomePageData.button?.styles.height,
        boxRoundCorners:
          this.MobileInterfaceData.welcomePageData.button?.styles
            .boxRoundCorners,
        primaryButtonSrc:
          this.MobileInterfaceData.welcomePageData.button?.primaryButtonSrc,
        showPrimaryButtonIcon:
          this.MobileInterfaceData.welcomePageData.button?.showPrimaryButtonIcon,
        isPrimaryButton:
          this.MobileInterfaceData.welcomePageData.button
            ?.isPrimaryButtonSelected,
        border: this.MobileInterfaceData.welcomePageData.button?.border,
        borderColor:
          this.MobileInterfaceData.welcomePageData.button?.borderColor,
        shadow: this.MobileInterfaceData.welcomePageData.button?.shadow,
      },
    };
  }

  private GetMappedNoQueuePageDataByCurrentMobileData(
    no_queue_images: IMobileImageControlData[],
    no_queue_labels: IMobileLabelControlData[],
    no_queue_videos: IMobileVideoControlData[],
    no_queue_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: no_queue_images,
      labels: no_queue_labels,
      videos: no_queue_videos,
      sliders: no_queue_sliders,
      otherControlsCount:
        this.MobileInterfaceData.noQueuePageData.otherControlsCount,
      buttons: this.GetNoQueuePageButtons()
    };
  }

  private GetMappedOfflinePageDataByCurrentMobileData(
    offline_images: IMobileImageControlData[],
    offline_labels: IMobileLabelControlData[],
    offline_sliders: IMobileSliderControlData[],
    offline_videos: IMobileVideoControlData[], 
  ) {
    return {
      images: offline_images,
      labels: offline_labels,
      videos: offline_videos,
      sliders: offline_sliders,
      otherControlsCount:
        this.MobileInterfaceData.offLinePageData.otherControlsCount,
      buttons: this.GetOfflinePageButtons()
    };
  }

  private GetMappedLanguagePageDataByCurrentMobileData(
    welcome_images: IMobileImageControlData[],
    welcome_labels: IMobileLabelControlData[],
    welcome_videos: IMobileVideoControlData[],
    welcome_sliders: IMobileSliderControlData[]
  ) {
    return {
      images: welcome_images,
      labels: welcome_labels,
      videos: welcome_videos,
      sliders: welcome_sliders,
      otherControlsCount:
        this.MobileInterfaceData.languagePageData.otherControlsCount,

      panel: {
        boxCorner:
          this.MobileInterfaceData.languagePageData.panel?.styles
            .boxRoundCorners,
        backgroundColor:
          this.MobileInterfaceData.languagePageData.panel?.styles
            .backgroundColor,
        font: this.MobileInterfaceData.languagePageData.panel?.styles.font,
        fontSize:
          this.MobileInterfaceData.languagePageData.panel?.styles.fontSize,
        fontStyle:
          this.MobileInterfaceData.languagePageData.panel?.styles.fontStyle,
        horizontalPadding:
          this.MobileInterfaceData.languagePageData.panel?.horizontalPadding,
        height: this.MobileInterfaceData.languagePageData.panel?.styles.height,
        left: this.MobileInterfaceData.languagePageData.panel?.styles.left,
        top: this.MobileInterfaceData.languagePageData.panel?.styles.top,
        verticalPadding:
          this.MobileInterfaceData.languagePageData.panel?.verticalPadding,
        width: this.MobileInterfaceData.languagePageData.panel?.styles.width,
        fontWeight:
          this.MobileInterfaceData.languagePageData.panel?.styles.fontWeight,
        primaryColor:
          this.MobileInterfaceData.languagePageData.panel?.styles.color,
        secondaryColor:
          this.MobileInterfaceData.languagePageData.panel?.dynamicTextColor,
      },
      // buttons: welcome_buttons
    };
  }
  private GetPreServiceQuestionImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.globalQuestionPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetPreServiceQuestionSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.globalQuestionPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetThankYouSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.globalQuestionPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetTicketSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.ticketPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetTicketPageButtons() {
    const buttons: IMobileButtonData[] = [];
    this.MobileInterfaceData.ticketPageData.buttonPanel.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        top: x.styles.top,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
        color: x.styles.color,
        backgroundColor: x.styles.backgroundColor,
        boxRoundCorners: x.styles.boxRoundCorners,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontWeight: x.styles.fontWeight,
        fontStyle: x.styles.fontStyle,
        text: x.text,
        primaryButtonSrc: x?.primaryButtonSrc,
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
        isPrimaryButton: x.isPrimaryButtonSelected,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetNoQueuePageButtons() {
    const buttons: IMobileButtonData[] = [];
    this.MobileInterfaceData.noQueuePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        top: x.styles.top,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
        color: x.styles.color,
        backgroundColor: x.styles.backgroundColor,
        boxRoundCorners: x.styles.boxRoundCorners,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontWeight: x.styles.fontWeight,
        fontStyle: x.styles.fontStyle,
        text: x.text,
        primaryButtonSrc: x?.primaryButtonSrc,
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
        isPrimaryButton: x.isPrimaryButtonSelected,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetOfflinePageButtons() {
    const buttons: IMobileButtonData[] = [];
    this.MobileInterfaceData.offLinePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        top: x.styles.top,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
        color: x.styles.color,
        backgroundColor: x.styles.backgroundColor,
        boxRoundCorners: x.styles.boxRoundCorners,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontWeight: x.styles.fontWeight,
        fontStyle: x.styles.fontStyle,
        text: x.text,
        primaryButtonSrc: x.primaryButtonSrc,
        showPrimaryButtonIcon: x.showPrimaryButtonIcon,
        isPrimaryButton: x.isPrimaryButtonSelected,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetSurveySliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.surveyPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetSurveyQuestionsData() {
    const questionSet: IMobileQuestionSetData[] = [];
    if (this.MobileInterfaceData.surveyPageData.questionSetList) {
      this.MobileInterfaceData.surveyPageData.questionSetList.forEach(
        (element) => {
          questionSet.push({
            itemSetId: element.itemSetId,
            items: element.items,
          });
        }
      );
    }
    return questionSet;
  }

  private GetMarketingSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.marketingPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetWelcomeSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.welcomePageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }
  private GetNoQueueSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.noQueuePageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetOfflineSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.offLinePageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetLanguageSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.languagePageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }
  private GetServicesSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.servicePageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  private GetServiceQuestionSliders() {
    const slider: IMobileSliderControlData[] = [];
    this.MobileInterfaceData.serviceQuestionPageData.sliders.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src),
        urls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
        verticalPadding: x.verticalPadding,
        horizontalPadding: x.horizontalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return slider;
  }

  GetUrls(src) {
    const urls = [];
    src.forEach((element) => {
      urls.push({
        language: element.language,
        languageCode: element.languageCode,
        [element.languageCode]: element[element.languageCode],
        url: element.url.length > 0 ? element.url : [],
      });
    });
    return urls;
  }

  private GetPreServiceQuestionVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.globalQuestionPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetPreServiceQuestionLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.globalQuestionPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }

  private GetPreServiceQuestionQuestions() {
    const questions: IMobilePanelItemsData[] = [];
    if (this.MobileInterfaceData.globalQuestionPageData.panel) {
      this.MobileInterfaceData.globalQuestionPageData.panel.items.forEach(
        (x) => {
          questions.push({
            itemId: x.itemId,
            isItemSelected: false,
          });
        }
      );
    }
    return questions;
  }

  private GetThankYouImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.thankYouPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }
  private GetThankYouVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.thankYouPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }
  private GetThankYouPageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.thankYouPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetTicketPageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.ticketPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }
  private GetTicketPageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.ticketPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }
  private GetTicketPageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.ticketPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetSurveyPageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.surveyPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }
  private GetSurveyPageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.surveyPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }
  private GetSurveyPageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.surveyPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetMarketingPageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.marketingPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }
  private GetMarketingPageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.marketingPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }
  private GetMarketingPageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.marketingPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetWelcomePageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.welcomePageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetNoQueuePageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.noQueuePageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetOfflinePageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.offLinePageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetLanguagePageImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.languagePageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetWelcomePageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.welcomePageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetNoQueuePageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.noQueuePageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetOfflinePageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.offLinePageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetLanguagePageVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.languagePageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetWelcomePageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.welcomePageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetNoQueuePageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.offLinePageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }

  private GetOfflinePageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.offLinePageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }

  private GetLanguagePageLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.languagePageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetServiceQuestionLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.serviceQuestionPageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }
  private GetServiceQuestionImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.serviceQuestionPageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }
  private GetServiceQuestionVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.serviceQuestionPageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetServiceQuestionsData() {
    const questionSet: IMobileQuestionSetData[] = [];
    if (this.MobileInterfaceData.serviceQuestionPageData.questionSetList) {
      this.MobileInterfaceData.serviceQuestionPageData.questionSetList.forEach(
        (element) => {
          questionSet.push({
            itemSetId: element.itemSetId,
            items: element.items,
          });
        }
      );
    }
    return questionSet;
  }

  private GetServiceImages() {
    const images: IMobileImageControlData[] = [];
    this.MobileInterfaceData.servicePageData.images.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return images;
  }

  private GetServiceVideos() {
    const videos: IMobileVideoControlData[] = [];
    this.MobileInterfaceData.servicePageData.videos.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
      });
    });
    return videos;
  }

  private GetServiceLabels() {
    const labels: IMobileLabelControlData[] = [];
    this.MobileInterfaceData.servicePageData.labels.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        hyperLink: x.hyperLink,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        horizontalPadding: x.horizontalPadding,
        verticalPadding: x.verticalPadding,
        boxCorner: x.styles.boxRoundCorners,
        backgroundColor: x.styles.backgroundColor,
        alignment: x.alignment,
      });
    });
    return labels;
  }

  private GetServicesData() {
    const questions: IMobilePanelItemsData[] = [];
    if (this.MobileInterfaceData.servicePageData.panel) {
      this.MobileInterfaceData.servicePageData.panel.items.forEach((x) => {
        questions.push({
          itemId: x.itemId,
          isItemSelected: x.isSelected,
        });
      });
    }
    return questions;
  }
  //#endregion
  // offline page handlers
  public GetRequestDocument(
    WorkFlow: IMobileWorkFlowDetail,
    isDoc?: boolean,
    isAppointment?: boolean
  ) {
    const documents = [
      this.GetWorkFlowDocument(WorkFlow ? WorkFlow : this.WorkFlowData, isDoc),
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
    WorkFlow: IMobileWorkFlowDetail,
    isDoc: boolean
  ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null,
    };
  }

  OnOffLinePageButtonSelection() {
    this.ResetOffLinePageControlSelection();
    this.OffLinePageDataSubject.value.controlSelection.IsButtonSelected = true;
    this.OffLinePageDataSubject.next(this.OffLinePageDataSubject.value);
  }

  ResetOffLinePageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.OffLinePageDataSubject.value.controlSelection
    )) {
      this.OffLinePageDataSubject.value.controlSelection[propertyKey] = false;
    }
  }

  ChangePage(pageNumber: string) {
    this.CurrentPageSubject.next(this.GetCurrentPage(pageNumber));
    this.SendCurrentPageData();
  }
  SendCurrentPageData() {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.UpdateValuesOfOfflinePageSubject();
    }
  }
  UpdatedDesignerPanelDetail(designerPanelControl: DesignerPanelControl) {
    this.MobileInterfaceData.designerScreen = designerPanelControl;
    this.UpdateValuesOfDesignerScreenPanelSubject();
  }
  UpdatedFooterControlDetail(footerControlData: FooterControl) {
    this.MobileInterfaceData.footerData = footerControlData;
    this.UpdateValuesOfFooterControlPanelSubject();
  }
  UpdatedHeaderControlDetail(headerControlData: HeaderControl) {
    this.MobileInterfaceData.headerData = headerControlData;
    this.UpdateValuesOfHeaderControlPanelSubject();
  }

  ChangeOtherControlPropertyWindow(name: string) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.marketingPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.welcomePageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.languagePageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.servicePageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.globalQuestionPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.thankYouPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.ticketPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.surveyPageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.noQueuePageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.otherControlList.map(
        (x) => (x.showPropertyWindow = false)
      );
      this.MobileInterfaceData.offLinePageData.otherControlList.find(
        (x) => x.control.name === name
      ).showPropertyWindow = true;
      this.UpdateValuesOfOfflinePageSubject();
    }
  }

  UpdateOtherControlData(control: Control) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.marketingPageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.welcomePageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.servicePageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.MobileInterfaceData.globalQuestionPageData.otherControlList,
            control.name
          )
        );
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        [].concat(
          this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
            this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
            control.name
          )
        );
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.thankYouPageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.ticketPageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.surveyPageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.noQueuePageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.offLinePageData.otherControlList,
          control.name
        )
      );
      this.UpdateValuesOfOfflinePageSubject();
    }
  }
  //#region Default Welcome page control initialization
  CreateAndSetItemsToWelcomePage(
    buttonBackgroundColor: string,
    buttonColor: string,
    buttonFont: string,
    buttonFontStyle: string,
    buttonFontSize: number,
    buttonFontWeight: string | number,
    buttonBoxCorner: string,
    buttonText: object,
    buttonHeight: number,
    buttonTop: number,
    showPrimaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    buttonBorder: string,
    buttonBorderColor: string,
    buttonShadow: boolean
  ) {
    this.MobileInterfaceData.welcomePageData.button = this.CreateButtonControl(
      'Start Button',
      buttonText,
      buttonColor,
      buttonFont,
      buttonFontStyle,
      buttonFontSize,
      buttonFontWeight,
      buttonBackgroundColor,
      '15',
      '20',
      buttonBoxCorner,
      buttonHeight,
      100,
      buttonTop,
      true,
      showPrimaryButtonIcon,
      false,
      primaryButtonSrc,
      null,
      buttonBorder,
      buttonBorderColor,
      buttonShadow
    );
    this.UpdateValuesOfWelcomePageSubject();
  }

  //#endregion
  //#region Default Language page control initialization
  CreateAndSetItemsToLanguagePage(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    horizontalPadding: string,
    verticalPadding: string
  ) {
    this.MobileInterfaceData.languagePageData.panel = this.CreatePanelControl(
      height,
      top,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      boxCorner,
      '',
      horizontalPadding,
      verticalPadding
    );
    this.LanguageListSubject.value.forEach((item) => {
      this.MobileInterfaceData.languagePageData.panel.items.push(
        this.CreateItemControl(
          item.language,
          item.languageCode,
          false,
          true,
          '',
          true
        )
      );
    });
    this.UpdateValuesOfLanguagePageSubject();
  }

  //#endregion

  //#region Default Ticket page control initialization
  CreateAndSetItemsToTicketPage(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    horizontalPadding: string,
    verticalPadding: string,
    buttons?: IMobileButtonData[],
    items?: IMobileTicketControlItemData[]
  ) {
    this.MobileInterfaceData.ticketPageData.panel = this.CreateTicketControl(
      height,
      top,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      boxCorner,
      color,
      horizontalPadding,
      verticalPadding
    );
    if (!this.IsMobileTemplateIdExistInSession()) {
      const ServiceNameLabel = this.CreateDefaultLabelControl(
        'Service',
        { en: 'Service: %service.name%' },
        15
      );
      const TicketNumberLabel = this.CreateDefaultLabelControl(
        'Ticket Number',
        { en: 'Ticket Number: %request.ticketnumber% ' },
        44
      );
      this.AddLabelsToTicketPageLabels(ServiceNameLabel, TicketNumberLabel);
      this.AddControlToTicketPageOtherControlList(
        ServiceNameLabel,
        TicketNumberLabel
      );
    }
    this.AddTicketControlItems(items);
    this.AddButtonPanelItems(buttons);
    this.UpdateValuesOfTicketPageSubject();
  }

  private AddLabelsToTicketPageLabels(
    ServiceNameLabel: LabelControl,
    TicketNumberLabel: LabelControl
  ) {
    this.MobileInterfaceData.ticketPageData.labels = new Array<LabelControl>();
    this.MobileInterfaceData.ticketPageData.labels.push(ServiceNameLabel);
    this.MobileInterfaceData.ticketPageData.labels.push(TicketNumberLabel);
  }

  private AddControlToTicketPageOtherControlList(
    ServiceNameLabel: LabelControl,
    TicketNumberLabel: LabelControl
  ) {
    this.MobileInterfaceData.ticketPageData.otherControlList =
      new Array<IOtherControlDDL>();
    this.MobileInterfaceData.ticketPageData.otherControlList.push({
      control: ServiceNameLabel,
      isImageControl: false,
      isLabelControl: true,
      isSliderControl: false,
      isVideoControl: false,
      showPropertyWindow: true,
    });
    this.MobileInterfaceData.ticketPageData.otherControlList.push({
      control: TicketNumberLabel,
      isImageControl: false,
      isLabelControl: true,
      isSliderControl: false,
      isVideoControl: false,
      showPropertyWindow: false,
    });
  }

  private CreateDefaultLabelControl(
    name: string,
    defaultText,
    top: number,
    alignment = 'left'
  ) {
    const defaultColor = '#ffffff';
    const defaultHyperLink = '';
    const defaultHeight = 50;
    const defaultWidth = 60;
    const defaultZindex = 50;
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultHyperLink,
      defaultColor,
      defaultWidth,
      defaultHeight,
      top,
      0,
      defaultZindex,
      'Sans-serif',
      this.GeneralFontStyles.fontStyle,
      13,
      this.GeneralFontStyles.fontWeight,
      '',
      '10',
      '35',
      '10',
      alignment
    );
    return labelControl;
  }

  private AddButtonPanelItems(buttons: IMobileButtonData[]) {
    this.MobileInterfaceData.ticketPageData.buttonPanel =
      new Array<ButtonControl>();
    this.MobileInterfaceData.ticketPageData.buttonPanel.push(
      this.CreateButtonControl(
        'PrimaryButton',
        (buttons && buttons[0]?.text) || { en: 'Request More Time' },
        (buttons && buttons[0]?.color) || '#ffffff',
        (buttons && buttons[0]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[0]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[0]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) || 'bold',
        (buttons && buttons[0]?.backgroundColor) || '#6fb557',
        (buttons && buttons[0]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[0]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[0]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[0]?.height) || 82,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[0]?.top) || 300,
        true,
        (buttons && buttons[0]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[0]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[0]?.primaryButtonSrc) || [],
        (buttons && buttons[0]?.secondaryButtonSrc) || [],
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || '#6fb557',
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow,
        null,
        'Running Late'
      )
    );
    this.MobileInterfaceData.ticketPageData.buttonPanel.push(
      this.CreateButtonControl(
        'SecondaryButton',
        (buttons && buttons[1]?.text) || { en: 'Leave' },
        (buttons && buttons[1]?.color) || '#6fb557',
        (buttons && buttons[1]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[1]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[1]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) || 'bold',
        (buttons && buttons[1]?.backgroundColor) || '#173e2e',
        (buttons && buttons[1]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[1]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[1]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[1]?.height) || 82,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[1]?.top) || 380,
        true,
        (buttons && buttons[1]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[1]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[1]?.primaryButtonSrc) || [],
        (buttons && buttons[1]?.secondaryButtonSrc) || [],
        (buttons && buttons[1]?.border) || this.ButtonStyles.border,
        (buttons && buttons[1]?.borderColor) || '#6fb557',
        (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow,
        null,
        'Cancel'
      )
    );
  }

  private AddTicketControlItems(items: IMobileTicketControlItemData[]) {
    this.MobileInterfaceData.ticketPageData.panel.items.push(
      this.CreateTicketItemControl(
        (items && items[0]?.font) || this.DefaultControlFontStyles.font,
        (items && items[0]?.fontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[0]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[0]?.fontWeight) ||
        this.DefaultControlFontStyles.fontWeight,
        TicketItem.TicketNumber,
        (items && items[0]?.text) || { en: 'Ticket Number' },
        'A35',
        false,
        false,
        (items && items[0]?.color) || this.DefaultControlFontStyles.color,
        (items && items[0]?.backgroundColor) ||
        this.GeneralFontStyles.backgroundColor,
        (items && items[0]?.horizontalPadding) || this.HorizontalPadding,
        (items && items[0]?.boxRoundCorners) ||
        this.DefaultControlFontStyles.boxRoundCorners,
        (items && items[0]?.verticalPadding) || this.VerticalPadding,
        (items && items[0]?.height) || this.TicketItemStyles.height,
        (items && items[0]?.width) || this.TicketItemStyles.width,
        (items && items[0]?.showItem) || false,
        (items && items[0]?.valuesFont) || this.DefaultControlFontStyles.font,
        (items && items[0]?.valuesFontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[0]?.valuesFontSize) || 15,
        this.GetDefaultFontWeight(items && items[0]?.valuesFontWeight) ||
        this.DefaultControlFontStyles.fontWeight
      )
    );
    this.MobileInterfaceData.ticketPageData.panel.items.push(
      this.CreateTicketItemControl(
        (items && items[1]?.font) || this.DefaultControlFontStyles.font,
        (items && items[1]?.fontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[1]?.fontSize) || 25,
        this.GetDefaultFontWeight(items && items[1]?.fontWeight) || 'bold',
        TicketItem.PlaceInLine,
        (items && items[1]?.text) || { en: `You're currently guest number` },
        '5',
        true,
        true,
        (items && items[1]?.color) || '#000000',
        (items && items[1]?.backgroundColor) || '#ffffff',
        (items && items[1]?.horizontalPadding) || this.HorizontalPadding,
        (items && items[1]?.boxRoundCorners) ||
        this.DefaultControlFontStyles.boxRoundCorners,
        (items && items[1]?.verticalPadding) || this.VerticalPadding,
        (items && items[1]?.height) || 170,
        (items && items[1]?.width) || this.TicketItemStyles.width,
        (items && items[1]?.showItem) || true,
        (items && items[1]?.valuesFont) || this.DefaultControlFontStyles.font,
        (items && items[1]?.valuesFontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[1]?.valuesFontSize) || 50,
        this.GetDefaultFontWeight(items && items[1]?.valuesFontWeight) || 'bold'
      )
    );
    this.MobileInterfaceData.ticketPageData.panel.items.push(
      this.CreateTicketItemControl(
        (items && items[2]?.font) || this.DefaultControlFontStyles.font,
        (items && items[2]?.fontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[2]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[2]?.fontWeight) ||
        this.DefaultControlFontStyles.fontWeight,
        TicketItem.EstimatedWait,
        (items && items[2]?.text) || { en: 'Estimated wait time' },
        '15 minutes',
        true,
        false,
        (items && items[2]?.color) || this.DefaultControlFontStyles.color,
        (items && items[2]?.backgroundColor) ||
        this.GeneralFontStyles.backgroundColor,
        (items && items[2]?.horizontalPadding) || this.HorizontalPadding,
        (items && items[2]?.boxRoundCorners) ||
        this.DefaultControlFontStyles.boxRoundCorners,
        (items && items[2]?.verticalPadding) || this.VerticalPadding,
        (items && items[2]?.height) || this.TicketItemStyles.height,
        (items && items[2]?.width) || this.TicketItemStyles.width,
        (items && items[2]?.showItem) || false,
        (items && items[2]?.valuesFont) || this.DefaultControlFontStyles.font,
        (items && items[2]?.valuesFontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[2]?.valuesFontSize) || 15,
        this.GetDefaultFontWeight(items && items[2]?.valuesFontWeight) ||
        this.DefaultControlFontStyles.fontWeight
      )
    );
    this.MobileInterfaceData.ticketPageData.panel.items.push(
      this.CreateTicketItemControl(
        (items && items[1]?.font) || this.DefaultControlFontStyles.font,
        (items && items[1]?.fontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[1]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[1]?.fontWeight) ||
        this.DefaultControlFontStyles.fontWeight,
        TicketItem.AgentCalledNote,
        (items && items[1]?.text) || { en: 'Your number is called!' },
        '',
        false,
        false,
        (items && items[1]?.color) || this.DefaultControlFontStyles.color,
        (items && items[1]?.backgroundColor) ||
        this.DefaultControlFontStyles.backgroundColor,
        (items && items[1]?.horizontalPadding) || this.HorizontalPadding,
        (items && items[1]?.boxRoundCorners) ||
        this.DefaultControlFontStyles.boxRoundCorners,
        (items && items[1]?.verticalPadding) || this.VerticalPadding,
        (items && items[1]?.height) || this.TicketItemStyles.height,
        (items && items[1]?.width) || this.TicketItemStyles.width,
        (items && items[1]?.showItem) || true,
        (items && items[1]?.valuesFont) || this.DefaultControlFontStyles.font,
        (items && items[1]?.valuesFontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[1]?.valuesFontSize) || 15,
        this.GetDefaultFontWeight(items && items[1]?.valuesFontWeight) ||
        this.DefaultControlFontStyles.fontWeight
      )
    );
    this.MobileInterfaceData.ticketPageData.panel.items.push(
      this.CreateTicketItemControl(
        (items && items[2]?.font) || this.DefaultControlFontStyles.font,
        (items && items[2]?.fontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[2]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[2]?.fontWeight) ||
        this.DefaultControlFontStyles.fontWeight,
        TicketItem.AgentCalledMessage,
        (items && items[2]?.text) || { en: 'Please reach to ABC at desk OOK' },
        '',
        false,
        false,
        (items && items[2]?.color) || this.DefaultControlFontStyles.color,
        (items && items[2]?.backgroundColor) ||
        this.DefaultControlFontStyles.backgroundColor,
        (items && items[2]?.horizontalPadding) || this.HorizontalPadding,
        (items && items[2]?.boxRoundCorners) ||
        this.DefaultControlFontStyles.boxRoundCorners,
        (items && items[2]?.verticalPadding) || this.VerticalPadding,
        (items && items[2]?.height) || this.TicketItemStyles.height,
        (items && items[2]?.width) || this.TicketItemStyles.width,
        (items && items[2]?.showItem) || true,
        (items && items[2]?.valuesFont) || this.DefaultControlFontStyles.font,
        (items && items[2]?.valuesFontStyle) ||
        this.DefaultControlFontStyles.fontStyle,
        (items && items[2]?.valuesFontSize) || 15,
        this.GetDefaultFontWeight(items && items[2]?.valuesFontWeight) ||
        this.DefaultControlFontStyles.fontWeight
      )
    );
  }

  //#endregion

  //#region Default Service page control initialization
  CreateAndSetItemsToServicePanel(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    horizontalPadding: string,
    verticalPadding: string,
    isEdit: boolean,
    items: IMobilePanelItemsData[],
    services: IWorkFlowServiceData[],
    buttons: IMobileButtonData[],
    showServiceIcons: boolean
  ) {
    this.MobileInterfaceData.servicePageData.panel = this.CreatePanelControl(
      height,
      top,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      boxCorner,
      '',
      horizontalPadding,
      verticalPadding,
      showServiceIcons
    );
    this.AddButtonsToServicePage(buttons);
    services.forEach((service) => {
      const questions = {};
      const serviceIcons = {};
      service.serviceNames.forEach((element1) => {
        questions[element1.languageId] = element1.serviceName;
      });
      service?.serviceIconUrls &&
        service?.serviceIconUrls.forEach((icon) => {
          serviceIcons[icon.languageId] = icon.url;
        });
      this.MobileInterfaceData.servicePageData.panel.items.push(
        this.CreateItemControl(
          questions,
          service.id,
          false,
          service.acceptWalkins,
          '',
          items.find((x) => x.itemId == service.id)?.isItemSelected,
          serviceIcons
        )
      );
    });
    this.UpdateValuesOfServicePageSubject();
  }

  private AddButtonsToServicePage(buttons: IMobileButtonData[]) {
    this.MobileInterfaceData.servicePageData.buttons =
      new Array<ButtonControl>();
    this.MobileInterfaceData.servicePageData.buttons.push(
      this.CreateButtonControl(
        this.AppointmentButtonName,
        (buttons && buttons[0]?.text) || this.AppointmentButtonText,
        (buttons && buttons[0]?.color) || '#000000',
        (buttons && buttons[0]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[0]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[0]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
        this.DefaultButtonControlFontStyles.fontWeight,
        (buttons && buttons[0]?.backgroundColor) || '#ffffff',
        (buttons && buttons[0]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[0]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[0]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[0]?.height) ||
        this.DefaultButtonControlFontStyles.height,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[0]?.top) || 35,
        true,
        (buttons && buttons[0]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[0]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[0]?.primaryButtonSrc) || [],
        (buttons && buttons[0]?.secondaryButtonSrc) || [],
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || '#ffffff',
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.MobileInterfaceData.servicePageData.buttons.find(
      (x) => x.name === this.AppointmentButtonName
    ).showPropertyWindow = true;
  }


  //#endregion

  //#region Default service question page control initialization
  CreateAndSetItemsToServiceQuestionPanel(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    buttonBackgroundColor: string,
    buttonColor: string,
    buttonFont: string,
    buttonFontStyle: string,
    buttonFontSize: number,
    buttonFontWeight: string | number,
    buttonBoxCorner: string,
    buttonText: object,
    buttonTop: number,
    buttonVerticalPadding: string,
    buttonHorizontalPadding: string,
    buttonHeight: number,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[],
    secondaryButtonText: object,
    verticalPadding: string,
    horizontalPadding: string,
    questionSets: IMobileWorkFlowServiceQuestionData[],
    buttonBorder: string,
    buttonBorderColor: string,
    buttonShadow: boolean
  ) {
    this.MobileInterfaceData.serviceQuestionPageData.panel =
      this.CreatePanelControl(
        height,
        top,
        backgroundColor,
        color,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        boxCorner,
        '',
        horizontalPadding,
        verticalPadding
      );
    this.MobileInterfaceData.serviceQuestionPageData.panel.button =
      this.CreateButtonControl(
        'Start Button',
        buttonText,
        buttonColor,
        buttonFont,
        buttonFontStyle,
        buttonFontSize,
        buttonFontWeight,
        buttonBackgroundColor,
        buttonVerticalPadding,
        buttonHorizontalPadding,
        buttonBoxCorner,
        buttonHeight,
        100,
        buttonTop,
        true,
        showPrimaryButtonIcon,
        showSecondaryButtonIcon,
        primaryButtonSrc,
        secondaryButtonSrc,
        buttonBorder,
        buttonBorderColor,
        buttonShadow,
        secondaryButtonText
      );

    this.MobileInterfaceData.serviceQuestionPageData.questionSetList =
      new Array<IMobileQuestionSetData>();
    questionSets?.forEach((questionSet) =>
      questionSet?.questions
        ?.filter((x) => x.isVisible && !x.isDeleted)
        .forEach((question) => {
          const questions = {};
          question.question.forEach((element1) => {
            questions[element1.languageId] = element1.question;
          });
          this.MobileInterfaceData.serviceQuestionPageData.panel.items.push(
            this.CreateItemControl(
              questions,
              question.id,
              question.isRequired,
              question.isVisible,
              questionSet.id
            )
          );
        })
    );
    this.ServiceQuestionItems =
      this.MobileInterfaceData.serviceQuestionPageData.panel.items;
    this.MobileInterfaceData.serviceQuestionPageData.questionSetList =
      this.GetQuestionSetData(questionSets);
    this.UpdateValuesOfServiceQuestionPageSubject();
  }

  CreateAndSetItemsToSurveyQuestionPanel(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    buttonBackgroundColor: string,
    buttonColor: string,
    buttonFont: string,
    buttonFontStyle: string,
    buttonFontSize: number,
    buttonFontWeight: string | number,
    buttonBoxCorner: string,
    buttonText: object,
    buttonTop: number,
    buttonVerticalPadding: string,
    buttonHorizontalPadding: string,
    buttonHeight: number,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[],
    secondaryButtonText: object,
    verticalPadding: string,
    horizontalPadding: string,
    questionSets: IMobileWorkFlowSurveyQuestionData[],
    buttonBorder: string,
    buttonBorderColor: string,
    buttonShadow: boolean
  ) {
    this.MobileInterfaceData.surveyPageData.panel =
      this.CreatePanelControl(
        height,
        top,
        backgroundColor,
        color,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        boxCorner,
        '',
        horizontalPadding,
        verticalPadding
      );
    this.MobileInterfaceData.surveyPageData.panel.button =
      this.CreateButtonControl(
        'Start Button',
        buttonText,
        buttonColor,
        buttonFont,
        buttonFontStyle,
        buttonFontSize,
        buttonFontWeight,
        buttonBackgroundColor,
        buttonVerticalPadding,
        buttonHorizontalPadding,
        buttonBoxCorner,
        buttonHeight,
        100,
        buttonTop,
        true,
        showPrimaryButtonIcon,
        showSecondaryButtonIcon,
        primaryButtonSrc,
        secondaryButtonSrc,
        buttonBorder,
        buttonBorderColor,
        buttonShadow,
        secondaryButtonText
      );

    this.MobileInterfaceData.surveyPageData.questionSetList =
      new Array<IMobileQuestionSetData>();
    questionSets?.forEach((questionSet) =>
      questionSet?.questions
        ?.filter((x) => x.isVisible && !x.isDeleted)
        .forEach((question) => {
          const questions = {};
          question.question.forEach((element1) => {
            questions[element1.languageId] = element1.question;
          });
          this.MobileInterfaceData.surveyPageData.panel.items.push(
            this.CreateItemControl(
              questions,
              question.id,
              question.isRequired,
              question.isVisible,
              questionSet.id
            )
          );
        })
    );
    this.SurveyQuestionItems =
      this.MobileInterfaceData.surveyPageData.panel.items;
    this.MobileInterfaceData.surveyPageData.questionSetList =
      this.GetSurveyQuestionSetData(questionSets);
    this.UpdateValuesOfSurveyPageSubject();
  }



  private GetQuestionSetData(questions): Array<IMobileQuestionSetData> {
    const question = [];
    questions?.forEach((element) => {
      question.push({
        itemSetId: element.id,
        itemSetName: element.questionSetName,
        items:
          this.MobileInterfaceData.serviceQuestionPageData?.panel?.items?.filter(
            (x) => x.itemsSetId === element.id
          ),
      });
    });
    return question;
  }

  private GetSurveyQuestionSetData(questions): Array<IMobileQuestionSetData> {
    const question = [];
    questions?.forEach((element) => {
      question.push({
        itemSetId: element.id,
        itemSetName: element.questionSetName,
        items:
          this.MobileInterfaceData.surveyPageData?.panel?.items?.filter(
            (x) => x.itemsSetId === element.id
          ),
      });
    });
    return question;
  }

  //#endregion

  //#region Default global question page control initialization
  CreateAndSetItemsToGlobalQuestionPanel(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    boxCorner: string,
    buttonBackgroundColor: string,
    buttonColor: string,
    buttonFont: string,
    buttonFontStyle: string,
    buttonFontSize: number,
    buttonFontWeight: string | number,
    buttonBoxCorner: string,
    buttonText: object,
    verticalPadding: string,
    horizontalPadding: string,
    questions: IMobileWorkFlowQuestionData[],
    buttons: IMobileButtonData[]
  ) {
    const CountOfQuestions = questions?.filter(x => x.isVisible).length;
    if (!this.IsMobileTemplateIdExistInSession()) {
      height = CountOfQuestions > 0 ? (130 * CountOfQuestions) : height;
    }
    this.MobileInterfaceData.globalQuestionPageData.panel =
      this.CreatePanelControl(
        height,
        top,
        backgroundColor,
        color,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        boxCorner,
        '',
        horizontalPadding,
        verticalPadding
      );
    this.MobileInterfaceData.globalQuestionPageData.panel.button =
      this.CreateButtonControl(
        this.ContinueButtonName,
        buttonText,
        buttonColor || this.DefaultButtonControlFontStyles.color,
        buttonFont || this.DefaultButtonControlFontStyles.font,
        buttonFontStyle || this.DefaultButtonControlFontStyles.fontStyle,
        buttonFontSize || this.DefaultButtonControlFontStyles.fontSize,
        buttonFontWeight || this.DefaultButtonControlFontStyles.fontWeight,
        buttonBackgroundColor ||
        this.DefaultButtonControlFontStyles.backgroundColor,
        '15',
        '20',
        buttonBoxCorner || this.DefaultButtonControlFontStyles.boxRoundCorners,
        82,
        100,
        0,
        true,
        (buttons && buttons[0]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[0]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[0]?.primaryButtonSrc) || [],
        (buttons && buttons[0]?.secondaryButtonSrc) || [],
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      );
    this.MobileInterfaceData.globalQuestionPageData.buttons =
      new Array<ButtonControl>();
    this.MobileInterfaceData.globalQuestionPageData.buttons.push(
      this.CreateButtonControl(
        this.AppointmentButtonName,
        (buttons && buttons[1]?.text) || this.AppointmentButtonText,
        (buttons && buttons[1]?.color) || '#000000',
        (buttons && buttons[1]?.font) ||
        this.DefaultButtonControlFontStyles.font,
        (buttons && buttons[1]?.fontStyle) ||
        this.DefaultButtonControlFontStyles.fontStyle,
        (buttons && buttons[1]?.fontSize) ||
        this.DefaultButtonControlFontStyles.fontSize,
        this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) ||
        this.DefaultButtonControlFontStyles.fontWeight,
        (buttons && buttons[1]?.backgroundColor) || '#ffffff',
        (buttons && buttons[1]?.verticalPadding) || this.VerticalPadding,
        (buttons && buttons[1]?.horizontalPadding) || this.HorizontalPadding,
        (buttons && buttons[1]?.boxRoundCorners) ||
        this.DefaultButtonControlFontStyles.boxRoundCorners,
        (buttons && buttons[1]?.height) ||
        this.DefaultButtonControlFontStyles.height,
        (buttons && buttons[0]?.width) || 100,
        (buttons && buttons[1]?.top) || 35,
        true,
        (buttons && buttons[1]?.showPrimaryButtonIcon) || false,
        (buttons && buttons[1]?.showSecondaryButtonIcon) || false,
        (buttons && buttons[1]?.primaryButtonSrc) || [],
        (buttons && buttons[1]?.secondaryButtonSrc) || [],
        (buttons && buttons[1]?.border) || this.ButtonStyles.border,
        (buttons && buttons[1]?.borderColor) || '#ffffff',
        (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.MobileInterfaceData.globalQuestionPageData.panel.button.showPropertyWindow =
      true;
    questions
      ?.filter((x) => x.isVisible == true)
      .forEach((question) => {
        const questions = {};
        question.question.forEach((element1) => {
          questions[element1.languageId] = element1.question;
        });
        this.MobileInterfaceData.globalQuestionPageData.panel.items.push(
          this.CreateItemControl(
            questions,
            question.id,
            question.isRequired,
            question.isVisible
          )
        );
      });
    this.UpdateValuesOfGlobalQuestionPagePageSubject();
  }

  //#endregion

  //#region Add label control to all pages
  AddNewLabelControl(event: IMobileMoveEvent) {

    const name = this.GetLabelName();
    const defaultText = { en: name };
    const defaultHyperLink = '';
    const defaultColor = '#ffffff';
    const defaultHeight = 50;
    const defaultWidth = 60;
    const defaultZindex = 50; // Not in use now
    const labelControl = this.CreateLabelControl(
      name,
      defaultText,
      defaultHyperLink,
      defaultColor,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      0,
      defaultZindex,
      this.GeneralFontStyles.font,
      this.GeneralFontStyles.fontStyle,
      this.GeneralFontStyles.fontSize,
      this.GeneralFontStyles.fontWeight,
      this.Alignment
    );
    this.AddLabelsToRespectivePage(labelControl);
  }
  GetLabelName(): string {
    const name = 'Label';
    let currentLabelCount = 0;
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      currentLabelCount = ++this.MobileInterfaceData.marketingPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      currentLabelCount = ++this.MobileInterfaceData.welcomePageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      currentLabelCount = ++this.MobileInterfaceData.languagePageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      currentLabelCount = ++this.MobileInterfaceData.servicePageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      currentLabelCount = ++this.MobileInterfaceData.globalQuestionPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      currentLabelCount = ++this.MobileInterfaceData.serviceQuestionPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      currentLabelCount = ++this.MobileInterfaceData.thankYouPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      currentLabelCount = ++this.MobileInterfaceData.ticketPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      currentLabelCount = ++this.MobileInterfaceData.surveyPageData
        .otherControlsCount.totalLabelCount;
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      currentLabelCount = ++this.MobileInterfaceData.offLinePageData
        .otherControlsCount.totalLabelCount;
    }
    return name + currentLabelCount;
  }
  private AddLabelsToRespectivePage(labelControl: LabelControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.AddLabelToTheMarketingPage(labelControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.AddLabelToTheWelcomePage(labelControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.AddLabelToTheLanguagePage(labelControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.AddLabelToTheServicePage(labelControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.AddLabelToTheGlobalQuestionPage(labelControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.AddLabelToTheServiceQuestionPage(labelControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.AddLabelToTheThankYouPage(labelControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.AddLabelToTheNoQueuePage(labelControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.AddLabelToTheTicketPage(labelControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.AddLabelToTheSurveyPage(labelControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.AddLabelToTheOfflinePage(labelControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }
  private AddLabelToTheServicePage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.servicePageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.servicePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.servicePageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.labels =
        this.MobileInterfaceData.servicePageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnServicePage(labelControl);
  }
  private AddLabelToTheWelcomePage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.welcomePageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.welcomePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.welcomePageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.labels =
        this.MobileInterfaceData.welcomePageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnWelcomePage(labelControl);
  }
  private AddLabelToTheLanguagePage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.languagePageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.languagePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.languagePageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.labels =
        this.MobileInterfaceData.languagePageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnLanguagePage(labelControl);
  }
  private AddLabelToTheServiceQuestionPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.labels =
        this.MobileInterfaceData.serviceQuestionPageData.labels.concat(
          labelControl
        );
    }
    this.SelectAndHighlightLabelControlOnServiceQuestionPage(labelControl);
  }
  private AddLabelToTheGlobalQuestionPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.globalQuestionPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.globalQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.globalQuestionPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.labels =
        this.MobileInterfaceData.globalQuestionPageData.labels.concat(
          labelControl
        );
    }
    this.SelectAndHighlightLabelControlOnGlobalQuestionPage(labelControl);
  }
  private AddLabelToTheMarketingPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.marketingPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.marketingPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.marketingPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.labels =
        this.MobileInterfaceData.marketingPageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnMarketingPage(labelControl);
  }
  private AddLabelToTheTicketPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.ticketPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.ticketPageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.ticketPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.labels =
        this.MobileInterfaceData.ticketPageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnTicketPage(labelControl);
  }
  private AddLabelToTheThankYouPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.thankYouPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.thankYouPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.thankYouPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.labels =
        this.MobileInterfaceData.thankYouPageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnThankYouPage(labelControl);
  }

  private AddLabelToTheNoQueuePage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.noQueuePageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.noQueuePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.noQueuePageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.labels =
        this.MobileInterfaceData.noQueuePageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnNoQueuePage(labelControl);
  }
  private AddLabelToTheSurveyPage(labelControl: LabelControl): void {
    if (
      !this.MobileInterfaceData.surveyPageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.surveyPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.surveyPageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.labels =
        this.MobileInterfaceData.surveyPageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnSurveyPage(labelControl);
  }

  private AddLabelToTheOfflinePage(labelControl: LabelControl): void {
   
    if (
      !this.MobileInterfaceData.offLinePageData.otherControlList.some(
        (x) => x.control.name == labelControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.otherControlList =
        this.GetOtherControlList(
          labelControl,
          this.MobileInterfaceData.offLinePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.offLinePageData.labels.some(
        (x) => x.name === labelControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.labels =
        this.MobileInterfaceData.offLinePageData.labels.concat(labelControl);
    }
    this.SelectAndHighlightLabelControlOnOfflinePage(labelControl);
  }

  //#endregion

  //#region Add Image control to all pages
  AddNewImageControl(event: IMobileMoveEvent) {
    const name = this.GetImageName();
    const src = [
      {
        language: 'English',
        languageCode: 'en',
        src: '/assets/img-icon.svg',
        url: '/assets/img-icon.svg',
      },
    ];
    const defaultHyperLink = '';
    const defaultHeight = 100;
    const defaultWidth = 60;
    const defaultZindex = 50; // Not in use now
    const imageControl = this.CreateImageControl(
      name,
      src,
      defaultHyperLink,
      defaultWidth,
      defaultHeight,
      0,
      Math.round(event.y),
      defaultZindex
    );
    this.AddImagesToRespectivePage(imageControl);
  }
  GetImageName(): string {
    const name = 'Image';
    let currentImageCount = 0;
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      currentImageCount = ++this.MobileInterfaceData.marketingPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      currentImageCount = ++this.MobileInterfaceData.welcomePageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      currentImageCount = ++this.MobileInterfaceData.languagePageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      currentImageCount = ++this.MobileInterfaceData.servicePageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      currentImageCount = ++this.MobileInterfaceData.globalQuestionPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      currentImageCount = ++this.MobileInterfaceData.serviceQuestionPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      currentImageCount = ++this.MobileInterfaceData.thankYouPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      currentImageCount = ++this.MobileInterfaceData.ticketPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      currentImageCount = ++this.MobileInterfaceData.surveyPageData
        .otherControlsCount.totalImageCount;
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      currentImageCount = ++this.MobileInterfaceData.offLinePageData
        .otherControlsCount.totalImageCount;
    }
    return name + currentImageCount;
  }
  private AddImagesToRespectivePage(imageControl: ImageControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.AddImageToTheMarketingPage(imageControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.AddImageToTheWelcomePage(imageControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.AddImageToTheLanguagePage(imageControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.AddImageToTheServicePage(imageControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.AddImageToTheGlobalQuestionPage(imageControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.AddImageToTheServiceQuestionPage(imageControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.AddImageToTheThankYouPage(imageControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.AddImageToTheNoQueuePage(imageControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.AddImageToTheTicketPage(imageControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.AddImageToTheSurveyPage(imageControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.AddImageToTheOfflinePage(imageControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }
  private AddImageToTheServicePage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.servicePageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.servicePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.servicePageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.images =
        this.MobileInterfaceData.servicePageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnServicePage(imageControl);
  }
  private AddImageToTheWelcomePage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.welcomePageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.welcomePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.welcomePageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.images =
        this.MobileInterfaceData.welcomePageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnWelcomePage(imageControl);
  }
  private AddImageToTheLanguagePage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.languagePageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.languagePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.languagePageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.images =
        this.MobileInterfaceData.languagePageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnLanguagePage(imageControl);
  }
  private AddImageToTheServiceQuestionPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.images =
        this.MobileInterfaceData.serviceQuestionPageData.images.concat(
          imageControl
        );
    }
    this.SelectAndHighlightImageControlOnServiceQuestionPage(imageControl);
  }
  private AddImageToTheGlobalQuestionPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.globalQuestionPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.globalQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.globalQuestionPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.images =
        this.MobileInterfaceData.globalQuestionPageData.images.concat(
          imageControl
        );
    }
    this.SelectAndHighlightImageControlOnGlobalQuestionPage(imageControl);
  }
  private AddImageToTheMarketingPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.marketingPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.marketingPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.marketingPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.images =
        this.MobileInterfaceData.marketingPageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnMarketingPage(imageControl);
  }
  private AddImageToTheTicketPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.ticketPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.ticketPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.ticketPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.images =
        this.MobileInterfaceData.ticketPageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnTicketPage(imageControl);
  }
  private AddImageToTheThankYouPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.thankYouPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.thankYouPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.thankYouPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.images =
        this.MobileInterfaceData.thankYouPageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnThankYouPage(imageControl);
  }

  private AddImageToTheNoQueuePage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.noQueuePageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.noQueuePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.noQueuePageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.images =
        this.MobileInterfaceData.noQueuePageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnNoQueuePage(imageControl);
  }

  private AddImageToTheSurveyPage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.surveyPageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.surveyPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.surveyPageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.images =
        this.MobileInterfaceData.surveyPageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnSurveyPage(imageControl);
  }

  private AddImageToTheOfflinePage(imageControl: ImageControl): void {
    if (
      !this.MobileInterfaceData.offLinePageData.otherControlList.some(
        (x) => x.control.name == imageControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.otherControlList =
        this.GetOtherControlList(
          imageControl,
          this.MobileInterfaceData.offLinePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.offLinePageData.images.some(
        (x) => x.name === imageControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.images =
        this.MobileInterfaceData.offLinePageData.images.concat(imageControl);
    }
    this.SelectAndHighlightImageControlOnOfflinePage(imageControl);
  }
  //#endregion
  //#region control click
  OnImageClick(imageControl: ImageControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');

      this.SelectAndHighlightImageControlOnMarketingPage(imageControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');

      this.SelectAndHighlightImageControlOnWelcomePage(imageControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.SelectAndHighlightImageControlOnLanguagePage(imageControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.SelectAndHighlightImageControlOnServicePage(imageControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.SelectAndHighlightImageControlOnGlobalQuestionPage(imageControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.SelectAndHighlightImageControlOnServiceQuestionPage(imageControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.SelectAndHighlightImageControlOnThankYouPage(imageControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.SelectAndHighlightImageControlOnNoQueuePage(imageControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.SelectAndHighlightImageControlOnTicketPage(imageControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.SelectAndHighlightImageControlOnSurveyPage(imageControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.SelectAndHighlightImageControlOnOfflinePage(imageControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }

  private SelectAndHighlightImageControlOnMarketingPage(imageControl): void {
    this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.marketingPageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(
      imageControl,
      'marketingPageData'
    );
  }

  private SelectAndHighlightImageControlOnWelcomePage(imageControl): void {
    this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.welcomePageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'welcomePageData');
  }

  private SelectAndHighlightImageControlOnGlobalQuestionPage(
    imageControl
  ): void {
    this.MobileInterfaceData.globalQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.globalQuestionPageData.otherControlList,
          imageControl.name
        )
      );
    this.UpdateSelectedPropertyOfImageControl(
      imageControl,
      'globalQuestionPageData'
    );
  }

  private SelectAndHighlightImageControlOnServicePage(imageControl): void {
    this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.servicePageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'servicePageData');
  }

  private SelectAndHighlightImageControlOnServiceQuestionPage(
    imageControl
  ): void {
    this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
          imageControl.name
        )
      );
    this.UpdateSelectedPropertyOfImageControl(
      imageControl,
      'serviceQuestionPageData'
    );
  }

  private SelectAndHighlightImageControlOnThankYouPage(imageControl): void {
    this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.thankYouPageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'thankYouPageData');
  }

  private SelectAndHighlightImageControlOnNoQueuePage(imageControl): void {
    this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.noQueuePageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'noQueuePageData');
  }

  private SelectAndHighlightImageControlOnTicketPage(imageControl): void {
    this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.ticketPageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'ticketPageData');
  }

  private SelectAndHighlightImageControlOnSurveyPage(imageControl): void {
    this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.surveyPageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'surveyPageData');
  }

  private SelectAndHighlightImageControlOnOfflinePage(imageControl): void {
    this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.offLinePageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'offLinePageData');
  }

  private SelectAndHighlightImageControlOnLanguagePage(imageControl): void {
    this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.languagePageData.otherControlList,
        imageControl.name
      )
    );
    this.UpdateSelectedPropertyOfImageControl(imageControl, 'languagePageData');
  }

  private UpdateSelectedPropertyOfImageControl(imageControl, pageName: string) {
    this.MobileInterfaceData[pageName].images.map((x) => {
      x.selected = false;
    });
    this.MobileInterfaceData[pageName].images.find(
      (x) => x.name === imageControl.name
    ).selected = true;

    this.MobileInterfaceData[pageName].labels.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].videos.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].sliders.map((x) => {
      x.selected = false;
    });
  }

  OnLabelClick(labelControl: LabelControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.SelectAndHighlightLabelControlOnMarketingPage(labelControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.SelectAndHighlightLabelControlOnWelcomePage(labelControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.SelectAndHighlightLabelControlOnLanguagePage(labelControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.SelectAndHighlightLabelControlOnServicePage(labelControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.SelectAndHighlightLabelControlOnGlobalQuestionPage(labelControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.SelectAndHighlightLabelControlOnServiceQuestionPage(labelControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.SelectAndHighlightLabelControlOnThankYouPage(labelControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.SelectAndHighlightLabelControlOnNoQueuePage(labelControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.SelectAndHighlightLabelControlOnTicketPage(labelControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.SelectAndHighlightLabelControlOnSurveyPage(labelControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.SelectAndHighlightLabelControlOnOfflinePage(labelControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }

  private SelectAndHighlightLabelControlOnMarketingPage(labelControl): void {
    this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.marketingPageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(
      labelControl,
      'marketingPageData'
    );
  }

  private SelectAndHighlightLabelControlOnWelcomePage(labelControl): void {
    this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.welcomePageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'welcomePageData');
  }

  private SelectAndHighlightLabelControlOnGlobalQuestionPage(
    labelControl
  ): void {
    this.MobileInterfaceData.globalQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.globalQuestionPageData.otherControlList,
          labelControl.name
        )
      );
    this.UpdateSelectedPropertyOfLabelControl(
      labelControl,
      'globalQuestionPageData'
    );
  }

  private SelectAndHighlightLabelControlOnServicePage(labelControl): void {
    this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.servicePageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'servicePageData');
  }

  private SelectAndHighlightLabelControlOnServiceQuestionPage(
    labelControl
  ): void {
    this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
          labelControl.name
        )
      );
    this.UpdateSelectedPropertyOfLabelControl(
      labelControl,
      'serviceQuestionPageData'
    );
  }

  private SelectAndHighlightLabelControlOnThankYouPage(labelControl): void {
    this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.thankYouPageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'thankYouPageData');
  }

  private SelectAndHighlightLabelControlOnNoQueuePage(labelControl): void {
    this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.noQueuePageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'noQueuePageData');
  }

  private SelectAndHighlightLabelControlOnTicketPage(labelControl): void {
    this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.ticketPageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'ticketPageData');
  }

  private SelectAndHighlightLabelControlOnSurveyPage(labelControl): void {
    this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.surveyPageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'surveyPageData');
  }

  private SelectAndHighlightLabelControlOnOfflinePage(labelControl): void {
    this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.offLinePageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'offLinePageData');
  }

  private SelectAndHighlightLabelControlOnLanguagePage(labelControl): void {
    this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.languagePageData.otherControlList,
        labelControl.name
      )
    );
    this.UpdateSelectedPropertyOfLabelControl(labelControl, 'languagePageData');
  }

  private UpdateSelectedPropertyOfLabelControl(labelControl, pageName: string) {
    this.MobileInterfaceData[pageName].images.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].labels.map((x) => {
      x.selected = false;
    });
    this.MobileInterfaceData[pageName].labels.find(
      (x) => x.name === labelControl.name
    ).selected = true;

    this.MobileInterfaceData[pageName].videos.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].sliders.map((x) => {
      x.selected = false;
    });
  }

  OnVideoClick(videoControl: VideoControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.SelectAndHighlightVideoControlOnMarketingPage(videoControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.SelectAndHighlightVideoControlOnWelcomePage(videoControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.SelectAndHighlightVideoControlOnLanguagePage(videoControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.SelectAndHighlightVideoControlOnServicePage(videoControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.SelectAndHighlightVideoControlOnGlobalQuestionPage(videoControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.SelectAndHighlightVideoControlOnServiceQuestionPage(videoControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.SelectAndHighlightVideoControlOnThankYouPage(videoControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.SelectAndHighlightVideoControlOnNoQueuePage(videoControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.SelectAndHighlightVideoControlOnTicketPage(videoControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.SelectAndHighlightVideoControlOnSurveyPage(videoControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.SelectAndHighlightVideoControlOnOfflinePage(videoControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }

  private SelectAndHighlightVideoControlOnMarketingPage(videoControl): void {
    this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.marketingPageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(
      videoControl,
      'marketingPageData'
    );
  }

  private SelectAndHighlightVideoControlOnWelcomePage(videoControl): void {
    this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.welcomePageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'welcomePageData');
  }

  private SelectAndHighlightVideoControlOnGlobalQuestionPage(
    videoControl
  ): void {
    this.MobileInterfaceData.globalQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.globalQuestionPageData.otherControlList,
          videoControl.name
        )
      );
    this.UpdateSelectedPropertyOfVideoControl(
      videoControl,
      'globalQuestionPageData'
    );
  }

  private SelectAndHighlightVideoControlOnServicePage(videoControl): void {
    this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.servicePageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'servicePageData');
  }

  private SelectAndHighlightVideoControlOnServiceQuestionPage(
    videoControl
  ): void {
    this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
          videoControl.name
        )
      );
    this.UpdateSelectedPropertyOfVideoControl(
      videoControl,
      'serviceQuestionPageData'
    );
  }

  private SelectAndHighlightVideoControlOnThankYouPage(videoControl): void {
    this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.thankYouPageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'thankYouPageData');
  }

  private SelectAndHighlightVideoControlOnNoQueuePage(videoControl): void {
    this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.noQueuePageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'noQueuePageData');
  }

  private SelectAndHighlightVideoControlOnTicketPage(videoControl): void {
    this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.ticketPageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'ticketPageData');
  }

  private SelectAndHighlightVideoControlOnSurveyPage(videoControl): void {
    this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.surveyPageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'surveyPageData');
  }

  private SelectAndHighlightVideoControlOnOfflinePage(videoControl): void {
    this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.offLinePageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'offLinePageData');
  }

  private SelectAndHighlightVideoControlOnLanguagePage(videoControl): void {
    this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.languagePageData.otherControlList,
        videoControl.name
      )
    );
    this.UpdateSelectedPropertyOfVideoControl(videoControl, 'languagePageData');
  }

  private UpdateSelectedPropertyOfVideoControl(videoControl, pageName: string) {
    this.MobileInterfaceData[pageName].images.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].labels.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].videos.map((x) => {
      x.selected = false;
    });
    this.MobileInterfaceData[pageName].videos.find(
      (x) => x.name === videoControl.name
    ).selected = true;

    this.MobileInterfaceData[pageName].sliders.map((x) => {
      x.selected = false;
    });
  }

  OnSliderClick(sliderControl: SliderControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.SelectAndHighlightSliderControlOnMarketingPage(sliderControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.SelectAndHighlightSliderControlOnWelcomePage(sliderControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.SelectAndHighlightSliderControlOnLanguagePage(sliderControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.SelectAndHighlightSliderControlOnServicePage(sliderControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.SelectAndHighlightSliderControlOnGlobalQuestionPage(sliderControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.SelectAndHighlightSliderControlOnServiceQuestionPage(sliderControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.SelectAndHighlightSliderControlOnThankYouPage(sliderControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.SelectAndHighlightSliderControlOnNoQueuePage(sliderControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.SelectAndHighlightSliderControlOnTicketPage(sliderControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.SelectAndHighlightSliderControlOnSurveyPage(sliderControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.SelectAndHighlightSliderControlOnOfflinePage(sliderControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }

  private SelectAndHighlightSliderControlOnMarketingPage(sliderControl): void {
    this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.marketingPageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'marketingPageData'
    );
  }

  private SelectAndHighlightSliderControlOnWelcomePage(sliderControl): void {
    this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.welcomePageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'welcomePageData'
    );
  }

  private SelectAndHighlightSliderControlOnGlobalQuestionPage(
    sliderControl
  ): void {
    this.MobileInterfaceData.globalQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.globalQuestionPageData.otherControlList,
          sliderControl.name
        )
      );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'globalQuestionPageData'
    );
  }

  private SelectAndHighlightSliderControlOnServicePage(sliderControl): void {
    this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.servicePageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'servicePageData'
    );
  }

  private SelectAndHighlightSliderControlOnServiceQuestionPage(
    sliderControl
  ): void {
    this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
      [].concat(
        this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
          sliderControl.name
        )
      );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'serviceQuestionPageData'
    );
  }

  private SelectAndHighlightSliderControlOnThankYouPage(sliderControl): void {
    this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.thankYouPageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'thankYouPageData'
    );
  }

  private SelectAndHighlightSliderControlOnNoQueuePage(sliderControl): void {
    this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.noQueuePageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'noQueuePageData'
    );
  }

  private SelectAndHighlightSliderControlOnTicketPage(sliderControl): void {
    this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.ticketPageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(sliderControl, 'ticketPageData');
  }

  private SelectAndHighlightSliderControlOnSurveyPage(sliderControl): void {
    this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.surveyPageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(sliderControl, 'surveyPageData');
  }

  private SelectAndHighlightSliderControlOnOfflinePage(sliderControl): void {
    this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.offLinePageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(sliderControl, 'offLinePageData');
  }

  private SelectAndHighlightSliderControlOnLanguagePage(sliderControl): void {
    this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
      this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
        this.MobileInterfaceData.languagePageData.otherControlList,
        sliderControl.name
      )
    );
    this.UpdateSelectedPropertyOfSliderControl(
      sliderControl,
      'languagePageData'
    );
  }

  private UpdateSelectedPropertyOfSliderControl(
    sliderControl,
    pageName: string
  ) {
    this.MobileInterfaceData[pageName].images.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].labels.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].videos.map((x) => {
      x.selected = false;
    });

    this.MobileInterfaceData[pageName].sliders.map((x) => {
      x.selected = false;
    });
    this.MobileInterfaceData[pageName].sliders.find(
      (x) => x.name === sliderControl.name
    ).selected = true;
  }

  //#endregion
  //#region Add video control to all pages
  AddNewVideoControl(event: IMobileMoveEvent) {
    const name = this.GetVideoName();
    const src = [{ language: 'English', languageCode: 'en', src: '', url: '' }];
    const defaultHeight = 100;
    const defaultWidth = 60;
    const defaultZindex = 50;
    // Not in use now
    const videoControl = this.CreateVideoControl(
      name,
      src,
      defaultWidth,
      defaultHeight,
      0,
      Math.round(event.y),
      defaultZindex
    );
    this.AddVideosToRespectivePage(videoControl);
  }
  GetVideoName(): string {
    const name = 'Video';
    let currentVideoCount = 0;
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      currentVideoCount = ++this.MobileInterfaceData.marketingPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      currentVideoCount = ++this.MobileInterfaceData.welcomePageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      currentVideoCount = ++this.MobileInterfaceData.languagePageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      currentVideoCount = ++this.MobileInterfaceData.servicePageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      currentVideoCount = ++this.MobileInterfaceData.globalQuestionPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      currentVideoCount = ++this.MobileInterfaceData.serviceQuestionPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      currentVideoCount = ++this.MobileInterfaceData.thankYouPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      currentVideoCount = ++this.MobileInterfaceData.ticketPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      currentVideoCount = ++this.MobileInterfaceData.surveyPageData
        .otherControlsCount.totalVideoCount;
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      currentVideoCount = ++this.MobileInterfaceData.offLinePageData
        .otherControlsCount.totalVideoCount;
    }
    return name + currentVideoCount;
  }
  private AddVideosToRespectivePage(videoControl: VideoControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.AddVideoToTheMarketingPage(videoControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.AddVideoToTheWelcomePage(videoControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.AddVideoToTheLanguagePage(videoControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.AddVideoToTheServicePage(videoControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.AddVideoToTheGlobalQuestionPage(videoControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.AddVideoToTheServiceQuestionPage(videoControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.AddVideoToTheThankYouPage(videoControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.AddVideoToTheNoQueuePage(videoControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.AddVideoToTheTicketPage(videoControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.AddVideoToTheSurveyPage(videoControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.AddVideoToTheOfflinePage(videoControl);
      this.UpdateValuesOfOfflinePageSubject();
    }

  }
  private AddVideoToTheServicePage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.servicePageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.servicePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.servicePageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.videos =
        this.MobileInterfaceData.servicePageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnServicePage(videoControl);
  }
  private AddVideoToTheWelcomePage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.welcomePageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.welcomePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.welcomePageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.videos =
        this.MobileInterfaceData.welcomePageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnWelcomePage(videoControl);
  }
  private AddVideoToTheLanguagePage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.languagePageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.languagePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.languagePageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.videos =
        this.MobileInterfaceData.languagePageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnLanguagePage(videoControl);
  }
  private AddVideoToTheServiceQuestionPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.videos =
        this.MobileInterfaceData.serviceQuestionPageData.videos.concat(
          videoControl
        );
    }
    this.SelectAndHighlightVideoControlOnServiceQuestionPage(videoControl);
  }
  private AddVideoToTheGlobalQuestionPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.globalQuestionPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.globalQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.globalQuestionPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.videos =
        this.MobileInterfaceData.globalQuestionPageData.videos.concat(
          videoControl
        );
    }
    this.SelectAndHighlightVideoControlOnGlobalQuestionPage(videoControl);
  }
  private AddVideoToTheMarketingPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.marketingPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.marketingPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.marketingPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.videos =
        this.MobileInterfaceData.marketingPageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnMarketingPage(videoControl);
  }

  private AddVideoToTheTicketPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.ticketPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.ticketPageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.ticketPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.videos =
        this.MobileInterfaceData.ticketPageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnTicketPage(videoControl);
  }
  private AddVideoToTheThankYouPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.thankYouPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.thankYouPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.thankYouPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.videos =
        this.MobileInterfaceData.thankYouPageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnThankYouPage(videoControl);
  }

  private AddVideoToTheNoQueuePage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.noQueuePageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.noQueuePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.noQueuePageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.videos =
        this.MobileInterfaceData.noQueuePageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnNoQueuePage(videoControl);
  }
  private AddVideoToTheSurveyPage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.surveyPageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.surveyPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.surveyPageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.videos =
        this.MobileInterfaceData.surveyPageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnSurveyPage(videoControl);
  }

  private AddVideoToTheOfflinePage(videoControl: VideoControl): void {
    if (
      !this.MobileInterfaceData.offLinePageData.otherControlList.some(
        (x) => x.control.name == videoControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.otherControlList =
        this.GetOtherControlList(
          videoControl,
          this.MobileInterfaceData.offLinePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.offLinePageData.videos.some(
        (x) => x.name === videoControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.videos =
        this.MobileInterfaceData.offLinePageData.videos.concat(videoControl);
    }
    this.SelectAndHighlightVideoControlOnOfflinePage(videoControl);
  }

  //#endregion

  //#region Add Slider control to all pages
  AddNewSliderControl(event: IMobileMoveEvent) {
    const name = this.GetSliderName();
    const defaultHeight = 140;
    const defaultWidth = 250;
    const defaultZindex = 50;
    // Not in use now
    const sliderControl = this.CreateSliderControl(
      name,
      defaultWidth,
      defaultHeight,
      Math.round(event.y),
      0,
      defaultZindex,
      []
    );
    this.AddSlidersToRespectivePage(sliderControl);
  }
  GetSliderName(): string {
    const name = 'Slider';
    let currentSliderCount = 0;
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      currentSliderCount = ++this.MobileInterfaceData.marketingPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      currentSliderCount = ++this.MobileInterfaceData.welcomePageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      currentSliderCount = ++this.MobileInterfaceData.languagePageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      currentSliderCount = ++this.MobileInterfaceData.servicePageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      currentSliderCount = ++this.MobileInterfaceData.globalQuestionPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      currentSliderCount = ++this.MobileInterfaceData.serviceQuestionPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      currentSliderCount = ++this.MobileInterfaceData.thankYouPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      currentSliderCount = ++this.MobileInterfaceData.ticketPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      currentSliderCount = ++this.MobileInterfaceData.surveyPageData
        .otherControlsCount.totalSliderCount;
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      currentSliderCount = ++this.MobileInterfaceData.offLinePageData
        .otherControlsCount.totalSliderCount;
    }
    return name + currentSliderCount;
  }
  private AddSlidersToRespectivePage(sliderControl: SliderControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.AddSliderToTheMarketingPage(sliderControl);
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.AddSliderToTheLanguagePage(sliderControl);
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.AddSliderToTheServicePage(sliderControl);
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.AddSliderToTheGlobalQuestionPage(sliderControl);
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.AddSliderToTheServiceQuestionPage(sliderControl);
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.AddSliderToTheThankYouPage(sliderControl);
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.AddSliderToTheNoQueuePage(sliderControl);
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.AddSliderToTheTicketPage(sliderControl);
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.AddSliderToTheSurveyPage(sliderControl);
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.AddSliderToTheWelcomePage(sliderControl);
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.AddSliderToTheOfflinePage(sliderControl);
      this.UpdateValuesOfOfflinePageSubject();
    }
  }
  private AddSliderToTheServicePage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.servicePageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.servicePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.servicePageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.servicePageData.sliders =
        this.MobileInterfaceData.servicePageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnServicePage(sliderControl);
  }
  private AddSliderToTheWelcomePage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.welcomePageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.welcomePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.welcomePageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.welcomePageData.sliders =
        this.MobileInterfaceData.welcomePageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnWelcomePage(sliderControl);
  }
  private AddSliderToTheLanguagePage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.languagePageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.languagePageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.languagePageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.languagePageData.sliders =
        this.MobileInterfaceData.languagePageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnLanguagePage(sliderControl);
  }

  private AddSliderToTheServiceQuestionPage(
    sliderControl: SliderControl
  ): void {
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.serviceQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.serviceQuestionPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.serviceQuestionPageData.sliders =
        this.MobileInterfaceData.serviceQuestionPageData.sliders.concat(
          sliderControl
        );
    }
    this.SelectAndHighlightSliderControlOnServiceQuestionPage(sliderControl);
  }
  private AddSliderToTheGlobalQuestionPage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.globalQuestionPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.globalQuestionPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.globalQuestionPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.globalQuestionPageData.sliders =
        this.MobileInterfaceData.globalQuestionPageData.sliders.concat(
          sliderControl
        );
    }
    this.SelectAndHighlightSliderControlOnGlobalQuestionPage(sliderControl);
  }
  private AddSliderToTheMarketingPage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.marketingPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.marketingPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.marketingPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.marketingPageData.sliders =
        this.MobileInterfaceData.marketingPageData.sliders.concat(
          sliderControl
        );
    }
    this.SelectAndHighlightSliderControlOnMarketingPage(sliderControl);
  }
  private AddSliderToTheTicketPage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.ticketPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.ticketPageData.otherControlList
        );
    }

    if (
      !this.MobileInterfaceData.ticketPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.ticketPageData.sliders =
        this.MobileInterfaceData.ticketPageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnTicketPage(sliderControl);
  }
  private AddSliderToTheThankYouPage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.thankYouPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.thankYouPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.thankYouPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.thankYouPageData.sliders =
        this.MobileInterfaceData.thankYouPageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnThankYouPage(sliderControl);
  }

  private AddSliderToTheNoQueuePage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.noQueuePageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.noQueuePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.noQueuePageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.noQueuePageData.sliders =
        this.MobileInterfaceData.noQueuePageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnNoQueuePage(sliderControl);
  }

  private AddSliderToTheSurveyPage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.surveyPageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.surveyPageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.surveyPageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.surveyPageData.sliders =
        this.MobileInterfaceData.surveyPageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnSurveyPage(sliderControl);
  }

  private AddSliderToTheOfflinePage(sliderControl: SliderControl): void {
    if (
      !this.MobileInterfaceData.offLinePageData.otherControlList.some(
        (x) => x.control.name == sliderControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.otherControlList =
        this.GetOtherControlList(
          sliderControl,
          this.MobileInterfaceData.offLinePageData.otherControlList
        );
    }
    if (
      !this.MobileInterfaceData.offLinePageData.sliders.some(
        (x) => x.name === sliderControl.name
      )
    ) {
      this.MobileInterfaceData.offLinePageData.sliders =
        this.MobileInterfaceData.offLinePageData.sliders.concat(sliderControl);
    }
    this.SelectAndHighlightSliderControlOnOfflinePage(sliderControl);
  }

  //#endregion

  //#region Remove Video from respective pages
  RemoveVideo(control: VideoControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.videos.splice(
        this.MobileInterfaceData.marketingPageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.marketingPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.videos.splice(
        this.MobileInterfaceData.welcomePageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.welcomePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.videos.splice(
        this.MobileInterfaceData.languagePageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.videos.splice(
        this.MobileInterfaceData.servicePageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.servicePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.videos.splice(
        this.MobileInterfaceData.globalQuestionPageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.globalQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.videos.splice(
        this.MobileInterfaceData.serviceQuestionPageData.videos.indexOf(
          control
        ),
        1
      );
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.videos.splice(
        this.MobileInterfaceData.thankYouPageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.thankYouPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.videos.splice(
        this.MobileInterfaceData.ticketPageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.ticketPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.videos.splice(
        this.MobileInterfaceData.surveyPageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.surveyPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.videos.splice(
        this.MobileInterfaceData.noQueuePageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.noQueuePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.videos.splice(
        this.MobileInterfaceData.offLinePageData.videos.indexOf(control),
        1
      );
      this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.offLinePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfOfflinePageSubject();
    }
    this.HandleAllControlZIndex(control.styles.zindex);
  }
  //#endregion

  //#region Remove Slider from respective pages
  RemoveSlider(control: SliderControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.sliders.splice(
        this.MobileInterfaceData.marketingPageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.marketingPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.sliders.splice(
        this.MobileInterfaceData.welcomePageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.welcomePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.sliders.splice(
        this.MobileInterfaceData.languagePageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.sliders.splice(
        this.MobileInterfaceData.servicePageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.servicePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.sliders.splice(
        this.MobileInterfaceData.globalQuestionPageData.sliders.indexOf(
          control
        ),
        1
      );
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.globalQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.sliders.splice(
        this.MobileInterfaceData.serviceQuestionPageData.sliders.indexOf(
          control
        ),
        1
      );
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.sliders.splice(
        this.MobileInterfaceData.thankYouPageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.thankYouPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.sliders.splice(
        this.MobileInterfaceData.ticketPageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.ticketPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.sliders.splice(
        this.MobileInterfaceData.surveyPageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.surveyPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.sliders.splice(
        this.MobileInterfaceData.noQueuePageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.noQueuePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.sliders.splice(
        this.MobileInterfaceData.offLinePageData.sliders.indexOf(control),
        1
      );
      this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.offLinePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfOfflinePageSubject();
    }
    this.HandleAllControlZIndex(control.styles.zindex);
  }
  //#endregion

  //#region Remove Image from respective pages
  RemoveImage(control: ImageControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.images.splice(
        this.MobileInterfaceData.marketingPageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.marketingPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.images.splice(
        this.MobileInterfaceData.welcomePageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.welcomePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.images.splice(
        this.MobileInterfaceData.languagePageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.images.splice(
        this.MobileInterfaceData.servicePageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.servicePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.images.splice(
        this.MobileInterfaceData.globalQuestionPageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.globalQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.images.splice(
        this.MobileInterfaceData.serviceQuestionPageData.images.indexOf(
          control
        ),
        1
      );
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.images.splice(
        this.MobileInterfaceData.thankYouPageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.thankYouPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.images.splice(
        this.MobileInterfaceData.ticketPageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.ticketPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.images.splice(
        this.MobileInterfaceData.surveyPageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.surveyPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.images.splice(
        this.MobileInterfaceData.noQueuePageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.noQueuePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.images.splice(
        this.MobileInterfaceData.offLinePageData.images.indexOf(control),
        1
      );
      this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.offLinePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfOfflinePageSubject();
    }
    this.HandleAllControlZIndex(control.styles.zindex);
  }
  //#endregion

  //#region Remove Label from respective pages
  RemoveLabel(control: LabelControl) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.MobileInterfaceData.marketingPageData.labels.splice(
        this.MobileInterfaceData.marketingPageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.marketingPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.marketingPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfMarketingPageSubject();
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.MobileInterfaceData.welcomePageData.labels.splice(
        this.MobileInterfaceData.welcomePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.welcomePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.welcomePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfWelcomePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.labels.splice(
        this.MobileInterfaceData.languagePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.MobileInterfaceData.languagePageData.labels.splice(
        this.MobileInterfaceData.languagePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.languagePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.languagePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfLanguagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.MobileInterfaceData.servicePageData.labels.splice(
        this.MobileInterfaceData.servicePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.servicePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.servicePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfServicePageSubject();
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.MobileInterfaceData.globalQuestionPageData.labels.splice(
        this.MobileInterfaceData.globalQuestionPageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.globalQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.globalQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfGlobalQuestionPagePageSubject();
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.MobileInterfaceData.serviceQuestionPageData.labels.splice(
        this.MobileInterfaceData.serviceQuestionPageData.labels.indexOf(
          control
        ),
        1
      );
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList =
        [].concat(
          this.ResetOtherControlPropertyWindow(
            this.MobileInterfaceData.serviceQuestionPageData.otherControlList,
            control
          )
        );
      this.UpdateValuesOfServiceQuestionPageSubject();
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.MobileInterfaceData.thankYouPageData.labels.splice(
        this.MobileInterfaceData.thankYouPageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.thankYouPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.thankYouPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfThankYouPageSubject();
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.MobileInterfaceData.ticketPageData.labels.splice(
        this.MobileInterfaceData.ticketPageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.ticketPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.ticketPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfTicketPageSubject();
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.MobileInterfaceData.surveyPageData.labels.splice(
        this.MobileInterfaceData.surveyPageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.surveyPageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.surveyPageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfSurveyPageSubject();
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.MobileInterfaceData.noQueuePageData.labels.splice(
        this.MobileInterfaceData.noQueuePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.noQueuePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.noQueuePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfNoQueuePageSubject();
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.MobileInterfaceData.offLinePageData.labels.splice(
        this.MobileInterfaceData.offLinePageData.labels.indexOf(control),
        1
      );
      this.MobileInterfaceData.offLinePageData.otherControlList = [].concat(
        this.ResetOtherControlPropertyWindow(
          this.MobileInterfaceData.offLinePageData.otherControlList,
          control
        )
      );
      this.UpdateValuesOfOfflinePageSubject();
    }
    this.HandleAllControlZIndex(control.styles.zindex);
  }

  //#endregion

  //#region  All other controls resize functions from all pages
  ControlResizeEnd(event: IMobileResizeControlEvent) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.ResizeMarketingPageControls(event);
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.ResizeWelcomePageControls(event);
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.ResizeLanguagePageControls(event);
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.ResizeServicePageControls(event);
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.ResizeGlobalPageControls(event);
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.ResizeMServiceQuestionPageControls(event);
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.ResizeThankYouPageControls(event);
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.ResizeNoQueuePageControls(event);
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.ResizeTicketPageControls(event);
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.ResizeSurveyPageControls(event);
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.ResizeOfflinePageControls(event);
    }
  }
  ResizeSurveyPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.surveyPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'surveyPageData');
    this.SurveyPageDataSubject.next(this.MobileInterfaceData.surveyPageData);
  }

  ResizeOfflinePageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.offLinePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'offLinePageData');
    this.OffLinePageDataSubject.next(this.MobileInterfaceData.offLinePageData);
  }

  ResizeTicketPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.ticketPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'ticketPageData');
    this.TicketPageDataSubject.next(this.MobileInterfaceData.ticketPageData);
  }
  ResizeThankYouPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.thankYouPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'thankYouPageData');
    this.ThankYouPageDataSubject.next(
      this.MobileInterfaceData.thankYouPageData
    );
  }
  ResizeNoQueuePageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.noQueuePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'noQueuePageData');
    this.NoQueuePageDataSubject.next(
      this.MobileInterfaceData.noQueuePageData
    );
  }
  ResizeMServiceQuestionPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(
      control,
      'serviceQuestionPageData'
    );
    this.ServiceQuestionPageDataSubject.next(
      this.MobileInterfaceData.serviceQuestionPageData
    );
  }
  ResizeGlobalPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.globalQuestionPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(
      control,
      'globalQuestionPageData'
    );
    this.GlobalQuestionPageDataSubject.next(
      this.MobileInterfaceData.globalQuestionPageData
    );
  }
  ResizeServicePageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.servicePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'servicePageData');
    this.ServicePageDataSubject.next(this.MobileInterfaceData.servicePageData);
  }
  ResizeWelcomePageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.welcomePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'welcomePageData');
    this.WelcomePageDataSubject.next(this.MobileInterfaceData.welcomePageData);
  }
  ResizeLanguagePageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.languagePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'languagePageData');
    this.LanguagePageDataSubject.next(
      this.MobileInterfaceData.languagePageData
    );
  }
  ResizeMarketingPageControls(event: IMobileResizeControlEvent) {
    const control =
      this.MobileInterfaceData.marketingPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.height.setValue(event.event.size.height);
    this.UpdateSelectedPropertyOfPageControls(control, 'marketingPageData');
    this.MarketingPageDataSubject.next(
      this.MobileInterfaceData.marketingPageData
    );
  }

  //#endregion

  //#region All other controls move end functions from all pages
  ControlMoveEnd(event: IMobileMoveEndControlEvent) {
    if (this.CurrentPageSubject.value.IsMarketingPage) {
      this.OnPageOtherControlsSelection('MarketingPageDataSubject');
      this.MoveMarketingPageControls(event);
    } else if (this.CurrentPageSubject.value.IsWelcomePage) {
      this.OnPageOtherControlsSelection('WelcomePageDataSubject');
      this.MoveWelcomePageControls(event);
    } else if (this.CurrentPageSubject.value.IsLanguagePage) {
      this.OnPageOtherControlsSelection('LanguagePageDataSubject');
      this.MoveLanguagePageControls(event);
    } else if (this.CurrentPageSubject.value.IsServicePage) {
      this.OnPageOtherControlsSelection('ServicePageDataSubject');
      this.MoveServicePageControls(event);
    } else if (this.CurrentPageSubject.value.IsGlobalQuestionPage) {
      this.OnPageOtherControlsSelection('GlobalQuestionPageDataSubject');
      this.MoveGlobalPageControls(event);
    } else if (this.CurrentPageSubject.value.IsServiceQuestionPage) {
      this.OnPageOtherControlsSelection('ServiceQuestionPageDataSubject');
      this.MoveMServiceQuestionPageControls(event);
    } else if (this.CurrentPageSubject.value.IsThankYouPage) {
      this.OnPageOtherControlsSelection('ThankYouPageDataSubject');
      this.MoveThankYouPageControls(event);
    } else if (this.CurrentPageSubject.value.IsNoQueuePage) {
      this.OnPageOtherControlsSelection('NoQueuePageDataSubject');
      this.MoveNoQueuePageControls(event);
    } else if (this.CurrentPageSubject.value.IsTicketPage) {
      this.OnPageOtherControlsSelection('TicketPageDataSubject');
      this.MoveTicketPageControls(event);
    } else if (this.CurrentPageSubject.value.IsSurveyPage) {
      this.OnPageOtherControlsSelection('SurveyPageDataSubject');
      this.MoveSurveyPageControls(event);
    } else if (this.CurrentPageSubject.value.IsOffLinePage) {
      this.OnPageOtherControlsSelection('OffLinePageDataSubject');
      this.MoveOfflinePageControls(event);
    }

  }

  MoveSurveyPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.surveyPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'surveyPageData');
    this.SurveyPageDataSubject.next(this.MobileInterfaceData.surveyPageData);
  }

  MoveOfflinePageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.offLinePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'offLinePageData');
    this.OffLinePageDataSubject.next(this.MobileInterfaceData.offLinePageData);
  }

  MoveTicketPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.ticketPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'ticketPageData');
    this.TicketPageDataSubject.next(this.MobileInterfaceData.ticketPageData);
  }
  MoveThankYouPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.thankYouPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'thankYouPageData');
    this.ThankYouPageDataSubject.next(
      this.MobileInterfaceData.thankYouPageData
    );
  }
  MoveNoQueuePageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.noQueuePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'noQueuePageData');
    this.NoQueuePageDataSubject.next(
      this.MobileInterfaceData.noQueuePageData
    );
  }
  MoveMServiceQuestionPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.serviceQuestionPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(
      control,
      'serviceQuestionPageData'
    );
    this.ServiceQuestionPageDataSubject.next(
      this.MobileInterfaceData.serviceQuestionPageData
    );
  }
  MoveGlobalPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.globalQuestionPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(
      control,
      'globalQuestionPageData'
    );
    this.GlobalQuestionPageDataSubject.next(
      this.MobileInterfaceData.globalQuestionPageData
    );
  }
  MoveServicePageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.servicePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'servicePageData');
    this.ServicePageDataSubject.next(this.MobileInterfaceData.servicePageData);
  }
  MoveWelcomePageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.welcomePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'welcomePageData');
    this.WelcomePageDataSubject.next(this.MobileInterfaceData.welcomePageData);
  }
  MoveLanguagePageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.languagePageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'languagePageData');
    this.LanguagePageDataSubject.next(
      this.MobileInterfaceData.languagePageData
    );
  }
  MoveMarketingPageControls(event: IMobileMoveEndControlEvent) {
    const control =
      this.MobileInterfaceData.marketingPageData.otherControlList.find(
        (x) => x.control === event.control
      );
    control.control.form.controls.top.setValue(event.event.y);
    this.UpdateSelectedPropertyOfPageControls(control, 'marketingPageData');
    this.MarketingPageDataSubject.next(
      this.MobileInterfaceData.marketingPageData
    );
  }

  private UpdateSelectedPropertyOfPageControls(
    control: IOtherControlDDL,
    pageName: string
  ) {
    if (pageName === 'marketingPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnMarketingPage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnMarketingPage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnMarketingPage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnMarketingPage(control.control);
      }
    } else if (pageName === 'languagePageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnLanguagePage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnLanguagePage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnLanguagePage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnLanguagePage(control.control);
      }
    } else if (pageName === 'welcomePageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnWelcomePage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnWelcomePage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnWelcomePage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnWelcomePage(control.control);
      }
    } else if (pageName === 'servicePageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnServicePage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnServicePage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnServicePage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnServicePage(control.control);
      }
    } else if (pageName === 'globalQuestionPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnGlobalQuestionPage(
          control.control
        );
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnGlobalQuestionPage(
          control.control
        );
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnGlobalQuestionPage(
          control.control
        );
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnGlobalQuestionPage(
          control.control
        );
      }
    } else if (pageName === 'serviceQuestionPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnServiceQuestionPage(
          control.control
        );
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnServiceQuestionPage(
          control.control
        );
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnServiceQuestionPage(
          control.control
        );
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnServiceQuestionPage(
          control.control
        );
      }
    } else if (pageName === 'thankYouPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnThankYouPage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnThankYouPage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnThankYouPage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnThankYouPage(control.control);
      }
    } else if (pageName === 'ticketPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnTicketPage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnTicketPage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnTicketPage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnTicketPage(control.control);
      }
    } else if (pageName === 'surveyPageData') {
      if (control.isImageControl) {
        this.SelectAndHighlightImageControlOnSurveyPage(control.control);
      } else if (control.isLabelControl) {
        this.SelectAndHighlightLabelControlOnSurveyPage(control.control);
      } else if (control.isVideoControl) {
        this.SelectAndHighlightVideoControlOnSurveyPage(control.control);
      } else if (control.isSliderControl) {
        this.SelectAndHighlightSliderControlOnSurveyPage(control.control);
      }
    }
  }

  //#endregion

  //#region  Control Selection
  OnPageButtonSelection(subjectName: string) {
    this.ResetPageControlSelection(subjectName);
    this[subjectName].value.controlSelection.IsButtonSelected =
      true;
    this[subjectName].next(
      this[subjectName].value
    );
  }

  OnPageDefaultControlSelection(subjectName: string) {
    this.ResetPageControlSelection(subjectName);
    this[subjectName].value.controlSelection.IsPanelSelected = true;
    this[subjectName].next(this[subjectName].value);
  }

  OnPageOtherControlsSelection(subjectName: string) {
    this.ResetPageControlSelection(subjectName);

    this[subjectName].value.controlSelection.IsOtherControlSelected =
      true;
    this[subjectName].next(
      this[subjectName].value
    );
  }

  ResetPageControlSelection(subjectName: string) {
    for (const [propertyKey, propertyValue] of Object.entries(
      this[subjectName].value.controlSelection
    )) {
      this[subjectName].value.controlSelection[propertyKey] =
        false;
    }
  }

  OnHeaderSelection() {
    const currentPage = this.CurrentPageSubject.value;
    if (currentPage.IsGlobalQuestionPage) {
      this.UpdateSubjectOnHeaderSelection('GlobalQuestionPageDataSubject');
    } else if (currentPage.IsThankYouPage) {
      this.UpdateSubjectOnHeaderSelection('ThankYouPageDataSubject');
    } else if (currentPage.IsNoQueuePage) {
      this.UpdateSubjectOnHeaderSelection('NoQueuePageDataSubject');
    } else if (currentPage.IsLanguagePage) {
      this.UpdateSubjectOnHeaderSelection('LanguagePageDataSubject');
    } else if (currentPage.IsWelcomePage) {
      this.UpdateSubjectOnHeaderSelection('WelcomePageDataSubject');
    } else if (currentPage.IsServiceQuestionPage) {
      this.UpdateSubjectOnHeaderSelection('ServiceQuestionPageDataSubject');
    } else if (currentPage.IsServicePage) {
      this.UpdateSubjectOnHeaderSelection('ServicePageDataSubject');
    } else if (currentPage.IsTicketPage) {
      this.UpdateSubjectOnHeaderSelection('TicketPageDataSubject');
    } else if (currentPage.IsMarketingPage) {
      this.UpdateSubjectOnHeaderSelection('MarketingPageDataSubject');
    } else if (currentPage.IsSurveyPage) {
      this.UpdateSubjectOnHeaderSelection('SurveyPageDataSubject');
    } else if (currentPage.IsOffLinePage) {
      this.UpdateSubjectOnHeaderSelection('OffLinePageDataSubject');
    }
  }

  private UpdateSubjectOnHeaderSelection(subjectName: string) {
    this.ResetPageControlSelection(subjectName);
    this[subjectName].value.controlSelection.IsHeaderSelected =
      true;
    this[subjectName].next(
      this[subjectName].value
    );
  }

  OnFooterSelection() {
    const currentPage = this.CurrentPageSubject.value;
    if (currentPage.IsGlobalQuestionPage) {
      this.UpdateSubjectOnFooterSelection('GlobalQuestionPageDataSubject');
    } else if (currentPage.IsThankYouPage) {
      this.UpdateSubjectOnFooterSelection('ThankYouPageDataSubject');
    } else if (currentPage.IsLanguagePage) {
      this.UpdateSubjectOnFooterSelection('LanguagePageDataSubject');
    } else if (currentPage.IsWelcomePage) {
      this.UpdateSubjectOnFooterSelection('WelcomePageDataSubject');
    } else if (currentPage.IsServiceQuestionPage) {
      this.UpdateSubjectOnFooterSelection('ServiceQuestionPageDataSubject');
    } else if (currentPage.IsServicePage) {
      this.UpdateSubjectOnFooterSelection('ServicePageDataSubject');
    } else if (currentPage.IsTicketPage) {
      this.UpdateSubjectOnFooterSelection('TicketPageDataSubject');
    } else if (currentPage.IsMarketingPage) {
      this.UpdateSubjectOnFooterSelection('MarketingPageDataSubject');
    } else if (currentPage.IsSurveyPage) {
      this.UpdateSubjectOnFooterSelection('SurveyPageDataSubject');
    } else if (currentPage.IsNoQueuePage) {
      this.UpdateSubjectOnFooterSelection('NoQueuePageDataSubject');
    } else if (currentPage.IsOffLinePage) {
      this.UpdateSubjectOnFooterSelection('OffLinePageDataSubject');
    }
  }

  private UpdateSubjectOnFooterSelection(subjectName: string) {
    this.ResetPageControlSelection(subjectName);
    this[subjectName].value.controlSelection.IsFooterSelected =
      true;
    this[subjectName].next(
      this[subjectName].value
    );
  }



  //#endregion

  //#region Common Function
  UpdateValuesOfDesignerScreenPanelSubject() {
    this.DesignerPanelSubject.next(this.MobileInterfaceData.designerScreen);
  }
  UpdateValuesOfFooterControlPanelSubject() {
    this.FooterControlSubject.next(this.MobileInterfaceData.footerData);
  }
  UpdateValuesOfHeaderControlPanelSubject() {
    this.HeaderControlSubject.next(this.MobileInterfaceData.headerData);
  }
  UpdateValuesOfPagePropertiesSubject() {
    this.PagePropertiesSubject.next(this.MobileInterfaceData.pageProperties);
  }
  UpdateValuesOfMarketingPageSubject() {
    this.MarketingPageDataSubject.next(
      this.MobileInterfaceData.marketingPageData
    );
  }
  UpdateValuesOfWelcomePageSubject() {
    this.WelcomePageDataSubject.next(this.MobileInterfaceData.welcomePageData);
  }
  UpdateValuesOfLanguagePageSubject() {
    this.LanguagePageDataSubject.next(
      this.MobileInterfaceData.languagePageData
    );
  }
  UpdateValuesOfGlobalQuestionPagePageSubject() {
    this.GlobalQuestionPageDataSubject.next(
      this.MobileInterfaceData.globalQuestionPageData
    );
  }
  UpdateValuesOfServicePageSubject() {
    this.ServicePageDataSubject.next(this.MobileInterfaceData.servicePageData);
  }
  UpdateValuesOfServiceQuestionPageSubject() {
    this.ServiceQuestionPageDataSubject.next(
      this.MobileInterfaceData.serviceQuestionPageData
    );
  }
  UpdateValuesOfThankYouPageSubject() {
    this.ThankYouPageDataSubject.next(
      this.MobileInterfaceData.thankYouPageData
    );
  }
  UpdateValuesOfNoQueuePageSubject() {
    this.NoQueuePageDataSubject.next(
      this.MobileInterfaceData.noQueuePageData
    );
  }
  UpdateValuesOfTicketPageSubject() {
    this.TicketPageDataSubject.next(this.MobileInterfaceData.ticketPageData);
  }
  UpdateValuesOfSurveyPageSubject() {
    this.SurveyPageDataSubject.next(this.MobileInterfaceData.surveyPageData);
  }

  UpdateValuesOfOfflinePageSubject() {
    this.OffLinePageDataSubject.next(this.MobileInterfaceData.offLinePageData);
  }

  GetCurrentPage(pageNumber: string): IMobilePageDetails {

    const Page: IMobilePageDetails = this.DefaultPageBooleanValue();
    if (pageNumber === MobilePageName.WelcomePage.toString()) {
      Page.IsWelcomePage = true;
    }
    else if (pageNumber === MobilePageName.GlobalQuestionPage.toString()) {
      Page.IsGlobalQuestionPage = true;
    }
    else if (pageNumber === MobilePageName.ServicePage.toString()) {
      Page.IsServicePage = true;
    }
    else if (pageNumber === MobilePageName.ServiceQuestionPage.toString()) {
      Page.IsServiceQuestionPage = true;
    }
    else if (pageNumber === MobilePageName.ThankYouPage.toString()) {
      Page.IsThankYouPage = true;
    }
    else if (pageNumber === MobilePageName.NoQueuePage.toString()) {
      Page.IsNoQueuePage = true;
    }
    else if (pageNumber === MobilePageName.MarketingPage.toString()) {
      Page.IsMarketingPage = true;
    }
    else if (pageNumber === MobilePageName.TicketPage.toString()) {
      Page.IsTicketPage = true;
    }
    else if (pageNumber === MobilePageName.SurveyPage.toString()) {
      Page.IsSurveyPage = true;
    }
    else if (pageNumber === MobilePageName.LanguagePage.toString()) {
      Page.IsLanguagePage = true;
    } else if (pageNumber === MobilePageName.OfflinePage.toString()) {
      Page.IsOffLinePage = true;
    }

    return Page;
  }

  private DefaultPageBooleanValue(): IMobilePageDetails {
    const Page: IMobilePageDetails = {
      IsServicePage: false,
      IsWelcomePage: false,
      IsServiceQuestionPage: false,
      IsGlobalQuestionPage: false,
      IsThankYouPage: false,
      IsMarketingPage: false,
      IsTicketPage: false,
      IsSurveyPage: false,
      IsLanguagePage: false,
      IsNoQueuePage: false,
      IsOffLinePage: false
    };
    return Page;
  }

  GetOtherControlList(
    control: Control,
    otherControls: IOtherControlDDL[]
  ): IOtherControlDDL[] {
    return [].concat(
      this.AddNewControlToOtherControlListAndGetOtherControlList(
        otherControls,
        control,
        control.name,
        control instanceof LabelControl,
        control instanceof ImageControl,
        control instanceof VideoControl,
        control instanceof SliderControl
      )
    );
  }
  private AddNewControlToOtherControlListAndGetOtherControlList(
    ddlControl: Array<IOtherControlDDL>,
    control: Control,
    name: string,
    isLabelControl: boolean,
    isImageControl: boolean,
    isVideoControl: boolean,
    isSliderControl: boolean = false
  ) {
    ddlControl.push({
      showPropertyWindow: false,
      control,
      isLabelControl,
      isImageControl,
      isSliderControl,
      isVideoControl,
    });
    return this.GetOtherControlsListAfterSettingShowPropertyWindowvalue(
      ddlControl,
      name
    );
  }

  private GetOtherControlsListAfterSettingShowPropertyWindowvalue(
    ddlControl: Array<IOtherControlDDL>,
    name: string
  ) {
    ddlControl.map((x) => (x.showPropertyWindow = false));
    ddlControl.find((x) => x.control.name === name).showPropertyWindow = true;
    return ddlControl;
  }
  private ResetOtherControlPropertyWindow(otherControls, control) {
    const index = otherControls.indexOf(
      otherControls.find((x) => x.control.name === control.name)
    );
    otherControls.splice(index, 1);
    if (index !== 0) {
      this.ChangeOtherControlPropertyWindow(
        otherControls[index - 1].control.name
      );
    } else if (otherControls.length !== 0) {
      this.ChangeOtherControlPropertyWindow(otherControls[index].control.name);
    }
    return otherControls;
  }

  ConvertTranslatedLanguageArrayToObject(arr) {
    const obj = {};
    for (const element of arr) {
      obj[element.languageId] = element.translatedText;
    }
    return obj;
  }
  //#endregion

  //#region  Default data methods
  GetGeneralStyles() {
    return {
      backgroundColor: '#173e2e',
      backgroundImage: null,
      boxRoundCorners: '',
      color: 'black',
      height: 248,
      left: 86,
      top: 142,
      zindex: 50,
      width: 660,
      font: 'Arial',
      fontStyle: 'Normal',
      fontSize: 13,
      fontWeight: 'normal',
    };
  }
  GetDefaultControlsStyles() {
    return {
      backgroundColor: '#8d8254',
      backgroundImage: null,
      boxRoundCorners: '10',
      color: '#ffffff',
      height: 248,
      left: 86,
      top: 142,
      zindex: 50,
      width: 660,
      font: 'Arial',
      fontStyle: 'Normal',
      fontSize: 13,
      fontWeight: 'normal',
    };
  }
  GetDefaultButtonControlsStyles() {
    return {
      backgroundColor: '#6fb557',
      backgroundImage: null,
      boxRoundCorners: '10',
      color: '#ffffff',
      height: 82,
      left: 86,
      top: 142,
      zindex: 50,
      width: 660,
      font: 'Arial',
      fontStyle: 'Normal',
      fontSize: 13,
      fontWeight: 'bold',
    };
  }
  GetFooterDefaultData() {
    return {
      color: '#97863c',
      fontSize: 10,
      font: 'Arial',
      fontStyle: 'Normal',
      fontWeight: 'bolder',
      footerImage: this.FooterImage,
      text: { en: ``},
      isVisible: true,
      isTextVisible: true,
      isFooterImageVisible: true,
      isLogoVisible: true,
      footerLogo: this.FooterLogo,
    };
  }
  GetHeaderDefaultData() {
    // TODO: Change path with actual company logo
    return {
      backgroundImage:
        this.authService.CompanyLogoUrl != 'undefined' &&
          this.authService.CompanyLogoUrl != undefined
          ? this.authService.CompanyLogoUrl
          : '../../../../../../assets/img/qtracvr.png',
      isVisible: true,
      verticalPadding: '10',
      horizontalPadding: '10',
      logoPosition: 'center',
      height: '10'
    };
  }

  GetPagePropertiesData() {
    return {
      hideWelcomePage: false,
      hideThankYouPage: false
    };
  }

  GetDefaultSurveyPageData(): ISurveyPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      panel: null,
      button: null,
      questionSetList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultWelcomePageData(): IWelcomePageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      button: null,
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultLanguagePageData(): ILanguagePageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      panel: null,
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultGlobalQuestionPageData(): IGlobalQuestionPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      buttons: [],
      panel: null,
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultServicePageData(): IServicePageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      panel: null,
      buttons: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultServiceQuestionPageData(): IServiceQuestionPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      panel: null,
      button: null,
      questionSetList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultTicketPageData(): ITicketPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      panel: null,
      buttonPanel: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 2,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultMarketingPageData(): IMarketingPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 1,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }
  GetDefaultThankYouPageData(): IThankYouPageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      otherControlList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 1,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  GetDefaultNoQueuePageData(): INoQueuePageData {
    return {
      images: [],
      labels: [],
      videos: [],
      sliders: [],
      buttons: [],
      otherControlList: [],
      otherControlsCount: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsFooterSelected: false,
        IsHeaderSelected: false,
        IsOtherControlSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  GetPageList() {
    const pageList: IMobileDropdown[] = [];
    pageList.push({
      text: 'Language Page',
      value: MobilePageName.LanguagePage.toString(),
      selected: true,
    });
    pageList.push({
      text: 'Welcome Page',
      value: MobilePageName.WelcomePage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'General Questions Page',
      value: MobilePageName.GlobalQuestionPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Service Page',
      value: MobilePageName.ServicePage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Service Question Page',
      value: MobilePageName.ServiceQuestionPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Thank You Page',
      value: MobilePageName.ThankYouPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Ticket Page',
      value: MobilePageName.TicketPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Now Calling Page',
      value: MobilePageName.MarketingPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'Survey Page',
      value: MobilePageName.SurveyPage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'No Queue Page',
      value: MobilePageName.NoQueuePage.toString(),
      selected: false,
    });
    pageList.push({
      text: 'OffLine Hours Page',
      value: MobilePageName.OfflinePage.toString(),
      selected: false,
    });

    return pageList;
  }
  //#endregion

  //#region Control creation methods

  GetDesignPanelControl(
    workflowId: string,
    workflowName: string,
    templateName: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    height: number,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    waitingTime: number
  ): DesignerPanelControl {
    return new DesignerPanelControl(
      this.formBuilder,
      workflowId,
      workflowName,
      templateName,
      backgroundImage,
      backgroundColor,
      color,
      height,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      waitingTime
    );
  }

  GetPageProperties(
    hideWelcomePage: boolean,
    hideThankYouPage: boolean
  ): PageProperties {
    return new PageProperties(
      this.formBuilder,
      hideWelcomePage,
      hideThankYouPage
    );
  }

  GetFooterControl(
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: string,
    footerImage: string,
    text: object,
    footerLogo: string,
    isVisible: boolean = true,
    isTextVisible: boolean = true,
    isFooterImageVisible: boolean = true,
    isLogoVisible: boolean = true,
  ): FooterControl {
    return new FooterControl(
      this.formBuilder,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      footerImage,
      text,
      isVisible,
      isTextVisible,
      isFooterImageVisible,
      isLogoVisible,
      footerLogo
    );
  }
  GetHeaderControl(backgroundImage: string, isVisible: boolean, verticalPadding: string = '10',
    horizontalPadding: string = '10', logoPosition: string = 'center',height: string = '10'): HeaderControl {
    return new HeaderControl(this.formBuilder, backgroundImage, isVisible, verticalPadding, horizontalPadding, logoPosition,height);
  }
  CreateLabelControl(
    name: string,
    defaultText: object,
    defaultHyperLink: string,
    defaultColor: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    zindex: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    backgroundColor: string = '',
    verticalPadding: string = '10',
    horizontalPadding: string = '10',
    rounderCorners: string = '10',
    alignment: string = this.Alignment
  ) {
    return new LabelControl(
      this.formBuilder,
      name,
      defaultText,
      defaultHyperLink,
      defaultColor,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      rounderCorners,
      defaultWidth,
      defaultHeight,
      y,
      x,
      zindex,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      alignment
    );
  }
  CreateButtonControl(
    name: string,
    defaultText: object,
    defaultColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    backgroundColor: string = '',
    verticalPadding: string = '0',
    horizontalPadding: string = '10',
    rounderCorners: string = '10',
    height: number = 82,
    width: number = 100,
    top: number = 200,
    isPrimaryButtonSelected = true,
    showPrimaryButtonIcon: boolean,
    showSecondaryButtonIcon: boolean = false,
    primaryButtonSrc: ILanguageControl[],
    secondaryButtonSrc: ILanguageControl[] = [],
    border: string,
    borderColor: string,
    shadow: boolean,
    secondaryButtonText?: object,
    dropdownText?: string
  ) {
    return new ButtonControl(
      this.formBuilder,
      name,
      defaultText,
      defaultColor,
      backgroundColor,
      verticalPadding,
      horizontalPadding,
      rounderCorners,
      height,
      width,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      top,
      isPrimaryButtonSelected,
      showPrimaryButtonIcon,
      showSecondaryButtonIcon,
      primaryButtonSrc,
      secondaryButtonSrc,
      secondaryButtonText,
      border,
      borderColor,
      shadow,
      dropdownText
    );
  }
  CreateImageControl(
    name: string,
    src: ILanguageControl[],
    defaultHyperLink: string,
    defaultWidth: number,
    defaultHeight: number,
    x: number,
    y: number,
    zindex: number,
    verticalPadding: string = '10',
    horizontalPadding: string = '60',
    rounderCorners: string = '10'
  ) {
    const imageControl = new ImageControl(
      this.formBuilder,
      name,
      src,
      defaultHyperLink,
      defaultWidth,
      verticalPadding,
      horizontalPadding,
      rounderCorners,
      defaultHeight,
      x,
      y,
      zindex
    );
    return imageControl;
  }
  CreateVideoControl(
    name: string,
    src: ILanguageControl[],
    defaultWidth: number,
    defaultHeight: number,
    x: number,
    y: number,
    zindex: number,
    verticalPadding: string = '10',
    horizontalPadding: string = '60',
    rounderCorners: string = '10'
  ) {
    const videoControl = new VideoControl(
      this.formBuilder,
      name,
      src,
      defaultWidth,
      verticalPadding,
      horizontalPadding,
      rounderCorners,
      defaultHeight,
      x,
      y,
      zindex
    );
    return videoControl;
  }
  CreateSliderControl(
    name: string,
    defaultWidth: number,
    defaultHeight: number,
    y: number,
    x: number,
    zindex: number,
    urls: IMobileSliderControlPostPreview[],
    verticalPadding: string = '10',
    horizontalPadding: string = '20',
    boxCorner: string = '10'
  ) {
    return new SliderControl(
      this.formBuilder,
      name,
      urls,
      defaultWidth,
      defaultHeight,
      x,
      y,
      zindex,
      verticalPadding,
      horizontalPadding,
      boxCorner
    );
  }
  CreateTicketControl(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    roundCorners: string = '10',
    dynamicTextColor: string = '',
    horizontalPadding: string = '10',
    verticalPadding: string = '0'
  ): any {
    return new TicketControl(
      this.formBuilder,
      height,
      top,
      backgroundColor,
      roundCorners,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      0,
      dynamicTextColor,
      horizontalPadding,
      verticalPadding
    );
  }
  CreateTicketItemControl(
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    type: string,
    text: object,
    value: string,
    visible: boolean,
    selected: boolean,
    color: string,
    backgroundColor: string,
    horizontalPadding: string,
    roundCorners: string,
    verticalPadding: string,
    height: number,
    width: number,
    showItem: boolean,
    valuesFont: string,
    valuesFontStyle: string,
    valuesFontSize: number,
    valuesFontWeight: number | string
  ): any {
    return new TicketItemControl(
      this.formBuilder,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      type,
      text,
      value,
      visible,
      selected,
      color,
      backgroundColor,
      horizontalPadding,
      roundCorners,
      verticalPadding,
      height,
      width,
      showItem,
      valuesFont,
      valuesFontStyle,
      valuesFontSize,
      valuesFontWeight
    );
  }
  CreatePanelControl(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    roundCorners: string = '10',
    dynamicTextColor: string = '',
    horizontalPadding: string = '0',
    verticalPadding: string = '10',
    showServiceIcons: boolean = false
  ): any {
    return new PanelControl(
      this.formBuilder,
      height,
      top,
      backgroundColor,
      roundCorners,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      0,
      dynamicTextColor,
      horizontalPadding,
      verticalPadding,
      showServiceIcons
    );
  }
  CreateItemControl(
    questions: {},
    itemId: string,
    required: boolean,
    visible: boolean,
    itemSetId: string = null,
    isItemSelected: boolean = true,
    icons = {}
  ) {
    return new ItemsControl(
      questions,
      itemId,
      itemSetId,
      required,
      visible,
      isItemSelected,
      icons
    );
  }
  //#endregion

  ObjectIsEmpty(object) {
    for (const key in object) {
      if (key) {
        return false;
      }
    }
    return true;
  }
}
