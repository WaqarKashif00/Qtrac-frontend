import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AgentUserInformationService } from './agent-user-information.service';

@Component({
  selector: 'lavi-agent-user-information',
  templateUrl: './agent-user-information.component.html',
  styleUrls: ['./agent-user-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentUserInformationComponent extends AbstractComponent {
  @Input() OpenQueueInNewTab: boolean;
  
  UserName$: Observable<string>;
  UserImageUrl$: Observable<string>;
  CompanyName$: Observable<string>;
  BranchName$: Observable<string>;
  Initials$: Observable<string>;

  constructor(private service: AgentUserInformationService) {
    super();
    this.Initialize();
  }
  Initialize() {
    this.UserName$ = this.service.UserName$;
    this.CompanyName$ = this.service.CompanyName$;
    this.BranchName$ = this.service.BranchName$;
    this.UserImageUrl$ = this.service.UserImageUrl$;
    this.Initials$ = this.UserName$.pipe(
      map((name) => {
        if (name) {
          return name
            .split(' ')
            .map((x) => x[0].toString().toUpperCase())
            .join('');
        }
        return '';
      })
    );
  }
}
