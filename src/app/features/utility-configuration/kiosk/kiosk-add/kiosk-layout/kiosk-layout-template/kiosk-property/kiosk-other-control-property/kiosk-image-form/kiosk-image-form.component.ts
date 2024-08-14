import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ImageControl } from '../../../../Models/controls/image.control';
import { KioskPropertyService } from '../../kiosk-property.service';

@Component({
  selector: 'lavi-kiosk-image-form',
  templateUrl: './kiosk-image-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskImageFormComponent extends AbstractComponent {
  @Input() Item: ImageControl;
  FileName: string;
  OpenImageModal = false;
  ImageFormArray$: Observable<FormArray>;

  constructor(private kioskPropertyService: KioskPropertyService, 
              private changeDetector: ChangeDetectorRef) {
    super();
    this.ImageFormArray$ = this.kioskPropertyService.ImageFormArray$;
  }
  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.kioskPropertyService.UpdateData(this.Item);
      });
  }


  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.kioskPropertyService.formService.IsValidImageFile(event.target.files[0])){
        const reader = new FileReader();
        reader.onload = (event1: any) => {
        this.Item.form.patchValue({
          src: event1.target.result,
          imageFile: event.target.files[0],
        });
      };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }

  Remove(){
    this.Item.form.patchValue({
      src: null,
      imageFile: null,
    });
    this.FileName = '';
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.kioskPropertyService.SetImageForm(this.Item.src);
  }

  Save(event){
    this.kioskPropertyService.UpdateControl(event, this.Item);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }

  IncreaseZIndex(){
    this.kioskPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskPropertyService.DecreaseZIndex();
  }

}
