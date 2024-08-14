import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserInfo } from 'src/app/features/user/models/user.interface';
import { InitialUserDetails } from 'src/app/models/common/initial-user-details.interface';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';

@Injectable({ providedIn: 'root' })
export class UserAPIService {

  get BaseAPIUrl() {
    return this.appConfigService.config.UserBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  GetAll<T>(companyId: string): Observable<T[]> {
    return this.formService.GetAPICall<T[]>(`${this.BaseAPIUrl}/api/company/${companyId}/user`);
  }

  Create<T>(companyId: string, data: T): Observable<IUserInfo> {
    return this.formService.PostAPICall<IUserInfo, T>(`${this.BaseAPIUrl}/api/company/${companyId}/user`, data);
  }

  Get<T>(companyId: string, userId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/company/${companyId}/user/${userId}/details`);
  }

  Update<T>(companyId: string, data: T): Observable<IUserInfo> {
    return this.formService.PutAPICall<IUserInfo, T>(`${this.BaseAPIUrl}/api/company/${companyId}/user`, data);
  }

  EmailExists<T>(data: T): Observable<boolean> {
    return this.formService.PostAPICall<boolean, T>(`${this.BaseAPIUrl}/api/company/null/user/emailExists`, data, false);
  }

  GetInitialDetails(companyId: string,userId: string): Observable<InitialUserDetails> {
    return this.formService.GetAPICall<InitialUserDetails>(`${this.BaseAPIUrl}/api/company/${companyId}/user/${userId}/initialdetails`);
  }

  SetOnlineAsAgent<T>(companyId: string, userId: string, status: boolean): Observable<T>{
    return this.formService.PutAPICall<T, any>(`${this.BaseAPIUrl}/api/company/${companyId}/user/agent-status`, {
      companyId,
      userId,
      status
    });
  }

  SetAgentDeskSettings<T>(companyId: string, userId: string, deskSetting: any): Observable<T>{
    return this.formService.PutAPICall<T, any>(`${this.BaseAPIUrl}/api/company/${companyId}/user/agent-desk-status`, {
      companyId,
      userId,
      deskSetting
    });
  }

  AgentOnline(templateId: string, roleId: string = null, companyId: string = null): Observable<boolean> {
    if (roleId){
      return this.formService.GetAPICall(`${this.BaseAPIUrl}/api/company/${companyId}/user/isAgentOnline/${templateId}?roleId=${roleId}`);
    }
    return this.formService.GetAPICall(`${this.BaseAPIUrl}/api/company/${companyId}/user/isAgentOnline/${templateId}`);
  }

  Delete<T>(companyId: string, userId: string): Observable<T> {
    return this.formService.DeleteAPICall<T>(`${this.BaseAPIUrl}/api/company/${companyId}/user/${userId}`);
  }

  LoginEmailExists<T>(data: T): Observable<boolean> {
    return this.formService.PostAPICall<boolean, T>(`${this.BaseAPIUrl}/api/external/company/null/user/loginEmailExists`, data, false);
  }

}
