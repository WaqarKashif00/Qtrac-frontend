import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileQuestionSetData } from '../../../../../models/mobile-layout-data.interface';
import { FormArray } from '@angular/forms';
import { TranslateService } from '../../../../../../../../core/services/translate.service';
import { distinct } from 'rxjs/operators';
import { cloneObject, updatePropertiesWithForm2 } from '../../../../../../../../core/utilities/core-utilities';
import { ILanguageControl } from '../../../../../../../../models/common/language-control.interface';
import { requiredFileType } from '../../../../../../../../shared/validators/common.validator';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { IMobileWorkFlowDetail } from '../../../../../models/mobile-work-flow-detail.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';

@Injectable()
export class SurveyQuestionService extends AbstractComponentService {


  private SurveyQuestionPanelSubject: BehaviorSubject<PanelControl>;
  SurveyQuestionPanel$: Observable<PanelControl>;
  private SurveyQuestionSetListSubject: BehaviorSubject<IMobileQuestionSetData[]>;
  SurveyQuestionSetList$: Observable<IMobileQuestionSetData[]>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;
  private ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  private OpenButtonImageDialogSubject: BehaviorSubject<boolean>;
  OpenButtonImageDialog$: Observable<boolean>;
  private ControlSelectionSubject: BehaviorSubject<IMobileControlSelection>;
  ControlSelection$: Observable<IMobileControlSelection>;

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  WorkFlowData: IMobileWorkFlowDetail;
  Languages = [];
  TranslatedTexts = {};
  isTranslated = false;
  OpenImageModal = false;

