import { Injectable } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject, RoundOffProperty } from 'src/app/core/utilities/core-utilities';
import { KioskLayoutService } from '../../kiosk-layout.service';
import { IControlSelection } from '../../Models/controls-selection.interface';
import { LanguagePanelControl } from '../../Models/controls/language-panel-control';
import { IMoveEvent } from '../../Models/move-event.interface';
import { ISupportedLanguage } from '../../Models/supported-language.interface';

@Injectable()
export class LanguageService extends AbstractComponentService {

  private LanguagePanelSubject: BehaviorSubject<LanguagePanelControl>;
  LanguagePanel$: Observable<LanguagePanelControl>;

  private ControlSelectionSubject: BehaviorSubject<IControlSelection>;
  ControlSelection$: Observable<IControlSelection>;

  Languages$: Observable<ISupportedLanguage[]>;

  IsOnlyGrid: boolean = false;
  GridSize: number = 50;

  constructor(private layoutService: KioskLayoutService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables()
  }
  SubscribeObservables() {
    this.subs.sink = this.layoutService.LanguagePage$.subscribe(
      (data) => {
        this.LanguagePanelSubject.next(data.panel);
        this.ControlSelectionSubject.next(cloneObject(data.controlSelection))
      }
    );

    this.subs.sink = this.layoutService.IsOnlyGrid$.subscribe(
      (data) => {
        this.IsOnlyGrid = data;
      }
    );
    this.subs.sink = this.layoutService.GridSize$.subscribe(
      (data) => {
        this.GridSize = data;
      }
    );

  }

  private InitializeSubjects() {
    this.LanguagePanelSubject = new BehaviorSubject<LanguagePanelControl>(null);
    this.LanguagePanel$ = this.LanguagePanelSubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();
    this.Languages$ = this.layoutService.LanguageList$;
    }

  ResizeStop(event: IResizeEvent) {
    this.LanguagePanelSubject.value.form.controls.width.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.width, this.GridSize) : event.size.width);
    this.LanguagePanelSubject.value.form.controls.height.setValue(this.IsOnlyGrid ? RoundOffProperty(event.size.height, this.GridSize) : event.size.height);
    this.LanguagePanelSubject.next(this.LanguagePanelSubject.value);
  }

  MoveEnd(event: IMoveEvent) {
    this.LanguagePanelSubject.value.form.controls.left.setValue(event.x);
    this.LanguagePanelSubject.value.form.controls.top.setValue(event.y);
    this.LanguagePanelSubject.next(this.LanguagePanelSubject.value);
  }
  OnPanelClick() {
    this.layoutService.OnLanguagePagePanelSelection()
  }

  UpdatePanelData(panelData: LanguagePanelControl) {
    this.LanguagePanelSubject.next(panelData);
  }

}

