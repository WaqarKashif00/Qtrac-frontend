import { Routes } from '@angular/router';
import { WorkFlowComponent } from 'src/app/features/work-flow/work-flow.component';
import { AdvanceRuleComponent } from '../features/work-flow/advance-rule/advance-rule.component';
import { AppointTemplateComponent } from '../features/work-flow/appointment-templates/appointment-templates.component';
import { BasicWorkflowRulesComponent } from '../features/work-flow/basic-workflow-rules/basic-workflow-rules.component';
import { WorkflowEstimateWaitTimesSettingsComponent } from '../features/work-flow/estimate-wait-times/estimate-wait-times.component';
import { GeneralSettingsComponent } from '../features/work-flow/general-settings/general-settings-component';
import { GroupsComponent } from '../features/work-flow/groups/groups.component';
import { PreServiceQuestionsComponent } from '../features/work-flow/pre-service-questions/pre-service-questions.component';
import { QueuesComponent } from '../features/work-flow/queues/queues.component';
import { ServiceQuestionsComponent } from '../features/work-flow/service-questions/service-questions.component';
import { ServicesComponent } from '../features/work-flow/services/services.component';
import { SettingsComponent } from '../features/work-flow/settings/settings.component';
import { SurveyQuestionsComponent } from '../features/work-flow/survey-question/survey-question-set.component';
import { WorkFlowConfigurationComponent } from '../features/work-flow/work-flow-configuration/work-flow-configuration.component';
import { WorkflowConfigPath } from '../models/constants/workflow-config-path.constant';


export const WorkFlowRoutes: Routes = [
  { path: '', component: WorkFlowComponent   },
  {
    path: 'config', component: WorkFlowConfigurationComponent, 
    children: [
      { path: WorkflowConfigPath.services, component: ServicesComponent },
      { path: WorkflowConfigPath.queues, component: QueuesComponent },
      { path: WorkflowConfigPath.serviceQuestions, component: ServiceQuestionsComponent },
      { path: WorkflowConfigPath.surveyQuestions, component: SurveyQuestionsComponent },
      { path: WorkflowConfigPath.workflowDescription, component: GeneralSettingsComponent },
      { path: WorkflowConfigPath.preServiceQuestions, component: PreServiceQuestionsComponent  },
      { path: WorkflowConfigPath.settings, component: SettingsComponent  },
      { path: WorkflowConfigPath.basicWorkflowRules, component: BasicWorkflowRulesComponent  },
      { path: WorkflowConfigPath.appointmentTemplates, component: AppointTemplateComponent },
      { path: WorkflowConfigPath.groups, component: GroupsComponent  },
      { path: WorkflowConfigPath.estimatedWaitTimes, component: WorkflowEstimateWaitTimesSettingsComponent  },
      { path: WorkflowConfigPath.advanceRules, component: AdvanceRuleComponent  },
      { path: '', redirectTo: 'workflow-description'  },
    ]
  }
];
