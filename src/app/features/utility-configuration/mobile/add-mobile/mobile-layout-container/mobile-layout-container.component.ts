import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MobileLayoutContainerService } from './mobile-layout-container.service';

@Component({
  selector: 'lavi-mobile-layout-container',
  templateUrl: 'mobile-layout-container.component.html',
  providers: [MobileLayoutContainerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileLayoutContainerComponent extends AbstractComponent {

}
