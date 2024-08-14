import { Component, Input } from '@angular/core';
import { MobileBaseControlComponent } from 'src/app/features/utility-configuration/mobile/models/base/mobile-base-control-component';
import { ImageControl } from 'src/app/features/utility-configuration/mobile/models/controls/image.control';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';

@Component({
  selector: 'lavi-video-control',
  templateUrl: './video-control.component.html',
})
export class VideoControlComponent extends MobileBaseControlComponent {
  @Input() Controls: Array<ImageControl>;
  @Input() DivLayoutDesignContainer;
  @Input() SelectedLanguage: ICurrentLanguage;

  GetUrl(src){ 
    return typeof(src) !== 'string' ? src.find(x => x.languageCode === (this.SelectedLanguage.selectedLanguage || this.SelectedLanguage.defaultLanguage))?.url : [];
  }
}
