import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskPreviewPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-pre-service-question',
  templateUrl: './kiosk-pre-service-question.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskPreServiceQuestionComponent extends AbstractComponent {
  @Input() Data: IKioskPreviewPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;
  @Output() OnAppointment: EventEmitter<string> = new EventEmitter();


  @Output() NextPage: EventEmitter<string> = new EventEmitter();

  ShowNextPage(btnName: string) {
    this.NextPage.emit(btnName);
  }

  HaveAppointment(appointmentId: string): void {
    this.OnAppointment.emit(appointmentId);
  }
}
