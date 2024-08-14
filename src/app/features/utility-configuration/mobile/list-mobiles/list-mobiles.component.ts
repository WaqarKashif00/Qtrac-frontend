import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { GetDeleteSuccessfulMessage } from '../../../../core/utilities/core-utilities';
import { CommonMessages } from '../../../../models/constants/message-constant';
import { IMobileLayoutData } from '../models/mobile-layout-data.interface';
import { MobileListService } from './list-mobiles.service';

@Component({
  selector: 'lavi-mobile-list',
  templateUrl: 'list-mobiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileListComponent extends LaviListComponent {
  Mobiles$: Observable<IMobileLayoutData[]>;
  items: any[] = Menus({hideDuplicate:true})

  constructor(private mobileService: MobileListService, private authStateService: AuthStateService) {
    super();
  }

  Init(){
    this.mobileService.SetObservables();
    this.Mobiles$ = this.mobileService.Mobiles$;
    this.mobileService.GetMobileList();
  }

  OnSelect({ item }, dataItem: IMobileLayoutData) {
    if (item.text === MenuOperationEnum.Edit) {
      this.mobileService.RedirectToEditMobile(dataItem.designerScreen.templateId);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteMobile(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails,this.roleActions.MobileTemplates);
  }

  RedirectToEditNewKioskTemplate(templateId: string) {
    this.mobileService.RedirectToEditMobile(templateId);
  }


  DeleteMobile(mobile: IMobileLayoutData) {
    if (confirm(CommonMessages.ConfirmDeleteMessage)) {
      this.subs.sink = this.mobileService
        .DeleteMobile(mobile)
        .subscribe((x) => {
          this.mobileService.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Mobile template'));
          this.mobileService.GetMobileList();
        });
    }
  }
}
