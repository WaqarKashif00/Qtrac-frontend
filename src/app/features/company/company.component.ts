import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { Menus, ShowMenuItem } from 'src/app/shared/utility-functions/menu-utility-functions';
import { CommonMessages } from '../../models/constants/message-constant';
import { MenuOperationEnum } from '../../models/enums/menu-operation.enum';
import { Confirmable } from '../../shared/decorators/confirmable.decorator';
import { CompanyService } from './company.service';
import { IRequest } from './components/add-company/models/company-configuration-request.interface';

@Component({
  selector: 'lavi-company',
  templateUrl: './company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CompanyService],
})
export class CompanyComponent extends LaviListComponent {
  public CompanyList$: Observable<IRequest[]>;

  constructor(
    private companyService: CompanyService, private authStateService: AuthStateService 
  ) {
    super();
    this.CompanyList$ = companyService.CompanyList$;
    companyService.GetCompaniesList();
    this.menuItems = Menus()
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public onItemMenuSelect(e: any) {
    switch (e.event.item.text) {
      case MenuOperationEnum.Edit:
        this.RedirectToEditCompany(e.dataItem.companyId);
        break;
      case MenuOperationEnum.Delete:
        this.Delete(e.dataItem);
        break;
      case MenuOperationEnum.Duplicate:
        this.Duplicate(e.dataItem);
        break
    }

  }

  @Confirmable(CommonMessages.ConfirmDuplicateMessage)
  Duplicate(company: IRequest) {
    this.companyService.Duplicate(company.companyId)
  }

  ShowMenuItem(item): boolean {
    return ShowMenuItem(item, this.authStateService.AuthorizationDetails,this.roleActions.MobileTemplates);
  }

  public RedirectToAddCompany() {
    this.companyService.RedirectToAddCompany();
  }
  public RedirectToEditCompany(companyId: string) {
    this.companyService.RedirectToEditCompany(companyId); // pass the company Id from grid
  }

  @Confirmable(CommonMessages.ConfirmDeleteMessage)
  private Delete(company: IRequest) {
     this.companyService.Delete(company.companyId);
  }

}
