import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-monitor-layout-header',
  templateUrl: './monitor-layout-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorLayoutHeaderComponent extends AbstractComponent {

  constructor() {
    super();
  }

}
