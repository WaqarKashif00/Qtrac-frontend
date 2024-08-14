import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHomeInterfaceImageControlData } from '../../add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Component({
  selector: 'lavi-home-interface-preview-image',
  templateUrl: './preview-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImageComponent extends AbstractComponent {
  @Input() Images: Array<IHomeInterfaceImageControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  GetUrl(src){
    return src.find(x => x.languageCode === (this.SelectedLanguage || this.DefaultLanguage))?.url;
  }
}
