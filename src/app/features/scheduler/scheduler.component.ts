import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { CommonMessages } from '../../models/constants/message-constant';
import { SchedulerService } from './scheduler.service';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';

@Component({
  selector: 'lavi-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SchedulerService]
})
export class SchedulerComponent extends LaviListComponent {

  public SchedulerList$: Observable<any[]>;
  items: any[] = Menus({ hideDuplicate: true });

  constructor(private service: SchedulerService,
              private authStateService: AuthStateService,
              private appNotificationService: AppNotificationService,
  ) {
    super();
    this.SchedulerList$ = service.SchedulerList$;
  }

  Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public onItemMenuSelect(e: any) {
    switch (e.event.item.action) {
      case 'EDIT':
        this.NavigateToUpdateTemplate(e.dataItem.hoursOfOperationId);
        break;
    }
  }

  NavigateToTemplate() {
    this.service.RedirectToAddHoursOfOperation();
  }

  NavigateToUpdateTemplate(hoursOfOperationId: string) {
    this.service.RedirectToUpdateHoursOfOperation(hoursOfOperationId);
  }

  OnSelect({ item }, dataItem: IHoursOfOperationDropdown) {
    if (item.text == MenuOperationEnum.Edit) {
      this.NavigateToUpdateTemplate(dataItem.id);
    }

    if (item.text == MenuOperationEnum.Delete) {
      this.DeleteHOO(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.SchedulerTemplates);
  }

  DeleteHOO(dataItem: IHoursOfOperationDropdown) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.service.DeleteHOO(dataItem).subscribe(x => {
        this.appNotificationService.Notify(GetDeleteSuccessfulMessage('Hours of operation'));
        this.service.GetSchedulerList();
      });
    }
  }
}
