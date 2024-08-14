import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { Language } from 'src/app/models/enums/language-enum';
import { Alignments } from '../../../../../../../../../models/constants/font.constant';
import { DynamicVariable } from '../../../../../../../../work-flow/models/conditional-events';
import { LabelControl } from '../../../../Models/controls/label.control';
import { KioskPropertyService } from '../../kiosk-property.service';

@Component({
  selector: 'lavi-kiosk-label-form',
  templateUrl: './kiosk-label-form.component.html'
})
export class KioskLabelFormComponent extends AbstractComponent {
  @Input() Control: LabelControl;
  @Input() SelectedLanguageId: string;

  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  DefaultLanguage = Language.English;
  DynamicVariables$: Observable<DynamicVariable[]>;

  Alignments = Alignments;

  constructor(private kioskPropertyService: KioskPropertyService) {
    super();
    this.InitializeObservablesAndVariables();
  }

  Init() {
    this.subs.sink = this.Control.form.valueChanges.pipe(distinct()).subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.kioskPropertyService.UpdateData(this.Control);
    });
  }

  private InitializeObservablesAndVariables() {
    this.OpenDialog$ = this.kioskPropertyService.OpenTranslateDialog$;
    this.TextFormArray$ = this.kioskPropertyService.LabelTextFormArray$;
    this.DynamicVariables$ = this.kioskPropertyService.DynamicVariables$;
  }

  OpenTranslateDialog(){
    this.kioskPropertyService.OpenDialog(this.Control);
  }

  CloseTranslateDialog(){
    this.kioskPropertyService.CloseDialog();
  }

  Translate(event){
    this.kioskPropertyService.TranslateText(event);
  }

  Save(event){
    this.kioskPropertyService.UpdateTranslatedTexts(event, this.Control);
  }
  IncreaseZIndex(){
    this.kioskPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskPropertyService.DecreaseZIndex();
  }

}
