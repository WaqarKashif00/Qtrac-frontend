import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskOffLinePageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-off-line',
  templateUrl: './kiosk-off-line-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskOffLineComponent extends AbstractComponent {
  @Input() Data: IKioskOffLinePageData;
  @Input() SelectedLanguage: string;
  @Output() BackButton: EventEmitter<string> = new EventEmitter();
  @Input() DefaultLanguage: string;
  @Input() showBackButton$:Observable<boolean>;

  showBackPage(btnName: string) {
    this.BackButton.emit(btnName);
  }
}
