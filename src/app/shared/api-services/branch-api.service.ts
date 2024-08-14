import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({providedIn: 'root'})
export class BranchAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.BaseAPIUrlBranch;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches`);
  }

  Create<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches`, data);
  }

  Get<T>(companyId: string, branchId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}`);
  }

  Update<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches`, data);
  }

  AlreadyExists(companyId: string, branchId: string, branchName: string): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/exists?branchName=${branchName}`, false);
  }

  GetBranchNamesWithTags<T>(companyId: string,includeDeskAndWorkflow: boolean=false): Observable<T[]> {
    if(includeDeskAndWorkflow){
      return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/branch-name-tag/list?includeDeskAndWorkflow=true`);
    }
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/branch-name-tag/list`);
  }

  GetWorkflows<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-workflows`);
  }

  CreateWorkflow<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-workflows`, data);
  }

  UpdateWorkflow<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-workflows`, data);
  }

  DeleteWorkflow<P>(companyId: string, branchId: string, workflowId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-workflows/${workflowId}`);
  }

  GetKiosks<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks`);
  }

  CreateKiosk<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks`, data);
  }

  UpdateKiosk<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks`, data);
  }

  DeleteKiosk<P>(companyId: string, branchId: string, kioskId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}`);
  }

  RefreshKiosk<P>(companyId: string, branchId: string, kioskId: string, browserId: string): Observable<P> {
    return this.formService.PostAPICall<P, any>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/refresh?browserId=${browserId}`, null);
  }

  SendMessageKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/send-message?browserId=${browserId}`, data);
  }

  SendMessageAllKiosk<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/kiosk-actions/send-message-all`, data);
  }

  StandByKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/standby/${browserId}`, data);
  }

  DeRegisterKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/de-register?browserId=${browserId}`, null);
  }

  LinkKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/link-kiosk/?browserId=${browserId}`, data);
  }

  ShutdownKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/shutdown?browserId=${browserId}`, data);
  }

  ResumeKiosk<T, P>(companyId: string, branchId: string, kioskId: string, browserId: string): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/kiosks/${kioskId}/kiosk-actions/resume?browserId=${browserId}`, null);
  }

  DeviceExists(companyId: string, branchId: string, deviceId: string): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/devices?deviceId=${deviceId}`, false);
  }

  GetMonitors<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/monitors`);
  }

  CreateMonitor<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/monitors`, data);
  }

  UpdateMonitor<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/monitors`, data);
  }

  DeleteMonitor<P>(companyId: string, branchId: string, monitorId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/monitors/${monitorId}`);
  }

  GetMobileInterfaces<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-mobile-interfaces`);
  }

  CreateMobileInterface<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-mobile-interfaces`, data);
  }

  UpdateMobileInterface<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-mobile-interfaces`, data);
  }

  DeleteMobileInterface<P>(companyId: string, branchId: string, mobileInterfaceId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/branch-mobile-interfaces/${mobileInterfaceId}`);
  }

  GetDesks<T>(companyId: string, branchId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/desks`);
  }

  CreateDesk<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/desks`, data);
  }

  UpdateDesk<T, P>(companyId: string, branchId: string, data: T): Observable<P> {
    return this.formService.PutAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/desks`, data);
  }

  DeleteDesk<P>(companyId: string, branchId: string, deskId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}/desks/${deskId}`);
  }

  GetTags<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/tag/list`);
  }

  GetDropdownList<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/lookup/list`);
  }

  GetCountries<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/country/list`);
  }

  GetExternal<T>(companyId: string, branchId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/branches/${branchId}`);
  }

  Delete<P>(companyId: string, branchId: string): Observable<P> {
    return this.formService.DeleteAPICall<P>(`${this.BaseAPIUrl}/api/companies/${companyId}/branches/${branchId}`);
  }

  GetPrinters<T>(companyId: string, branchId: string, type: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/branches/${branchId}/Printers?type=${type}`);
  }

  GetKioskPrinters<T>(companyId: string, branchId: string, kioskId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/branches/${branchId}/kiosk/${kioskId}/printers`);
  }
}
