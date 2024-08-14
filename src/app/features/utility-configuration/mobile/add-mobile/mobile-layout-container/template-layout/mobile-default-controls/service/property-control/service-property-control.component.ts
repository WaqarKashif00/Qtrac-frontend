import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { ServicesService } from '../services.service';

@Component({
  selector: 'lavi-service-property-control',
  templateUrl: 'service-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePropertyControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  Buttons$: Observable<ButtonControl[]>;
  ControlSelection$:Observable<IMobileControlSelection>

  constructor(private service: ServicesService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.ServicePanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.Buttons$ = this.service.ServiceButtons$;
    this.ControlSelection$=this.service.ControlSelection$;
  }

  UpdatePanelData(panelData: PanelControl) {
    this.service.UpdatePanelData(panelData);
  }

  OnButtonDataChange(buttonData: ButtonControl){
    this.service.UpdateButtonData(buttonData);
  }

}
