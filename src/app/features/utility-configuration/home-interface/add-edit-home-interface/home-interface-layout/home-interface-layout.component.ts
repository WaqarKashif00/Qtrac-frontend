import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from '../../../../../base/abstract-component';
import { HomeInterfaceLayoutService } from './home-interface-layout.service';

@Component({
  selector: 'lavi-home-interface-layout',
  templateUrl: './home-interface-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeInterfaceLayoutService],
})
export class HomeInterfaceLayoutComponent extends AbstractComponent {
}
