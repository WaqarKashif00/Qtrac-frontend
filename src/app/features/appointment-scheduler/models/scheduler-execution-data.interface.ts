import { ITime } from '../../scheduler/hours-of-operations/hours-of-operation.interface';

export interface ISchedulerExecutionalData {
  id: string;
  descriptions: string[];
  queueId: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  appointmentTime: ITime;
  schedulerId: string;
  appointmentStatus: string;
  appointmentDate: string;
  appointmentUniqueIdentifier: string;
  mobileTemplateId:string;
  appointmentUTCDate: string;
  globalQuestion: IQuestionItem[];
  serviceQuestionsSet: IQuestionItem[];
  serviceQuestionsSetIds: IQuestionSetIds;
  customerPhoneNumber: string;
  customerEmailAddress: string;
  isAgreeTermsAndCondition: boolean;
  isDeleted?: boolean;
  appointmentDetails: IAppointmentDetails;
  hoursOfOperationOverride?: any;
  hoursOfoperationOverrideId?: string;
}

export interface IAppointmentDetails {
  selectedDate: Date;
  firstAvailable: boolean;
  selectDifferentDate: boolean;
  maxAppointmentBookingDate: Date;
}

export interface IQuestionSet {
  questionSetId: string;
  routeTo: IRoute;
  questions: IQuestionItem[];
}

export interface IQuestionSetIds {
  ids: string[];
  currentQuestionSetId: string;
  previousQuestionSetId: string;
}

export interface IQuestionItem {
  itemId: string;
  itemText: string;
  itemTypeSetting: any;
  itemType: string;
  answer: any;
  required: boolean;
  isVisible: boolean;
  setId: string;
  isValid?: boolean;
  isQuestionVisible: boolean;
  sortPosition?: number;
}
export interface IQuestionItemDetail {
  languageId: string;
  IsDefault: boolean;
  question: string;
}
export interface IRoute {
  id: string;
  type: string;
  group: string;
}
