import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IWorkFlowRequest } from 'src/app/features/work-flow/models/work-flow-request.interface';
import { DocumentType, VariablePurpose, VariableRequestDocument } from 'src/app/models/enums/variables-related';
import { TranslateService } from '../../../../../../../core/services/translate.service';
import { IDynamicVariable } from '../../../../../../../models/common/dynamic-variable.interface';
import { ILanguageControl } from '../../../../../../../models/common/language-control.interface';
import { IControlSelection } from '../../Models/controls-selection.interface';
import { Control } from '../../Models/controls/control';
import { DesignerPanelControl } from '../../Models/controls/designer-panel.control';
import { LabelControl } from '../../Models/controls/label.control';
import { DDLControl } from '../../Models/drop-down-control.interface';
import { IWorkFlowDetail } from '../../Models/work-flow-detail.interface';
import { MonitorTemplateService } from '../monitor-template-service';

@Injectable()
export class MonitorPropertyService extends AbstractComponentService {
  private AllControlsSubject: BehaviorSubject<Array<DDLControl>>;
  AllControls$: Observable<Array<DDLControl>>;
  private DesignerPanelSubject: BehaviorSubject<DesignerPanelControl>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  private LabelTextFormArraySubject: BehaviorSubject<FormArray>;
  LabelTextFormArray$: Observable<FormArray>;
  private OpenTranslateDialogSubject: BehaviorSubject<boolean>;
  OpenTranslateDialog$: Observable<boolean>;
  ImageFormArray$: Observable<FormArray>;
  private VideoFormArraySubject: BehaviorSubject<FormArray>;
  VideoFormArray$: Observable<FormArray>;
  private SliderFormArraySubject: BehaviorSubject<FormArray>;
  SliderFormArray$: Observable<FormArray>;
  IsEditMode$: Observable<boolean>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  ControlSelection$: Observable<IControlSelection>;
  Languages = [];
  LabelTranslatedTexts = {};
  isTranslated = false;
  QueueData$:Observable<any>;

  constructor(private templateService: MonitorTemplateService, private translateService: TranslateService) {
    super();
    this.InitializeSubject();
    this.SubscribeObservables();
  }

  private InitializeSubject() {
    this.AllControlsSubject = new BehaviorSubject<Array<DDLControl>>([]);
    this.AllControls$ = this.AllControlsSubject.asObservable();
    this.DesignerPanelSubject = new BehaviorSubject<DesignerPanelControl>(null);
    this.DesignerPanel$ = this.DesignerPanelSubject.asObservable();
    this.LabelTextFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.LabelTextFormArray$ = this.LabelTextFormArraySubject.asObservable();
    this.OpenTranslateDialogSubject = new BehaviorSubject<boolean>(false);
    this.OpenTranslateDialog$ = this.OpenTranslateDialogSubject.asObservable();
    this.IsEditMode$ = this.templateService.IsEditMode$;
    this.ImageFormArray$ = this.templateService.ImageFormArray$;
    this.VideoFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.VideoFormArray$ = this.VideoFormArraySubject.asObservable();
    this.SliderFormArraySubject = new BehaviorSubject<FormArray>(this.formBuilder.array([]));
    this.SliderFormArray$ = this.SliderFormArraySubject.asObservable();
    this.DynamicVariables$ = this.templateService.DynamicVariables$;
    this.ControlSelection$=this.templateService.ControlSelection$;
    this.QueueData$ = this.templateService.QueueData$;

  }

  get Workflow(){
    return this.templateService.Workflow
  }
  private SubscribeObservables() {
    this.subs.sink = this.templateService.ManageControls$.subscribe((x) => {
      this.AllControlsSubject.next(x);
    });
    this.subs.sink = this.templateService.DesignerPanel$.subscribe((x) => {
      this.DesignerPanelSubject.next(Object.assign({}, x));
    });
    this.subs.sink = this.templateService.Languages$.subscribe(lang =>{
      this.Languages = lang;
    });
    this.subs.sink = this.AllControls$.subscribe(
      (ddl) => {
        this.SetVideoFormArray([]);
      }
    );
  }

  ShowCurrentSelectOtherControlPropertyWindow(value: string) {
    this.templateService.ShowServicesOtherControlPropertyWindow(value);
  }

  UpdateData(control: Control) {
    this.templateService.ChangeServiceControlData(control);
  }

  OpenDialog(control: LabelControl){
    this.LabelTranslatedTexts = control.text;
    this.SetTextFormArray(this.LabelTranslatedTexts);
    this.OpenTranslateDialogSubject.next(true);
  }

  CloseDialog(){
    this.OpenTranslateDialogSubject.next(false);

  }

   SetTextFormArray(text: object) {
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

  TranslateText(textToTranslate: string, control: LabelControl) {
    if (textToTranslate) {
      this.subs.sink = this.translateService
        .GetTranslatedTexts(textToTranslate, this.GetRequestDocument(this.Workflow,true))
        .subscribe((TranslateResponses) => {
          if (TranslateResponses && TranslateResponses.length !== 0) {
            this.isTranslated = true;
            this.LabelTranslatedTexts = this.templateService.ConvertTranslatedLanguageArrayToObject(TranslateResponses);
            this.SetTextFormArray(this.LabelTranslatedTexts);
          }
        });
    }
  }

  UpdateTranslatedTextsInForm(event, control: LabelControl){
    this.UpdateTextsWithoutTranslation(event);
    control.text = this.LabelTranslatedTexts;
    control.form.get('text').setValue(this.LabelTranslatedTexts);
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
      this.LabelTranslatedTexts = this.templateService.ConvertTranslatedLanguageArrayToObject(labelTexts);
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

  SetImageForm(src: ILanguageControl[]){
    this.templateService.SetImageFormArray(src);
  }

  SetVideoFormArray(src: ILanguageControl[]) {
    this.VideoFormArraySubject.next(this.formBuilder.array([]));
    if (this.Languages) {
      this.Languages.forEach((ele) => {
        this.VideoFormArraySubject.value.push(this.formBuilder.group({
          language: ele.language,
          languageCode: ele.languageCode,
          [ele.languageCode]: (src && src.length > 0 && typeof(src) !== 'string') ?
           src.find(x => x.languageCode === ele.languageCode)?.url : [],
          url: (src && src.length > 0 && typeof(src) !== 'string') ? src.find(x => x.languageCode === ele.languageCode)?.url : []
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
    }
  }

  public GetWorkFlowDocument(WorkFlow: IWorkFlowRequest | IWorkFlowDetail , isDoc: boolean ): VariableRequestDocument {
    return {
      documentType: DocumentType.Workflow,
      id: isDoc ? null : WorkFlow.workFlowId,
      pk: isDoc ? null : WorkFlow.pk,
      document: isDoc ? WorkFlow : null
    };
  }
  IncreaseZIndex(){
    this.templateService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.templateService.DecreaseZIndex();
  }
}
