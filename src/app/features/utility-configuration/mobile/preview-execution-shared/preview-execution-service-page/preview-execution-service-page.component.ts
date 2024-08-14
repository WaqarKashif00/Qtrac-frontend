import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewServicePageData, IMobilePreviewWelcomePageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-service-page',
  templateUrl: './preview-execution-service-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionServicePageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewServicePageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() OnItemSelect: EventEmitter<string> = new EventEmitter();
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter();

  OpenAppointmentModal = false;

  CanShowNextPage(item){
    if(item.isActive){
      this.ShowNextPage(item.itemId)
    } else{
      return
    }
  }

  ShowNextPage(serviceId) {
      this.OnItemSelect.emit(serviceId);
  }

  ShowAppointmentDialog(){
    this.OpenAppointmentModal = true;
  }

  CloseAppointmentDialog(){
    this.OpenAppointmentModal = false;
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }
}
