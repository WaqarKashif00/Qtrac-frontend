import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedularSharedModule } from '../scheduler-shared/scheduler-shared.module';
import { AppointmentCheckInComponent } from './appointment-check-in/appointment-check-in.component';
import { ExecutionLayoutContainerComponent } from './execution-layout-container/execution-layout-container.component';
import { ExecutionLayoutTemplateComponent } from './execution-layout-container/execution-layout-template/execution-layout-template.component';
import { SchedulerExecutionComponent } from './scheduler-execution.component';

export const AppointmentSchedulerRoutes: Routes = [
  { 
    path : '', component: SchedulerExecutionComponent,
  },
  {
    path : 'check-in', component: AppointmentCheckInComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    SchedularSharedModule,
    RouterModule.forChild(AppointmentSchedulerRoutes),
  ],
  declarations: [
    SchedulerExecutionComponent,
    ExecutionLayoutContainerComponent,
    ExecutionLayoutTemplateComponent,
    AppointmentCheckInComponent
  ],
})
export class AppointmentSchedulerExecutionModule {}
