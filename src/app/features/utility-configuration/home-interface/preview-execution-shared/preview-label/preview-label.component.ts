import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHomeInterfaceLabelControlData } from '../../add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Component({
  selector: 'lavi-home-interface-preview-label',
  templateUrl: './preview-label.component.html',
  styleUrls: ['./preview-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLabelComponent extends AbstractComponent {
  @Input() Labels: Array<IHomeInterfaceLabelControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

}
