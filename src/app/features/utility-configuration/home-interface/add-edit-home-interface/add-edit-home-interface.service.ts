import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { HomeInterfaceAPIService } from '../../../../shared/api-services/home-interface-api.service';
import { IHomeInterfaceLayoutData } from './home-interface-layout/models/home-interface-layout-data';

@Injectable()
export class AddEditHomeInterfaceService extends AbstractComponentService {

  private IsEditModeSubject: BehaviorSubject<boolean>;
  IsEditMode$: Observable<boolean>;
  private IsModalOpenedSubject: BehaviorSubject<boolean>;
  IsModalOpened$: Observable<boolean>;
  private PageDataSubject: BehaviorSubject<IHomeInterfaceLayoutData>;
  PageData$: Observable<IHomeInterfaceLayoutData>;

  get CompanyId() {
    return this.authService.CompanyId;
  }

  constructor(
    private route: ActivatedRoute,
    private readonly homeInterfaceApiService: HomeInterfaceAPIService,
    ) {
    super();
    this.InitializeSubjects();
    this.SetAddOrEditMode();
  }

  private InitializeSubjects() {
    this.IsEditModeSubject = new BehaviorSubject<boolean>(false);
    this.IsEditMode$ = this.IsEditModeSubject.asObservable();
    this.PageDataSubject = new BehaviorSubject<IHomeInterfaceLayoutData>(null);
    this.PageData$ = this.PageDataSubject.asObservable();
    this.IsModalOpenedSubject = new BehaviorSubject<boolean>(true);
    this.IsModalOpened$ = this.IsModalOpenedSubject.asObservable();
  }

  SetAddOrEditMode() {
    if (this.browserStorageService.HomeInterfaceId) {
      this.OnEditMode();
    } else {
      this.OnAddMode();
    }
  }

  private OnAddMode() {
    this.SetAddMode();
  }

  private SetAddMode() {
    this.IsEditModeSubject.next(false);
  }

  private OnEditMode() {
    this.SetEditMode();
    this.HideModal();
    this.GetLayoutDataByHomeInterfaceId();
  }

  private SetEditMode() {
    this.IsEditModeSubject.next(true);
  }

  private GetLayoutDataByHomeInterfaceId() {
    this.loadingService.showLoading();
    this.homeInterfaceApiService.Get(this.authService.CompanyId, this.browserStorageService.HomeInterfaceId)
      .subscribe((x: any) => {
        this.PageDataSubject.next(x);
      });
  }


 


  public HideModal() {
    this.IsModalOpenedSubject.next(false);
  }

  public ShowModal() {
    this.IsModalOpenedSubject.next(true);
  }

  RedirectToHomeInterfaceListPage() {
    this.routeHandlerService.RedirectToHomeInterfaceListPage();
  }

}
