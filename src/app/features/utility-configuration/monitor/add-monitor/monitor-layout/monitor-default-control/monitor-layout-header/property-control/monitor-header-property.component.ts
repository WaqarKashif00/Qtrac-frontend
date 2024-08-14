import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MonitorPropertyService } from '../../../monitor-template/monitor-property/monitor-property.service';

@Component({
  selector: 'lavi-property-control',
  templateUrl: './monitor-header-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorPropertyService],
})
export class MonitorHeaderPropertyComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
