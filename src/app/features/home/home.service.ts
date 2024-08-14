import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { FormGroup } from '@angular/forms';
import { IHomeInterfaceLayoutData } from '../utility-configuration/home-interface/add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';
import { UserRoleAPIService } from '../../shared/api-services/user-role-api.service';
import { IAddUserRole } from '../../models/common/user-role/add-user-role';
import { HomeInterfaceAPIService } from '../../shared/api-services/home-interface-api.service';

@Injectable()
export class HomeService extends AbstractComponentService {
  MyFormGroup: FormGroup;
  private HomeInterfaceLayoutDataSubject: BehaviorSubject<IHomeInterfaceLayoutData>;
  HomeInterfaceLayoutData$: Observable<IHomeInterfaceLayoutData>;
  private ShowDefaultHomePageSubject: BehaviorSubject<boolean>;
  ShowDefaultHomePage$: Observable<boolean>;

  constructor(private readonly userRoleAPIService: UserRoleAPIService,
              private readonly homeInterfaceApiService: HomeInterfaceAPIService) {
    super();
    this.InitializeSubjectsAndObservables();
    this.InitializeHomeInterfaceLayoutData();
  }

  InitializeHomeInterfaceLayoutData() {
    this.mediatorService.InitialUserDetails$.subscribe(
      (userDetails) => {
        if (userDetails) {
          const userRoleId =  userDetails.role;
          const companyId = userDetails.companyId;
          this.GetRoleDataAndSetHomeInterfaceLayout(userRoleId, companyId);
        }
      }
    );
  }

  private GetRoleDataAndSetHomeInterfaceLayout(userRoleId: string, companyId: string) {
    if (userRoleId && companyId) {
      this.userRoleAPIService
        .Get(companyId, userRoleId)
        .subscribe((res: IAddUserRole[]) => {
          if (res && res.length > 0 && res[0].homeInterfaceId) {
            this.homeInterfaceApiService.Get(companyId, res[0].homeInterfaceId)
              .subscribe((x: any) => {
                this.ShowDefaultHomePageSubject.next(false);
                this.HomeInterfaceLayoutDataSubject.next(x);
              });
          } else {
            this.ShowDefaultHomePageSubject.next(true);
          }
        });
    }
  }

  private InitializeSubjectsAndObservables() {
    this.HomeInterfaceLayoutDataSubject = new BehaviorSubject<IHomeInterfaceLayoutData>(null);
    this.HomeInterfaceLayoutData$ = this.HomeInterfaceLayoutDataSubject.asObservable();
    this.ShowDefaultHomePageSubject = new BehaviorSubject<boolean>(true);
    this.ShowDefaultHomePage$ = this.ShowDefaultHomePageSubject.asObservable();
  }

  SetFormGroupInstance() {
    this.MyFormGroup = this.formBuilder.group({});
  }
  public GetCustomers(): Observable<any> {
    return this.formService.GetAPICall<any>('/customer').pipe(tap(() => {}));
  }

  public InvalidApiUrl(): Observable<any> {
    return this.formService.GetAPICall<any>('/custom').pipe(tap(() => {}));
  }

  public ServiceError(): Observable<any> {
    return this.formService.GetAPICall<any>('/customer').pipe(
      tap((list) => {
        list = null;
        list.length;
      })
    );
  }

  public ServerError(): Observable<any> {
    return this.formService.GetAPICall<any>('/servererror').pipe(delay(6000));
  }

  public TokenBasedCustomerGet(): Observable<any> {
    return this.formService.GetAPICall<any>('/list').pipe(tap(() => {}));
  }

  public CallMultipleApis() {
    this.formService
      .CombineAPICall(this.TestAPI1(), this.TestAPI2())
      .subscribe(([v, b]) => {
        this.AppNotificationService.Notify('First API Result =' + v);
        this.AppNotificationService.Notify('Second API Result=' + b);
      });
  }

  private TestAPI1() {
    return of('Test1 executed').pipe(
      tap((m) => {
        this.AppNotificationService.Notify('Test1 pipe executed');
      })
    );
  }

  private TestAPI2() {
    return of('Test2 executed').pipe(
      tap((m) => {
        this.AppNotificationService.Notify('Test2 pipe executed');
      })
    );
  }
}
