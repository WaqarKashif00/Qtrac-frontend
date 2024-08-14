import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CompanyLoginMode } from 'src/app/models/common/company-login-mode.interface';
import { IHeaderDetails } from 'src/app/models/common/header-details.interface';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';

@Injectable()
export class AuthService extends AbstractComponentService {
  HeaderDetails: BehaviorSubject<IHeaderDetails>;

  constructor(private readonly companyAPIService: CompanyAPIService) {
    super();
    this.HeaderDetails = new BehaviorSubject<IHeaderDetails>({
      exitPath: null,
      isShowConfigurationHeader: false,
      title: null,
    });
  }

  GetCompanyLoginMode() {
    this.mediatorService.CompanyId$.subscribe((companyId) => {
      if (!companyId) {
        return;
      }
      this.companyAPIService
        .GetLoginMode<CompanyLoginMode>(companyId)
        .subscribe((companyLoginMode) => {
          this.mediatorService.SetCompanyLoginMode(companyLoginMode.loginMode);
        });
    });
  }
}
