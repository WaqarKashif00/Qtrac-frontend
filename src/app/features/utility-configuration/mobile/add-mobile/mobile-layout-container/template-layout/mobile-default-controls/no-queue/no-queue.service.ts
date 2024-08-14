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
export class NoQueueService extends AbstractComponentService {

  private ExitButtonSubject: BehaviorSubject<ButtonControl>;
  ExitButton$: Observable<ButtonControl>;
  private ControlSelectionSubject: BehaviorSubject<IMobileControlSelection>;
  ControlSelection$: Observable<IMobileControlSelection>;

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;

  constructor(private templateService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.templateService.SelectedLanguage$;
    this.CurrentPage$ = this.templateService.CurrentPage$;
    this.ExitButtonSubject = new BehaviorSubject<ButtonControl>(null);
    this.ExitButton$ = this.ExitButtonSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
    this.subs.sink = this.templateService.NoQueuePageData$.subscribe((data) => {
      this.ExitButtonSubject.next(data.buttons[0]);
      this.ControlSelectionSubject.next(cloneObject(data.controlSelection));
    });
  }

  ResizeStop(event: IResizeEvent) {
    this.templateService.NoQueueButtonSelection();
    this.ExitButtonSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.ExitButtonSubject.next(this.ExitButtonSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.templateService.NoQueueButtonSelection();
    this.ExitButtonSubject.value.form.controls.top.setValue(event.y);
    this.ExitButtonSubject.next(this.ExitButtonSubject.value);
  }
  OnButtonClick() {
    this.templateService.NoQueueButtonSelection();
  }
  UpdateButtonData(buttonData: ButtonControl) {
    this.ExitButtonSubject.next(buttonData);
  }
}
