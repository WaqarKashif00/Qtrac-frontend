import {
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ITextFieldLoaderSettings } from 'src/app/models/common/text-field-loader-settings.interface';
import { HoursOfOperationMessage } from 'src/app/models/validation-message/hours-of-operations';

@Component({
  selector: 'lavi-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['../hours-of-operations.component.scss']
})
export class GeneralConfigurationComponent extends AbstractComponent {
  @Input() GeneralFormGroup: FormGroup;
  get TemplateNameFormControl() {
    return this.GeneralFormGroup.get('templateName');
  }
  LoaderSettings: ITextFieldLoaderSettings = {
    TextFiledDivClasses: ['col-lg-12', 'col-md-12']
  };
  HoursOfOperationMessage = HoursOfOperationMessage;
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }
  Init(){
    this.subs.sink = this.TemplateNameFormControl.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }
}
