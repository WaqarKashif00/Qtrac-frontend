import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lavi-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {

  @Input() OpenDialog: boolean;
  @Input() Title: string;
  @Input() MinWidth: number;
  @Input() MinHeight: number;
  @Input() Width: number;
  @Input() Height: number;

  @Output() CloseModal: EventEmitter<void> = new EventEmitter();

  CloseDialog(){
    this.CloseModal.emit();
  }
}
