import { Routes } from '@angular/router';
import { AddEditHomeInterfaceComponent } from '../features/utility-configuration/home-interface/add-edit-home-interface/add-edit-home-interface.component';
import { HomeInterfaceComponent } from '../features/utility-configuration/home-interface/home-interface.component';
import { KioskAddComponent } from '../features/utility-configuration/kiosk/kiosk-add/kiosk-add.component';
import { KioskComponent } from '../features/utility-configuration/kiosk/kiosk.componet';
import { AddMobileComponent } from '../features/utility-configuration/mobile/add-mobile/add-mobile.component';
import { MobileComponent } from '../features/utility-configuration/mobile/mobile.component';
import { AddMonitorComponent } from '../features/utility-configuration/monitor/add-monitor/add-monitor.component';
import { CloneMonitorComponent } from '../features/utility-configuration/monitor/clone-monitor/clone-monitor.component';
import { MonitorComponent } from '../features/utility-configuration/monitor/monitor.component';

export const KioskRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: KioskComponent,
      },
      {
        path: 'add-kiosk-template',
        component: KioskAddComponent,
      },
      {
        path: 'edit-kiosk-template',
        component: KioskAddComponent,
      },
    ],
  }];

export const MonitorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MonitorComponent,
      },
      {
        path: 'add-monitor-template',
        component: AddMonitorComponent,
      },
      {
        path: 'edit-monitor-template',
        component: AddMonitorComponent,
      },
      {
        path: 'clone-monitor',
        component: CloneMonitorComponent
      }
    ],
  },
];

export const MobileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MobileComponent,
      },
      {
        path: 'add-mobile-interface',
        component: AddMobileComponent,
      },
      {
        path: 'edit-mobile-interface',
        component: AddMobileComponent,
      },
    ],
  },
];


export const HomeInterfaceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeInterfaceComponent,
      },
      {
        path: 'add-home-interface',
        component: AddEditHomeInterfaceComponent,
      },
      {
        path: 'edit-home-interface',
        component: AddEditHomeInterfaceComponent,
      },
    ],
  },
];
