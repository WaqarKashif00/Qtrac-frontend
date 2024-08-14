import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogAction } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { KioskAddService } from './kiosk-add.service';
import { IWorkFlowDropDown } from './kiosk-layout/Models/workflow-dropdown.interface';

@Component({
  selector: 'lavi-kiosk-add',
  templateUrl: './kiosk-add.component.html',
  styleUrls: ['./kiosk-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KioskAddService,
  ],
})
export class KioskAddComponent extends AbstractComponent {
  public Opened$: Observable<boolean>;
  public ActionsLayout = 'normal';
  IsEditMode$: Observable<boolean>;
  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  SelectedValue: IWorkFlowDropDown;
  public MyActions = [{ text: 'Done', primary: true }];
  constructor(private KioskService: KioskAddService) {
    super();
    this.Opened$ = this.KioskService.Opened$;
    this.WorkFlowList$ = this.KioskService.WorkFlowList$.pipe(
      tap((x) => {
        if (x.length > 0) {
          this.SelectedValue = x[0];
        }
      })
    );
    this.IsEditMode$ = this.KioskService.IsEditMode$;
  }

  public remove(upload, uid: string) {
    upload.removeFilesByUid(uid);
  }

  public onAction(action: DialogAction): void {
    this.KioskService.SendWorkFlowToKioskLayoutComponent();
  }

  WorkFlowChange(event) {
    this.KioskService.ChangeSelectedWorkFlowId(event.workFlowId);
  }

  public Cancel() {
    this.KioskService.RedirectToKioskList();
  }

}
