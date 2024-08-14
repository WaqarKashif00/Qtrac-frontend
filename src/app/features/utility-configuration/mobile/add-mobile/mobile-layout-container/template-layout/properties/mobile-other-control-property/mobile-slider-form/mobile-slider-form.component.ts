import {
  ChangeDetectionStrategy, Component,
  Input, ViewChild
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { SliderControl } from 'src/app/features/utility-configuration/mobile/models/controls/slider.control';
import { IMobileSliderControlPostPreview } from 'src/app/features/utility-configuration/mobile/models/mobile-slider-control-preview.interface';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'lavi-mobile-slider-form',
  templateUrl: './mobile-slider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSliderFormComponent extends AbstractComponent {
  @Input() Item: SliderControl;
  FileURLS: Array<IMobileSliderControlPostPreview> = [];
  Files: Array<File> = [];
  CurrentFileNames: Array<string> = [];
  SliderFormArray$: Observable<FormArray>;
  OpenModal = false;

  @ViewChild('myUpload') kendoUpload: Component;

  constructor(private propertiesService: PropertiesService) {
    super();
    this.SliderFormArray$ = this.propertiesService.SliderFormArray$;
  }

  Init() {

    this.subs.sink = this.Item.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Item, this.Item.form);
      this.propertiesService.UpdateData(this.Item);
    });
  }

  OpenSliderModal(){
    this.OpenModal = true;
    this.propertiesService.SetSliderFormArray(this.Item.src.length > 0 ? this.Item.src : this.Item.urls);
  }

  CloseSliderModal(){
    this.OpenModal = false;
  }

  Save(event){
    this.propertiesService.UpdateControl(event, this.Item);
    this.CloseSliderModal();
  }
  IncreaseZIndex(){
    this.propertiesService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertiesService.DecreaseZIndex();
  }
}
