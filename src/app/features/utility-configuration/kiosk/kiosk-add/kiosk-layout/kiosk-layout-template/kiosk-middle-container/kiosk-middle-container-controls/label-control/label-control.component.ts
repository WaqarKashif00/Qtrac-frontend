import { Component, Input } from '@angular/core';
import { BaseControlComponent } from '../../../../Models/base/base-control-component';
import { LabelControl } from '../../../../Models/controls/label.control';

@Component({
  selector: 'lavi-label-control',
  templateUrl: './label-control.component.html',
})
export class LabelControlComponent extends BaseControlComponent {
  @Input() Control: Array<LabelControl>;
  @Input() SelectedLanguageCode: string;
  @Input() DefaultLanguageCode: string;

  
}
