import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SupportedLanguage } from '../../models/supported-language';

@Component({
  selector: 'lavi-pre-service-questions-add',
  templateUrl: './pre-service-questions-add.component.html',
})
export class PreServiceQuestionsAddComponent extends AbstractComponent {
  @Input() OpenQuestionDialog: boolean;
  @Input() SupportedLanguages: SupportedLanguage[];
  @Output() Close: EventEmitter<void> = new EventEmitter();
  @Output() SaveForm: EventEmitter<FormGroup> = new EventEmitter();
  @Input() Mode: string;
  

  Save(form: FormGroup) {
    this.SaveForm.emit(form);
  }

  CloseModal() {
    this.Close.emit();
  }
}
