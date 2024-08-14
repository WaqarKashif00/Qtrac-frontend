import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { debounceTime, delay } from 'rxjs/operators';
import { PropertiesService } from '../../properties.service';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { BorderSizes } from '../../../../../../../../../models/constants/font.constant';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-mobile-buttons-form',
  templateUrl: './mobile-buttons-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileButtonsFormComponent extends AbstractComponent {
  @Input() Buttons: ButtonControl[];
  @Input() ShowSameAsPrimaryButtonStylesCheckBox = false;
  @OnChange('IsButtonSelectedPropertyChange')
  @Input() IsButtonSelected:boolean;
  @Output() IsButtonSelectedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() OnDataChange: EventEmitter<ButtonControl> = new EventEmitter();
  @Output() OnItemsChange: EventEmitter<string> = new EventEmitter();

  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  IsTranslated = false;
  TranslatedTexts = {};
  ButtonName = '';
  OpenImageModal = false;
  BorderSizes = BorderSizes;

  get TranslateTextsObj(){
    return this.propertiesService.TranslatedTexts;
  }

  constructor(private propertiesService: PropertiesService) {
    super();
    this.InitializeObservables();
  }

  Init() {
    this.subs.sink = this.Buttons[0].form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[0], this.Buttons[0].form);
        this.OnDataChange.emit(this.Buttons[0]);
      });

    this.subs.sink = this.Buttons[1]?.form.valueChanges
      .pipe(delay(200), debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Buttons[1], this.Buttons[1].form);
        this.OnDataChange.emit(this.Buttons[1]);
      });
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.propertiesService.OpenTranslateDialog$;
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.ButtonImageFormArray$ = this.propertiesService.ButtonImageFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
    this.TranslatedTexts = this.propertiesService.TranslatedTexts;
  }
  IsButtonSelectedPropertyChange(){
    this.IsButtonSelectedChange.emit(this.IsButtonSelected)
  }
  OpenTranslateDialog(buttonName: string) {
    this.ButtonName = buttonName;
    this.propertiesService.OpenDialog(this.GetButton(buttonName));
  }

  CloseTranslateDialog() {
    this.propertiesService.CloseDialog();
  }

  Translate(event) {
    this.propertiesService.TranslateText(event);
  }

  UpdateTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    const button = this.GetButton(this.ButtonName);
    button.text = this.TranslatedTexts;
    button.form.get('text').setValue(this.TranslatedTexts);
    this.OnDataChange.emit(button);
    this.CloseTranslateDialog();
    this.IsTranslated = false;
  }

  private UpdateTextsWithoutTranslation(event: any) {
    if (event.length > 0 && (!this.IsTranslated)) {
      const labelTexts = [];
      for (const e of event) {
        labelTexts.push({
          languageId: e.value.languageCode,
          translatedText: e.value.text
        });
      }
      this.TranslatedTexts = this.propertiesService.GetConvertedLangArrayToObject(labelTexts);
    }
  }

  OnItemsDropDownChange(id) {
    this.OnItemsChange.emit(id);
  }

  private GetButton(name: string) {
    return this.Buttons.find(x => x.name === name);
  }

  OpenImageDialog(name: string){
    this.OpenImageModal = true;
    this.ButtonName = name;
    this.propertiesService.SetButtonImageFormArray(this.GetButton(this.ButtonName).primaryButtonSrc);
  }

  Save(event){
    const button = this.GetButton(this.ButtonName);
    if (event.length > 0) {
      const languageControls = [];
      for (const e of event) {
        languageControls.push({
          language: e.value.language,
          languageCode: e.value.languageCode,
          [e.value.languageCode]: e.value[e.value.languageCode],
          url: (e.value.url).startsWith('/assets') ? '' :  e.value.url
        });
      }
      button.primaryButtonSrc = languageControls;
      button.form.get('primaryButtonSrc').setValue(languageControls);
      this.OnDataChange.emit(button);
      this.CloseImageDialog();
    }
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }

}