  constructor(private layoutService: TemplateLayoutService, private translateService: TranslateService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.CurrentPage$ = this.layoutService.CurrentPage$;
    this.SurveyQuestionPanelSubject = new BehaviorSubject<PanelControl>(null);
    this.SurveyQuestionPanel$ = this.SurveyQuestionPanelSubject.asObservable();
    this.SurveyQuestionSetListSubject = new BehaviorSubject<IMobileQuestionSetData[]>([]);
    this.SurveyQuestionSetList$ = this.SurveyQuestionSetListSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonImageFormArray$ = this.ButtonImageFormArraySubject.asObservable();
    this.OpenButtonImageDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenButtonImageDialog$ = this.OpenButtonImageDialogSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
    this.WorkFlowData = this.layoutService.Workflow;
    this.subs.sink = this.layoutService.SurveyPageData$.subscribe(
      (data) => {
        if (data.panel) {
          this.SurveyQuestionPanelSubject.next(data.panel);
          data.panel.items = data.panel?.items.filter(x => x.itemsSetId === data.questionSetList[0].itemSetId);
          this.SurveyQuestionSetListSubject.next(data.questionSetList);
          this.ControlSelectionSubject.next(cloneObject(data.controlSelection));
        }
      }
    );
    this.subs.sink = this.layoutService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });

    this.subs.sink = this.SurveyQuestionPanelSubject.value?.button.form.valueChanges
      .pipe(distinct())
      .subscribe((x) => {
        updatePropertiesWithForm2(this.SurveyQuestionPanelSubject.value.button, this.SurveyQuestionPanelSubject.value.button.form);
        this.UpdateButtonData(this.SurveyQuestionPanelSubject.value.button);
      });
  }


  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.SurveyQuestionPageDefaultControlSelection()
    this.SurveyQuestionPanelSubject.value.form.controls.top.setValue(event.y);
    this.SurveyQuestionPanelSubject.next(
      this.SurveyQuestionPanelSubject.value
    );
  }

  UpdatePanelData(panelData: PanelControl) {
    this.SurveyQuestionPanelSubject.next(panelData);
  }

  UpdateButtonData(buttonData: ButtonControl) {
    this.SurveyQuestionPanelSubject.value.button = buttonData;
    this.SurveyQuestionPanelSubject.next(this.SurveyQuestionPanelSubject.value);
  }

  SetPanelItemsOnQuestionSet(questionSetId: string) {
    const items: any = this.SurveyQuestionSetListSubject.value.find(
      x => x.itemSetId === questionSetId).items;
    this.SurveyQuestionPanelSubject.value.items = items;
    this.SurveyQuestionPanelSubject.next(this.SurveyQuestionPanelSubject.value);
  }

  OpenDialog(primaryButton: boolean) {
    this.SetTextInModal(primaryButton);
    this.OpenTranslateDialogSubject.next(true);
  }

  public SetTextInModal(primaryButton: boolean) {
    this.TranslatedTexts = primaryButton ? this.SurveyQuestionPanelSubject.value.button.text
      : this.SurveyQuestionPanelSubject.value.button.secondaryButtonText;
    this.SetTextFormArray(this.TranslatedTexts);
  }

  CloseDialog() {
    this.OpenTranslateDialogSubject.next(false);
  }

  private SetTextFormArray(text: object) {
    this.LabelTextFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.LabelTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: text[ele.languageCode] || ''
        }));
      });
    }
  }

  TranslateText(textToTranslate: string) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate)
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.GetConvertedLangArrayToObject(TranslateResponses);
            this.SetTextFormArray(this.TranslatedTexts);
          }
        });
    }
  }

  public GetConvertedLangArrayToObject(TranslateResponses): {} {
    return this.layoutService.ConvertLanguageArrayToObject(TranslateResponses);
  }

  UpdateTranslatedTexts(event, primaryButton: boolean) {
    this.UpdateTextsWithoutTranslation(event);
    if (primaryButton) {
      this.SurveyQuestionPanelSubject.value.button.text = this.TranslatedTexts;
      this.SurveyQuestionPanelSubject.value.button.form.get('text').setValue(this.TranslatedTexts);
    } else {
      this.SurveyQuestionPanelSubject.value.button.secondaryButtonText = this.TranslatedTexts;
      this.SurveyQuestionPanelSubject.value.button.form.get('secondaryButtonText').setValue(this.TranslatedTexts);
    }
    this.UpdateButtonData(this.SurveyQuestionPanelSubject.value.button);
    this.CloseDialog();
    this.isTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.isTranslated)) {
      const labelTexts = [];
      for (const e of event) {
        labelTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.GetConvertedLangArrayToObject(labelTexts);
    }
  }

  SetPrimaryButtonSelectedProperty(primaryButton: boolean) {
    this.SurveyQuestionPanelSubject.value.button.isPrimaryButtonSelected = primaryButton;
    this.SurveyQuestionPanelSubject.value.button.form.get('isPrimaryButtonSelected').setValue(primaryButton);
    this.SurveyQuestionPanelSubject.next(this.SurveyQuestionPanelSubject.value);
  }

  OpenImageDialog(primaryButton: boolean) {
    this.OpenButtonImageDialogSubject.next(true);
    const src = primaryButton ? this.SurveyQuestionPanelSubject.value.button.primaryButtonSrc
      : this.SurveyQuestionPanelSubject.value.button.secondaryButtonSrc;
    this.SetButtonImageFormArray(src);
  }

  SetButtonImageFormArray(src: ILanguageControl[]) {
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

  Save(event, primaryButton: boolean) {
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
      if (primaryButton) {
        this.SurveyQuestionPanelSubject.value.button.primaryButtonSrc = languageControls;
        this.SurveyQuestionPanelSubject.value.button.form.get('primaryButtonSrc').setValue(languageControls);
      } else {
        this.SurveyQuestionPanelSubject.value.button.secondaryButtonSrc = languageControls;
        this.SurveyQuestionPanelSubject.value.button.form.get('secondaryButtonSrc').setValue(languageControls);
      }
      this.UpdateButtonData(this.SurveyQuestionPanelSubject.value.button);
      this.CloseImageDialog();
    }
  }

  CloseImageDialog() {
    this.OpenButtonImageDialogSubject.next(false);
  }
  PanelClick() {
    this.layoutService.SurveyQuestionPageDefaultControlSelection()
  }
}
