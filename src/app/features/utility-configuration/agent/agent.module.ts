
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentExecutionRoutes } from 'src/app/routes/agent-execution.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgentAddVisitorModalComponent } from './agent-add-visitor-modal/agent-add-visitor-modal.component';
import { AgentAddVisitorModalService } from './agent-add-visitor-modal/agent-add-visitor-modal.service';
import { AgentCalendarComponent } from './agent-calendar/agent-calendar.component';
import { AgentCalendarService } from './agent-calendar/agent-calendar.service';
import { AgentCalendarAppointmentDetailsComponent } from './agent-calendar/appointment-details/agent-calendar-appointment-details.component';
import { AgentCalendarAppointmentDetailsService } from './agent-calendar/appointment-details/agent-calendar-appointment-details.service';
import { AgentCalendarItemComponent } from './agent-calendar/calender-item/agent-calendar-Item.component';
import { AgentMoveToPositionModalComponent } from './agent-move-to-position/agent-move-to-position-modal.component';
import { AgentAgentMoveToPositionModalService } from './agent-move-to-position/agent-move-to-position-modal.service';
import { AgentNotesModalComponent } from './agent-notes/agent-notes-modal.component';
import { AgentNotesModalService } from './agent-notes/agent-notes-modal.service';
import { AgentSMSChatModalComponent } from './agent-sms-chat/agent-sms-chat-modal.component';
import { AgentSMSChatModalService } from './agent-sms-chat/agent-sms-chat-modal.service';
import { AgentSMSMessageRowComponent } from './agent-sms-chat/agent-sms-message-row/agent-sms-message-row.component';
import { AgentTemplateModalComponent } from './agent-template-selection-modal/agent-template-selection-modal.component';
import { AgentComponent } from './agent.component';
import { AgentService } from './agent.service';
import { AgentCustomerChangePositionComponent } from './classic-agent-template/agent-customer-change-position/agent-customer-change-position.component';
import { AgentCustomerInformationDialogBoxComponent } from './classic-agent-template/agent-customer-information-dialog/agent-customer-information-dialog.component';
import { AgentCustomerListItemComponent } from './classic-agent-template/agent-customer-list-item/agent-customer-list-item.component';
import { AgentDialogBoxComponent } from './classic-agent-template/agent-dialog-box/agent-dialog-box.component';
import { AgentFilterItemComponent } from './classic-agent-template/agent-filter-item/agent-filter-item.component';
import { AgentFiltersComponent } from './classic-agent-template/agent-filters/agent-filters.component';
import { AgentGridMessageBannerComponent } from './classic-agent-template/agent-grid-message-banner/agent-grid-message-banner.component';
import { AgentGroupItemComponent } from './classic-agent-template/agent-group-item/agent-group-item.component';
import { AgentGroupModalComponent } from './classic-agent-template/agent-group-modal/agent-group-modal.component';
import { AgentGroupsModalService } from './classic-agent-template/agent-group-modal/agent-group-modal.service';
import { AgentGroupsSidebarComponent } from './classic-agent-template/agent-groups-sidebar/agent-groups-sidebar.component';
import { AgentGroupsSidebarService } from './classic-agent-template/agent-groups-sidebar/agent-groups-sidebar.service';
import { AgentHeaderComponent } from './classic-agent-template/agent-header/agent-header.component';
import { LapseTimeBannerComponent } from './classic-agent-template/agent-lapse-time-banner/agent-lapse-time-banner.component';
import { AgentQueueGridComponent } from './classic-agent-template/agent-queue-grid/agent-queue-grid.component';
import { AgentSidebarComponent } from './classic-agent-template/agent-sidebar/agent-sidebar.component';
import { AgentStationMessageBannerComponent } from './classic-agent-template/agent-station-message-banner/agent-station-message-banner.component';
import { AgentStationActionButtonsComponent } from './classic-agent-template/agent-station-panel/agent-station-action-buttons/agent-station-action-buttons.component';
import { AgentStationPanelItemComponent } from './classic-agent-template/agent-station-panel/agent-station-customer-item/agent-station-panel-item.component';
import { AgentStationPanelComponent } from './classic-agent-template/agent-station-panel/agent-station-panel.component';
import { AgentUserInformationComponent } from './classic-agent-template/agent-user-information/agent-user-information.component';
import { AgentUserInformationService } from './classic-agent-template/agent-user-information/agent-user-information.service';
import { ClassicAgentTemplateComponent } from './classic-agent-template/classic-agent-template.component';
import { ClassicAgentService } from './classic-agent-template/classic-agent.service';
import { LaviLapseTimeComponent } from './classic-agent-template/lavi-lapse-time/lavi-lapse-time.component';
import { SmoothHeightComponent } from './classic-agent-template/lavi-smooth-height/lavi-smooth-height.component';
import { SelectGroupComponent } from './classic-agent-template/select-group/select-group.component';
import { TrimmedSpanComponent } from './classic-agent-template/trim-span/trim-span.component';
import { PhoneNumberPipeModule } from './common-directives/phone-number-formatter.pipe.module';
import { PreviewInputControlsComponent } from './preview-input-controls/preview-input-controls.component';
import { AgentActionsService } from './utility-services/services/agent-actions-service/agent-actions.service';
import { AgentGridFilterService } from './utility-services/services/agent-grid-filter-service/agent-grid-filter.service';
import { AgentSignalRService } from './utility-services/services/agent-signalR/agent-signalr.service';
import { QueueSignalRService } from './utility-services/services/agent-signalR/queue-signalr.service';
import { AgentStationDataService } from './utility-services/services/agent-station-data-service/agent-station-data.service';
import { ConnectionMonitorModalComponent } from './connection-monitor/connection-monitor.component';
import { HeaderService } from '../../header/header.service';

