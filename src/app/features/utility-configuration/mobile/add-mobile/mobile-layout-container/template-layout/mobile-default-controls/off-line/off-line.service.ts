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
export class IMobileOffLinePageService extends AbstractComponentService {
  private OfflineButtonSubject: BehaviorSubject<ButtonControl>;
  OfflineButton$: Observable<ButtonControl>;
  private ControlSelectionSubject: BehaviorSubject<IMobileControlSelection>
  ControlSelection$: Observable<IMobileControlSelection>

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;

  constructor(private layoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.CurrentPage$ = this.layoutService.CurrentPage$;
    this.OfflineButtonSubject = new BehaviorSubject<ButtonControl>(null);
    this.OfflineButton$ = this.OfflineButtonSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
    this.subs.sink = this.layoutService.OffLinePageData$.subscribe((data) => {
      this.OfflineButtonSubject.next(data.buttons[0]);
      this.ControlSelectionSubject.next(cloneObject(data.controlSelection))
    });
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.OfflineButtonSelection();
    this.OfflineButtonSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.OfflineButtonSubject.next(this.OfflineButtonSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.OfflineButtonSelection();
    this.OfflineButtonSubject.value.form.controls.top.setValue(event.y);
    this.OfflineButtonSubject.next(this.OfflineButtonSubject.value);
  }

  OnButtonClick() {
    this.layoutService.OfflineButtonSelection();
  }

  UpdateButtonData(buttonData: ButtonControl) {
    this.OfflineButtonSubject.next(buttonData);
  }
}
