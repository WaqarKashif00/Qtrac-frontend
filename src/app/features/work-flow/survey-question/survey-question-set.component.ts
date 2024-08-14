import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { PreServiceQuestion, SurveyQuestionSet } from '../../../models/common/work-flow-detail.interface';
import { SupportedLanguage } from '../models/supported-language';
import { QuestionSet } from '../models/work-flow-request.interface';
import { SurveyQuestionSetService } from './survey-question-set.service';

@Component({
  selector: 'lavi-service-questions',
  templateUrl: './survey-question-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SurveyQuestionSetService],
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})
export class SurveyQuestionsComponent extends AbstractComponent {
  OpenQuestionModal$: Observable<boolean>;
  SupportedLanguages$: Observable<SupportedLanguage[]>;
  QuestionSets$: Observable<SurveyQuestionSet[]>;
  Questions$: Observable<PreServiceQuestion[]>;
  QuestionTabSelected$: Observable<boolean>;
  Mode: string;
  constructor(
    private surveyQuestionSetService: SurveyQuestionSetService,
  ) {
    super();
    this.OpenQuestionModal$ = this.surveyQuestionSetService.OpenQuestionSetModal$;
    this.SupportedLanguages$ = this.surveyQuestionSetService.supportedLanguageList$;
    this.QuestionSets$ = this.surveyQuestionSetService.QuestionSets$;
    this.Questions$ = this.surveyQuestionSetService.Questions$;
    this.QuestionTabSelected$ = this.surveyQuestionSetService.QuestionTabSelected$;
  }

  OpenModal() {
    this.Mode = Mode.Add;
    this.surveyQuestionSetService.OpenModal();
    this.surveyQuestionSetService.SelectQuestionTab();
    this.surveyQuestionSetService.InitRequiredAddQuestionConfigurations();
  }

  CloseModal(){
    this.surveyQuestionSetService.CloseModalAndReset();
  }

  Save() {

    if (this.Mode === Mode.Add) {
      this.surveyQuestionSetService.Add();
    }
    if (this.Mode === Mode.Edit) {
      this.surveyQuestionSetService.Edit();
    }
  }

  Edit(questionSet: QuestionSet) {
    this.Mode = Mode.Edit;
    this.surveyQuestionSetService.SetEditFormGroup(questionSet);
    this.surveyQuestionSetService.SetEditQuestionSetQuestions(questionSet.questions);
    this.surveyQuestionSetService.InitRequiredAddQuestionConfigurations();
    this.surveyQuestionSetService.OpenModal();
    this.surveyQuestionSetService.SelectQuestionTab();
  }

  Delete(id: string) {
    this.surveyQuestionSetService.Delete(id);
  }
}
