import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskLabelControlData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-preview-label',
  templateUrl: './preview-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLabelComponent extends AbstractComponent {
  @Input() Labels: Array<IKioskLabelControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

}
