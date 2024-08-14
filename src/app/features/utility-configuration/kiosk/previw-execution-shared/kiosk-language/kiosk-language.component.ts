import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskLanguagePageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
import { ISupportedLanguage } from '../../kiosk-add/kiosk-layout/Models/supported-language.interface';
const translatedLanguageName = require('../../../../../../assets/own-language-translator/own-language-translator.json');
@Component({
  selector: 'lavi-kiosk-language',
  templateUrl: './kiosk-language.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskLanguageComponent extends AbstractComponent {
  @Input() Data: IKioskLanguagePageData;
  @Input() Languages: ISupportedLanguage[];
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  translatedLanguageName = translatedLanguageName;


  @Output() NextPage: EventEmitter<string> = new EventEmitter();

  ShowNextPage(id: string) {
    this.NextPage.emit(id);
  }
}
