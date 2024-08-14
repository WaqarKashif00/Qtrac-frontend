import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ServicesService } from '../services.service';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';

@Component({
  selector: 'lavi-service-default-control',
  templateUrl: './service-default-control.component.html',
})
export class MobileServiceDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<PanelControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  Buttons$: Observable<ButtonControl[]>;

  constructor(private service: ServicesService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.ServicePanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.Buttons$ = this.service.ServiceButtons$;
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
  OnClick() {
    this.service.OnPanelClick();
  }
  OnButtonClick() {
    this.service.OnButtonClick();
  }
}
