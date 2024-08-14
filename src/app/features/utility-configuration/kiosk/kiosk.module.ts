import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KioskRoutes } from 'src/app/routes/utility-configuration.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { KioskAddModule } from './kiosk-add/kiosk-add.module';
import { KioskExecutionModule } from './kiosk-execution/kiosk-execution.module';
import { KioskComponent } from './kiosk.componet';
import { KioskService } from './kiosk.service';

@NgModule({
  declarations: [KioskComponent],
  imports: [
    SharedModule,
    KioskAddModule,
    KioskExecutionModule,
    RouterModule.forChild(KioskRoutes),
  ],
  providers: [KioskService]
})
export class KioskModule {}
