export interface ISchedulerRequestData {
  mobileTemplateId: string;
  id: string;
  type?: string;
  pk?: string;
  companyId?: string;
  schedulerId:string;
  branchId: string;
  workflowId: string;
  confirmationPageDisplayData: IConfirmationPageDisplay;
  serviceId: string;
  selectedLanguageId: string;
  appointmentDate: string;
  appointmentTime: {
    hours: number;
    minutes: number;
  };
  appointmentTimeUTCString: string;
  appointmentTimeISOString: string;
  appointmentRegistrationTimeUTCString?: string;
  appointmentCheckInTimeUTCString?: string;
  appointmentStatus?: string; // “booked/confirmed/checkedIn/served”
  notificationPreferences: {
    allowSMS: boolean;
    smsNumber: string;
    allowEmail: boolean;
    email: string;
  };
  preServiceQuestions: {
    questionId: string;
    answer: any;
  }[];
  serviceQuestions: {
    questionId: string;
    questionSetId: string;
    answer: any;
  }[];
  isCancelled?: boolean;
  isCancelledExternally?:boolean;
  cancelledBy?: string; // ’CUSTOMER”/ agentId
  cancellationTIMEUTCString?: string;
  hoursOfOperationOverride?: any;
}

export interface IConfirmationPageDisplay {
  schedulerTemplateId: string;
  descriptions: any[];
  appointmentUniqueIdentifier?: string;
  queueId: string;
  branchName: string;
}
