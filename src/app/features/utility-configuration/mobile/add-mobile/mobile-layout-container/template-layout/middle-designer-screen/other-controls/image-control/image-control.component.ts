import { Component, Input } from '@angular/core';
import { MobileBaseControlComponent } from 'src/app/features/utility-configuration/mobile/models/base/mobile-base-control-component';
import { ImageControl } from 'src/app/features/utility-configuration/mobile/models/controls/image.control';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';

@Component({
  selector: 'lavi-image-control',
  templateUrl: './image-control.component.html',
})
export class ImageControlComponent extends MobileBaseControlComponent {
  @Input() Controls: Array<ImageControl>;
  @Input() DivLayoutDesignContainer;
  @Input() SelectedLanguage: ICurrentLanguage;

  GetUrl(src){
    return (src.find(x => x.languageCode === this.SelectedLanguage.selectedLanguage)?.url)
            || '/assets/img-icon.svg';
  }
}
