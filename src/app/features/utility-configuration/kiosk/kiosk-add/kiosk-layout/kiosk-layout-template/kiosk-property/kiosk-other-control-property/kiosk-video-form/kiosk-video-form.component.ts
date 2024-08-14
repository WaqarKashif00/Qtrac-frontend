import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { VideoControl } from '../../../../Models/controls/video.control';
import { KioskPropertyService } from '../../kiosk-property.service';

@Component({
  selector: 'lavi-kiosk-video-form',
  templateUrl: './kiosk-video-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskVideoFormComponent extends AbstractComponent {
  @Input() Item: VideoControl;
  VideoFormArray$: Observable<FormArray>;
  Open = false;

  constructor(private kioskPropertyService: KioskPropertyService) {
    super();
    this.VideoFormArray$ = this.kioskPropertyService.VideoFormArray$;
  }
  Init() {
    this.subs.sink = this.Item.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((x) => {
        updatePropertiesWithForm2(this.Item, this.Item.form);
        this.kioskPropertyService.UpdateData(this.Item);
      });
  }

  OpenVideoDialog(){
    this.Open = true;
    this.kioskPropertyService.SetVideoFormArray(this.Item.src);
  }

  Save(event){
    this.kioskPropertyService.UpdateControl(event, this.Item);
    this.CloseVideoDialog();
  }

  CloseVideoDialog(){
    this.Open = false;
  }
  
  IncreaseZIndex(){
    this.kioskPropertyService.IncreaseZIndex();
   }

  DecreaseZIndex(){
    this.kioskPropertyService.DecreaseZIndex();
  }

}
