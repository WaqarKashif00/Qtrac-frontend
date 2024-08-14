import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';


@Component({
  selector: 'lavi-show-dynamic-field',
  templateUrl: './show-dynamic-field.component.html',
  styleUrls: ['./show-dynamic-field.component.scss'],
})
export class ShowDynamicFieldComponent extends AbstractComponent {

 @Input() ConditionsName;
}
