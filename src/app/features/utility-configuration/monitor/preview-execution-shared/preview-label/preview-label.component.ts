import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMonitorLabelControlData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';
@Component({
  selector: 'lavi-preview-label',
  templateUrl: './preview-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLabelComponent extends AbstractComponent {
  @Input() Labels: Array<IMonitorLabelControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

}
