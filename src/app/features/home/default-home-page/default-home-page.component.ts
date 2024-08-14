import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'lavi-default-home-page',
  templateUrl: './default-home-page.component.html',
  styleUrls: ['./default-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultHomePageComponent extends AbstractComponent {
  UserName: string;

  constructor(private service: HomeService, private commonServiceService: CommonServiceService) {
    super();
    this.UserName = this.service.authService.UserName;
  }
  getQtracLogo(){
    return this.commonServiceService.getQtracLogo();
  }

}
