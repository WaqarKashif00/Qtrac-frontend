import {
  ChangeDetectionStrategy, Component,
  Input,
  ViewChild
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { DialogAction } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { SliderControl } from '../../../../models/controls/slider.control';
import { IHomeInterfaceSliderControlPostPreview } from '../../../../models/home-interface-slider-control-preview.interface';
import { HomeInterfacePropertyService } from '../../home-interface-property.service';

@Component({
  selector: 'lavi-home-interface-slider-form',
  templateUrl: './home-interface-slider-form.component.html',
  styleUrls: ['./../home-interface-other-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceSliderFormComponent extends AbstractComponent {
  @Input() Item: SliderControl;

  FileURLS: Array<IHomeInterfaceSliderControlPostPreview> = [];
  SliderFormArray$: Observable<FormArray>;
  Files: Array<File> = [];
  CurrentFileNames: Array<string> = [];
  OpenModal = false;
  public Opened = false;

  @ViewChild('myUpload') kendoUpload: Component;

  constructor(private propertyService: HomeInterfacePropertyService) {
    super();
    this.SliderFormArray$ = this.propertyService.SliderFormArray$;
  }

  Init() {
    this.subs.sink = this.Item.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Item, this.Item.form);
      this.propertyService.UpdateData(this.Item);
    });
  }

  public Remove(upload, uid: string) {
    upload.removeFilesByUid(uid);
  }

  public OnAction(action: DialogAction): void {
    this.Opened = false;
  }

  public Close() {
    this.Opened = false;
  }

  public Open() {
    this.Opened = true;
  }

  GetFileName(url: string) {
    const a = url.split('/');
    return getTimeStampSplitedFileName(a[a.length - 1]);
  }

  OpenSliderModal(){
    this.OpenModal = true;
    this.propertyService.SetSliderFormArray(this.Item.src.length > 0 ? this.Item.src : this.Item.urls);
  }

  CloseSliderModal(){
    this.OpenModal = false;
  }

  Save(event){
    this.propertyService.UpdateControl(event, this.Item);
    this.CloseSliderModal();
  }
  IncreaseZIndex(){
    this.propertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertyService.DecreaseZIndex();
  }


}
