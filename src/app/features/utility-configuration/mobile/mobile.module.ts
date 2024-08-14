import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileRoutes } from 'src/app/routes/utility-configuration.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddMobileModule } from './add-mobile/add-mobile.module';
import { ListMobileModule } from './list-mobiles/list-mobiles.module';
import { MobileListService } from './list-mobiles/list-mobiles.service';
import { MobileComponent } from './mobile.component';
import { MonitorMobileModule } from './monitor-mobile/monitor-mobile.module';

@NgModule({
  imports: [
    ListMobileModule,
    AddMobileModule,
    MonitorMobileModule,
    SharedModule,
    RouterModule.forChild(MobileRoutes),
  ],
  exports: [],
  declarations: [MobileComponent],
  providers: [MobileListService,],
})
export class MobileModule {}
