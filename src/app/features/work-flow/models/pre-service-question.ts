import { ILanguage } from './language.interface';
export interface IPreServiceQuestion {
  id: string;
  type: string;
  shortName: string;
  maxLength: string;
  questionSet: Array<ILanguage>;
  isRequired: boolean;
  isPersonalIdentifier: boolean;
  isPurge: boolean;
  isVisible: boolean;
}

export interface IOptionArgs {
  isConditionalEvent?: boolean;
  isConditionalRouting?: boolean;
  isCustomerNotification?: boolean;
  isAppointmentRules?: boolean;
  isActionAndAlert?: boolean;
}
