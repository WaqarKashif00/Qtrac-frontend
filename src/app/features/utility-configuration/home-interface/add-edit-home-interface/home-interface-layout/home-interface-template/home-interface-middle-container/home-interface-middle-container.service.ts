import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { HomeInterfaceTemplateService } from '../home-interface-template.service';
import { IConfiguration } from '../../models/configuration.interface';
import { IMoveEvent } from '../../models/move-event.interface';

@Injectable()
export class HomeInterfaceMiddleContainerService extends AbstractComponentService {

  private HomeInterfaceDataSubject: BehaviorSubject<IConfiguration>;
  HomeInterfaceData$: Observable<IConfiguration>;
  SelectedLanguage$: Observable<string>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;

  constructor(private templateService: HomeInterfaceTemplateService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.HomeInterfaceDataSubject = new BehaviorSubject<IConfiguration>(null);
    this.HomeInterfaceData$ = this.HomeInterfaceDataSubject.asObservable();
    this.IsOnlyGrid$ = this.templateService.IsOnlyGrid$;
    this.GridSize$ = this.templateService.GridSize$;
    this.SelectedLanguage$ = this.templateService.SelectedLanguage$;
    this.subs.sink = this.templateService.CurrentPageData$.subscribe(
      (x) => {
        this.HomeInterfaceDataSubject.next(x);
      }
    );
  }

  OnControlMoveEnd(event: IMoveEvent) {
    this.templateService.ControlMoveEnd(event);
  }

  OnControlResizeEnd(event: IResizeEvent) {
    this.templateService.ControlResizeEnd(event);
  }

  RemoveLabel(control) {
    this.templateService.RemoveLabel(control);
  }

  RemoveImage(control) {
    this.templateService.RemoveImage(control);
  }

  RemoveSlider(control) {
    this.templateService.RemoveSlider(control);
  }

  RemoveVideo(control) {
    this.templateService.RemoveVideo(control);
  }

  LabelClick(control){
    this.templateService.LabelClick(control);
  }

  ImageClick(control){
    this.templateService.ImageClick(control);
  }

  VideoClick(control){
    this.templateService.VideoClick(control);
  }

  SliderClick(control){
    this.templateService.SliderClick(control);
  }
}
