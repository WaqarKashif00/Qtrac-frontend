import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { VideoControl } from 'src/app/features/utility-configuration/mobile/models/controls/video.control';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'lavi-mobile-video-form',
  templateUrl: './mobile-video-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileVideoFormComponent extends AbstractComponent {
  @Input() Item: VideoControl;
  VideoFormArray$: Observable<FormArray>;
  FileName: string;
  Open = false;

  constructor(private propertyService: PropertiesService, private changeDetector: ChangeDetectorRef) {
    super();
    this.VideoFormArray$ = this.propertyService.VideoFormArray$;
  }

  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.propertyService.UpdateData(this.Item);
      });
  }




  OpenVideoDialog(){
    this.Open = true;
    this.propertyService.SetVideoFormArray(this.Item.src);
  }

  Save(event){
    this.propertyService.UpdateControl(event, this.Item);
    this.CloseVideoDialog();
  }

  CloseVideoDialog(){
    this.Open = false;
  }
  IncreaseZIndex(){
    this.propertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.propertyService.DecreaseZIndex();
  }
}
