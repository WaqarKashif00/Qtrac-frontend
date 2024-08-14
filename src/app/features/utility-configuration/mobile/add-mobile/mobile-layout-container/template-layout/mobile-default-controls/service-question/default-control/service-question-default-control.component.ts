import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ServiceQuestionService } from '../service-question.service';
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobilePageDetails } from '../../../../../../models/pages.interface';
import { IMobileWorkFlowDetail } from '../../../../../../models/mobile-work-flow-detail.interface';

@Component({
  selector: 'lavi-mobile-service-question-default-control',
  templateUrl: './service-question-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceQuestionDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  WorkFlowData: IMobileWorkFlowDetail;

  constructor(private service: ServiceQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.ServiceQuestionPanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.WorkFlowData = this.service.WorkFlowData;
  }

  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  Click(){
    this.service.PanelClick()
  }
}

