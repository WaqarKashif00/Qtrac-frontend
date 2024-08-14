import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { TokenService } from 'src/app/core/services/token.service';
import { IAuthorizationDetails } from 'src/app/models/common/authorization-details.model';
import { ICompanyDropDown } from 'src/app/models/common/company-dropdown-interface';
import { IHeaderDetails } from 'src/app/models/common/header-details.interface';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { ManageSideBarItems } from 'src/app/models/constants/side-bar-items.constant';
import { TabName } from 'src/app/models/enums/tab-name.enum';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { AuthService } from '../auth/auth.service';
import { ISideBarItems } from '../auth/side-bar-item.interface';

@Injectable()
export class HeaderService extends AbstractComponentService {
  HeaderDetails$: Observable<IHeaderDetails>;
  CompanyDropdownFormControl: FormControl;
  Companies$: Observable<ICompanyDropDown[]>;
  private CompaniesSubject: BehaviorSubject<ICompanyDropDown[]>;
  UserDetails$: Observable<InitialUserDetails>;
  UserRoleActions$: Observable<IAuthorizationDetails>;
  private CompanyLogoURLSubject: BehaviorSubject<string>;
  CompanyLogoURL$: Observable<string>;
  ShowManage$: Observable<boolean>;
  private ShowManageSubject: BehaviorSubject<boolean>;
  SelectedTabName$: Observable<string>;
  SelectedTabName: string;
  IsSmallQueue$: Observable<boolean>;

  private OpenQueueInNewTabSubject: BehaviorSubject<boolean>;
  OpenQueueInNewTab$: Observable<boolean>;

  SideBarItems: ISideBarItems[];

  constructor(
    private baseLayoutService: AuthService,
    private tokenService: TokenService,
    private readonly companyAPIService: CompanyAPIService
  ) {
    super();
    this.Initialize();
  }

  private Initialize() {
    this.IsSmallQueue$ = this.mediatorService.IsSmallQueue$;
    this.InitializeObservables();
    this.InitializeSubjects();
    this.InitializeFormControls();
    this.SubscribeObservables();
    this.InitializeSideBarItems();
  }

  private InitializeFormControls() {
    this.CompanyDropdownFormControl = this.formBuilder.control({
      text: '',
      value: '',
    });
  }

  private SubscribeObservables() {
    this.mediatorService.IsCompaniesChanged$.subscribe((isCompaniesChanged) => {
      if (isCompaniesChanged) {
        this.SetCompanies();
      }
    });
  }

  private InitializeObservables() {
    this.HeaderDetails$ = this.baseLayoutService.HeaderDetails;
    this.UserDetails$ = this.mediatorService.InitialUserDetails$;
    this.UserRoleActions$ = this.mediatorService.RoleActions$;
    this.SelectedTabName$ = this.mediatorService.SelectedTabName$;
    this.subs.sink = this.SelectedTabName$.subscribe((x) => {
      this.SelectedTabName = x;
    });
    this.ShowManageSubject = new BehaviorSubject<boolean>(false);
    this.ShowManage$ = this.ShowManageSubject.asObservable();
  }

  InitializeSideBarItems() {
    this.subs.sink = this.mediatorService.InitialUserDetails$.subscribe(
      (currentUserDetails: InitialUserDetails) => {
        if (!currentUserDetails) {
          this.SideBarItems = [];
        } else if (currentUserDetails.type === UserType.Customer) {
          this.SideBarItems = this.GetSideBarItemDependsOnRoleActions();
        } else {
          this.SideBarItems = ManageSideBarItems;
        }
        this.mediatorService.SetManageSideBarItems(this.SideBarItems);
        this.ShowManageSubject.next(!(this.SideBarItems.length == 0));
      }
    );
  }
  private GetSideBarItemDependsOnRoleActions() {
    let items = [];
    let sideBarItems: ISideBarItems[] = [];
    items = ManageSideBarItems.filter(
      (item: ISideBarItems) => item.canCompanyUserAccess
    );
    if (this.authService.AuthorizationDetails.isAllSystemAccessible) {
      sideBarItems = items;
    } else {
      sideBarItems = this.GetIRoleBasedSideBarItems(items);
    }
    return sideBarItems;
  }

