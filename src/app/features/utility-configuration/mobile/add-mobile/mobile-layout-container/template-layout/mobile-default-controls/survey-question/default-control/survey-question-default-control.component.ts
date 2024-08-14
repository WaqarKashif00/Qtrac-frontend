import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SurveyQuestionService } from '../survey-question.service'
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobilePageDetails } from '../../../../../../models/pages.interface';
import { IMobileWorkFlowDetail } from '../../../../../../models/mobile-work-flow-detail.interface';

@Component({
  selector: 'lavi-mobile-survey-question-default-control',
  templateUrl: './survey-question-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyQuestionDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  WorkFlowData: IMobileWorkFlowDetail;

  constructor(private service: SurveyQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.SurveyQuestionPanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.WorkFlowData = this.service.WorkFlowData;
  }

  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  Click() {
    this.service.PanelClick()
  }
}

