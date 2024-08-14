import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { Service } from 'src/app/models/common/work-flow-detail.interface';
import { ConditionVariable, DynamicVariable } from '../models/conditional-events';
import { WorkFlowService } from '../work-flow.service';

@Injectable()
export class WorkflowEstimateWaitTimesSettingsServices extends AbstractComponentService {
  EstimateWaitSettingsForm: FormGroup;
  IsAllowCalculateEstimateWaitTime$:Observable<boolean>;

  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  DynamicVariables$: Observable<ConditionVariable[]>;

  Services$: Observable<Service[]>;

  get IsAnyNonDeletedService(){
    return this.workflowService.ServicesSubject.value.some(x=>!x.isDeleted);
  }
  
  constructor(private workflowService: WorkFlowService) {
    super();
    this.Initialize();
  }

  Initialize() {
    this.IsAllowCalculateEstimateWaitTime$ = this.workflowService.IsAllowCalculateEstimateWaitTime$;
    this.EstimateWaitSettingsForm = this.workflowService.EstimateWaitSettingsForm;
    this.Services$ = this.workflowService.Services$;

    this.OpenDialog$ = this.workflowService.OpenTranslateDialog$;
    this.TextFormArray$ = this.workflowService.LabelTextFormArray$;

    this.DynamicVariables$ = this.workflowService.DynamicVariablesList$;

  }

  OpenTranslateDialog(rangeId: number){
    this.workflowService.OpenTranslateDialogForEstimateWaitSettings(rangeId);
  }

  TranslateText(textToTranslate: string) {
    this.workflowService.TranslateText(textToTranslate);
  }

  UpdateTranslatedTexts(event,rangeId) {
    this.workflowService.UpdateTranslatedTexts(event, rangeId);
  }


  CloseTranslateDialog(): void {
    this.workflowService.CloseTranslateDialog();
  }

  WaitTimeChanged(waitTime: number, serviceId: string) {
    this.workflowService.WaitTimeChanged(waitTime,serviceId)
  }
  
  
 
}
