import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IWorkFlowRequest } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { KioskExecution } from 'src/app/models/constants/kiosk-constants';
import { KioskPageName } from 'src/app/models/enums/kiosk-page-name.enum';
import { Language } from 'src/app/models/enums/language-enum';
import {
  DocumentType,
  VariablePurpose,
  VariableRequestDocument
} from 'src/app/models/enums/variables-related';
import { DynamicVariableService } from '../../../../../core/services/dynamic-variables.service';
import {
  GetDefaultIfNegativeOrNull,
  getTimeStampSplitedFileName
} from '../../../../../core/utilities/core-utilities';
import { IDynamicVariable } from '../../../../../models/common/dynamic-variable.interface';
import { ILanguageControl } from '../../../../../models/common/language-control.interface';
import { TicketItem } from '../../../../../models/enums/ticket-items.enum';
import { CompanyAPIService } from '../../../../../shared/api-services/company-api.service';
import { KioskAPIService } from '../../../../../shared/api-services/kiosk-api.service';
import { KioskService } from '../../kiosk.service';
import { KioskAddService } from '../kiosk-add.service';
import { ButtonControl } from './Models/controls/button.control';
import { DesignerPanelControl } from './Models/controls/designer-panel.control';
import { ImageControl } from './Models/controls/image.control';
import { LabelControl } from './Models/controls/label.control';
import { LanguagePanelControl } from './Models/controls/language-panel-control';
import { PageProperties } from './Models/controls/page-properties';
import { ServiceBoxControl } from './Models/controls/service-box.control';
import {
  Mode,
  ServicePanelControl
} from './Models/controls/service-panel.control';
import { SliderControl } from './Models/controls/slider.control';
import { Styles } from './Models/controls/styles';
import { ThankYouPanelControl } from './Models/controls/thank-you-panel.control';
import { VideoControl } from './Models/controls/video.control';
import { IDropdown } from './Models/drop-down-Item';
import { IKioskConfiguration } from './Models/kiosk-configuration.interface';
import {
  IKioskButtonControlData,
  IKioskImageControlData,
  IKioskLabelControlData,
  IKioskLayoutData,
  IKioskPanelItemsData,
  IKioskQuestionSetData,
  IKioskSliderControlData,
  IWorkFlowDetail
} from './Models/kiosk-layout-data.interface';
import { KioskOtherControlsCountDetail } from './Models/kiosk-other-controls-count-details.interface';
import { IKioskPageData } from './Models/kiosk-page-data.interface';
import {
  IKioskThankYouItemData,
  IKioskVideosControlData
} from './Models/kiosk-preview-data.interface';
import { ILanguagePage } from './Models/language-page.interface';
import { INoQueuePage } from './Models/no-queue-page.interface';
import { IOffLinePage } from './Models/off-line-page.interface';
import { IPage } from './Models/pages.interface';
import { IPreServiceQuestion } from './Models/pre-service-question.interface';
import { IQuestionSet } from './Models/question-set.interface';
import { IServiceQuestion } from './Models/service-questions.interface';
import { IService } from './Models/service.interface';
import { ISliderControlPostPreview } from './Models/slider-control-preview.interface';
import { ISupportedLanguage } from './Models/supported-language.interface';
import { IThankYouItemControl } from './Models/thank-you-page-item.interface';
import { IThankYouPage } from './Models/thank-you-page.interface';
import { IWelcomePage } from './Models/welcome-page.interface';

@Injectable()
export class KioskLayoutService extends AbstractComponentService {
  /* #region  Subjects and Observable declaration*/
  private CurrentPageSubject: BehaviorSubject<IPage>;
  CurrentPage$: Observable<IPage>;
  private KioskGlobalQuestionPageSubject: BehaviorSubject<IPreServiceQuestion>;
  KioskPreServiceQuestion$: Observable<IPreServiceQuestion>;
  private PageListSubject: BehaviorSubject<IDropdown[]>;
  PageList$: Observable<IDropdown[]>;
  private SelectedLanguageSubject: BehaviorSubject<string>;
  SelectedLanguage$: Observable<string>;
  private DefaultLanguageSubject: BehaviorSubject<string>;
  DefaultLanguage$: Observable<string>;

