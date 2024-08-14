import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ThankYouService } from '../thank-you.service';
import { ThankYouPanelControl } from '../../../Models/controls/thank-you-panel.control';
import { Observable } from 'rxjs';
import { ButtonControl } from '../../../Models/controls/button.control';
import { FormArray } from '@angular/forms';
import { IControlSelection } from '../../../Models/controls-selection.interface';

@Component({
  selector: 'lavi-thank-you-property-control',
  templateUrl: './thank-you-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouPropertyComponent extends AbstractComponent {
  Control$: Observable<ThankYouPanelControl>;
  Buttons$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<string>;
  ControlSelection$: Observable<IControlSelection>;
  ButtonImageFormArray$: Observable<FormArray>;
  TextFormArray$: Observable<FormArray>;

  IsTranslated = false;
  TranslatedTexts = {};
  Open: boolean;
  Buttons: ButtonControl[];

  get TranslateTextsObj(){
    return this.thankYouService.TranslatedTexts;
  }

  constructor(private thankYouService: ThankYouService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Control$ = this.thankYouService.Control$;
    this.Buttons$ = this.thankYouService.Buttons$;
    this.SelectedLanguage$ = this.thankYouService.SelectedLanguage$;
    this.TextFormArray$ = this.thankYouService.TextFormArray$;
    this.IsTranslated = this.thankYouService.isTranslated;
    this.ButtonImageFormArray$ = this.thankYouService.ButtonImageFormArray$;
    this.ControlSelection$=this.thankYouService.ControlSelection$;
    this.subs.sink = this.thankYouService.Buttons$.subscribe(x =>{
      this.Buttons = x;
    })
  }

  Init() {}

  OnItemsDropDownChange(event: string){
    this.thankYouService.UpdateSelectedProperty(event);
  }

  OpenTranslateDialog(name: string){
    this.thankYouService.SetTextInModal(this.GetButtonByName(name));
    this.Open = true;
  }

  private GetButtonByName(name: string): ButtonControl {
    return this.thankYouService.GetButtonByName(name);
  }

  CloseTranslateDialog(){
    this.Open = false;
  }

  Translate(event){
    this.thankYouService.TranslateText(event);
  }

  UpdateTranslatedTexts(event) {
    const button = this.GetButtonByName(event[1]);
    this.UpdateTextsWithoutTranslation(event[0]);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    button.text = this.TranslatedTexts;
    button.form.get('text').setValue(this.TranslatedTexts);
    this.thankYouService.UpdateButtonData(this.Buttons);
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

  ButtonDropdownChange(name: string){
    this.thankYouService.SetPropertyWindow(name);
  }

  UpdateButtons(buttons: ButtonControl[]){
    this.thankYouService.UpdateButtonData(buttons);
  }

  OpenButtonImageModal(name: string){
    this.thankYouService.OpenButtonImageDialog(name);
  }

  ApplyImageChanges(event){
    this.thankYouService.UpdateButtonControl(event[0], event[1]);
  }
}
