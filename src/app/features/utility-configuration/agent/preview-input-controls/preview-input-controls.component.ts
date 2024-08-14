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
import { IKioskPanelItemsData } from '../../kiosk/kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-preview-input-controls',
  templateUrl: './preview-input-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-input-controls.component.scss']
})
export class PreviewInputControlsComponent extends AbstractComponent {
  @Input() Item: IKioskPanelItemsData;
  @Input() IsDisabled: boolean;
  @Input() DefaultCountry: string;

  @Output() ControlChange: EventEmitter<void> = new EventEmitter();
  Init(): void {
    this.Item.isValid = true;
  }
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
        this.ValidationMessage = valid ? '' : ValidationMessages.Email.Invalid;
        return valid;
      }

      if (this.Item.itemType == QuestionType.PhoneNumber.value || this.Item.itemType == QuestionType.SMSPhoneNumber.value) {
        valid = this.Item.isValid;
        this.ValidationMessage = valid ? '' : ValidationMessages.PhoneNumber.Invalid;
        return valid;
      }
      return true;
    }

    if (this.Item.required && !this.Item.answer) {
      this.ValidationMessage = 'Required.';
      return false;
    }

  }

  RadioClick(value) {
    this.Item.answer = value;
    this.Changed();
  }

  Changed(data =null) {
    if(this.Item.itemType ==this.QuestionTypes.Date.value || this.Item.itemType ==this.QuestionTypes.Time.value ) {
      this.Item.answer= data;
    }
    this.IsErrorsToShow = true;
  }

  PhoneNumberChanged(phoneNumber: string) {
    this.Item.answer = phoneNumber;
    this.Item.isValid = true;
    this.Changed();
  }
  InvalidPhoneNumberChanged(phoneNumber: string) {
    this.ValidationMessage = (phoneNumber)
                                  ? ValidationMessages.PhoneNumber.Invalid
                                  : (this.Item.required)
                                        ? ValidationMessages.PhoneNumber.Required
                                        : '';
    this.Item.answer = phoneNumber;
    this.Item.isValid = false;
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
