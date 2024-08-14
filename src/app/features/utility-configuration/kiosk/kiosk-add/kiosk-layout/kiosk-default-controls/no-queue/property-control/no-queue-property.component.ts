import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { NoQueueService } from '../no-queue.service';

@Component({
  selector: 'lavi-no-queue-property-control',
  templateUrl: './no-queue-property.component.html',
})
export class NoQueuePropertyControlComponent extends AbstractComponent {
  ButtonsList$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;
  NoQueuePageControlSelected$: Observable<IControlSelection>;
  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  constructor(private service: NoQueueService) {
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
    this.NoQueuePageControlSelected$ =
      this.service.NoQueuePageControlSelected$;
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
