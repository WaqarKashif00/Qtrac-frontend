import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISchedulerData } from 'src/app/features/appointment-scheduler/models/schedular-data.interface';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { DeleteAppointmentRequest } from '../api-models/appointment/delete-appointment-request';
import { DeleteAppointmentResponse } from '../api-models/appointment/delete-appointment.response';

@Injectable({ providedIn: 'root' })
export class AppointmentSchedulerAPIService {
  get BaseAPIUrl() {
    return this.appConfigService.config.AppointmentSchedulerURL;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates`
    );
  }

  GetPublishedSchedulerTemplateLookups<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates/lookup/list`
    );
  }

  Get<T>(companyId: string, schedulerId: string): Observable<T> {
    return this.formService.GetAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates/${schedulerId}`
    );
  }
  GetAvailableSlots<T, P>(
    companyId,
    branchId,
    workflowId,
    serviceId,
    date: Date = null,
    data: any,
    appointmentId?: string
  ): Observable<T[]> {
    if (date) {
      if (appointmentId) {
        return this.formService.PostAPICall<T[], P>(
          `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/workflows/${workflowId}/services/${serviceId}/first-available` +
          `?day=${date.getDate()}&month=${date.getMonth()}&year=${date.getFullYear()}&appointmentId=${appointmentId}`,
          data
        );
      } else {
        return this.formService.PostAPICall<T[], P>(
          `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/workflows/${workflowId}/services/${serviceId}/first-available` +
          `?day=${date.getDate()}&month=${date.getMonth()}&year=${date.getFullYear()}`,
          data
        );
      }

    } else {
      if (appointmentId) {
        return this.formService.PostAPICall<T[], P>(
          `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/workflows/${workflowId}/services/${serviceId}/first-available` + `?appointmentId=${appointmentId}`,
          data
        );
      } else {
        return this.formService.PostAPICall<T[], P>(
          `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/workflows/${workflowId}/services/${serviceId}/first-available`,
          data
        );
      }
    }
  }
  SelectBranchForAppointment<T, P>(
    companyId,
    branchId,
    workflowId,
    serviceId,
    data: any
  ): Observable<T[]> {
    return this.formService.PostAPICall<T[], P>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/workflows/${workflowId}/services/${serviceId}/branchSelected`,
      data
    );
  }
  SaveAsDraft<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates/draft`,
      data
    );
  }

  ConfirmAppointment<T, P>(CompanyId: string, data: any): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${CompanyId}/scheduler-templates/confirm-appointment`,
      data
    );
  }

  GetAppointment<P>(
    companyId: string,
    branchId: string,
    appointmentId: string
  ): Observable<P> {
    return this.formService.GetAPICall<P>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/branches/${branchId}/appointments/${appointmentId}`
    );
  }
  VerifyOTP<P, T>(CompanyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${CompanyId}/scheduler-templates/verify-otp`,
      data
    );
  }
  SendOTP<P, T>(CompanyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${CompanyId}/scheduler-templates/send-otp`,
      data
    );
  }
  Save<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates`,
      data
    );
  }
  GetExternalPublishedData<T>(
    companyId: string,
    schedulerId: string,
    isConfirmation?: boolean
  ): Observable<T> {
    return this.formService.GetAPICall<T>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/${schedulerId}/${isConfirmation}`
    );
  }
  LockAppointments<T, P>(companyId: string, data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/lock-slot`,
      data,
      false);
  }
  GetExternalNearestBranchList<T>(
    companyId: string,
    workFlowId: string,
    serviceId: string,
    latitude: number,
    longitude: number,
    distance: number
  ): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(
      `${this.BaseAPIUrl}/api/external/companies/${companyId}/scheduler-templates/nearestBranches/${workFlowId}/services/${serviceId}/latitude/${latitude}/longitude/${longitude}/distance/${distance}`
    );
  }

  BookAppointmentExternal<T, P>(data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/:companyId/scheduler-templates/appointments`,
      data
    );
  }

  BookAppointment<T, P>(data: T, companyId: string): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/scheduler-templates/appointments`,
      data
    );
  }

  ModifyAppointment<T, P>(data: T): Observable<P> {
    return this.formService.PostAPICall<P, T>(
      `${this.BaseAPIUrl}/api/external/companies/:companyId/scheduler-templates/modify-appointment`,
      data
    );
  }

  DeleteAppointment(
    data: DeleteAppointmentRequest
  ): Observable<DeleteAppointmentResponse> {
    return this.formService.PostAPICall<
      DeleteAppointmentResponse,
      DeleteAppointmentRequest
    >(
      `${this.BaseAPIUrl}/api/external/companies/:companyId/scheduler-templates/delete-appointment`,
      data
    );
  }

  DeleteAppointmentSchedulerTemplate<T>(scheduler: ISchedulerData) {
    return this.formService.DeleteAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${scheduler.companyId}/scheduler-templates/${scheduler.schedulerId}`
    );
  }
}
