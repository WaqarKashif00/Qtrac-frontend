import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from '../../../../base/abstract-component';
import { KioskDeRegistrationService } from './kiosk-de-registration.service';

@Component({
  selector: 'lavi-kiosk-de-registration',
  templateUrl: './kiosk-de-registration.component.html',
  styleUrls: ['./kiosk-de-registration.component.scss'],
  providers: [KioskDeRegistrationService,
  ]
})

export class KioskDeRegistrationComponent extends AbstractComponent {

  IsKioskDeRegisteredSuccessFully$: Observable<boolean>;

  constructor(private readonly kioskDeRegistrationService: KioskDeRegistrationService) {
    super();
    this.IsKioskDeRegisteredSuccessFully$ = this.kioskDeRegistrationService.IsKioskDeRegisteredSuccessFully$;
  }

  Init() {
    this.kioskDeRegistrationService.DeRegisterKiosk();
  }
}
