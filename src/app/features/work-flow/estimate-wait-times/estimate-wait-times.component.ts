import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Service } from 'src/app/models/common/work-flow-detail.interface';
import { Language } from 'src/app/models/enums/language-enum';
import {
  ConditionVariable,
  DynamicVariable,
} from '../models/conditional-events';
import { WorkflowEstimateWaitTimesSettingsServices } from './estimate-wait-times.service';

@Component({
  selector: 'lavi-workflow-estimate-wait-settings',
  templateUrl: './estimate-wait-times.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkflowEstimateWaitTimesSettingsServices],
  styleUrls: [
    '../work-flow-configuration/work-flow-configuration.component.scss',
  ],
})
export class WorkflowEstimateWaitTimesSettingsComponent extends AbstractComponent {
  EstimateWaitSettingsForm: FormGroup;
  IsAllowCalculateEstimateWaitTime$: Observable<boolean>;

  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  DefaultLanguage = Language.English;
  DynamicVariables$: Observable<ConditionVariable[]>;
  rangeId: number;

  Services$: Observable<Service[]>;

  get customRangesForTimeDisplayMessages(): FormArray {
    return this.EstimateWaitSettingsForm.get(
      'customRangesForTimeDisplayMessages'
    ) as FormArray;
  }
  get IsAnyNonDeletedService()
   {
     return this.service.IsAnyNonDeletedService;
   }
  constructor(
    private readonly service: WorkflowEstimateWaitTimesSettingsServices
  ) {
    super();
    this.Initialize();
  }
  Initialize() {
    this.IsAllowCalculateEstimateWaitTime$ =
      this.service.IsAllowCalculateEstimateWaitTime$;
    this.EstimateWaitSettingsForm = this.service.EstimateWaitSettingsForm;
    this.Services$ = this.service.Services$;
    this.OpenDialog$ = this.service.OpenDialog$;
    this.TextFormArray$ = this.service.TextFormArray$;
    this.DynamicVariables$ = this.service.DynamicVariables$;
  }

  AddRange(): void {
    const customRangesForTimeDisplayMessages: FormArray =
      this.EstimateWaitSettingsForm.get(
        'customRangesForTimeDisplayMessages'
      ) as FormArray;

    let defaultRange =  this.EstimateWaitSettingsForm.get(
        'defaultRange'
      ).value;
    
    if(customRangesForTimeDisplayMessages.controls.length > 0){

      let last = customRangesForTimeDisplayMessages.controls[customRangesForTimeDisplayMessages.controls.length-1].value;
      let from = last.to;
      let to = +from + +defaultRange
      customRangesForTimeDisplayMessages.push(this.GetNewRangeGroup(from,to));
      return
    }
    let from = 0;
    let to = defaultRange
    customRangesForTimeDisplayMessages.push(this.GetNewRangeGroup(from,to));
  }

  GetNewRangeGroup(from,to): FormGroup {
    return this.service.formBuilder.group({
      from: from,
      to: to,
      messages: [],
    });
  }

  DeleteRange(index: number): void {
    const customRangesForTimeDisplayMessages: FormArray =
      this.EstimateWaitSettingsForm.get(
        'customRangesForTimeDisplayMessages'
      ) as FormArray;
    customRangesForTimeDisplayMessages.removeAt(index);
  }

  OpenTranslateDialog(rangeId): void {
    this.rangeId = rangeId;
    this.service.OpenTranslateDialog(rangeId);
  }

  CloseTranslateDialog(): void {
    this.service.CloseTranslateDialog();
  }

  Translate(event) {
    this.service.TranslateText(event);
  }

  Save(event) {
    this.service.UpdateTranslatedTexts(event, this.rangeId);
  }

  WaitTimeChanged(waitTime: any, serviceId: string) {
    this.service.WaitTimeChanged(waitTime.target.value,serviceId)
  }
}
