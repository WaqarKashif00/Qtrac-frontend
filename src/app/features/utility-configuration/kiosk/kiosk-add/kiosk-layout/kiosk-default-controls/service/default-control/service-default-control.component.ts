import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { ServiceBoxControl } from '../../../Models/controls/service-box.control';
import { ServicePanelControl } from '../../../Models/controls/service-panel.control';
import { Observable } from 'rxjs';
import { ServicesService } from '../services.service';
import { ButtonControl } from '../../../Models/controls/button.control';

@Component({
  selector: 'lavi-service-default-control',
  templateUrl: './service-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDefaultControlComponent extends AbstractComponent {
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;

  Items$: Observable<Array<ServiceBoxControl>>;
  Panel$: Observable<ServicePanelControl>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  Buttons$: Observable<ButtonControl[]>;

  constructor(private service: ServicesService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Items$ = this.service.ServiceBoxItems$;
    this.Panel$ = this.service.ServicePanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
    this.Buttons$ = this.service.ServiceButtons$;
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
  OnClick(){
    this.service.OnPanelClick()
  }
  OnButtonMoveEnd(event: IMoveEvent, name: string) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.ButtonMoveEnd(event, name);
  }

  OnButtonResizeStop(event: IResizeEvent, name: string) {
    this.service.ButtonResizeStop(event, name);
  }

  GetUrl(src, languageCode: string) {
    return (src?.find(x => x.languageCode === (languageCode))?.url);
  }
}
