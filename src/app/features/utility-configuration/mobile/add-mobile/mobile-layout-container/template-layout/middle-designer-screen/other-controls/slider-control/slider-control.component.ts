import { Component, Input } from '@angular/core';
import { MobileBaseControlComponent } from 'src/app/features/utility-configuration/mobile/models/base/mobile-base-control-component';
import { SliderControl } from 'src/app/features/utility-configuration/mobile/models/controls/slider.control';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';

@Component({
  selector: 'lavi-slider-control',
  templateUrl: './slider-control.component.html',
})
export class SliderControlComponent extends MobileBaseControlComponent {
  @Input() Controls: Array<SliderControl>;
  @Input() DivLayoutDesignContainer;
  @Input() SelectedLanguage: ICurrentLanguage;

  GetUrl(src){
    return (src.find(x => x.languageCode === this.SelectedLanguage.selectedLanguage)?.url);
  }
}
