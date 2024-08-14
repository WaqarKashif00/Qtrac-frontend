import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DialogAction } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IWorkFlowDropDown } from 'src/app/features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/workflow-dropdown.interface';
import { AppointmentSchedulerService } from './scheduler-designer.service';

@Component({
  selector: 'lavi-appointment-scheduler',
  templateUrl: './scheduler-designer.component.html',
  styleUrls: ['./scheduler-designer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppointmentSchedulerService],
})
export class SchedulerDesignerComponent extends AbstractComponent {
  public Opened$: Observable<boolean>;
  public ActionsLayout = 'normal';
  public MyActions = [{ text: 'Done', primary: true }];

  IsEditMode$: Observable<boolean>;
  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  SelectedValue: IWorkFlowDropDown;

  constructor(private service: AppointmentSchedulerService) {
    super();
    this.Opened$ = this.service.Opened$;
    this.WorkFlowList$ = this.service.WorkFlowList$.pipe(
      tap((x: IWorkFlowDropDown[]) => {
        if (x.length > 0) {
          this.SelectedValue = x[0];
        }
      })
    );
    this.IsEditMode$ = this.service.IsEditMode$;
  }


  OnAction(action: DialogAction): void {
    this.service.SendWorkFlowToLayoutComponent();
  }

  WorkFlowChange(event) {
    this.service.ChangeSelectedWorkFlowId(event.workFlowId);
  }

  Cancel() {
    this.service.CloseModel();
  }

  Destroy() {
    this.service.OnDestroy();
  }
}
