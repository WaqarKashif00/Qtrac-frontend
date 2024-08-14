import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMoveEvent } from '../../Models/move-event.interface';
import { ServiceBoxControl } from '../../Models/controls/service-box.control';
import {
  ServicePanelControl,
  Mode,
} from '../../Models/controls/service-panel.control';
import { Observable, BehaviorSubject } from 'rxjs';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { KioskLayoutService } from '../../kiosk-layout.service';
import { ServiceDDL } from '../../Models/servies-drop-down.interface';
import { IQuestionSet } from '../../Models/question-set.interface';
import { ButtonControl } from '../../Models/controls/button.control';
import { FormArray } from '@angular/forms';
import { ISupportedLanguage } from '../../Models/supported-language.interface';
import { TranslateService } from 'src/app/core/services/translate.service';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { requiredFileType } from '../../../../../../../shared/validators/common.validator';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { cloneObject, GetDefaultIfNegativeOrNull, RoundOffProperty } from 'src/app/core/utilities/core-utilities';
import { IWorkFlowDetail } from '../../Models/kiosk-layout-data.interface';
import { IControlSelection } from '../../Models/controls-selection.interface';

@Injectable()
export class PreServiceQuestionService extends AbstractComponentService {

  private PreServiceQuestionBoxItemsSubject: BehaviorSubject<
    Array<ServiceBoxControl>
  >;
  PreServiceQuestionBoxItems$: Observable<Array<ServiceBoxControl>>;
  private PreServiceQuestionPanelSubject: BehaviorSubject<ServicePanelControl>;
  PreServiceQuestionPanel$: Observable<ServicePanelControl>;
  private PreServiceQuestionControlListSubject: BehaviorSubject<
    Array<ServiceDDL>
  >;
  PreServiceQuestionControlList$: Observable<Array<ServiceDDL>>;
  private PreServiceQuestionQuestionSetSubject: BehaviorSubject<
    Array<IQuestionSet>
  >;
  PreServiceQuestionQuestionSet$: Observable<Array<IQuestionSet>>;
  private ButtonsListSubject: BehaviorSubject<ButtonControl[]>;
  ButtonsList$: Observable<ButtonControl[]>;
  private ButtonTextFormArraySubject: BehaviorSubject<FormArray>;
  ButtonTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  Languages: ISupportedLanguage[];
  private ButtonTranslateModalTitleSubject: BehaviorSubject<string>;
  ButtonTranslateModalTitle$: Observable<string>;

  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;

  ButtonsList: any;
  PreServiceQuestionPanel: ServicePanelControl;
  PreServiceQuestionItems: Array<ServiceBoxControl>;
  PreServiceQuestionControlList: Array<ServiceDDL>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  ButtonTranslatedTexts = {};
  isTranslated = false;
  FinishBtnName = 'Finish Button';

  ButtonStyles = {
    width: 100,
    height: 50,
    left: 700,
    top: 450
  };
  ButtonName: string;
  IsOnlyGrid: boolean = false;
  GridSize: number = 50;
  Workflow: IWorkFlowDetail;


