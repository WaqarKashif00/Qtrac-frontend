import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISideBarItems } from 'src/app/features/auth/side-bar-item.interface';
import { IAuthorizationDetails } from 'src/app/models/common/authorization-details.model';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { MenuTag } from 'src/app/models/enums/menu-tag.enum';
import { cloneObject } from '../utilities/core-utilities';
import { RouteHandlerService } from './route-handler.service';

@Injectable({ providedIn: 'root' })
export class MediatorService {
 
  CompanyId$: Observable<string>;
  private CompanyIdSubject: BehaviorSubject<string>;
  SelectedTabName$: Observable<string>;
  private SelectedTabNameSubject: BehaviorSubject<string>;
  IsCompaniesChanged$: Observable<boolean>;
  private IsCompaniesChangedSubject: BehaviorSubject<boolean>;
  InitialUserDetails$: Observable<InitialUserDetails>;
  private InitialUserDetailsSubject: BehaviorSubject<InitialUserDetails>;
  CompanyLoginMode$: Observable<string>;
  IsSmallQueue$: Observable<boolean>
  private IsSmallQueueSubject: BehaviorSubject<boolean>;
  private CompanyLoginModeSubject: BehaviorSubject<string>;
  private RoleActionsSubject: BehaviorSubject<IAuthorizationDetails>;
  RoleActions$: Observable<IAuthorizationDetails>;
  private ManageSideBarITemSubject: BehaviorSubject<ISideBarItems[]>;
  ManageSideBarITem$: Observable<ISideBarItems[]>;
  private SubjectTraceMenuClick: BehaviorSubject<string>;
  TraceMenuClick$: Observable<string>;

  constructor(private routeHandlerService: RouteHandlerService,) {
    this.CompanyIdSubject = new BehaviorSubject<string>(null);
    this.CompanyId$ = this.CompanyIdSubject.asObservable();
    this.SelectedTabNameSubject = new BehaviorSubject<string>(null);
    this.SelectedTabName$ = this.SelectedTabNameSubject.asObservable();
    this.IsCompaniesChangedSubject = new BehaviorSubject<boolean>(true);
    this.IsCompaniesChanged$ = this.IsCompaniesChangedSubject.asObservable();
    this.InitialUserDetailsSubject = new BehaviorSubject<InitialUserDetails>(
      null
    );
    this.InitialUserDetails$ = this.InitialUserDetailsSubject.asObservable();
    this.CompanyLoginModeSubject = new BehaviorSubject<string>(null);
    this.CompanyLoginMode$ = this.CompanyLoginModeSubject.asObservable();
    this.SubjectTraceMenuClick = new BehaviorSubject<string>(null);
    this.TraceMenuClick$ =this.SubjectTraceMenuClick.asObservable();
    this.IsSmallQueueSubject = new BehaviorSubject<boolean>(false);
    this.IsSmallQueue$ = this.IsSmallQueueSubject.asObservable();
    this.RoleActionsSubject = new BehaviorSubject<IAuthorizationDetails>(null);
    this.RoleActions$ = this.RoleActionsSubject.asObservable();
    this.ManageSideBarITemSubject = new BehaviorSubject<ISideBarItems[]>([]);
    this.ManageSideBarITem$ = this.ManageSideBarITemSubject.asObservable();
  }

  SetNextCompanyIdAndRedirectToHomePage(id: string) {
    this.SetNextCompanyId(id);
    this.routeHandlerService.RedirectToHome();
  }

  SetNextCompanyId(id: string) {
    this.CompanyIdSubject.next(id);
  }

  SetSelectedTabName(selectedTabName: string) {
    this.SelectedTabNameSubject.next(selectedTabName);
  }

  RemoveSelectedTabName() {
    this.SelectedTabNameSubject.next(null);
  }

  SetUserRoleActions(actions: IAuthorizationDetails) {
    this.RoleActionsSubject.next(actions);
  }

  CompanyGetChanged() {
    this.IsCompaniesChangedSubject.next(true);
  }

  SetInitialUserDetails(userDetails: InitialUserDetails) {
    this.InitialUserDetailsSubject.next(userDetails);
  }

  SetCompanyLoginMode(mode: string) {
    this.CompanyLoginModeSubject.next(mode);
  }
 
  SetManageSideBarItems(SideBarItems: ISideBarItems[]) {
    this.ManageSideBarITemSubject.next(cloneObject(SideBarItems))
  }
  ToggleSmallQueue() {
    this.IsSmallQueueSubject.next(!this.IsSmallQueueSubject.value);
    this.SubjectTraceMenuClick.next(MenuTag.View);
    this.SubjectTraceMenuClick.next(null);
  }

  ChangeBranchDeskTemplate(): void {
    this.SubjectTraceMenuClick.next(MenuTag.Location);
    this.SubjectTraceMenuClick.next(null);
  }

  Logout(): void {
    this.SubjectTraceMenuClick.next(MenuTag.Logout);
    this.SubjectTraceMenuClick.next(null);
  }
}
