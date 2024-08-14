import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileWorkFlowDetail } from '../../../../../models/mobile-work-flow-detail.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { cloneObject } from 'src/app/core/utilities/core-utilities';

@Injectable()
export class GlobalQuestionService extends AbstractComponentService {

  private GlobalQuestionPanelSubject: BehaviorSubject<PanelControl>;
  GlobalQuestionPanel$: Observable<PanelControl>;
  private GlobalQuestionButtonsSubject: BehaviorSubject<ButtonControl[]>;
  GlobalQuestionButtons$: Observable<ButtonControl[]>;
  private ControlSelectionSubject: BehaviorSubject<IMobileControlSelection>;
  ControlSelection$: Observable<IMobileControlSelection>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ContinueButtonName = 'Continue Button';
  Buttons = [];
  WorkFlowData: IMobileWorkFlowDetail;

  constructor(private layoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$; // TODO: Need to change
    this.CurrentPage$ = this.layoutService.CurrentPage$;
    this.GlobalQuestionPanelSubject = new BehaviorSubject<PanelControl>(null);
    this.GlobalQuestionPanel$ = this.GlobalQuestionPanelSubject.asObservable();
    this.GlobalQuestionButtonsSubject = new BehaviorSubject<ButtonControl[]>(
      []
    );
    this.GlobalQuestionButtons$ =
      this.GlobalQuestionButtonsSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
    this.WorkFlowData = this.layoutService.Workflow;
    this.subs.sink = this.layoutService.GlobalQuestionPageData$.subscribe(
      (data) => {
        this.GlobalQuestionPanelSubject.next(data.panel);
        this.GlobalQuestionButtonsSubject.next(data.buttons);
        if (
          !this.GlobalQuestionButtonsSubject.value.find(
            (x) => x.name === this.ContinueButtonName
          )
        ) {
          this.GlobalQuestionButtonsSubject.value.push(data.panel.button);
        }
        this.ControlSelectionSubject.next(cloneObject(data.controlSelection));

        this.SetButtonShowPropertyWindowProperty(this.ContinueButtonName);
      }
    );
  }

  private SetButtonShowPropertyWindowProperty(name: string) {
    this.Buttons = this.GlobalQuestionButtonsSubject.value;
    this.GlobalQuestionButtonsSubject.value.map(
      (x) => (x.showPropertyWindow = false)
    );
    this.GlobalQuestionButtonsSubject.value.find(
      (x) => x.name === name
    ).showPropertyWindow = true;
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.GlobalQuestionDefaultControlSelection();
    this.GlobalQuestionPanelSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.GlobalQuestionPanelSubject.next(this.GlobalQuestionPanelSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.GlobalQuestionDefaultControlSelection();
    this.GlobalQuestionPanelSubject.value.form.controls.top.setValue(event.y);
    this.GlobalQuestionPanelSubject.next(this.GlobalQuestionPanelSubject.value);
  }

  ButtonResizeStop(event: IResizeEvent, name: string) {
    this.layoutService.GlobalQuestionButtonSelection();
    this.SetButtonShowPropertyWindowProperty(name);
    this.GetButtonByName(name).form.controls.height.setValue(event.size.height);
    this.UpdateButtonsSubject();
  }

  ButtonMoveEnd(event: IMobileMoveEvent, name: string) {
    this.layoutService.GlobalQuestionButtonSelection();
    this.SetButtonShowPropertyWindowProperty(name);
    this.GetButtonByName(name).form.controls.top.setValue(event.y);
    this.UpdateButtonsSubject();
  }

  UpdatePanelData(panelData: PanelControl) {
    this.GlobalQuestionPanelSubject.next(panelData);
  }

  UpdateButtonData(buttonData: ButtonControl) {
    if (buttonData.name === this.ContinueButtonName) {
      this.GlobalQuestionPanelSubject.value.button = buttonData;
      this.GlobalQuestionPanelSubject.next(
        this.GlobalQuestionPanelSubject.value
      );
    } else {
      this.Buttons[0] = buttonData;
      this.UpdateButtonsSubject();
    }
  }

  private UpdateButtonsSubject() {
    this.GlobalQuestionButtonsSubject.next(this.Buttons);
  }

  ShowButtonPropertyWindow(btnName: string) {
    this.Buttons.map((x) => (x.showPropertyWindow = false));
    this.GetButtonByName(btnName).showPropertyWindow = true;
    this.GlobalQuestionButtonsSubject.next(this.Buttons);
  }

  private GetButtonByName(name: string) {
    return this.Buttons.find((x) => x.name === name);
  }
  OnButtonClick(buttonName: string) {
   this.layoutService.GlobalQuestionButtonSelection();
   this.SetButtonShowPropertyWindowProperty(buttonName);
  }
  OnPanelClick() {
    this.layoutService.GlobalQuestionDefaultControlSelection();

  }
}
