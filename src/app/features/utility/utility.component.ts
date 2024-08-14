import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-contact-detail',
  templateUrl: './utility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UtilityComponent  extends AbstractComponent {

  constructor(){
    super();
  }

    Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy(){
    // Inherited from AbstractComponent to destroy component life cycle
  }
}
