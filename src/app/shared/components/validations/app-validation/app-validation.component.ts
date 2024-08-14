import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lavi-validation-message',
  templateUrl: './app-validation.component.html',
  styles: [`
  .error-text-color {
        color: red;
        font-size: 12px;
        width: max-content;
    }
  `]
})
export class AppValidationComponent {

  @Input('validation-form-group-name') CurrentForm: FormGroup;
  @Input('validation-control-name') CurrentControl: string;
  @Input('validation-type') ErrorType: string;

}
