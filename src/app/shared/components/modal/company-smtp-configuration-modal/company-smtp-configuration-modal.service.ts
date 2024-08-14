import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { laviSMTPSetting } from 'src/app/models/common/smtp-setting.interface';
import {
  DefaultCompanyConfigValues,
  Encryptions,
  GMAIL_SMTP_SERVER,
  SMTPServiceProvider,
  SMTP_SETTINGS_SAVE_SUCCESS
} from 'src/app/models/constants/company-configuration.constants';
import { Validations } from 'src/app/models/constants/validation.constant';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { CustomRequiredDropDownValidator } from 'src/app/shared/validators/common.validator';

@Injectable()
export class CompanySMTPConfigurationModalService extends AbstractComponentService {
  CompanySMTPConfigForm: FormGroup;

  private SelectedSMTPServiceProviderSubject: BehaviorSubject<string>;
  SelectedSMTPServiceProvider$: Observable<string>;

  private VerificationDisplayTextSubject: BehaviorSubject<string>;
  VerificationDisplayText$: Observable<string>;

  private CloseModalSubject: BehaviorSubject<boolean>;
  CloseModal$: Observable<boolean>;

  get SMTPServiceProviderControl() {
    return this.CompanySMTPConfigForm.get('serviceProvider');
  }
  get SMTPServerControl() {
    return this.CompanySMTPConfigForm.get('smtpServer');
  }
  get PortNumberControl() {
    return this.CompanySMTPConfigForm.get('portNumber');
  }
  get EncryptionControl() {
    return this.CompanySMTPConfigForm.get('encryption');
  }
  get ClientIdControl() {
    return this.CompanySMTPConfigForm.get('clientId');
  }
  get ClientSecretControl() {
    return this.CompanySMTPConfigForm.get('clientSecret');
  }
  get RefreshTokenControl() {
    return this.CompanySMTPConfigForm.get('refreshToken');
  }
  get PasswordControl() {
    return this.CompanySMTPConfigForm.get('password');
  }

  get SendGridAPIKeyControl() {
    return this.CompanySMTPConfigForm.get('sendGridAPIKey');
  }

  constructor(
    private readonly companyAPIService: CompanyAPIService,
    private readonly sharedCompanyConfigurationService: SharedCompanyConfigurationService
  ) {
    super();
    this.InitObservables();
    this.InitFormGroup();
    this.SubscribeControlOnValueChange();
  }

  private InitObservables() {
    this.SelectedSMTPServiceProviderSubject = new BehaviorSubject<string>(null);
    this.SelectedSMTPServiceProvider$ =
      this.SelectedSMTPServiceProviderSubject.asObservable();

    this.CloseModalSubject = new BehaviorSubject<boolean>(false);
    this.CloseModal$ = this.CloseModalSubject.asObservable();
    this.VerificationDisplayTextSubject = new BehaviorSubject<string>(
      'UnVerified'
    );
    this.VerificationDisplayText$ =
      this.VerificationDisplayTextSubject.asObservable();
  }

  private InitFormGroup() {
    this.CompanySMTPConfigForm = this.formBuilder.group({
      serviceProvider: [
        DefaultCompanyConfigValues.SMTPServiceProviderDefaultValue,
        CustomRequiredDropDownValidator(),
      ],
      smtpServer: [
        null,
        [Validators.required, Validators.pattern(Validations.SMTPRegx)],
      ],
      portNumber: [0],
      encryption: [DefaultCompanyConfigValues.EncryptionListDefaultValue],
      username: [
        null,
        [Validators.required, Validators.pattern(Validations.EmailRegX)],
      ],
      password: [null],
      clientId: [null],
      clientSecret: [null],
      refreshToken: [null],
      sendGridAPIKey: [null]
    });
  }

