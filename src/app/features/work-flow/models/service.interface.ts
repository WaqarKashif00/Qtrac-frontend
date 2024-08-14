import { IServiceOtherLanguage } from './service-other-language';
export interface IServiceList {
  serviceId: string,
  serviceName: string,
  otherLanguageService: Array<IServiceOtherLanguage>,
  hoursOfOperations: string,
  surveyTemplate: string,
  ticketTemplate: string,
  isAcceptWalkins: boolean,
  isAcceptAppointments: boolean
}
