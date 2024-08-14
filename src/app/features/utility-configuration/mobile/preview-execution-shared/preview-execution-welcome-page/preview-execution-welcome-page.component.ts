import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewData, IMobilePreviewWelcomePageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-welcome-page',
  templateUrl: './preview-execution-welcome-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionWelcomePageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewWelcomePageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() OnNextButtonClick: EventEmitter<void> = new EventEmitter();

  ShowNextPage() {
    this.OnNextButtonClick.emit();
  }
}
