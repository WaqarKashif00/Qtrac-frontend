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
import { TicketItemControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-item-control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { Alignments, FontFamilies, FontStyles, FontWeights } from '../../../../../../../../../../models/constants/font.constant';
import { TicketItem } from '../../../../../../../../../../models/enums/ticket-items.enum';
import { PropertiesService } from '../../../../properties/properties.service';

@Component({
  selector: 'lavi-ticket-item-property',
  templateUrl: './ticket-item-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketItemPropertyComponent extends AbstractComponent {
  @Input() TicketItem: TicketItemControl;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Output() OnItemChange: EventEmitter<TicketItemControl> = new EventEmitter();

  TextFormArray$: Observable<FormArray>;
  SelectedLanguage$: Observable<string>;
  IsTranslated = false;
  TranslatedTexts = {};
  Open: boolean;
  Alignments: Array<string> = Alignments;
  Type = TicketItem;
  FontFamily: Array<string> = FontFamilies;
  FontWeight = FontWeights;
  FontStyle: Array<string> = FontStyles;
  FontMaxLength: Number = 2;

  get TranslateTextsObj(){
    return this.propertiesService.TranslatedTexts;
  }

  constructor(private propertiesService: PropertiesService) {
    super();
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
    this.TranslatedTexts = propertiesService.TranslatedTexts;
  }

  Init() {
    this.subs.sink = this.TicketItem.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.TicketItem, this.TicketItem.form);
      this.OnItemChange.emit(this.TicketItem);
    });
  }

  OpenTranslateDialog(){
    this.propertiesService.SetTextInModal(this.TicketItem);
    this.Open = true;
  }

  CloseTranslateDialog(){
    this.Open = false;
  }

  Translate(event){
    this.propertiesService.TranslateText(event);
  }

  UpdateTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    this.TicketItem.text = this.TranslatedTexts;
    this.TicketItem.form.get('text').setValue(this.TranslatedTexts);
    this.OnItemChange.emit(this.TicketItem);
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
      this.TranslatedTexts = this.propertiesService.GetConvertedLangArrayToObject(texts)
    }
  }
}
