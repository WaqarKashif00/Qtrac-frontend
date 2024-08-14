import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KioskShutDownComponent } from './kiosk-shutdown.component';

const KioskShutDownRoutes: Routes = [{
  path: '',
  component: KioskShutDownComponent
}]

@NgModule({
  imports: [
    RouterModule.forChild(KioskShutDownRoutes)
  ],
  declarations: [KioskShutDownComponent],
})
export class KioskShutDownModule { }
