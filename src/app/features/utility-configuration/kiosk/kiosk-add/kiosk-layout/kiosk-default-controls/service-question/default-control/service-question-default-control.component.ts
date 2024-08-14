import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { ServiceBoxControl } from '../../../Models/controls/service-box.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { ButtonControl } from '../../../Models/controls/button.control';
import { ServiceQuestionService } from '../service-question.service';
import { Observable } from 'rxjs';
import { IWorkFlowDetail } from '../../../Models/kiosk-layout-data.interface';

@Component({
  selector: 'lavi-service-question-default-control',
  templateUrl: './service-question-default-control.component.html',
})
export class ServiceQuestionDefaultControlComponent extends AbstractComponent {
  @Input() GridSize = 50;
  @Input() IsOnlyGrid = false;
  @Input() DivLayoutDesignContainer: Component;

  Buttons$: Observable<Array<ButtonControl>>;
  Items$: Observable<Array<ServiceBoxControl>>;
  Panel$: Observable<ServicePanelControl>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  Workflow: IWorkFlowDetail;

  constructor(private service: ServiceQuestionService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Items$ = this.service.ServiceQuestionBoxItems$;
    this.Panel$ = this.service.ServiceQuestionPanel$;
    this.Buttons$ = this.service.ButtonsList$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
    this.Workflow = this.service.Workflow;
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMoveEvent) {
    this.service.MoveEnd(event);
  }
  OnPanelClick(){
    this.service.OnPanelClick()
  }
  OnButtonResizeStop(event: [IResizeEvent, string]) {
    this.service.ButtonResizeStop(event[0], event[1]);
  }
  OnButtonMoveEnd(event: [IMoveEvent, string]) {
    this.service.ButtonMoveEnd(event[0], event[1]);
  }
}
