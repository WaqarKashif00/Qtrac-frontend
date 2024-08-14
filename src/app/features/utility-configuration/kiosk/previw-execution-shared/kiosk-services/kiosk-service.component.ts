import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { IKioskPreviewPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-service',
  templateUrl: './kiosk-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskServiceComponent extends AbstractComponent {
  @Input() Data: IKioskPreviewPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  @Output() NextPage: EventEmitter<string> = new EventEmitter();
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter<string>();

  OpenAppointmentModal = false;
  AppointmentButtonName = 'Appointment Button';

  constructor(private notify: AppNotificationService) {
    super();
  }

  CanShowNextPage(service){
    if(service.isActive){
      this.ShowNextPage(service.itemId)
    } else{
      return
    }
  }

  ShowNextPage(id) {
    if (this.Data.items.find((x) => x.itemId === id).selected) {
      this.NextPage.emit(id);
    } else {
      this.notify.NotifyError('These service is not available.');
    }
  }

  showNextPage(name: string) {
    if (name === this.AppointmentButtonName) {
      this.OpenAppointmentDialog();
    }
    else {
      this.NextPage.emit(name);
    }
  }

  OpenAppointmentDialog() {
    this.OpenAppointmentModal = true;
  }

  CloseAppointmentDialog() {
    this.OpenAppointmentModal = false;
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }

}
