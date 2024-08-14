import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHomeInterfaceSliderControlData } from '../../add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Component({
  selector: 'lavi-home-interface-preview-slider',
  templateUrl: './preview-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewSliderComponent extends AbstractComponent {
  @Input() Sliders: Array<IHomeInterfaceSliderControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  GetUrls(src){
    return src.find(x => x.languageCode === (this.SelectedLanguage || this.DefaultLanguage))?.url;
  }
}
