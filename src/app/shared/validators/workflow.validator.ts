import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { FormService } from '../../core/services/form.service';
import { RecordAlreadyExistValidator } from './common.validator';

@Injectable({
  providedIn: 'root'
})
export class WorkflowValidatorService {

  get BaseAPIUrl() {
    return this.appConfigService.config.WorkFlowBaseAPIUrl;
  }
  constructor(private readonly formService: FormService, private readonly appConfigService: AppConfigService) { }

  public WorkflowNameAlreadyExistValidator(companyId: string, workflowId: string, editValue: string = ''): AsyncValidatorFn {
    return RecordAlreadyExistValidator(this.formService, this.BaseAPIUrl + `/api/companies/${companyId}/workflows/${workflowId}/exists?workflowName=`, editValue);
  }

}
