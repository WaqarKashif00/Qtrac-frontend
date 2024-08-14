import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppointmentSchedulerExecutionsService } from './scheduler-execution.service';

@Component({
  selector: 'lavi-appointment-execution',
  templateUrl: './scheduler-execution.component.html',
  styleUrls: ['./scheduler-execution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppointmentSchedulerExecutionsService],
})
export class SchedulerExecutionComponent extends AbstractComponent {
  constructor(private service: AppointmentSchedulerExecutionsService) {
    super();
    this.service.AskNavigatorForCurrentLocationOfCustomer()
  }
  Destroy(){
    this.service.browserStorageService.RemoveAppointmentVerificationToken();
  }
}
