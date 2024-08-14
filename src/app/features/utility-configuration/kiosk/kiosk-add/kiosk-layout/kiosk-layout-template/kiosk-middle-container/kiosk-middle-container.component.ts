import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IKioskConfiguration } from '../../Models/kiosk-configuration.interface';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { KioskMiddleContainerService } from './kiosk-middle-container.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'lavi-kiosk-middle-container',
  templateUrl: './kiosk-middle-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KioskMiddleContainerService],
})
export class KioskMiddleContainerComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;

  Data$: Observable<IKioskConfiguration>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;

  constructor(private kioskMiddleService: KioskMiddleContainerService) {
    super();
    this.Data$ = this.kioskMiddleService.KioskData$;
    this.SelectedLanguage$ = this.kioskMiddleService.SelectedLanguage$;
    this.DefaultLanguage$ = this.kioskMiddleService.DefaultLanguage$;
  }

  OnControlMoveEnd(event) {
    this.kioskMiddleService.OnControlMoveEnd(event);
  }

  OnControlResizeStop(event) {
    this.kioskMiddleService.OnControlResizeEnd(event);
  }

  OnRemoveServiceLabelClick(control) {
    this.kioskMiddleService.RemoveLabel(control);
  }

  OnRemoveServiceImageClick(control) {
    this.kioskMiddleService.RemoveImage(control);
  }

  OnRemoveServiceSliderClick(control) {
    this.kioskMiddleService.RemoveSlider(control);
  }

  OnRemoveServiceVideoClick(control) {
    this.kioskMiddleService.RemoveVideo(control);
  }

  OnLabelClick(control) {
    this.kioskMiddleService.LabelClick(control);
  }

  OnImageClick(control) {
    this.kioskMiddleService.ImageClick(control);
  }

  OnVideoClick(control) {
    this.kioskMiddleService.VideoClick(control);
  }

  OnSliderClick(control) {
    this.kioskMiddleService.SliderClick(control);
  }
}
