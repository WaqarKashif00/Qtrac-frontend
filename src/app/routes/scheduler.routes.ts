import { Routes } from '@angular/router';
import { SchedulerComponent } from 'src/app/features/scheduler/scheduler.component';
import { HoursOfOperationsComponent } from '../features/scheduler/hours-of-operations/hours-of-operations.component';

export const SchedulerRoutes: Routes = [
  { path: '', component: SchedulerComponent },
  {
    path: 'add-hours-of-operations',
    component: HoursOfOperationsComponent, 
  },
  {
    path: 'edit-hours-of-operations',
    component: HoursOfOperationsComponent,
  } 
];
