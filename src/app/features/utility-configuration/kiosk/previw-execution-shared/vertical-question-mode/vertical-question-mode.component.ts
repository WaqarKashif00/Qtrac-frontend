import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { QuestionType } from 'src/app/models/enums/question-type.enum';
import { IKioskPreviewPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-vertical-question-mode',
  templateUrl: './vertical-question-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vertical-question-mode.component.scss']
})
export class VerticalQuestionModeComponent extends AbstractComponent {
  @Input() Data: IKioskPreviewPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;

  @Output() ShowNextPage: EventEmitter<string> = new EventEmitter();
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter();

  Index: number;
  IsSaveClick: boolean;
  BackButtonName = 'Back Button';
  AppointmentButtonName = 'Appointment Button';
  OpenAppointmentModal = false;
  Buttons = [
    this.BackButtonName,
    this.AppointmentButtonName
  ];

  Init() {
    this.IsSaveClick = false;
  }

  showNextPage(event) {
    if (event === this.BackButtonName) {
      this.ShowNextPage.emit(event);
    } else if (event === this.AppointmentButtonName) {
      this.OpenAppointmentDialog();
    }
    else {
      this.IsSaveClick = true;
      if (this.IsAllDataValid()) {
        this.ShowNextPage.emit(event);
      }
    }
  }

  OpenAppointmentDialog() {
    this.OpenAppointmentModal = true;
  }

  CloseAppointmentDialog() {
    this.OpenAppointmentModal = false;
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }

  IsAllDataValid() {
    if (!(this.Data.items.length > 0)) {
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

    });

  }

}
