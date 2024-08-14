import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { GetDeleteSuccessfulMessage } from '../../../core/utilities/core-utilities';
import { CommonMessages } from '../../../models/constants/message-constant';
import { IMonitorLayoutData } from './add-monitor/monitor-layout/Models/monitor-layout-data';
import { IWorkFlowDropDown } from './add-monitor/monitor-layout/Models/workflow-dropdown.interface';
import { MonitorService } from './monitor.service';

@Component({
  selector: 'lavi-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorComponent extends LaviListComponent {

  Monitors$: Observable<IMonitorLayoutData[]>;
  WorkFlows$: Observable<IWorkFlowDropDown[]>;
  items: any[] = Menus({hideDuplicate: true});

  constructor(private service: MonitorService,   private authStateService: AuthStateService) {
    super();
  }

Init(){
  this.service.InitializeService();
  this.GetMonitorList();
  this.Monitors$ = this.service.Monitors$;
  this.WorkFlows$ = this.service.WorkFlows$;
}

  GetMonitorList() {
    this.service.InitializeMonitorList();
  }

  OnSelect({ item }, dataItem: IMonitorLayoutData) {
    if (item.text === MenuOperationEnum.Edit) {
      this.RedirectToEditNewMonitorTemplate(dataItem.designerScreen.templateId);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteMonitor(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.MonitorTemplates);
  }

   RedirectToEditNewMonitorTemplate(id) {
    this.service.RedirectToEditMonitor(id);
  }

  RedirectToAddNewMonitorTemplate() {
    this.service.RedirectToAddNewMonitor();
  }

  DeleteMonitor(monitor: IMonitorLayoutData) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.service
        .DeleteMonitor(monitor)
        .subscribe((x) => {
          this.service.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Monitor template'));
          this.GetMonitorList();
        });
    }
  }
}
