import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'lavi-base-layout',
  templateUrl: './base-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseLayoutComponent extends AbstractComponent {
  message?: string;

  constructor(private authService: AuthService) {
    super();
  }

  Init() {
    this.authService.GetCompanyLoginMode();
  }


}
