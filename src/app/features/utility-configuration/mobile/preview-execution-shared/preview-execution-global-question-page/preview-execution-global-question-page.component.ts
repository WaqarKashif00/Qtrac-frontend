import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from '../../../../../models/constants/validation.constant';
import { QuestionType } from '../../../../../models/enums/question-type.enum';
import { IMobilePreviewPreServiceQuestionPageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-global-question-page',
  templateUrl: './preview-execution-global-question-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionGlobalPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewPreServiceQuestionPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;
  @Input() companyId: string

  @Output() NextButtonClick: EventEmitter<void> = new EventEmitter();
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter();

  IsNextButtonClick: boolean;
  OpenAppointmentModal = false;

  Init() {
    this.IsNextButtonClick = false;
  }

  ShowNextPage() {
    this.IsNextButtonClick = true;
    if (this.IsAllDataValid()) {
      this.NextButtonClick.emit();
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

  ShowAppointmentDialog() {
    this.OpenAppointmentModal = true;
  }

  CloseAppointmentDialog() {
    this.OpenAppointmentModal = false;
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }

}
