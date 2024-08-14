import {
  ChangeDetectionStrategy, Component,
  Input,
  ViewChild
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { SliderControl } from '../../../../Models/controls/slider.control';
import {
  ISliderControlPostPreview
} from '../../../../Models/slider-control-preview.interface';
import { KioskPropertyService } from '../../kiosk-property.service';

@Component({
  selector: 'lavi-kiosk-slider-form',
  templateUrl: './kiosk-slider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskSliderFormComponent extends AbstractComponent {
  @Input() Item: SliderControl;
  FileURLS: Array<ISliderControlPostPreview> = [];
  SliderFormArray$: Observable<FormArray>;
  OpenModal = false;

  @ViewChild('myUpload') kendoUpload: Component;

  constructor(private kioskPropertyService: KioskPropertyService) {
    super();
    this.SliderFormArray$ = this.kioskPropertyService.SliderFormArray$;
  }

  Init() {
    this.subs.sink = this.Item.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Item, this.Item.form);
      this.kioskPropertyService.UpdateData(this.Item);
    });
  }

  OpenSliderModal(){
    this.OpenModal = true;
    this.kioskPropertyService.SetSliderFormArray(this.Item.src.length > 0 ? this.Item.src : this.Item.urls);
  }

  CloseSliderModal(){
    this.OpenModal = false;
  }

  Save(event){
    this.kioskPropertyService.UpdateControl(event, this.Item);
    this.CloseSliderModal();
  }
  IncreaseZIndex(){
    this.kioskPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskPropertyService.DecreaseZIndex();
  }

}
