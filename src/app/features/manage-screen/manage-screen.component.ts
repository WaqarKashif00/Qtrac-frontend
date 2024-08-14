import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISideBarItems } from '../auth/side-bar-item.interface';
import { ManageService } from './manage-screen.service';

@Component({
  selector: 'lavi-manage-screen',
  templateUrl: './manage-screen.component.html',
  styleUrls: ['./manage-screen.component.scss'],
  providers: [ManageService],
})
export class ManageScreenComponent extends AbstractComponent {
  public ManageSideBarItems$: Observable<ISideBarItems[]>;

  constructor(private service: ManageService) {
    super();
    this.InitializeProperties();
  }

  InitializeProperties() {
    this.InitializeObservables();
  }
  InitializeObservables() {
    this.ManageSideBarItems$ = this.service.ManageSideBarItems$;
  }

  OnParentItemClick(id: string) {
    this.service.OnParentItemClick(id);
  }

  OnChildItemClick(path: string) {
    this.service.OnChildItemClick(path);
  }
}
