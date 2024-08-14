import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ShortURLHandlerService } from './short-url-handler.service';

@Component({
  selector: 'lavi-short-url-handler',
  template: '',
  providers:[ShortURLHandlerService]
})
export class ShortURLHandlerComponent extends AbstractComponent {
  constructor(private shortURLHandlerService: ShortURLHandlerService) {
    super();
  }
  Init() {
    this.shortURLHandlerService.HandlerShortURLs();
  }
}
