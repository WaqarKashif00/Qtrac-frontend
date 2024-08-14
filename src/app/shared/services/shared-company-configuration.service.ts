import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISecuritySetting } from 'src/app/models/common/security-settings.interface';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import {
  DefaultCompanyConfigValues,
  SMTPServiceProvider
} from '../../models/constants/company-configuration.constants';

@Injectable()
export class SharedCompanyConfigurationService {
  IsEnforceReCaptcha$: Observable<boolean>;
  private IsEnforceReCaptchaSubject: BehaviorSubject<boolean>;
  CompanyId: string;
  private SetTheQueryParamValues() {
    this.CompanyId = this.router.snapshot.queryParams['c-id'];
  }
  constructor(
    private readonly companyAPIService: CompanyAPIService,
    private router: ActivatedRoute
  ) {
    this.SetTheQueryParamValues();

    this.IsEnforceReCaptchaSubject = new BehaviorSubject<boolean>(false);
    this.IsEnforceReCaptcha$ = this.IsEnforceReCaptchaSubject.asObservable();
    this.GetExternalCompanySecuritySettings();
  }

  public GetSMTPServiceProviderObject({
    serviceProvider,
  }: {
    serviceProvider: any;
  }) {
    if (!serviceProvider) {
      return DefaultCompanyConfigValues.SMTPServiceProviderDefaultValue;
    }

    if (serviceProvider === SMTPServiceProvider.Gmail.value) {
      return {
        text: SMTPServiceProvider.Gmail.display,
        value: SMTPServiceProvider.Gmail.value,
      };
    } else if (serviceProvider === SMTPServiceProvider.GmailOAuth2.value) {
      return {
        text: SMTPServiceProvider.GmailOAuth2.display,
        value: SMTPServiceProvider.GmailOAuth2.value,
      };
    } else if (serviceProvider === SMTPServiceProvider.SendGrid.value) {
      return {
        text: SMTPServiceProvider.SendGrid.display,
        value: SMTPServiceProvider.SendGrid.value,
      };
    } else {
      return {
        text: SMTPServiceProvider.GeneralSMTP.display,
        value: SMTPServiceProvider.GeneralSMTP.value,
      };
    }
  }

  private GetExternalCompanySecuritySettings() { 
    this.IsEnforceReCaptchaSubject.next(true);
    if (this.CompanyId && this.CompanyId != "null") {
      this.companyAPIService
        .GetExternalCompanySecuritySettings<ISecuritySetting>(this.CompanyId)
        .subscribe((x) => {
          if(x){
          this.IsEnforceReCaptchaSubject.next(x.isEnforceReCaptcha != false);
          }
        });
    }
  }
}
