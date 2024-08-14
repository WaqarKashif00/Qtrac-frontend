import { Component, Input } from '@angular/core';
import { BaseControlComponent } from '../../../../Models/base/base-control-component';
import { ImageControl } from '../../../../Models/controls/image.control';

@Component({
  selector: 'lavi-image-control',
  templateUrl: './image-control.component.html',
})
export class ImageControlComponent extends BaseControlComponent {
  @Input() Controls: Array<ImageControl>;
  @Input() SelectedLanguage: string;

  GetUrl(src, languageCode: string){
    return typeof(src) !== 'string' ? (src.find(x => x.languageCode === languageCode)?.url)
        : '/assets/img-icon.svg';
  }
}
