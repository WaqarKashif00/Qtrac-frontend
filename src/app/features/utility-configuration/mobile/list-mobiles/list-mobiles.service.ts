import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { MobileAPIService } from '../../../../shared/api-services/mobile-api.service';
import { IMobileLayoutData } from '../models/mobile-layout-data.interface';

@Injectable()
export class MobileListService extends AbstractComponentService {
  private SubjectMobiles: BehaviorSubject<IMobileLayoutData[]>;
  public Mobiles$: Observable<IMobileLayoutData[]>;
  get CompanyId() {
    return this.authService.CompanyId;
  };
  constructor(
    private readonly mobileAPIService: MobileAPIService
  ) {
    super();
  }

  SetObservables() {
    this.SubjectMobiles = new BehaviorSubject<IMobileLayoutData[]>([]);
    this.Mobiles$ = this.SubjectMobiles.asObservable();
  }

  GetMobileList() {
    this.mobileAPIService.GetAll<IMobileLayoutData>(this.CompanyId)
      .subscribe(response => {
        this.SubjectMobiles.next(response);
      });
  }


  RedirectToEditMobile(templateId: string) {
    if (templateId) {
      this.browserStorageService.SetMobileInterfaceIdInSessionStorage(templateId);
    }
    this.routeHandlerService.RedirectToEditNewMobileInterfacePage();
  }

  DeleteMobile(dataItem: IMobileLayoutData){
    return this.mobileAPIService.Delete(dataItem.companyId, dataItem.designerScreen.templateId);
  }
}
