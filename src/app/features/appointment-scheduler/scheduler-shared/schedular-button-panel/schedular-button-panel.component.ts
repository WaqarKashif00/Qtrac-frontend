import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IValidationMessage } from '../../models/validation-message.interface';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { IAppointmentNotificationPreferences } from '../../models/appointment-notification-preferences.interface';
import { ICurrentLanguage } from '../../models/current-language.interface';
import { AppointmentTextInterface } from '../../models/appointment-text.interface';

@Component({
  selector: 'app-schedular-button-panel',
  templateUrl: './schedular-button-panel.component.html',
  styleUrls: ['./schedular-button-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedCompanyConfigurationService]
})
export class SchedularButtonPanelComponent extends AbstractComponent {
  CaptchaFormControl: FormControl;
  IsEnforceReCaptcha$: Observable<boolean>;

  @Input() SelectedPageName: string;
  @Input() PrimaryButtonColor: string;
  @Input() PrimaryButtonBackColor: string;
  @Input() SecondaryButtonColor: string;
  @Input() SecondaryButtonBackColor: string;
  @Input() ShowContinueButton: boolean;
  @Input() ShowCancelButton: boolean;
  @Input() ShowSubmitButton: boolean;
  @Input() DisableSubmitButton: boolean;
  @Input() ShowModifyAppointmentButton: boolean;
  @Input() AppointmentNotificationPreferences: IAppointmentNotificationPreferences;
  @Input() ValidationMessage: IValidationMessage;
  @Input() PrimaryButtonText: string;
  @Input() SecondaryButtonText: string;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() AppointmentTexts: AppointmentTextInterface

  @Output() OnNextClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnBackClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnSubmitClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnUpdateAppointmentButtonClick: EventEmitter<void> = new EventEmitter<void>();;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly sharedCompanyConfigurationService: SharedCompanyConfigurationService) {
    super();
    this.CaptchaFormControl = this.formBuilder.control(
      null,
      Validators.required
    );
    this.IsEnforceReCaptcha$ = this.sharedCompanyConfigurationService.IsEnforceReCaptcha$

  }

  Init(): void {
    if (this.AppointmentNotificationPreferences?.isEmailAddressChecked || this.AppointmentNotificationPreferences?.isPhonNumberChecked) {

      this.DisableSubmitButton = true;
      // document.getElementById(
      //   "submitButton").style.color = this.PrimaryButtonColor;
      //   document.getElementById(
      //     "submitButton").style.backgroundColor = this.PrimaryButtonBackColor;
    }
    if (!this.SelectedLanguage) {
      this.SelectedLanguage = {
        selectedLanguage: 'en',
        defaultLanguage: 'en'
      }
    }


  }

  OnNextButtonClick() {
    if (!this.CaptchaFormControl) {
      this.CaptchaFormControl = this.formBuilder.control(
        null,
        Validators.required
      );
    }
    this.OnNextClick.emit();
  }
  OnBackButtonClick() {
    this.CaptchaFormControl = this.formBuilder.control(
      null,
      Validators.required
    );
    this.OnBackClick.emit();
  }
  OnSubmitButtonClick() {
    if (this.DisableSubmitButton) {
      this.OnSubmitClick.emit();
    }
    document.getElementById(
      "submitButton").removeAttribute("style");
  }
  OnUpdateAppointmentClick() {
    this.OnUpdateAppointmentButtonClick.emit()
  }
}
