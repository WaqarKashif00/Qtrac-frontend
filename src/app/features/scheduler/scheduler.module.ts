import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SchedulerComponent } from './scheduler.component';
import { SchedulerRoutes } from 'src/app/routes/scheduler.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { HoursOfOperationsComponent } from './hours-of-operations/hours-of-operations.component';
import { GeneralConfigurationComponent } from './hours-of-operations/general-configuration/general-configuration.component';
import { WorkingHoursComponent } from './hours-of-operations/working-hours/working-hours.component';
import { NonWorkingDaysComponent } from './hours-of-operations/non-working-days/non-working-days.component';
import { HoursComponent } from './hours-of-operations/working-hours/hours/hours.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(SchedulerRoutes)],
  declarations: [
    SchedulerComponent,
    HoursComponent,
    HoursOfOperationsComponent,
    GeneralConfigurationComponent,
    WorkingHoursComponent,
    NonWorkingDaysComponent,
    
  ],
})
export class LaviSchedulerModule {}
