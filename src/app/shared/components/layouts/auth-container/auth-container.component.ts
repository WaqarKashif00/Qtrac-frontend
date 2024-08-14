import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthService } from 'src/app/features/auth/auth.service';

@Component({
  selector: 'lavi-auth-container',
  template: '<ng-content></ng-content>',
})
export class AuthContainerComponent extends AbstractComponent {
  @Input() HeaderTitle: string;
  @Input() ExitURL: string;

  constructor(private authService: AuthService) {
    super();
  }
  Init() {
    this.authService.HeaderDetails.next({
      title: this.HeaderTitle,
      exitPath: this.ExitURL,
      isShowConfigurationHeader: true,
    });
  }
  Destroy() {
    this.authService.HeaderDetails.next({
      title:null,
      exitPath: null,
      isShowConfigurationHeader: false,
    });
  }
}
