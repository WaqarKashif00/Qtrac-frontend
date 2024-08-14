import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderControlsComponent } from './header-controls/header-controls.component';
import { PropertyWindowComponent } from './property-window/property-window.component';
import { LayoutContainerComponent } from './layout-container/layout-container.component';
import { TicketPropertiesComponent } from './property-window/ticket-properties/ticket-properties.component';
import { GeneralPropertiesComponent } from './property-window/general-properties/general-properties.component';
import { SchedulerDesignerComponent } from './scheduler-designer.component';
import { LayoutContentComponent } from './layout-container/layout-template/layout-content.component';
import { SchedularSharedModule } from '../../scheduler-shared/scheduler-shared.module';
import { AnnouncementPropertiesComponent } from './property-window/announcement-properties/announcement-properties.component';
import { FooterPropertiesComponent } from './property-window/footer-properties/footer-properties.component'

@NgModule({
  imports: [SharedModule, SchedularSharedModule],
  declarations: [
    SchedulerDesignerComponent,
    HeaderControlsComponent,
    PropertyWindowComponent,
    LayoutContainerComponent,
    TicketPropertiesComponent,
    GeneralPropertiesComponent,
    AnnouncementPropertiesComponent,
    FooterPropertiesComponent,
    LayoutContentComponent,
  ],
  exports: [SharedModule],
})
export class AppointmentSchedulerModule { }
