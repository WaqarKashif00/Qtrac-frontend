import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkFlowRoutes } from 'src/app/routes/workflow.routes';
import { NoOfDigitToTicketNumberingFormatPipe } from 'src/app/shared/pipes/no-of-digit-to-no-of-zero.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvanceRuleContentComponent } from './advance-rule/advance-rule-content/advance-rule-content.component';
import { AdvanceWorkflowListComponent } from './advance-rule/advance-rule-content/advance-workflow-list/advance-workflow-list.component';
import { ConditionContentComponent } from './advance-rule/advance-rule-content/condition-content/condition-content.component';
import { AdvanceRuleComponent } from './advance-rule/advance-rule.component';
import { AppointmentTemplateAddComponent } from './appointment-templates/appointment-add/appointment-add.component';
import { AppointTemplateListComponent } from './appointment-templates/appointment-list/appointment-list.component';
import { AppointTemplateComponent } from './appointment-templates/appointment-templates.component';
import { BasicWorkflowRulesComponent } from './basic-workflow-rules/basic-workflow-rules.component';
import { WorkflowEstimateWaitTimesSettingsComponent } from './estimate-wait-times/estimate-wait-times.component';
import { GeneralSettingsComponent } from './general-settings/general-settings-component';
import { GroupsAddComponent } from './groups/groups-add/groups-add.component';
import { GroupsListComponent } from './groups/groups-list/groups-list.component';
import { GroupsComponent } from './groups/groups.component';
import { WorkflowLanguageImageModalComponent } from './language-image-modal/workflow-language-image-modal.component';
import { PreServiceQuestionsAddComponent } from './pre-service-questions/pre-service-questions-add/pre-service-questions-add.component';
import { PreServiceQuestionsListComponent } from './pre-service-questions/pre-service-questions-list/pre-service-questions-list.component';
import { PreServiceQuestionsComponent } from './pre-service-questions/pre-service-questions.component';
import { QueuesAddComponent } from './queues/queues-add/queues-add.component';
import { QueuesListComponent } from './queues/queues-list/queues-list.component';
import { QueuesComponent } from './queues/queues.component';
import { AddQuestionSetComponent } from './service-questions/add-question-set/add-question-set.component';
import { ServiceQuestionListComponent } from './service-questions/service-question-list/service-question-list.component';
import { ServiceQuestionsComponent } from './service-questions/service-questions.component';
import { DailyHoursComponent } from './services/services-add/operational-hours/daily/daily-hours.component';
import { DefaultHoursComponent } from './services/services-add/operational-hours/default/default-hours.component';
import { DuringDateRangeHoursComponent } from './services/services-add/operational-hours/during-date-range/during-date-range-hours.component';
import { OnCustomDateHoursComponent } from './services/services-add/operational-hours/on-custom-date/on-custom-date-hours.component';
import { OperationalDateHoursComponent } from './services/services-add/operational-hours/operational-date-hours/operational-date-hours.component';
import { OperationalHoursComponent } from './services/services-add/operational-hours/operational-hours/operational-hours.component';
import { WeeklyHoursComponent } from './services/services-add/operational-hours/weekly/weekly-hours.component';
import { ServicesAddComponent } from './services/services-add/services-add.component';
import { ServicesListComponent } from './services/services-list/services-list.component';
import { ServicesComponent } from './services/services.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedAddEditConditionComponent } from './shared-add-edit-condition/shared-add-edit-condition.component';
import { SharedAddEditQuestionComponent } from './shared-add-edit-question/shared-add-edit-question-component';
import { SharedQuestionService } from './shared-add-edit-question/shared-question.service';
import { ShowDynamicFieldComponent } from './show-dynamicfield/show-dynamic-field.component';
import { AddSurveyQuestionSetComponent } from './survey-question/add-survey-question-set/add-survey-question-set.component';
import { SurveyQuestionListComponent } from './survey-question/survey-question-list/survey-question-list.component';
import { SurveyQuestionsComponent } from './survey-question/survey-question-set.component';
import { WorkFlowConfigurationComponent } from './work-flow-configuration/work-flow-configuration.component';
import { WorkFlowListComponent } from './work-flow-list/work-flow-list.component';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowService } from './work-flow.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(WorkFlowRoutes),
  ],
  declarations: [
    WorkFlowComponent,
    PreServiceQuestionsComponent,
    PreServiceQuestionsAddComponent,
    PreServiceQuestionsListComponent,
    WorkFlowConfigurationComponent,
    ServicesComponent,
    ServicesAddComponent,
    WorkflowLanguageImageModalComponent,
    ServicesListComponent,
    AppointTemplateComponent,
    AppointmentTemplateAddComponent,
    AppointTemplateListComponent,
    QueuesComponent,
    GeneralSettingsComponent,
    BasicWorkflowRulesComponent,
    QueuesAddComponent,
    SettingsComponent,
    ServiceQuestionsComponent,
    ServiceQuestionListComponent,
    AddQuestionSetComponent,
    SurveyQuestionsComponent,
    SurveyQuestionListComponent,
    AddSurveyQuestionSetComponent,
    QueuesListComponent,
    WorkFlowListComponent,
    SharedAddEditQuestionComponent,
    SharedAddEditConditionComponent,
    GroupsComponent,
    GroupsAddComponent,
    GroupsListComponent,
    WorkflowEstimateWaitTimesSettingsComponent,
    AdvanceRuleComponent,
    AdvanceRuleContentComponent,
    ConditionContentComponent,
    AdvanceWorkflowListComponent,
    ShowDynamicFieldComponent,
    DailyHoursComponent,
    DefaultHoursComponent,
    DuringDateRangeHoursComponent,
    OnCustomDateHoursComponent,
    WeeklyHoursComponent,
    OperationalHoursComponent,
    OperationalDateHoursComponent,
  ],
  providers: [
    WorkFlowService,
    SharedQuestionService ,
    NoOfDigitToTicketNumberingFormatPipe,
  ]
})
export class WorkFlowModule { }
