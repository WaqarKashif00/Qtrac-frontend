import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppointmentSchedulerRoutes } from 'src/app/routes/appointment-scheduler.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainerExecutionService } from '../scheduler-execution/execution-layout-container/execution-layout-container.service';
import { AppointmentSchedulerModule } from './scheduler-designer/scheduler-designer.module';
import { SchedulersComponent } from './schedulers.component';
import { SchedulersService } from './schedulers.service';
import { SharableLinkComponent } from './sharable-link/sharable-link.component';

@NgModule({
  imports: [
    SharedModule,
    AppointmentSchedulerModule,
    RouterModule.forChild(AppointmentSchedulerRoutes),
  ],
  providers: [SchedulersService, LayoutContainerExecutionService],
  declarations: [SchedulersComponent, SharableLinkComponent],
})
export class SchedulersModule {}
