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
import { ISliderControlPostPreview } from 'src/app/features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/slider-control-preview.interface';
import { SliderControl } from '../../../../Models/controls/slider.control';
import { MonitorPropertyService } from '../../monitor-property.service';

@Component({
  selector: 'lavi-monitor-slider-form',
  templateUrl: './monitor-slider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorSliderFormComponent extends AbstractComponent {
  @Input() Item: SliderControl;

  FileURLS: Array<ISliderControlPostPreview> = [];
  SliderFormArray$: Observable<FormArray>;
  Files: Array<File> = [];
  CurrentFileNames: Array<string> = [];
  OpenModal = false;
  public Opened = false;

  @ViewChild('myUpload') kendoUpload: Component;

  constructor(private monitorPropertyService: MonitorPropertyService) {
    super();
    this.SliderFormArray$ = this.monitorPropertyService.SliderFormArray$;
  }

  Init() {
    this.subs.sink = this.Item.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Item, this.Item.form);
      this.monitorPropertyService.UpdateData(this.Item);
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
    this.monitorPropertyService.SetSliderFormArray(this.Item.src.length > 0 ? this.Item.src : this.Item.urls);
  }

  CloseSliderModal(){
    this.OpenModal = false;
  }

  Save(event){
    this.monitorPropertyService.UpdateControl(event, this.Item);
    this.CloseSliderModal();
  }
  IncreaseZIndex(){
    this.monitorPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.monitorPropertyService.DecreaseZIndex();
  }

}
