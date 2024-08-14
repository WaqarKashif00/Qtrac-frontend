import {
  ChangeDetectionStrategy, Component,
  Input
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { PageProperties } from '../../../../../models/controls/page-properties';

@Component({
  selector: 'lavi-mobile-layout-page-property',
  templateUrl: './mobile-layout-page-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileLayoutPagePropertyComponent extends AbstractComponent {
  @Input() PageProperties: PageProperties;

  Init() {
    this.subs.sink = this.PageProperties.form.valueChanges
      .pipe()
      .subscribe((x) => {
        updatePropertiesWithForm2(this.PageProperties, this.PageProperties.form);
      });
  }

}
