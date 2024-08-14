import { Component, Input } from '@angular/core';
import { MobileBaseControlComponent } from 'src/app/features/utility-configuration/mobile/models/base/mobile-base-control-component';
import { LabelControl } from 'src/app/features/utility-configuration/mobile/models/controls/label.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';

@Component({
  selector: 'lavi-label-control',
  templateUrl: './label-control.component.html',
})
export class LabelControlComponent extends MobileBaseControlComponent {
  @Input() Control: Array<LabelControl>;
  @Input() DivLayoutDesignContainer;
  @Input() SelectedLanguage: ICurrentLanguage;
}
