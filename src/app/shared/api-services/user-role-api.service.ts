import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class UserRoleAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.UserRoleBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles`);
  }

  Create<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles`, data);
  }

  Get<T>(companyId: string, roleId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/${roleId}`);
  }

  Update<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles`, data);
  }

  GetActions<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/action/list`);
  }

  GetTemplates<T>(companyId: string, roleId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/${roleId}/templates`);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/lookup/list`);
  }

  AlreadyExists(companyId: string, roleId: string, roleName: string): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/${roleId}/exists?roleName=${roleName}`, false);
  }

  Delete<T>(companyId: string, roleId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/roles/${roleId}`);
  }

}
