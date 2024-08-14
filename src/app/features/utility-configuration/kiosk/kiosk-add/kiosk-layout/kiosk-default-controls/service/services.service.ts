import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMoveEvent } from '../../Models/move-event.interface';
import { ServiceBoxControl } from '../../Models/controls/service-box.control';
import { ServicePanelControl } from '../../Models/controls/service-panel.control';
import { Observable, BehaviorSubject } from 'rxjs';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { KioskLayoutService } from '../../kiosk-layout.service';
import { ServiceDDL } from '../../Models/servies-drop-down.interface';
import { ButtonControl } from '../../Models/controls/button.control';
import { ISupportedLanguage } from '../../Models/supported-language.interface';
import { FormArray } from '@angular/forms';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { requiredFileType } from '../../../../../../../shared/validators/common.validator';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
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
export class ServicesService extends AbstractComponentService {
  private ServiceBoxItemsSubject: BehaviorSubject<Array<ServiceBoxControl>>;
  ServiceBoxItems$: Observable<Array<ServiceBoxControl>>;
  private ServicePanelSubject: BehaviorSubject<ServicePanelControl>;
  ServicePanel$: Observable<ServicePanelControl>;
  private ServiceControlListSubject: BehaviorSubject<Array<ServiceDDL>>;
  ServiceControlList$: Observable<Array<ServiceDDL>>;
  private ServiceButtonsSubject: BehaviorSubject<ButtonControl[]>;
  ServiceButtons$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  ButtonTextFormArraySubject: BehaviorSubject<FormArray>;
  ButtonTextFormArray$: Observable<FormArray>;
  ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;

  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  Languages: ISupportedLanguage[];
  ServicePanel: ServicePanelControl;
  ServiceItems: Array<ServiceBoxControl>;
  ServiceControlList: Array<ServiceDDL>;
  CopyServiceItems: Array<ServiceBoxControl>;
  CopyServiceControlList: Array<ServiceDDL>;
  ServiceButtons: ButtonControl[];

  ButtonStyles = {
    width: 100,
    height: 50,
    left: 700,
    top: 450,
  };
  ButtonTranslatedTexts = {};
  isTranslated = false;
  IsOnlyGrid: boolean = false;
  GridSize: number = 50;

