import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { LanguageService } from '../language.service';

@Component({
  selector: 'lavi-language-property-control',
  templateUrl: 'language-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePropertyControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ControlSelection$:Observable<IMobileControlSelection>

  constructor(private service: LanguageService) {
    super();
    this.Panel$ = this.service.LanguagePanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.ControlSelection$=this.service.ControlSelection$
  }
  UpdatePanelData(panelData: PanelControl) {
    this.service.UpdatePanelData(panelData);
  }
}
