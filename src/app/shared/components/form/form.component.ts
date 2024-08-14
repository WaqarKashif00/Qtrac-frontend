import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lavi-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() FormGroup: FormGroup;
  @Input() FocusInValidInput = true;

  @Output() OnSubmit: EventEmitter<void> = new EventEmitter<void>();

  SubmitForm() {
      this.OnSubmit.emit();
  }
}
