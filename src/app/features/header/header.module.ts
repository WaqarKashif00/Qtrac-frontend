import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { HeaderRightComponent } from './header-right/header-right.component';
import { HeaderTitleComponent } from './header-title/header-title.component';
import { AgentService } from '../utility-configuration/agent/agent.service';
import { AgentAddVisitorModalService } from '../utility-configuration/agent/agent-add-visitor-modal/agent-add-visitor-modal.service';
import { AgentCalendarService } from '../utility-configuration/agent/agent-calendar/agent-calendar.service';
import { AgentCalendarAppointmentDetailsService } from '../utility-configuration/agent/agent-calendar/appointment-details/agent-calendar-appointment-details.service';
import { AgentAgentMoveToPositionModalService } from '../utility-configuration/agent/agent-move-to-position/agent-move-to-position-modal.service';
import { AgentNotesModalService } from '../utility-configuration/agent/agent-notes/agent-notes-modal.service';
import { AgentSMSChatModalService } from '../utility-configuration/agent/agent-sms-chat/agent-sms-chat-modal.service';
import { AgentGroupsModalService } from '../utility-configuration/agent/classic-agent-template/agent-group-modal/agent-group-modal.service';
import { AgentGroupsSidebarService } from '../utility-configuration/agent/classic-agent-template/agent-groups-sidebar/agent-groups-sidebar.service';
import { AgentUserInformationService } from '../utility-configuration/agent/classic-agent-template/agent-user-information/agent-user-information.service';
import { ClassicAgentService } from '../utility-configuration/agent/classic-agent-template/classic-agent.service';
import { AgentActionsService } from '../utility-configuration/agent/utility-services/services/agent-actions-service/agent-actions.service';
import { AgentGridFilterService } from '../utility-configuration/agent/utility-services/services/agent-grid-filter-service/agent-grid-filter.service';
import { AgentSignalRService } from '../utility-configuration/agent/utility-services/services/agent-signalR/agent-signalr.service';
import { QueueSignalRService } from '../utility-configuration/agent/utility-services/services/agent-signalR/queue-signalr.service';
import { AgentStationDataService } from '../utility-configuration/agent/utility-services/services/agent-station-data-service/agent-station-data.service';

@NgModule({
  declarations: [HeaderComponent, HeaderRightComponent, HeaderTitleComponent],
  imports: [SharedModule, RouterModule],
  exports: [HeaderComponent, SharedModule],
  providers: [
    ClassicAgentService,
    AgentService,
    AgentStationDataService,
    AgentGroupsSidebarService,
    AgentUserInformationService,
    AgentSignalRService,
    AgentGridFilterService,
    AgentGridFilterService,
    AgentAddVisitorModalService,
    AgentActionsService,
    AgentSMSChatModalService,
    AgentNotesModalService,
    AgentGroupsModalService,
    AgentAgentMoveToPositionModalService,
    AgentCalendarService,
    AgentCalendarAppointmentDetailsService,
    QueueSignalRService
    
]
})
export class HeaderModule { }
