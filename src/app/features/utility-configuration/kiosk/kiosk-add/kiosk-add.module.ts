import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KioskRoutes } from 'src/app/routes/utility-configuration.routes';
import { KioskLayoutModule } from './kiosk-layout/kiosk-layout.module';
import { KioskAddComponent } from './kiosk-add.component';

@NgModule({
  declarations: [KioskAddComponent],
  imports: [
    KioskLayoutModule,
    RouterModule.forChild(KioskRoutes),
  ],
  exports:[
    KioskAddComponent,
    KioskLayoutModule
  ]
})
export class KioskAddModule {}
