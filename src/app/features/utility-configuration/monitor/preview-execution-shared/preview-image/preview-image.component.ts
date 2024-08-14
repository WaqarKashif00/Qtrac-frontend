import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMonitorImageControlData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';

@Component({
  selector: 'lavi-preview-image',
  templateUrl: './preview-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewImageComponent extends AbstractComponent {
  @Input() Images: Array<IMonitorImageControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  GetUrl(src, languageCode){
    return src.find(x => x.languageCode === (languageCode || this.DefaultLanguage))?.url;
  }
}
