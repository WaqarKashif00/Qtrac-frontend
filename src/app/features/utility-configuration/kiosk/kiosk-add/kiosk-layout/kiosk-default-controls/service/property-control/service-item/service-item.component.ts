import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';
import { ServicesService } from '../../services.service';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';

@Component({
  selector: 'lavi-service-item',
  templateUrl: './service-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceItemComponent extends AbstractComponent {
  @Input() Control: ServiceBoxControl;

  constructor(private service: ServicesService) {
    super();
  }

  Init() {
    this.subs.sink = this.Control.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Control, this.Control.form);
      this.service.UpdateData();
    });
  }
}
