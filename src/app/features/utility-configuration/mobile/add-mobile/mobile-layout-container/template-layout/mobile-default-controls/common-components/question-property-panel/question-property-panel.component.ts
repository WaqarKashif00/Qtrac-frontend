import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { BorderSizes } from '../../../../../../../../../models/constants/font.constant';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';

@Component({
  selector: 'lavi-item-property-panel',
  templateUrl: './question-property-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionPropertyPanelComponent extends AbstractComponent {
  @Input() Panel: PanelControl;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() CurrentPage: IMobilePageDetails;
  @Input() HeaderText = 'Items';
  @Input() IsTicketControl = false;
  @Input() Items = null;
  @OnChange('OnIsControlSelectedPropertyChange')
  @Input()
  IsControlSelected: boolean;
  @Output() OnDataChange: EventEmitter<PanelControl> = new EventEmitter();
  @Output() OnItemChange: EventEmitter<string> = new EventEmitter();
  @Output() IsControlSelectedChange: EventEmitter<boolean> = new EventEmitter();

  BorderSizes = BorderSizes;

  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.OnDataChange.emit(this.Panel);
    });
  }

  OnItemsDropDownChange(event) {
    this.OnItemChange.emit(event);
  }
  OnIsControlSelectedPropertyChange() {
    this.IsControlSelectedChange.emit(this.IsControlSelected);
  }

}
