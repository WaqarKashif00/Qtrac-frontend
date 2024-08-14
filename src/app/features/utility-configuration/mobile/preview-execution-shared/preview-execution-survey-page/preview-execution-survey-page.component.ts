import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from '../../../../../models/constants/validation.constant';
import { QuestionType } from '../../../../../models/enums/question-type.enum';
import { IMobilePreviewSurveyPageData, IMobilePreviewWelcomePageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-survey-page',
  templateUrl: './preview-execution-survey-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionSurveyPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewSurveyPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() OnSurveyExitButtonClicked: EventEmitter<any> = new EventEmitter();
  @Input() IsNextButtonClick: boolean;

  ExitSurveyPage() {
    this.IsNextButtonClick = true;
    if (this.IsAllDataValid()) {
      this.OnSurveyExitButtonClicked.emit();
    }
  }

  Init(): void {
    this.IsNextButtonClick = false
  }

  IsAllDataValid() {

    if (!this.Data.items?.length) {
      return true;
    }

    return this.Data.items.every(x => {
      // return false if answer not present on required
      if (x.required && !x.answer) {
        return false;
      }

      // return based on regex check
      if (x.answer && x.itemType === QuestionType.Email.value) {
        return (x.answer).match(Validations.EmailRegX) ? true : false;
      }

      // return based on regex check
      if (x.answer && (x.itemType === QuestionType.PhoneNumber.value || x.itemType === QuestionType.SMSPhoneNumber.value)) {
        return x.isValid;
      }
      // return true if no check invalid
      return true;

    })
  }
}
