import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobileSliderControlData } from '../../models/mobile-layout-data.interface';

@Component({
  selector: 'lavi-preview-execution-slider',
  templateUrl: './preview-execution-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionSliderComponent extends AbstractComponent {
  @Input() Sliders: Array<IMobileSliderControlData>;
  @Input() SelectedLanguage: string;

  GetUrls(src){
    return src.find(x => x.languageCode === this.SelectedLanguage)?.url;
  }
}
