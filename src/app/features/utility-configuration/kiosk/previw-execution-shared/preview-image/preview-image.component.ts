import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskImageControlData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';

@Component({
  selector: 'lavi-preview-image',
  templateUrl: './preview-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImageComponent extends AbstractComponent {
  @Input() Images: Array<IKioskImageControlData>;
  @Input() SelectedLanguage: string;

  GetUrl(src, languageCode){
    return src.find(x => x.languageCode === languageCode)?.url;
  }
}
