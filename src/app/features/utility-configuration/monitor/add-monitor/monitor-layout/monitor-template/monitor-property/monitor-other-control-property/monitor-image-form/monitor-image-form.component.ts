import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component,
  Input
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { ImageControl } from '../../../../Models/controls/image.control';
import { MonitorPropertyService } from '../../monitor-property.service';

@Component({
  selector: 'lavi-monitor-image-form',
  templateUrl: './monitor-image-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorImageFormComponent extends AbstractComponent {
  @Input() Item: ImageControl;
  ImageFormArray$: Observable<FormArray>;
  FileName: string;
  OpenImageModal = false;

  constructor(
    private monitorPropertyService: MonitorPropertyService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.ImageFormArray$ = this.monitorPropertyService.ImageFormArray$;
  }
  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.monitorPropertyService.UpdateData(this.Item);
      });
  }

  OpenImageDialog(){
    this.OpenImageModal = true;
    this.monitorPropertyService.SetImageForm(this.Item.src);
  }

  Save(event){
    this.monitorPropertyService.UpdateControl(event, this.Item);
    this.CloseImageDialog();
  }

  CloseImageDialog(){
    this.OpenImageModal = false;
  }
  IncreaseZIndex(){
    this.monitorPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.monitorPropertyService.DecreaseZIndex();
  }
}
