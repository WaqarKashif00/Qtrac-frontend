import {
  ChangeDetectionStrategy, Component
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { ServiceDDL } from '../../../Models/servies-drop-down.interface';
import { ServicesService } from '../services.service';

@Component({
  selector: 'lavi-service-property-control',
  templateUrl: './service-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePropertyControlComponent extends AbstractComponent {
  Panel$: Observable<ServicePanelControl>;
  ControlList$: Observable<Array<ServiceDDL>>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  Buttons$: Observable<ButtonControl[]>;
  TextFormArray$: Observable<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  ControlSelection$: Observable<IControlSelection>;

  constructor(private service: ServicesService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.ServicePanel$;
    this.ControlList$ = this.service.ServiceControlList$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
    this.Buttons$ = this.service.ServiceButtons$;
    this.TextFormArray$ = this.service.ButtonTextFormArray$;
    this.ButtonImageFormArray$ = this.service.ButtonImageFormArray$;
    this.ControlSelection$=this.service.ControlSelection$;
  }

  OnItemsDropDownChange(event) {
    this.service.ShowItemsPropertyWindowById(event.target.value);
  }
  OnSelectionChange(event) {
    this.service.SetValuesAsSelected(event);
  }

  OpenTranslateDialog(name: string){
    this.service.OpenDialog(name);
  }

  Translate(text: string){
    this.service.TranslateText(text);
  }

  UpdateTranslatedTextInForm(event){
    this.service.UpdateFormWithTranslatedTexts(event[0], event[1]);
  }

  UpdateButtons(event){
    this.service.UpdateButtonData(event);
  }

  OnButtonDropdownChange(name: string){
    this.service.ShowButtonPropertyWindow(name);
  }

  OpenButtonImageModal(name: string){
    this.service.OpenButtonImageDialog(name);
  }

  ApplyImageChanges(event){
    this.service.UpdateButtonControl(event[0], event[1]);
  }
}
