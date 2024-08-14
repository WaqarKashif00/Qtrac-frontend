import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { LabelControl } from 'src/app/features/utility-configuration/mobile/models/controls/label.control';
import { IDynamicVariable } from '../../../../../../../../../models/common/dynamic-variable.interface';
import { Alignments } from '../../../../../../../../../models/constants/font.constant';
import { Language } from '../../../../../../../../../models/enums/language-enum';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'lavi-mobile-label-form',
  templateUrl: './mobile-label-form.component.html'
})
export class MobileLabelFormComponent extends AbstractComponent {
  @Input() Control: LabelControl;

  TextFormArray$: Observable<FormArray>;
  DynamicVariables$: Observable<IDynamicVariable[]>;

  DefaultLanguage = Language.English;
  Open = false;
  IsTranslated = false;
  TranslatedTexts = {};
  Alignments = Alignments;

  get TranslateTextsObj(){
    return this.propertiesService.TranslatedTexts;
  }

  constructor(private propertiesService: PropertiesService,
              private changeDetector: ChangeDetectorRef) {
    super();
    this.TextFormArray$ = this.propertiesService.LabelTextFormArray$;
    this.IsTranslated = this.propertiesService.isTranslated;
    this.DynamicVariables$ = this.propertiesService.DynamicVariables$;
  }
  Init() {
    this.subs.sink = this.Control.form.valueChanges.pipe(distinct()).subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.propertiesService.UpdateData(this.Control);
      this.changeDetector.detectChanges();
    });
  }

  OpenTranslateDialog(){
    this.Open = true;
    this.propertiesService.SetTextInModal(this.Control);
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
    this.Control.text = this.TranslatedTexts;
    this.Control.form.get('text').setValue(this.TranslatedTexts);
    this.propertiesService.UpdateData(this.Control);
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
  IncreaseZIndex(){
    this.propertiesService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertiesService.DecreaseZIndex();
  }
}
