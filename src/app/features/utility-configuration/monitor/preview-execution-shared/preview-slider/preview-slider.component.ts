import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMonitorSliderControlData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';

@Component({
  selector: 'lavi-preview-slider',
  templateUrl: './preview-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewSliderComponent extends AbstractComponent {
  @Input() Sliders: Array<IMonitorSliderControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  GetUrls(src, languageCode){
    return src.find(x => x.languageCode === (languageCode || this.DefaultLanguage))?.url;
  }
}
