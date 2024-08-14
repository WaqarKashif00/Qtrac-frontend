import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetLocalDateFromUTCDateValue, GetUTCDateForLocalDateValues } from 'src/app/core/utilities/time-zone-utilities';
import { IHoursOfOperation, IHoursOfOperationBase } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class HoursOfOperationAPIService {


  get BaseAPIUrl() {
    return this.appConfigService.config.HoursOfOperationBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations`);
  }

  Create<T, P>(companyId: string, data: IHoursOfOperation): Observable<P> {
    if (data.nonWorkingDaysList && data.nonWorkingDaysList.length > 0){
      data.nonWorkingDaysList.forEach(holiday => {
        holiday.fromDate = GetUTCDateForLocalDateValues(holiday.fromDate);
        holiday.toDate = GetUTCDateForLocalDateValues(holiday.toDate);
      });
    }
    return this.formService.PostAPICall<P, IHoursOfOperation>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations`, data);
  }

  Delete<T>(companyId: string, hooId: string) {
    return this.formService.DeleteAPICall<T>(
      `${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations/${hooId}`
    );
  }

  Get<T extends IHoursOfOperationBase>(companyId: string, hooId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations/${hooId}`)
    .pipe(map(hoo => {
      if (hoo && hoo.nonWorkingDaysList?.length > 0){
        hoo.nonWorkingDaysList.forEach(day => {
            day.fromDate = GetLocalDateFromUTCDateValue(day.fromDate);
            day.toDate = GetLocalDateFromUTCDateValue(day.toDate);
        });
      }
      return hoo;
    }));
  }

  Update<T, P>(companyId: string, data: IHoursOfOperation): Observable<P> {
    if (data.nonWorkingDaysList && data.nonWorkingDaysList.length > 0){
      data.nonWorkingDaysList.forEach(holiday => {
        holiday.fromDate = GetUTCDateForLocalDateValues(holiday.fromDate);
        holiday.toDate = GetUTCDateForLocalDateValues(holiday.toDate);
      });
    }
    return this.formService.PutAPICall<P, IHoursOfOperation>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations`, data);
  }

  GetHolidays<T>(companyId: string, year: number, countryId: string): Observable<LaviHoliday[]> {
    return this.formService.GetAPICall<LaviHoliday[]>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations/years/${year}/holidays?countryId=${countryId}`)
    .pipe(map(holidays => {
      holidays.forEach(x => {
        x.date = GetLocalDateFromUTCDateValue(new Date(new Date(x.date).toUTCString())).toUTCString();
      });
      return holidays;
    }));
  }

  AlreadyExists(companyId: string, hooId: string, templateName: string): Observable<boolean> {
    return this.formService.GetAPICall<boolean>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations/${hooId}/exists?templateName=${templateName}`, false);
  }

  GetDropdownList<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/hours-of-operations/lookup/list`);
  }

  GetAllExternal<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/hours-of-operations`);
  }

  GetExternal<T extends IHoursOfOperationBase>(companyId: string, hooId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/external/companies/${companyId}/hours-of-operations/${hooId}`)
    .pipe(map(hoo => {
      if (hoo && hoo.nonWorkingDaysList?.length > 0){
        hoo.nonWorkingDaysList.forEach(day => {
          day.fromDate = GetLocalDateFromUTCDateValue(day.fromDate);
          day.toDate = GetLocalDateFromUTCDateValue(day.toDate);
        });
      }
      return hoo;
    }));
  }

}


export class LaviHoliday{
  country: string;
  date: string;
  name: string;
  observed: string;
  public: true;
  uuid: string;
}
