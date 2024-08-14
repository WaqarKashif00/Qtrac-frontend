import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { IWorkFlowRequest } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { DocumentType, VariablePurpose, VariableRequestDocument } from 'src/app/models/enums/variables-related';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { IDynamicVariable } from '../../../../../../../models/common/dynamic-variable.interface';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { SupportedImageFileSize, SupportedImageFileTypes } from '../../../../../../../models/constants/valid-file-types-and-sizes.constant';
import { requiredFileType } from '../../../../../../../shared/validators/common.validator';
import { Control } from '../../../../models/controls/control';
import { DesignerPanelControl } from '../../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../../models/controls/footer.control';
import { HeaderControl } from '../../../../models/controls/header.control';
import { IMobileControlSelection } from '../../../../models/mobile-control-selection.interface';
import { IMobileWorkFlowDetail } from '../../../../models/mobile-work-flow-detail.interface';
import { IOtherControlDDL } from '../../../../models/other-control-drop-down.interface';
import { IMobilePageDetails } from '../../../../models/pages.interface';
import { TemplateLayoutService } from '../template-layout.service';
import { PageProperties } from '../../../../models/controls/page-properties';

@Injectable()
export class PropertiesService extends AbstractComponentService {

  DesignerPanel$: Observable<DesignerPanelControl>;
  PageProperties$: Observable<PageProperties>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  OtherControlsData$: Observable<IOtherControlDDL[]>;
  private OtherControlsDataSubject: BehaviorSubject<IOtherControlDDL[]>;
  OtherControlsSelection$: Observable<IMobileControlSelection>;
  private OtherControlsSelectionSubject: BehaviorSubject<IMobileControlSelection>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;
  private ImageFormArraySubject: BehaviorSubject<FormArray>;
  ImageFormArray$: Observable<FormArray>;
  private VideoFormArraySubject: BehaviorSubject<FormArray>;
  VideoFormArray$: Observable<FormArray>;
  private SliderFormArraySubject: BehaviorSubject<FormArray>;
  SliderFormArray$: Observable<FormArray>;
  private ButtonImageFormArraySubject: BehaviorSubject<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  private FooterTextFormArraySubject: BehaviorSubject<FormArray>;
  FooterTextFormArray$: Observable<FormArray>;

  Languages = [];
  TranslatedTexts = {};
  isTranslated = false;

  get Workflow(){
    return this.templateLayoutService.Workflow;
  }

  constructor(private templateLayoutService: TemplateLayoutService, private translateService: TranslateService) {
    super();
    this.Initialization();
  }

  Initialization() {
    this.InitializeSubjects();
    this.InitializeObservables();
    this.SubscribeObservables();
  }

