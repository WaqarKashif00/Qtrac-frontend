import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { VideoControl } from '../../../../Models/controls/video.control';
import { MonitorPropertyService } from '../../monitor-property.service';

@Component({
  selector: 'lavi-monitor-video-form',
  templateUrl: './monitor-video-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorVideoFormComponent extends AbstractComponent {
  @Input() Item: VideoControl;
  FileName: string;
  VideoFormArray$: Observable<FormArray>;
  Open = false;

  constructor(private monitorPropertyService: MonitorPropertyService,
              private changeDetector: ChangeDetectorRef) {
    super();
    this.VideoFormArray$ = this.monitorPropertyService.VideoFormArray$;
  }

  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.monitorPropertyService.UpdateData(this.Item);
      });
  }


  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (this.monitorPropertyService.formService.IsValidVideoFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.Item.form.patchValue({
            src: event1.target.result,
            videoFile: event.target.files[0],
          });
        };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }

  OpenVideoDialog(){
    this.Open = true;
    this.monitorPropertyService.SetVideoFormArray(this.Item.src);
  }

  Save(event){
    this.monitorPropertyService.UpdateControl(event, this.Item);
    this.CloseVideoDialog();
  }

  CloseVideoDialog(){
    this.Open = false;
  }
  IncreaseZIndex(){
    this.monitorPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.monitorPropertyService.DecreaseZIndex();
  }
}
