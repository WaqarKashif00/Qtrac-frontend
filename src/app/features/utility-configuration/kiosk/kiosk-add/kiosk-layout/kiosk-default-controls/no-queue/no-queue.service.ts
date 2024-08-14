import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { KioskLayoutService } from '../../kiosk-layout.service';
import { ButtonControl } from '../../Models/controls/button.control';
import { TranslateService } from 'src/app/core/services/translate.service';
import { ISupportedLanguage } from '../../Models/supported-language.interface';
import { FormArray } from '@angular/forms';
import { IMoveEvent } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/move-event.interface';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { requiredFileType } from '../../../../../../../shared/validators/common.validator';
import {
  SupportedImageFileSize,
  SupportedImageFileTypes,
} from '../../../../../../../models/constants/valid-file-types-and-sizes.constant';
import {
  cloneObject,
  GetDefaultIfNegativeOrNull,
  RoundOffProperty,
} from 'src/app/core/utilities/core-utilities';
import { IControlSelection } from '../../Models/controls-selection.interface';

@Injectable()
export class NoQueueService extends AbstractComponentService {
  ButtonsSubject: BehaviorSubject<ButtonControl[]>;
  ButtonsList$: Observable<ButtonControl[]>;
  Buttons: any;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  ButtonTextFormArraySubject: BehaviorSubject<FormArray>;
  ButtonTextFormArray$: Observable<FormArray>;
  ImageFormArraySubject: BehaviorSubject<FormArray>;
  ImageFormArray$: Observable<FormArray>;
  NoQueueControlSelectedSubject: BehaviorSubject<IControlSelection>;
  NoQueuePageControlSelected$: Observable<IControlSelection>;
  Languages: ISupportedLanguage[];
  ButtonTranslatedTexts = {};
  isTranslated = false;

  ButtonStyles = {
    width: 100,
    height: 50,
    left: 700,
    top: 450,
  };

  IsOnlyGrid = false;
  GridSize = 50;

  constructor(
    private layoutService: KioskLayoutService,
    private translateService: TranslateService
  ) {
    super();
    this.InitializeSubjects();
    this.SubscribeSubject();
  }
  SubscribeSubject() {
    this.subs.sink = this.layoutService.LanguageList$.subscribe((lang) => {
      this.Languages = lang;
    });
    this.subs.sink = this.layoutService.NoQueuePage$.subscribe((x) => {
      this.Buttons = x.buttons;
      this.ButtonsSubject.next(x.buttons);
      this.NoQueueControlSelectedSubject.next(cloneObject(x.controlSelection));
    });

    this.subs.sink = this.layoutService.IsOnlyGrid$.subscribe((data) => {
      this.IsOnlyGrid = data;
    });
    this.subs.sink = this.layoutService.GridSize$.subscribe((data) => {
      this.GridSize = data;
    });
  }

  private InitializeSubjects() {
    this.ButtonsSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.ButtonsList$ = this.ButtonsSubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.ButtonTextFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ButtonTextFormArray$ = this.ButtonTextFormArraySubject.asObservable();
    this.ImageFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ImageFormArray$ = this.ImageFormArraySubject.asObservable();
    this.NoQueueControlSelectedSubject = new BehaviorSubject<IControlSelection>(
      null
    );
    this.NoQueuePageControlSelected$ =
      this.NoQueueControlSelectedSubject.asObservable();
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.DefaultLanguage$ = this.layoutService.DefaultLanguage$;
  }

  UpdateButtonData(Buttons: ButtonControl[]) {
    this.ButtonsSubject.next(Buttons);
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(
          textToTranslate,
          this.layoutService.GetRequestDocument(
            this.layoutService.WorkFlow,
            true
          )
        )
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

  OpenDialog(btnName: string) {
    this.ButtonTranslatedTexts = this.GetButton(btnName).text;
    this.SetTextFormArray();
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseDialog() {
    this.OpenTranslateDialogSubject.next(false);
  }

  UpdateTranslatedTextsInForm(event, name: string) {
    const button = this.GetButton(name);
    this.UpdateTextsWithoutTranslation(event);
    button.text = this.ButtonTranslatedTexts;
    button.form.get('text').setValue(this.ButtonTranslatedTexts);
    this.ButtonsSubject.next(this.Buttons);
    this.isTranslated = false;
  }

  ButtonResizeStop(event: IResizeEvent, name: string) {
    this.layoutService.OnNoQueuePageButtonSelection();

    const button = this.GetButton(name);

    button.form.controls.width.setValue(
      this.IsOnlyGrid
        ? RoundOffProperty(
            event.size.width || this.ButtonStyles.width,
            this.GridSize
          )
        : event.size.width || this.ButtonStyles.width
    );
    button.form.controls.height.setValue(
      this.IsOnlyGrid
        ? RoundOffProperty(
            event.size.height || this.ButtonStyles.height,
            this.GridSize
          )
        : event.size.height || this.ButtonStyles.height
    );

    this.SelectAndHighlightButton(button);
    this.UpdateButtonsSubject();
  }

  ButtonMoveEnd(event: IMoveEvent, name: string) {
    this.layoutService.OnNoQueuePageButtonSelection();
    const button = this.GetButton(name);
    button.form.controls.left.setValue(
      GetDefaultIfNegativeOrNull(event.x, this.ButtonStyles.left)
    );
    button.form.controls.top.setValue(
      GetDefaultIfNegativeOrNull(event.y, this.ButtonStyles.top)
    );
    this.SelectAndHighlightButton(button);
    this.ButtonsSubject.next(Object.create(this.Buttons));
  }

  ButtonClick(name: string) {
    this.layoutService.OnNoQueuePageButtonSelection();
    this.SelectAndHighlightButton(this.GetButton(name));
    this.ButtonsSubject.next(Object.create(this.Buttons));
  }

  private UpdateButtonsSubject() {
    this.ButtonsSubject.next(Object.create(this.Buttons));
  }

  private UpdateTextsWithoutTranslation(event: any) {
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

  private GetButton(name) {
    return this.Buttons.find((x) => x.name === name);
  }

  SetPropertyWindow(name: string) {
    this.SelectAndHighlightButton(this.GetButton(name));
    this.UpdateButtonsSubject();
  }

  private SelectAndHighlightButton(button): void {
    this.Buttons.map((x) => (x.showPropertyWindow = false));
    this.Buttons.map((x) => (x.selected = false));
    button.showPropertyWindow = true;
    button.selected = true;
  }

  OpenButtonImageDialog(name: string) {
    this.SetImageFormArray(this.GetButton(name).src);
  }

  SetImageFormArray(src: ILanguageControl[]) {
    src = src ? src : [];
    this.ImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const languageSrc = src.find(
          (x) => x.languageCode === ele.languageCode
        );
        const imageSrc = languageSrc ? languageSrc[ele.languageCode] : {};
        this.ImageFormArraySubject.value.push(
          this.formBuilder.group({
            language: ele.language,
            languageCode: ele.languageCode,
            [ele.languageCode]: [
              imageSrc,
              [
                requiredFileType(
                  SupportedImageFileTypes,
                  SupportedImageFileSize
                ),
              ],
            ],
            url: languageSrc?.url || '/assets/img-icon.svg',
          })
        );
      });
    }
    this.ImageFormArraySubject.next(
      Object.create(this.ImageFormArraySubject.value)
    );
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
          url: e.value.url.startsWith('/assets') ? '' : e.value.url,
        });
      }
      button.src = languageControls;
      button.form.get('src').setValue(languageControls);
      this.UpdateButtonsSubject();
    }
  }
}
