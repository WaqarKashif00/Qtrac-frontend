import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { ICurrentLanguage } from '../../../../models/current-language.interface';
import { IMobileMoveEndControlEvent } from '../../../../models/mobile-control-move-end-event.interface';
import { IMobileResizeControlEvent } from '../../../../models/mobile-control-resize-event.interface';
import { IMobileOtherControls } from '../../../../models/mobile-other-controls.interface';
import { TemplateLayoutService } from '../template-layout.service';

@Injectable()
export class MiddleDesignerService extends AbstractComponentService {
  OtherControlsData$: Observable<IMobileOtherControls>;
  private OtherControlsDataSubject: BehaviorSubject<IMobileOtherControls>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  constructor(private templateLayoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }
  private SubscribeObservables() {
    this.subs.sink = this.templateLayoutService.SurveyPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.TicketPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.ThankYouPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.MarketingPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.ServiceQuestionPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.ServicePageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.WelcomePageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.GlobalQuestionPageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.LanguagePageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.NoQueuePageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
    this.subs.sink = this.templateLayoutService.OffLinePageData$.subscribe(
      (x) => {
        this.OtherControlsDataSubject.next(x);
      }
    );
  }

  private InitializeSubjects() {
    this.OtherControlsDataSubject = new BehaviorSubject<IMobileOtherControls>(
      null
    );
    this.OtherControlsData$ = this.OtherControlsDataSubject.asObservable();
    this.SelectedLanguage$ = this.templateLayoutService.SelectedLanguage$;
  }

  OnControlMoveEnd(event: IMobileMoveEndControlEvent) {
    this.templateLayoutService.ControlMoveEnd(event);
  }

  OnControlResizeEnd(event: IMobileResizeControlEvent) {
    this.templateLayoutService.ControlResizeEnd(event);
  }

  RemoveLabel(control) {
    this.templateLayoutService.RemoveLabel(control);
  }

  RemoveImage(control) {
    this.templateLayoutService.RemoveImage(control);
  }

  RemoveSlider(control) {
    this.templateLayoutService.RemoveSlider(control);
  }

  RemoveVideo(control) {
    this.templateLayoutService.RemoveVideo(control);
  }

  OnImageClick(control){
    this.templateLayoutService.OnClickImage(control);
  }

  OnLabelClick(control){
    this.templateLayoutService.OnClickLabel(control);
  }

  OnVideoClick(control){
    this.templateLayoutService.OnClickVideo(control);
  }

  OnSliderClick(control){
    this.templateLayoutService.OnClickSlider(control);
  }
}
