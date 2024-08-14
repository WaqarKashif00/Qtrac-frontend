import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { SupportedLanguage } from '../models/supported-language';
import { PreServiceQuestion } from '../../../models/common/work-flow-detail.interface';
import { WorkFlowService } from '../work-flow.service';
import { PreServiceQuestionService } from './pre-service-question.service';

@Component({
  selector: 'lavi-pre-service-questions',
  templateUrl: './pre-service-questions.component.html',
  providers: [PreServiceQuestionService],
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})
export class PreServiceQuestionsComponent extends AbstractComponent {
  openQuestionDialog: boolean;
  preServiceQuestionList$: Observable<PreServiceQuestion[]>;
  supportedLanguageList$: Observable<SupportedLanguage[]>;
  openQuestionDial$: Observable<boolean>;
  Mode: string;

  constructor(private service: PreServiceQuestionService, private workFlowService: WorkFlowService) {
    super();
    this.preServiceQuestionList$ = this.workFlowService.PreServiceQuestions$;
    this.supportedLanguageList$ = this.service.SupportedLanguageList$;
    this.openQuestionDial$ = this.service.openQuestionDial$;
  }

  OpenAddQuestion() {
    this.Mode = Mode.Add;
    this.service.OpenModalAndInitAddConfigurations();
  }


  closeModal() {
    this.service.CloseModalAndResetForm();
  }

  Edit(preServiceQuestion) {
    this.Mode = Mode.Edit;
    this.service.OpenModalAndInitEditConfigurations();
    this.service.SetEditData(preServiceQuestion);
  }

  Delete(id: string) {
    this.service.Delete(id);
  }

  save(form: FormGroup) {
    if (this.Mode === Mode.Add) {
      this.service.Add(form);
    }
    if (this.Mode === Mode.Edit) {
      this.service.Edit(form);
    }
  }

}
