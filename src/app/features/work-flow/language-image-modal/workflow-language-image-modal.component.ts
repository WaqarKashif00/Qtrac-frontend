import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
    selector: 'workflow-language-image-modal',
    templateUrl: './workflow-language-image-modal.component.html',
    styleUrls: ['./workflow-language-image-modal.component.scss'],
})
export class WorkflowLanguageImageModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() ImageFormArray: FormArray;
  @Input() Title: string;
  @Input() ModalWidth = '30%';
  @Input() ModalHeight = 'auto';
  @Input() ImageWidth = 200;
  @Input() ImageHeight = 200;

  @Output() CloseTranslateTextDialog = new EventEmitter<void>();
  @Output() Save = new EventEmitter<any>();
  FileName = '';
  SelectedLanguageId:string = "";

  constructor(){
    super();
  }

  CloseTranslateDialog(){
    this.CloseTranslateTextDialog.emit();
  }

  SetSelectedLanguageId(languageId:string){
    this.SelectedLanguageId = languageId;
  }

  SetFileUrl(src,index){
    if (src) {
      this.ImageFormArray.controls[index].get("url").setValue(src);
    }
  }

  Apply(event){
    this.Save.emit(event.length > 0 ? event : []);
  }
}
