import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';
import { CompanyAPIService } from '../../shared/api-services/company-api.service';
import { IRequest } from '../company-configuration/models/company-configuration-request.interface';


@Injectable()
export class CompanyService extends AbstractComponentService {



  private CompanyListSubject: BehaviorSubject<IRequest[]>;
  public CompanyList$: Observable<IRequest[]>;

  constructor(private readonly companyAPIService: CompanyAPIService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.CompanyListSubject = new BehaviorSubject<IRequest[]>([]);
    this.CompanyList$ = this.CompanyListSubject.asObservable();
  }

  public RedirectToAddCompany() {
    this.browserStorageService.RemoveCompanyId();      // Dipesh: Remove these after company list screen get ready
    this.routeHandlerService.RedirectToAddCompany();
  }

  public RedirectToEditCompany(companyId: string) {
    if (companyId) {
      this.browserStorageService.SetCompanyId(companyId);
    }
    this.routeHandlerService.RedirectToEditCompany();
  }

  public GetCompaniesList() {
    this.companyAPIService.GetAll<IRequest>().subscribe((c: IRequest[]) => {
      this.CompanyListSubject.next(c);
    });
  }

  Delete(companyId: string){
      this.companyAPIService.Delete(companyId).subscribe((x) => {
      this.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Company'));
      if (this.authService.CompanyId === companyId) {
      this.mediatorService.SetNextCompanyId(null);
      }
      this.browserStorageService.RemoveCurrentSelectedCompanyId();
      this.mediatorService.CompanyGetChanged();
      this.GetCompaniesList();
    });
  }

    
  Duplicate(companyId: string) {
    this.companyAPIService.Duplicate(companyId).subscribe(x=>{
      this.mediatorService.CompanyGetChanged();
      this.GetCompaniesList();
    })
  }
}
