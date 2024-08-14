import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthService } from './auth.service';

@Component({
  selector: 'lavi-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthService,
  ],
})
export class AuthComponent extends AbstractComponent {
 
  constructor(private service:AuthService) {
    super();
  }
  
}
