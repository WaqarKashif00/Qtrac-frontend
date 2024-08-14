import { Routes } from '@angular/router';
import { OnlyLaviUserGuard } from '../core/guards/only-lavi-user.guard';
import { StoreCurrentPageViewNameGuard } from '../core/guards/store-current-page-view-name.guard';
import { ManageScreenComponent } from '../features/manage-screen/manage-screen.component';
import { RoleActionsPageNameEnum } from '../models/enums/role-actions.enum';

export const ManageRoutes: Routes = [
  {
    path: '',
    canActivateChild: [StoreCurrentPageViewNameGuard],
    children: [
      {
        path: '',
        component: ManageScreenComponent,
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../features/user/user.module').then((m) => m.UserModule),
        data: {
          pageName: RoleActionsPageNameEnum.Users
        },
      },
      {
        path: 'company-configuration',
        loadChildren: () =>
          import(
            '../features/company-configuration/company-configuration.module'
          ).then((m) => m.CompanyConfigurationModule),
        data: {
          pageName: RoleActionsPageNameEnum.CompanyConfiguration,
        },
      },
      {
        path: 'appointment-scheduler',
        loadChildren: () =>
          import(
            '../features/appointment-scheduler/schedulers/schedulers.module'
          ).then((m) => m.SchedulersModule),
        data: {
          pageName: RoleActionsPageNameEnum.SchedulerTemplates,
        },
      },
      {
        path: 'hours-of-operations',
        loadChildren: () =>
          import('../features/scheduler/scheduler.module').then(
            (m) => m.LaviSchedulerModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.HOOTemplates,
        },
      },
      {
        path: 'user-role',
        loadChildren: () =>
          import('../features/user-role/user-role.module').then(
            (m) => m.UserRoleModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.UserRoles,
        },
      },
      {
        path: 'work-flow',
        loadChildren: () =>
          import('../features/work-flow/work-flow.module').then(
            (m) => m.WorkFlowModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.WorkflowTemplates,
        },
      },
      {
        path: 'branches',
        loadChildren: () =>
          import('../features/branch-list/branch-list.module').then(
            (m) => m.BranchListModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.Branches,
        },
      },
      {
        path: 'monitor-template',
        loadChildren: () =>
          import(
            '../features/utility-configuration/monitor/monitor.module'
          ).then((m) => m.MonitorModule),
        data: {
          pageName: RoleActionsPageNameEnum.MonitorTemplates,
        },
      },
      {
        path: 'kiosk-template',
        loadChildren: () =>
          import('../features/utility-configuration/kiosk/kiosk.module').then(
            (m) => m.KioskModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.KioskTemplates,
        },
      },
      {
        path: 'agent-Template',
        loadChildren: () =>
          import(
            '../features/utility-configuration/agent-configuration/agent-configuration.module'
          ).then((m) => m.AgentConfigurationModule),
        data: {
          pageName: RoleActionsPageNameEnum.AgentTemplates,
        },
      },
      {
        path: 'mobile-interfaces',
        loadChildren: () =>
          import('../features/utility-configuration/mobile/mobile.module').then(
            (m) => m.MobileModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.MobileTemplates,
        },
      },
      {
        path: 'home-interfaces',
        loadChildren: () =>
          import('../features/utility-configuration/home-interface/home-interface.module').then(
            (m) => m.HomeInterfaceModule
          ),
        data: {
          pageName: RoleActionsPageNameEnum.HomeInterfaces,
        },
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('../features/company/company.module').then(
            (m) => m.CompanyModule
          ),
        canActivate: [OnlyLaviUserGuard],
        canActivateChild: [OnlyLaviUserGuard],
        data: {
          pageName: RoleActionsPageNameEnum.AllCompanies,
        },
      },
      {
        path: 'all-users',
        loadChildren: () =>
          import('../features/all-user/all-user.module').then(
            (m) => m.AllUserModule
          ),
        canActivate: [OnlyLaviUserGuard],
        canActivateChild: [OnlyLaviUserGuard],
        data: {
          pageName: RoleActionsPageNameEnum.AllUsers
        },
      },
    ],
  },
];
