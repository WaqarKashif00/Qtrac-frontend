import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class HomeInterfaceAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.HomeInterfaceBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  private GetHomeInterfaceBaseApiUrl(companyId: string): string {
    return `${this.BaseAPIUrl}/api/companies/${companyId}/home-interfaces`;
  }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(this.GetHomeInterfaceBaseApiUrl(companyId));
  }

  Get<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(this.GetHomeInterfaceBaseApiUrl(companyId) + `/${templateId}`);
  }

  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(this.GetHomeInterfaceBaseApiUrl(companyId), data);
  }

  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(this.GetHomeInterfaceBaseApiUrl(companyId) + `/draft`, data);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(this.GetHomeInterfaceBaseApiUrl(companyId) + `/lookup/list`);
  }

  Delete<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(this.GetHomeInterfaceBaseApiUrl(companyId) + `/${templateId}`);
  }

}
