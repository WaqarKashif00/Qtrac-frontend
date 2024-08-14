import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppointmentSchedulerPageName } from 'src/app/models/enums/appointment-scheduler.enum';
import { Announcement } from '../../../models/controls/announcement.control';
import { DesignerPanel } from '../../../models/controls/designer-panel.control';
import { FooterProperties } from '../../../models/controls/footer.control';
import { TicketProperty } from '../../../models/controls/ticket-property.control';
import { PropertyWindowService } from './property-window.service';

@Component({
  selector: 'lavi-property-window',
  templateUrl: './property-window.component.html',
  providers: [PropertyWindowService],
})
export class PropertyWindowComponent extends AbstractComponent {
  PageName = AppointmentSchedulerPageName;
  SelectedPage$: Observable<string>;
  DesignerPanel$: Observable<DesignerPanel>;
  TicketPropertyPanel$: Observable<TicketProperty>;
  Announcement$: Observable<Announcement>;
  FooterPropertiesPanel$: Observable<FooterProperties>;

  constructor(private service: PropertyWindowService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
    this.DesignerPanel$ = this.service.DesignerPanel$;
    this.TicketPropertyPanel$ = this.service.TicketPropertyPanel$;
    this.Announcement$ = this.service.Announcement$;
    this.FooterPropertiesPanel$ = this.service.FooterDetail$;
  }

  WorkFlowChangeButtonClicked(){
    this.service.ChangeWorkFlow();
  }

  UpdateDesignerData(form: FormGroup) {
    this.service.UpdateDesignerData(form);
  }

  UpdateTicketPropertyData(form: FormGroup){
    this.service.UpdateTicketPropertyData(form);
  }

  UpdateAnnouncementData(form: FormGroup){
    this.service.UpdateAnnouncementPropertyData(form);
  }

  UpdateFooterData(form: FormGroup){
    this.service.UpdateFooterData(form);
  }
}
