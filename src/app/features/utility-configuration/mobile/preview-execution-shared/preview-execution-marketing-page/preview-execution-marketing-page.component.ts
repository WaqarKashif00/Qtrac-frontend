import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {   IMobilePreviewMarketingPageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-marketing-page',
  templateUrl: './preview-execution-marketing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionMarketingPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewMarketingPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() NextButtonClick: EventEmitter<void> = new EventEmitter();

  ShowNextPage() {
    this.NextButtonClick.emit();
  }
}
