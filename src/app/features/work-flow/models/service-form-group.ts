import { ServiceOccur } from 'src/app/models/common/work-flow-detail.interface';
import { AppointmentTemplateDropDown, IServiceDescription, IServiceIcon } from './work-flow-request.interface';
import { IWorkingDaysAndDates } from './work-flow-response.interface';

export interface IServiceFormGroup {
  id: string;
  serviceNames: IServiceName[];
  descriptions: IServiceDescription[];
  serviceIconUrls: IServiceIcon[];
  routing: IRouting;
  surveyTemplate: ITemplate;
  ticketTemplate: ITemplate;
  acceptWalkins: boolean;
  acceptAppointments: boolean;
  appointmentTemplate: AppointmentTemplateDropDown;
  averageWaitTime: Number;
  serviceOccur?:ServiceOccur;
  hoursOfOperationId?:string;
  operationalWorkingHours?: IWorkingDaysAndDates;
}

export interface IServiceName {
  languageId: string;
  languageName: string;
  serviceName: string;
  isDefault: boolean;
}

export interface ITemplate {
  id: string;
  type: string;
}

export interface IRouting {
  id: string;
  type: string;
  group: string;
}