  constructor(
    private layoutService: KioskLayoutService,
    private translateService: TranslateService
  ) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables()
  }
  SubscribeObservables() {
    this.subs.sink = this.layoutService.LanguageList$.subscribe((lang) => {
      this.Languages = lang;
    });
      this.Workflow = this.layoutService.WorkFlow;
    this.subs.sink = this.layoutService.KioskPreServiceQuestion$.subscribe(
      (x) => {
        this.PreServiceQuestionPanel = x.panel;
        this.PreServiceQuestionItems = x.items;
        this.PreServiceQuestionControlList = x.dropDownList;
        this.ButtonsList = x.buttonList;
        this.ButtonName = x.buttonList[0].name;
        this.ShowItemsPropertyWindowById(
          this.PreServiceQuestionControlList[0]?.Id
        );
        this.PreServiceQuestionPanelSubject.next(this.PreServiceQuestionPanel);
        this.ControlSelectionSubject.next(cloneObject(x.controlSelection))
      }
    );

    this.subs.sink = this.layoutService.IsOnlyGrid$.subscribe(
      (data) => {
        this.IsOnlyGrid = data;
      }
    );
    this.subs.sink = this.layoutService.GridSize$.subscribe(
      (data) => {
        this.GridSize = data;
      }
    );
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.DefaultLanguage$ = this.layoutService.DefaultLanguage$;
    this.PreServiceQuestionBoxItemsSubject = new BehaviorSubject<
      ServiceBoxControl[]
    >([]);
    this.PreServiceQuestionBoxItems$ =
      this.PreServiceQuestionBoxItemsSubject.asObservable();
    this.PreServiceQuestionPanelSubject =
      new BehaviorSubject<ServicePanelControl>(null);
    this.PreServiceQuestionPanel$ =
      this.PreServiceQuestionPanelSubject.asObservable();
    this.PreServiceQuestionControlListSubject = new BehaviorSubject<
      ServiceDDL[]
    >([]);
    this.PreServiceQuestionControlList$ =
      this.PreServiceQuestionControlListSubject.asObservable();
    this.PreServiceQuestionQuestionSetSubject = new BehaviorSubject<
      IQuestionSet[]
    >([]);
    this.PreServiceQuestionQuestionSet$ =
      this.PreServiceQuestionQuestionSetSubject.asObservable();
    this.ButtonsListSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.ButtonsList$ = this.ButtonsListSubject.asObservable();
    this.ButtonTextFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ButtonTextFormArray$ = this.ButtonTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.ButtonTranslateModalTitleSubject = new BehaviorSubject<string>('');
    this.ButtonTranslateModalTitle$ =
      this.ButtonTranslateModalTitleSubject.asObservable();
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonImageFormArray$ = this.ButtonImageFormArraySubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();


  }

  private UpdateButtonSubject() {
    this.ButtonsListSubject.next(Object.create(this.ButtonsList));
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.OnGlobalQuestionPageButtonSelection()

    this.PreServiceQuestionPanelSubject.value.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.width, this.GridSize) : event.size.width);
    this.PreServiceQuestionPanelSubject.value.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.height, this.GridSize) : event.size.height);

    this.PreServiceQuestionPanelSubject.next(this.PreServiceQuestionPanel);
  }

  MoveEnd(event: IMoveEvent) {
    this.layoutService.OnGlobalQuestionPageButtonSelection()
    this.PreServiceQuestionPanel.form.controls.left.setValue(event.x);
    this.PreServiceQuestionPanel.form.controls.top.setValue(event.y);
    this.PreServiceQuestionPanelSubject.next(this.PreServiceQuestionPanel);
  }
  ButtonResizeStop(event: IResizeEvent, name: string) {
    const button = this.GetButton(name);
    const width = event.size.width || this.ButtonStyles.width;
    const height = event.size.height || this.ButtonStyles.height;
    button.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(width, this.GridSize) : width);
    button.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(height, this.GridSize) : height);
    this.SelectAndHighlightButton(button);
    this.UpdateButtonSubject();
  }

  ButtonMoveEnd(event: IMoveEvent, name: string) {
    const button = this.GetButton(name);
    button.form.controls.left.setValue(GetDefaultIfNegativeOrNull(event.x , this.ButtonStyles.left));
    button.form.controls.top.setValue(GetDefaultIfNegativeOrNull(event.y , this.ButtonStyles.top));
    this.SelectAndHighlightButton(button);
    this.UpdateButtonSubject();
  }

  ButtonClick(name: string) {
    this.SelectAndHighlightButton(this.GetButton(name));
    this.UpdateButtonSubject();
  }
  PanelButtonsClick(){
  }

  PanelClicks() {
    this.layoutService.OnGlobalQuestionPageDefaultControlSelection()
  }
  ShowItemsPropertyWindowById(value: string) {
      this.SetPropertyWindow(value);
    this.PreServiceQuestionItems.map((x) => (x.selected = false));
    if (this.PreServiceQuestionPanel.mode === Mode.Single) {
      const propertyControlName = this.PreServiceQuestionControlList.find(
        (x) => x.Id === value
      ).Control.text;
      this.PreServiceQuestionItems.find(
        (x) => x.text === propertyControlName
      ).selected = true;
      this.ButtonsList.map((x) => (x.showButton = true));
      this.ButtonsList[0].showPropertyWindow = false;
      this.ButtonsList[1].showPropertyWindow = true;
    } else {
      this.PreServiceQuestionItems.map((x) => (x.selected = true));
      this.ButtonsList[0].showPropertyWindow = true;
      this.ButtonsList[1].showPropertyWindow = false;
    }
    this.PreServiceQuestionControlListSubject.next(
      this.PreServiceQuestionControlList
    );
    this.UpdateButtonSubject();
    this.PreServiceQuestionBoxItemsSubject.next(this.PreServiceQuestionItems);
  }

  ShowButtonPropertyWindow(btnName: string) {
    this.ButtonName = btnName;
    const button = this.GetButton(btnName);
    this.ButtonsList.forEach(element => {
      element.showPropertyWindow = false;
      element.selected = false;
    });
    button.showPropertyWindow = true;
    button.selected = true;
    this.ButtonsListSubject.next(this.ButtonsList);
  }

  private GetButton(btnName: string) {
    return this.ButtonsList.find(b => b.name === btnName);
  }

  private SetPropertyWindow(value: string) {
    if(this.PreServiceQuestionControlList.length && value){
    this.PreServiceQuestionControlList.map(
      (x) => (x.ShowPropertyWindow = false)
    );
    this.PreServiceQuestionControlList.find(
      (x) => x.Id === value
    ).ShowPropertyWindow = true;
    }
  }

  UpdatePanelData() {
    this.PreServiceQuestionPanelSubject.next(this.PreServiceQuestionPanel);
  }

  UpdateData() {
    this.PreServiceQuestionBoxItemsSubject.next(this.PreServiceQuestionItems);
  }

  UpdateButtonData(Buttons: ButtonControl[]) {
    this.ButtonsListSubject.next(Object.create(Buttons));
  }

  ChangeMode(id: number) {
    this.OpenTranslateDialogSubject.next(false);
    this.PreServiceQuestionItems.map((x) => (x.selected = false));
    this.PreServiceQuestionPanel.mode = id;
    this.ButtonsList.map(x => (x.showButton = true) && (x.showPropertyWindow = false));
    this.ButtonsList.map(b => (b.selected = false));
    this.ButtonsList[0].showPropertyWindow = true;
    this.ButtonsList[0].selected = true;
    if (Number(id) === Mode.Single && this.PreServiceQuestionItems.length > 1) {
      this.PreServiceQuestionItems[0].selected = true;
    } else {
      this.PreServiceQuestionItems.map((x) => (x.selected = true));
      const button = this.ButtonsList.find(x => x.name === this.FinishBtnName);
      button.selected = false;
      button.showButton = false;
    }
    this.PreServiceQuestionBoxItemsSubject.next(this.PreServiceQuestionItems);
    this.ButtonsListSubject.next(this.ButtonsList);
  }

  OpenDialog(name: string) {
    this.ButtonTranslatedTexts = this.GetButton(name).text;
    this.SetTextFormArray();
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseDialog() {
    this.OpenTranslateDialogSubject.next(false);
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.layoutService.GetRequestDocument(this.layoutService.WorkFlow,true,false))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.ButtonTranslatedTexts =
              this.layoutService.ConvertTranslatedLanguageArrayToObject(
                TranslateResponses
              );
            this.SetTextFormArray();
          }
        });
    }
  }

  private SetTextFormArray() {
    this.ButtonTextFormArraySubject.next(this.formBuilder.array([]));
    this.ButtonTranslateModalTitleSubject.next(
      this.GetButton(this.ButtonName).name
    );
    const translatedTexts = this.ButtonTranslatedTexts;
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        this.ButtonTextFormArraySubject.value.push(
          this.formBuilder.group({
            language: ele.language,
            languageCode: ele.languageCode,
            text: translatedTexts[ele.languageCode] || '',
          })
        );
      });
    }
  }

  UpdateFormWithTranslatedTexts(event, name: string) {
    const btnName = Number(this.PreServiceQuestionPanel.mode) === Mode.Single ? this.ButtonName : name;
    this.GetTextsWithoutTranslation(event);
    this.GetButton(btnName).text = this.ButtonTranslatedTexts;
    this.GetButton(btnName).form
      .get('text')
      .setValue(this.ButtonTranslatedTexts);
    this.ButtonsListSubject.next(this.ButtonsList);
    this.CloseDialog();
    this.isTranslated = false;
  }

  private GetTextsWithoutTranslation(event: any) {
    if (event.length > 0 && !this.isTranslated) {
      const buttonTexts = [];
      for (const e of event) {
        buttonTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text,
        });
      }
      this.ButtonTranslatedTexts =
        this.layoutService.ConvertTranslatedLanguageArrayToObject(buttonTexts);
    }
  }

  private SelectAndHighlightButton(button): void {
    this.layoutService.OnGlobalQuestionPageButtonSelection()
    this.ButtonsList.map(x => (x.selected = false));
    this.ButtonsList.map(x => (x.showPropertyWindow = false));
    button.showPropertyWindow = true;
    button.selected = true;
  }

  OpenButtonImageDialog(name: string) {
    this.SetImageFormArray(this.GetButton(name).src);
  }

  SetImageFormArray(src: ILanguageControl[]) {
    src = src ? src : [];
    this.ButtonImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const languageSrc = (src.find(x => x.languageCode === ele.languageCode));
        const imageSrc = (languageSrc) ? languageSrc[ele.languageCode] : {};
        this.ButtonImageFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: [imageSrc, [requiredFileType(SupportedImageFileTypes, SupportedImageFileSize)]],
          url: languageSrc?.url || '/assets/img-icon.svg'
        }));
      });
    }
    this.ButtonImageFormArraySubject.next(Object.create(this.ButtonImageFormArraySubject.value));
  }

  UpdateButtonControl(event: any, name: string) {
    const button = this.GetButton(name);
    if (event.length > 0) {
      const languageControls = [];
      for (const e of event) {
        languageControls.push({
          language: e.value.language,
          languageCode: e.value.languageCode,
          [e.value.languageCode]: e.value[e.value.languageCode],
          url: (e.value.url).startsWith('/assets') ? '' : e.value.url
        });
      }
      button.src = languageControls;
      button.form.get('src').setValue(languageControls);
      this.UpdateButtonSubject();
    }
  }
}
