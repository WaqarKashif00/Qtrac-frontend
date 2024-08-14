import { QuestionType } from 'src/app/models/enums/question-type.enum';

export const MaxlengthQuestionTypes: string[] = [QuestionType.Text.value];
export const MinMaxQuestionTypes: string[] = [QuestionType.Number.value];
export const OptionQuestionTypes: string[] = [QuestionType.DropDown.value, QuestionType.MultiSelect.value, QuestionType.Options.value];


export const DateQuestionTypes: string[] = [QuestionType.Date.value];
export const PhoneNumberAndTimeQuestionTypes: string[] = [QuestionType.PhoneNumber.value, QuestionType.Time.value];
