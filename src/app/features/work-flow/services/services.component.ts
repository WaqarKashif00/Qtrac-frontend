import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GroupResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Mode } from 'src/app/models/enums/mode.enum';
import { HoursOfOperation } from '../models/hours-of-operation.interface';
import { SurveyTemplate } from '../models/survey-template.interface';
import { TicketTemplate } from '../models/ticket-template.interface';
import { AppointmentTemplate } from '../models/work-flow-request.interface';
import { Service } from '../../../models/common/work-flow-detail.interface';
import { ServiceService } from './service.service';

@Component({
  selector: 'lavi-services',
  templateUrl: './services.component.html',
  providers: [ServiceService],
  styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})
export class ServicesComponent extends AbstractComponent {

  serviceList$: Observable<Service[]>;
  OpenServiceModal$: Observable<boolean>;
  Routings$: Observable<GroupResult[]>;
  Appointments$: Observable<AppointmentTemplate[]>;
  HoursOfOperations$: Observable<any[]>;
  SurveyTemplates$: Observable<SurveyTemplate[]>;
  TicketTemplates$: Observable<TicketTemplate[]>;
  Mode: string;

  constructor(private service: ServiceService) {
    super();
    this.InitObservables();
    this.service.CallMultipleDropDownAPI();
  }

  private InitObservables() {
    this.serviceList$ = this.service.serviceList$;
    this.OpenServiceModal$ = this.service.OpenServiceModal$;
    this.Routings$ = this.service.Routings$;
    this.HoursOfOperations$ = this.service.HoursOfOperations$;
    this.SurveyTemplates$ = this.service.SurveyTemplates$;
    this.TicketTemplates$ = this.service.TicketTemplates$;
    this.Appointments$ = this.service.Appointments$;
  }

  Add() {
    this.Mode = Mode.Add;
    this.service.OpenModalAndInitAddConfigurations();
  }

  Edit(service: Service) {
    this.Mode = Mode.Edit;
    this.service.OpenModalAndInitEditConfigurations();
    this.service.SetEditData(service);
  }

  Copy(service: Service) {
    this.service.CopyService(service);
  }

  Delete(id: string) {
    this.service.Delete(id);
  }

  Save(form: FormGroup) {
    if (this.Mode === Mode.Add) {
      this.service.Add(form);
    }
    if (this.Mode === Mode.Edit) {
      this.service.Edit(form);
    }
  }

  CloseModal() {
    this.service.CloseModalAndResetForm();
  }

}
