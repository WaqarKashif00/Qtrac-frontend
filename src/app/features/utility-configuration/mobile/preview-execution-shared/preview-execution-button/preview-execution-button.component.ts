import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewButtonData } from '../../models/mobile-preview-data.interface';

@Component({
  selector: 'lavi-preview-execution-button',
  templateUrl: './preview-execution-button.component.html',
  styleUrls: ['./preview-execution-button.component.scss'],
})
export class PreviewExecutionButtonComponent extends AbstractComponent {
  @Input() Button: IMobilePreviewButtonData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() IsAbsolutePosition: boolean = true;

  @Output() OnButtonClick: EventEmitter<void> = new EventEmitter<void>();

  ClickButton() {
    this.OnButtonClick.emit();
  }

  GetUrl(src) {
    return src?.find((x) => x.languageCode === this.SelectedLanguage)?.url;
  }
}
