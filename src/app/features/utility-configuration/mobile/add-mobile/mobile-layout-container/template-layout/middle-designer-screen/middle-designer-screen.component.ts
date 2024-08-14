import {
  ChangeDetectionStrategy,
  Component,

  Input
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ICurrentLanguage } from '../../../../models/current-language.interface';
import { IMobileMoveEndControlEvent } from '../../../../models/mobile-control-move-end-event.interface';
import { IMobileResizeControlEvent } from '../../../../models/mobile-control-resize-event.interface';
import { IMobileOtherControls } from '../../../../models/mobile-other-controls.interface';
import { MiddleDesignerService } from './middle-designer-screen.service';
import { ImageControlComponent } from './other-controls/image-control/image-control.component';
import { LabelControlComponent } from './other-controls/label-control/label-control.component';
import { SliderControlComponent } from './other-controls/slider-control/slider-control.component';
import { VideoControlComponent } from './other-controls/video-control/video-control.component';

@Component({
  selector: 'lavi-middle-designer-screens',
  templateUrl: 'middle-designer-screen.component.html',
  providers: [MiddleDesignerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiddleDesignerScreenComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer;
  OtherControlsData$: Observable<IMobileOtherControls>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  constructor(private middleDesignerScreen: MiddleDesignerService) {
    super();
    this.OtherControlsData$ = this.middleDesignerScreen.OtherControlsData$;
    this.SelectedLanguage$ = this.middleDesignerScreen.SelectedLanguage$;
  }
  OnControlMoveEnd(event: IMobileMoveEndControlEvent) {
    this.middleDesignerScreen.OnControlMoveEnd(event);
  }

  OnControlResizeStop(event: IMobileResizeControlEvent) {
    this.middleDesignerScreen.OnControlResizeEnd(event);
  }

  OnRemoveLabelClick(control: LabelControlComponent) {
    this.middleDesignerScreen.RemoveLabel(control);
  }

  OnRemoveImageClick(control: ImageControlComponent) {
    this.middleDesignerScreen.RemoveImage(control);
  }
  OnRemoveSliderClick(control: SliderControlComponent) {
    this.middleDesignerScreen.RemoveSlider(control);
  }
  OnRemoveVideoClick(control: VideoControlComponent) {
    this.middleDesignerScreen.RemoveVideo(control);
  }
  OnClickImage(control: ImageControlComponent){
    this.middleDesignerScreen.OnImageClick(control);
  }
  OnClickLabel(control: LabelControlComponent){
    this.middleDesignerScreen.OnLabelClick(control);
  }
  OnClickVideo(control: VideoControlComponent){
    this.middleDesignerScreen.OnVideoClick(control);
  }
  OnClickSlider(control: SliderControlComponent){
    this.middleDesignerScreen.OnSliderClick(control);
  }
}
