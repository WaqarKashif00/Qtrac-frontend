import { Component, Input } from '@angular/core';
import { BaseControlComponent } from '../../../../models/base/base-control-component';
import { SliderControl } from '../../../../models/controls/slider.control';

@Component({
  selector: 'lavi-slider-control',
  templateUrl: './slider-control.component.html',
})
export class SliderControlComponent extends BaseControlComponent {
  @Input() Controls: Array<SliderControl>;
  @Input() SelectedLanguage: string;

  GetUrl(src){
    return ( src.find(x => x.languageCode === this.SelectedLanguage)?.url);
  }
}
