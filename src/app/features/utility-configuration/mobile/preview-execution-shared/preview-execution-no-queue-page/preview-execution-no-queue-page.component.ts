import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewNoQueuePageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-no-queue-page',
  templateUrl: './preview-execution-no-queue-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionNoQueuePageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewNoQueuePageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() OnExitButtonClick: EventEmitter<void> = new EventEmitter();

  ExitButton() {
    this.OnExitButtonClick.emit();
  }
}
