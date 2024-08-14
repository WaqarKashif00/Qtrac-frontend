import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ThankYouService } from '../../thank-you.service';
import { ThankYouPanelControl } from '../../../../Models/controls/thank-you-panel.control';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-thank-you-panel',
  templateUrl: './thank-you-panel.component.html',
})
export class ThankYouPanelComponent extends AbstractComponent {
  @Input() Panel: ThankYouPanelControl;
  @OnChange('OnIsPanelExpandPropertyChange')
  @Input()
  IsPanelExpand: boolean;
  @Output() OnChangeMode = new EventEmitter<string>();
  @Output() IsPanelExpandChange = new EventEmitter<boolean>();

  constructor(private service: ThankYouService) {
    super();
  }
  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.service.UpdateData(this.Panel);
    });
  }
  OnIsPanelExpandPropertyChange() {
    this.IsPanelExpandChange.emit(this.IsPanelExpand);
  }
}
