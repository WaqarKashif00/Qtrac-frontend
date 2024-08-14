import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { HomeInterfaceAPIService } from '../../../shared/api-services/home-interface-api.service';
import { IHomeInterfaceLayoutData } from './add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Injectable()
export class HomeInterfaceService extends AbstractComponentService {

  private SubjectHomeInterfaces: BehaviorSubject<IHomeInterfaceLayoutData[]>;
  public HomeInterfaces$: Observable<IHomeInterfaceLayoutData[]>;

  get CompanyId() {
    return this.authService.CompanyId;
  };

  constructor(
    private readonly homeInterfaceApiService: HomeInterfaceAPIService
    ) {
    super();
    this.SetObservables();
  }

  SetObservables() {
    this.SubjectHomeInterfaces = new BehaviorSubject<IHomeInterfaceLayoutData[]>([]);
    this.HomeInterfaces$ = this.SubjectHomeInterfaces.asObservable();
  }

  GetHomeInterfaces() {
    this.homeInterfaceApiService.GetAll<IHomeInterfaceLayoutData>(this.CompanyId)
      .subscribe(response => {
        this.SubjectHomeInterfaces.next(response || []);
      });
  }

  RedirectToEditHomeInterface(templateId: string) {
    if (templateId) {
      this.browserStorageService.SetHomeInterfaceIdInSessionStorage(
        templateId
      );
    }
    this.routeHandlerService.RedirectToEditHomeInterfacePage();
  }

  RedirectToAddNewHomeInterface() {
    this.browserStorageService.RemoveHomeInterfaceIdFromSessionStorage();
    this.routeHandlerService.RedirectToAddNewHomeInterfacePage();
  }

  // DeleteMonitor(dataItem){
  //   return this.monitorAPIService.Delete(dataItem.companyId, dataItem.designerScreen.templateId);
  // }
}
