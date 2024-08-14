import { IDropdown } from './dropdown.interface';

export interface IPreServiceQuestionFormGroup {
  id: string;
  type: IDropdown;
  shortName: string;
  question: IQuestionFormGroup[];
  maxLength: number;
  option: string;
  options: string[];
  min: number;
  max: number;
  isRequired: boolean;
  isPersonalIdentifier: boolean;
  isPurge: boolean;
  isVisible: boolean;
  isDisplay: boolean;
}

interface IQuestionFormGroup {
  languageId: string;
  languageName: string;
  isDefault: boolean;
  question: string;
}