  private KioskServiceQuestionSubject: BehaviorSubject<IServiceQuestion>;
  KioskServiceQuestion$: Observable<IServiceQuestion>;
  private KioskServiceSubject: BehaviorSubject<IService>;
  KioskService$: Observable<IService>;
  private KioskDataSubject: BehaviorSubject<IKioskPageData>;
  KioskData$: Observable<IKioskPageData>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  private PagePropertiesSubject: BehaviorSubject<PageProperties>;
  PageProperties$: Observable<PageProperties>;
  private ThankYouSubject: BehaviorSubject<IThankYouPage>;
  ThankYou$: Observable<IThankYouPage>;
  private WelcomePageSubject: BehaviorSubject<IWelcomePage>;
  WelcomePage$: Observable<IWelcomePage>;
  private LanguagePageSubject: BehaviorSubject<ILanguagePage>;
  LanguagePage$: Observable<ILanguagePage>;
  private LanguageSubject: BehaviorSubject<ISupportedLanguage[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;
  IsEditMode$: Observable<boolean>;
  private NoQueuePageSubject: BehaviorSubject<INoQueuePage>;
  NoQueuePage$: Observable<INoQueuePage>;
  
  private OffLinePageSubject: BehaviorSubject<IOffLinePage>;
  OffLinePage$: Observable<IOffLinePage>;

  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;

  /* #endregion */

  KioskData: IKioskPageData;
  WorkFlow: IWorkFlowDetail;
  KioskTemplateId: string = this.browserStorageService.KioskTemplateId;
  isValidLayoutData = true;
  PanelColor = '#000000';
  SaveKioskAsDraft = 'saveAsDraft';
  SaveKiosk = 'save';
  FontStyles: Styles = {
    backgroundColor: '#636466',
    backgroundImage: null,
    boxRoundCorners: '',
    color: '#000000',
    height: 250,
    left: 100,
    top: 150,
    zindex: 50,
    width: 650,
    font: 'Arial',
    fontStyle: 'Normal',
    fontSize: 13,
    fontWeight: 'normal',
  };
  DefaultLanguageCode = Language.English;

  DesignerPanel = {
    width: 800,
    height: 500,
    backgroundImage: '',
    backgroundColor: '#aa9c9c',
    color: 'Black',
    cellSize: 50,
    showGrid: false,
    enableVirtualKeyboard: false,
    waitingTime: this.IsKioskTemplateIdExistInSession()
      ? null
      : KioskExecution.WaitingTime,
  };

  PageProperties = {
    hideWelcomePage: false
  };

  ThankYouPageStyles = {
    backgroundColor: '#67AE67',
    itemBackgroundColor: '#fff',
    backgroundImage: null,
    color: '#67AE67',
    secondaryColor: '#707070',
    height: 350,
    left: 150,
    top: 50,
    width: 500,
    font: 'Arial',
    fontStyle: 'Normal',
    fontSize: 13,
    fontWeight: 'normal',
    horizontalPadding: 0,
    verticalPadding: 10,
    messageDisplayTimeInSeconds: 5,
  };

  ButtonStyles = {
    color: '#fee060',
    BGColor: '#435d92',
    width: 100,
    height: 50,
    fontSize: 13,
    fontStyle: 'Normal',
    font: 'Arial',
    fontWeight: 'normal',
    left: 700,
    top: 450,
    zindex: 50,
    boxRoundCorners: '10',
    border: '2',
    borderColor: '#ffffff',
    shadow: false,
  };

  ThankYouButtonStyles = {
    color: '#67AE67',
    BGColor: '#fff',
    width: 500,
    height: 50,
    fontSize: 15,
    fontStyle: 'Normal',
    font: 'Arial',
    fontWeight: 'normal',
    left: 150,
    top: 400,
  };

  ThankYouBackButtonStyles = {
    left: 50,
    top: 350,
  };

  ServicePanelStyles = {
    backgroundColor: '#fff',
    height: 300,
    left: 150,
    top: 100,
    width: 500,
    horizontalPadding: 0,
    verticalPadding: 0,
    textBackgroundColor: '#fff',
  };

  LanguagePageStyles = {
    backgroundColor: '#67AE67',
    itemBackgroundColor: '#fff',
    backgroundImage: null,
    color: '#67AE67',
    height: 350,
    left: 150,
    top: 50,
    width: 500,
    font: 'Arial',
    fontStyle: 'Normal',
    fontSize: 13,
    fontWeight: 'normal',
    horizontalPadding: 0,
    verticalPadding: 10,
  };

  AppointmentButtonStyles = {
    top: 50,
    left: 700,
    width: 100,
    color: '#000000',
    bGColor: '#ffffff',
  };
  BackButtonStyles = {
    top: 450,
    left: 0,
  };

  servicePanelQuestionDisplayMode = 1;
  FinishButtonName = 'Finish Button';
  NextButtonName = 'Next Button';
  BackButtonName = 'Back Button';
  ExitButtonName = 'Exit Button';
  AppointmentButtonName = 'Appointment Button';
  NextButtonText = { en: 'Next' };
  FinishButtonText = { en: 'Finish' };
  ExitButtonText = { en: 'Exit' };
  AppointmentButtonText = { en: 'Appointment' };
  BackButtonText = { en: 'Back' };
  PanelBackgroundColor = '#67AE67';
  Alignment = 'center';
  BackgroundColor = 'rgba(0, 0, 0, 0)';

  OtherControlCountData: {
    totalImageCount: 0;
    totalLabelCount: 0;
    totalSliderCount: 0;
    totalVideoCount: 0;
  };
  DynamicVariablesSubject: BehaviorSubject<IDynamicVariable[]>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  DynamicVariables: IDynamicVariable[] = [];

  get SelectedLanguageCode() {
    return this.SelectedLanguageSubject.value;
  }

  constructor(
    private kioskService: KioskAddService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly kioskAPIService: KioskAPIService,
    private dynamicVariablesService: DynamicVariableService,
    private kioskMainService: KioskService
  ) {
    super();
    this.InitializeSubjects();
    if (this.IsKioskTemplateIdExistInSession()) {
      this.SetEditModeData();
    } else {
      this.SetAddModeData();
    }
  }

  private InitializeSubjects() {
    this.GetDefaultPageData();
    this.PageListSubject = new BehaviorSubject<IDropdown[]>(this.GetPageList());
    this.PageList$ = this.PageListSubject.asObservable();
    this.LanguageSubject = new BehaviorSubject<ISupportedLanguage[]>([]);
    this.LanguageList$ = this.LanguageSubject.asObservable();
    this.CurrentPageSubject = new BehaviorSubject<IPage>(
      this.GetCurrentPage(KioskPageName.LanguagePage.toString())
    );
    this.CurrentPage$ = this.CurrentPageSubject.asObservable();
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(
      this.KioskData.DesignerScreen
    );
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.PagePropertiesSubject = new BehaviorSubject<PageProperties>(this.KioskData.PageProperties);
    this.PageProperties$ = this.PagePropertiesSubject.asObservable();
    this.KioskDataSubject = new BehaviorSubject(this.KioskData);
    this.KioskData$ = this.KioskDataSubject.asObservable();
    this.SelectedLanguageSubject = new BehaviorSubject(
      this.DefaultLanguageCode
    );
    this.SelectedLanguage$ = this.SelectedLanguageSubject.asObservable();
    this.DefaultLanguageSubject = new BehaviorSubject(this.DefaultLanguageCode);

    this.DynamicVariablesSubject = new BehaviorSubject<IDynamicVariable[]>([]);
    this.DynamicVariables$ = this.DynamicVariablesSubject.asObservable();

    this.DefaultLanguage$ = this.DefaultLanguageSubject.asObservable();
    this.IsEditMode$ = this.kioskService.IsEditMode$;
    this.KioskServiceSubject = new BehaviorSubject<IService>(
      this.GetDefaultServicePageData()
    );
    this.KioskService$ = this.KioskServiceSubject.asObservable();
    this.ThankYouSubject = new BehaviorSubject<IThankYouPage>(
      this.GetDefaultThankYouPageData()
    );
    this.ThankYou$ = this.ThankYouSubject.asObservable();
    this.WelcomePageSubject = new BehaviorSubject<IWelcomePage>(
      this.GetDefaultWelcomePageData()
    );
    this.WelcomePage$ = this.WelcomePageSubject.asObservable();
    this.LanguagePageSubject = new BehaviorSubject<ILanguagePage>(
      this.GetDefaultLanguagePageData()
    );
    this.LanguagePage$ = this.LanguagePageSubject.asObservable();
    this.KioskGlobalQuestionPageSubject =
      new BehaviorSubject<IPreServiceQuestion>(
        this.GetDefaultPreServiceQuestionPageData()
      );
    this.KioskPreServiceQuestion$ =
      this.KioskGlobalQuestionPageSubject.asObservable();
    this.KioskServiceQuestionSubject = new BehaviorSubject<IServiceQuestion>(
      this.GetDefaultServiceQuestionPageData()
    );
    this.KioskServiceQuestion$ =
      this.KioskServiceQuestionSubject.asObservable();
    this.NoQueuePageSubject = new BehaviorSubject<INoQueuePage>(
        this.GetDefaultNoQueuePageData()
      );
    this.NoQueuePage$ = this.NoQueuePageSubject.asObservable();
    
    this.OffLinePageSubject = new BehaviorSubject<IOffLinePage>(
      this.GetDefaultOffLinePageData()
    );
  this.OffLinePage$ = this.OffLinePageSubject.asObservable();
    this.subs.sink = this.kioskService.WorkFlow$.subscribe((x) => {
      this.WorkFlow = x;
      this.KioskData.DesignerScreen.workFlowName = x.name;
      this.KioskData.DesignerScreen.workFlowId = x.workFlowId;
      this.DesignerPanelSubject.next(
        Object.assign({}, this.KioskData.DesignerScreen)
      );
      this.dynamicVariablesService
        .GetDynamicVariables(x)
        .subscribe((allVariables) => {
          if (allVariables && Array.isArray(allVariables)) {
            allVariables.forEach((variables: any) => {
              this.DynamicVariables.push({
                data_type: variables.data_type,
                id: variables.id,
                shortName: variables.friendlyName,
                type: variables.type,
                fieldName: variables.shortName,
              });
            });
            this.DynamicVariablesSubject.next(this.DynamicVariables);
          }
        });
    });
    this.CallLanguageListAPI();

    
    this.IsOnlyGrid$ = this.DesignerPanel$.pipe(
      map((designer) => designer.showGrid)
    );
    this.GridSize$ = this.DesignerPanel$.pipe(
      map((designer) => designer.cellSize)
    );
  }

  private IsKioskTemplateIdExistInSession() {
    return this.KioskTemplateId;
  }

  private SetEditModeData() {
    this.GetTemplateData();
  }

  private SetAddModeData() {
    this.OnAddNewTemplateMode();
  }

  private GetTemplateData() {
    this.kioskAPIService
      .Get(this.authService.CompanyId, this.KioskTemplateId)
      .subscribe((x: IKioskLayoutData) => {
        x.designerScreen.cellSize = x.designerScreen.cellSize || 50;
        this.SetEditData(x);
      });
  }

  private SetEditData(x: IKioskLayoutData) {
    this.kioskService.WorkFlowList$.subscribe((workflow) => {
      x.designerScreen.workFlowName = workflow
        ? workflow.find((w) => w.workFlowId === x.designerScreen.WorkFlowId)
            .name
        : x.designerScreen.workFlowName;
    });
    this.KioskData.DesignerScreen.templateId = x.designerScreen.templateId;
    this.KioskData.DesignerScreen.styles.width = x.designerScreen.width;
    this.KioskData.DesignerScreen.styles.height = x.designerScreen.height;
    this.KioskData.DesignerScreen.showGrid = x.designerScreen.showGrid;
    this.KioskData.DesignerScreen.cellSize = x.designerScreen.cellSize;
    this.KioskData.DesignerScreen.enableVirtualKeyboard = x.designerScreen.enableVirtualKeyboard === undefined ? false: x.designerScreen.enableVirtualKeyboard;
    this.KioskData.DesignerScreen.styles.backgroundColor =
      x.designerScreen.backgroundColor;
    this.KioskData.DesignerScreen.backgroundImage =
      x.designerScreen.backGroundImage;
    this.KioskData.DesignerScreen.styles.color = x.designerScreen.color;
    this.KioskData.DesignerScreen.styles.fontSize = x.designerScreen.fontSize;
    this.KioskData.DesignerScreen.styles.fontStyle = x.designerScreen.fontStyle;
    this.KioskData.DesignerScreen.styles.font = x.designerScreen.font;
    this.KioskData.DesignerScreen.styles.fontWeight = this.GetDefaultFontWeight(
      x.designerScreen.fontWeight
    );
    this.KioskData.DesignerScreen.name = x.designerScreen.templateName;
    this.KioskData.DesignerScreen.workFlowId = x.designerScreen.WorkFlowId;
    this.KioskData.DesignerScreen.workFlowName = x.designerScreen.workFlowName;
    this.KioskData.DesignerScreen.waitingTime =
      x.designerScreen.waitingTime ?? KioskExecution.WaitingTime;
    this.KioskData.DesignerScreen.form.patchValue({
      width: x.designerScreen.width,
      height: x.designerScreen.height,
      name: x.designerScreen.templateName,
      backgroundImage: x.designerScreen.backGroundImage,
      backgroundColor: x.designerScreen.backgroundColor,
      color: x.designerScreen.color,
      font: x.designerScreen.font,
      fontStyle: x.designerScreen.fontStyle,
      fontSize: x.designerScreen.fontSize,
      fontWeight: this.GetDefaultFontWeight(x.designerScreen.fontWeight),
      workFlowId: x.designerScreen.WorkFlowId,
      cellSize: x.designerScreen.cellSize,
      showGrid: x.designerScreen.showGrid,
      enableVirtualKeyboard : x.designerScreen.enableVirtualKeyboard === undefined ? false: x.designerScreen.enableVirtualKeyboard,
      waitingTime: x.designerScreen.waitingTime ?? KioskExecution.WaitingTime,
    });
    this.DesignerPanelSubject.next(
      Object.assign({}, this.KioskData.DesignerScreen)
    );
    this.KioskData.PageProperties.hideWelcomePage = (x?.pageProperties?.hideWelcomePage) ? x.pageProperties.hideWelcomePage : false;
    this.KioskData.PageProperties.form.patchValue({
      hideWelcomePage: (x?.pageProperties?.hideWelcomePage) ? x.pageProperties.hideWelcomePage : false
    });
    this.UpdatePreServiceQuestionPageControlsCount(
      x.preServiceQuestionPage.controlsCount
    );
    this.UpdateServicePageControlsCount(x.servicePage.controlsCount);
    this.UpdateServiceQuestionPageControlsCount(
      x.serviceQuestion.controlsCount
    );
    this.UpdateWelcomePageControlsCount(x.welcomePage.controlsCount);
    this.UpdateThankYouPageControlsCount(x.thankYouPage.controlsCount);
    this.UpdateLanguagePageControlsCount(
      x.languagePage?.controlsCount || this.OtherControlCountData
    );
    this.UpdateNoQueuePageControlsCount(x?.noQueuePage?.controlsCount || this.OtherControlCountData);
    this.UpdateOffLinePageControlsCount(x?.offLinePage?.controlsCount || this.OtherControlCountData);

    this.EditAndSetItemsToServicePanel(
      x.servicePage.panel.width,
      x.servicePage.panel.height,
      x.servicePage.panel.top,
      x.servicePage.panel.left,
      x.servicePage.panel.backgroundColor,
      x.servicePage.panel.color || this.FontStyles.color,
      x.servicePage.panel.horizontalPadding,
      x.servicePage.panel.verticalPadding,
      x.servicePage.panel.questionDisplayMode,
      x.servicePage.panel.font,
      x.servicePage.panel.fontStyle,
      x.servicePage.panel.fontSize,
      this.GetDefaultFontWeight(x.servicePage.panel.fontWeight),
      x.servicePage.services,
      this.WorkFlow.services,
      x.servicePage.buttons,
      x.servicePage.panel.showServiceIcons,
      x.servicePage.panel.textBackgroundColor
    );
    this.EditAndSetItemToServiceQuestionPanel(
      x.serviceQuestion.panel.width,
      x.serviceQuestion.panel.height,
      x.serviceQuestion.panel.top,
      x.serviceQuestion.panel.left,
      x.serviceQuestion.panel.backgroundColor,
      x.serviceQuestion.panel.color || this.FontStyles.color,
      x.serviceQuestion.panel.horizontalPadding,
      x.serviceQuestion.panel.verticalPadding,
      x.serviceQuestion.panel.font,
      x.serviceQuestion.panel.fontSize,
      x.serviceQuestion.panel.fontStyle,
      x.serviceQuestion.panel.fontWeight,
      x.serviceQuestion.panel.questionDisplayMode,
      x.serviceQuestion.questionSet,
      x.serviceQuestion.panel.textBackgroundColor,
      this.WorkFlow.questionSets,
      x.serviceQuestion.buttons
    );
    this.CreateAndSetItemsToThankYouPage(
      x.thankYouPage.panel?.height,
      x.thankYouPage.panel?.top,
      x.thankYouPage.panel?.left,
      x.thankYouPage.panel?.width,
      x.thankYouPage.panel?.backgroundColor,
      x.thankYouPage.panel?.itemBackgroundColor,
      x.thankYouPage.panel?.primaryColor,
      x.thankYouPage.panel?.secondaryColor,
      x.thankYouPage.panel?.font,
      x.thankYouPage.panel?.fontStyle,
      x.thankYouPage.panel?.fontSize,
      this.GetDefaultFontWeight(x.thankYouPage.panel?.fontWeight),
      x.thankYouPage.panel?.messageDisplayTimeInSeconds,
      x.thankYouPage.panel?.horizontalPadding,
      x.thankYouPage.panel?.verticalPadding,
      x.thankYouPage?.buttons,
      x.thankYouPage.panel?.items
    );
    this.CreateAndSetItemsToLanguagePage(
      x.languagePage?.panel?.height,
      x.languagePage?.panel?.top,
      x.languagePage?.panel?.left,
      x.languagePage?.panel?.width,
      x.languagePage?.panel?.backgroundColor,
      x.languagePage?.panel?.itemBackgroundColor,
      x.languagePage?.panel?.color,
      x.languagePage?.panel?.font,
      x.languagePage?.panel?.fontStyle,
      x.languagePage?.panel?.fontSize,
      this.GetDefaultFontWeight(x.languagePage?.panel?.fontWeight),
      x.languagePage?.panel?.horizontalPadding,
      x.languagePage?.panel?.verticalPadding
    );
      this.EditAndSetItemsToPreServiceQuestionPanel(
        this.GetPanelWidth(x),
        this.GetPanelHeight(x),
        this.GetPanelTop(x),
        this.GetPanelLeft(x),
        this.GetPanelBackGround(x),
        this.GetPanelColor(x),
        this.GetPanelHorizontalPadding(x),
        this.GetPanelVerticalPadding(x),
        x.preServiceQuestionPage.panel?.questionDisplayMode,
        this.GetPanelQuestions(x),
        this.WorkFlow.preServiceQuestions,
        this.GetPanelFont(x),
        this.GetPanelFontStyle(x),
        this.GetPanelFontSize(x),
        this.GetPanelFontWeight(x),
        x.preServiceQuestionPage.panel.textBackgroundColor,
        x.preServiceQuestionPage.buttons
      );
    this.AddServicePageDataInEditMode(x);
    this.AddPreServicePageDataInEditMode(x);
    this.AddServiceQuestionPageDataInEditMode(x);
    this.AddThankYouPageDataInEditMode(x);
    this.AddWelcomePageDataInEditMode(x);
    this.AddNoQueuePageDataInEditMode(x);
    this.AddOffLinePageDataInEditMode(x);
    this.AddLanguagePageDataInEditMode(x);
  }

  GetDefaultFontWeight(fontWeight) {
    return typeof fontWeight === 'number'
      ? this.FontStyles.fontWeight
      : fontWeight;
  }

  private GetPanelVerticalPadding(x: IKioskLayoutData): number {
    return x.preServiceQuestionPage.panel
      ? x.preServiceQuestionPage.panel.verticalPadding
      : this.ServicePanelStyles.verticalPadding;
  }

  private GetPanelHorizontalPadding(x: IKioskLayoutData): number {
    return x.preServiceQuestionPage.panel
      ? x.preServiceQuestionPage.panel.horizontalPadding
      : this.ServicePanelStyles.horizontalPadding;
  }

  private UpdatePreServiceQuestionPageControlsCount(
    x: KioskOtherControlsCountDetail
  ) {
    if (x) {
      this.KioskData.PreServiceQuestionData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.PreServiceQuestionData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.PreServiceQuestionData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.PreServiceQuestionData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateLanguagePageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.LanguagePageData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.LanguagePageData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.LanguagePageData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.LanguagePageData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateServicePageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.ServiceData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.ServiceData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.ServiceData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.ServiceData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateServiceQuestionPageControlsCount(
    x: KioskOtherControlsCountDetail
  ) {
    if (x) {
      this.KioskData.ServiceQuestionData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.ServiceQuestionData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.ServiceQuestionData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.ServiceQuestionData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateThankYouPageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.ThankYouPageData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.ThankYouPageData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.ThankYouPageData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.ThankYouPageData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateWelcomePageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.WelcomePageData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.WelcomePageData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.WelcomePageData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.WelcomePageData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateNoQueuePageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.NoQueuePageData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.NoQueuePageData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.NoQueuePageData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.NoQueuePageData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private UpdateOffLinePageControlsCount(x: KioskOtherControlsCountDetail) {
    if (x) {
      this.KioskData.OffLinePageData.otherControlCountData.totalImageCount =
        x.totalImageCount;
      this.KioskData.OffLinePageData.otherControlCountData.totalLabelCount =
        x.totalLabelCount;
      this.KioskData.OffLinePageData.otherControlCountData.totalVideoCount =
        x.totalVideoCount;
      this.KioskData.OffLinePageData.otherControlCountData.totalSliderCount =
        x.totalSliderCount;
    }
  }

  private GetPanelColor(x: IKioskLayoutData): string {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.color
      ? x.preServiceQuestionPage.panel.color
      : this.PanelColor;
  }

  private GetPanelFontWeight(x: IKioskLayoutData): number | string {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.fontWeight
      ? this.GetDefaultFontWeight(x.preServiceQuestionPage.panel.fontWeight)
      : this.FontStyles.fontWeight;
  }

  private GetPanelFontSize(x: IKioskLayoutData): number {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.fontSize
      ? x.preServiceQuestionPage.panel.fontSize
      : this.FontStyles.fontSize;
  }

  private GetPanelFontStyle(x: IKioskLayoutData): string {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.fontStyle
      ? x.preServiceQuestionPage.panel.fontStyle
      : this.FontStyles.fontStyle;
  }

  private GetPanelFont(x: IKioskLayoutData): string {
    return x.preServiceQuestionPage.panel && x.preServiceQuestionPage.panel.font
      ? x.preServiceQuestionPage.panel.font
      : this.FontStyles.font;
  }

  private GetPanelQuestions(x: IKioskLayoutData): IKioskPanelItemsData[] {
    return x.preServiceQuestionPage ? x.preServiceQuestionPage.questions : [];
  }

  private GetPanelBackGround(x: IKioskLayoutData): string {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.backgroundColor
      ? x.preServiceQuestionPage.panel.backgroundColor
      : this.FontStyles.color;
  }

  private GetPanelLeft(x: IKioskLayoutData): number {
    if (x.preServiceQuestionPage.panel) {
      return GetDefaultIfNegativeOrNull(
        x.preServiceQuestionPage.panel.left,
        this.FontStyles.left
      );
    }
    return this.FontStyles.left;
  }

  private GetPanelTop(x: IKioskLayoutData): number {
    if (x.preServiceQuestionPage.panel) {
      return GetDefaultIfNegativeOrNull(
        x.preServiceQuestionPage.panel.top,
        this.FontStyles.left
      );
    }
    return this.FontStyles.top;
  }

  private GetPanelHeight(x: IKioskLayoutData): number {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.height
      ? x.preServiceQuestionPage.panel.height
      : this.FontStyles.height;
  }

  private GetPanelWidth(x: IKioskLayoutData): number {
    return x.preServiceQuestionPage.panel &&
      x.preServiceQuestionPage.panel.width
      ? x.preServiceQuestionPage.panel.width
      : this.FontStyles.width;
  }

  private AddServicePageDataInEditMode(x: IKioskLayoutData) {
    x.servicePage.labels.forEach((label) => {
      this.KioskData.ServiceData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });
    x.servicePage.images.forEach((image) => {
      this.KioskData.ServiceData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x.servicePage.videos.forEach((video) => {
      this.KioskData.ServiceData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x.servicePage.sliders.forEach((slider) => {
      this.KioskData.ServiceData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.KioskServiceSubject.next(this.KioskData.ServiceData);
  }

  private AddPreServicePageDataInEditMode(x: IKioskLayoutData) {
    x.preServiceQuestionPage.labels.forEach((label) => {
      this.KioskData.PreServiceQuestionData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });

    x.preServiceQuestionPage.images.forEach((image) => {
      this.KioskData.PreServiceQuestionData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });

    x.preServiceQuestionPage.videos.forEach((video) => {
      this.KioskData.PreServiceQuestionData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });

    x.preServiceQuestionPage.sliders.forEach((slider) => {
      this.KioskData.PreServiceQuestionData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskData.PreServiceQuestionData
    );
  }

  private AddLanguagePageDataInEditMode(x: IKioskLayoutData) {
    if (x.languagePage && x.languagePage.labels) {
      x.languagePage.labels.forEach((label) => {
        this.KioskData.LanguagePageData.labelDivs.push(
          new LabelControl(
            this.formBuilder,
            label.name,
            label.text,
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
            label.alignment || this.Alignment,
            label.backgroundColor||this.BackgroundColor
          )
        );
      });
    }
    if (x.languagePage && x.languagePage.images) {
      x?.languagePage.images.forEach((image) => {
        this.KioskData.LanguagePageData.imageDivs.push(
          new ImageControl(
            this.formBuilder,
            image.name,
            image.src,
            image.width,
            image.height,
            image.left,
            image.top,
            image.zindex
          )
        );
      });
    }
    if (x.languagePage && x.languagePage.videos) {
      x?.languagePage?.videos.forEach((video) => {
        this.KioskData.LanguagePageData.videoDivs.push(
          new VideoControl(
            this.formBuilder,
            video.name,
            video.src,
            video.width,
            video.height,
            video.left,
            video.top,
            video.zindex
          )
        );
      });
    }
    if (x.languagePage && x.languagePage.sliders) {
      x?.languagePage?.sliders.forEach((slider) => {
        this.KioskData.LanguagePageData.slidersDivs.push(
          new SliderControl(
            this.formBuilder,
            slider.name,
            this.SetURL(slider.src),
            slider.width,
            slider.height,
            slider.left,
            slider.top,
            slider.zindex
          )
        );
      });
    }
    this.UpdateLanguageSubject();
  }

  SetURL(urls: ISliderControlPostPreview[]): ISliderControlPostPreview[] {
    let data: ISliderControlPostPreview[] = [];
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

  private AddServiceQuestionPageDataInEditMode(x: IKioskLayoutData) {
    x.serviceQuestion.labels.forEach((label) => {
      this.KioskData.ServiceQuestionData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });
    x.serviceQuestion.images.forEach((image) => {
      this.KioskData.ServiceQuestionData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x.serviceQuestion.videos.forEach((video) => {
      this.KioskData.ServiceQuestionData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x.serviceQuestion.sliders.forEach((slider) => {
      this.KioskData.ServiceQuestionData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.KioskServiceQuestionSubject.next(this.KioskData.ServiceQuestionData);
  }

  private AddThankYouPageDataInEditMode(x: IKioskLayoutData) {
    x.thankYouPage.labels.forEach((label) => {
      this.KioskData.ThankYouPageData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });
    x.thankYouPage.images.forEach((image) => {
      this.KioskData.ThankYouPageData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x.thankYouPage.videos.forEach((video) => {
      this.KioskData.ThankYouPageData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x.thankYouPage.sliders.forEach((slider) => {
      this.KioskData.ThankYouPageData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.UpdateThankYouSubject();
  }

  private AddWelcomePageDataInEditMode(x: IKioskLayoutData) {
    x.welcomePage.labels.forEach((label) => {
      this.KioskData.WelcomePageData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor || this.BackgroundColor
        )
      );
    });
    x.welcomePage.images.forEach((image) => {
      this.KioskData.WelcomePageData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x.welcomePage.videos.forEach((video) => {
      this.KioskData.WelcomePageData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x.welcomePage.sliders.forEach((slider) => {
      this.KioskData.WelcomePageData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.CreateButtonsOfWelcomePage(x.welcomePage.buttons);
  }

  private AddNoQueuePageDataInEditMode(x: IKioskLayoutData) {
    x?.noQueuePage?.labels.forEach((label) => {
      this.KioskData.NoQueuePageData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });
    x?.noQueuePage?.images.forEach((image) => {
      this.KioskData.NoQueuePageData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x?.noQueuePage?.videos.forEach((video) => {
      this.KioskData.NoQueuePageData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x?.noQueuePage?.sliders.forEach((slider) => {
      this.KioskData.NoQueuePageData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.CreateItemsOfNoQueuePage(x?.noQueuePage?.buttons || []);
  }

  private AddOffLinePageDataInEditMode(x: IKioskLayoutData) {
    x?.offLinePage?.labels.forEach((label) => {
      this.KioskData.OffLinePageData.labelDivs.push(
        new LabelControl(
          this.formBuilder,
          label.name,
          label.text,
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
          label.alignment || this.Alignment,
          label.backgroundColor||this.BackgroundColor
        )
      );
    });
    x?.offLinePage?.images.forEach((image) => {
      this.KioskData.OffLinePageData.imageDivs.push(
        new ImageControl(
          this.formBuilder,
          image.name,
          image.src,
          image.width,
          image.height,
          image.left,
          image.top,
          image.zindex
        )
      );
    });
    x?.offLinePage?.videos.forEach((video) => {
      this.KioskData.OffLinePageData.videoDivs.push(
        new VideoControl(
          this.formBuilder,
          video.name,
          video.src,
          video.width,
          video.height,
          video.left,
          video.top,
          video.zindex
        )
      );
    });
    x?.offLinePage?.sliders.forEach((slider) => {
      this.KioskData.OffLinePageData.slidersDivs.push(
        new SliderControl(
          this.formBuilder,
          slider.name,
          this.SetURL(slider.src),
          slider.width,
          slider.height,
          slider.left,
          slider.top,
          slider.zindex
        )
      );
    });
    this.CreateItemsOfOffLinePage(x?.offLinePage?.buttons || []);
  }

  OnAddNewTemplateMode() {
    const {
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      serviceBGColor,
      serviceColor,
      verticalPadding,
      horizontalPadding,
      servicePanelQuestionDisplayMode,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      textBackgroundColor,
    } = this.GetDesignValuesOfServicePageDefaultcontrol();
    this.CreateAndSetItemsToServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      servicePanelQuestionDisplayMode,
      serviceBGColor,
      serviceColor,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      textBackgroundColor,
      this.WorkFlow.services
    );
    this.CreateAndSetItemToServiceQuestionPanel(
      servicePanelWidth,
      300,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      serviceBGColor,
      serviceColor,
      horizontalPadding,
      verticalPadding,
      servicePanelQuestionDisplayMode,
      this.WorkFlow.questionSets,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      textBackgroundColor
    );
    this.CreateButtonsOfWelcomePage([]);
    this.CreateItemsOfNoQueuePage([]);
    this.CreateItemsOfOffLinePage([]);
    this.CreateAndSetItemsToThankYouPage(
      this.ThankYouPageStyles.height,
      this.ThankYouPageStyles.top,
      this.ThankYouPageStyles.left,
      this.ThankYouPageStyles.width,
      this.ThankYouPageStyles.backgroundColor,
      this.ThankYouPageStyles.itemBackgroundColor,
      this.ThankYouPageStyles.color,
      this.ThankYouPageStyles.secondaryColor,
      this.ThankYouPageStyles.font,
      this.ThankYouPageStyles.fontStyle,
      this.ThankYouPageStyles.fontSize,
      this.ThankYouPageStyles.fontWeight,
      this.ThankYouPageStyles.messageDisplayTimeInSeconds,
      this.ThankYouPageStyles.horizontalPadding,
      this.ThankYouPageStyles.verticalPadding,
      [],
      []
    );
    this.UpdateThankYouSubject();
    this.CreateAndSetItemsToLanguagePage(
      this.LanguagePageStyles.height,
      this.LanguagePageStyles.top,
      this.LanguagePageStyles.left,
      this.LanguagePageStyles.width,
      this.LanguagePageStyles.backgroundColor,
      this.LanguagePageStyles.itemBackgroundColor,
      this.LanguagePageStyles.color,
      this.LanguagePageStyles.font,
      this.LanguagePageStyles.fontStyle,
      this.LanguagePageStyles.fontSize,
      this.LanguagePageStyles.fontWeight,
      this.LanguagePageStyles.horizontalPadding,
      this.LanguagePageStyles.verticalPadding
    );
    this.UpdateLanguageSubject();
      this.CreateAndSetItemsToPreServiceQuestionPanel(
        servicePanelWidth,
        servicePanelHeight,
        servicePanelTop,
        servicePanelLeft,
        servicePanelBGColor,
        servicePanelColor,
        serviceBGColor,
        serviceColor,
        horizontalPadding,
        verticalPadding,
        servicePanelQuestionDisplayMode,
        this.WorkFlow.preServiceQuestions,
        font,
        fontStyle,
        fontSize,
        fontWeight,
        textBackgroundColor
      );
  }

  Save() {
    const postData = this.GetModifiedLayoutDetails();
    this.ValidateLayoutData(this.KioskData);
    if (this.isValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveKiosk,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveKiosk,
          postData
        );
      }
    } else {
      this.isValidLayoutData = true;
    }
  }

  UpdateSelectedControlZIndex(IsIncrease: boolean , page: IKioskConfiguration): number {
    const totalControlsCount =
      page.imageDivs.length +
      page.videoDivs.length +
      page.labelDivs.length +
      page.slidersDivs.length;
    return (IsIncrease) ? 50 + totalControlsCount : 50 - totalControlsCount;
  }

  UpdatePageDataControlZIndex(IsFront: boolean, pageInfo: {
    kioskPagePropertyName: string,
    pageSubjectPropertyName: string
  }) {
      const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
      for (const controlType of controlTypes) {
        this.KioskData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
          if (IsFront ? x.styles.zindex > 50 : x.styles.zindex < 50) {
          x.styles.zindex += IsFront ? -1 : 1;
          x.form.controls.zindex.value += IsFront ? -1 : 1;
          }
        });
      }


      this[pageInfo.pageSubjectPropertyName].next(this.KioskData[pageInfo.kioskPagePropertyName]);
  }

  ResolvePageInfo(page: IPage): {
    kioskPagePropertyName: string,
    pageSubjectPropertyName: string
  }{
    if (page?.IsLanguagePage){
      return {
        kioskPagePropertyName: 'LanguagePageData',
        pageSubjectPropertyName: 'LanguagePageSubject'
      };
    }
    if (page?.IsWelcomePage){
      return {
        kioskPagePropertyName: 'WelcomePageData',
        pageSubjectPropertyName: 'WelcomePageSubject'
      };
    }
    if (page?.IsPreServiceQuestionPage){
      return {
        kioskPagePropertyName: 'PreServiceQuestionData',
        pageSubjectPropertyName: 'KioskGlobalQuestionPageSubject'
      };
    }
    if (page?.IsServicePage){
      return {
        kioskPagePropertyName: 'ServiceData',
        pageSubjectPropertyName: 'KioskServiceSubject'
      };
    }
    if (page?.IsServiceQuestionPage){
      return {
        kioskPagePropertyName: 'ServiceQuestionData',
        pageSubjectPropertyName: 'KioskServiceQuestionSubject'
      };
    }
    if (page?.IsThankYouPage){
      return {
        kioskPagePropertyName: 'ThankYouPageData',
        pageSubjectPropertyName: 'ThankYouSubject'
      };
    }
    if (page?.IsNoQueuePage){
      return {
        kioskPagePropertyName: 'NoQueuePageData',
        pageSubjectPropertyName: 'NoQueuePageSubject'
      };
    }
    if (page?.IsOffLinePage){
      return {
        kioskPagePropertyName: 'OffLinePageData',
        pageSubjectPropertyName: 'OffLinePageSubject'
      };
    }
  }

  IncreaseZIndex() {
    const pageInfo: {
      kioskPagePropertyName: string,
      pageSubjectPropertyName: string
    } = this.ResolvePageInfo(this.CurrentPageSubject.value);

    const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
    for (const controlType of controlTypes) {
      this.KioskData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
        if (x.selected) {
          x.styles.zindex = x.form.controls.zindex.value
            = this.UpdateSelectedControlZIndex(true, this.KioskData[pageInfo.kioskPagePropertyName]);
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
    const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
    for (const controlType of controlTypes) {
      this.KioskData[pageInfo.kioskPagePropertyName][controlType].forEach( (x) => {
      if (x.selected){
      x.styles.zindex = this.UpdateSelectedControlZIndex(false, this.KioskData[pageInfo.kioskPagePropertyName]);
      x.form.controls.zindex.value = this.UpdateSelectedControlZIndex(false, this.KioskData[pageInfo.kioskPagePropertyName]);
      }
    });
    }
    this.UpdatePageDataControlZIndex(false , pageInfo) ;
}

HandleAllControlZIndex(deletedControlZIndex: number){
  const pageInfo: {
    kioskPagePropertyName: string,
    pageSubjectPropertyName: string
  } = this.ResolvePageInfo(this.CurrentPageSubject.value);
  const controlTypes = ['labelDivs', 'imageDivs', 'videoDivs', 'slidersDivs'];
  for (const controlType of controlTypes) {
    this.KioskData[pageInfo.kioskPagePropertyName][controlType].forEach((x) => {
      if (x.styles.zindex > 50 && 50 < deletedControlZIndex && deletedControlZIndex < x.styles.zindex) {
      x.styles.zindex -= 1;
      x.form.controls.zindex.value -= 1;
      }
      if (x.styles.zindex < 50 && 50 > deletedControlZIndex && deletedControlZIndex > x.styles.zindex){
        x.styles.zindex += 1;
        x.form.controls.zindex.value += 1;
      }
    });
  }
}
  SaveAsDraft() {
    const postData = this.GetModifiedLayoutDetails();
    this.ValidateLayoutData(this.KioskData);
    if (this.isValidLayoutData) {
      const fileUploadAPIs = this.GetFileUploadUrlApis(postData);
      if (fileUploadAPIs.length > 0) {
        this.formService.CombineAPICall(fileUploadAPIs).subscribe((x) => {
          this.AfterUploadingFilesSuccessFullySendDataToDB(
            this.SaveKioskAsDraft,
            postData
          );
        });
      } else {
        this.AfterUploadingFilesSuccessFullySendDataToDB(
          this.SaveKioskAsDraft,
          postData
        );
      }
    } else {
      this.isValidLayoutData = true;
    }
  }

  ValidateLayoutData(data) {
    Object.keys(data).forEach((key) => {
      if (key === 'form' && !data[key].valid) {
        this.AppNotificationService.NotifyError(
          'Name field from ' + data.uniqueName + ' must not be empty.'
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
  AfterUploadingFilesSuccessFullySendDataToDB(
    url: string,
    postData: IKioskLayoutData
  ) {
    if (url === this.SaveKiosk) {
      this.kioskAPIService
        .Save(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.AppNotificationService.Notify('Kiosk saved.');
          this.routeHandlerService.RedirectToKioskListPage();
        });
    } else {
      this.kioskAPIService
        .SaveAsDraft(this.authService.CompanyId, postData)
        .subscribe((x: any) => {
          this.AppNotificationService.Notify('Kiosk drafted.');
          this.routeHandlerService.RedirectToKioskListPage();
        });
    }
  }

  GetFileUploadUrlApis(postData: IKioskLayoutData) {
    const fileUploadAPIs = [];
    if (this.KioskData.DesignerScreen.backgroundImageFile) {
      fileUploadAPIs.push(
        this.UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
          postData
        )
      );
    }
    if (this.KioskData.WelcomePageData.buttons) {
      this.KioskData.WelcomePageData.buttons.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'welcomePage'
        );
      });
    }
    if (this.KioskData.NoQueuePageData.buttons) {
      this.KioskData.NoQueuePageData.buttons.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'noQueuePage'
        );
      });
    }
    if (this.KioskData.OffLinePageData.buttons) {
      this.KioskData.OffLinePageData.buttons.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'offLinePage'
        );
      });
    }
    if (this.KioskData.PreServiceQuestionData.buttonList) {
      this.KioskData.PreServiceQuestionData.buttonList.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'preServiceQuestionPage'
        );
      });
    }
    if (this.KioskData.ServiceData.buttons) {
      this.KioskData.ServiceData.buttons.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'servicePage'
        );
      });
    }
    if (this.KioskData.ServiceQuestionData.buttonList) {
      this.KioskData.ServiceQuestionData.buttonList.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'serviceQuestion'
        );
      });
    }
    if (this.KioskData.ThankYouPageData.buttons) {
      this.KioskData.ThankYouPageData.buttons.forEach((btn) => {
        this.UploadButtonImageFiles(
          btn,
          fileUploadAPIs,
          postData,
          'thankYouPage'
        );
      });
    }
    if (this.KioskData.PreServiceQuestionData.imageDivs.length > 0) {
      this.KioskData.PreServiceQuestionData.imageDivs.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData,
          'preServiceQuestionPage'
        );
      });
    }
    if (this.KioskData.ServiceQuestionData.imageDivs.length > 0) {
      this.KioskData.ServiceQuestionData.imageDivs.forEach((image) => {
        this.UploadImageFiles(
          image,
          fileUploadAPIs,
          postData,
          'serviceQuestion'
        );
      });
    }
    if (this.KioskData.ServiceData.imageDivs.length > 0) {
      this.KioskData.ServiceData.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'servicePage');
      });
    }
    if (this.KioskData.ThankYouPageData.imageDivs.length > 0) {
      this.KioskData.ThankYouPageData.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'thankYouPage');
      });
    }
    if (this.KioskData.WelcomePageData.imageDivs.length > 0) {
      this.KioskData.WelcomePageData.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'welcomePage');
      });
    }
    if (this.KioskData.NoQueuePageData.imageDivs.length > 0) {
      this.KioskData.NoQueuePageData.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'noQueuePage');
      });
    }
    if (this.KioskData.OffLinePageData.imageDivs.length > 0) {
      this.KioskData.OffLinePageData.imageDivs.forEach((image) => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'offLinePage');
      });
    }
    if (this.KioskData.LanguagePageData.imageDivs.length > 0) {
      this.KioskData.LanguagePageData.imageDivs.forEach((image): void => {
        this.UploadImageFiles(image, fileUploadAPIs, postData, 'languagePage');
      });
    }
    if (this.KioskData.WelcomePageData.videoDivs.length > 0) {
      this.KioskData.WelcomePageData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'welcomePage');
      });
    }
    if (this.KioskData.NoQueuePageData.videoDivs.length > 0) {
      this.KioskData.NoQueuePageData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'noQueuePage');
      });
    }
    if (this.KioskData.OffLinePageData.videoDivs.length > 0) {
      this.KioskData.OffLinePageData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'offLinePage');
      });
    }
    if (this.KioskData.LanguagePageData.videoDivs.length > 0) {
      this.KioskData.LanguagePageData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'languagePage');
      });
    }
    if (this.KioskData.PreServiceQuestionData.videoDivs.length > 0) {
      this.KioskData.PreServiceQuestionData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData,
          'preServiceQuestionPage'
        );
      });
    }
    if (this.KioskData.ServiceData.videoDivs.length > 0) {
      this.KioskData.ServiceData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'servicePage');
      });
    }
    if (this.KioskData.ServiceQuestionData.videoDivs.length > 0) {
      this.KioskData.ServiceQuestionData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(
          video,
          fileUploadAPIs,
          postData,
          'serviceQuestion'
        );
      });
    }
    if (this.KioskData.ThankYouPageData.videoDivs.length > 0) {
      this.KioskData.ThankYouPageData.videoDivs.forEach((video) => {
        this.UploadVideoFiles(video, fileUploadAPIs, postData, 'thankYouPage');
      });
    }
    if (this.KioskData.WelcomePageData.slidersDivs.length > 0) {
      this.KioskData.WelcomePageData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'welcomePage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.NoQueuePageData.slidersDivs.length > 0) {
      this.KioskData.NoQueuePageData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'noQueuePage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.OffLinePageData.slidersDivs.length > 0) {
      this.KioskData.OffLinePageData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'offLinePage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.LanguagePageData.slidersDivs.length > 0) {
      this.KioskData.LanguagePageData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'languagePage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.PreServiceQuestionData.slidersDivs.length > 0) {
      this.KioskData.PreServiceQuestionData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'preServiceQuestionPage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.ServiceData.slidersDivs.length > 0) {
      this.KioskData.ServiceData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'servicePage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.ServiceQuestionData.slidersDivs.length > 0) {
      this.KioskData.ServiceQuestionData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'serviceQuestion';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    if (this.KioskData.ThankYouPageData.slidersDivs.length > 0) {
      this.KioskData.ThankYouPageData.slidersDivs.forEach((sliderDiv) => {
        const pageName = 'thankYouPage';
        if (sliderDiv.src && sliderDiv.src.length > 0) {
          this.CheckVersionAndUpdateSrcPropertyOfSlider(
            sliderDiv,
            postData,
            pageName
          );
          this.UploadSliderFiles(sliderDiv, fileUploadAPIs, postData, pageName);
        } else {
          this.UpdateSrcPropertyOfSliderByUrlProperty(
            sliderDiv,
            postData,
            pageName
          );
        }
      });
    }
    return fileUploadAPIs;
  }

  private UploadButtonImageFiles(
    button: ButtonControl,
    fileUploadAPIs: any[],
    postData: IKioskLayoutData,
    pageName: string
  ) {
    if (button.src && button.src.length > 0 && typeof button.src !== 'string') {
      button.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadButtonImagesAndSetUrlInPostData(
              i[i.languageCode],
              button.name,
              i.languageCode,
              postData,
              pageName
            )
          );
        }
      });
    }
  }

  private UploadImageFiles(
    image: ImageControl,
    fileUploadAPIs: any[],
    postData: IKioskLayoutData,
    pageName: string
  ) {
    if (image.src && image.src.length > 0 && typeof image.src !== 'string') {
      image.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadImagesAndSetUrlInPostData(
              i[i.languageCode],
              image.name,
              i.languageCode,
              postData,
              pageName
            )
          );
        }
      });
    }
  }

  private UploadVideoFiles(
    video: VideoControl,
    fileUploadAPIs: any[],
    postData: IKioskLayoutData,
    pageName: string
  ) {
    if (video.src && video.src.length > 0 && typeof video.src !== 'string') {
      video.src.forEach((i) => {
        if (
          i[i.languageCode] &&
          typeof i[i.languageCode] === 'object' &&
          !this.ObjectIsEmpty(i[i.languageCode])
        ) {
          fileUploadAPIs.push(
            this.UploadVideoAndSetUrlInPostData(
              i[i.languageCode],
              video.name,
              i.languageCode,
              postData,
              pageName
            )
          );
        }
      });
    }
  }

  private UploadSliderFiles(
    slider: SliderControl,
    fileUploadAPIs: any[],
    postData: IKioskLayoutData,
    pageName: string
  ) {
    if (slider.src && slider.src.length > 0 && typeof slider.src !== 'string') {
      slider.src.forEach((i) => {
        if (i[i.languageCode]) {
          for (const item of i[i.languageCode]) {
            if (!this.ObjectIsEmpty(item.file)) {
              fileUploadAPIs.push(
                this.UploadSliderAndSetUrlInPostData(
                  item.file,
                  item.file.name,
                  slider.name,
                  postData,
                  item.languageCode,
                  pageName
                )
              );
            }
          }
        }
      });
    }
  }

  private UpdateSrcPropertyOfSliderByUrlProperty(
    sliderDiv: SliderControl,
    postData: IKioskLayoutData,
    pageName: string
  ) {
    sliderDiv.urls.forEach((x) => {
      postData[pageName].sliders
        .find((m) => m.name === sliderDiv.name)
        .src.push({ url: x.url });
    });
  }

  private CheckVersionAndUpdateSrcPropertyOfSlider(
    slider: SliderControl,
    postData: IKioskLayoutData,
    pageName: string
  ) {
    if (this.CheckSliderVersion(slider)) {
      this.UpdateSrcPropertyOfSlider(slider, postData, pageName);
    }
  }

  private CheckSliderVersion(slider: SliderControl) {
    return (
      slider.urls && slider.urls.filter((x) => x.version === 'Old').length > 0
    );
  }

  private UpdateSrcPropertyOfSlider(
    slider: SliderControl,
    postData: IKioskLayoutData,
    pageName: string
  ) {
    slider.urls.forEach((x) => {
      postData[pageName].sliders
        .find((m) => m.name === slider.name)
        .src.push({ url: x.url, type: x.type.split('/')[0] });
    });
  }

  UploadButtonImagesAndSetUrlInPostData(
    file: string,
    name: string,
    languageCode: string,
    postData: IKioskLayoutData,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData[pageName].buttons
          .find((x) => x.name === name)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  UploadImagesAndSetUrlInPostData(
    file: string,
    name: string,
    languageCode: string,
    postData: IKioskLayoutData,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData[pageName].images
          .find((x) => x.name === name)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  UploadVideoAndSetUrlInPostData(
    file: string,
    name: string,
    languageCode: string,
    postData: IKioskLayoutData,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData[pageName].videos
          .find((x) => x.name === name)
          .src.find((s) => s.languageCode === languageCode).url = url;
      })
    );
  }

  UploadSliderAndSetUrlInPostData(
    file: File,
    fileName: string,
    name: string,
    postData: IKioskLayoutData,
    languageCode: string,
    pageName: string
  ): any {
    return this.formService.GetImageUrl(file).pipe(
      tap((url) => {
        postData[pageName].sliders
          .find((x) => x.name === name)
          .src.find((y) => y.languageCode === languageCode)
          .url.find((n) => n.name === fileName).url = url;
      })
    );
  }

  UploadDesignerLayoutBackGroundImageAndSetBackGroundURLInPostData(
    postData: IKioskLayoutData
  ): any {
    return this.formService
      .GetImageUrl(this.KioskData.DesignerScreen.backgroundImageFile)
      .pipe(
        tap((url) => {
          postData.designerScreen.backGroundImage = url;
        })
      );
  }

  /* #region  PreService */

  private CreateAndSetItemsToPreServiceQuestionPanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    serviceBGColor: string,
    serviceColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelQuestionMode: number,
    questions,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    textBackgroundColor: string
  ) {
    this.KioskData.PreServiceQuestionData.panel = this.CreateServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      servicePanelQuestionMode,
      false,
      textBackgroundColor
    );

    const customerPreServicesQuestion =
      this.GetPreServiceQuestionWithDefaultStyles(questions);
    this.AddButtonsToPreServiceQuestion([]);
    this.SetandCreatePreSericeQuestionsItemControls(
      customerPreServicesQuestion,
      serviceBGColor,
      serviceColor
    );
  }

  private AddButtonsToPreServiceQuestion(buttons: any) {
    this.KioskData.PreServiceQuestionData.buttonList =
      new Array<ButtonControl>();
    this.KioskData.PreServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.NextButtonName,
        (buttons && buttons[0]?.text) || this.NextButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.PreServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.BackButtonName,
        (buttons && buttons[1]?.text) || this.BackButtonText,
        (buttons && buttons[1]?.color) || this.ButtonStyles.color,
        (buttons && buttons[1]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[1]?.width) || this.ButtonStyles.width,
        (buttons && buttons[1]?.height) || this.ButtonStyles.height,
        (buttons && buttons[1]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[1]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[1]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        false,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.left,
          this.BackButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.top,
          this.BackButtonStyles.top
        ),
        (buttons && buttons[1]?.src) || [],
        (buttons && buttons[1]?.showIcon) || false,
        (buttons && buttons[1]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[1]?.border) || this.ButtonStyles.border,
        (buttons && buttons[1]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow
      )
    );
      if (buttons && buttons[2]?.name === this.AppointmentButtonName) {
        this.KioskData.PreServiceQuestionData.buttonList.push(
          this.CreateButtonControl(
            this.AppointmentButtonName,
            (buttons && buttons[2]?.text) || this.AppointmentButtonText,
            (buttons && buttons[2]?.color) ||
              this.AppointmentButtonStyles.color,
            (buttons && buttons[2]?.backgroundColor) ||
              this.AppointmentButtonStyles.bGColor,
            (buttons && buttons[2]?.width) ||
              this.AppointmentButtonStyles.width,
            (buttons && buttons[2]?.height) || this.ButtonStyles.height,
            (buttons && buttons[2]?.fontSize) || this.ButtonStyles.fontSize,
            (buttons && buttons[2]?.fontStyle) || this.ButtonStyles.fontStyle,
            (buttons && buttons[2]?.font) || this.ButtonStyles.font,
            this.GetDefaultFontWeight(buttons && buttons[2]?.fontWeight) ||
              this.ButtonStyles.fontWeight,
            false,
            GetDefaultIfNegativeOrNull(
              buttons && buttons[2]?.left,
              this.AppointmentButtonStyles.left
            ),
            GetDefaultIfNegativeOrNull(
              buttons && buttons[2]?.top,
              this.AppointmentButtonStyles.top
            ),
            (buttons && buttons[2]?.src) || [],
            (buttons && buttons[2]?.showIcon) || false,
            (buttons && buttons[2]?.boxRoundCorners) ||
              this.ButtonStyles.boxRoundCorners,
            (buttons && buttons[2]?.border) || this.ButtonStyles.border,
            (buttons && buttons[2]?.borderColor) ||
              this.ButtonStyles.borderColor,
            (buttons && buttons[2]?.shadow) || this.ButtonStyles.shadow
          )
        );
      } else {
        this.KioskData.PreServiceQuestionData.buttonList.push(
          this.DefaultAppointmentButton()
        );
      }
    this.KioskData.PreServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.FinishButtonName,
        (buttons && buttons[3]?.text) || this.FinishButtonText,
        (buttons && buttons[3]?.color) || this.ButtonStyles.color,
        (buttons && buttons[3]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[3]?.width) || this.ButtonStyles.width,
        (buttons && buttons[3]?.height) || this.ButtonStyles.height,
        (buttons && buttons[3]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[3]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[3]?.font) || this.ButtonStyles.font,
        (buttons && buttons[3]?.fontWeight) || this.ButtonStyles.fontWeight,
        false,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[3]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[3]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[3]?.src) || [],
        (buttons && buttons[3]?.showIcon) || false,
        (buttons && buttons[3]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[3]?.border) || this.ButtonStyles.border,
        (buttons && buttons[3]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[3]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.PreServiceQuestionData.buttonList.map(
      (x) => (x.showButton = true)
    );
    if (this.KioskData.PreServiceQuestionData.panel.mode === Mode.All) {
      this.KioskData.PreServiceQuestionData.buttonList.find(
        (b) => b.name === this.FinishButtonName
      ).showButton = false;
    }
  }

  private DefaultAppointmentButton(): ButtonControl {
    return this.CreateButtonControl(
      this.AppointmentButtonName,
      this.AppointmentButtonText,
      this.AppointmentButtonStyles.color,
      this.AppointmentButtonStyles.bGColor,
      this.AppointmentButtonStyles.width,
      this.ButtonStyles.height,
      this.ButtonStyles.fontSize,
      this.ButtonStyles.fontStyle,
      this.ButtonStyles.font,
      this.ButtonStyles.fontWeight,
      false,
      this.AppointmentButtonStyles.left,
      this.AppointmentButtonStyles.top,
      [],
      false,
      this.ButtonStyles.boxRoundCorners,
      this.ButtonStyles.border,
      this.ButtonStyles.borderColor,
      this.ButtonStyles.shadow
    );
  }

  private SetandCreatePreSericeQuestionsItemControls(
    customerPreServicesQuestions: any,
    serviceBGColor: string,
    serviceColor: string
  ) {
    this.KioskData.PreServiceQuestionData.items =
      new Array<ServiceBoxControl>();
    customerPreServicesQuestions.forEach((element) => {
      this.CreateAndAddPreServiceQuestionItems(
        element.serviceNAme,
        serviceBGColor,
        serviceColor,
        element.serviceId,
        element.name,
        element.font,
        element.fontStyle,
        element.fontSize,
        this.GetDefaultFontWeight(element.fontWeight),
        element.isVisible,
      );
    });
    if(this.KioskData.PreServiceQuestionData.dropDownList.length){
    this.KioskData.PreServiceQuestionData.dropDownList.map(
      (x) => (x.ShowPropertyWindow = false)
    );
    this.KioskData.PreServiceQuestionData.dropDownList[0].ShowPropertyWindow = true;
    }
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskData.PreServiceQuestionData
    );
  }

  private CreateAndAddPreServiceQuestionItems(
    serviceNAme: any,
    serviceBGColor: string,
    serviceColor: string,
    serviceQuestionId: string,
    name: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    isVisible: boolean
  ) {
    const serviceBox = this.CreateServiceItemControl(
      serviceNAme,
      serviceBGColor,
      serviceColor,
      serviceQuestionId,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      isVisible
    );
    this.KioskData.PreServiceQuestionData.items.push(serviceBox);
    this.KioskData.PreServiceQuestionData.dropDownList.push({
      Control: serviceBox,
      Id: serviceQuestionId,
      ShowPropertyWindow: false,
      Name: name,
    });
  }

  /* #endregion */

  /* #region  PreService Update*/

  private EditAndSetItemsToPreServiceQuestionPanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelQuestionMode: number,
    services: Array<IKioskPanelItemsData>,
    questions,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    textBackgroundColor: string,
    buttons: IKioskButtonControlData[]
  ) {
    this.KioskData.PreServiceQuestionData.panel = this.CreateServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      servicePanelQuestionMode,
      false,
      textBackgroundColor
    );

    const customerPreServicesQuestion =
      this.GetPreServiceQuestionWithDefaultStyles(questions);
    this.AddButtonsToPreServiceQuestion(buttons);
    this.SetandEditPreSericeQuestionsItemControls(
      customerPreServicesQuestion,
      services
    );
  }

  private SetandEditPreSericeQuestionsItemControls(
    customerPreServicesQuestions: any,
    services: Array<IKioskPanelItemsData>
  ) {
    this.KioskData.PreServiceQuestionData.items =
      new Array<ServiceBoxControl>();
    customerPreServicesQuestions.forEach((element) => {
      const presentQuestion = services.find(
        (m) => m.questionId === element.serviceId
      );
      this.CreateAndAddPreServiceQuestionItems(
        element.serviceNAme,
        this.GetPreServiceQuestionItemBackgroundColor(presentQuestion),
        this.GetPreServiceQuestionItemColor(presentQuestion),
        element.serviceId,
        element.name,
        this.GetPreServiceQuestionItemFont(presentQuestion),
        this.GetPreServiceQuestionItemFontStyle(presentQuestion),
        this.GetPreServiceQuestionItemFontSize(presentQuestion),
        this.GetPreServiceQuestionItemFontWeight(presentQuestion),
        element.isVisible
      );
    });
    if(this.KioskData.PreServiceQuestionData.dropDownList.length){
    this.KioskData.PreServiceQuestionData.dropDownList.map(
      (x) => (x.ShowPropertyWindow = false)
    );
      this.KioskData.PreServiceQuestionData.dropDownList[0].ShowPropertyWindow = true;
    }
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskData.PreServiceQuestionData
    );
  }

  private GetPreServiceQuestionItemFontWeight(
    presentQuestion: IKioskPanelItemsData
  ): number | string {
    return presentQuestion
      ? this.GetDefaultFontWeight(presentQuestion.fontWeight)
      : this.FontStyles.fontWeight;
  }

  private GetPreServiceQuestionItemFontSize(
    presentQuestion: IKioskPanelItemsData
  ): number {
    return presentQuestion
      ? presentQuestion.fontSize
      : this.FontStyles.fontSize;
  }

  private GetPreServiceQuestionItemFontStyle(
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestion
      ? presentQuestion.fontStyle
      : this.FontStyles.fontStyle;
  }

  private GetPreServiceQuestionItemFont(
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestion ? presentQuestion.font : this.FontStyles.font;
  }

  private GetPreServiceQuestionItemColor(
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestion ? presentQuestion.color : this.FontStyles.color;
  }

  private GetPreServiceQuestionItemBackgroundColor(
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestion
      ? presentQuestion.backgroundColor
      : this.FontStyles.backgroundColor;
  }

  /* #endregion */

  /* #region  Service question*/

  private CreateAndSetItemToServiceQuestionPanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    serviceBGColor: string,
    serviceColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelQuestionMode: number,
    serviceQuestions,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    textBackgroundColor: string
  ) {
    this.KioskData.ServiceQuestionData.panel = this.CreateServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      servicePanelQuestionMode,
      false,
      textBackgroundColor
    );
    const customerServicesQuestion =
      this.GetServiceQuestionWithDefaultStyles(serviceQuestions);
    const questionSetList = this.GetQuestionSetData(serviceQuestions);
    this.KioskData.ServiceQuestionData.questionSetList =
      new Array<IQuestionSet>();
    this.AddButtonsToServiceQuestion();
    this.KioskData.ServiceQuestionData.questionSetList =
      this.KioskData.ServiceQuestionData.questionSetList.concat(
        questionSetList
      );
    this.SetAndCreateServiceQuestionsItemControls(
      customerServicesQuestion,
      serviceBGColor,
      serviceColor
    );
  }

  private AddButtonsToServiceQuestion() {
    this.KioskData.ServiceQuestionData.buttonList = new Array<ButtonControl>();
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.NextButtonName,
        this.NextButtonText,
        this.ButtonStyles.color,
        this.ButtonStyles.BGColor,
        this.ButtonStyles.width,
        this.ButtonStyles.height,
        this.ButtonStyles.fontSize,
        this.ButtonStyles.fontStyle,
        this.ButtonStyles.font,
        this.ButtonStyles.fontWeight,
        true,
        this.ButtonStyles.left,
        this.ButtonStyles.top,
        [],
        false,
        this.ButtonStyles.boxRoundCorners,
        this.ButtonStyles.border,
        this.ButtonStyles.borderColor,
        this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.BackButtonName,
        this.BackButtonText,
        this.ButtonStyles.color,
        this.ButtonStyles.BGColor,
        this.ButtonStyles.width,
        this.ButtonStyles.height,
        this.ButtonStyles.fontSize,
        this.ButtonStyles.fontStyle,
        this.ButtonStyles.font,
        this.ButtonStyles.fontWeight,
        true,
        this.BackButtonStyles.left,
        this.BackButtonStyles.top,
        [],
        false,
        this.ButtonStyles.boxRoundCorners,
        this.ButtonStyles.border,
        this.ButtonStyles.borderColor,
        this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.FinishButtonName,
        this.FinishButtonText,
        this.ButtonStyles.color,
        this.ButtonStyles.BGColor,
        this.ButtonStyles.width,
        this.ButtonStyles.height,
        this.ButtonStyles.fontSize,
        this.ButtonStyles.fontStyle,
        this.ButtonStyles.font,
        this.ButtonStyles.fontWeight,
        false,
        this.ButtonStyles.left,
        this.ButtonStyles.top,
        [],
        false,
        this.ButtonStyles.boxRoundCorners,
        this.ButtonStyles.border,
        this.ButtonStyles.borderColor,
        this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.map(
      (x) => (x.showButton = true)
    );
    this.KioskData.ServiceQuestionData.buttonList.find(
      (b) => b.name === this.FinishButtonName
    ).showButton = false;
  }

  private SetAndCreateServiceQuestionsItemControls(
    customerServices: any,
    serviceBGColor: string,
    serviceColor: string
  ) {
    this.KioskData.ServiceQuestionData.items = new Array<ServiceBoxControl>();
    customerServices.forEach((element) => {
      this.CreateAndAddServiceQuestionItems(
        element.serviceNAme,
        serviceBGColor,
        serviceColor,
        element.serviceId,
        element.name,
        element.questionSetId,
        element.isItemSelected,
        element.isVisible,
        element.font,
        element.fontStyle,
        element.fontSize,
        element.fontWeight
      );
    });
    this.KioskServiceQuestionSubject.next(this.KioskData.ServiceQuestionData);
  }

  private CreateAndAddServiceQuestionItems(
    serviceNAme: any,
    serviceBGColor: string,
    serviceColor: string,
    questionId: string,
    name: string,
    questionSetId: string,
    isItemSelected: boolean,
    isVisible: boolean,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string
  ) {
    const serviceBox = this.CreateServiceItemControl(
      serviceNAme,
      serviceBGColor,
      serviceColor,
      questionId,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      isVisible,
      questionSetId,
      isItemSelected,
    );
    this.KioskData.ServiceQuestionData.items.push(serviceBox);
    this.KioskData.ServiceQuestionData.dropDownList.push({
      Control: serviceBox,
      Id: questionId,
      ShowPropertyWindow: false,
      Name: name,
    });
  }

  /* #endregion */

  /* #region  Service question Update*/

  private EditAndSetItemToServiceQuestionPanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelFont: string,
    servicePanelFontSize: number,
    servicePanelFontStyle: string,
    servicePanelFontWeight: number | string,
    servicePanelQuestionMode: number,
    items: IKioskQuestionSetData[],
    textBackgroundColor: string,
    serviceQuestions,
    buttons: IKioskButtonControlData[]
  ) {
    this.KioskData.ServiceQuestionData.panel = this.CreateServicePanel(
      servicePanelWidth,
      GetDefaultIfNegativeOrNull(
        servicePanelHeight,
        this.ServicePanelStyles.height
      ),
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      servicePanelFont,
      servicePanelFontStyle,
      servicePanelFontSize,
      servicePanelFontWeight,
      servicePanelQuestionMode,
      false,
      textBackgroundColor
    );
    const customerServicesQuestion =
      this.GetServiceQuestionWithDefaultStyles(serviceQuestions);
    const questionSetList = this.GetQuestionSetData(serviceQuestions);
    this.KioskData.ServiceQuestionData.questionSetList =
      new Array<IQuestionSet>();
    this.AddButtonsToExistingServiceQuestion(buttons);
    this.KioskData.ServiceQuestionData.questionSetList =
      this.KioskData.ServiceQuestionData.questionSetList.concat(
        questionSetList
      );
    this.SetAndEditServiceQuestionsItemControls(
      customerServicesQuestion,
      items
    );
  }

  private AddButtonsToExistingServiceQuestion(buttons: any) {
    this.KioskData.ServiceQuestionData.buttonList = new Array<ButtonControl>();
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.NextButtonName,
        (buttons && buttons[0]?.text) || this.NextButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.BackButtonName,
        (buttons && buttons[1]?.text) || this.BackButtonText,
        (buttons && buttons[1]?.color) || this.ButtonStyles.color,
        (buttons && buttons[1]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[1]?.width) || this.ButtonStyles.width,
        (buttons && buttons[1]?.height) || this.ButtonStyles.height,
        (buttons && buttons[1]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[1]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[1]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        false,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.left,
          this.BackButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.top,
          this.BackButtonStyles.top
        ),
        (buttons && buttons[1]?.src) || [],
        (buttons && buttons[1]?.showIcon) || false,
        (buttons && buttons[1]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[1]?.border) || this.ButtonStyles.border,
        (buttons && buttons[1]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.push(
      this.CreateButtonControl(
        this.FinishButtonName,
        (buttons && buttons[2]?.text) || this.FinishButtonText,
        (buttons && buttons[2]?.color) || this.ButtonStyles.color,
        (buttons && buttons[2]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[2]?.width) || this.ButtonStyles.width,
        (buttons && buttons[2]?.height) || this.ButtonStyles.height,
        (buttons && buttons[2]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[2]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[2]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[2]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        false,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[2]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[2]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[2]?.src) || [],
        (buttons && buttons[2]?.showIcon) || false,
        (buttons && buttons[2]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[2]?.border) || this.ButtonStyles.border,
        (buttons && buttons[2]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[2]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.ServiceQuestionData.buttonList.map(
      (x) => (x.showButton = true)
    );
    if (this.KioskData.ServiceQuestionData.panel.mode === Mode.All) {
      this.KioskData.ServiceQuestionData.buttonList.find(
        (b) => b.name === this.FinishButtonName
      ).showButton = false;
    }
  }

  private SetAndEditServiceQuestionsItemControls(
    customerServices: any,
    items: IKioskQuestionSetData[]
  ) {
    this.KioskData.ServiceQuestionData.items = new Array<ServiceBoxControl>();
    customerServices.forEach((element) => {
      const presentQuestionSet = items.find(
        (m) => m.questionSetId === element.questionSetId
      );
      const presentQuestion = presentQuestionSet
        ? items
            .find((m) => m.questionSetId === element.questionSetId)
            .questions.find((n) => n.questionId === element.serviceId)
        : null;
      this.CreateAndAddServiceQuestionItems(
        element.serviceNAme,
        this.GetServiceQuestionItemBackground(
          presentQuestionSet,
          presentQuestion
        ),
        this.GetServiceQuestionItemColor(presentQuestionSet, presentQuestion),
        element.serviceId,
        element.name,
        element.questionSetId,
        element.isItemSelected,
        element.isVisible,
        this.GetServiceQuestionItemFont(
          presentQuestionSet,
          presentQuestion,
          element
        ),
        this.GetServiceQuestionItemFontStyle(
          presentQuestionSet,
          presentQuestion,
          element
        ),
        this.GetServiceQuestionItemFontSize(
          presentQuestionSet,
          presentQuestion,
          element
        ),
        this.GetServiceQuestionItemFontWeight(
          presentQuestionSet,
          presentQuestion,
          element
        )
      );
    });
    this.KioskServiceQuestionSubject.next(this.KioskData.ServiceQuestionData);
  }

  private GetServiceQuestionItemFontWeight(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData,
    element: any
  ): any {
    return presentQuestionSet && presentQuestion
      ? this.GetDefaultFontWeight(presentQuestion.fontWeight)
      : element.fontWeight;
  }

  private GetServiceQuestionItemFontSize(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData,
    element: any
  ): any {
    return presentQuestionSet && presentQuestion
      ? presentQuestion.fontSize
      : element.fontSize;
  }

  private GetServiceQuestionItemFontStyle(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData,
    element: any
  ): any {
    return presentQuestionSet && presentQuestion
      ? presentQuestion.fontStyle
      : element.fontStyle;
  }

  private GetServiceQuestionItemFont(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData,
    element: any
  ): string {
    return presentQuestionSet && presentQuestion
      ? presentQuestion.font
      : element.font;
  }

  private GetServiceQuestionItemColor(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestionSet && presentQuestion
      ? presentQuestion.color
      : this.FontStyles.color;
  }

  private GetServiceQuestionItemBackground(
    presentQuestionSet: IKioskQuestionSetData,
    presentQuestion: IKioskPanelItemsData
  ): string {
    return presentQuestionSet && presentQuestion
      ? presentQuestion.backgroundColor
      : this.ServicePanelStyles.backgroundColor;
  }

  /* #endregion */

  /* #region  Service*/

  private CreateAndSetItemsToServicePanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelQuestionMode: number,
    serviceBGColor: string,
    serviceColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    textBackgroundColor: string,
    services
  ) {
    this.KioskData.ServiceData.panel = this.CreateServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      servicePanelQuestionMode,
      false,
      textBackgroundColor
    );
    this.AddButtonsToServicePage();
    const customerServices = this.GetServicesWithDefaultStyle(services);
    this.SetAndCreateServiceItemControls(
      customerServices,
      serviceBGColor,
      serviceColor
    );
  }

  private AddButtonsToServicePage() {
    this.KioskData.ServiceData.buttons.push(
      this.CreateButtonControl(
        this.BackButtonName,
        this.BackButtonText,
        this.ButtonStyles.color,
        this.ButtonStyles.BGColor,
        this.ButtonStyles.width,
        this.ButtonStyles.height,
        this.ButtonStyles.fontSize,
        this.ButtonStyles.fontStyle,
        this.ButtonStyles.font,
        this.ButtonStyles.fontWeight,
        true,
        this.BackButtonStyles.left,
        this.BackButtonStyles.top,
        [],
        false,
        this.ButtonStyles.boxRoundCorners,
        this.ButtonStyles.border,
        this.ButtonStyles.borderColor,
        this.ButtonStyles.shadow
      )
    );
      this.KioskData.ServiceData.buttons.push(
        this.CreateButtonControl(
          this.AppointmentButtonName,
          this.AppointmentButtonText,
          this.AppointmentButtonStyles.color,
          this.AppointmentButtonStyles.bGColor,
          this.AppointmentButtonStyles.width,
          this.ButtonStyles.height,
          this.ButtonStyles.fontSize,
          this.ButtonStyles.fontStyle,
          this.ButtonStyles.font,
          this.ButtonStyles.fontWeight,
          false,
          this.AppointmentButtonStyles.left,
          this.AppointmentButtonStyles.top,
          [],
          false,
          this.ButtonStyles.boxRoundCorners,
          this.ButtonStyles.border,
          this.ButtonStyles.borderColor,
          this.ButtonStyles.shadow
        )
      );
    this.KioskData.ServiceData.buttons.find(
      (x) => x.name === this.BackButtonName
    ).showPropertyWindow = true;
  }

  private SetAndCreateServiceItemControls(
    customerServices: {
      serviceId: string;
      serviceNAme: string;
      isItemSelected?: boolean;
      isVisible: boolean;
      font: string;
      fontStyle: string;
      fontSize: number;
      fontWeight: number | string;
      serviceIcon?: object;
    }[],
    serviceBGColor: string,
    serviceColor: string
  ) {
    this.KioskData.ServiceData.items = new Array<ServiceBoxControl>();
    customerServices.forEach((element) => {
      this.CreateAndAddServiceItems(
        element.serviceNAme,
        serviceBGColor,
        serviceColor,
        element.serviceId,
        element.serviceNAme,
        element.isItemSelected,
        element.isVisible,
        element.font,
        element.fontStyle,
        element.fontSize,
        element.fontWeight,
        element.serviceIcon
      );
    });
  }

  private CreateAndAddServiceItems(
    serviceNAme: string,
    serviceBGColor: string,
    serviceColor: string,
    serviceId: string,
    displayName: string,
    isItemSelected: boolean,
    isVisible: boolean,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    icons: object
  ) {
    const serviceBox = this.CreateServiceItemControl(
      serviceNAme,
      serviceBGColor,
      serviceColor,
      serviceId,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      isVisible,
      null,
      isItemSelected,
      icons
    );
    this.KioskData.ServiceData.items.push(serviceBox);
    this.KioskData.ServiceData.dropDownList.push({
      Control: serviceBox,
      Id: serviceId,
      ShowPropertyWindow: false,
      Name: displayName,
    });
    this.ShowServiceItemsPropertyWindowById(1);
  }

  public ShowServiceItemsPropertyWindowById(id: number) {
    this.KioskData.ServiceData.dropDownList.map(
      (x) => (x.ShowPropertyWindow = false)
    );
    this.KioskData.ServiceData.dropDownList[0].ShowPropertyWindow = true;
    this.KioskServiceSubject.next(this.KioskData.ServiceData);
  }

  /* #endregion */

  /* #region  Service update*/

  private EditAndSetItemsToServicePanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    servicePanelQuestionMode: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    items: IKioskPanelItemsData[],
    services,
    buttons: IKioskButtonControlData[],
    showServiceIcons: boolean,
    textBackgroundColor: string
  ) {
    this.KioskData.ServiceData.panel = this.CreateServicePanel(
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      horizontalPadding,
      verticalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      servicePanelQuestionMode,
      showServiceIcons,
      textBackgroundColor
    );
    this.AddButtonsToExistingService(buttons);
    const customerServices = this.GetServicesWithDefaultStyle(services);
    this.SetAndEditServiceItemControls(customerServices, items);
  }

  private AddButtonsToExistingService(buttons: any) {
    this.KioskData.ServiceData.buttons = new Array<ButtonControl>();
    this.KioskData.ServiceData.buttons.push(
      this.CreateButtonControl(
        this.BackButtonName,
        (buttons && buttons[0]?.text) || this.BackButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.BackButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.BackButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
      this.KioskData.ServiceData.buttons.push(
        this.CreateButtonControl(
          this.AppointmentButtonName,
          (buttons && buttons[1]?.text) || this.AppointmentButtonText,
          (buttons && buttons[1]?.color) || this.AppointmentButtonStyles.color,
          (buttons && buttons[1]?.backgroundColor) ||
            this.AppointmentButtonStyles.bGColor,
          (buttons && buttons[1]?.width) || this.AppointmentButtonStyles.width,
          (buttons && buttons[1]?.height) || this.ButtonStyles.height,
          (buttons && buttons[1]?.fontSize) || this.ButtonStyles.fontSize,
          (buttons && buttons[1]?.fontStyle) || this.ButtonStyles.fontStyle,
          (buttons && buttons[1]?.font) || this.ButtonStyles.font,
          this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) ||
            this.ButtonStyles.fontWeight,
          false,
          GetDefaultIfNegativeOrNull(
            buttons && buttons[1]?.left,
            this.AppointmentButtonStyles.left
          ),
          GetDefaultIfNegativeOrNull(
            buttons && buttons[1]?.top,
            this.AppointmentButtonStyles.top
          ),
          (buttons && buttons[1]?.src) || [],
          (buttons && buttons[1]?.showIcon) || false,
          (buttons && buttons[1]?.boxRoundCorners) ||
            this.ButtonStyles.boxRoundCorners,
          (buttons && buttons[1]?.border) || this.ButtonStyles.border,
          (buttons && buttons[1]?.borderColor) || this.ButtonStyles.borderColor,
          (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow
        )
      );
    this.KioskData.ServiceData.buttons.find(
      (x) => x.name === this.BackButtonName
    ).showPropertyWindow = true;
  }

  private SetAndEditServiceItemControls(
    customerServices: {
      serviceId: string;
      serviceNAme: string;
      isItemSelected?: boolean;
      isVisible: boolean;
      serviceIcon?: object;
    }[],
    items: IKioskPanelItemsData[]
  ) {
    this.KioskData.ServiceData.items = new Array<ServiceBoxControl>();
    customerServices.forEach((element) => {
      const availableService = items.find(
        (m) => m.questionId === element.serviceId
      );
      this.CreateAndAddServiceItems(
        element.serviceNAme,
        this.GetBackGroundColor(availableService),
        this.GetFontColor(availableService),
        element.serviceId,
        element.serviceNAme,
        this.GetIsItemSelected(element.isItemSelected),
        availableService?.isVisible,
        this.GetFont(availableService),
        this.GetFontStyle(availableService),
        this.GetFontSize(availableService),
        this.GetFontWeight(availableService),
        element.serviceIcon
      );
    });
  }

  private GetIsItemSelected(itemSelected: boolean): boolean {
    return itemSelected;
  }

  private GetFontColor(availableService: IKioskPanelItemsData): string {
    return availableService ? availableService.color : this.FontStyles.color;
  }

  private GetFontWeight(
    availableService: IKioskPanelItemsData
  ): number | string {
    return availableService
      ? this.GetDefaultFontWeight(availableService.fontWeight)
      : this.FontStyles.fontWeight;
  }

  private GetFontSize(availableService: IKioskPanelItemsData): number {
    return availableService
      ? availableService.fontSize
      : this.FontStyles.fontSize;
  }

  private GetFontStyle(availableService: IKioskPanelItemsData): string {
    return availableService
      ? availableService.fontStyle
      : this.FontStyles.fontStyle;
  }

  private GetFont(availableService: IKioskPanelItemsData): string {
    return availableService ? availableService.font : this.FontStyles.font;
  }

  private GetBackGroundColor(availableService: IKioskPanelItemsData): string {
    return availableService
      ? availableService.backgroundColor
      : this.FontStyles.backgroundColor;
  }

  /* #endregion */

  // #region LanguagePage

  CreateAndSetItemsToLanguagePage(
    height: number,
    top: number,
    left: number,
    width: number,
    backgroundColor: string,
    itemBackgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    horizontalPadding: number,
    verticalPadding: number
  ) {
    this.KioskData.LanguagePageData.panel = this.CreateLanguageControl(
      height || this.LanguagePageStyles.height,
      GetDefaultIfNegativeOrNull(top, this.LanguagePageStyles.top),
      backgroundColor || this.LanguagePageStyles.backgroundColor,
      color || this.LanguagePageStyles.color,
      font || this.LanguagePageStyles.font,
      fontStyle || this.LanguagePageStyles.fontStyle,
      fontSize || this.LanguagePageStyles.fontSize,
      fontWeight || this.LanguagePageStyles.fontWeight,
      GetDefaultIfNegativeOrNull(left, this.LanguagePageStyles.left),
      width || this.LanguagePageStyles.width,
      horizontalPadding || this.LanguagePageStyles.horizontalPadding,
      verticalPadding || this.LanguagePageStyles.verticalPadding,
      itemBackgroundColor || this.LanguagePageStyles.itemBackgroundColor
    );
  }

  CreateLanguageControl(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    left: number,
    width: number,
    horizontalPadding: number = 10,
    verticalPadding: number = 0,
    itemBackgroundColor: string
  ): any {
    return new LanguagePanelControl(
      this.formBuilder,
      height,
      top,
      width,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      left,
      horizontalPadding,
      verticalPadding,
      itemBackgroundColor
    );
  }

  private UpdateLanguageSubject() {
    this.LanguagePageSubject.next(this.KioskData.LanguagePageData);
  }

  // #endregion

  // #region Thankyou page

  CreateAndSetItemsToThankYouPage(
    height: number,
    top: number,
    left: number,
    width: number,
    backgroundColor: string,
    itemBackgroundColor: string,
    color: string,
    secondaryColor: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    messageDisplayTimeInSeconds: number,
    horizontalPadding: number,
    verticalPadding: number,
    buttons?: IKioskButtonControlData[],
    items?: IKioskThankYouItemData[]
  ) {
    this.KioskData.ThankYouPageData.thankYouPanel = this.CreateThankYouControl(
      height || this.ThankYouPageStyles.height,
      GetDefaultIfNegativeOrNull(top, this.ThankYouPageStyles.top),
      backgroundColor || this.ThankYouPageStyles.backgroundColor,
      color || this.ThankYouPageStyles.color,
      font || this.ThankYouPageStyles.font,
      fontStyle || this.ThankYouPageStyles.fontStyle,
      fontSize || this.ThankYouPageStyles.fontSize,
      fontWeight || this.ThankYouPageStyles.fontWeight,
      GetDefaultIfNegativeOrNull(left, this.ThankYouPageStyles.left),
      width || this.ThankYouPageStyles.width,
      messageDisplayTimeInSeconds ||
        this.ThankYouPageStyles.messageDisplayTimeInSeconds,
      secondaryColor || this.ThankYouPageStyles.secondaryColor,
      horizontalPadding || this.ThankYouPageStyles.horizontalPadding,
      verticalPadding || this.ThankYouPageStyles.verticalPadding,
      itemBackgroundColor || this.ThankYouPageStyles.itemBackgroundColor
    );
    this.AddThankYouControlItems(items);
    this.AddButtonsToThankYouPage(buttons);
  }

  private UpdateThankYouSubject() {
    this.ThankYouSubject.next(this.KioskData.ThankYouPageData);
  }

  private AddButtonsToThankYouPage(buttons: IKioskButtonControlData[]) {
    this.KioskData.ThankYouPageData.buttons = new Array<ButtonControl>();
    this.KioskData.ThankYouPageData.buttons.push(
      this.CreateButtonControl(
        this.FinishButtonName,
        (buttons && buttons[0]?.text) || { en: 'Finish & Exit' },
        (buttons && buttons[0]?.color) || this.ThankYouButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) ||
          this.ThankYouButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ThankYouButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ThankYouButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ThankYouButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) ||
          this.ThankYouButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ThankYouButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ThankYouButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ThankYouButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ThankYouButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.ThankYouPageData.buttons.map((x) => (x.showButton = true));
    this.KioskData.ThankYouPageData.buttons.find(
      (b) => b.name === this.FinishButtonName
    ).showPropertyWindow = true;
  }

  private AddThankYouControlItems(items: IKioskThankYouItemData[]) {
    this.KioskData.ThankYouPageData.thankYouPanel.items.push(
      this.CreateThankYouItemControl(
        (items && items[0]?.font) || this.ThankYouPageStyles.font,
        (items && items[0]?.fontStyle) || this.ThankYouPageStyles.fontStyle,
        (items && items[0]?.fontSize) || 30,
        this.GetDefaultFontWeight(items && items[0]?.fontWeight) ||
          this.ThankYouPageStyles.fontWeight,
        TicketItem.TicketNumber,
        (items && items[0]?.text) || { en: 'Ticket Number' },
        '27',
        true,
        true
      )
    );
    this.KioskData.ThankYouPageData.thankYouPanel.items.push(
      this.CreateThankYouItemControl(
        (items && items[1]?.font) || this.ThankYouPageStyles.font,
        (items && items[1]?.fontStyle) || this.ThankYouPageStyles.fontStyle,
        (items && items[1]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[1]?.fontWeight) ||
          this.ThankYouPageStyles.fontWeight,
        TicketItem.PlaceInLine,
        (items && items[1]?.text) || { en: 'Place in line' },
        '5',
        true,
        false
      )
    );
    this.KioskData.ThankYouPageData.thankYouPanel.items.push(
      this.CreateThankYouItemControl(
        (items && items[2]?.font) || this.ThankYouPageStyles.font,
        (items && items[2]?.fontStyle) || this.ThankYouPageStyles.fontStyle,
        (items && items[2]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[2]?.fontWeight) ||
          this.ThankYouPageStyles.fontWeight,
        TicketItem.EstimatedWait,
        (items && items[2]?.text) || { en: 'Estimated wait' },
        '00:15',
        true,
        false
      )
    );
    this.KioskData.ThankYouPageData.thankYouPanel.items.push(
      this.CreateThankYouItemControl(
        (items && items[3]?.font) || this.ThankYouPageStyles.font,
        (items && items[3]?.fontStyle) || this.ThankYouPageStyles.fontStyle,
        (items && items[3]?.fontSize) || 15,
        this.GetDefaultFontWeight(items && items[3]?.fontWeight) ||
          this.ThankYouPageStyles.fontWeight,
        TicketItem.AgentCalledNote,
        (items && items[3]?.text) || {
          en: `You can continue tracking your place in line or wait time by
        clicking the link in your confirmation email or SMS`,
        },
        '',
        false,
        false
      )
    );
  }

  CreateThankYouControl(
    height: number,
    top: number,
    backgroundColor: string,
    color: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    left: number,
    width: number,
    messageDisplayTimeInSeconds: number = 5,
    dynamicTextColor: string = '',
    horizontalPadding: number = 10,
    verticalPadding: number = 0,
    itemBackgroundColor: string
  ): any {
    return new ThankYouPanelControl(
      this.formBuilder,
      height,
      top,
      width,
      backgroundColor,
      color,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      left,
      dynamicTextColor,
      horizontalPadding,
      verticalPadding,
      messageDisplayTimeInSeconds,
      itemBackgroundColor
    );
  }

  CreateThankYouItemControl(
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: string | number,
    type: string,
    text: object,
    value: string,
    visible: boolean,
    selected: boolean
  ): any {
    return new IThankYouItemControl(
      this.formBuilder,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      type,
      text,
      value,
      visible,
      selected
    );
  }

  // #endregion

  /* #region  Page  */

  SetCurrentPage(pageNumber: string) {
    this.CurrentPageSubject.next(this.GetCurrentPage(pageNumber));
  }

  ChangeLayoutLanguage(value: string) {
    this.SelectedLanguageSubject.next(value);
  }

  GetCurrentPage(pageNumber: string): IPage {
    let Page: IPage;
    if (pageNumber === '0') {
      Page = {
        IsLanguagePage: true,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '1') {
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: true,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '2') {
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: true,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '3') {
      Page = {
        IsLanguagePage: false,
        IsServicePage: true,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '4') {
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: true,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '5') {
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: true,
        IsNoQueuePage: false,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '6'){
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: true,
        IsOffLinePage: false,
      };
    } else if (pageNumber === '7'){
      Page = {
        IsLanguagePage: false,
        IsServicePage: false,
        IsWelcomePage: false,
        IsServiceQuestionPage: false,
        IsPreServiceQuestionPage: false,
        IsThankYouPage: false,
        IsNoQueuePage: false,
        IsOffLinePage: true,
      };
    }
    return Page;
  }

  ChangeDesignerPanel(control: DesignerPanelControl) {
    this.KioskData.DesignerScreen = control;
    this.DesignerPanelSubject.next(control);
  }

  /* #endregion */

  /* #region  Control create methods */

  CreateServiceItemControl(
    serviceNAme: any,
    serviceBGColor: string,
    serviceColor: string,
    serviceQuestionId: string,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    isVisible: boolean,
    serviceQuestionSetId: string = null,
    isItemSelected: boolean = false,
    icons: object = {}
  ) {
    return new ServiceBoxControl(
      this.formBuilder,
      serviceNAme,
      serviceBGColor,
      serviceColor,
      serviceQuestionId,
      serviceQuestionSetId,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      isVisible,
      isItemSelected,
      icons
    );
  }

  CreateServicePanel(
    servicePanelWidth: number,
    servicePanelHeight: number,
    servicePanelTop: number,
    servicePanelLeft: number,
    servicePanelBGColor: string,
    servicePanelColor: string,
    horizontalPadding: number,
    verticalPadding: number,
    font: string,
    fontStyle: string,
    fontSize: number,
    fontWeight: number | string,
    serviceQuestionDisplayMode: number,
    showServiceIcons: boolean = false,
    textBackgroundColor: string = this.ServicePanelStyles.textBackgroundColor
  ): ServicePanelControl {
    return new ServicePanelControl(
      this.formBuilder,
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      verticalPadding,
      horizontalPadding,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      serviceQuestionDisplayMode === 0
        ? Mode.All
        : serviceQuestionDisplayMode || Mode.All,
      showServiceIcons,
      textBackgroundColor
    );
  }

  CreateDesignPanel(
    designPanelWidth: number,
    designPanelHeight: number,
    workflowId: string,
    workflowName: string,
    templateName: string,
    backgroundImage: string,
    backgroundColor: string,
    color: string,
    fontSize: number,
    font: string,
    fontStyle: string,
    fontWeight: number | string,
    cellSize: number = 50,
    showGrid: boolean = true,
    enableVirtualKeyboard : boolean = true,
    waitingTime: number
  ): DesignerPanelControl {
    return new DesignerPanelControl(
      this.formBuilder,
      designPanelWidth,
      designPanelHeight,
      workflowId,
      workflowName,
      templateName,
      backgroundImage,
      backgroundColor,
      color,
      fontSize,
      font,
      fontStyle,
      fontWeight,
      cellSize,
      showGrid,
      enableVirtualKeyboard,
      waitingTime
    );
  }

  CreatePageProperties(
    hideWelcomePage: boolean,
  ): PageProperties {
    return new PageProperties(
      this.formBuilder,
      hideWelcomePage,
    );
  }

  CreateButtonControl(
    name: string,
    text: any,
    color: string,
    bGColor: string,
    width: number,
    height: number,
    fontSize: number,
    fontStyle: string,
    font: string,
    fontWeight: string | number,
    selected: boolean,
    left: number,
    top: number,
    src: ILanguageControl[] = [],
    showIcon: boolean,
    boxRoundCorners: string,
    border: string,
    borderColor: string,
    shadow: boolean
  ): ButtonControl {
    return new ButtonControl(
      this.formBuilder,
      name,
      text,
      color,
      bGColor,
      width,
      height,
      fontSize,
      fontStyle,
      font,
      fontWeight,
      selected,
      left,
      top,
      src,
      showIcon,
      boxRoundCorners,
      border,
      borderColor,
      shadow
    );
  }

  /* #endregion */

  /* #region  DefaultData */

  GetPageList() {
    const pageList: IDropdown[] = [];
    pageList.push({ text: 'Language Page', value: '0', selected: true });
    pageList.push({ text: 'Welcome Page', value: '1', selected: false });
    pageList.push({
      text: 'General Questions Page',
      value: '2',
      selected: false,
    });
    pageList.push({ text: 'Service Page', value: '3', selected: false });
    pageList.push({
      text: 'Service Question Page',
      value: '4',
      selected: false,
    });
    pageList.push({ text: 'Thank You Page', value: '5', selected: false });
    pageList.push({ text: 'No Queue Page', value: '6', selected: false });
    pageList.push({ text: 'OffLine Hours Page', value: '7', selected: false });
    return pageList;
  }

  private GetQuestionSetData(questions): Array<IQuestionSet> {
    const question = [];
    questions?.forEach((element) => {
      question.push({
        id: element.id,
        text: element.questionSetName,
      });
    });
    return question;
  }

  private GetDesignValuesOfServicePageDefaultcontrol() {
    const servicePanelWidth = this.ServicePanelStyles.width;
    const servicePanelHeight = this.ServicePanelStyles.height;
    const servicePanelTop = this.ServicePanelStyles.top;
    const servicePanelLeft = this.ServicePanelStyles.left;
    const servicePanelBGColor = this.PanelBackgroundColor;
    const servicePanelColor = this.PanelColor;
    const designPanelHeight = 515;
    const designPanelWidth = 805;
    const serviceColor = this.FontStyles.color;
    const verticalPadding = this.ServicePanelStyles.verticalPadding;
    const horizontalPadding = this.ServicePanelStyles.horizontalPadding;
    const serviceBGColor = this.ServicePanelStyles.backgroundColor;
    const servicePanelQuestionDisplayMode =
      this.servicePanelQuestionDisplayMode;
    const font = this.FontStyles.font;
    const fontStyle = this.FontStyles.fontStyle;
    const fontSize = this.FontStyles.fontSize;
    const fontWeight = this.FontStyles.fontWeight;
    const textBackgroundColor = this.ServicePanelStyles.textBackgroundColor;
    return {
      servicePanelWidth,
      servicePanelHeight,
      servicePanelTop,
      servicePanelLeft,
      servicePanelBGColor,
      servicePanelColor,
      serviceBGColor,
      serviceColor,
      verticalPadding,
      horizontalPadding,
      servicePanelQuestionDisplayMode,
      designPanelWidth,
      designPanelHeight,
      font,
      fontStyle,
      fontSize,
      fontWeight,
      textBackgroundColor,
    };
  }

  private GetServiceQuestionWithDefaultStyles(questions) {
    const question = [];
    questions
      ?.filter((x) => !x.isDeleted)
      ?.forEach((element) => {
        element.questions
          .filter((x) => x.isVisible && !x.isDeleted)
          .forEach((element1) => {
            const questions = {};
            element1.question.forEach((element2) => {
              questions[element2.languageId] = element2.question;
            });
            question.push({
              serviceId: element1.id,
              serviceNAme: questions,
              name: element1.shortName,
              serviceBGColor: this.ServicePanelStyles.backgroundColor,
              serviceColor: this.FontStyles.color,
              questionSetId: element.id,
              font: this.FontStyles.font,
              fontSize: this.FontStyles.fontSize,
              fontWeight: this.FontStyles.fontWeight,
              fontStyle: this.FontStyles.fontStyle,
            });
          });
      });
    return question;
  }

  private GetPreServiceQuestionWithDefaultStyles(questions) {
    const question: Array<IDefaultData> = [];
    questions
      .filter((x) => x.isVisible && !x.isDeleted)
      .forEach((element) => {
        const questions = {};
        element.question.forEach((element) => {
          questions[element.languageId] = element.question;
        });
        question.push({
          serviceId: element.id,
          serviceNAme: questions,
          serviceColor: this.FontStyles.color,
          serviceBGColor: this.ServicePanelStyles.backgroundColor,
          name: element.shortName,
          isVisible: element.isVisible,
          font: this.FontStyles.font,
          fontStyle: this.FontStyles.fontStyle,
          fontSize: this.FontStyles.fontSize,
          fontWeight: this.FontStyles.fontWeight,
        });
      });
    return question;
  }

  private GetServicesWithDefaultStyle(services) {
    const service: Array<IDefaultData> = [];
    services
      .filter((x) => !x.isDeleted)
      .forEach((element) => {
        const questions = {};
        const serviceIcons = {};
        element.serviceNames.forEach((element1) => {
          questions[element1.languageId] = element1.serviceName;
        });
        element?.serviceIconUrls &&
          element?.serviceIconUrls.forEach((icon) => {
            serviceIcons[icon.languageId] = icon.url;
          });
        service.push({
          serviceId: element.id,
          serviceNAme: questions,
          serviceColor: this.FontStyles.color,
          serviceBGColor: this.ServicePanelStyles.backgroundColor,
          name: element.id,
          isVisible: element.isVisible,
          font: this.FontStyles.font,
          fontStyle: this.FontStyles.fontStyle,
          fontSize: this.FontStyles.fontSize,
          fontWeight: this.FontStyles.fontWeight,
          isItemSelected: element.acceptWalkins,
          serviceIcon: serviceIcons,
        });
      });
    return service;
  }

  private GetDefaultPageData() {
    this.KioskData = {
      DesignerScreen: this.CreateDesignPanel(
        this.DesignerPanel.width,
        this.DesignerPanel.height,
        '',
        '',
        this.IsKioskTemplateIdExistInSession()
          ? ''
          : this.GetDefaultTemplateName(),
        this.DesignerPanel.backgroundImage,
        this.DesignerPanel.backgroundColor,
        this.DesignerPanel.color,
        this.FontStyles.fontSize,
        this.FontStyles.font,
        this.FontStyles.fontStyle,
        this.FontStyles.fontWeight,
        this.DesignerPanel.cellSize,
        this.DesignerPanel.showGrid,
        this.DesignerPanel.enableVirtualKeyboard,
        this.DesignerPanel.waitingTime
      ),
      PageProperties: this.CreatePageProperties(this.PageProperties.hideWelcomePage),
      ServiceData: this.GetDefaultServicePageData(),
      ServiceQuestionData: this.GetDefaultServiceQuestionPageData(),
      PreServiceQuestionData: this.GetDefaultPreServiceQuestionPageData(),
      WelcomePageData: this.GetDefaultWelcomePageData(),
      ThankYouPageData: this.GetDefaultThankYouPageData(),
      LanguagePageData: this.GetDefaultLanguagePageData(),
      NoQueuePageData: this.GetDefaultNoQueuePageData(),
      OffLinePageData: this.GetDefaultOffLinePageData(),
    };
  }

  private GetDefaultTemplateName(): string {
    const ExistingTemplateNameList: number[] = [];

    if (
      this.kioskMainService.Kiosks$ != null &&
      this.kioskMainService.Kiosks$ != undefined
    ) {
      this.kioskMainService.Kiosks$.subscribe((response) => {
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
          ExistingTemplateNameList.sort(function(x, y) {
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
        (this.kioskMainService.Kiosks$ == null ||
          this.kioskMainService.Kiosks$ == undefined) &&
        this.browserStorageService.KioskTemplateName
      ) {
        return this.browserStorageService.KioskTemplateName;
      }

      this.browserStorageService.SetKioskTemplateName('Template-1');
      return 'Template-1';
    }

    const count = ExistingTemplateNameList.slice(-1)[0] + 1;
    const missing = new Array();

    for (let i = 1; i <= count; i++) {
      if (ExistingTemplateNameList.indexOf(i) == -1) {
        missing.push(i);
      }
    }

    this.browserStorageService.SetKioskTemplateName('Template-' + missing[0]);
    return 'Template-' + missing[0];
  }

  CallLanguageListAPI() {
    this.companyAPIService
      .GetLanguages<ISupportedLanguage>(this.authService.CompanyId)
      .subscribe((x: ISupportedLanguage[]) => {
        this.LanguageSubject.next(x);
        this.DefaultLanguageSubject.next(
          x.find((l) => l.isDefault).languageCode
        );
        this.UpdateExistingData();
      });
  }

  private UpdateExistingData() {
    const pages = [
      'ServiceData',
      'ServiceQuestionData',
      'PreServiceQuestionData',
      'ThankYouPageData',
      'WelcomePageData',
      'LanguagePageData',
    ];
    pages.forEach((p) => {
      if (this.KioskData) {
        for (const img of this.KioskData[p].imageDivs) {
          img.src = this.UpdateImageVideoSrcInExistingKiosk(img.src);
          img.form.get('src').setValue(img.src);
        }
        for (const video of this.KioskData[p].videoDivs) {
          video.src = this.UpdateImageVideoSrcInExistingKiosk(video.src);
          video.form.get('src').setValue(video.src);
        }
        for (const slider of this.KioskData[p].slidersDivs) {
          slider.src = this.UpdateSliderSrcInExistingKiosk(slider.src);
          slider.form.get('src').setValue(slider.src);
        }
      }
    });
  }

  UpdateImageVideoSrcInExistingKiosk(src) {
    if (typeof src === 'string' && this.LanguageSubject.value) {
      const imageSrc = [];
      this.LanguageSubject.value.forEach((lang) => {
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

  UpdateSliderSrcInExistingKiosk(src) {
    const data: ISliderControlPostPreview[] = [];
    src.forEach((x) => {
      if (typeof x.url === 'string') {
        this.LanguageSubject.value.forEach((lang) => {
          data.push({
            type: x.type,
            url: lang.isDefault ? x.url : [],
            name: lang.isDefault ? this.GetFileName(x.url) : '',
            version: 'Old',
            languageCode: lang.languageCode,
          });
        });
        return this.GetLanguageWiseSrc(data);
      }
    });
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
    this.LanguageSubject.value.forEach((lang) => {
      src.push({
        language: lang.language,
        languageCode: lang.languageCode,
        url: lang.isDefault ? urls : [],
      });
    });
    return src;
  }

  private GetDefaultThankYouPageData(): IThankYouPage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      thankYouPanel: new ThankYouPanelControl(
        this.formBuilder,
        this.ThankYouPageStyles.height,
        this.ThankYouPageStyles.top,
        this.ThankYouPageStyles.width,
        this.ThankYouPageStyles.backgroundColor,
        this.ThankYouPageStyles.color,
        this.ThankYouPageStyles.font,
        this.ThankYouPageStyles.fontStyle,
        this.ThankYouPageStyles.fontSize,
        this.ThankYouPageStyles.fontWeight,
        this.ThankYouPageStyles.left,
        '',
        this.ThankYouPageStyles.horizontalPadding,
        this.ThankYouPageStyles.verticalPadding,
        this.ThankYouPageStyles.messageDisplayTimeInSeconds,
        this.ThankYouPageStyles.itemBackgroundColor
      ),
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      }
    };
  }

  private GetDefaultLanguagePageData(): ILanguagePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      panel: null,
      slidersDivs: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false,
      },
    };
  }

  private GetDefaultWelcomePageData(): IWelcomePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      },
    };
  }

  private GetDefaultNoQueuePageData(): INoQueuePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      },
    };
  }

  private GetDefaultOffLinePageData(): IOffLinePage {
    return {
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      videoDivs: [],
      slidersDivs: [],
      buttons: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      },
    };
  }

  private GetDefaultPreServiceQuestionPageData(): IPreServiceQuestion {
    return {
      items: [],
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      dropDownList: [],
      videoDivs: [],
      panel: null,
      questionSetList: [],
      slidersDivs: [],
      buttonList: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      }
    };
  }

  private GetDefaultServiceQuestionPageData(): IServiceQuestion {
    return {
      items: [],
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      dropDownList: [],
      videoDivs: [],
      panel: null,
      questionSetList: [],
      buttonList: [],
      slidersDivs: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      }
    };
  }

  private GetDefaultServicePageData(): IService {
    return {
      items: [],
      imageDivs: [],
      labelDivs: [],
      otherControls: [],
      dropDownList: [],
      videoDivs: [],
      panel: null,
      buttons: [],
      slidersDivs: [],
      otherControlCountData: {
        totalImageCount: 0,
        totalLabelCount: 0,
        totalSliderCount: 0,
        totalVideoCount: 0,
      },
      controlSelection: {
        IsButtonSelected: false,
        IsOtherControlsSelected: false,
        IsPanelSelected: false
      }
    };
  }

  private CreateButtonsOfWelcomePage(buttons) {
    this.KioskData.WelcomePageData.buttons = new Array<ButtonControl>();
    this.KioskData.WelcomePageData.buttons.push(
      this.CreateButtonControl(
        this.NextButtonName,
        (buttons && buttons[0]?.text) || this.NextButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.WelcomePageData.buttons.push(
      this.CreateButtonControl(
        (buttons && buttons[1]?.name) || this.BackButtonName,
        (buttons && buttons[1]?.text) || this.BackButtonText,
        (buttons && buttons[1]?.color) || this.ButtonStyles.color,
        (buttons && buttons[1]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[1]?.width) || this.ButtonStyles.width,
        (buttons && buttons[1]?.height) || this.ButtonStyles.height,
        (buttons && buttons[1]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[1]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[1]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[1]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        false,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.left,
          this.BackButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[1]?.top,
          this.BackButtonStyles.top
        ),
        (buttons && buttons[1]?.src) || [],
        (buttons && buttons[1]?.showIcon) || false,
        (buttons && buttons[1]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[1]?.border) || this.ButtonStyles.border,
        (buttons && buttons[1]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[1]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.WelcomePageData.buttons.find(
      (x) => x.name === this.NextButtonName
    ).showPropertyWindow = true;
    this.WelcomePageSubject.next(Object.create(this.KioskData.WelcomePageData));
  }

  private CreateItemsOfNoQueuePage(buttons) {
    this.KioskData.NoQueuePageData.buttons = new Array<ButtonControl>();
    this.KioskData.NoQueuePageData.buttons.push(
      this.CreateButtonControl(
        this.ExitButtonName,
        (buttons && buttons[0]?.text) || this.ExitButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.NoQueuePageData.buttons.find(
      (x) => x.name === this.ExitButtonName
    ).showPropertyWindow = true;
    this.NoQueuePageSubject.next((this.KioskData.NoQueuePageData));
  }

  private CreateItemsOfOffLinePage(buttons) {
    this.KioskData.OffLinePageData.buttons = new Array<ButtonControl>();
    this.KioskData.OffLinePageData.buttons.push(
      this.CreateButtonControl(
        this.BackButtonName,
        (buttons && buttons[0]?.text) || this.BackButtonText,
        (buttons && buttons[0]?.color) || this.ButtonStyles.color,
        (buttons && buttons[0]?.backgroundColor) || this.ButtonStyles.BGColor,
        (buttons && buttons[0]?.width) || this.ButtonStyles.width,
        (buttons && buttons[0]?.height) || this.ButtonStyles.height,
        (buttons && buttons[0]?.fontSize) || this.ButtonStyles.fontSize,
        (buttons && buttons[0]?.fontStyle) || this.ButtonStyles.fontStyle,
        (buttons && buttons[0]?.font) || this.ButtonStyles.font,
        this.GetDefaultFontWeight(buttons && buttons[0]?.fontWeight) ||
          this.ButtonStyles.fontWeight,
        true,
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.left,
          this.ButtonStyles.left
        ),
        GetDefaultIfNegativeOrNull(
          buttons && buttons[0]?.top,
          this.ButtonStyles.top
        ),
        (buttons && buttons[0]?.src) || [],
        (buttons && buttons[0]?.showIcon) || false,
        (buttons && buttons[0]?.boxRoundCorners) ||
          this.ButtonStyles.boxRoundCorners,
        (buttons && buttons[0]?.border) || this.ButtonStyles.border,
        (buttons && buttons[0]?.borderColor) || this.ButtonStyles.borderColor,
        (buttons && buttons[0]?.shadow) || this.ButtonStyles.shadow
      )
    );
    this.KioskData.OffLinePageData.buttons.find(
      (x) => x.name === this.BackButtonName
    ).showPropertyWindow = true;
    this.OffLinePageSubject.next((this.KioskData.OffLinePageData));
  }

  GetModifiedLayoutDetails() {
    const kioskDetail: IKioskLayoutData = {
      designerScreen: null,
      pageProperties: null,
      languagePage: null,
      preServiceQuestionPage: null,
      servicePage: null,
      serviceQuestion: null,
      thankYouPage: null,
      welcomePage: null,
      noQueuePage: null,
      offLinePage: null,
      companyId: this.authService.CompanyId,
    };
    kioskDetail.designerScreen =
      this.GetMappedDesignScreenDataByCurrentKioskData();
    kioskDetail.pageProperties = this.GetMappedPagePropertiesDataByCurrentKioskData();

    const pre_service_images = this.GetPreServiceQuestionImages();
    const pre_service_slider = this.GetPreServiceQuestionSliders();
    const pre_service_Videos = this.GetPreServiceQuestionVideos();
    const pre_service_labels = this.GetPreServiceQuestionLabels();
    const pre_service_questions = this.GetPreServiceQuestionQuestions();
    const pre_service_buttons = this.GetPreServiceQuestionButtons();

    kioskDetail.preServiceQuestionPage =
      this.GetMappedPreServiceQuestionPageDataByCurrentKioskData(
        pre_service_images,
        pre_service_labels,
        pre_service_Videos,
        pre_service_questions,
        pre_service_slider,
        pre_service_buttons
      );
    const service_images = this.GetServiceImages();
    const service_labels = this.GetServiceLabels();
    const service_slider = this.GetServicesSliders();
    const service_videos = this.GetServiceVideos();
    const service_buttons = this.GetServiceButtons();
    const serviceData = this.GetServicesData();
    kioskDetail.servicePage = this.GetMappedServicePageDataByCurrentKioskData(
      service_images,
      service_labels,
      service_videos,
      serviceData,
      service_slider,
      service_buttons
    );
    const welcome_images = this.GetWelcomePageImages();
    const welcome_labels = this.GetWelcomePageLabels();
    const welcome_slider = this.GetWelcomeSliders();
    const welcome_videos = this.GetWelcomePageVideos();
    const welcome_buttons = this.GetWelcomeButtons();
    kioskDetail.welcomePage = this.GetMappedWelcomePageDataByCurrentKioskData(
      welcome_images,
      welcome_labels,
      welcome_videos,
      welcome_slider,
      welcome_buttons
    );

    const no_queue_images = this.GetNoQueuePageImages();
    const no_queue_labels = this.GetNoQueuePageLabels();
    const no_queue_slider = this.GetNoQueueSliders();
    const no_queue_videos = this.GetNoQueuePageVideos();
    const no_queue_buttons = this.GetNoQueueButtons();
    kioskDetail.noQueuePage = this.GetMappedNoQueuePageDataByCurrentKioskData(
      no_queue_images,
      no_queue_labels,
      no_queue_videos,
      no_queue_slider,
      no_queue_buttons
    );

    const off_line_images = this.GetOffLinePageImages();
    const off_line_labels = this.GetOffLinePageLabels();
    const off_line_slider = this.GetOffLineSliders();
    const off_line_videos = this.GetOffLinePageVideos();
    const off_line_buttons = this.GetOffLineButtons();
    kioskDetail.offLinePage = this.GetMappedOffLinePageDataByCurrentKioskData(
      off_line_images,
      off_line_labels,
      off_line_videos,
      off_line_slider,
      off_line_buttons
    );

    const thank_you_images = this.GetThankYouImages();
    const thank_you_labels = this.GetThankYouPageLabels();
    const thank_you_slider = this.GetThankYouSliders();
    const thank_you_videos = this.GetThankYouVideos();
    kioskDetail.thankYouPage = this.GetMappedThankYouPageDataByCurrentKioskData(
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
    const service_question_buttons = this.GetServiceQuestionButtons();
    kioskDetail.serviceQuestion =
      this.GetMappedServiceQuestionPageDataByCurrentKioskData(
        service_question_images,
        service_question_labels,
        service_question_questionSet,
        service_question_videos,
        service_question_slider,
        service_question_buttons
      );
    const language_images = this.GetLanguageImages();
    const language_labels = this.GetLanguageLabels();
    const language_videos = this.GetLanguageVideos();
    const language_sliders = this.GetLanguageSliders();
    kioskDetail.languagePage = this.GetMappedLanguagePageDataByCurrentKioskData(
      language_images,
      language_labels,
      language_videos,
      language_sliders
    );
    return kioskDetail;
  }

  private GetMappedDesignScreenDataByCurrentKioskData() {
    return {
      height: this.KioskData.DesignerScreen.styles.height,
      workFlowName: this.KioskData.DesignerScreen.workFlowName,
      WorkFlowId: this.KioskData.DesignerScreen.workFlowId,
      backGroundImage: this.KioskData.DesignerScreen.backgroundImage,
      color: this.KioskData.DesignerScreen.styles.color,
      backgroundColor: this.KioskData.DesignerScreen.styles.backgroundColor,
      font: this.KioskData.DesignerScreen.styles.font,
      fontSize: this.KioskData.DesignerScreen.styles.fontSize,
      fontStyle: this.KioskData.DesignerScreen.styles.fontStyle,
      fontWeight: this.KioskData.DesignerScreen.styles.fontWeight,
      templateName: this.KioskData.DesignerScreen.name,
      workFlowId: this.KioskData.DesignerScreen.workFlowId,
      templateId: this.browserStorageService.KioskTemplateId
        ? this.browserStorageService.KioskTemplateId
        : this.uuid,
      width: this.KioskData.DesignerScreen.styles.width,
      languageId: null,
      showGrid: this.KioskData.DesignerScreen.showGrid,
      cellSize: this.KioskData.DesignerScreen.cellSize,
      enableVirtualKeyboard: this.KioskData.DesignerScreen.enableVirtualKeyboard,
      waitingTime: this.KioskData.DesignerScreen.waitingTime,
    };
  }

  private GetMappedPagePropertiesDataByCurrentKioskData() {
    return {
      hideWelcomePage: this.KioskData.PageProperties.hideWelcomePage
    };
  }

  private GetMappedServicePageDataByCurrentKioskData(
    service_images: IKioskImageControlData[],
    service_labels: IKioskLabelControlData[],
    service_videos: IKioskVideosControlData[],
    item: IKioskPanelItemsData[],
    service_sliders: IKioskSliderControlData[],
    service_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: service_images,
      labels: service_labels,
      sliders: service_sliders,
      videos: service_videos,
      buttons: service_buttons,
      panel: {
        fontWeight: this.KioskData.ServiceData.panel.styles.fontWeight,
        backgroundColor:
          this.KioskData.ServiceData.panel.styles.backgroundColor,
        color: this.KioskData.ServiceData.panel.styles.color,
        font: this.KioskData.ServiceData.panel.styles.font,
        fontSize: this.KioskData.ServiceData.panel.styles.fontSize,
        fontStyle: this.KioskData.ServiceData.panel.styles.fontStyle,
        horizontalPadding: Number(
          this.KioskData.ServiceData.panel.horizontalPadding
        ),
        height: this.KioskData.ServiceData.panel.styles.height,
        left: this.KioskData.ServiceData.panel.styles.left,
        questionDisplayMode: this.KioskData.ServiceData.panel.mode,
        top: this.KioskData.ServiceData.panel.styles.top,
        verticalPadding: Number(
          this.KioskData.ServiceData.panel.verticalPadding
        ),
        width: this.KioskData.ServiceData.panel.styles.width,
        showServiceIcons: this.KioskData.ServiceData.panel.showServiceIcons,
        textBackgroundColor:
          this.KioskData.ServiceData.panel.textBackgroundColor,
      },
      services: item,
      controlsCount: this.KioskData.ServiceData.otherControlCountData,
    };
  }

  private GetMappedServiceQuestionPageDataByCurrentKioskData(
    service_question_images: IKioskImageControlData[],
    service_question_labels: IKioskLabelControlData[],
    item: IKioskQuestionSetData[],
    service_question_videos: IKioskVideosControlData[],
    service_question_sliders: IKioskSliderControlData[],
    service_question_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: service_question_images,
      labels: service_question_labels,
      sliders: service_question_sliders,
      videos: service_question_videos,
      buttons: service_question_buttons,
      panel: {
        backgroundColor:
          this.KioskData.ServiceQuestionData.panel.styles.backgroundColor,
        color: this.KioskData.ServiceQuestionData.panel.styles.color,
        font: this.KioskData.ServiceQuestionData.panel.styles.font,
        fontSize: this.KioskData.ServiceQuestionData.panel.styles.fontSize,
        fontStyle: this.KioskData.ServiceQuestionData.panel.styles.fontStyle,
        horizontalPadding: Number(
          this.KioskData.ServiceQuestionData.panel.horizontalPadding
        ),
        height: this.KioskData.ServiceQuestionData.panel.styles.height,
        left: this.KioskData.ServiceQuestionData.panel.styles.left,
        questionDisplayMode: Number(
          this.KioskData.ServiceQuestionData.panel.mode
        ),
        top: this.KioskData.ServiceQuestionData.panel.styles.top,
        verticalPadding: Number(
          this.KioskData.ServiceQuestionData.panel.verticalPadding
        ),
        width: this.KioskData.ServiceQuestionData.panel.styles.width,
        fontWeight: this.KioskData.ServiceQuestionData.panel.styles.fontWeight,
      },
      questionSet: item,
      controlsCount: this.KioskData.ServiceQuestionData.otherControlCountData,
    };
  }

  private GetMappedPreServiceQuestionPageDataByCurrentKioskData(
    pre_service_images: IKioskImageControlData[],
    pre_service_labels: IKioskLabelControlData[],
    pre_service_videos: IKioskVideosControlData[],
    item: IKioskPanelItemsData[],
    pre_service_sliders: IKioskSliderControlData[],
    pre_service_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: pre_service_images,
      labels: pre_service_labels,
      videos: pre_service_videos,
      sliders: pre_service_sliders,
      buttons: pre_service_buttons,
      panel: {
        backgroundColor:
          this.KioskData.PreServiceQuestionData.panel?.styles.backgroundColor,
        color: this.KioskData.PreServiceQuestionData.panel?.styles.color,
        font: this.KioskData.PreServiceQuestionData.panel?.styles.font,
        fontSize: this.KioskData.PreServiceQuestionData.panel?.styles.fontSize,
        fontStyle:
          this.KioskData.PreServiceQuestionData.panel?.styles.fontStyle,
        horizontalPadding: Number(
          this.KioskData.PreServiceQuestionData.panel?.horizontalPadding
        ),
        height: this.KioskData.PreServiceQuestionData.panel?.styles.height,
        left: this.KioskData.PreServiceQuestionData.panel?.styles.left,
        questionDisplayMode: Number(
          this.KioskData.PreServiceQuestionData.panel?.mode
        ),
        top: this.KioskData.PreServiceQuestionData.panel?.styles.top,
        verticalPadding: Number(
          this.KioskData.PreServiceQuestionData.panel?.verticalPadding
        ),
        width: this.KioskData.PreServiceQuestionData.panel?.styles.width,
        fontWeight:
          this.KioskData.PreServiceQuestionData.panel?.styles.fontWeight,
      },
      controlsCount:
        this.KioskData.PreServiceQuestionData.otherControlCountData,
      questions: item,
    };
  }

  private GetMappedThankYouPageDataByCurrentKioskData(
    thank_you_images: IKioskImageControlData[],
    thank_you_labels: IKioskLabelControlData[],
    thank_you_videos: IKioskVideosControlData[],
    thank_You_sliders: IKioskSliderControlData[]
  ) {
    return {
      images: thank_you_images,
      labels: thank_you_labels,
      videos: thank_you_videos,
      sliders: thank_You_sliders,
      panel: {
        items: this.GetThankYouItems(),
        top: this.KioskData.ThankYouPageData.thankYouPanel.styles.top,
        left: this.KioskData.ThankYouPageData.thankYouPanel.styles.left,
        width: this.KioskData.ThankYouPageData.thankYouPanel.styles.width,
        height: this.KioskData.ThankYouPageData.thankYouPanel.styles.height,
        primaryColor:
          this.KioskData.ThankYouPageData.thankYouPanel.styles.color,
        secondaryColor:
          this.KioskData.ThankYouPageData.thankYouPanel.dynamicTextColor,
        backgroundColor:
          this.KioskData.ThankYouPageData.thankYouPanel.styles.backgroundColor,
        horizontalPadding:
          this.KioskData.ThankYouPageData.thankYouPanel.horizontalPadding,
        verticalPadding:
          this.KioskData.ThankYouPageData.thankYouPanel.verticalPadding,
        font: this.KioskData.ThankYouPageData.thankYouPanel.styles.font,
        fontSize: this.KioskData.ThankYouPageData.thankYouPanel.styles.fontSize,
        fontStyle:
          this.KioskData.ThankYouPageData.thankYouPanel.styles.fontStyle,
        fontWeight:
          this.KioskData.ThankYouPageData.thankYouPanel.styles.fontWeight,
        messageDisplayTimeInSeconds:
          this.KioskData.ThankYouPageData.thankYouPanel
            .messageDisplayTimeInSeconds,
        itemBackgroundColor:
          this.KioskData.ThankYouPageData.thankYouPanel.itemBackgroundColor,
      },
      buttons: this.GetThankYouButtons(),
      controlsCount: this.KioskData.ThankYouPageData.otherControlCountData,
    };
  }

  private GetMappedLanguagePageDataByCurrentKioskData(
    language_images: IKioskImageControlData[],
    language_labels: IKioskLabelControlData[],
    language_videos: IKioskVideosControlData[],
    language_sliders: IKioskSliderControlData[]
  ) {
    return {
      images: language_images,
      labels: language_labels,
      videos: language_videos,
      sliders: language_sliders,
      panel: {
        top: this.KioskData.LanguagePageData.panel.styles.top,
        left: this.KioskData.LanguagePageData.panel.styles.left,
        width: this.KioskData.LanguagePageData.panel.styles.width,
        height: this.KioskData.LanguagePageData.panel.styles.height,
        zindex: this.KioskData.LanguagePageData.panel.styles.zindex,
        color: this.KioskData.LanguagePageData.panel.styles.color,
        backgroundColor:
          this.KioskData.LanguagePageData.panel.styles.backgroundColor,
        horizontalPadding:
          this.KioskData.LanguagePageData.panel.horizontalPadding,
        verticalPadding: this.KioskData.LanguagePageData.panel.verticalPadding,
        font: this.KioskData.LanguagePageData.panel.styles.font,
        fontSize: this.KioskData.LanguagePageData.panel.styles.fontSize,
        fontStyle: this.KioskData.LanguagePageData.panel.styles.fontStyle,
        fontWeight: this.KioskData.LanguagePageData.panel.styles.fontWeight,
        itemBackgroundColor:
          this.KioskData.LanguagePageData.panel.itemBackgroundColor,
      },
      controlsCount: this.KioskData.LanguagePageData.otherControlCountData,
    };
  }

  private GetMappedWelcomePageDataByCurrentKioskData(
    welcome_images: IKioskImageControlData[],
    welcome_labels: IKioskLabelControlData[],
    welcome_videos: IKioskVideosControlData[],
    welcome_sliders: IKioskSliderControlData[],
    welcome_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: welcome_images,
      labels: welcome_labels,
      videos: welcome_videos,
      sliders: welcome_sliders,
      buttons: welcome_buttons,
      controlsCount: this.KioskData.WelcomePageData.otherControlCountData,
    };
  }

  private GetMappedNoQueuePageDataByCurrentKioskData(
    no_queue_images: IKioskImageControlData[],
    no_queue_labels: IKioskLabelControlData[],
    no_queue_videos: IKioskVideosControlData[],
    no_queue_sliders: IKioskSliderControlData[],
    no_queue_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: no_queue_images,
      labels: no_queue_labels,
      videos: no_queue_videos,
      sliders: no_queue_sliders,
      buttons: no_queue_buttons,
      controlsCount: this.KioskData.NoQueuePageData.otherControlCountData,
    };
  }

  private GetMappedOffLinePageDataByCurrentKioskData(
    off_line_images: IKioskImageControlData[],
    off_line_labels: IKioskLabelControlData[],
    off_line_videos: IKioskVideosControlData[],
    off_line_sliders: IKioskSliderControlData[],
    off_line_buttons: IKioskButtonControlData[]
  ) {
    return {
      images: off_line_images,
      labels: off_line_labels,
      videos: off_line_videos,
      sliders: off_line_sliders,
      buttons: off_line_buttons,
      controlsCount: this.KioskData.OffLinePageData.otherControlCountData,
    };
  }

  private GetPreServiceQuestionImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.PreServiceQuestionData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  private GetPreServiceQuestionSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.PreServiceQuestionData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetThankYouSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.ThankYouPageData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetWelcomeSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.WelcomePageData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetNoQueueSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.NoQueuePageData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetOffLineSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.OffLinePageData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetServicesSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.ServiceData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetServiceQuestionSliders() {
    const slider: IKioskSliderControlData[] = [];
    this.KioskData.ServiceQuestionData.slidersDivs.forEach((x) => {
      slider.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return slider;
  }
  private GetPreServiceQuestionVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.PreServiceQuestionData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetPreServiceQuestionLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.PreServiceQuestionData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetPreServiceQuestionQuestions() {
    const questions: IKioskPanelItemsData[] = [];
    this.KioskData.PreServiceQuestionData.items.forEach((x) => {
      questions.push({
        questionId: x.questionId,
        color: this.KioskData.PreServiceQuestionData.panel.styles.color,
        font: this.KioskData.PreServiceQuestionData.panel.styles.font,
        fontSize: this.KioskData.PreServiceQuestionData.panel.styles.fontSize,
        fontStyle: this.KioskData.PreServiceQuestionData.panel.styles.fontStyle,
        backgroundColor:
          this.KioskData.PreServiceQuestionData.panel.styles.backgroundColor,
        isItemSelected: false,
        fontWeight:
          this.KioskData.PreServiceQuestionData.panel.styles.fontWeight,
          isVisible: x.isVisible
      });
    });
    return questions;
  }

  private GetPreServiceQuestionButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.PreServiceQuestionData.buttonList.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: this.CheckPreServiceQuestionFixedButtonsInSingleMode(x)
          ? 0
          : x.styles.left,
        top: this.CheckPreServiceQuestionFixedButtonsInSingleMode(x)
          ? 0
          : x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private CheckPreServiceQuestionFixedButtonsInSingleMode(x: ButtonControl) {
    return (
      Number(this.KioskData.PreServiceQuestionData.panel?.mode) ===
        Mode.Single && x.name === this.NextButtonName
    );
  }

  private GetServiceButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.ServiceData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: x.styles.left,
        top: x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetThankYouItems() {
    const items: IKioskThankYouItemData[] = [];
    this.KioskData.ThankYouPageData.thankYouPanel.items.forEach((x) => {
      items.push({
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        text: x.text,
        value: x.value,
        visible: x.visible,
        type: x.type,
      });
    });
    return items;
  }

  private GetThankYouButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.ThankYouPageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: x.styles.left,
        top: x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetThankYouImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.ThankYouPageData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }
  private GetThankYouVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.ThankYouPageData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }
  private GetThankYouPageLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.ThankYouPageData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetWelcomePageImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.WelcomePageData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  private GetNoQueuePageImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.NoQueuePageData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  private GetOffLinePageImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.OffLinePageData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  private GetWelcomePageVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.WelcomePageData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetNoQueuePageVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.NoQueuePageData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetOffLinePageVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.OffLinePageData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetWelcomeButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.WelcomePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: x.styles.left,
        top: x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetNoQueueButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.NoQueuePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: x.styles.left,
        top: x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }


  private GetOffLineButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.OffLinePageData.buttons.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: x.styles.left,
        top: x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  private GetWelcomePageLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.WelcomePageData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetNoQueuePageLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.NoQueuePageData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetOffLinePageLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.OffLinePageData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetServiceQuestionLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.ServiceQuestionData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetServiceQuestionImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.ServiceQuestionData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }

  private GetServiceQuestionVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.ServiceQuestionData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetServiceQuestionButtons() {
    const buttons: IKioskButtonControlData[] = [];
    this.KioskData.ServiceQuestionData.buttonList.forEach((x) => {
      buttons.push({
        name: x.name,
        height: x.styles.height,
        width: x.styles.width,
        text: x.text,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        backgroundColor: x.styles.backgroundColor,
        showButton: x.showButton,
        selected: x.selected,
        left: this.CheckServiceQuestionFixedButtonsInSingleMode(x)
          ? 0
          : x.styles.left,
        top: this.CheckServiceQuestionFixedButtonsInSingleMode(x)
          ? 0
          : x.styles.top,
        src: this.GetSrc(x.src),
        showIcon: x.showIcon,
        boxRoundCorners: x.styles.boxRoundCorners,
        border: x.border,
        borderColor: x.borderColor,
        shadow: x.shadow,
      });
    });
    return buttons;
  }

  GetSrc(src) {
    const btnSrc = [];
    src.forEach((element) => {
      btnSrc.push({
        language: element.language,
        languageCode: element.languageCode,
        [element.languageCode]: element[element.languageCode],
        url: element.url.startsWith('/assets') ? '' : element.url,
      });
    });
    return btnSrc;
  }

  private CheckServiceQuestionFixedButtonsInSingleMode(x: ButtonControl) {
    return (
      Number(this.KioskData.ServiceQuestionData.panel?.mode) === Mode.Single &&
      x.name === this.NextButtonName
    );
  }

  private GetServiceQuestionsData() {
    const questionSet: IKioskQuestionSetData[] = [];
    let questions: IKioskPanelItemsData[] = [];
    this.KioskData.ServiceQuestionData.items.forEach((x) => {
      questions.push({
        questionId: x.questionId,
        color: this.KioskData.ServiceQuestionData.panel.styles.color,
        font: this.KioskData.ServiceQuestionData.panel.styles.font,
        fontSize: this.KioskData.ServiceQuestionData.panel.styles.fontSize,
        fontStyle: this.KioskData.ServiceQuestionData.panel.styles.fontStyle,
        backgroundColor:
          this.KioskData.ServiceQuestionData.panel.styles.backgroundColor,
        fontWeight: this.KioskData.ServiceQuestionData.panel.styles.fontWeight,
        isVisible: x.isVisible
      });
      if (
        this.KioskData.ServiceQuestionData.items.filter(
          (t) => t.questionSetId == x.questionSetId
        ).length == questions.length
      ) {
        questionSet.push({
          questionSetId: x.questionSetId,
          questions,
        });
        questions = [];
      }
    });
    return questionSet;
  }

  private GetServiceImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.ServiceData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }
  private GetServiceVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.ServiceData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetServiceLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.ServiceData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetServicesData() {
    const questions: IKioskPanelItemsData[] = [];
    this.KioskData.ServiceData.items.forEach((x) => {
      questions.push({
        questionId: x.questionId,
        color: this.KioskData.ServiceData.panel.styles.color,
        font: this.KioskData.ServiceData.panel.styles.font,
        fontSize: this.KioskData.ServiceData.panel.styles.fontSize,
        fontStyle: this.KioskData.ServiceData.panel.styles.fontStyle,
        backgroundColor: this.KioskData.ServiceData.panel.textBackgroundColor,
        isItemSelected: x.kioskSelected,
        fontWeight: this.KioskData.ServiceData.panel.styles.fontWeight,
        isVisible: x.isVisible
      });
    });
    return questions;
  }

  private GetLanguageImages() {
    const images: IKioskImageControlData[] = [];
    this.KioskData.LanguagePageData.imageDivs.forEach((x) => {
      images.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return images;
  }
  private GetLanguageVideos() {
    const videos: IKioskVideosControlData[] = [];
    this.KioskData.LanguagePageData.videoDivs.forEach((x) => {
      videos.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: x.src,
        top: x.styles.top,
        zindex: x.styles.zindex,
      });
    });
    return videos;
  }

  private GetLanguageLabels() {
    const labels: IKioskLabelControlData[] = [];
    this.KioskData.LanguagePageData.labelDivs.forEach((x) => {
      labels.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        text: x.text,
        top: x.styles.top,
        zindex: x.styles.zindex,
        color: x.styles.color,
        font: x.styles.font,
        fontSize: x.styles.fontSize,
        fontStyle: x.styles.fontStyle,
        fontWeight: x.styles.fontWeight,
        alignment: x.alignment,
        backgroundColor:x.styles.backgroundColor
      });
    });
    return labels;
  }

  private GetLanguageSliders() {
    const sliders = [];
    this.KioskData.LanguagePageData.slidersDivs.forEach((x) => {
      sliders.push({
        name: x.name,
        height: x.styles.height,
        left: x.styles.left,
        width: x.styles.width,
        src: this.GetUrls(x.src ? x.src : x.urls),
        utls: x.urls,
        top: x.styles.top,
      });
    });
    return sliders;
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

  public GetRequestDocument(
    WorkFlow: IWorkFlowRequest | IWorkFlowDetail,
    isDoc?: boolean,
    isAppointment?: boolean
  ) {
    const documents = [
      this.GetWorkFlowDocument(WorkFlow ? WorkFlow : this.WorkFlow, isDoc),
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
    WorkFlow: IWorkFlowRequest | IWorkFlowDetail,
    isDoc: boolean
  ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null,
    };
  }

  /* #endregion */

  //#region Language Page Control Selection

  OnLanguagePagePanelSelection() {
    this.ResetLanguageControlSelection();
    this.LanguagePageSubject.value.controlSelection.IsPanelSelected = true;
    this.LanguagePageSubject.next(this.LanguagePageSubject.value);
  }
  OnLanguagePageOtherControlsSelection() {
    this.ResetLanguageControlSelection();
    this.LanguagePageSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.LanguagePageSubject.next(this.LanguagePageSubject.value);
  }
  ResetLanguageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.LanguagePageSubject.value.controlSelection
    )) {
      this.LanguagePageSubject.value.controlSelection[propertyKey] = false;
    }
  }
  OnWelcomePageButtonSelection() {
    this.ResetWelcomePageControlSelection();
    this.WelcomePageSubject.value.controlSelection.IsButtonSelected = true;
    this.WelcomePageSubject.next(this.WelcomePageSubject.value);
  }

  OnNoQueuePageButtonSelection() {
    this.ResetNoQueuePageControlSelection();
    this.NoQueuePageSubject.value.controlSelection.IsButtonSelected = true;
    this.NoQueuePageSubject.next(this.NoQueuePageSubject.value);
  }

  OnOffLinePageButtonSelection() {
    this.ResetOffLinePageControlSelection();
    this.OffLinePageSubject.value.controlSelection.IsButtonSelected = true;
    this.OffLinePageSubject.next(this.OffLinePageSubject.value);
  }


  OnWelcomePageOtherControlsSelection() {
    this.ResetWelcomePageControlSelection();
    this.WelcomePageSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.WelcomePageSubject.next(this.WelcomePageSubject.value);
  }

  OnNoQueuePageOtherControlsSelection() {
    this.ResetNoQueuePageControlSelection();
    this.NoQueuePageSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.NoQueuePageSubject.next(this.NoQueuePageSubject.value);
  }

  OnOffLinePageOtherControlsSelection() {
    this.ResetOffLinePageControlSelection();
    this.OffLinePageSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.OffLinePageSubject.next(this.OffLinePageSubject.value);
  }

  ResetWelcomePageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.WelcomePageSubject.value.controlSelection
    )) {
      this.WelcomePageSubject.value.controlSelection[propertyKey] = false;
    }
  }

  ResetNoQueuePageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.NoQueuePageSubject.value.controlSelection
    )) {
      this.NoQueuePageSubject.value.controlSelection[propertyKey] = false;
    }
  }

  ResetOffLinePageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.OffLinePageSubject.value.controlSelection
    )) {
      this.OffLinePageSubject.value.controlSelection[propertyKey] = false;
    }
  }

  OnGlobalQuestionPageButtonSelection() {
    this.ResetGlobalQuestionPageControlSelection();
    this.KioskGlobalQuestionPageSubject.value.controlSelection.IsButtonSelected =
      true;
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskGlobalQuestionPageSubject.value
    );
  }

  OnGlobalQuestionPageDefaultControlSelection() {
    this.ResetGlobalQuestionPageControlSelection();
    this.KioskGlobalQuestionPageSubject.value.controlSelection.IsPanelSelected =
      true;
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskGlobalQuestionPageSubject.value
    );
  }

  OnGlobalQuestionPageOtherControlsSelection() {
    this.ResetGlobalQuestionPageControlSelection();
    this.KioskGlobalQuestionPageSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.KioskGlobalQuestionPageSubject.next(
      this.KioskGlobalQuestionPageSubject.value
    );
  }

  ResetGlobalQuestionPageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.KioskGlobalQuestionPageSubject.value.controlSelection
    )) {
      this.KioskGlobalQuestionPageSubject.value.controlSelection[propertyKey] =
        false;
    }
  }

  OnServiceQuestionPageButtonSelection() {
    this.ResetServiceQuestionPageControlSelection();
    this.KioskServiceQuestionSubject.value.controlSelection.IsButtonSelected =
      true;
    this.KioskServiceQuestionSubject.next(
      this.KioskServiceQuestionSubject.value
    );
  }

  OnServiceQuestionPageDefaultControlSelection() {
    this.ResetServiceQuestionPageControlSelection();
    this.KioskServiceQuestionSubject.value.controlSelection.IsPanelSelected =
      true;
    this.KioskServiceQuestionSubject.next(
      this.KioskServiceQuestionSubject.value
    );
  }

  OnServiceQuestionPageOtherControlsSelection() {
    this.ResetServiceQuestionPageControlSelection();
    this.KioskServiceQuestionSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.KioskServiceQuestionSubject.next(
      this.KioskServiceQuestionSubject.value
    );
  }

  ResetServiceQuestionPageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.KioskServiceQuestionSubject.value.controlSelection
    )) {
      this.KioskServiceQuestionSubject.value.controlSelection[propertyKey] =
        false;
    }
  }

  OnServicePageButtonSelection() {
    this.ResetServicePageControlSelection();
    this.KioskServiceSubject.value.controlSelection.IsButtonSelected = true;
    this.KioskServiceSubject.next(this.KioskServiceSubject.value);
  }

  OnServicePageDefaultControlSelection() {
    this.ResetServicePageControlSelection();
    this.KioskServiceSubject.value.controlSelection.IsPanelSelected = true;
    this.KioskServiceSubject.next(this.KioskServiceSubject.value);
  }

  OnServicePageOtherControlsSelection() {
    this.ResetServicePageControlSelection();
    this.KioskServiceSubject.value.controlSelection.IsOtherControlsSelected =
      true;
    this.KioskServiceSubject.next(this.KioskServiceSubject.value);
  }

  ResetServicePageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.KioskServiceSubject.value.controlSelection
    )) {
      this.KioskServiceSubject.value.controlSelection[propertyKey] = false;
    }
  }

  OnThankYouPageButtonSelection() {
    this.ResetThankYouPageControlSelection();
    this.ThankYouSubject.value.controlSelection.IsButtonSelected = true;
    this.ThankYouSubject.next(this.ThankYouSubject.value);
  }

  OnThankYouPageDefaultControlSelection() {
    this.ResetThankYouPageControlSelection();
    this.ThankYouSubject.value.controlSelection.IsPanelSelected = true;
    this.ThankYouSubject.next(this.ThankYouSubject.value);
  }

  OnThankYouPageOtherControlsSelection() {
    this.ResetThankYouPageControlSelection();
    this.ThankYouSubject.value.controlSelection.IsOtherControlsSelected = true;
    this.ThankYouSubject.next(this.ThankYouSubject.value);
  }

  ResetThankYouPageControlSelection() {
    for (const [propertyKey, propertyValue] of Object.entries(
      this.ThankYouSubject.value.controlSelection
    )) {
      this.ThankYouSubject.value.controlSelection[propertyKey] = false;
    }
  }
  //#endregion

  ConvertTranslatedLanguageArrayToObject(arr) {
    const obj = {};
    for (const element of arr) {
      obj[element.languageId] = element.translatedText;
    }
    return obj;
  }

  ObjectIsEmpty(object) {
    for (const key in object) {
      if (key) {
        return false;
      }
    }
    return true;
  }

}

interface IDefaultData {
  serviceId: string;
  serviceBGColor: string;
  serviceColor: string;
  serviceNAme: any;
  name: string;
  isItemSelected?: boolean;
  isVisible: boolean;
  font: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number | string;
  serviceIcon?: object;
}


