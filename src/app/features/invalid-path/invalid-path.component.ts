import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-invalid-path',
  templateUrl: './invalid-path.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./invalid-path.component.scss']
})

export class InvalidPathComponent extends AbstractComponent {
    Init() {
    // Inherited from AbstractComponent to initialize component life cycle
  }
  Destroy(){
    // Inherited from AbstractComponent to destroy component life cycle
  }
}
