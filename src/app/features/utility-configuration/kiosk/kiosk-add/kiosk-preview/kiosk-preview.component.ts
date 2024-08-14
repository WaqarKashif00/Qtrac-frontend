import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import Keyboard from 'simple-keyboard';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import {
  IndexDBLayoutDataKeys,
  IndexDBStoreNames,
} from 'src/app/models/constants/index-db.constant';
import { KioskPageName } from 'src/app/models/enums/kiosk-page-name.enum';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { RoutingType } from 'src/app/models/enums/route-type.enum';
import {
  RulesDocument,
  RulesDocumentReference,
} from 'src/app/shared/api-models/dynamic-processor/conditional-route-request';
import { ConditionalRoutingResponseTypes } from 'src/app/shared/api-models/dynamic-processor/conditional-routing-response-type';
import { DynamicRuleProcessorAPIService } from 'src/app/shared/api-services/dynamic-rule-processor-api.service';
import { ILanguageDropdownList } from '../../../../../models/common/language-dropdownlist.interface';
import { HideAppBtnIfAppNotExist } from '../../../template-shared/utilities';
import { KeyboardVirtualService } from '../../keyboard-virtual.service';
import { Mode } from '../kiosk-layout/Models/controls/service-panel.control';
import {
  IKioskLayoutData,
  IKioskPreServiceQuestionPageData,
  IKioskServicePageData,
  IKioskServiceQuestionPageData,
  IWorkFlowDetail,
  IWorkFlowQuestionData,
  IWorkFlowServiceData,
  IWorkFlowServiceQuestionConditionRoute,
  IWorkFlowServiceRoute,
} from '../kiosk-layout/Models/kiosk-layout-data.interface';
import {
  IKioskButtonControlData,
  IKioskPanelItemsData,
  IKioskPreviewPageData,
  IKioskThankYouPageData,
  IKioskWelcomePageData,
} from '../kiosk-layout/Models/kiosk-preview-data.interface';
import { IPage } from '../kiosk-layout/Models/pages.interface';
@Component({
  selector: 'lavi-kiosk-preview',
  templateUrl: './kiosk-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskPreviewComponent extends AbstractComponent {
  constructor(
    private route: ActivatedRoute,
    private idbService: IndexDBService,
    private changeDetector: ChangeDetectorRef,
    private dynamicRuleProcessorAPIService: DynamicRuleProcessorAPIService,
    private keyboardVirtualService: KeyboardVirtualService
  ) {
    super();
    this.InitializeProperties();
  }

  ngOnInit(): void {
    this.keyboardVirtualService.inputFocus.subscribe((response) => {
      this.onInputFocus(response);
    });

    this.keyboardVirtualService.inputChange.subscribe((response) => {
      this.onInputChange(response);
    });

    this.keyboardVirtualService.isEnableKeyBoard.subscribe((response) => {
      this.enableKeyboard(response);
      
    });
  }

  //#region Simple-Keyboard

  keyboard: Keyboard;
  inputName = 'firstName';

  isEnableKeyboard: boolean = false;
  isNumericKeyBoard: boolean = false;
  isShiftEnable: boolean = false;
  isShiftUsed: boolean = false;

  inputs: { [key: string]: any } = {
    firstName: '',
    //lastName: '',
    // mobile: '',
  };

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      debug: false, // Enable to debug keyboard 
      inputName: this.inputName,
      onChange: (input) => this.onChange(input),
      onKeyPress: (button: any) => this.onKeyPress(button),
      onKeyReleased: (button : any) => this.keyReleased(button),
      tabCharOnTab: false,
      preventMouseDownDefault: true, // If you want to keep focus on input
      disableCaretPositioning: false, //Disables caret positioning, meaning that characters will always be added/removed at the end of the string.
      disableButtonHold: true,  //this option disables the button hold action
      syncInstanceInputs: true, // this option synchronizes the internal input of every simple-keyboard instance.
      layout: {
        default: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          'q w e r t y u i o p',
          '{lock} a s d f g h j k l',
          '{shift} z x c v b n m . {next}',
          '@ {space} .com',
        ],
        shift: [
          '! # _ - ? {bksp}',
          'Q W E R T Y U I O P',
          '{lock} A S D F G H J K L',
          '{shift} Z X C V B N M . {next}',
          '@ {space} .com',
        ],
        numPad: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {next}'],
      },
      display: {
        '{bksp}': 'backspace',
        '{shift}': 'Shift',
        '{lock}': 'Caps',
        '{next}': 'Next',
        '{space}': ' ',
      },
      buttonTheme: [
        {
          class: 'sk-extraButton',
          buttons: '@ .com', 
        }
      ],
    });

    /**
     * Since we have default values for our inputs,
     * we must sync them with simple-keyboard
     */
    this.keyboard.replaceInput(this.inputs);
  }

  onInputFocus = (event: any) => {
    this.inputName = event.target.id;
    this.inputs[event.target.id] = event.target.value;

    this.enableKeyboard(true);

    this.keyboard.setOptions({
      inputName: event.target.id,
    });
    if (event.target.tagName === 'INPUT' && event.target.type === 'number' || event.target.type === 'tel') {
      this.keyboard.setOptions({
        layoutName: 'numPad',
        buttonTheme: [
          {
            class: 'hg-standardBtn',
            buttons: '{bksp} {next}',
          },
          // {
          //   class: 'col-md-3',
          //   buttons: '1 2 3 4 5 6 7 8 9 {bksp} 0 {next}',
          // },
        ],
      });
      this.isNumericKeyBoard = true;
    } else {
      this.keyboard.setOptions({
        layoutName: 'default', buttonTheme: [
          {
          class: 'hg-functionBtn',
          buttons: '{bksp} {next}',
          },
          {
            class: 'sk-extraButton',
            buttons: '@ .com', 
          }, 
        ],
      });
      this.isNumericKeyBoard = false;
    }

    //Scroll to View Element
    this.keyboardVirtualService.scrollToView(event.target.id);

    this.enableKeyboard(true);
  };

  onInputChange = (event: any) => {  
    this.keyboard.setInput(event.target.value, event.target.id);
    this.onChange(event.target.value);
    // this.changeDetector.detectChanges();
  };

  onChange = (input: string) => {
    this.inputs[this.inputName] = input;
    this.keyboardVirtualService.updateInputValue(this.inputName, input);
  };

  onKeyPress = (button: string) => {
    /*** If you want to handle the shift and caps lock buttons ***/
    if (button != '{shift}' && this.isShiftEnable ) {
      this.isShiftEnable = false;
      this.SetDefaultLayout();
    }
    else if (button === '{shift}') this.handleShift(true);
    else if (button === '{lock}') this.handleShift(false);
    else if (button === '{next}') this.handleNext();
    else{
      this.keyboardVirtualService.setInputCaretPosition(this.keyboard, this.inputName, false);
    }
  };

  keyReleased(button : any){
    this.keyboardVirtualService.setInputCaretPosition(this.keyboard, this.inputName, true);
  }

  handleShift(isShift: boolean) {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
    if (isShift)
      this.isShiftEnable = currentLayout === 'default' ? true : false;
  };

  SetDefaultLayout(){
    this.keyboard.setOptions({
      layoutName: 'default',
    });
  };

  handleNext(){
    let options = this.keyboard.getOptions();
    if (options.display?.['{next}'] === 'Done') {
      this.enableKeyboard(false);
    } else {
      this.focusNextElement();
    }
  };

  focusNextElement(){ 
    let nextInputElement: string;
    let elementFoundById: boolean = false;
    let elementsList : NodeListOf<HTMLEmbedElement> = document.querySelectorAll('input, textarea');
    if (elementsList == null) return null;

    for (let i = 0; i < elementsList.length; i++) {
      if ( elementsList[i].type === 'text' ||  elementsList[i].type === 'number' || elementsList[i].type === 'tel' ||  elementsList[i].type === 'textarea' ) {
        if (elementFoundById) {
          nextInputElement = elementsList[i].id;
          break;
        }
        if (elementsList[i].id === this.inputName) {
          elementFoundById = true;
        }
      }
    }

    this.keyboardVirtualService.nextButtonEvent.next(nextInputElement);

  };

  updateKeyBoardDisplay(isDone: Boolean){
    if (isDone) {
      this.keyboard.setOptions({
        display: {
          '{bksp}': 'backspace',
          '{shift}': 'Shift',
          '{lock}': 'Caps',
          '{next}': 'Done',
          '{space}': ' ',
        },
      });
    } else {
      this.keyboard.setOptions({
        display: {
          '{bksp}': 'backspace',
          '{shift}': 'Shift',
          '{lock}': 'Caps',
          '{next}': 'Next',
          '{space}': ' ',
        },
      });
    }
  };

  enableKeyboard(isEnable: boolean){
    //If Allow Touch Screen Keyboard For Users from Designer Screen
    if(this.RefKioskLayoutData?.designerScreen?.enableVirtualKeyboard){
      this.isEnableKeyboard = isEnable;
      this.changeDetector.detectChanges(); 
      if(isEnable){
        let nextElement: boolean = this.IsHaveNextInputElement(this.inputName);
        if (nextElement == null || !nextElement) {
          this.updateKeyBoardDisplay(true);
        } else {
          this.updateKeyBoardDisplay(false);
        }
      }
    }
  };

  IsHaveNextInputElement(inputId: string){
    let isNextInputElement: boolean = false;
    let elementFoundById: boolean = false;
    let elementsList : NodeListOf<HTMLEmbedElement> = document.querySelectorAll('input, textarea');
    if (elementsList == null) return null;

    for (let i = 0; i < elementsList.length; i++) {
      if (
        elementsList[i].type === 'text' ||
        elementsList[i].type === 'number'||
        elementsList[i].type === 'tel'||
        elementsList[i].type === 'textarea'
      ) {
        if (elementFoundById) {
          isNextInputElement = true;
          break;
        }
        if (elementsList[i].id === inputId) {
          elementFoundById = true;
        }
      }
    }
    return isNextInputElement;
  };

  //#endregion

  KioskData;
  KioskWorkFlowData: IWorkFlowDetail;
  KioskLayoutData: IKioskLayoutData;
  RefKioskLayoutData: IKioskLayoutData;
  Languages: ILanguageDropdownList[];
  Page: IPage;
  CurrentPageDetailId: any;
  CurrentLanguageId: string;
  ControlType = [
    QuestionType.DropDown.value,
    QuestionType.MultiSelect.value,
    QuestionType.Options.value,
  ];
  ServiceId: any;
  DefaultLanguage: any;
  CurrentPageIndex = 0;
  CurrentServiceQuestionId: string;

  QuestionSetStack: IWorkFlowServiceRoute[];

  AllServiceQuestionPages: IKioskPreviewPageData[] = [];

  AlreadyCalculated: any[] = [];
  Count = 0;

  async InitializeProperties() {
    this.QuestionSetStack = [];
    this.CurrentLanguageId = this.route.snapshot.queryParams.lng;
    this.DefaultLanguage = this.route.snapshot.queryParams.d_lng;
    await this.SetWorkFlow();
    await this.SetKioskData();
    await this.SetLanguageList();
    this.SetPageVisibility(
      this.Languages.length > 1
        ? KioskPageName.LanguagePage
        : KioskPageName.WelcomePage
    );
    setTimeout(async () => {
      this.KioskData = this.GetInitialKioskPreviewData();
      this.Iterate(this.KioskData);
      this.changeDetector.detectChanges();
    }, 1000);
  }

  private async SetKioskData() {
    this.KioskLayoutData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.KioskLayoutData
    )) as IKioskLayoutData;
    this.RefKioskLayoutData = cloneObject(this.KioskLayoutData);
  }

  private async SetWorkFlow() {
    this.KioskWorkFlowData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.KioskWorkFlowData
    )) as IWorkFlowDetail;
  }

  private async SetLanguageList() {
    this.Languages = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.CompanySupportLanguages
    )) as ILanguageDropdownList[];
    this.DefaultLanguage = this.Languages.find((x) => x.isDefault).languageCode;
    this.CurrentLanguageId = this.DefaultLanguage;
  }

  GetInitialKioskPreviewData() {
    return {
      designer: {
        backGroundImage: this.KioskLayoutData.designerScreen.backGroundImage,
        fontStyle: this.KioskLayoutData.designerScreen.fontStyle,
        fontSize: this.KioskLayoutData.designerScreen.fontSize,
        font: this.KioskLayoutData.designerScreen.font,
        fontWeight: this.KioskLayoutData.designerScreen.fontWeight,
        color: this.KioskLayoutData.designerScreen.color,
        backgroundColor: this.KioskLayoutData.designerScreen.backgroundColor,
        height: this.KioskLayoutData.designerScreen.height,
        WorkFlowId: this.KioskLayoutData.designerScreen.WorkFlowId,
        width: this.KioskLayoutData.designerScreen.width,
        waitingTime: this.KioskLayoutData.designerScreen.waitingTime,
      },
      preServiceQuestionPage: this.GetPreServiceDataOrReturnNull(),
      servicePage: this.GetServiceDataOrReturnNull(),
      serviceQuestion:
        this.SetServiceIdAndSetThankYouOrServiceQuestionPageDataOrReturnNull(),
      thankYouPage:
        this.SetServiceIdAndSetThankYouOrServiceQuestionPageDataOrReturnNull(),
      languagePage: this.GetLanguagePageData(),
      welcomePage: this.GetWelcomePageDataIfOneLanguage(),
      noQueuePage: null,
      offLinePage: null,
    };
  }

  private GetLanguagePageData() {
    if (this.Languages.length > 1) {
      return {
        images: this.KioskLayoutData.languagePage.images,
        labels: this.KioskLayoutData.languagePage.labels,
        videos: this.KioskLayoutData.languagePage.videos,
        sliders: this.KioskLayoutData.languagePage.sliders,
        panel: this.KioskLayoutData.languagePage.panel,
        buttons: null,
      };
    } else {
      return null;
    }
  }

  private GetWelcomePageDataIfOneLanguage() {
    if (this.IsOnlyOneLanguage() && !this.HideWelcomePage()) {
      return this.WelcomePageData();
    } else {
      return null;
    }
  }

  private GetPreServiceDataOrReturnNull() {
    if (
      this.IsOnlyOneLanguage() &&
      this.HideWelcomePage() &&
      this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
      (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' ||
        (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'after' &&
          this.IsServicePageSkipOrNot())) &&
      this.Count === 0
    ) {
      this.Count++;
      this.SetPageVisibility(KioskPageName.PreServiceQuestionPage);
      return this.PreServicePageData();
    }
    return null;
  }

  private GetServiceDataOrReturnNull() {
    if (
      this.IsOnlyOneLanguage() &&
      this.HideWelcomePage() &&
      !this.IsServicePageSkipOrNot() &&
      this.Count === 0
    ) {
      this.Count++;
      this.SetPageVisibility(KioskPageName.ServicePage);
      return this.ServicePageData();
    }
    return null;
  }

  private IsOnlyOneLanguage() {
    return this.Languages.length === 1;
  }

  private HideWelcomePage() {
    return this.KioskLayoutData.pageProperties.hideWelcomePage;
  }

  private SetServiceIdAndSetThankYouOrServiceQuestionPageDataOrReturnNull() {
    if (
      this.IsOnlyOneLanguage() &&
      this.HideWelcomePage() &&
      this.Count === 0
    ) {
      this.Count++;
      this.SetServiceId();
      this.SetThankYouPageOrServiceQuestionPageData();
    }
    return null;
  }

  SetThankYouPageOrServiceQuestionPageData() {
    const serviceRouting = this.KioskWorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.CurrentPageDetailId)
    ).routing;
    if (serviceRouting.group === RoutingType.Queue) {
      this.SetPageVisibility(KioskPageName.ThankYouPage);
      return this.GetThankYouPageData();
    } else if (serviceRouting.group === RoutingType.Questions) {
      this.AllServiceQuestionPages = this.AllServiceQuestionPages.filter(
        (x) => !(x.id == this.KioskData.serviceQuestion.id)
      ).concat(this.KioskData.serviceQuestion);

      this.QuestionSetStack.push(serviceRouting);
      this.SetPageVisibility(KioskPageName.ServiceQuestionPage);
      return this.GetServiceQuestionData(serviceRouting);
    }
  }

  ConsoleLog() {
    console.log(this.KioskData);
  }

  Init() {}

  ShowNextPage(data) {
    if (typeof data === 'string') {
      this.CurrentPageDetailId = data;
    }
    if (this.Page.IsWelcomePage) {
      this.RedirectFromWelcomePage();
    } else if (this.Page.IsLanguagePage) {
      this.CurrentLanguageId = this.CurrentPageDetailId;
      this.CurrentPageDetailId = null;
      this.RedirectFromLanguagePage();
    } else if (this.Page.IsPreServiceQuestionPage) {
      this.RedirectFromPreServiceQuestionPage();
    } else if (this.Page.IsServicePage) {
      this.ServiceId =
        this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName
          ? null
          : this.CurrentPageDetailId;
      this.RedirectFromServicePage();
      this.CurrentPageDetailId = null;
    } else if (this.Page.IsServiceQuestionPage) {
      this.CurrentServiceQuestionId =
        this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName
          ? null
          : this.CurrentPageDetailId;
      this.RedirectFromServiceQuestionPage();
      this.CurrentPageDetailId = null;
    } else if (this.Page.IsThankYouPage) {
      this.RedirectFromThankYouPage();
    }
    this.CurrentPageDetailId = null;
  }

  RedirectFromLanguagePage() {
    if (!this.HideWelcomePage()) {
      this.SetPageVisibility(KioskPageName.WelcomePage);
      this.GetWelcomePageData();
      this.Iterate(this.KioskData.welcomePage);
    } else {
      this.RedirectFromWelcomePage();
    }
  }

  private GetWelcomePageData() {
    this.KioskData.welcomePage = this.WelcomePageData();
  }

  private WelcomePageData(): IKioskWelcomePageData {
    return {
      images: this.KioskLayoutData.welcomePage.images,
      labels: this.KioskLayoutData.welcomePage.labels,
      videos: this.KioskLayoutData.welcomePage.videos,
      sliders: this.KioskLayoutData.welcomePage.sliders,
      buttons: this.GetWelcomePageButtons(),
    };
  }

  private GetNoQueuePageData() {
    this.KioskData.noQueuePage = this.NoQueuePageData();
  }

  private NoQueuePageData() {
    return {
      images: this.KioskLayoutData.noQueuePage.images,
      labels: this.KioskLayoutData.noQueuePage.labels,
      videos: this.KioskLayoutData.noQueuePage.videos,
      sliders: this.KioskLayoutData.noQueuePage.sliders,
      buttons: this.KioskLayoutData.noQueuePage.buttons,
    };
  }

  private GetOffLinePageData() {
    this.KioskData.offLinePage = this.OffLinePageData();
  }

  private OffLinePageData() {
    return {
      images: this.KioskLayoutData.offLinePage.images,
      labels: this.KioskLayoutData.offLinePage.labels,
      videos: this.KioskLayoutData.offLinePage.videos,
      sliders: this.KioskLayoutData.offLinePage.sliders,
      buttons: this.KioskLayoutData.offLinePage.buttons,
    };
  }

  private GetWelcomePageButtons(): IKioskButtonControlData[] {
    if (this.IsOnlyOneLanguage()) {
      return (this.KioskLayoutData.welcomePage.buttons =
        this.KioskLayoutData.welcomePage.buttons.filter(
          (x) => x.name === DefaultButtonsNames.NextButtonName
        ));
    } else {
      return this.KioskLayoutData.welcomePage.buttons;
    }
  }

  RedirectFromWelcomePage() {
    if (this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName) {
      this.RedirectToLanguagePage();
    } else {
      this.RedirectFromWelcomePageOnWorkflowSetting();
    }
  }

  private RedirectFromWelcomePageOnWorkflowSetting() {
    if (
      this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
      this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before'
    ) {
      this.RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue();
    } else {
      this.SkipServicePageIfOnlyOneService();
    }
  }

  private SkipServicePageIfOnlyOneService() {
    if (!this.IsServicePageSkipOrNot()) {
      this.RedirectToServicePageIfDisplayPreserviceQuestionIsFalse();
    } else {
      this.SetServiceId();
      this.RedirectFromServicePageOnWorkflowSetting();
    }
  }

  private IsNoAppointmentAcceptInService() {
    let IsNoAppointmentAcceptInService = true;
    this.KioskLayoutData.servicePage.services.forEach((item) => {
      if (
        this.KioskWorkFlowData.services.find(
          (service) => service.id === item.questionId
        ).acceptAppointments
      ) {
        IsNoAppointmentAcceptInService = false;
      }
    });
    return IsNoAppointmentAcceptInService;
  }

  private IsServicePageSkipOrNot() {
    let IsSkip = false;
    const selectedServices = this.KioskLayoutData.servicePage.services.filter(
      (x) => x.isItemSelected
    );
    if (selectedServices.length != 1) {
      return IsSkip;
    }
    if (!this.IsNoAppointmentAcceptInService()) {
      if (
        this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
        this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'before'
      ) {
        IsSkip = true;
      } else {
        IsSkip = false;
      }
    } else {
      IsSkip = true;
    }
    return IsSkip;
  }

  private SetServiceId() {
    this.ServiceId = this.KioskLayoutData.servicePage.services[0].questionId;
  }

  RedirectToLanguagePage() {
    this.SetPageVisibility(KioskPageName.LanguagePage);
    this.GetLanguagePageData();
  }

  private GetServiceQuestionItems(
    ServiceQuestion: IKioskServiceQuestionPageData,
    workFlowQuestions: IWorkFlowQuestionData[],
    questionId: string
  ): IKioskPanelItemsData[] {
    const items: IKioskPanelItemsData[] = [];
    ServiceQuestion.questionSet
      .find((x) => x.questionSetId === questionId)
      .questions.forEach((x) => {
        if (workFlowQuestions.find((m) => m.id === x.questionId)) {
          const type = workFlowQuestions.find(
            (m) => m.id === x.questionId
          ).type;
          const itemTypeSettings = [];
          if (this.ControlType.some((questionType) => questionType === type)) {
            workFlowQuestions
              .find((m) => m.id === x.questionId)
              .typeSetting.forEach((element) => {
                itemTypeSettings.push(
                  this.GetElementWithSpecificSelectedOrDefaultLanguage(element)
                    ?.option
                );
              });
          }
          items.push({
            required: workFlowQuestions.find((m) => m.id === x.questionId)
              .isRequired,
            answer: this.GetAnswerOfServiceQuestionIfPresent(x.questionId),
            backgroundColor: x.backgroundColor,
            color: x.color,
            font: x.font,
            fontSize: x.fontSize,
            fontStyle: x.fontStyle,
            fontWeight: x.fontWeight,
            itemId: workFlowQuestions.find((m) => m.id === x.questionId).id,
            selected: workFlowQuestions.find((m) => m.id === x.questionId)
              .isVisible,
            isVisible: x.isVisible,
            itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
              workFlowQuestions.find((m) => m.id === x.questionId).question
            )?.question,
            itemType: type,
            itemTypeSetting: this.ControlType.some(
              (questionType) => questionType === type
            )
              ? itemTypeSettings
              : workFlowQuestions.find((m) => m.id === x.questionId)
                  .typeSetting,
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
        (lang) => lang.languageId === this.DefaultLanguage
      );
    }
    return current_element ? current_element : [];
  }

  private GetServiceQuestionButtons(
    buttonList: IKioskButtonControlData[],
    serviceRouting: IWorkFlowServiceRoute
  ) {
    // disable enable buttons based on page : if required
    return buttonList;
  }

  RedirectFromPreServiceQuestionPage() {
    if (this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName) {
      this.RedirectToServiceOrWelcomePageOnBackButton();
    } else {
      this.RedirectFromPreServiceQuestionPageOnNextButton();
    }
  }

  private RedirectToServiceOrWelcomePageOnBackButton() {
    if (this.HideWelcomePage() && !this.IsOnlyOneLanguage()) {
      this.RedirectToLanguagePage();
    } else if (
      this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' ||
      (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after' &&
        this.IsServicePageSkipOrNot())
    ) {
      this.SetPageVisibility(KioskPageName.WelcomePage);
      this.GetWelcomePageData();
      this.Iterate(this.KioskData.welcomePage);
    } else {
      this.SetPageVisibility(KioskPageName.ServicePage);
      this.GetServicePageData();
    }
  }

  private RedirectFromPreServiceQuestionPageOnNextButton() {
    if (
      this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' &&
      !this.IsServicePageSkipOrNot()
    ) {
      this.SetPageVisibility(KioskPageName.ServicePage);
      this.GetServicePageData();
      this.Iterate(this.KioskData.servicePage);
    } else {
      this.SetServiceIdIfOnlyOneService();
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  private SetServiceIdIfOnlyOneService() {
    if (this.IsServicePageSkipOrNot()) {
      this.SetServiceId();
    }
  }

  private GetServicePageData() {
    this.KioskLayoutData.servicePage.buttons = HideAppBtnIfAppNotExist(
      this.KioskLayoutData.servicePage.buttons,
      this.KioskWorkFlowData.appointmentTemplates
    );
    this.KioskData.servicePage = this.ServicePageData();
  }

  private GetServicesItems(
    ServicePage: IKioskServicePageData,
    workFlowServices: IWorkFlowServiceData[]
  ): IKioskPanelItemsData[] {
    const items: IKioskPanelItemsData[] = [];
    ServicePage.services.forEach((x) => {
      if (workFlowServices.find((m) => m.id === x.questionId)) {
        items.push({
          required: false,
          answer: '',
          backgroundColor: x.backgroundColor,
          color: x.color,
          font: x.font,
          fontSize: x.fontSize,
          fontStyle: x.fontStyle,
          fontWeight: x.fontWeight,
          itemId: x.questionId,
          selected: x.isItemSelected,
          isVisible: x.isVisible,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
            workFlowServices.find((m) => m.id === x.questionId).serviceNames
          )?.serviceName,
          itemType: null,
          itemTypeSetting: null,
          itemIcon: this.GetElementWithSpecificSelectedOrDefaultLanguage(
            workFlowServices.find((m) => m.id === x.questionId)?.serviceIconUrls
          ).url,
        });
      }
    });
    return items;
  }

  RedirectFromServicePage() {
    if (this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName) {
      this.RedirectToWelcomeOrPreServiceQuestionPage();
    } else {
      this.RedirectFromServicePageOnWorkflowSetting();
    }
  }

  private RedirectFromServicePageOnWorkflowSetting() {
    if (
      this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
      this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'after'
    ) {
      this.RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue();
    } else {
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  RedirectToWelcomeOrPreServiceQuestionPage() {
    if (
      this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
      this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before'
    ) {
      this.SetPageVisibility(KioskPageName.PreServiceQuestionPage);
      this.GetPreServicePageData();
    } else {
      if (this.HideWelcomePage()) {
        this.RedirectToLanguagePage();
      } else {
        this.SetPageVisibility(KioskPageName.WelcomePage);
        this.GetWelcomePageData();
        this.Iterate(this.KioskData.welcomePage);
      }
    }
  }

  RedirectToPreserviceQuestionPageIfDisplayPreserviceQuestionIsTrue() {
    this.SetPageVisibility(KioskPageName.PreServiceQuestionPage);
    this.GetPreServicePageData();
    this.Iterate(this.KioskData.preServiceQuestionPage);
  }

  private GetPreServicePageData() {
    this.KioskData.preServiceQuestionPage = this.PreServicePageData();
  }

  private PreServicePageData() {
    this.KioskLayoutData.preServiceQuestionPage.buttons =
      HideAppBtnIfAppNotExist(
        this.KioskLayoutData.preServiceQuestionPage.buttons,
        this.KioskWorkFlowData.appointmentTemplates
      );
    if (
      !(
        this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
        this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'before'
      ) ||
      this.IsNoAppointmentAcceptInService()
    ) {
      this.KioskLayoutData.preServiceQuestionPage.buttons =
        this.KioskLayoutData.preServiceQuestionPage.buttons.filter(
          (x) => x.name !== DefaultButtonsNames.AppointmentButtonName
        );
    }
    return {
      id: null,
      images: this.KioskLayoutData.preServiceQuestionPage.images,
      labels: this.KioskLayoutData.preServiceQuestionPage.labels,
      sliders: this.KioskLayoutData.preServiceQuestionPage.sliders,
      panel: this.KioskLayoutData.preServiceQuestionPage.panel,
      videos: this.KioskLayoutData.preServiceQuestionPage.videos,
      buttons: this.GetPreServiceButtons(),
      items: this.GetPreServiceQuestionItems(
        this.KioskLayoutData.preServiceQuestionPage,
        this.KioskWorkFlowData.preServiceQuestions
      ),
    };
  }

  private GetPreServiceButtons() {
    if (
      this.IsOnlyOneLanguage() &&
      this.HideWelcomePage() &&
      (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' ||
        (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'after' &&
          this.IsServicePageSkipOrNot()))
    ) {
      this.KioskLayoutData.preServiceQuestionPage.buttons =
        this.KioskLayoutData.preServiceQuestionPage.buttons.filter(
          (x) => x.name !== DefaultButtonsNames.BackButtonName
        );
    }
    return this.KioskLayoutData.preServiceQuestionPage.buttons;
  }

  RedirectToServiceQuestionPageORQueuesAfterCheckingConditon() {
    const serviceRouting = this.KioskWorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.CurrentPageDetailId)
    ).routing;

    this.RedirectToServiceQuestionORQueuePage(serviceRouting);
  }

  RedirectFromServiceQuestionPage() {
    if (this.CurrentPageDetailId === DefaultButtonsNames.BackButtonName) {
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

    this.RedirectFromServiceQuestionPageOnWorkflowSetting();
  }

  private RedirectToPreServiceOrServicePage() {
    if (
      (this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
        this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'after') ||
      (this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
        'before' &&
        this.IsServicePageSkipOrNot())
    ) {
      this.SetPageVisibility(KioskPageName.PreServiceQuestionPage);
      this.GetPreServicePageData();
    } else {
      this.SkipServicePageIfOneService();
    }
  }

  private SkipServicePageIfOneService() {
    if (
      !this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
      this.IsServicePageSkipOrNot()
    ) {
      this.SetPageVisibility(KioskPageName.WelcomePage);
      this.GetWelcomePageData();
    } else {
      this.SetPageVisibility(KioskPageName.ServicePage);
      this.GetServicePageData();
    }
  }

  private RedirectFromServiceQuestionPageOnWorkflowSetting() {
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
          const queueId = response.queueId;
          // API call for post requests in execution
          this.ReDirectToThankYouPage();
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
        }
        if (response.responseType == ConditionalRoutingResponseTypes.NoQueue) {
          this.SetPageVisibility(KioskPageName.NoQueuePage);
          this.GetNoQueuePageData();
          this.Iterate(this.KioskData.noQueuePage);
        }
      });
  }

  CalculateDefaultRoute() {
    const serviceQuestionSet = this.KioskWorkFlowData.questionSets.find(
      (x) =>
        x.id === (this.CurrentServiceQuestionId || this.CurrentPageDetailId)
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
        workflowId: this.KioskWorkFlowData.workFlowId,
        serviceQuestions,
        serviceId: this.ServiceId,
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
      AllAnsweredQuestions = AllAnsweredQuestions.concat(
        ServiceQuestionPage.items
      );
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
      pk: this.KioskWorkFlowData.companyId,
      id: this.KioskWorkFlowData.workFlowId,
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

  ReDirectToThankYouPage() {
    this.SetPageVisibility(KioskPageName.ThankYouPage);
    this.KioskData.thankYouPage = this.GetThankYouPageData();
    this.Iterate(this.KioskData.thankYouPage);
  }

  private GetThankYouPageData(): IKioskThankYouPageData {
    return {
      images: this.KioskLayoutData.thankYouPage.images,
      labels: this.KioskLayoutData.thankYouPage.labels,
      sliders: this.KioskLayoutData.thankYouPage.sliders,
      videos: this.KioskLayoutData.thankYouPage.videos,
      buttons: this.KioskLayoutData.thankYouPage.buttons,
      thankYouControl: {
        items: this.KioskLayoutData.thankYouPage.panel.items,
        primaryColor: this.KioskLayoutData.thankYouPage.panel.primaryColor,
        secondaryColor: this.KioskLayoutData.thankYouPage.panel.secondaryColor,
        backgroundColor:
          this.KioskLayoutData.thankYouPage.panel.backgroundColor,
        horizontalPadding:
          this.KioskLayoutData.thankYouPage.panel.horizontalPadding,
        verticalPadding:
          this.KioskLayoutData.thankYouPage.panel.verticalPadding,
        messageDisplayTimeInSeconds:
          this.KioskLayoutData.thankYouPage.panel.messageDisplayTimeInSeconds,
        itemBackgroundColor:
          this.KioskLayoutData.thankYouPage.panel.itemBackgroundColor,
        fontSize: this.KioskLayoutData.thankYouPage.panel.fontSize,
        fontStyle: this.KioskLayoutData.thankYouPage.panel.fontStyle,
        height: this.KioskLayoutData.thankYouPage.panel.height,
        font: this.KioskLayoutData.thankYouPage.panel.font,
        fontWeight: this.KioskLayoutData.thankYouPage.panel.fontWeight,
        left: this.KioskLayoutData.thankYouPage.panel.left,
        width: this.KioskLayoutData.thankYouPage.panel.width,
        top: this.KioskLayoutData.thankYouPage.panel.top,
      },
    };
  }

  private RedirectToServiceQuestionORQueuePage(
    serviceRouting: IWorkFlowServiceRoute
  ) {
    if (serviceRouting.group === RoutingType.Queue) {
      // Need to do an api call for ticket
      this.ReDirectToThankYouPage();
    } else if (serviceRouting.group === RoutingType.Questions) {
      this.RedirectToServiceQuestionPage(serviceRouting);
    }
  }

  RedirectToServiceQuestionPage(serviceRouting: IWorkFlowServiceRoute) {
    this.SetPageVisibility(KioskPageName.ServiceQuestionPage);

    this.KioskData.serviceQuestion =
      this.GetServiceQuestionData(serviceRouting);

    this.AllServiceQuestionPages = this.AllServiceQuestionPages.filter(
      (x) => !(x.id == this.KioskData.serviceQuestion.id)
    ).concat(this.KioskData.serviceQuestion);

    this.QuestionSetStack.push(serviceRouting);
    this.Iterate(this.KioskData.serviceQuestion);
  }

  private GetServiceQuestionData(serviceRouting: IWorkFlowServiceRoute) {
    return {
      id: serviceRouting.id,
      images: this.KioskLayoutData.serviceQuestion.images,
      labels: this.KioskLayoutData.serviceQuestion.labels,
      panel: this.KioskLayoutData.serviceQuestion.panel,
      videos: this.KioskLayoutData.serviceQuestion.videos,
      sliders: this.KioskLayoutData.serviceQuestion.sliders,
      buttons: this.KioskLayoutData.serviceQuestion.buttons,
      items: this.GetServiceQuestionItems(
        this.KioskLayoutData.serviceQuestion,
        this.KioskWorkFlowData.questionSets.find(
          (x) => x.id === serviceRouting.id
        ).questions,
        serviceRouting.id
      ),
    };
  }

  RedirectToServicePageIfDisplayPreserviceQuestionIsFalse() {
    this.SetPageVisibility(KioskPageName.ServicePage);
    this.KioskData.servicePage = this.ServicePageData();
    this.Iterate(this.KioskData.servicePage);
  }

  private ServicePageData() {
    this.KioskLayoutData.servicePage.buttons = HideAppBtnIfAppNotExist(
      this.KioskLayoutData.servicePage.buttons,
      this.KioskWorkFlowData.appointmentTemplates
    );
    if (
      (this.KioskWorkFlowData.setting.enablePreServiceQuestions &&
        this.KioskWorkFlowData.setting.displayPreServiceQuestions.toLowerCase() ===
          'before') ||
      this.IsNoAppointmentAcceptInService()
    ) {
      this.KioskLayoutData.servicePage.buttons =
        this.KioskLayoutData.servicePage.buttons.filter(
          (x) => x.name !== DefaultButtonsNames.AppointmentButtonName
        );
    }
    return {
      id: null,
      images: this.KioskLayoutData.servicePage.images,
      sliders: this.KioskLayoutData.servicePage.sliders,
      labels: this.KioskLayoutData.servicePage.labels,
      videos: this.KioskLayoutData.servicePage.videos,
      panel: this.KioskLayoutData.servicePage.panel,
      buttons: this.ServicePageButtons(),
      items: this.GetServicesItems(
        this.KioskLayoutData.servicePage,
        this.KioskWorkFlowData.services
      ),
    };
  }

  private ServicePageButtons() {
    if (this.HideWelcomePage() && this.IsOnlyOneLanguage()) {
      this.KioskLayoutData.servicePage.buttons =
        this.KioskLayoutData.servicePage.buttons.filter(
          (x) => x.name !== DefaultButtonsNames.BackButtonName
        );
    }
    return this.KioskLayoutData.servicePage.buttons;
  }

  private GetPreServiceQuestionItems(
    PreServiceQuestionPage: IKioskPreServiceQuestionPageData,
    workFlowQuestions: IWorkFlowQuestionData[]
  ): IKioskPanelItemsData[] {
    const items: IKioskPanelItemsData[] = [];
    PreServiceQuestionPage.questions.forEach((x) => {
      if (workFlowQuestions.find((m) => m.id === x.questionId)) {
        const type = workFlowQuestions.find((m) => m.id === x.questionId).type;
        const itemTypeSettings = [];
        if (this.ControlType.some((questionType) => questionType === type)) {
          workFlowQuestions
            .find((m) => m.id === x.questionId)
            .typeSetting.forEach((element) => {
              itemTypeSettings.push(
                this.GetElementWithSpecificSelectedOrDefaultLanguage(element)
                  ?.option
              );
            });
        }
        items.push({
          required: workFlowQuestions.find((m) => m.id === x.questionId)
            .isRequired,
          answer: this.GetAnswerOfPreServiceQuestionIfPresent(x.questionId),
          backgroundColor: x.backgroundColor,
          color: x.color,
          font: x.font,
          fontSize: x.fontSize,
          fontStyle: x.fontStyle,
          fontWeight: x.fontWeight,
          itemId: workFlowQuestions.find((m) => m.id === x.questionId).id,
          selected: workFlowQuestions.find((m) => m.id === x.questionId)
            .isVisible,
          isVisible: x.isVisible,
          itemText: this.GetElementWithSpecificSelectedOrDefaultLanguage(
            workFlowQuestions.find((m) => m.id === x.questionId).question
          )?.question,
          itemType: type,
          itemTypeSetting: this.ControlType.some(
            (questionType) => questionType === type
          )
            ? itemTypeSettings
            : workFlowQuestions.find((m) => m.id === x.questionId).typeSetting,
        });
      }
    });
    if (
      items.length !== 0 &&
      PreServiceQuestionPage.panel.questionDisplayMode === Mode.Single
    ) {
      items.map((x) => (x.selected = false));
      items[0].selected = true;
    }
    return items;
  }

  GetAnswerOfPreServiceQuestionIfPresent(questionId: string): any {
    if (
      this.KioskData &&
      this.KioskData.preServiceQuestionPage &&
      this.KioskData.preServiceQuestionPage.items &&
      this.KioskData.preServiceQuestionPage.items.length > 0
    ) {
      const question = this.KioskData.preServiceQuestionPage.items.find(
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
        AllAnsweredQuestions = AllAnsweredQuestions.concat(
          ServiceQuestionPage.items
        );
      }
      const question = AllAnsweredQuestions.find((x) => x.itemId == questionId);
      return question?.answer;
    }
    return '';
  }

  RedirectFromThankYouPage() {
    window.location.reload();
  }

  private RedirectToServiceOrServiceQuestionPAgeFromThankYouPage() {
    const serviceRouting = this.KioskWorkFlowData.services.find(
      (x) => x.id === (this.ServiceId || this.CurrentPageDetailId)
    ).routing;
    if (serviceRouting.group === RoutingType.Queue) {
      this.SetPageVisibility(KioskPageName.ServicePage);
      this.GetServicePageData();
    } else {
      this.SetPageVisibility(KioskPageName.ServiceQuestionPage);
      this.RedirectToServiceQuestionPageORQueuesAfterCheckingConditon();
    }
  }

  /* #region  Reusable Function */

  SetPageVisibility(pageIndex) {
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
      IsOffLinePage: pageIndex === KioskPageName.OffLinePage,
    };
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
  };

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
  /* #endregion */

  ExitButton() {
    window.location.reload();
  }
}

const DefaultButtonsNames = {
  BackButtonName: 'Back Button',
  FinishButtonName: 'Finish Button',
  NextButtonName: 'Next Button',
  AppointmentButtonName: 'Appointment Button',
};
