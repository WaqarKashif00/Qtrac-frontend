import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { IDynamicVariable } from '../../../../../../../../../models/common/dynamic-variable.interface';
import { Alignments } from '../../../../../../../../../models/constants/font.constant';
import { Language } from '../../../../../../../../../models/enums/language-enum';
import { LabelControl } from '../../../../models/controls/label.control';
import { HomeInterfacePropertyService } from '../../home-interface-property.service';

@Component({
  selector: 'lavi-home-interface-label-form',
  templateUrl: './home-interface-label-form.component.html',
  styleUrls: ['./../home-interface-other-control.component.scss'],
})
export class HomeInterfaceLabelFormComponent extends AbstractComponent {
  @Input() Control: LabelControl;

  OpenDialog$: Observable<boolean>;
  TextFormArray$: Observable<FormArray>;
  DynamicVariables$: Observable<IDynamicVariable[]>;
  DefaultLanguage = Language.English;

  Alignments = Alignments;

  constructor(private service: HomeInterfacePropertyService) {
    super();
    this.OpenDialog$ = this.service.OpenTranslateDialog$;
    this.TextFormArray$ = this.service.LabelTextFormArray$;
  }
  Init() {
    this.subs.sink = this.Control.form.valueChanges.pipe(distinct()).subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.service.UpdateData(this.Control);
    });
  }

  OpenTranslateDialog(){
    this.service.OpenDialog(this.Control);
  }

  CloseTranslateDialog(){
    this.service.CloseDialog();
  }

  Translate(event){
    this.service.TranslateText(event, this.Control);
  }

  UpdateTranslatedTextsInForm(event){
    this.service.UpdateTranslatedTextsInForm(event, this.Control);
  }
  IncreaseZIndex(){
    this.service.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.service.DecreaseZIndex();
  }

}
