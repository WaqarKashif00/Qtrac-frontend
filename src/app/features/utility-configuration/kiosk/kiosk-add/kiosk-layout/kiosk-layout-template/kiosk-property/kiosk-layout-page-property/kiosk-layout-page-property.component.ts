import {
  ChangeDetectionStrategy, Component,
  Input
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PageProperties } from '../../../Models/controls/page-properties';

@Component({
  selector: 'lavi-kiosk-layout-page-property',
  templateUrl: './kiosk-layout-page-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskLayoutPagePropertyComponent extends AbstractComponent {
  @Input() PageProperties: PageProperties;

  Init() {
    this.subs.sink = this.PageProperties.form.valueChanges
      .pipe()
      .subscribe((x) => {
        updatePropertiesWithForm2(this.PageProperties, this.PageProperties.form);
      });
  }

}
