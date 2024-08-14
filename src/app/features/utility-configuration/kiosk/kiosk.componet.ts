import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { IKioskLayoutData } from './kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { IWorkFlowDropDown } from './kiosk-add/kiosk-layout/Models/workflow-dropdown.interface';
import { KioskService } from './kiosk.service';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { GetDeleteSuccessfulMessage } from '../../../core/utilities/core-utilities';

@Component({
  selector: 'lavi-kiosk-add',
  templateUrl: './kiosk.component.html',
  styleUrls:['./kiosk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KioskComponent extends LaviListComponent {
  Kiosks$: Observable<IKioskLayoutData[]>;
  Workflows$: Observable<IWorkFlowDropDown[]>;
  items: any[] = Menus({hideDuplicate:true});

  constructor(private kioskService: KioskService,
              private authStateService: AuthStateService) {
    super();
  }

  Init() {
    this.kioskService.InitializeService();
    this.GetKioskList();
    this.Kiosks$ = this.kioskService.Kiosks$;
    this.Workflows$ = this.kioskService.WorkFlows$;
  }

  OnSelect({ item }, dataItem: IKioskLayoutData) {
    if (item.text === MenuOperationEnum.Edit) {
      this.kioskService.RedirectToEditKiosk(dataItem.designerScreen.templateId);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteKiosk(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item,this.authStateService.AuthorizationDetails, this.roleActions.KioskTemplates);
  }

  RedirectToAddNewKioskTemplate() {
    this.kioskService.RedirectToAddNewKiosk();
  }

  RedirectToEditNewKioskTemplate(templateId: string) {
    this.kioskService.RedirectToEditKiosk(templateId);
  }

  GetKioskList(): void {
    this.kioskService.InitializeKioskList();
  }

  RedirectToExecution(): void {
    this.kioskService.RedirectToKioskExecution();
  }

  DeleteKiosk(kiosk: IKioskLayoutData) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.kioskService
        .DeleteKiosk(kiosk)
        .subscribe((x) => {
          this.kioskService.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Kiosk template'));
          this.GetKioskList();
        });
    }
  }
}
