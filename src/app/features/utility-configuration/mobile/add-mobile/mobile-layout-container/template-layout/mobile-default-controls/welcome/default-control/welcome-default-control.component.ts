import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { WelcomeService } from '../welcome.service';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';

@Component({
  selector: 'lavi-welcome-default-control',
  templateUrl: './welcome-default-control.component.html',
})
export class MobileWelcomeDefaultControlComponent extends AbstractComponent {
  Button$: Observable<ButtonControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;


  constructor(private service: WelcomeService) {
    super();
    this.Button$ = this.service.WelcomeButton$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;

  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  OnClick(){
    this.service.OnButtonClick()
  }
}
