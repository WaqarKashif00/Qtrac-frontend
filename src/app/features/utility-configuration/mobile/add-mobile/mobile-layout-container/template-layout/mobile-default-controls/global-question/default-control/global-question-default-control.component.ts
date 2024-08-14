import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { GlobalQuestionService } from '../global-question.service';
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { IMobileWorkFlowDetail } from '../../../../../../models/mobile-work-flow-detail.interface';
import { IMobilePageDetails } from '../../../../../../models/pages.interface';

@Component({
  selector: 'lavi-global-question-default-control',
  templateUrl: './global-question-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQuestionDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  Buttons$: Observable<ButtonControl[]>;
  CurrentPage$: Observable<IMobilePageDetails>;
  WorkFlowData: IMobileWorkFlowDetail;

  constructor(private service: GlobalQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.GlobalQuestionPanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.Buttons$ = this.service.GlobalQuestionButtons$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.WorkFlowData = this.service.WorkFlowData;
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }

  OnButtonResizeStop(event: IResizeEvent, name: string) {
    this.service.ButtonResizeStop(event, name);
  }
  OnButtonMoveEnd(event: IMobileMoveEvent, name: string) {
    this.service.ButtonMoveEnd(event, name);
  }
  OnButtonClick(buttonName: string){
   this.service.OnButtonClick(buttonName);
  }
  OnClick(){
    this.service.OnPanelClick();
  }
}
