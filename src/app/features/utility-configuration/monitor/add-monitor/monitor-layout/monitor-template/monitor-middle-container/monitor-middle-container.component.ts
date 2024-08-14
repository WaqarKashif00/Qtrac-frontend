import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Observable } from 'rxjs';
import { MonitorMiddleContainerService } from './monitor-middle-container.service';
import { IConfiguration } from '../../Models/configuration.interface';

@Component({
  selector: 'lavi-monitor-middle-container',
  templateUrl: './monitor-middle-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorMiddleContainerService],
})
export class MonitorMiddleContainerComponent extends AbstractComponent {

  @Input() DivLayoutDesignContainer;

  Data$: Observable<IConfiguration>;
  SelectedLanguage$: Observable<string>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;


  constructor(private monitorMiddleService: MonitorMiddleContainerService) {
    super();
    this.Data$ = this.monitorMiddleService.MonitorData$;
    this.IsOnlyGrid$ = this.monitorMiddleService.IsOnlyGrid$;
    this.GridSize$ = this.monitorMiddleService.GridSize$;
    this.SelectedLanguage$ = this.monitorMiddleService.SelectedLanguage$;
  }

  OnControlMoveEnd(event) {
    this.monitorMiddleService.OnControlMoveEnd(event);
  }

  OnControlResizeStop(event) {
    this.monitorMiddleService.OnControlResizeEnd(event);
  }

  OnRemoveServiceLabelClick(control) {
    this.monitorMiddleService.RemoveLabel(control);
  }

  OnRemoveServiceImageClick(control) {
    this.monitorMiddleService.RemoveImage(control);
  }

  OnRemoveServiceSliderClick(control) {
    this.monitorMiddleService.RemoveSlider(control);
  }

  OnRemoveServiceVideoClick(control) {
    this.monitorMiddleService.RemoveVideo(control);
  }
  
  OnLabelClick(control){
    this.monitorMiddleService.LabelClick(control);
  }

  OnImageClick(control){
    this.monitorMiddleService.ImageClick(control);
  }

  OnVideoClick(control){
    this.monitorMiddleService.VideoClick(control);
  }

  OnSliderClick(control){
    this.monitorMiddleService.SliderClick(control);
  }
}
