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
export class ServiceQuestionService extends AbstractComponentService {


  private ServiceQuestionPanelSubject: BehaviorSubject<PanelControl>;
  ServiceQuestionPanel$: Observable<PanelControl>;
  private ServiceQuestionQuestionSetSubject: BehaviorSubject<IMobileQuestionSetData[]>;
  ServiceQuestionQuestionSet$: Observable<IMobileQuestionSetData[]>;
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
    this.ServiceQuestionPanelSubject = new BehaviorSubject<PanelControl>(null);
    this.ServiceQuestionPanel$ = this.ServiceQuestionPanelSubject.asObservable();
    this.ServiceQuestionQuestionSetSubject = new BehaviorSubject<IMobileQuestionSetData[]>([]);
    this.ServiceQuestionQuestionSet$ = this.ServiceQuestionQuestionSetSubject.asObservable();
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
    this.subs.sink = this.layoutService.ServiceQuestionPageData$.subscribe(
      (data) => {
        this.ServiceQuestionPanelSubject.next(data.panel);
        data.panel.items = data.panel.items.filter(x => x.itemsSetId === data.questionSetList[0].itemSetId);
        this.ServiceQuestionQuestionSetSubject.next(data.questionSetList);
        this.ControlSelectionSubject.next(cloneObject(data.controlSelection));
      }
    );
    this.subs.sink = this.layoutService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });

    this.subs.sink = this.ServiceQuestionPanelSubject.value.button.form.valueChanges
      .pipe(distinct())
      .subscribe((x) => {
        updatePropertiesWithForm2(this.ServiceQuestionPanelSubject.value.button, this.ServiceQuestionPanelSubject.value.button.form);
        this.UpdateButtonData(this.ServiceQuestionPanelSubject.value.button);
      });
  }


  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.ServiceQuestionPageDefaultControlSelection()
    this.ServiceQuestionPanelSubject.value.form.controls.top.setValue(event.y);
    this.ServiceQuestionPanelSubject.next(
      this.ServiceQuestionPanelSubject.value
    );
  }

  UpdatePanelData(panelData: PanelControl) {
    this.ServiceQuestionPanelSubject.next(panelData);
  }

  UpdateButtonData(buttonData: ButtonControl) {
    this.ServiceQuestionPanelSubject.value.button = buttonData;
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanelSubject.value);
  }

  SetPanelItemsOnQuestionSet(questionSetId: string){
    const items: any = this.ServiceQuestionQuestionSetSubject.value.find(
      x => x.itemSetId === questionSetId).items;
    this.ServiceQuestionPanelSubject.value.items = items;
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanelSubject.value);
  }

  OpenDialog(primaryButton: boolean){
    this.SetTextInModal(primaryButton);
    this.OpenTranslateDialogSubject.next(true);
  }

  public SetTextInModal(primaryButton: boolean) {
    this.TranslatedTexts = primaryButton ? this.ServiceQuestionPanelSubject.value.button.text
                                         : this.ServiceQuestionPanelSubject.value.button.secondaryButtonText;
    this.SetTextFormArray(this.TranslatedTexts);
  }

  CloseDialog(){
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
    if (primaryButton){
      this.ServiceQuestionPanelSubject.value.button.text = this.TranslatedTexts;
      this.ServiceQuestionPanelSubject.value.button.form.get('text').setValue(this.TranslatedTexts);
    }else{
      this.ServiceQuestionPanelSubject.value.button.secondaryButtonText = this.TranslatedTexts;
      this.ServiceQuestionPanelSubject.value.button.form.get('secondaryButtonText').setValue(this.TranslatedTexts);
    }
    this.UpdateButtonData(this.ServiceQuestionPanelSubject.value.button);
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

  SetPrimaryButtonSelectedProperty(primaryButton: boolean){
    this.ServiceQuestionPanelSubject.value.button.isPrimaryButtonSelected = primaryButton;
    this.ServiceQuestionPanelSubject.value.button.form.get('isPrimaryButtonSelected').setValue(primaryButton);
    this.ServiceQuestionPanelSubject.next(this.ServiceQuestionPanelSubject.value);
  }

  OpenImageDialog(primaryButton: boolean){
    this.OpenButtonImageDialogSubject.next(true);
    const src = primaryButton ? this.ServiceQuestionPanelSubject.value.button.primaryButtonSrc
    : this.ServiceQuestionPanelSubject.value.button.secondaryButtonSrc;
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

  Save(event, primaryButton: boolean){
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
      if (primaryButton) {
        this.ServiceQuestionPanelSubject.value.button.primaryButtonSrc = languageControls;
        this.ServiceQuestionPanelSubject.value.button.form.get('primaryButtonSrc').setValue(languageControls);
      }else{
        this.ServiceQuestionPanelSubject.value.button.secondaryButtonSrc = languageControls;
        this.ServiceQuestionPanelSubject.value.button.form.get('secondaryButtonSrc').setValue(languageControls);
      }
      this.UpdateButtonData(this.ServiceQuestionPanelSubject.value.button);
      this.CloseImageDialog();
    }
  }

  CloseImageDialog(){
    this.OpenButtonImageDialogSubject.next(false);
  }
  PanelClick() {
    this.layoutService.ServiceQuestionPageDefaultControlSelection()
  }
}
