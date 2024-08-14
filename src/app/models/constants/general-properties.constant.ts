import { AllowNotifyEmail, AllowNotifySms, EnableMultiVerification, EnableTermsConditions, SchedulerType, ShowIconInFooter } from '../enums/appointment-scheduler.enum';

export const ShowIconInFooterItems = [ShowIconInFooter.YES, ShowIconInFooter.NO];
export const EnableMultiVerificationItems = [EnableMultiVerification.ENABLED, EnableMultiVerification.DISABLED];
export const AllowNotifySmsItems = [AllowNotifySms.YES, AllowNotifySms.NO];
export const AllowNotifyEmailItems = [AllowNotifyEmail.YES, AllowNotifyEmail.NO];
export const EnableTermsConditionsItems = [EnableTermsConditions.YES, EnableTermsConditions.NO];
export const SchedulerTypeItems = [
  SchedulerType.LocationFirst,
  SchedulerType.ServiceFirst,
  SchedulerType.QuestionFirst
];
export const CountryCodes = [1, 7, 48, 81, 91, 20, 54, 61, 973, 55];
