import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FormService } from '../../../../core/services/form.service';

@Component({
    selector: 'lavi-language-video-modal',
    templateUrl: './language-video-modal.component.html',
    styleUrls: ['./language-video-modal.component.scss'],
})
export class LanguageVideoModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() VideoFormArray: FormArray;
  @Input() Title: string;
  @Input() ModalWidth = '50%';
  @Input() ModalHeight = '70%';
  @Input() VideoWidth = 200;
  @Input() VideoHeight = 200;
  ModalOpen = false;
  IsErrorsToShow: boolean = false;
  LanguageId: string; // Using for video url modal

  @Output() CloseVideoModal = new EventEmitter<void>();
  @Output() Save = new EventEmitter<any>();

  constructor(private formService: FormService, private ref: ChangeDetectorRef){
    super();
  }

  CloseVideoDialog(){
    this.CloseVideoModal.emit();
    this.IsErrorsToShow = false;
  }

  GetFileURL(event, index, languageCode) {
    if (event.target.files && event.target.files[0]) {
      if (this.formService.IsValidVideoFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.VideoFormArray.controls[index].patchValue({
            url: event1.target.result,
            [languageCode]: event.target.files[0],
          });
          this.ref.detectChanges();
        };
        reader.readAsDataURL(event.target.files[0]);

      }
    }
  }

  SetFileUrl(src, index){
    if (src) {
    this.VideoFormArray.controls[index].get('url').setValue(src);
    }
  }

  Apply(event){ 
    this.IsErrorsToShow = true;
    const IsValidUrl = this.VideoFormArray.controls?.filter((x)=> x.value?.url); 
    if(this.VideoFormArray.valid && IsValidUrl.length > 0){
    this.Save.emit(event);
    this.IsErrorsToShow = false;
    } 
  }

  OpenURLDialog(languageId: string){
    this.ModalOpen = true;
    this.LanguageId = languageId;
    this.IsErrorsToShow = false;
  }

  UploadVideo(){
    this.IsErrorsToShow = false;
  }

  ModalClose() {
    this.ModalOpen = false;
  }
  AddUrl(text) {
    const index = this.VideoFormArray.controls.findIndex(x=>x.value.languageCode == this.LanguageId)
    console.log(text);
    this.SetFileUrl(text, index);
    this.ModalClose();
  }
}
