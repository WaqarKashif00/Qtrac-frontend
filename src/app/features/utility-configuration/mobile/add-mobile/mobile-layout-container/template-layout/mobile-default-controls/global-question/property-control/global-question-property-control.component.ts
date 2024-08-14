import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { GlobalQuestionService } from '../global-question.service';

@Component({
  selector: 'lavi-global-question-property-control',
  templateUrl: 'global-question-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQuestionPropertyControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  Buttons$: Observable<ButtonControl[]>;
  ControlSelection$: Observable<IMobileControlSelection>;

  constructor(private service: GlobalQuestionService) {
    super();
    this.InitializeObservables();
  }
  private InitializeObservables() {
    this.Panel$ = this.service.GlobalQuestionPanel$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.Buttons$ = this.service.GlobalQuestionButtons$;
    this.ControlSelection$ = this.service.ControlSelection$;
  }

  UpdatePanelData(panelData: PanelControl) {
    this.service.UpdatePanelData(panelData);
  }

  OnButtonDataChange(buttonData: ButtonControl) {
    this.service.UpdateButtonData(buttonData);
  }

  OnItemsDropDownChange(event) {
    this.service.ShowButtonPropertyWindow(event);
  }
}
