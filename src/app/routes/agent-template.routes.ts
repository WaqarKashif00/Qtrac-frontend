import { Routes } from '@angular/router';
import { AddOrEditAgentConfigurationComponent } from '../features/utility-configuration/agent-configuration/add-or-edit-agent-configuration/add-or-edit-agent-configuration.component';
import { AgentConfigurationComponent } from '../features/utility-configuration/agent-configuration/agent-configuration.component';

export const AgentTemplateRoutes: Routes = [
  { path: '', component: AgentConfigurationComponent },
  {
    path: 'add-agent-template',
    component: AddOrEditAgentConfigurationComponent, 
  },
  {
    path: 'edit-agent-template',
    component: AddOrEditAgentConfigurationComponent, 
  },
];
