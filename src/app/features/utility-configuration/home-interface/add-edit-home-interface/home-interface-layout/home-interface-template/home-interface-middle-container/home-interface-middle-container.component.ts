import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Observable } from 'rxjs';
import { HomeInterfaceMiddleContainerService } from './home-interface-middle-container.service';
import { IConfiguration } from '../../models/configuration.interface';

@Component({
  selector: 'lavi-home-interface-middle-container',
  templateUrl: './home-interface-middle-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeInterfaceMiddleContainerService],
})
export class HomeInterfaceMiddleContainerComponent extends AbstractComponent {

  @Input() DivLayoutDesignContainer;

  Data$: Observable<IConfiguration>;
  SelectedLanguage$: Observable<string>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;


  constructor(private service: HomeInterfaceMiddleContainerService) {
    super();
    this.Data$ = this.service.HomeInterfaceData$;
    this.IsOnlyGrid$ = this.service.IsOnlyGrid$;
    this.GridSize$ = this.service.GridSize$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
  }

  OnControlMoveEnd(event) {
    this.service.OnControlMoveEnd(event);
  }

  OnControlResizeStop(event) {
    this.service.OnControlResizeEnd(event);
  }

  OnRemoveServiceLabelClick(control) {
    this.service.RemoveLabel(control);
  }

  OnRemoveServiceImageClick(control) {
    this.service.RemoveImage(control);
  }

  OnRemoveServiceSliderClick(control) {
    this.service.RemoveSlider(control);
  }

  OnRemoveServiceVideoClick(control) {
    this.service.RemoveVideo(control);
  }

  OnLabelClick(control){
    this.service.LabelClick(control);
  }

  OnImageClick(control){
    this.service.ImageClick(control);
  }

  OnVideoClick(control){
    this.service.VideoClick(control);
  }

  OnSliderClick(control){
    this.service.SliderClick(control);
  }
}
