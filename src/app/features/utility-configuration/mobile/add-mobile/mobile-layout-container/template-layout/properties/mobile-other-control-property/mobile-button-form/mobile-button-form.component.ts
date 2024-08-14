import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { distinct } from 'rxjs/operators';
import { PropertiesService } from '../../properties.service';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { BorderSizes } from '../../../../../../../../../models/constants/font.constant';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-mobile-button-form',
  templateUrl: './mobile-button-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileButtonFormComponent extends AbstractComponent {
  @Input() Control: ButtonControl;
  @OnChange('IsButtonSelectedPropertyChange')
  @Input() IsButtonSelected: boolean;
  @Output() OnDataChange: EventEmitter<ButtonControl> = new EventEmitter();
  @Output() IsButtonSelectedChange: EventEmitter<boolean> = new EventEmitter();


  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  ButtonImageFormArray$: Observable<FormArray>;
  IsTranslated = false;
  TranslatedTexts = {};
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
    this.subs.sink = this.Control.form.valueChanges
      .pipe(distinct())
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Control, this.Control.form);
        this.OnDataChange.emit(this.Control);
      });
  }

  private InitializeObservables() {
    this.OpenDialog$ = this.propertiesService.OpenTranslateDialog$;
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.ButtonImageFormArray$ = this.propertiesService.ButtonImageFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
  }

  OpenTranslateDialog(){
    this.propertiesService.OpenDialog(this.Control);
  }

  CloseTranslateDialog(){
    this.propertiesService.CloseDialog();
  }

  Translate(event){
    this.propertiesService.TranslateText(event);
  }
  IsButtonSelectedPropertyChange(){
    this.IsButtonSelectedChange.emit(this.IsButtonSelected)
  }
  UpdateTranslatedTexts(event) {
    this.UpdateTextsWithoutTranslation(event);
    this.TranslatedTexts = this.IsTranslated ? this.TranslateTextsObj : this.TranslatedTexts;
    this.Control.text = this.TranslatedTexts;
    this.Control.form.get('text').setValue(this.TranslatedTexts);
    this.OnDataChange.emit(this.Control);
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
      this.TranslatedTexts = this.propertiesService.GetConvertedLangArrayToObject(labelTexts)
    }
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.propertiesService.SetButtonImageFormArray(this.Control.primaryButtonSrc);
  }

  Save(event){
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
      this.Control.primaryButtonSrc = languageControls;
      this.Control.form.get('primaryButtonSrc').setValue(languageControls);
      this.OnDataChange.emit(this.Control);
      this.CloseImageDialog();
    }
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }

}
