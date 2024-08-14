import {
  ChangeDetectionStrategy, Component,
  Input
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ImageControl } from '../../../../models/controls/image.control';
import { HomeInterfacePropertyService } from '../../home-interface-property.service';

@Component({
  selector: 'lavi-home-interface-image-form',
  templateUrl: './home-interface-image-form.component.html',
  styleUrls: ['./../home-interface-other-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceImageFormComponent extends AbstractComponent {
  @Input() Item: ImageControl;
  ImageFormArray$: Observable<FormArray>;
  FileName: string;
  OpenImageModal = false;

  constructor(
    private propertyService: HomeInterfacePropertyService
  ) {
    super();
    this.ImageFormArray$ = this.propertyService.ImageFormArray$;
  }
  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.propertyService.UpdateData(this.Item);
      });
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.propertyService.SetImageForm(this.Item.src);
  }

  Save(event){
    this.propertyService.UpdateControl(event, this.Item);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }
  IncreaseZIndex(){
    this.propertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertyService.DecreaseZIndex();
  }


}
