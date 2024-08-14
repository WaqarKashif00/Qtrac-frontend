import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { FormService } from '../../core/services/form.service';
import { RecordAlreadyExistValidator } from './common.validator';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class HouseOfOperationsValidatorService {

  get BaseAPIUrl() {
    return this.appConfigService.config.HoursOfOperationBaseAPIUrl;
  }

  constructor(private readonly formService: FormService, private readonly appConfigService: AppConfigService) { }

  public TemplateNameAlreadyExistValidator(companyId: string, hooId: string, editValue: string = ''): AsyncValidatorFn {
    return RecordAlreadyExistValidator(this.formService, this.BaseAPIUrl + `/api/companies/${companyId}/hours-of-operations/${hooId}/exists?templateName=`, editValue);
  }
}
