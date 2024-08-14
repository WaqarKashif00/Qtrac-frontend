import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonValidationMessages } from '../../../../models/validation-message/common-validation.messages';

@Component({
    selector: 'lavi-language-image-modal',
    templateUrl: './language-image-modal.component.html',
    styleUrls: ['./language-image-modal.component.scss'],
})
export class LanguageImageModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() ImageFormArray: FormArray;
  @Input() Title: string;
  @Input() ModalWidth = '52%';
  @Input() ModalHeight = '61%';
  @Input() ImageWidth = 200;
  @Input() ImageHeight = 200;

  IsErrorsToShow: boolean = false;
  ModalOpen = false;
  LanguageId: string; // Using for image url modal


  @Output() CloseImageModal = new EventEmitter<void>();
  @Output() Save = new EventEmitter<any>();
  ValidationMessages = CommonValidationMessages;

  constructor(){
    super();
  }

  CloseImageDialog(){
    this.CloseImageModal.emit();
    this.IsErrorsToShow = false;
  }

  SetFileUrl(src, index){
    this.IsErrorsToShow = false;
    if (src) {
    this.ImageFormArray.controls[index].get('url').setValue(src);
    }
  }

  Apply(event){
    this.IsErrorsToShow = true;
    const IsValidUrl = this.ImageFormArray.controls?.filter((x)=> x.value?.url !== '/assets/img-icon.svg');  
    if(this.ImageFormArray.valid && IsValidUrl.length > 0){
      this.Save.emit(event); 
    this.IsErrorsToShow = false;
    } 
  }
 
  OpenURLDialog(languageId: string){
    this.ModalOpen = true;
    this.LanguageId = languageId;
    this.IsErrorsToShow = false;
  }
  ModalClose() {
    this.ModalOpen = false;
  }
  AddUrl(text) {
    const index = this.ImageFormArray.controls.findIndex(x=>x.value.languageCode == this.LanguageId)

    this.SetFileUrl(text, index);
    this.ModalClose();
  }
}
