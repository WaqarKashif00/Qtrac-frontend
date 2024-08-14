import { NgModule } from '@angular/core';
import { UtilityComponent } from './utility.component';
import { RouterModule } from '@angular/router';
import { UtilityRoutes } from 'src/app/routes/utility.routes';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(UtilityRoutes)],
  declarations: [UtilityComponent],
})
export class UtilityModule {}
