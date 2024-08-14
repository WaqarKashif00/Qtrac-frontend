import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentTemplateRoutes } from 'src/app/routes/agent-template.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOrEditAgentConfigurationComponent } from './add-or-edit-agent-configuration/add-or-edit-agent-configuration.component';
import { AgentClassicConfigurationComponent } from './add-or-edit-agent-configuration/components/classic-agent-configuration/classic-agent-configuration.component';
import { AgentGeneralConfigurationComponent } from './add-or-edit-agent-configuration/components/general-configuration/general-configuration.component';
import { AgentLiteConfigurationComponent } from './add-or-edit-agent-configuration/components/lite-agent-configuration/lite-agent-configuration.component';
import { AgentConfigurationComponent } from './agent-configuration.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(AgentTemplateRoutes)],
  declarations: [AgentConfigurationComponent,
     AddOrEditAgentConfigurationComponent,
     AgentGeneralConfigurationComponent,
     AgentClassicConfigurationComponent,
     AgentLiteConfigurationComponent
    ],
})
export class AgentConfigurationModule {}
