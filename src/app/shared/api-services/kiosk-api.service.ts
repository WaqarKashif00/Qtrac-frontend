import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class KioskAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.KioskTemplateBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates`);
  }

  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates`, data);
  }

  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates/draft`, data);
  }

  Get<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates/${templateId}`);
  }

  GetAllByWorkflow<T>(companyId: string, workflowId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates?workflowId=${workflowId}`);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates/lookup/list`);
  }

  Delete<T>(companyId: string, templateId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates/${templateId}`);
  }

  GetByDeviceId<T>(companyId: string, branchId: string, deviceId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/kiosk-executions/template/?deviceId=${deviceId}&companyId=${companyId}`);
  }

  GenerateTicket<T, P>(data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${null}/kiosk-templates/ticket`, data);
  }

  TransferTicket<T extends{companyId:string}, P>(data: T,isEdited = false): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${data.companyId}/kiosk-templates/transferred-tickets?isEdited=${isEdited}`, data);
  }

  SaveCustomerRequestByAppointmentExternal<T, P>(branchId: string, data: T,isCheckIn:boolean=false): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/kiosk-executions/ticket-from-appointments/${isCheckIn}`, data);
  }

  SaveCustomerRequestByAppointment<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/companies/${companyId}/kiosk-templates/ticket-from-appointments`, data);
  }

  GenerateTicketExternal<T, P>(data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/external/branches/${null}/kiosk-executions/ticket`, data);
  }

  GetShutDownDetails<T, P>(branchId: string, deviceId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/kiosk-executions/kiosk-shutdown?deviceId=${deviceId}`, data);
  }

  DeRegisterKiosk<T, P>(companyId: string, branchId: string, deviceId: string, kioskId: string): Observable<P> {
    return this.formService.PostAPICall<P, T>(`${this.BaseAPIUrl}/api/external/branches/${branchId}/kiosk-executions/kiosk-actions/de-register?companyId=${companyId}&deviceId=${deviceId}&kioskId=${kioskId}`, null);
  }

  GetOTP(browserId: string): Observable<string> {
    return this.formService.GetAPICall<string>(`${this.BaseAPIUrl}/api/external/kiosk-registrations/${browserId}/device-id`, false);
  }

}
