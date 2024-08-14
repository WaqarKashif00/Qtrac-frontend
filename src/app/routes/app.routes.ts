import { Routes } from '@angular/router';
import { AuthenticationGuard } from '../core/guards/authentication.guard';
import { KioskExecutionGuard } from '../core/guards/kiosk-execution.guard';
import { DeviceRegistrationGuard } from '../core/guards/kiosk-registration.guard';
import { LoginGuard } from '../core/guards/login.guard';
import { StoreCurrentPageViewNameGuard } from '../core/guards/store-current-page-view-name.guard';
import { RoleAccessResolver } from '../core/resolver/role-access.resolver';
import { ShortURLHandlerComponent } from '../core/short-url-handler/short-url-handler.component';
import { AuthComponent } from '../features/auth/auth.component';
import { BaseLayoutComponent } from '../features/auth/base-layout/base-layout.component';
import { ErrorComponent } from '../features/error/error.component';
import { InvalidPathComponent } from '../features/invalid-path/invalid-path.component';
import { LandingPageComponent } from '../features/login/landing-page/landing-page.component';
import { LoginComponent } from '../features/login/login.component';
import { TbauthComponent } from '../features/tbauth/tbauth.component';
import { UnauthorizeComponent } from '../features/unauthorize/unauthorize.component';
import { HomeInterfacePreviewComponent } from '../features/utility-configuration/home-interface/home-interface-preview/home-interface-preview.component';
import { MonitorPreviewComponent } from '../features/utility-configuration/monitor/add-monitor/monitor-preview/monitor-preview.component';
import { RoleActionsPageNameEnum } from '../models/enums/role-actions.enum';

export let appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
  },
  {
    path: 'auth',
    component: LandingPageComponent,
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
  },
  {
    path: '',
    component: AuthComponent,
    resolve: {
      roleAccess: RoleAccessResolver,
    },
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [StoreCurrentPageViewNameGuard],
        children: [
          {
            path: 'home',
            loadChildren: () =>
              import('../features/home/home.module').then((m) => m.HomeModule),
              data: { pageName: RoleActionsPageNameEnum.Dashboard  },
          },
          {
            path: 'manage',
            loadChildren: () =>
              import('../features/manage-screen/manage-screen.module').then((m) => m.ManageScreenModule),
          },
          // {
          //   path: 'snap-shot',
          //   loadChildren: () =>
          //     import('../features/snapshot/snapshot.module').then(
          //       (m) => m.SnapshotModule
          //     ),
          //   data: { pageName: RoleActionsPageNameEnum.SnapshotTemplate },
          // },
          {
            path: 'snap-shot',
            loadChildren: () =>
              import('../features/snapshot2/snap2.module').then(
                (m) => m.Snap2Module
              ),
            data: { pageName: RoleActionsPageNameEnum.Snap2Template },
          },

          {
            path: 'agent',
            loadChildren: () =>
              import(
                '../features/utility-configuration/agent/agent.module'
              ).then((m) => m.AgentModule),
            data: { pageName: RoleActionsPageNameEnum.AgentTemplates+ '-RUN' },
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
        ],
      }
    ],
  },
  {
    path: 'kiosk-execution',
    loadChildren: () =>
      import(
        '../features/utility-configuration/kiosk/kiosk-execution/kiosk-execution.module'
      ).then((m) => m.KioskExecutionModule),
    canActivate: [KioskExecutionGuard],
    canActivateChild: [KioskExecutionGuard],
  },
  {
    path: 'tbauth/:tokenId',
    component: TbauthComponent
  },
  {
    path: 'kiosk-preview',
    loadChildren: () =>
      import(
        '../features/utility-configuration/kiosk/kiosk-add/kiosk-preview/kiosk-preview.module'
      ).then((x) => x.KioskPreviewModule),
  },
  { path: 'monitor-preview', component: MonitorPreviewComponent },
  {
    path: 'monitor-execution',
    loadChildren: () =>
      import(
        '../features/utility-configuration/monitor/monitor-execution/monitor-execution.module'
      ).then((m) => m.MonitorExecutionModule),
    canActivate: [KioskExecutionGuard],
    canActivateChild: [KioskExecutionGuard],
  },
  {
    path: 'clone-monitor/:deviceId',
    loadChildren: () =>
      import(
        '../features/utility-configuration/monitor/clone-monitor/clone-monitor.module'
      ).then((m) => m.CloneMonitorModule),
    // canActivate: [KioskExecutionGuard],
    // canActivateChild: [KioskExecutionGuard],
  },
  {
    path: 'device-registration',
    loadChildren: () =>
      import(
        '../features/utility-configuration/kiosk/kiosk-registration/kiosk-registration.module'
      ).then((m) => m.KioskRegistrationModule),
    canActivate: [DeviceRegistrationGuard],
    canActivateChild: [DeviceRegistrationGuard],
  },
  {
    path: 'device-deregistration',
    loadChildren: () =>
      import(
        '../features/utility-configuration/kiosk/kiosk-de-registration/kiosk-de-registration.module'
      ).then((m) => m.KioskDeRegistrationModule),
  },
  {
    path: 'kiosk-shutdown',
    loadChildren: () =>
      import(
        '../features/utility-configuration/kiosk/kiosk-shutdown/kiosk-shutdown.module'
      ).then((m) => m.KioskShutDownModule),
  },
  {
    path: 'mobile-preview',
    loadChildren: () =>
      import(
        '../features/utility-configuration/mobile/preview-mobile/preview-mobile.module'
      ).then((x) => x.MobilePreviewModule),
  },
  {
    path: 'mobile-execution',
    loadChildren: () =>
      import(
        '../features/utility-configuration/mobile/execution-mobile/execution-mobile.module'
      ).then((m) => m.ExecutionMobileModule),
  },
  {
    path: 'mobile-monitor',
    loadChildren: () =>
      import(
        '../features/utility-configuration/mobile/monitor-mobile/monitor-mobile.module'
      ).then((m) => m.MonitorMobileModule),
  },
  {
    path: 'scheduler-execution',
    loadChildren: () =>
      import(
        '../features/appointment-scheduler/scheduler-execution/scheduler-execution.module'
      ).then((m) => m.AppointmentSchedulerExecutionModule),
  },
  {
    path: 'confirm-appointment',
    loadChildren: () =>
      import(
        '../features/appointment-scheduler/scheduler-execution/scheduler-execution.module'
      ).then((m) => m.AppointmentSchedulerExecutionModule),
  },
  { path: 'home-interface-preview', component: HomeInterfacePreviewComponent },
  {
    path: 'r/:prefix/:shortform',
    component: ShortURLHandlerComponent,
  },
  {
    path: 'unauthorize',
    component: UnauthorizeComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '**',
    component: InvalidPathComponent,
  },
];
