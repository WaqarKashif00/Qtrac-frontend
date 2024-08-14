import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { IMobilePreviewLanguagePageData, IMobilePreviewWelcomePageData } from '../../models/mobile-preview-data.interface';
const translatedLanguageName = require('../../../../../../assets/own-language-translator/own-language-translator.json');
@Component({
  selector: 'lavi-preview-execution-language-page',
  templateUrl: './preview-execution-language-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionLanguagePageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewLanguagePageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() OnSelectLanguage: EventEmitter<string> = new EventEmitter();

  translatedLanguageName = translatedLanguageName;

  ShowNextPage(languageId) {
      this.OnSelectLanguage.emit(languageId);
  }

}
