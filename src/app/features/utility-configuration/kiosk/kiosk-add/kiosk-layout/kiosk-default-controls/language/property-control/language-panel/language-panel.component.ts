import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { LanguageService } from '../../language.service';
import { LanguagePanelControl } from '../../../../Models/controls/language-panel-control';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-kiosk-language-panel',
  templateUrl: './language-panel.component.html',
})
export class LanguagePanelComponent extends AbstractComponent {
  @Input() Panel: LanguagePanelControl;
  @OnChange('OnIsOpenPropertyWindowChange')
  @Input()
  IsOpenPropertyWindow: boolean;

  @Output() IsOpenPropertyWindowChange = new EventEmitter<boolean>();

  constructor(private service: LanguageService) {
    super();
  }
  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.service.UpdatePanelData(this.Panel);
    });
  }
  OnIsOpenPropertyWindowChange() {
    this.IsOpenPropertyWindowChange.emit(this.IsOpenPropertyWindow);
  }
}
