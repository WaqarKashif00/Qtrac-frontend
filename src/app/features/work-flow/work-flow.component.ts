import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-work-flow',
  templateUrl: './work-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkFlowComponent extends AbstractComponent {

  Init() {

  }

  Destroy() {
  }
}
