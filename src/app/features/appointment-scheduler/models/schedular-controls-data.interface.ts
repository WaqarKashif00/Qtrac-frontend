import { Announcement } from './controls/announcement.control';
import { DesignerPanel } from './controls/designer-panel.control';
import { TicketProperty } from './controls/ticket-property.control';
import { FooterProperties } from './controls/footer.control'

export interface ISchedulerControlData {
  designerPanel: DesignerPanel;
  ticketProperties: TicketProperty;
  announcement: Announcement;
  footerProperties: FooterProperties
}

