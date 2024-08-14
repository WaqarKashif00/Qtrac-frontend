import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { AbstractComponent } from "src/app/base/abstract-component";
import { Appointment } from "../../models/appointment/appointment.model";
import { GetAppointmentItemCircleClass } from "../calendar-utilities/appointment-item-circle-style-resolver";

@Component({
  selector: 'lavi-agent-calendar-item',
  templateUrl: './agent-calendar-Item.component.html',
  styleUrls: ['./agent-calendar-Item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCalendarItemComponent extends AbstractComponent {

  @Input() SchedulerEvent: SchedulerEvent;
  @Input() Appointment: Appointment;

  @Output() OnOpenAppointmentDetails: EventEmitter<Appointment>;

  get StatusStyle(): any {
    return GetAppointmentItemCircleClass(this.Appointment)
  }

  constructor(
  ) {
    super();
    this.InitializeOutputs();
  }

  private InitializeOutputs() {
    this.OnOpenAppointmentDetails = new EventEmitter<Appointment>();
  }

  OpenAppointmentDetailsDialog(): void {
    this.OnOpenAppointmentDetails.emit(this.Appointment);
  }

}

