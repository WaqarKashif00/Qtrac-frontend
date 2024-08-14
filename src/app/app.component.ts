import { Component } from '@angular/core';
import { AbstractComponent } from './base/abstract-component';

@Component({
  selector: 'lavi-root',
  template: '<lavi-scripts></lavi-scripts><router-outlet></router-outlet><lavi-loading></lavi-loading>',
})
export class AppComponent extends AbstractComponent {

}
