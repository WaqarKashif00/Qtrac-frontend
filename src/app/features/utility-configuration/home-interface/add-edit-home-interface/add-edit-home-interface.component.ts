import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from '../../../../base/abstract-component';
import { AddEditHomeInterfaceService } from './add-edit-home-interface.service';

@Component({
  selector: 'lavi-add-edit-home-interface',
  templateUrl: './add-edit-home-interface.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AddEditHomeInterfaceService],
})
export class AddEditHomeInterfaceComponent extends AbstractComponent {
  IsModalOpened$: Observable<boolean>;
  IsEditMode$: Observable<boolean>;

  constructor(private monitorAddService: AddEditHomeInterfaceService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.IsEditMode$ = this.monitorAddService.IsEditMode$;
    this.IsModalOpened$ = this.monitorAddService.IsModalOpened$;
  }

  public Cancel(){
    this.monitorAddService.RedirectToHomeInterfaceListPage();
  }
}
