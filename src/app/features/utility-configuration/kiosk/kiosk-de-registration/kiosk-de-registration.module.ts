import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { KioskDeRegistrationComponent } from './kiosk-de-registration.component';

const KioskDeRegistrationRoutes: Routes = [{
  path: '',
  component: KioskDeRegistrationComponent
}]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(KioskDeRegistrationRoutes),
  ],
  declarations: [
    KioskDeRegistrationComponent,
  ],
})
export class KioskDeRegistrationModule { }
