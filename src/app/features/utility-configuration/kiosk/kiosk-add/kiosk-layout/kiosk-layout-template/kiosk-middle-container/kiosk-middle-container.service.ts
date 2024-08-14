import { Injectable } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IMoveEvent } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/move-event.interface';
import { IKioskConfiguration } from '../../Models/kiosk-configuration.interface';
import { KioskTemplateService } from '../kiosk-template.service';

@Injectable()
export class KioskMiddleContainerService extends AbstractComponentService {
  private KioskDataSubject: BehaviorSubject<IKioskConfiguration>;
  KioskData$: Observable<IKioskConfiguration>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;

  constructor(private kioskTemplateService: KioskTemplateService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }
  private SubscribeObservables() {
    this.subs.sink = this.kioskTemplateService.ServicePageData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
    this.subs.sink = this.kioskTemplateService.WelcomePgeData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
    this.subs.sink = this.kioskTemplateService.ThankYouData$.subscribe((x) => {
      this.KioskDataSubject.next(x);
    });
    this.subs.sink =
      this.kioskTemplateService.PreServiceQuestionData$.subscribe((x) => {
        this.KioskDataSubject.next(x);
      });
    this.subs.sink = this.kioskTemplateService.ServiceQuestionData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
    this.subs.sink = this.kioskTemplateService.LanguagePageData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
    this.subs.sink = this.kioskTemplateService.NoQueuePageData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
    this.subs.sink = this.kioskTemplateService.OffLinePageData$.subscribe(
      (x) => {
        this.KioskDataSubject.next(x);
      }
    );
  }

  private InitializeSubjects() {
    this.KioskDataSubject = new BehaviorSubject<IKioskConfiguration>(null);
    this.KioskData$ = this.KioskDataSubject.asObservable();
    this.SelectedLanguage$ = this.kioskTemplateService.SelectedLanguage$;
    this.DefaultLanguage$ = this.kioskTemplateService.DefaultLanguage$;
  }

  OnControlMoveEnd(event: IMoveEvent) {
    this.kioskTemplateService.ControlMoveEnd(event);
  }

  OnControlResizeEnd(event: IResizeEvent) {
    this.kioskTemplateService.ControlResizeEnd(event);
  }

  RemoveLabel(control) {
    this.kioskTemplateService.RemoveLabel(control);
  }

  RemoveImage(control) {
    this.kioskTemplateService.RemoveImage(control);
  }

  RemoveSlider(control) {
    this.kioskTemplateService.RemoveSlider(control);
  }

  RemoveVideo(control) {
    this.kioskTemplateService.RemoveVideo(control);
  }

  LabelClick(control) {
    this.kioskTemplateService.LabelClick(control);
  }

  ImageClick(control) {
    this.kioskTemplateService.ImageClick(control);
  }

  VideoClick(control) {
    this.kioskTemplateService.VideoClick(control);
  }

  SliderClick(control) {
    this.kioskTemplateService.SliderClick(control);
  }
}
