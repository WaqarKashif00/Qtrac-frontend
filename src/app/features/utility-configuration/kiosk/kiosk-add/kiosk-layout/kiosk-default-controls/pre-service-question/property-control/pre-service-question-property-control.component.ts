import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { BorderSizes, FontStyles } from 'src/app/models/constants/font.constant';
import { Language } from 'src/app/models/enums/language-enum';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { ServiceDDL } from '../../../Models/servies-drop-down.interface';
import { PreServiceQuestionService } from '../pre-service-question.service';

@Component({
  selector: 'lavi-pre-service-question-property-control',
  templateUrl: './pre-service-question-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreServiceQuestionPropertyControlComponent extends AbstractComponent {
  Panel$: Observable<ServicePanelControl>;
  ControlList$: Observable<Array<ServiceDDL>>;
  ButtonsList$: Observable<Array<ButtonControl>>;
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonTranslateModalTitle$: Observable<string>;
  ButtonImageFormArray$: Observable<FormArray>;
  ControlSelection$: Observable<IControlSelection>;


  DefaultLanguageCode = Language.English;
  FontStyle: Array<string> = FontStyles;
  OpenImageModal = false;
  BorderSizes = BorderSizes;

  constructor(private service: PreServiceQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.PreServiceQuestionPanel$;
    this.ControlList$ = this.service.PreServiceQuestionControlList$;
    this.ButtonsList$ = this.service.ButtonsList$;
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.ButtonTextFormArray$;
    this.ButtonTranslateModalTitle$ = this.service.ButtonTranslateModalTitle$;
    this.ButtonImageFormArray$ = this.service.ButtonImageFormArray$;
    this.ControlSelection$=this.service.ControlSelection$;

  }

  OnItemsDropDownChange(event) {
    this.service.ShowItemsPropertyWindowById(event.target.value);
  }

  OnButtonDropdownChange(name: string){
    this.service.ShowButtonPropertyWindow(name);
  }

  OpenTranslateDialog(name: string){
    this.service.OpenDialog(name);
  }

  CloseTranslateDialog(){
    this.service.CloseDialog();
  }

  Translate(text: string){
    this.service.TranslateText(text);
  }

  UpdateTranslatedTextInForm(event){
    this.service.UpdateFormWithTranslatedTexts(event[0], event[1]);
  }

  UpdateButtons(buttons: ButtonControl[]){
    this.service.UpdateButtonData(buttons);
  }

  OpenImageDialog(name: string){
    this.OpenImageModal = true;
    this.OpenButtonImageModal(name);
  }

  OpenButtonImageModal(name: string){
    this.service.OpenButtonImageDialog(name);
  }

  ApplyImageChanges(event){
    this.service.UpdateButtonControl(event[0], event[1]);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }
}
