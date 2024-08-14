import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { Mode } from 'src/app/models/enums/mode.enum';
import { WorkflowValidationMessage } from 'src/app/models/validation-message/workflow-message';
import { BasicWorkflowRuleService } from '../basic-workflow-rules/basic-workflow-service';
import { QueuesService } from '../queues/queues.service';
import { SettingsService } from '../settings/settings.service';
import { WorkFlowService } from '../work-flow.service';

@Component({
  selector: 'lavi-work-flow-configuration',
  templateUrl: './work-flow-configuration.component.html',
  providers: [SettingsService,BasicWorkflowRuleService,QueuesService],
  styleUrls: ['./work-flow-configuration.component.scss']
})
export class WorkFlowConfigurationComponent extends AbstractComponent {

  OpenSettingModal$: Observable<boolean>;
  IsPreServiceQuestionVisible$: Observable<boolean>;
  WorkFlowMessage = WorkflowValidationMessage;

  get WorkFlowNameForm() {
    return this.workFlowService.WorkFlowNameForm;
  }

  constructor(
    private settingService: SettingsService,
    private workFlowService: WorkFlowService,
    private queueService : QueuesService
  ) {
    super();
    this.workFlowService.InitRequiredWorkFlowConfiguration();
    this.OpenSettingModal$ = this.settingService.OpenSettingModal$;
    this.IsPreServiceQuestionVisible$ = this.workFlowService.IsPreServiceQuestionVisible$;
  }

  Init() {

    const workFlowId = this.workFlowService.GetWorkFlowId();
    const companyId = this.workFlowService.CompanyId;
    this.workFlowService.GetSupportedLanguages(companyId);
    this.workFlowService.getCompanyInfo();
    if (workFlowId) {
      this.workFlowService.Mode = Mode.Edit;

      this.workFlowService.Get(workFlowId);
    } else {

      this.workFlowService.OnGetApiResponse(this.workFlowService.GetDefaultWorkflow());
      this.workFlowService.GetVariables();
      this.workFlowService.Mode = Mode.Add;
      this.queueService.QueuesSubject.value.push(this.queueService.GetDefaultQueueForSingleQueueConfiguration())
    }
  }

  openSettings() {
    this.settingService.OpenModal();
  }

  SaveAndDraft() {
    this.workFlowService.SaveAsDraft();
  }

  SaveAndPublish() {
    this.workFlowService.SaveAsPublish();
  }
}
