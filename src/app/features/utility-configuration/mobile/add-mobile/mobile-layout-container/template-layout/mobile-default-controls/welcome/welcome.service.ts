import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';

import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { cloneObject } from 'src/app/core/utilities/core-utilities';

@Injectable()
export class WelcomeService extends AbstractComponentService {

  // private ServiceItemsSubject: BehaviorSubject<Array<ItemsControl>>;
  // ServiceItems$: Observable<Array<ItemsControl>>;
  private WelcomeButtonSubject: BehaviorSubject<ButtonControl>;
  WelcomeButton$: Observable<ButtonControl>;
  private ControlSelectionSubject:BehaviorSubject<IMobileControlSelection>
  ControlSelection$:Observable<IMobileControlSelection>

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;

  constructor(private layoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.CurrentPage$ = this.layoutService.CurrentPage$;

    // this.ServiceItemsSubject = new BehaviorSubject<ItemsControl[]>([]);
    // this.ServiceItems$ = this.ServiceItemsSubject.asObservable();
    this.WelcomeButtonSubject = new BehaviorSubject<ButtonControl>(null);
    this.WelcomeButton$ = this.WelcomeButtonSubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();
    this.subs.sink = this.layoutService.WelcomePageData$.subscribe((data) => {
      this.WelcomeButtonSubject.next(data.button);
      this.ControlSelectionSubject.next(cloneObject(data.controlSelection))
    });
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.WelcomeButtonSelection()
    this.WelcomeButtonSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.WelcomeButtonSubject.next(this.WelcomeButtonSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.WelcomeButtonSelection()
    this.WelcomeButtonSubject.value.form.controls.top.setValue(event.y);
    this.WelcomeButtonSubject.next(this.WelcomeButtonSubject.value);
  }
  OnButtonClick() {
    this.layoutService.WelcomeButtonSelection()
  }
  UpdateButtonData(buttonData: ButtonControl) {
    this.WelcomeButtonSubject.next(buttonData);
  }
}
