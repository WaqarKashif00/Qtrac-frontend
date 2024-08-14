import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppointmentTemplate } from '../models/work-flow-request.interface';
import { AppointmentTemplateService } from './appointment-template.service';
import { Mode } from 'src/app/models/enums/mode.enum';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'lavi-appointment-template',
    templateUrl: './appointment-templates.component.html',
    providers: [AppointmentTemplateService],
    styleUrls: ['../work-flow-configuration/work-flow-configuration.component.scss']
})

export class AppointTemplateComponent extends AbstractComponent {
    AppointmentTemplateList$: Observable<AppointmentTemplate[]>;
    OpenAppointTemplateDialog$: Observable<boolean>;

    get Mode() {
        return this.appointmentService.Mode;
    }
    constructor(private appointmentService: AppointmentTemplateService) {
        super();
        this.AppointmentTemplateList$ = this.appointmentService.AppointmentTemplateList$;
        this.OpenAppointTemplateDialog$ = this.appointmentService.subjectOpenAppointTemplateDialog;
    }

    OpenModel() {
        this.appointmentService.Mode = Mode.Add;
        this.appointmentService.SetFormGroup(this.appointmentService.GetDefaultAppointmentTemplate());
        this.appointmentService.OpenModal();
    }

    closeModal() {
        this.appointmentService.CloseModalAndResetForm();
    }

    Edit(appointmentTemplate: AppointmentTemplate) {
        this.appointmentService.Mode = Mode.Edit;
        this.appointmentService.SetEditData(appointmentTemplate);
        this.appointmentService.OpenModal();
    }

    Save(form: FormGroup) {
        if (this.Mode === Mode.Add) {
            this.appointmentService.Add(form);
        }
        if (this.Mode === Mode.Edit) {
            this.appointmentService.Edit(form);
        }
    }

    Delete(id: string) {
        this.appointmentService.Delete(id);
    }
}
