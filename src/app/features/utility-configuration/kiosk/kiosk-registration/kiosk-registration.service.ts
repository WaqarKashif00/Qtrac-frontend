import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';
import { KioskType } from '../../../../models/enums/kiosk-type.enum';

@Injectable()
export class KioskRegistrationService extends AbstractComponentService {

  DeviceId$: Observable<string>;

  constructor(private readonly companyAPIService: CompanyAPIService, private router: ActivatedRoute) {
    super();
    this.DeviceId$ = this.azureSignalRService.kioskDeviceCodeSubject.asObservable();
    this.subs.sink = this.azureSignalRService.SubmitCodeResponseSubject.subscribe(
      (token) => {
        let kioskData = JSON.parse(token)
        const kioskType = kioskData.kioskType
        this.browserStorageService.SetKioskExecutionToken(kioskData);  // replace this with setting values

        if (kioskType === KioskType.Kiosk) {
          this.routeHandlerService.RedirectToKioskExecutionPage();
        }
        if (kioskType === KioskType.Monitor) {
          this.routeHandlerService.RedirectToMonitorExecutionPage();
        }
      }
    );
  }

  initAzureSignalRService() {
    this.azureSignalRService.initSignalRConnectionWithGetDeviceId(this.getBrowserId());
  }

//   private getBrowserId() {
//     let tokenPayload = this.GetDecodeKioskExecutionToken(this.browserStorageService.kioskExecutionToken);
//     return !tokenPayload ? this.uuid : tokenPayload.browserId;
//   }

//   private GetDecodeKioskExecutionToken(token) {

//     return new JwtHelperService().decodeToken(token);
//   }
// }




private getBrowserId() {
  if(this.browserStorageService.kioskExecutionToken){
    let browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    return !browserId ? this.uuid : browserId;
  } else{
    return this.uuid
  }
}

private GetDecodeKioskExecutionToken(token) {
  if(token == null){
    return null
  } else{
    return token
  }
}
}
