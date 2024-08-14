import { FormBuilder, Validators } from '@angular/forms';
import { Validations } from 'src/app/models/constants/validation.constant';
import { Control } from './control';

export class TicketProperty extends Control {
  notifyViaSMS: string;
  notifyViaEmail: string;
  termsAndConditionsUrl: string;
  enableTermsConditions: string;
  constructor(
    formBuilder: FormBuilder,
    notifyViaSMS: string,
    notifyViaEmail: string,
    termsAndConditionsUrl: string,
    enableTermsConditions:string
  ) {
    super();
    this.InitializeForm(formBuilder, notifyViaSMS, notifyViaEmail, termsAndConditionsUrl,enableTermsConditions);
    this.InitializeVariable(notifyViaSMS, notifyViaEmail, termsAndConditionsUrl,enableTermsConditions);
  }
  InitializeVariable(notifyViaSMS: string, notifyViaEmail: string, termsAndConditionsUrl: string,enableTermsConditions:string) {
    this.notifyViaEmail = notifyViaEmail;
    this.notifyViaSMS = notifyViaSMS;
    this.termsAndConditionsUrl = termsAndConditionsUrl;
    this.enableTermsConditions=enableTermsConditions;
  }
  InitializeForm(
    formBuilder: FormBuilder,
    notifyViaSMS: string,
    notifyViaEmail: string,
    termsAndConditionsUrl: string,
    enableTermsConditions:string
  ) {
    this.form = formBuilder.group({
      notifyViaSMS,
      notifyViaEmail,
      termsAndConditionsUrl: [
        termsAndConditionsUrl,
        [Validators.pattern(Validations.UrlRegX)],
      ],
      enableTermsConditions
    });
  }
}
