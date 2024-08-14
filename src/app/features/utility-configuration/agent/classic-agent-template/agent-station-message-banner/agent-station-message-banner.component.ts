import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-agent-station-message-banner',
  styleUrls: ['agent-station-message-banner.component.scss'],
  templateUrl: './agent-station-message-banner.component.html',
})
export class AgentStationMessageBannerComponent extends AbstractComponent {

  @Input() SpecialLayout: boolean = false;
  @Input() currentLanguage: string;

  constructor() {
    super();
    this.SpecialLayout = false;
  }

}
