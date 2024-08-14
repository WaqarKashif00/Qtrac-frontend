import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { RouteHandlerService } from '../../core/services/route-handler.service';

@Component({
  selector: 'lavi-unauthorize',
  templateUrl: './unauthorize.component.html',
  styleUrls: ['./unauthorize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnauthorizeComponent extends AbstractComponent {

  constructor(private readonly routeHandlerService: RouteHandlerService) {
    super();
  }

  RedirectToHome() {
    this.routeHandlerService.RedirectToHome();
  }
  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }
  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }
}
