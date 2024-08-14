import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractComponent } from '../../../../base/abstract-component';

@Component({
  selector: 'lavi-kiosk-shutdown',
  templateUrl: './kiosk-shutdown.component.html'
})

export class KioskShutDownComponent extends AbstractComponent {

  ShutDownMessage: string;

  constructor(private route: ActivatedRoute) {
    super();
  }

  Init() {
    this.ShutDownMessage = this.route.snapshot.paramMap.get('message');
  }


}
