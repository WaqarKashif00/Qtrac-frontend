import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractComponent } from "src/app/base/abstract-component";
import { AppointmentCheckInService } from "./appointment-check-in.service";


@Component({
    selector: 'lavi-execution-appointment-checkIn',
    templateUrl: './appointment-check-in.component.html',
    providers:[AppointmentCheckInService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppointmentCheckInComponent extends AbstractComponent{
    constructor(private appointmentCheckinService : AppointmentCheckInService){
        super();
    }

}
