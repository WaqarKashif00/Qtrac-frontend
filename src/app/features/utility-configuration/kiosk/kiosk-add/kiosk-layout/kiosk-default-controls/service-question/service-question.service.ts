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
export class ServiceQuestionService extends AbstractComponentService {
  private ServiceQuestionBoxItemsSubject: BehaviorSubject<
    Array<ServiceBoxControl>
  >;
  ServiceQuestionBoxItems$: Observable<Array<ServiceBoxControl>>;
  private ServiceQuestionPanelSubject: BehaviorSubject<ServicePanelControl>;
  ServiceQuestionPanel$: Observable<ServicePanelControl>;
  private ServiceQuestionControlListSubject: BehaviorSubject<Array<ServiceDDL>>;
  ServiceQuestionControlList$: Observable<Array<ServiceDDL>>;
  private ServiceQuestionQuestionSetSubject: BehaviorSubject<
    Array<IQuestionSet>
  >;
  ServiceQuestionQuestionSet$: Observable<Array<IQuestionSet>>;
  private ButtonTextFormArraySubject: BehaviorSubject<FormArray>;
  ButtonTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  private ButtonTranslateModalTitleSubject: BehaviorSubject<string>;
  ButtonTranslateModalTitle$: Observable<string>;
  private ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;

  ServiceQuestionPanel: ServicePanelControl;
  ServiceQuestionItems: Array<ServiceBoxControl>;
  ServiceQuestionSet: Array<IQuestionSet>;
  ServiceQuestionControlList: Array<ServiceDDL>;
  CopyServiceQuestionItems: Array<ServiceBoxControl>;
  CopyServiceQuestionControlList: Array<ServiceDDL>;
  ButtonsListSubject: BehaviorSubject<ButtonControl[]>;
  ButtonsList$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;

  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  ButtonsList: any;
  Languages: ISupportedLanguage[];
  ButtonTranslatedTexts = {};
  isTranslated = false;
  FinishBtnName = 'Finish Button';
  BtnName: string;
  Workflow: IWorkFlowDetail;

  ButtonStyles = {
    width: 100,
    height: 50,
    left: 700,
    top: 450
  };
  IsOnlyGrid = false;
  GridSize = 50;


