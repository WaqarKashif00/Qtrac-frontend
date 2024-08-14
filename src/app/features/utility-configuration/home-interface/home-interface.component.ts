import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { MenuOperationEnum } from 'src/app/models/enums/menu-operation.enum';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { IHomeInterfaceLayoutData } from './add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';
import { HomeInterfaceService } from './home-interface.service';

@Component({
  selector: 'lavi-home-interface',
  templateUrl: './home-interface.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeInterfaceComponent extends LaviListComponent {

  HomeInterfaces$: Observable<IHomeInterfaceLayoutData[]>;
  items: any[] = Menus({ hideDuplicate: true, hideDelete: true });

  constructor(private service: HomeInterfaceService, private authStateService: AuthStateService) {
    super();
    this.SetObservables();
    this.service.GetHomeInterfaces();
  }

  SetObservables(){
    this.HomeInterfaces$ = this.service.HomeInterfaces$;
  }


  OnSelect({ item }, dataItem: IHomeInterfaceLayoutData) {
    if (item.text === MenuOperationEnum.Edit) {
      this.RedirectToEditHomeInterface(dataItem.designerScreen.templateId);
    }

    if (item.text === MenuOperationEnum.Delete) {
      this.DeleteHomeInterface(dataItem);
    }
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails, this.roleActions.HomeInterfaces);
  }

  RedirectToEditHomeInterface(id: string) {
    this.service.RedirectToEditHomeInterface(id);
  }

  RedirectToAddNewHomeInterface() {
    this.service.RedirectToAddNewHomeInterface();
  }

  DeleteHomeInterface(homeInterface) {
  }
}
