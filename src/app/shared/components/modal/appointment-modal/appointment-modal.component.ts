import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { KeyboardVirtualService } from 'src/app/features/utility-configuration/kiosk/keyboard-virtual.service'; 
//import Keyboard from 'simple-keyboard';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { KioskExecutionService } from 'src/app/features/utility-configuration/kiosk/kiosk-execution/kiosk-execution.service';

@Component({
  selector: 'lavi-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss']
})
export class LaviAppointmentModalComponent extends AbstractComponent{
  inputId: string;

  @Input() OpenDialog: boolean;
  @Input() Title: string;
  @Input() ModalWidth: number;
  @Input() ModalHeight: number;
  @Input() ModalForMobile = false;

  @Output() CloseModal: EventEmitter<void> = new EventEmitter();
  @Output() ApplyChanges: EventEmitter<string> = new EventEmitter<string>();
   
  constructor(    
    private keyboardVirtualService: KeyboardVirtualService,
    private changeDetector: ChangeDetectorRef,
    ) { 
      super();
      this.inputId = this.keyboardVirtualService.uuid;
  } 

  AppointmentId = '';

  CloseDialog(){
    this.AppointmentId = '';
    this.CloseModal.emit();
    this.ClearFieldsInKeyBoard();
  }

  Apply(){
    this.ApplyChanges.emit(this.AppointmentId);
    this.AppointmentId = ''; 
    this.ClearFieldsInKeyBoard();
  }

  ClearFieldsInKeyBoard(){
    this.keyboardVirtualService.updateInputValue(this.inputId, '');
  }
    //#region Virtual KeyBoard

    isInFocus: boolean = false;

    inputFocus = (event: any) => { 
      this.isInFocus = true; 
      this.keyboardVirtualService.inputFocus.next(event);
      this.keyboardVirtualService.InputValue.pipe(
        takeWhile((resp) => this.isInFocus)
      ).subscribe((response) => {
        if (response.id == event.target.id) {  
          this.AppointmentId = response.value;
          this.changeDetector.detectChanges();
        }
      });
    };
  
    inputFocusOut = (event: any) => {
      this.isInFocus = false;
      this.keyboardVirtualService.isEnableKeyBoard.next(false);
    };
  
    inputChange = (event: any) => {
      this.keyboardVirtualService.inputChange.next(event);
      this.changeDetector.detectChanges();
    };
  
    //#endregion

}