  SubscribeObservables() {
    this.subs.sink = this.templateLayoutService.SurveyPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x.otherControlList);
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
      }
    );
    this.subs.sink = this.templateLayoutService.TicketPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x.otherControlList);
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
      }
    );
    this.subs.sink = this.templateLayoutService.ThankYouPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x.otherControlList);
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
      }
    );
    this.subs.sink = this.templateLayoutService.MarketingPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x.otherControlList);
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
      }
    );
    this.subs.sink = this.templateLayoutService.ServiceQuestionPageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.ServicePageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.WelcomePageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.GlobalQuestionPageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.LanguagePageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.NoQueuePageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.OffLinePageData$.subscribe(
      (x) => {
        this.OtherControlsSelectionSubject.next(cloneObject(x.controlSelection));
        this.OtherControlsDataSubject.next(x.otherControlList);
      }
    );
    this.subs.sink = this.templateLayoutService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });
    this.subs.sink = this.OtherControlsData$.subscribe(
      (ddl) => {
        this.SetVideoFormArray([]);
      }
    );
  }

  private InitializeObservables() {
    this.DesignerPanel$ = this.templateLayoutService.DesignerPanel$;
    this.PageProperties$ = this.templateLayoutService.PageProperties$;
    this.HeaderControl$ = this.templateLayoutService.HeaderControl$;
    this.FooterControl$ = this.templateLayoutService.FooterControl$;
    this.CurrentPage$ = this.templateLayoutService.CurrentPage$;
    this.DynamicVariables$ = this.templateLayoutService.DynamicVariables$;
  }

  private InitializeSubjects() {
    this.OtherControlsDataSubject = new BehaviorSubject<IOtherControlDDL[]>([]);
    this.OtherControlsData$ = this.OtherControlsDataSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.ImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ImageFormArray$ = this.ImageFormArraySubject.asObservable();
    this.VideoFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.VideoFormArray$ = this.VideoFormArraySubject.asObservable();
    this.SliderFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.SliderFormArray$ = this.SliderFormArraySubject.asObservable();
    this.ButtonImageFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.ButtonImageFormArray$ = this.ButtonImageFormArraySubject.asObservable();
    this.FooterTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.FooterTextFormArray$ = this.FooterTextFormArraySubject.asObservable();
    this.OtherControlsSelectionSubject = new BehaviorSubject(null);
    this.OtherControlsSelection$ = this.OtherControlsSelectionSubject.asObservable();
  }

  UpdatedDesignerPanelDetail(designerPanelControl: DesignerPanelControl) {
    this.templateLayoutService.UpdatedDesignerPanelDetail(designerPanelControl);
  }
  UpdatedFooterControlDetail(footerControl: FooterControl) {
    this.templateLayoutService.UpdatedFooterControlDetail(footerControl);
  }
  UpdatedHeaderControlDetail(headerControl: HeaderControl) {
    this.templateLayoutService.UpdatedHeaderControlDetail(headerControl);
  }
  UpdateData(control: Control) {
    this.templateLayoutService.UpdateOtherControlData(control);
  }

  ShowCurrentSelectedOtherControlsPropertyWindow(value: string) {
    this.templateLayoutService.ChangeOtherControlPropertyWindow(value);
  }

  OpenDialog(control){
    this.SetTextInModal(control);
    this.OpenTranslateDialogSubject.next(true);
  }

  public SetTextInModal(control: any) {
    this.TranslatedTexts = control.text;
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

  TranslateText(textToTranslate: string, footerControl: boolean = false) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.GetRequestDocument(this.Workflow, true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.GetConvertedLangArrayToObject(TranslateResponses);
            footerControl ? this.SetFooterTextFormArray(this.TranslatedTexts) : this.SetTextFormArray(this.TranslatedTexts);
          }
        });
    }
  }

  public GetConvertedLangArrayToObject(TranslateResponses): {} {
    return this.templateLayoutService.ConvertLanguageArrayToObject(TranslateResponses);
  }

  UpdateTranslatedTexts(event, control) {
    this.UpdateTextsWithoutTranslation(event);
    control.text = this.TranslatedTexts;
    control.form.get('text').setValue(this.TranslatedTexts);
    this.UpdateData(control);
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

  SetImageFormArray(src: ILanguageControl[]) {
    this.ImageFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const imageSrc = src.find(x => x.languageCode === ele.languageCode)?.url || '/assets/img-icon.svg';
        this.ImageFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: [imageSrc, [requiredFileType(SupportedImageFileTypes, SupportedImageFileSize)]],
          url: imageSrc
        }));
      });
    }
    this.ImageFormArraySubject.next(Object.create(this.ImageFormArraySubject.value));
  }

  UpdateControl(event: any, control: any) {
    if (event.length > 0) {
      const languageControls = [];
      for (const e of event) {
        languageControls.push({
          language: e.value.language,
          languageCode: e.value.languageCode,
          [e.value.languageCode]: e.value[e.value.languageCode],
          url: e.value.url
        });
      }
      control.src = languageControls;
      control.form.get('src').setValue(languageControls);
      this.UpdateData(control);
    }
  }

  SetVideoFormArray(src: ILanguageControl[]) {
    this.VideoFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const videoSrc = src.find(x => x.languageCode === ele.languageCode)?.url || [];
        this.VideoFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: videoSrc,
          url: videoSrc
        }));
      });
    }
    this.VideoFormArraySubject.next(Object.create(this.VideoFormArraySubject.value));
  }

  SetSliderFormArray(src) {
    this.SliderFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const langObj = (src && src.length > 0 && typeof(src) !== 'string') ? src.find(x => x.languageCode === ele.languageCode) : [];
        this.SliderFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: [(langObj?.url) || ''],
          url: [(langObj?.url) || '']
        }));
      });
    }
    this.SliderFormArraySubject.next(Object.create(this.SliderFormArraySubject.value));
  }

  OpenButtonImageDialog(control){
    this.SetImageFormArray(control.src);
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

  SetFooterTextFormArray(text: object) {
    this.FooterTextFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach(ele => {
        this.FooterTextFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          text: text[ele.languageCode] || ''
        }));
      });
    }
  }

  UpdateFooterTranslatedText(event, control: FooterControl){
    this.UpdateTextsWithoutTranslation(event);
    control.text = this.TranslatedTexts;
    control.form.get('text').setValue(this.TranslatedTexts);
    this.UpdatedFooterControlDetail(control);
    this.isTranslated = false;
  }


    public GetRequestDocument(WorkFlow: IWorkFlowRequest | IMobileWorkFlowDetail, isDoc?: boolean, isAppointment?: boolean) {
    const documents = [
      this.GetWorkFlowDocument(WorkFlow , isDoc),
      {
        documentType: DocumentType.CustomerRequest,
        document: {}
      }
    ];

    if (isAppointment) {
      documents.push({
        documentType: DocumentType.Appointment,
        document: {}
      });
    }

    return {
      purpose: VariablePurpose.Dynamic,
      documents
    };
  }

  public GetWorkFlowDocument(WorkFlow: IWorkFlowRequest | IMobileWorkFlowDetail , isDoc: boolean ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null
    };
  }

  IncreaseZIndex(){
    this.templateLayoutService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.templateLayoutService.DecreaseZIndex();
  }
}
