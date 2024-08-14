import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MonitorAddService } from './add-monitor.service';
import { IWorkFlowDropDown } from './monitor-layout/Models/workflow-dropdown.interface';

@Component({
  selector: 'lavi-add-monitor',
  templateUrl: './add-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorAddService],
})
export class AddMonitorComponent extends AbstractComponent {
  IsModalOpened$: Observable<boolean>;
  WorkFlowList$: Observable<IWorkFlowDropDown[]>;
  IsEditMode$: Observable<boolean>;
  SelectedValue: IWorkFlowDropDown;

  constructor(private monitorAddService: MonitorAddService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.WorkFlowList$ = this.monitorAddService.WorkFlowList$.pipe(tap(x => {
      if (x.length > 0) {
        this.SelectedValue = x[0];
      }
    }));
    this.IsEditMode$ = this.monitorAddService.IsEditMode$;
    this.IsModalOpened$ = this.monitorAddService.IsModalOpened$;
  }

  public OnWorkFlowChange(event) {
    this.monitorAddService.ChangeSelectedWorkFlowId(event.workFlowId);
  }

  public OnAction(): void {
    this.monitorAddService.SendWorkFlowToMonitorLayout();
  }

  public Cancel() {
    this.monitorAddService.RedirectToMonitorListPage();
  }

}
