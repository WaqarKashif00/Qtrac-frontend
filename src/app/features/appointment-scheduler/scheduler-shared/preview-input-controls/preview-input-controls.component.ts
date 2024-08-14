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
import { IQuestionItem } from '../../models/scheduler-execution-data.interface';
import { AppointmentTextInterface } from '../../models/appointment-text.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lavi-preview-input-controls',
  templateUrl: './preview-input-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-input-controls.component.scss']
})
export class PreviewInputControlsComponent extends AbstractComponent {
  @Input() Item: IQuestionItem;
  @Input() IsDisabled: boolean;
  @Input() branchCountryCode: String;
  @Input()  AppointmentTexts: AppointmentTextInterface;
  @Input() customerAppointmentId: String;
  @Output() ControlBlurOrChange: EventEmitter<string> = new EventEmitter();
  FloridaActivityNumberId = "249a8760-cfe6-4b5d-a362-85d85507b403";

  constructor(public router: ActivatedRoute) {
    super();
  }

  Init(): void {
    this.Item.isValid = true;
    this.customerAppointmentId = this.router.snapshot.queryParams['a-id'];
    if(this.customerAppointmentId && this.Item.itemId == this.FloridaActivityNumberId) {
      this.isModified = true;
    } 
  }

  IsModifiedURL:any;
  isModified = false;
  IsErrorsToShow = false;
  ValidationPatterns = Validations;
  ValidationMessage: string;
  QuestionTypes = QuestionType;
 


  get IsValid(): boolean {
    let valid = false;
    if (!this.Item.required && !this.Item.answer){
      return true;
    }

    if (this.Item.answer){
      if (this.Item.itemType == QuestionType.Email.value) {
        valid = (this.Item.answer).match(Validations.EmailRegX);
        this.ValidationMessage = valid ? '' : this.AppointmentTexts?.appointmentInvalidFieldMessage;
        return valid;
      }

      if (this.Item.itemType == QuestionType.PhoneNumber.value || this.Item.itemType == QuestionType.SMSPhoneNumber.value) {
        valid = this.Item.isValid;
        this.ValidationMessage = valid ? '' : this.AppointmentTexts?.appointmentInvalidFieldMessage;
        return valid;
      }
      return true;
    }

    if (this.Item.required && !this.Item.answer) {
      this.ValidationMessage = this.AppointmentTexts?.appointmentRequiredSpecificFieldErrorMessage || 'Required';
      return false;
    }

  }

  RadioClick(value) {
    this.Item.answer = value;
    this.Changed();
  }

  Changed() {
    this.IsErrorsToShow = true;
    this.ControlBlurOrChange.emit(this.Item.itemId);
  }

  PhoneNumberChanged(phoneNumber: string) {
    this.Item.answer = phoneNumber;
    this.Item.isValid = true;
    this.Changed();
  }
  InvalidPhoneNumberChanged(phoneNumber: string) {
    this.ValidationMessage = (phoneNumber)
                                  ? this.AppointmentTexts?.appointmentInvalidFieldMessage
                                  : (this.Item.required)
                                        ? this.AppointmentTexts?.appointmentRequiredSpecificFieldErrorMessage
                                        : '';
    this.Item.answer = phoneNumber;
    this.Item.isValid = false;
    this.Changed();

  }

  DataChanged(data){
    this.Item.answer = data;
    this.Changed();
  }

  GetDateTime(date){
    if (date){
    return new Date(date);
    }else{
      return '';
    }
  }


}

export const ValidationMessages = {
  Email: {
    Required: 'Email required.',
    Invalid: 'Email is invalid.'
  },
  PhoneNumber: {
    Required: 'Phone Number required.',
    Invalid: 'Phone Number is invalid.'
  }
};
