import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { ServiceBoxControl } from '../../../Models/controls/service-box.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { PreServiceQuestionService } from '../pre-service-question.service';
import { Observable } from 'rxjs';
import { ButtonControl } from '../../../Models/controls/button.control';
import { IWorkFlowDetail } from '../../../Models/kiosk-layout-data.interface';

@Component({
  selector: 'lavi-pre-service-question-default-control',
  templateUrl: './pre-service-question-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreServiceQuestionDefaultControlComponent extends AbstractComponent {
  @Input() IsOnlyGrid: boolean;
  @Input() GridSize: number;
  @Input() DivLayoutDesignContainer: Component;

  Items$: Observable<Array<ServiceBoxControl>>;
  Panel$: Observable<ServicePanelControl>;
  Buttons$: Observable<Array<ButtonControl>>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  Workflow: IWorkFlowDetail;

  constructor(private service: PreServiceQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Items$ = this.service.PreServiceQuestionBoxItems$;
    this.Panel$ = this.service.PreServiceQuestionPanel$;
    this.Buttons$ = this.service.ButtonsList$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
    this.Workflow = this.service.Workflow;
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMoveEvent) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.MoveEnd(event);
  }
  OnButtonResizeStop(event: [IResizeEvent, string]) {
    this.service.ButtonResizeStop(event[0], event[1]);
  }
  OnButtonMoveEnd(event: [IMoveEvent, string]) {
    this.service.ButtonMoveEnd(event[0], event[1]);
  }
  OnPanelCLick() {
    this.service.PanelClicks()
  }
  OnButtonClick() {
     this.service.PanelButtonsClick()
  }
}
