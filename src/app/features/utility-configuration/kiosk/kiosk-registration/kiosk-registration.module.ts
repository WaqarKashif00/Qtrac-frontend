import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from '../../../../../environments/environment';
import { SharedModule } from '../../../../shared/shared.module';
import { KioskRegistrationComponent } from './kiosk-registration.component';

const KioskRegistrationRoutes: Routes = [{
  path: '',
  component: KioskRegistrationComponent
}]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(KioskRegistrationRoutes),
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  declarations: [
    KioskRegistrationComponent,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.production ? '6LfSbCshAAAAAC_FGitXlgD6zXpDTdvdrBDNJD4N':'6LfSbCshAAAAAC_FGitXlgD6zXpDTdvdrBDNJD4N',
      } as RecaptchaSettings,
    }
  ]
})
export class KioskRegistrationModule { }
