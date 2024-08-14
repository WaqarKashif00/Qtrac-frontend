import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskSliderControlData } from '../../kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';

@Component({
  selector: 'lavi-preview-slider',
  templateUrl: './preview-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewSliderComponent extends AbstractComponent {
  @Input() Sliders: Array<IKioskSliderControlData>;
  @Input() SelectedLanguage: string;

  GetUrls(src, languageCode){
    return src.find(x => x.languageCode === languageCode)?.url;
  }
}