@NgModule({
    imports: [SharedModule,
        PhoneNumberPipeModule,
        RouterModule.forChild(AgentExecutionRoutes)],
    declarations: [AgentComponent,
        AgentCustomerListItemComponent,
        ClassicAgentTemplateComponent,
        AgentTemplateModalComponent,
        SelectGroupComponent,
        AgentCustomerChangePositionComponent,
        AgentQueueGridComponent,
        LaviLapseTimeComponent,
        SmoothHeightComponent,
        AgentStationPanelComponent,
        AgentStationPanelItemComponent,
        LapseTimeBannerComponent,
        AgentStationActionButtonsComponent,
        AgentDialogBoxComponent,
        AgentCustomerInformationDialogBoxComponent,
        AgentHeaderComponent,
        AgentSidebarComponent,
        AgentFiltersComponent,
        AgentUserInformationComponent,
        AgentFilterItemComponent,
        AgentGroupItemComponent,
        AgentGroupsSidebarComponent,
        AgentAddVisitorModalComponent,
        PreviewInputControlsComponent,
        AgentSMSChatModalComponent,
        AgentSMSMessageRowComponent,
        AgentGridMessageBannerComponent,
        TrimmedSpanComponent,
        AgentNotesModalComponent,
        AgentGroupModalComponent,
        AgentStationMessageBannerComponent,
        AgentMoveToPositionModalComponent,
        AgentCalendarItemComponent,
        AgentCalendarComponent,
        AgentCalendarAppointmentDetailsComponent,
        ConnectionMonitorModalComponent
    ],
    exports: [AgentComponent,
        AgentCustomerListItemComponent,
        ClassicAgentTemplateComponent,
        AgentTemplateModalComponent,
        SelectGroupComponent,
        AgentCustomerChangePositionComponent,
        AgentQueueGridComponent,
        LaviLapseTimeComponent,
        SmoothHeightComponent,
        AgentStationPanelComponent,
        AgentStationPanelItemComponent,
        LapseTimeBannerComponent,
        AgentStationActionButtonsComponent,
        AgentDialogBoxComponent,
        AgentCustomerInformationDialogBoxComponent,
        AgentHeaderComponent,
        AgentSidebarComponent,
        AgentFiltersComponent,
        AgentUserInformationComponent,
        AgentFilterItemComponent,
        AgentGroupItemComponent,
        AgentGroupsSidebarComponent,
        AgentAddVisitorModalComponent,
        PreviewInputControlsComponent,
        ConnectionMonitorModalComponent
    ],
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
        QueueSignalRService,
        HeaderService
    ]
})
export class AgentModule {
    // module
}
