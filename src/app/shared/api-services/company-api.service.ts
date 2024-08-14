import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { laviSMTPSetting } from 'src/app/models/common/smtp-setting.interface';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class CompanyAPIService {

  constructor(
    private readonly formService: FormService,
  ) { }

  GetAll<T>(): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`/api/companies`);
  }

  Create<T, P>(data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`/api/companies`, data);
  }

  Get<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/${companyId}`);
  }

  Update<P, T>(data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`/api/companies`, data);
  }

  GetDropdownList<T>(): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`/api/companies/lookup/list`);
  }

  GetSiteSettings<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/${companyId}/site-settings`);
  }

  GetSMSNumbers<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/${companyId}/sms-numbers`);
  }

  GetLanguages<T>(companyId: string,isLoaderRequired = true): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`/api/companies/${companyId}/languages`,isLoaderRequired);
  }

  GetExternalLanguages<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`/api/external/companies/${companyId}/languages`);
  }

  GetExternalCompanySecuritySettings<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/external/companies/${companyId}/securitysettings`);
  }

  GetLoginMode<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/${companyId}/login-mode`);
  }

  AlreadyExists<T>(companyId: string, companyName: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/${companyId}/exists?companyName=${companyName}`, false);
  }

  GetTags<T>(): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`/api/companies/tag/list`);
  }

  UpdateSMSCredentials<P, T>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`/api/companies/${companyId}/sms-credentials`, data);
  }

  GetLaviSMTPSettings(): Observable<laviSMTPSetting> {
    return this.formService.GetAPICall<laviSMTPSetting>(`/api/companies/smtp/settings`);
  }

  UpdateLaviSMTPSettings<laviSMTPSetting>(data: laviSMTPSetting): Observable<laviSMTPSetting> {
    return this.formService.PutAPICall<laviSMTPSetting, laviSMTPSetting>(`/api/companies/smtp/settings`, data);
  }

  Delete<T>(companyId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`/api/companies/${companyId}`);
  }

  Duplicate<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`/api/companies/copy/${companyId}`);
  }

  EndOfDay<T, P>(companyId: string,branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`/api/companies/${companyId}/${branchId}/endofday`,data);
  }

}
