import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { OffLineService } from '../off-line.service';

@Component({
  selector: 'lavi-off-line-property-control',
  templateUrl: './off-line-property.component.html',
})
export class OffLinePropertyControlComponent extends AbstractComponent {
  ButtonsList$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;
  OffLinePageControlSelected$: Observable<IControlSelection>;
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  constructor(private service: OffLineService) {
    super();
  }

  Init() {
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.ButtonTextFormArray$;
    this.ButtonImageFormArray$ = this.service.ImageFormArray$;
    this.ButtonsList$ = this.service.ButtonsList$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.OffLinePageControlSelected$ =
      this.service.OffLinePageControlSelected$;
  }

  Translate(text: string) {
    this.service.TranslateText(text);
  }

  OpenTranslateDialog(name: string) {
    this.service.OpenDialog(name);
  }

  CloseTranslateDialog() {
    this.service.CloseDialog();
  }

  UpdateTranslatedTextsInForm(event) {
    this.service.UpdateTranslatedTextsInForm(event[0], event[1]);
  }

  UpdateButtons(buttons: ButtonControl[]) {
    this.service.UpdateButtonData(buttons);
  }

  ButtonDropdownChange(name: string) {
    this.service.SetPropertyWindow(name);
  }

  OpenButtonImageModal(name: string) {
    this.service.OpenButtonImageDialog(name);
  }

  ApplyImageChanges(event) {
    this.service.UpdateButtonControl(event[0], event[1]);
  }
}
