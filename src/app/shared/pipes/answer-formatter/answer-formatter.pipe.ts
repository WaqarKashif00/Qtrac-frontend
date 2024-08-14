import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { GetFormatterPhoneNumber } from '../../../core/utilities/core-utilities';
import { IQuestion } from '../../../features/utility-configuration/agent/models/agent-models';
import { QuestionType } from '../../../models/enums/question-type.enum';

@Pipe({
  name: 'laviAnswerFormat'
})
export class LaviAnswerFormatterPipe implements PipeTransform {

  constructor(private readonly datePipe: DatePipe) { }

  transform(question: IQuestion, ...args: any[]): any {

    if (!question) { return '-'; }

    if (!question.answer) { return '-'; }

    if (question.questionType === QuestionType.Date.value) {
      return this.datePipe.transform(question.answer);
    }

    if (question.questionType === QuestionType.PhoneNumber.value) {
      return GetFormatterPhoneNumber(question.answer);
    }

    if (question.questionType === QuestionType.Time.value) {
      return this.datePipe.transform(question.answer, 'shortTime');
    }

    return question.answer;
  }
}
