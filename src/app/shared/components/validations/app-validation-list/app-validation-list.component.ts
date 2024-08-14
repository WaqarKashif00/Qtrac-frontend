import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lavi-validation-message-list',
  templateUrl: './app-validation-list.component.html'
})
export class AppValidationListComponent {

  @Input('validation-form-group-name') CurrentForm: FormGroup;
  @Input('validation-control-name') CurrentControl: string;
  @Input('validation-errorlist') ErrorList: [] = [];

}
