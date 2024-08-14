import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from '../../../../base/abstract-component-service';
import { KioskAPIService } from '../../../../shared/api-services/kiosk-api.service';

@Injectable()
export class KioskDeRegistrationService extends AbstractComponentService {

  private IsKioskDeRegisteredSuccessFullySubject: BehaviorSubject<boolean>;
  IsKioskDeRegisteredSuccessFully$: Observable<boolean>;

  constructor(private readonly kioskAPIService: KioskAPIService) {
    super();
    this.IsKioskDeRegisteredSuccessFullySubject = new BehaviorSubject<boolean>(false);
    this.IsKioskDeRegisteredSuccessFully$ = this.IsKioskDeRegisteredSuccessFullySubject.asObservable();
  }


  DeRegisterKiosk() {
    if (!this.browserStorageService.kioskExecutionToken) {
      this.IsKioskDeRegisteredSuccessFullySubject.next(true);
      return;
    }
    const  browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    const  branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const  companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const  kioskId = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskId;

    this.kioskAPIService.DeRegisterKiosk(companyId,branchId,browserId,kioskId)
    .subscribe(() => {
      this.RemoveKioskRegistrationStateAndNavigateToRegistrationPage();
      this.IsKioskDeRegisteredSuccessFullySubject.next(true);
      this.browserStorageService.SetDeRegisterSource('kiosk-de-registration.service')

    });

  }

  private RemoveKioskRegistrationStateAndNavigateToRegistrationPage() {
    this.browserStorageService.RemoveKioskExecutionToken();
    this.browserStorageService.RemoveKioskShutDownDetails();
  }

}
