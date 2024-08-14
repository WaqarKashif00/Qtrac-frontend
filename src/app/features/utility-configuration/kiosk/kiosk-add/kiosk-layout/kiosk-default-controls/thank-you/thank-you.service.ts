import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMoveEvent } from '../../Models/move-event.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { KioskLayoutService } from '../../kiosk-layout.service';
import { ThankYouPanelControl } from '../../Models/controls/thank-you-panel.control';
import { distinct } from 'rxjs/operators';
import { cloneObject, GetDefaultIfNegativeOrNull, RoundOffProperty, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ButtonControl } from '../../Models/controls/button.control';
import { IThankYouItemControl } from '../../Models/thank-you-page-item.interface';
import { FormArray } from '@angular/forms';
import { ISupportedLanguage } from '../../Models/supported-language.interface';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { requiredFileType } from '../../../../../../../shared/validators/common.validator';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { IControlSelection } from '../../Models/controls-selection.interface';

@Injectable()
export class ThankYouService extends AbstractComponentService {
  Control$: Observable<ThankYouPanelControl>;
  ControlSubject: BehaviorSubject<ThankYouPanelControl>;
  Buttons$: Observable<ButtonControl[]>;
  ButtonsSubject: BehaviorSubject<ButtonControl[]>;
  ThankYouControl: ThankYouPanelControl;
  Buttons: ButtonControl[];
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  TextFormArraySubject: BehaviorSubject<FormArray>;
  TextFormArray$: Observable<FormArray>;
  OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;

  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  Languages: ISupportedLanguage[];
  TranslatedTexts = {};
  isTranslated = false;

  ButtonStyles = {
    width: 100,
    height: 50,
    left: 700,
    top: 450
  };

  IsOnlyGrid: boolean = false;
  GridSize: number = 50;

  constructor(private layoutService: KioskLayoutService, private translateService: TranslateService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservable()
  }
  SubscribeObservable() {
    this.subs.sink = this.layoutService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });
    this.subs.sink=this.layoutService.ThankYou$.subscribe(x=>{
      this.ControlSelectionSubject.next(cloneObject(x.controlSelection))
    })
    this.subs.sink = this.layoutService.KioskData$.subscribe((x) => {
      this.ThankYouControl = x.ThankYouPageData.thankYouPanel;
      this.ControlSubject.next(this.ThankYouControl);
      this.Buttons = x.ThankYouPageData.buttons;
      this.ButtonsSubject.next(this.Buttons);
    });
    this.subs.sink = this.ThankYouControl?.form.valueChanges
      .pipe(distinct())
      .subscribe((x) => {
        updatePropertiesWithForm2(
          this.ThankYouControl,
          this.ThankYouControl.form
        );
        this.UpdateData(this.ThankYouControl);
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
    this.ControlSubject = new BehaviorSubject<ThankYouPanelControl>(
      this.ThankYouControl
    );
    this.Control$ = this.ControlSubject.asObservable();
    this.ButtonsSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.Buttons$ = this.ButtonsSubject.asObservable();
    this.TextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.TextFormArray$ = this.TextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.DefaultLanguage$ = this.layoutService.DefaultLanguage$;
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonImageFormArray$ = this.ButtonImageFormArraySubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();

  }

  UpdateData(control: ThankYouPanelControl) {
    this.ControlSubject.next(control);
  }

  UpdateButtonData(buttons: ButtonControl[]) {
    this.ButtonsSubject.next(buttons);
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.OnThankYouPageDefaultControlSelection()
    this.ControlSubject.value.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.width, this.GridSize) : event.size.width);
    this.ControlSubject.value.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.height, this.GridSize) : event.size.height);

    this.ControlSubject.next(this.ThankYouControl);
  }

  MoveEnd(event: IMoveEvent) {
    this.layoutService.OnThankYouPageDefaultControlSelection()
    this.ThankYouControl.form.controls.left.setValue(event.x);
    this.ThankYouControl.form.controls.top.setValue(event.y);
    this.ControlSubject.next(this.ThankYouControl);
  }
  PanelClick(){
    this.layoutService.OnThankYouPageDefaultControlSelection()
  }
  ButtonResizeStop(event: IResizeEvent, name: string) {
    const button = this.GetButtonByName(name);
    const width = event.size.width || this.ButtonStyles.width;
    const height = event.size.height || this.ButtonStyles.height;
    button.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(width, this.GridSize) : width);
    button.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(height, this.GridSize) : height);
    this.SelectAndHighlightButton(button);
    this.UpdateButtonsSubject();
  }

  ButtonMoveEnd(event: IMoveEvent, name: string) {
    const button = this.GetButtonByName(name);
    button.form.controls.left.setValue(GetDefaultIfNegativeOrNull(event.x , this.ButtonStyles.left));
    button.form.controls.top.setValue(GetDefaultIfNegativeOrNull(event.y,this.ButtonStyles.top));
    this.SelectAndHighlightButton(button);
    this.UpdateButtonsSubject();
  }

  private UpdateButtonsSubject() {
    this.ButtonsSubject.next(Object.create(this.Buttons));
  }

  UpdateSelectedProperty(item: string) {
    this.ControlSubject.value.items.map((x) => {
      x.selected = false;
    });
    this.ControlSubject.value.items.find(
      (x) => x.type === item
    ).selected = true;
    this.ControlSubject.next(this.ControlSubject.value);
  }

  UpdateItemData(itemControl: IThankYouItemControl) {
    this.ControlSubject.value.items.find(x => x.type === itemControl.type).styles.font = itemControl.styles.font;
    this.ControlSubject.value.items.find(x => x.type === itemControl.type).styles.fontStyle = itemControl.styles.fontStyle;
    this.ControlSubject.value.items.find(x => x.type === itemControl.type).styles.fontWeight = itemControl.styles.fontWeight;
    this.ControlSubject.value.items.find(x => x.type === itemControl.type).styles.fontSize = itemControl.styles.fontSize;
    this.ControlSubject.next(this.ControlSubject.value);
  }

  public SetTextInModal(control: any) {
    this.TranslatedTexts = control.text;
    this.SetTextFormArray(this.TranslatedTexts);
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.layoutService.GetRequestDocument(this.layoutService.WorkFlow,true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.GetConvertedLangArrayToObject(TranslateResponses);
            this.SetTextFormArray(this.TranslatedTexts);
          }
        });
    }
  }

  GetConvertedLangArrayToObject(translateResponses): {} {
    return this.layoutService.ConvertTranslatedLanguageArrayToObject(translateResponses);
  }

  private SetTextFormArray(text: object) {
    this.TextFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.TextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: text[ele.languageCode] || ''
        }));
      });
    }
  }

  SetPropertyWindow(name: string) {
    this.SelectAndHighlightButton(this.GetButtonByName(name));
    this.UpdateButtonsSubject();
  }

  private SelectAndHighlightButton(button): void {
    this.layoutService.OnThankYouPageButtonSelection()
    this.Buttons.map(x => (x.showPropertyWindow = false));
    this.Buttons.map(x => (x.selected = false));
    button.showPropertyWindow = true;
    button.selected = true;
  }

  GetButtonByName(name: string): ButtonControl {
    return this.Buttons.find(x => x.name === name);
  }

  OpenButtonImageDialog(name: string) {
    this.SetImageFormArray(this.GetButtonByName(name).src);
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
    const button = this.GetButtonByName(name);
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
      this.UpdateButtonsSubject();
    }
  }
}