  private SubscribeControlOnValueChange() {
    this.SMTPServiceProviderControl.valueChanges.subscribe(({ value }) => {
      this.SelectedSMTPServiceProviderSubject.next(value);
      const isGmailServiceProvider = [
        SMTPServiceProvider.Gmail.value,
        SMTPServiceProvider.GmailOAuth2.value,
      ].includes(value);
      if (isGmailServiceProvider) {
        this.SMTPServerControl.setValue(GMAIL_SMTP_SERVER);
        this.PortNumberControl.setValue(587);
      } else {
        this.SMTPServerControl.setValue(null);
      }

      if (value === SMTPServiceProvider.GmailOAuth2.value) {
        this.ClientIdControl.setValidators(Validators.required);
        this.ClientSecretControl.setValidators(Validators.required);
        this.RefreshTokenControl.setValidators(Validators.required);

        this.EncryptionControl.setValue(
          DefaultCompanyConfigValues.EncryptionListDefaultValue
        );
        this.PortNumberControl.clearValidators();
        this.EncryptionControl.clearValidators();
        this.PasswordControl.clearValidators();
        this.SendGridAPIKeyControl.clearValidators();
      } else if(value === SMTPServiceProvider.SendGrid.value) {
        this.SendGridAPIKeyControl.setValidators(Validators.required);


        this.PortNumberControl.clearValidators();
        this.ClientIdControl.clearValidators();
        this.ClientSecretControl.clearValidators();
        this.RefreshTokenControl.clearValidators();
        this.PasswordControl.clearValidators();
        this.SMTPServerControl.clearValidators();
      } else {
        this.PortNumberControl.setValidators([
          Validators.pattern(Validations.PortRegx),
        ]);
        this.PasswordControl.setValidators(Validators.required);

        this.ClientIdControl.clearValidators();
        this.ClientSecretControl.clearValidators();
        this.RefreshTokenControl.clearValidators();
        this.SendGridAPIKeyControl.clearValidators();
      }

      this.PasswordControl.updateValueAndValidity();
      this.ClientIdControl.updateValueAndValidity();
      this.ClientSecretControl.updateValueAndValidity();
      this.RefreshTokenControl.updateValueAndValidity();
      this.PortNumberControl.updateValueAndValidity();
      this.EncryptionControl.updateValueAndValidity();
      this.SendGridAPIKeyControl.updateValueAndValidity();
      this.SMTPServerControl.updateValueAndValidity();
    });
  }

  GetAndUpdateFormAndProperties() {
    this.companyAPIService.GetLaviSMTPSettings().subscribe((settings) => {
      if (!settings) {
        return;
      }
      this.CompanySMTPConfigForm.patchValue({
        serviceProvider:
          this.sharedCompanyConfigurationService.GetSMTPServiceProviderObject(
            settings
          ),
        smtpServer: settings.smtpServer,
        portNumber: settings.portNumber,
        encryption: this.GetEncryption(settings.encryption),
        username: settings.username,
      });

      if (settings.username) {
        this.VerificationDisplayTextSubject.next('Verified');
      }
    });
  }

  private GetEncryption(value: string) {
    return Encryptions.find((e) => {
      e.value === value;
    });
  }

  Update(form: FormGroup) {
    this.formService.CallFormMethod(form).then((response: any) => {
      const request: laviSMTPSetting = {
        clientId: response.clientId,
        clientSecret: response.clientSecret,
        encryption: response.encryption ? response.encryption.value : null,
        password: response.password,
        portNumber: response.portNumber,
        refreshToken: response.refreshToken,
        serviceProvider: response.serviceProvider.value,
        smtpServer: response.smtpServer,
        username: response.username,
        sendGridAPIKey: response.sendGridAPIKey
      };
      this.companyAPIService.UpdateLaviSMTPSettings(request).subscribe(() => {
        this.CloseModalSubject.next(true);
        this.AppNotificationService.Notify(SMTP_SETTINGS_SAVE_SUCCESS);
      });
    });
  }

  ResetForm() {
    this.CompanySMTPConfigForm.reset({
      serviceProvider:
        DefaultCompanyConfigValues.SMTPServiceProviderDefaultValue,
      smtpServer: null,
      portNumber: 0,
      encryption: DefaultCompanyConfigValues.EncryptionListDefaultValue,
      userName: null,
      password: null,
      clientId: null,
      clientSecret: null,
      refreshToken: null,
      sendGridAPIKey: null
    });
  }
}
