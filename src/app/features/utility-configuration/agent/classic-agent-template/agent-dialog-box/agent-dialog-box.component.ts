import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-agent-dialog-box',
  styleUrls: ['agent-dialog-box.component.scss'],
  templateUrl: './agent-dialog-box.component.html',
})
export class AgentDialogBoxComponent extends AbstractComponent {

  @Input() IsOpen: boolean;
  @Input() IsCloseRequired: boolean = true;
  @Input() StartTime: string;
  @Input() ModalColor: string;
  @Input() ModalFontFamily: string;
  @Input() ModalFontSize: string;
  @Input() Height: string;
  @Input() Width: string;
  @Input() ModalBodyStyle: any;
  @Input() ModalFooterStyle: any;
  @Input() IsFooterRequired: boolean = true;


  @Output() OnClose: EventEmitter<void>;

  constructor() {
    super();
    this.OnClose = new EventEmitter();
  }

  Close(): void {
    this.OnClose.emit();
  }


}
