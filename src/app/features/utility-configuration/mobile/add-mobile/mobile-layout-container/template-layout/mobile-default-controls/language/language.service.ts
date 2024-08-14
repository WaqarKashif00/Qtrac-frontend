import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { cloneObject } from 'src/app/core/utilities/core-utilities';

@Injectable()
export class LanguageService extends AbstractComponentService {

  // private ServiceItemsSubject: BehaviorSubject<Array<ItemsControl>>;
  // ServiceItems$: Observable<Array<ItemsControl>>;
  private LanguagePanelSubject: BehaviorSubject<PanelControl>;
  LanguagePanel$: Observable<PanelControl>;

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  private ControlSelectionSubject:BehaviorSubject<IMobileControlSelection>
  ControlSelection$:Observable<IMobileControlSelection>

  constructor(private layoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$
    this.CurrentPage$ = this.layoutService.CurrentPage$;

    // this.ServiceItemsSubject = new BehaviorSubject<ItemsControl[]>([]);
    // this.ServiceItems$ = this.ServiceItemsSubject.asObservable();
    this.LanguagePanelSubject = new BehaviorSubject<PanelControl>(null);
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();
    this.LanguagePanel$ = this.LanguagePanelSubject.asObservable();
    this.subs.sink = this.layoutService.LanguagePageData$.subscribe(
      (data) => {
        this.LanguagePanelSubject.next(data.panel);
        this.ControlSelectionSubject.next(cloneObject(data.controlSelection))
      }
    );
  }
  OnControlCLick() {
    this.layoutService.OnLanguageDefaultControlSelection()
  }
  ResizeStop(event: IResizeEvent) {
    this.layoutService.OnLanguageDefaultControlSelection()
    this.LanguagePanelSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.LanguagePanelSubject.next(this.LanguagePanelSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.OnLanguageDefaultControlSelection()
    this.LanguagePanelSubject.value.form.controls.top.setValue(event.y);
    this.LanguagePanelSubject.next(this.LanguagePanelSubject.value);
  }

  UpdatePanelData(panelData: PanelControl) {
    this.LanguagePanelSubject.next(panelData);
  }

}
