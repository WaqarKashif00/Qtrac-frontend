import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {   IMobilePreviewThankYouPageData, IMobilePreviewWelcomePageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-thank-you-page',
  templateUrl: './preview-execution-thank-you-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionThankYouPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewThankYouPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() NextButtonClick: EventEmitter<void> = new EventEmitter();

  ShowNextPage() {
    this.NextButtonClick.emit();
  }
}
