import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskWelcomePageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-welcome',
  templateUrl: './kiosk-welcome.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskWelcomeComponent extends AbstractComponent {
  @Input() Data: IKioskWelcomePageData;
  @Input() SelectedLanguage: string;
  @Output() ShowNextPage: EventEmitter<string> = new EventEmitter();
  @Input() DefaultLanguage: string;

  showNextPage(btnName: string) {
    this.ShowNextPage.emit(btnName);
  }
}
