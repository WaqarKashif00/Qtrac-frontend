import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ImageControl } from 'src/app/features/utility-configuration/mobile/models/controls/image.control';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'lavi-mobile-image-form',
  templateUrl: './mobile-image-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileImageFormComponent extends AbstractComponent {
  @Input() Item: ImageControl;
  OpenImageModal = false;
  ImageFormArray$: Observable<FormArray>;

  constructor(
    private propertiesService: PropertiesService
    ) {
    super();
    this.ImageFormArray$ = this.propertiesService.ImageFormArray$;
  }
  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.propertiesService.UpdateData(this.Item);
      });
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.propertiesService.SetImageFormArray(this.Item.src);
  }

  Save(event){
    this.propertiesService.UpdateControl(event, this.Item);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }
  IncreaseZIndex(){
    this.propertiesService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertiesService.DecreaseZIndex();
  }
}
