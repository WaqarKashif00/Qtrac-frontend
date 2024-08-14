import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { ButtonControl } from '../../../../../models/controls/button.control';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { cloneObject } from 'src/app/core/utilities/core-utilities';

@Injectable()
export class ServicesService extends AbstractComponentService {

  private ServicePanelSubject: BehaviorSubject<PanelControl>;
  ServicePanel$: Observable<PanelControl>;
  private ServiceButtonsSubject: BehaviorSubject<Array<ButtonControl>>;
  ServiceButtons$: Observable<Array<ButtonControl>>;
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

    this.ServiceButtonsSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.ServiceButtons$ = this.ServiceButtonsSubject.asObservable();
    this.ServicePanelSubject = new BehaviorSubject<PanelControl>(null);
    this.ServicePanel$ = this.ServicePanelSubject.asObservable();
    this.ControlSelectionSubject=new BehaviorSubject(null);
    this.ControlSelection$=this.ControlSelectionSubject.asObservable();
    this.subs.sink = this.layoutService.ServicePageData$.subscribe(
      (data) => {
        this.ServicePanelSubject.next(data.panel);
        this.ServiceButtonsSubject.next(data.buttons);
        this.ControlSelectionSubject.next(cloneObject(data.controlSelection))
      }
    );
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.ServicePagePanelSelection()
    this.ServicePanelSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.ServicePanelSubject.next(this.ServicePanelSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.ServicePagePanelSelection()
    this.ServicePanelSubject.value.form.controls.top.setValue(event.y);
    this.ServicePanelSubject.next(this.ServicePanelSubject.value);
  }

  ButtonResizeStop(event: IResizeEvent, name: string) {
    this.layoutService.ServicePageButtonSelection()
    this.GetButtonByName(name).form.controls.height.setValue(
      event.size.height
    );
    this.ServiceButtonsSubject.next(this.ServiceButtonsSubject.value);
  }

  private GetButtonByName(name: string) {
    return this.ServiceButtonsSubject.value.find(x => x.name === name);
  }

  ButtonMoveEnd(event: IMobileMoveEvent, name: string) {
    this.layoutService.ServicePageButtonSelection()
    this.GetButtonByName(name).form.controls.top.setValue(event.y);
    this.ServiceButtonsSubject.next(this.ServiceButtonsSubject.value);
  }

  UpdatePanelData(panelData: PanelControl) {
    this.ServicePanelSubject.next(panelData);
  }

  UpdateButtonData(button: ButtonControl){
    this.ServiceButtonsSubject.value[0] = button;
    this.ServiceButtonsSubject.next(this.ServiceButtonsSubject.value);
  }
  OnPanelClick() {
    this.layoutService.ServicePagePanelSelection()
  }
  OnButtonClick() {
    this.layoutService.ServicePageButtonSelection()

  }
}
