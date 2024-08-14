import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TranslateService } from 'src/app/core/services/translate.service';
import { IWorkFlowRequest } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { DocumentType, VariablePurpose, VariableRequestDocument } from 'src/app/models/enums/variables-related';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { DynamicVariable } from '../../../../../../work-flow/models/conditional-events';
import { Control } from '../../Models/controls/control';
import { DesignerPanelControl } from '../../Models/controls/designer-panel.control';
import { LabelControl } from '../../Models/controls/label.control';
import { DDLControl } from '../../Models/drop-down-control.interface';
import { IWorkFlowDetail } from '../../Models/kiosk-layout-data.interface';
import { KioskTemplateService } from '../kiosk-template.service';
import { PageProperties } from '../../Models/controls/page-properties';

@Injectable()
export class KioskPropertyService extends AbstractComponentService {

  private AllControlsSubject: BehaviorSubject<Array<DDLControl>>;
  AllControls$: Observable<Array<DDLControl>>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  private PagePropertiesSubject: BehaviorSubject<PageProperties>;
  PageProperties$: Observable<PageProperties>;
  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  IsEditMode$: Observable<boolean>;
  ImageFormArray$: Observable<FormArray>;
  private VideoFormArraySubject: BehaviorSubject<FormArray>;
  VideoFormArray$: Observable<FormArray>;
  private SliderFormArraySubject: BehaviorSubject<FormArray>;
  SliderFormArray$: Observable<FormArray>;
  DynamicVariables$: Observable<DynamicVariable[]>;
  private IsOtherControlPropertyWindowOpenSubject: BehaviorSubject<boolean>;
  IsOtherControlPropertyWindowOpen$: Observable<boolean>;
  Languages = [];
  TranslatedTexts = {};
  isTranslated = false;

  get Workflow(){
    return this.kioskTemplateService.Workflow;
  }

  constructor(private kioskTemplateService: KioskTemplateService, private translateService: TranslateService) {
    super();
    this.InitializeSubject();
    this.SubscribeObservables();
  }

  private SubscribeObservables() {
    this.subs.sink = this.kioskTemplateService.LanguageList$.subscribe(lang => {
      this.Languages = lang;
    });
    this.subs.sink = this.kioskTemplateService.ServicePageData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.WelcomePgeData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.ThankYouData$.subscribe((x) => {
      this.AllControlsSubject.next(x.otherControls);
      this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
    });
    this.subs.sink = this.kioskTemplateService.PreServiceQuestionData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.ServiceQuestionData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.DesignerPanel$.subscribe((x) => {
      this.DesignerPanelSubject.next(x);
    });
    this.subs.sink = this.kioskTemplateService.PageProperties$.subscribe((x) => {
      this.PagePropertiesSubject.next(x);
    });
    this.subs.sink = this.kioskTemplateService.LanguagePageData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.NoQueuePageData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );
    this.subs.sink = this.kioskTemplateService.OffLinePageData$.subscribe(
      (x) => {
        this.AllControlsSubject.next(x.otherControls);
        this.IsOtherControlPropertyWindowOpenSubject.next(x.controlSelection.IsOtherControlsSelected);
      }
    );

    this.subs.sink = this.AllControls$.subscribe(
      (ddl) => {
        this.SetVideoFormArray([]);
      }
    );
  }

  private InitializeSubject() {
    this.AllControlsSubject = new BehaviorSubject<Array<DDLControl>>([]);
    this.AllControls$ = this.AllControlsSubject.asObservable();
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.PagePropertiesSubject = new BehaviorSubject<PageProperties>(null);
    this.PageProperties$ = this.PagePropertiesSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.IsEditMode$ = this.kioskTemplateService.IsEditMode$;
    this.ImageFormArray$ = this.kioskTemplateService.ImageFormArray$;
    this.VideoFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.VideoFormArray$ = this.VideoFormArraySubject.asObservable();
    this.SliderFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.SliderFormArray$ = this.SliderFormArraySubject.asObservable();
    this.IsOtherControlPropertyWindowOpenSubject = new BehaviorSubject<boolean>(false);
    this.IsOtherControlPropertyWindowOpen$ = this.IsOtherControlPropertyWindowOpenSubject.asObservable();
    this.DynamicVariables$ = this.kioskTemplateService.DynamicVariables$;
  }

  ShowCurrentSelectOtherControlPropertyWindow(value: string) {
    this.kioskTemplateService.ShowServicesOtherControlPropertyWindow(value);
  }

  UpdateData(control: Control) {
    this.kioskTemplateService.ChangeServiceControlData(control);
  }

  OpenDialog(control: LabelControl) {
    this.TranslatedTexts = control.text;
    this.SetTextFormArray(this.TranslatedTexts);
    this.OpenTranslateDialogSubject.next(true);
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
        .GetTranslatedTexts(textToTranslate, this.GetRequestDocument(this.Workflow, true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.TranslatedTexts = this.kioskTemplateService.ConvertTranslatedLanguageArrayToObject(TranslateResponses);
            this.SetTextFormArray(this.TranslatedTexts);
          }
        });
    }
  }

  UpdateTranslatedTexts(event, control: LabelControl) {
    this.UpdateTextWithoutTranslation(event);
    control.text = this.TranslatedTexts;
    control.form.get('text').setValue(this.TranslatedTexts);
    this.UpdateData(control);
    this.CloseDialog();
    this.isTranslated = false;
  }

  private UpdateTextWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.isTranslated)) {
      const labelTexts = [];
      for (const e of event) {
        labelTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.kioskTemplateService.ConvertTranslatedLanguageArrayToObject(labelTexts);
    }
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

  SetImageForm(src: ILanguageControl[]) {
    this.kioskTemplateService.SetImageFormArray(src);
  }

  SetVideoFormArray(src: ILanguageControl[]) {
    this.VideoFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele, index) => {
        this.VideoFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: (src && src.length > 0 && typeof (src) !== 'string')
            ? src.find(x => x.languageCode === ele.languageCode)?.url : [],
          url: (src && src.length > 0 && typeof (src) !== 'string') ? src.find(x => x.languageCode === ele.languageCode)?.url : []
        }));
      });
    }
    this.VideoFormArraySubject.next(Object.create(this.VideoFormArraySubject.value));
  }

  SetSliderFormArray(src) {
    this.SliderFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        const langObj = (src && src.length > 0 && typeof (src) !== 'string') ? src.find(x => x.languageCode === ele.languageCode) : [];
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

  public GetRequestDocument(WorkFlow: IWorkFlowRequest | IWorkFlowDetail, isDoc?: boolean, isAppointment?: boolean) {
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

  public GetWorkFlowDocument(WorkFlow: IWorkFlowRequest|IWorkFlowDetail , isDoc: boolean ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null
    };
  }
  IncreaseZIndex(){
    this.kioskTemplateService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskTemplateService.DecreaseZIndex();
  }
}
