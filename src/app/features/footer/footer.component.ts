import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent extends AbstractComponent {
    Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }
  Destroy(){
    // Inherited from AbstractComponent to destroy component life cycle
  }
}
