import { Routes } from '@angular/router';
import { SchedulerDesignerComponent } from '../features/appointment-scheduler/schedulers/scheduler-designer/scheduler-designer.component';
import { SchedulersComponent } from '../features/appointment-scheduler/schedulers/schedulers.component';

export const AppointmentSchedulerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', 
        component: SchedulersComponent,
      },
      {
        path: 'add-appointment-scheduler',
        component: SchedulerDesignerComponent, 
      },
      {
        path: 'edit-appointment-scheduler',
        component: SchedulerDesignerComponent, 
      },
    ],
  },
];
