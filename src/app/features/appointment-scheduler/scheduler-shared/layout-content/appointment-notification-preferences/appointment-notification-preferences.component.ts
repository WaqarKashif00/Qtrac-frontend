import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CountryCodes } from 'src/app/models/constants/general-properties.constant';
import { Validations } from 'src/app/models/constants/validation.constant';
import {
  AllowNotifyEmail,
  AllowNotifySms,
  EnableTermsConditions
} from 'src/app/models/enums/appointment-scheduler.enum';
import { IAppointmentNotificationPreferences } from '../../../models/appointment-notification-preferences.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-appointment-notification-preferences',
  templateUrl: './appointment-notification-preferences.component.html',
  styleUrls: [
    './appointment-notification-preferences.component.scss',
    './../../../scheduler-execution/scheduler-execution.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentNotificationPreferencesComponent extends AbstractComponent {
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @Input() AppointmentTexts: AppointmentTextInterface
  constructor() {
    super();
  }
  get IsEmailValid(): boolean {
    let valid: any = false;
    if (
      this.AppointmentNotificationPreferences.isEmailAddressChecked &&
      !this.AppointmentNotificationPreferences.emailAddress
    ) {
      this.EmailValidationMessage = this.AppointmentTexts.appointmentRequiredSpecificFieldErrorMessage;
      return false;
    }
    if (
      this.AppointmentNotificationPreferences.isEmailAddressChecked &&
      this.AppointmentNotificationPreferences.emailAddress
    ) {
      valid = this.AppointmentNotificationPreferences.emailAddress.match(
        Validations.EmailRegX
      );
      this.EmailValidationMessage = valid
        ? ''
        : this.AppointmentTexts.appointmentWrongEmail;
      return valid;
    }
    return true;
  }
  get IsPhoneValid(): boolean {
    let valid: any = false;
    if (
      this.AppointmentNotificationPreferences.isPhonNumberChecked &&
      !this.AppointmentNotificationPreferences.phoneNumber
    ) {
      this.PhoneValidationMessage = this.AppointmentTexts.appointmentRequiredSpecificFieldErrorMessage;
      return false;
    }
    if (
      this.AppointmentNotificationPreferences.isPhonNumberChecked &&
      this.AppointmentNotificationPreferences.phoneNumber
    ) {
      valid = this.AppointmentNotificationPreferences.phoneNumber.match(
        Validations.InternationalPhoneRegex
      );
      this.PhoneValidationMessage = valid
        ? ''
        : this.AppointmentTexts.appointmentWrongPhone;
      return valid;
    }
    return true;
  }
  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() InActiveBackColor: string;
  @Input() ActiveBackColor: string;
  @Input() AppointmentNotificationPreferences: IAppointmentNotificationPreferences;
  @Input() ShowEmail: string;
  @Input() ShowSMS: string;
  @Input() TermsAndConditionsUrl: string;
  @Input() EnableTermsConditions: string;

  @Output() OnPhoneNumberCheckBoxChecked = new EventEmitter<void>();
  @Output() OnEmailCheckBoxChecked = new EventEmitter<void>();
  @Output() OnIAgreeTermsCheck = new EventEmitter<void>();
  @Output() onDisableTermsConditions = new EventEmitter<void>();
  @Output() onDisableSubmitButton = new EventEmitter<any>();

  ValidationPatterns = Validations;
  AllowSMS = AllowNotifySms;
  AllowEMail = AllowNotifyEmail;
  EnableTermsConditionsOptions = EnableTermsConditions;
  CountryCode: Array<number> = CountryCodes;
  EmailValidationMessage: string;
  IsEMailErrorsToShow: boolean;
  PhoneValidationMessage: string;
  IsPhoneNumberErrorsToShow: boolean;

  EMailChanged() {
    this.IsEMailErrorsToShow = true;
  }

  get DisableTermsConditions(){
    return this.EnableTermsConditions===EnableTermsConditions.YES||
           this.EnableTermsConditions==null
  }

  PhoneChanged() {
    this.IsPhoneNumberErrorsToShow = true;
  }
  OnPhoneNumberSelected() {
    this.OnPhoneNumberCheckBoxChecked.emit();
  }
  OnIAgreeTermsChecked(){
    this.OnIAgreeTermsCheck.emit();
  }
  OnEmailSelected() {
    this.OnEmailCheckBoxChecked.emit();
  }

  PhoneNumberChanged(data) {
    this.AppointmentNotificationPreferences.phoneNumber = data;
    this.PhoneChanged();
    this.updateButton();
  }


  updateButton() {
  if(this.AppointmentNotificationPreferences.isEmailAddressChecked && this.AppointmentNotificationPreferences.emailAddress || this.AppointmentNotificationPreferences.isPhonNumberChecked && this.AppointmentNotificationPreferences.phoneNumber) {
    if(this.IsEmailValid || this.IsPhoneValid && this.AppointmentNotificationPreferences.phoneNumber != '') {
      this.onDisableSubmitButton.emit(true);
    } 
  }else {
    this.onDisableSubmitButton.emit(false);
  }
  }
 
}





export const ValidationMessages = {
  Email: {
    Required: 'Email required.',
    Invalid: 'Email is invalid.',
  },
  PhoneNumber: {
    Required: 'Phone Number required.',
    Invalid: 'Phone Number is invalid.',
  },
};
