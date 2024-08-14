import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMoveEvent } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/move-event.interface';
import { ButtonControl } from '../../../Models/controls/button.control';
import { WelcomeService } from '../welcome.service';

@Component({
  selector: 'lavi-welcome-default-control',
  templateUrl: './welcome-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeDefaultControlComponent extends AbstractComponent {
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;
  ButtonsList$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;

  DefaultLanguage$: Observable<string>;
  constructor(private service: WelcomeService){
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.ButtonsList$ = this.service.ButtonsList$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
  }

  OnButtonMoveEnd(event: [IMoveEvent, string]) {
    this.service.ButtonMoveEnd(event[0], event[1]);
  }
  OnButtonResizeEnd(event: [IResizeEvent, string]) {
    this.service.ButtonResizeStop(event[0], event[1]);
  }
 
}
