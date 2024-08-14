import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IThankYouItemControl } from '../../../../Models/thank-you-page-item.interface';
import { ThankYouService } from '../../thank-you.service';

@Component({
  selector: 'lavi-thank-you-item-property',
  templateUrl: './thank-you-item-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouItemPropertyComponent extends AbstractComponent {
  @Input() ThankYouItem: IThankYouItemControl;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Output() OnItemChange: EventEmitter<IThankYouItemControl> = new EventEmitter();

  TextFormArray$: Observable<FormArray>;
  SelectedLanguage$: Observable<string>;
  IsTranslated = false;
  TranslatedTexts = {};
  Open: boolean;
  get TranslateTextsObj(){
    return this.thankYouService.TranslatedTexts;
  }

  constructor(private thankYouService: ThankYouService) {
    super();
    this.TextFormArray$ = this.thankYouService.TextFormArray$;
    this.IsTranslated = this.thankYouService.isTranslated;
  }

  Init() {
    this.subs.sink = this.ThankYouItem.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.ThankYouItem, this.ThankYouItem.form);
      this.thankYouService.UpdateItemData(this.ThankYouItem);
    });
  }

  OpenTranslateDialog(){
    this.thankYouService.SetTextInModal(this.ThankYouItem);
    this.Open = true;
  }

  CloseTranslateDialog(){
    this.Open = false;
  }

  Translate(event){
    this.thankYouService.TranslateText(event);
  }

  UpdateTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    this.ThankYouItem.text = this.TranslatedTexts;
    this.ThankYouItem.form.get('text').setValue(this.TranslatedTexts);
    this.thankYouService.UpdateItemData(this.ThankYouItem);
    this.CloseTranslateDialog();
    this.IsTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.IsTranslated)) {
      const texts = [];
      for (const e of event) {
        texts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.thankYouService.GetConvertedLangArrayToObject(texts)
    }
  }
}
