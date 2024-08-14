import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { RecordAlreadyExistValidator } from './common.validator';

@Injectable({
  providedIn: 'root'
})
export class CompanyValidatorService {

  constructor(private readonly formService: FormService, private readonly appConfigService: AppConfigService) { }

  public NameAlreadyExistValidator(companyId: string, editValue: string = ''): AsyncValidatorFn {
    return RecordAlreadyExistValidator(this.formService, `/api/companies/${companyId}/exists?companyName=`, editValue);
  }

}
