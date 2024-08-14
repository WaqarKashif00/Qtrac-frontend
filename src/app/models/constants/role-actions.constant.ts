import { RoleActionsPageNameEnum, RoleActionTypeEnum } from "../enums/role-actions.enum";

export const RoleActions = {
  Users: {
    actionName: RoleActionsPageNameEnum.Users,
    urlSupport: [
      { action: RoleActionTypeEnum.AddEdit, urls: [] },
      { action: RoleActionTypeEnum.View, urls: [] },
    ],
  },
  UserRole: 'User Role',
  CompanyConfiguration: 'Company Configuration',
  WorkflowTemplates: 'Workflow Templates',
  AgentTemplates: 'Agent Templates',
  KioskTemplates: 'Kiosk Templates',
  MonitorTemplates: 'Monitor Templates',
  HOOTemplates: 'Hours of Operations Templates',
  SchedulerTemplates: 'Scheduler Template',
  Branches: 'Locations',
  GeneralReports: 'General Reports',
  AuditReports: 'Audit Reports',
  LogsAnalytics: 'Logs/ Analytics',
  BranchGeneralConfiguration: 'General Configurations',
  BranchContactInfo: 'Contact Info.',
  BranchKioskConfigurations: 'Kiosk Configurations',
  BranchMonitorConfigurations: 'Monitor Configurations',
  BranchDeskConfigurations: 'Desk Configurations',
  BranchMobileInterface: 'Mobile Interface',
  Help: 'Help',
};
