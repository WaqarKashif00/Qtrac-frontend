import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { AppConfigService } from '../../core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { RecordAlreadyExistValidator } from './common.validator';

@Injectable({
  providedIn: 'root'
})
export class UserRoleValidatorService {

  get BaseAPIUrl() {
    return this.appConfigService.config.UserRoleBaseAPIUrl;
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  public EmailAlreadyExistValidator(companyId: string, roleId: string, editValue: string = ''): AsyncValidatorFn {
    return RecordAlreadyExistValidator(this.formService, `${this.BaseAPIUrl}/api/companies/${companyId}/roles/${roleId}/exists?roleName=`, editValue);
  }

}
