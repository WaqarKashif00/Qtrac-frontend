import {
  ChangeDetectionStrategy, Component
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { BorderSizes, FontStyles } from 'src/app/models/constants/font.constant';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { IQuestionSet } from '../../../Models/question-set.interface';
import { ServiceDDL } from '../../../Models/servies-drop-down.interface';
import { ServiceQuestionService } from '../service-question.service';

@Component({
  selector: 'lavi-service-question-property-control',
  templateUrl: './service-question-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceQuestionPropertyControlComponent extends AbstractComponent {
  ButtonsList$: Observable<Array<ButtonControl>>;
  Panel$: Observable<ServicePanelControl>;
  ControlList$: Observable<Array<ServiceDDL>>;
  QuestionList$: Observable<Array<IQuestionSet>>;
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonTranslateModalTitle$: Observable<string>;
  ButtonImageFormArray$: Observable<FormArray>;
  ControlSelection$: Observable<IControlSelection>;

  FontStyle: Array<string> = FontStyles;
  OpenImageModal = false;
  BorderSizes = BorderSizes;

  constructor(private service: ServiceQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.ServiceQuestionPanel$;
    this.ControlList$ = this.service.ServiceQuestionControlList$;
    this.QuestionList$ = this.service.ServiceQuestionQuestionSet$;
    this.ButtonsList$ = this.service.ButtonsList$;
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.ButtonTextFormArray$;
    this.ButtonTranslateModalTitle$ = this.service.ButtonTranslateModalTitle$;
    this.ButtonImageFormArray$ = this.service.ButtonImageFormArray$;
    this.ControlSelection$=this.service.ControlSelection$;
  }

  OnItemsDropDownChange(event) {
    this.service.ShowServiceQuestionItemsPropertyWindowById(event.target.value);
  }
  OnQuestionSetDropDownChange(event) {
    this.service.ShowQuestionSet(event.target.value);
  }

  OnChangeMode(event) {
    this.service.ChangeMode(event);
  }
  OnChangeButton(event){
    this.service.ChangeButton(event.target.value);
  }

  OnButtonDropdownChange(event){
    this.service.ShowButtonPropertyWindow(event);
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
