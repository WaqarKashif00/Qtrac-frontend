import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { ConditionRouting, PreServiceQuestion } from '../../../models/common/work-flow-detail.interface';
import { SupportedLanguage } from '../models/supported-language';
import { QuestionSet } from '../models/work-flow-request.interface';
import { QuestionSetService } from './question-set.service';

@Component({
  selector: 'lavi-service-questions',
  templateUrl: './service-questions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QuestionSetService],
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})
export class ServiceQuestionsComponent extends AbstractComponent {
  OpenQuestionModal$: Observable<boolean>;
  SupportedLanguages$: Observable<SupportedLanguage[]>;
  QuestionSets$: Observable<QuestionSet[]>;
  Questions$: Observable<PreServiceQuestion[]>;
  ConditionRoutings$: Observable<ConditionRouting[]>;
  Routings$: Observable<GroupResult[]>;
  QuestionTabSelected$: Observable<boolean>;
  Mode: string;
  constructor(
    private questionSetService: QuestionSetService,
  ) {
    super();
    this.OpenQuestionModal$ = this.questionSetService.OpenQuestionSetModal$;
    this.SupportedLanguages$ = this.questionSetService.supportedLanguageList$;
    this.QuestionSets$ = this.questionSetService.QuestionSets$;
    this.Questions$ = this.questionSetService.Questions$;
    this.ConditionRoutings$ = this.questionSetService.ConditionalRoutings$;
    this.Routings$ = this.questionSetService.Routings$;
    this.QuestionTabSelected$ = this.questionSetService.QuestionTabSelected$;
  }

  OpenModal() {
    this.Mode = Mode.Add;
    this.questionSetService.OpenModal();
    this.questionSetService.SelectQuestionTab();
    this.questionSetService.InitRequiredAddQuestionConfigurations();
  }

  CloseModal(){
    this.questionSetService.PushQueueAndQuestionSetInRoutingSubject();
    this.questionSetService.CloseModalAndReset();
  }

  Save() {

    if (this.Mode === Mode.Add) {
      this.questionSetService.Add();
    }
    if (this.Mode === Mode.Edit) {
      this.questionSetService.Edit();
    }
  }

  Edit(questionSet: QuestionSet) {
    this.Mode = Mode.Edit;
    this.questionSetService.SetEditFormGroup(questionSet);
    this.questionSetService.SetEditQuestionSetQuestions(questionSet.questions);
    this.questionSetService.SetEditQuestionSetConditionalRouting(questionSet.conditionRoutings);
    this.questionSetService.InitRequiredAddQuestionConfigurations();
    this.questionSetService.OpenModal();
    this.questionSetService.SelectQuestionTab();
  }

  Delete(id: string) {
    this.questionSetService.Delete(id);
  }
}
