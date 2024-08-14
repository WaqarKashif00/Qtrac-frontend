export enum AppointmentSchedulerPageName {
  NearestBranchSelectionPage = 'NearestBranchSelectionPage',
  PreviouslyVisitedBranchSelectionPage = 'PreviouslyVisitedBranchSelectionPage',
  AvailableServiceSelectionPage = 'AvailableServiceSelectionPage',
  AppointmentSchedulePage = 'AppointmentSchedulePage',
  InformationGatheringPage = 'InformationGatheringPage',
  AppointmentNotificationPreferencePage = 'AppointmentNotificationPreferencePage',
  SuccessPage = 'SuccessPage',
  CancelAppointmentPage = 'CancelAppointmentPage'
}

export enum SchedulerType {
  ServiceFirst = 'Service First',
  LocationFirst = 'Location First',
  QuestionFirst = 'Questions First'
}
export enum ShowIconInFooter {
  YES = 'Yes',
  NO = 'No',
}
export enum EnableMultiVerification {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
}
export enum AllowNotifySms {
  YES = 'Yes',
  NO = 'No',
}
export enum AllowNotifyEmail {
  YES = 'Yes',
  NO = 'No',
}

export enum EnableTermsConditions {
  YES = 'Yes',
  NO = 'No',
}

export enum SharableLinkType {
  All = 'ABS',
  AService = 'AS',
  ABranch = 'AB',
  BranchAndService = 'ASB',
}