  constructor(private layoutService: KioskLayoutService, private translateService: TranslateService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables()
  }
  SubscribeObservables() {
    this.subs.sink = this.layoutService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });
    this.subs.sink = this.layoutService.KioskServiceQuestion$.subscribe((x) => {
      this.ServiceQuestionPanel = x.panel;
      this.CopyServiceQuestionItems = x.items;
      this.CopyServiceQuestionControlList = x.dropDownList;
      this.ServiceQuestionSet = x.questionSetList;
      this.ButtonsList = x.buttonList;
      this.BtnName = x.buttonList[0].name;
      this.SetItemsAndControlListValues(
        this.CopyServiceQuestionControlList[0].Control.questionSetId
      );
      this.ShowServiceQuestionItemsPropertyWindowById(
        this.CopyServiceQuestionControlList[0].Id
      );
      this.ServiceQuestionQuestionSetSubject.next(this.ServiceQuestionSet);
      this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanel);
      this.ControlSelectionSubject.next(cloneObject(x.controlSelection))

    });

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
    this.ServiceQuestionBoxItemsSubject = new BehaviorSubject<
      ServiceBoxControl[]
    >([]);
    this.ServiceQuestionBoxItems$ = this.ServiceQuestionBoxItemsSubject.asObservable();
    this.ServiceQuestionPanelSubject = new BehaviorSubject<ServicePanelControl>(
      null
    );
    this.ServiceQuestionPanel$ = this.ServiceQuestionPanelSubject.asObservable();
    this.ServiceQuestionControlListSubject = new BehaviorSubject<ServiceDDL[]>(
      []
    );
    this.ServiceQuestionControlList$ = this.ServiceQuestionControlListSubject.asObservable();
    this.ButtonsListSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.ButtonsList$ = this.ButtonsListSubject.asObservable();
    this.ServiceQuestionQuestionSetSubject = new BehaviorSubject<
      IQuestionSet[]
    >([]);
    this.ServiceQuestionQuestionSet$ = this.ServiceQuestionQuestionSetSubject.asObservable();
    this.ButtonTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonTextFormArray$ = this.ButtonTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.ButtonTranslateModalTitleSubject = new BehaviorSubject<string>('');
    this.ButtonTranslateModalTitle$ = this.ButtonTranslateModalTitleSubject.asObservable();
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonImageFormArray$ = this.ButtonImageFormArraySubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
      this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
      this.Workflow = this.layoutService.WorkFlow;

  }

    ResizeStop(event: IResizeEvent) {
        this.layoutService.OnServiceQuestionPageDefaultControlSelection()
    this.ServiceQuestionPanelSubject.value.form.controls.width.setValue
    (this.IsOnlyGrid ? RoundOffProperty(event.size.width, this.GridSize) : event.size.width);
    this.ServiceQuestionPanelSubject.value.form.controls.height.setValue
    (this.IsOnlyGrid ? RoundOffProperty(event.size.height, this.GridSize) : event.size.height);
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanel);
  }

  MoveEnd(event: IMoveEvent) {
    this.layoutService.OnServiceQuestionPageDefaultControlSelection()
    this.ServiceQuestionPanel.form.controls.left.setValue(event.x);
    this.ServiceQuestionPanel.form.controls.top.setValue(event.y);
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanel);
  }
  OnPanelClick(){
    this.layoutService.OnServiceQuestionPageDefaultControlSelection()
  }
  ButtonResizeStop(event: IResizeEvent, name: string) {
    const button = this.GetButton(name);
    const width = event.size.width || this.ButtonStyles.width;
    const height = event.size.height || this.ButtonStyles.height;
    button.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(width, this.GridSize) : width);
    button.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(height, this.GridSize) : height);
    this.SelectAndHighlightButton(button);
    this.ButtonsListSubject.next(Object.create(this.ButtonsList));
  }

  ButtonMoveEnd(event: IMoveEvent, name: string) {
    this.BtnName = name;
    const button = this.GetButton(name);
    button.form.controls.left.setValue(GetDefaultIfNegativeOrNull(event.x , this.ButtonStyles.left));
    button.form.controls.top.setValue(GetDefaultIfNegativeOrNull(event.y, this.ButtonStyles.top));
    this.SelectAndHighlightButton(button);
    this.ButtonsListSubject.next(Object.create(this.ButtonsList));
  }
  ShowQuestionSet(value: string) {
    this.SetItemsAndControlListValues(value);
    if (this.ServiceQuestionControlList.length > 0) {
      this.ShowServiceQuestionItemsPropertyWindowById(
        this.ServiceQuestionControlList[0].Id
      );
    } else {
      this.ServiceQuestionBoxItemsSubject.next(this.ServiceQuestionItems);
    }
  }

  private SetItemsAndControlListValues(value: string) {
    this.ServiceQuestionItems = [].concat(
      this.CopyServiceQuestionItems.filter((x) => x.questionSetId === value)
    );
    this.ServiceQuestionControlList = [].concat(
      this.CopyServiceQuestionControlList.filter(
        (x) => x.Control.questionSetId === value
      )
    );
  }

  public ShowServiceQuestionItemsPropertyWindowById(id: string) {
    this.ServiceQuestionControlList.map((x) => (x.ShowPropertyWindow = false));
    this.ServiceQuestionControlList.find(
      (x) => x.Id === id.toString()
    ).ShowPropertyWindow = true;
    this.ServiceQuestionItems.map((x) => (x.selected = false));
    if (this.ServiceQuestionPanel.mode === Mode.Single) {
      const propertyControlName = this.ServiceQuestionControlList.find(
        (x) => x.Id === id.toString()
      ).Control.text;
      this.ServiceQuestionItems.find(
        (x) => x.text === propertyControlName
      ).selected = true;
      this.ButtonsList.map((x) => (x.showButton = true));
      this.ButtonsList[1].showPropertyWindow = true;
      this.ButtonsList[0].showPropertyWindow = false;
    } else {
      this.ServiceQuestionItems.map((x) => (x.selected = true));
      this.ButtonsList[0].showPropertyWindow = true;
      this.ButtonsList[1].showPropertyWindow = false;
    }
    this.ButtonsListSubject.next(this.ButtonsList);
    this.ServiceQuestionControlListSubject.next(
      this.ServiceQuestionControlList
    );
    this.ServiceQuestionBoxItemsSubject.next(this.ServiceQuestionItems);
  }

  ShowButtonPropertyWindow(btnName: string) {
    const button = this.GetButton(btnName);
    this.ButtonsList.forEach(element => {
      element.showPropertyWindow = false;
      element.selected = false;
    });
    button.showPropertyWindow = true;
    button.selected = true;
    this.ButtonsListSubject.next(this.ButtonsList);
  }

  ChangeMode(id: number) {
    this.OpenTranslateDialogSubject.next(false);
    this.ServiceQuestionItems.forEach((x) => (x.selected = false));
    this.ServiceQuestionPanel.mode = id;
    this.ButtonsList.forEach(x => {
      x.showButton = true;
      x.showPropertyWindow = false;
      x.selected = false;
    });
    this.ButtonsList[0].showPropertyWindow = true;
    this.ButtonsList[0].selected = true;
    if (Number(id) === Mode.Single && this.ServiceQuestionItems.length > 1) {
      this.ServiceQuestionItems[0].selected = true;
    } else {
      this.ServiceQuestionItems.map((x) => (x.selected = true));
      const button = this.ButtonsList.find(x => x.name === this.FinishBtnName);
      button.selected = false;
      button.showButton = false;
    }
    this.ServiceQuestionBoxItemsSubject.next(this.ServiceQuestionItems);
    this.ButtonsListSubject.next(this.ButtonsList);
  }

  ChangeButton(event: string) {
    this.ButtonsList.map((x) => (x.selected = false));
    this.ButtonsList.find((x) => x.name === event).selected = true;
    this.ButtonsListSubject.next(this.ButtonsList);
  }

  UpdatePanelData() {
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanel);
  }

  UpdateData() {
    this.ServiceQuestionBoxItemsSubject.next(this.CopyServiceQuestionItems);
  }

  UpdateButtonData(Buttons: ButtonControl[]) {
    this.ButtonsListSubject.next(Buttons);
  }

  OpenDialog(name: string) {
    this.BtnName = name;
    const button = this.GetButton(name);
    this.ButtonTranslatedTexts = button.text;
    this.SetTextFormArray();
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseDialog() {
    this.OpenTranslateDialogSubject.next(false);
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.layoutService.GetRequestDocument(this.layoutService.WorkFlow,true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.ButtonTranslatedTexts = this.layoutService.ConvertTranslatedLanguageArrayToObject(TranslateResponses);
            this.SetTextFormArray();
          }
        });
    }
  }

  private SetTextFormArray() {
    this.ButtonTextFormArraySubject.next(this.formBuilder.array([]));
    const translatedTexts = this.ButtonTranslatedTexts;
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.ButtonTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: translatedTexts[ele.languageCode] || ''
        }));
      });
    }
  }

  private GetButton(name: string) {
    return this.ButtonsList.find(x => x.name === name);
  }

  UpdateFormWithTranslatedTexts(event, name) {
    const btnName = Number(this.ServiceQuestionPanel.mode) === Mode.Single ? this.BtnName : name;
    const button = this.GetButton(btnName);
    this.UpdateTextsWithoutTranslation(event);
    button.text = this.ButtonTranslatedTexts;
    button.form.get('text').setValue(this.ButtonTranslatedTexts);
    this.ButtonsListSubject.next(this.ButtonsList);
    this.CloseDialog();
    this.isTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.isTranslated)) {
      const buttonTexts = [];
      for (const e of event) {
        buttonTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.ButtonTranslatedTexts = this.layoutService.ConvertTranslatedLanguageArrayToObject(buttonTexts);
    }
  }

  private SelectAndHighlightButton(button): void {
    this.layoutService.OnServiceQuestionPageButtonSelection()
    this.ButtonsList.map(x => (x.showPropertyWindow = false));
    this.ButtonsList.map(x => (x.selected = false));
    button.showPropertyWindow = true;
    button.selected = true;
  }

  OpenButtonImageDialog(name: string){
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
          url: (e.value.url).startsWith('/assets') ? '' :  e.value.url
        });
      }
      button.src = languageControls;
      button.form.get('src').setValue(languageControls);
      this.ButtonsListSubject.next(Object.create(this.ButtonsList));
    }
  }
}
