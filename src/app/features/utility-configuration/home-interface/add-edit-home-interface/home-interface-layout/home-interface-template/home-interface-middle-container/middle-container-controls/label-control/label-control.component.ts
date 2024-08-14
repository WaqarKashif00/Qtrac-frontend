import { Component, Input } from '@angular/core';
import { Language } from '../../../../../../../../../models/enums/language-enum';
import { BaseControlComponent } from '../../../../models/base/base-control-component';
import { LabelControl } from '../../../../models/controls/label.control';

@Component({
  selector: 'lavi-label-control',
  templateUrl: './label-control.component.html',
})
export class LabelControlComponent extends BaseControlComponent {
  @Input() Control: Array<LabelControl>;
  @Input() SelectedLanguage: string;
  DefaultLanguage = Language.English;
}
