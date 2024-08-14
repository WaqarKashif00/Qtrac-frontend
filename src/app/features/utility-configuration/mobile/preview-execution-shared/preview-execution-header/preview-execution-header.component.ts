import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewHeaderData } from '../../models/mobile-preview-data.interface';

@Component({
  selector: 'lavi-preview-execution-header',
  templateUrl: './preview-execution-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-execution-header.component.scss']
})
export class PreviewExecutionHeaderComponent extends AbstractComponent {
  @Input() HeaderData: IMobilePreviewHeaderData;
  @Input() SelectedLanguage: string;
}
