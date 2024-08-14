export interface ISchedulerData {
  designerPanel: IDesignerPanel;
  ticketProperties: ITicketProperty;
  announcement: Announcement;
  companyId: string;
  schedulerId: string;
  footerProperties: FooterProperties
}

export interface IDesignerPanel {
  workflowId: string;
  name: string;
  headerColor: string;
  headerBackgroundColor: string;
  imageFileURL: string;
  schedulerType: string;
  showLaviIconInFooter: string;
  enableMultiVerification: string;
  activeBackColor: string;
  activeTextColor: string;
  inActiveBackColor: string;
  inActiveTextColor: string;
  formBackColor: string;
  formTextColor: string;
  primaryButtonBackColor: string;
  primaryButtonTextColor: string;
  primaryButtonText: object,
  secondaryButtonBackColor: string;
  secondaryButtonTextColor: string;
  secondaryButtonText: object;
  showServiceIconsOnly: boolean;
  serviceTabText: object;
  informationTabText: object;
  locationTabText: object;
  appointmentTabText: object;
  reviewTabText: object;
  serviceHeadingText: object,
  informationHeadingText: object,
  locationHeadingText: object,
  appointmentHeadingText: object,
  reviewHeadingText: object,
}

export interface ITicketProperty {
  notifyViaSMS: string;
  notifyViaEmail: string;
  termsAndConditionsUrl: string;
  enableTermsConditions?: string;
}

export interface Announcement {
  color: string;
  backColor: string;
  text: any;
  showAnnouncement: boolean;
}

export interface FooterProperties {
  color: string;
  backColor: string;
  text: any;
}
