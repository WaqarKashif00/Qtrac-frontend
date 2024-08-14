import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from '../../../../../models/constants/validation.constant';
import { QuestionType } from '../../../../../models/enums/question-type.enum';
import { IMobilePreviewServiceQuestionPageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-service-question-page',
  templateUrl: './preview-execution-service-question-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionServiceQuestionPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewServiceQuestionPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;
  @Input() IsNextButtonClick: boolean;
  @Input() companyId: string;

  @Output() OnNextButtonClick: EventEmitter<void> = new EventEmitter();
  
  Init() {
    this.IsNextButtonClick = false;
  }
  ShowNextPage() {
    this.IsNextButtonClick = true;
    if (this.IsAllDataValid()) {
      this.OnNextButtonClick.emit();
      this.IsNextButtonClick = false;
    }

  }
  IsAllDataValid() {
    if (!(this.Data.items?.length > 0)) {
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
