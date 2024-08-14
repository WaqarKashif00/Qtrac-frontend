import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-agent-message-banner',
  styleUrls: ['agent-grid-message-banner.component.scss'],
  templateUrl: './agent-grid-message-banner.component.html',
})
export class AgentGridMessageBannerComponent extends AbstractComponent {

  @Input() SpecialLayout: boolean = false;

  constructor() {
    super();
    this.SpecialLayout = false;
  }

}
