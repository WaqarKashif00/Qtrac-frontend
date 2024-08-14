import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SharedCompanyConfigurationService } from 'src/app/shared/services/shared-company-configuration.service';
import { KioskRegistrationService } from './kiosk-registration.service';

@Component({
  selector: 'lavi-kiosk-registration',
  templateUrl: './kiosk-registration.component.html',
  styleUrls: ['./kiosk-registration.component.scss'],
  providers: [KioskRegistrationService, SharedCompanyConfigurationService],
})
export class KioskRegistrationComponent extends AbstractComponent {
  DeviceId$: Observable<string>;
  CaptchaFormControl: FormControl;
  IsDeviceIdVisible: boolean;
  IsEnforceReCaptcha$: Observable<boolean>;

  constructor(
    private readonly kioskRegistrationService: KioskRegistrationService,
    private readonly formBuilder: FormBuilder,
    private readonly sharedCompanyConfigurationService: SharedCompanyConfigurationService
  ) {
    super();
    this.DeviceId$ = this.kioskRegistrationService.DeviceId$;
    this.CaptchaFormControl = this.formBuilder.control(null, Validators.required);
    this.IsDeviceIdVisible = false;
    this.IsEnforceReCaptcha$ = this.sharedCompanyConfigurationService.IsEnforceReCaptcha$;
  }

  createAzureSignalRServiceAndGetOtp() {
    this.IsDeviceIdVisible = true;
    this.kioskRegistrationService.initAzureSignalRService();
  }
}
