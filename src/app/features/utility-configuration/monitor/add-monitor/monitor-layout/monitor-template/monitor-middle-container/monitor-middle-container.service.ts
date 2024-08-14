import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IConfiguration } from '../../Models/configuration.interface';
import { IMoveEvent } from '../../Models/move-event.interface';
import { MonitorTemplateService } from '../monitor-template-service';

@Injectable()
export class MonitorMiddleContainerService extends AbstractComponentService {

  private monitorDataSubject: BehaviorSubject<IConfiguration>;
  MonitorData$: Observable<IConfiguration>;
  SelectedLanguage$: Observable<string>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;

  constructor(private monitorTemplateService: MonitorTemplateService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.monitorDataSubject = new BehaviorSubject<IConfiguration>(null);
    this.MonitorData$ = this.monitorDataSubject.asObservable();
    this.IsOnlyGrid$ = this.monitorTemplateService.IsOnlyGrid$;
    this.GridSize$ = this.monitorTemplateService.GridSize$;
    this.SelectedLanguage$ = this.monitorTemplateService.SelectedLanguage$;
    this.subs.sink = this.monitorTemplateService.CurrentPageData$.subscribe(
      (x) => {
        this.monitorDataSubject.next(x);
      }
    );
  }

  OnControlMoveEnd(event: IMoveEvent) {
    this.monitorTemplateService.ControlMoveEnd(event);
  }

  OnControlResizeEnd(event: IResizeEvent) {
    this.monitorTemplateService.ControlResizeEnd(event);
  }

  RemoveLabel(control) {
    this.monitorTemplateService.RemoveLabel(control);
  }

  RemoveImage(control) {
    this.monitorTemplateService.RemoveImage(control);
  }

  RemoveSlider(control) {
    this.monitorTemplateService.RemoveSlider(control);
  }

  RemoveVideo(control) {
    this.monitorTemplateService.RemoveVideo(control);
  }

  LabelClick(control){
    this.monitorTemplateService.LabelClick(control);
  }

  ImageClick(control){
    this.monitorTemplateService.ImageClick(control);
  }

  VideoClick(control){
    this.monitorTemplateService.VideoClick(control);
  }

  SliderClick(control){
    this.monitorTemplateService.SliderClick(control);
  }
}
