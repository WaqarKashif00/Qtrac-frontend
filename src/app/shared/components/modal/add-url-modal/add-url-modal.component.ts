import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';

@Component({
  selector: 'lavi-add-url-modal',
  templateUrl: './add-url-modal.component.html',
  styleUrls: ['./add-url-modal.component.scss']
})
export class AddUrlModalComponent extends AbstractComponent {

  @Input() OpenDialog: boolean;
  @Input() ModalTitle: string;
  @Input() ModalWidth = '52%';
  @Input() ModalHeight = '';
  @Input() LanguageId: string;
  @Input() IsImgUrl: boolean = true;
  @Output() ModalClose:EventEmitter<void> = new EventEmitter();
  @Output() AddUrl:EventEmitter<string> = new EventEmitter();
  UrlText: string = '';
  IsErrorsToShow: boolean = false;
  ValidationPatterns = Validations;
  ValidationMessage: string; 

  constructor(private formBuilder: FormBuilder) {
    super();
   }



  Init(): void {
    this.UrlText = '';
  }

  CloseModal(){
    this.UrlText = '';
    this.ModalClose.emit();
    this.IsErrorsToShow = false;
  }

  Add(isError){  
    this.IsErrorsToShow = true
    if(!isError && this.UrlText) {
      this.AddUrl.emit(this.UrlText);
      this.IsErrorsToShow = false;
    }
    else {
      return false;
    }
    this.UrlText = '';
  }

}
