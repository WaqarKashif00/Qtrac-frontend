import { Component, Input } from '@angular/core';
import { BaseControlComponent } from '../../../../Models/base/base-control-component';
import { SliderControl } from '../../../../Models/controls/slider.control';

@Component({
  selector: 'lavi-slider-control',
  templateUrl: './slider-control.component.html',
})
export class SliderControlComponent extends BaseControlComponent {
  @Input() Controls: Array<SliderControl>;
  @Input() SelectedLanguageCode: string;
  @Input() DefaultLanguageCode: string;

  GetUrl(src){
    return (src.find(x => x.languageCode === (this.SelectedLanguageCode || this.DefaultLanguageCode))?.url);
  }
}