  private GetIRoleBasedSideBarItems(items: any[]) {
    const sideBarItems: ISideBarItems[] = [];
    let tempSideBarItems: ISideBarItems[] = [];
    items?.forEach((element) => {
      if (element.name) {
        let actions = this.authService.AuthorizationDetails.roleActions.find(
          (x) => x.viewName == element.name
        );
        if (actions.view) {
          sideBarItems.push(element);
        }
      } else {
        sideBarItems.push(element);
      }
    });
    tempSideBarItems = [].concat(sideBarItems);
    tempSideBarItems
      ?.filter((m) => !m.parentId)
      ?.forEach((item) => {
        const foundItem = sideBarItems.find((x) => x.parentId == item.id);
        if (!foundItem) {
          sideBarItems?.splice(
            sideBarItems?.findIndex((m) => m.id == item.id),
            1
          );
        }
      });
    if (sideBarItems?.length > 0) {
      this.SideBarItems?.map((x) => (x.isParentSelected = false));
      sideBarItems.find((x) => x.level == 1).isParentSelected = true;
    }
    return sideBarItems;
  }
  private InitializeSubjects() {
    this.CompaniesSubject = new BehaviorSubject<ICompanyDropDown[]>([]);
    this.Companies$ = this.CompaniesSubject.asObservable();
    this.CompanyLogoURLSubject = new BehaviorSubject<string>(null);
    this.CompanyLogoURL$ = this.CompanyLogoURLSubject.asObservable();
    this.OpenQueueInNewTabSubject = new BehaviorSubject<boolean>(false);
    this.OpenQueueInNewTab$ = this.OpenQueueInNewTabSubject.asObservable();
    this.OpenQueueInNewTabSubject.next(
      this.appConfigService.config.IsOpenQueueInNewTab
    );
  }

  GetUserName(): string {
    return this.authService.UserName;
  }

  GetUserImage(): string {
    return this.authService.UserImage;
  }

  ChangeCompanyImage(url) {
    const logoURL = url || '../../../assets/img/logo.png';
    this.CompanyLogoURLSubject.next(logoURL);
  }

  IsLaviUser(): boolean {
    return this.authService.UserType == UserType.Lavi;
  }

  SetCompanies(): void {
    this.companyAPIService
      .GetDropdownList<ICompanyDropDown>()
      .subscribe((companies) => {
        this.CompaniesSubject.next(companies);
        if (companies && companies.length !== 0) {
          this.authService.CompanyId
            ? this.SetAuthStateCompany(companies)
            : this.SetFirstCompany(companies);
        }
      });
  }

  private SetFirstCompany(companies: ICompanyDropDown[]) {
    this.CompanyDropdownFormControl.setValue(companies[0]);
    this.browserStorageService.SetCurrentSelectedCompanyId(
      companies[0].companyId
    );
    this.browserStorageService.SetCurrentSelectedCompanyName(
      companies[0].companyName
    );
    this.browserStorageService.SetCurrentSelectedCompanyLogoUrl(
      companies[0]?.logoUrlPath
    );
    this.ChangeCompanyImage(companies[0]?.logoUrlPath);
    this.SetCompanyId(companies[0].companyId);
  }

  private SetAuthStateCompany(companies: ICompanyDropDown[]) {
    const companyObject = companies.find(
      (company) => company.companyId === this.authService.CompanyId
    );
    this.CompanyDropdownFormControl.setValue(companyObject);
    this.browserStorageService.SetCurrentSelectedCompanyLogoUrl(
      companies.find((x) => x.companyId == this.authService.CompanyId)
        ?.logoUrlPath
    );
    this.browserStorageService.SetCurrentSelectedCompanyName(
      companies.find((x) => x.companyId == this.authService.CompanyId)
        .companyName
    );
    this.ChangeCompanyImage(
      companies.find((x) => x.companyId == this.authService.CompanyId)
        ?.logoUrlPath
    );
    this.SetCompanyId(companyObject.companyId);
  }

  Logout() {
    if (this.SelectedTabName === TabName.Queue) {
      this.mediatorService.Logout();
    } else {
      this.tokenService.Logout(true);
    }
  }

  OnCompanyChange(id: string) {
    this.browserStorageService.SetCurrentSelectedCompanyId(id);
    this.browserStorageService.SetCurrentSelectedCompanyLogoUrl(
      this.CompaniesSubject.value.find((x) => x.companyId == id)?.logoUrlPath
    );
    this.browserStorageService.SetCurrentSelectedCompanyName(
      this.CompaniesSubject.value.find((x) => x.companyId == id).companyName
    );
    this.mediatorService.SetNextCompanyIdAndRedirectToHomePage(id);
    this.ChangeCompanyImage(
      this.CompaniesSubject.value.find((x) => x.companyId == id)?.logoUrlPath
    );
  }

  ToggleSmallQueue() {
    this.mediatorService.ToggleSmallQueue();
  }

  ChangeBranchDeskTemplate(): void {
    this.mediatorService.ChangeBranchDeskTemplate();
  }
  SetCompanyId(id: string) {
    this.mediatorService.SetNextCompanyId(id);
  }
  OnConfigurationExitButtonClick() {
    this.routeHandlerService.RedirectToManage();
  }

  NavigateToSnapshot() {
    this.routeHandlerService.RedirectToSnapShotPage();
  }

  NavigateToAgentExecution() {
    this.routeHandlerService.RedirectToAgentExecution();
  }
}
