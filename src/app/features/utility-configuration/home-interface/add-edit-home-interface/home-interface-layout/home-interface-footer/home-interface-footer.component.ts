import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HomeInterfaceLayoutService } from '../home-interface-layout.service';

@Component({
  selector: 'lavi-home-interface-footer',
  templateUrl: './home-interface-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceFooterComponent extends AbstractComponent {

  constructor(
    private layoutService: HomeInterfaceLayoutService
  ) {
    super();
  }

  public GoToHomeInterfaceList() {
    this.layoutService.RedirectToHomeInterfaceListPage();
  }

  public OnSaveAsDraftClick() {
    this.layoutService.SaveAsDraftClick();
  }

  public OnSaveClick() {
    this.layoutService.SaveClick();
  }
}