  constructor(
    private layoutService: KioskLayoutService,
    private translateService: TranslateService
  ) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }
  SubscribeObservables() {
    this.subs.sink = this.layoutService.KioskService$.subscribe((x) => {
      this.ServicePanel = x.panel;
      this.ServiceItems = x.items;
      this.ServiceButtons = x.buttons;
      this.ServiceControlList = x.dropDownList;
      this.ServiceBoxItemsSubject.next(this.ServiceItems);
      this.ServiceControlListSubject.next(this.ServiceControlList);
      this.ServicePanelSubject.next(this.ServicePanel);
      this.ServiceButtonsSubject.next(this.ServiceButtons);
      this.ControlSelectionSubject.next(cloneObject(x.controlSelection));
    });
    this.subs.sink = this.layoutService.LanguageList$.subscribe((lang) => {
      this.Languages = lang;
    });
    this.subs.sink = this.layoutService.IsOnlyGrid$.subscribe((data) => {
      this.IsOnlyGrid = data;
    });
    this.subs.sink = this.layoutService.GridSize$.subscribe((data) => {
      this.GridSize = data;
    });
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.DefaultLanguage$ = this.layoutService.DefaultLanguage$;
    this.ServiceBoxItemsSubject = new BehaviorSubject<ServiceBoxControl[]>([]);
    this.ServiceBoxItems$ = this.ServiceBoxItemsSubject.asObservable();
    this.ServicePanelSubject = new BehaviorSubject<ServicePanelControl>(null);
    this.ServicePanel$ = this.ServicePanelSubject.asObservable();
    this.ServiceControlListSubject = new BehaviorSubject<ServiceDDL[]>([]);
    this.ServiceControlList$ = this.ServiceControlListSubject.asObservable();
    this.ServiceButtonsSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.ServiceButtons$ = this.ServiceButtonsSubject.asObservable();
    this.ButtonTextFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ButtonTextFormArray$ = this.ButtonTextFormArraySubject.asObservable();
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(
      this.formBuilder.array([])
    );
    this.ButtonImageFormArray$ =
      this.ButtonImageFormArraySubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.OnServicePageDefaultControlSelection();
    this.ServicePanelSubject.value.form.controls.width.setValue(
      this.IsOnlyGrid
        ? RoundOffProperty(event.size.width, this.GridSize)
        : event.size.width
    );
    this.ServicePanelSubject.value.form.controls.height.setValue(
      this.IsOnlyGrid
        ? RoundOffProperty(event.size.height, this.GridSize)
        : event.size.height
    );

    this.ServicePanelSubject.next(this.ServicePanel);
  }

  MoveEnd(event: IMoveEvent) {
    this.layoutService.OnServicePageDefaultControlSelection();
    this.ServicePanel.form.controls.left.setValue(event.x);
    this.ServicePanel.form.controls.top.setValue(event.y);
    this.ServicePanelSubject.next(this.ServicePanel);
  }
  OnPanelClick() {
    this.layoutService.OnServicePageDefaultControlSelection();
  }
  ShowItemsPropertyWindowById(value: string) {
    this.ServiceControlList.map((x) => (x.ShowPropertyWindow = false));
    this.ServiceControlList.find((x) => x.Id === value).ShowPropertyWindow =
      true;
    this.ServiceControlListSubject.next(this.ServiceControlList);
  }
  SetValuesAsSelected(ids: Array<string>) {
    this.ServiceControlList.map((x) => (x.Control.kioskSelected = false));
    this.ServiceControlList.forEach((x) => {
      if (ids.includes(x.Control.questionId)) {
        x.Control.kioskSelected = true;
      }
    });
    this.ServiceControlListSubject.next(this.ServiceControlList);
  }
  UpdatePanelData() {
    this.ServicePanelSubject.next(this.ServicePanel);
  }
  UpdateData() {
    this.ServiceBoxItemsSubject.next(this.ServiceItems);
  }

  ButtonResizeStop(event: IResizeEvent, name: string) {
    const button = this.GetButton(name);
    const width = event.size.width || this.ButtonStyles.width;
    const height = event.size.height || this.ButtonStyles.height;
    button.form.controls.width.setValue(
      this.IsOnlyGrid ? RoundOffProperty(width, this.GridSize) : width
    );
    button.form.controls.height.setValue(
      this.IsOnlyGrid ? RoundOffProperty(height, this.GridSize) : height
    );
    this.SelectAndHighlightButton(button);
    this.UpdateButtonSubject();
  }

  ButtonMoveEnd(event: IMoveEvent, name: string) {
    const button = this.GetButton(name);
    button.form.controls.left.setValue(
      GetDefaultIfNegativeOrNull(event.x, this.ButtonStyles.left)
    );
    button.form.controls.top.setValue(
      GetDefaultIfNegativeOrNull(event.y, this.ButtonStyles.top)
    );
    this.SelectAndHighlightButton(button);
    this.UpdateButtonSubject();
  }

  ButtonClick(name: string) {
    this.SelectAndHighlightButton(this.GetButton(name));
    this.UpdateButtonSubject();
  }

  private GetButton(btnName: string) {
    return this.ServiceButtons.find((b) => b.name === btnName);
  }

  private SelectAndHighlightButton(button): void {
    this.layoutService.OnServicePageButtonSelection();

    this.ServiceButtons.forEach((element) => {
      element.showPropertyWindow = false;
      element.selected = false;
    });
    button.showPropertyWindow = true;
    button.selected = true;
  }

  private UpdateButtonSubject() {
    this.ServiceButtonsSubject.next(Object.create(this.ServiceButtons));
  }

  OpenDialog(name: string) {
    this.ButtonTranslatedTexts = this.GetButton(name).text;
    this.SetTextFormArray();
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

  UpdateFormWithTranslatedTexts(event, name: string) {
    this.GetTextsWithoutTranslation(event);
    this.GetButton(name).text = this.ButtonTranslatedTexts;
    this.GetButton(name).form.get('text').setValue(this.ButtonTranslatedTexts);
    this.UpdateButtonSubject();
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

  UpdateButtonData(buttons: ButtonControl[]) {
    this.ServiceButtonsSubject.next(buttons);
  }

  ShowButtonPropertyWindow(btnName: string) {
    this.ServiceButtons.map((x) => (x.showPropertyWindow = false));
    this.GetButton(btnName).showPropertyWindow = true;
    this.ServiceButtonsSubject.next(this.ServiceButtons);
  }

  OpenButtonImageDialog(name: string) {
    this.SetImageFormArray(this.GetButton(name).src);
  }

  SetImageFormArray(src: ILanguageControl[]) {
    src = src ? src : [];
    this.ButtonImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const languageSrc = src.find(
          (x) => x.languageCode === ele.languageCode
        );
        const imageSrc = languageSrc ? languageSrc[ele.languageCode] : {};
        this.ButtonImageFormArraySubject.value.push(
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
    this.ButtonImageFormArraySubject.next(
      Object.create(this.ButtonImageFormArraySubject.value)
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
      this.UpdateButtonSubject();
    }
  }
}
