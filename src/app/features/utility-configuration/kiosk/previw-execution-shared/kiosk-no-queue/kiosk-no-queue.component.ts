import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskNoQueuePageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-no-queue',
  templateUrl: './kiosk-no-queue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskNoQueueComponent extends AbstractComponent {
  @Input() Data: IKioskNoQueuePageData;
  @Input() SelectedLanguage: string;
  @Output() ExitButton: EventEmitter<string> = new EventEmitter();
  @Input() DefaultLanguage: string;

  showNextPage(btnName: string) {
    this.ExitButton.emit(btnName);
  }
}
