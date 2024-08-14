import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import {  WelcomeService } from '../welcome.service';

@Component({
  selector: 'lavi-welcome-property-control',
  templateUrl: 'welcome-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePropertyControlComponent extends AbstractComponent {
  WelcomeButton$: Observable<ButtonControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ControlSelection$:Observable<IMobileControlSelection>
  constructor(private service: WelcomeService) {
    super();
    this.WelcomeButton$ = this.service.WelcomeButton$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.ControlSelection$=this.service.ControlSelection$
  }

  OnButtonDataChange(buttonData:ButtonControl){
    this.service.UpdateButtonData(buttonData);
  }
}
