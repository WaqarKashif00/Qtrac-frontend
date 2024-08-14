import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';

import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { TemplateLayoutService } from '../../template-layout.service';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ButtonControl } from 'src/app/features/utility-configuration/mobile/models/controls/button.control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { TicketControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-control';
import { TicketItemControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-item-control';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { cloneObject } from 'src/app/core/utilities/core-utilities';

@Injectable()
export class TicketService extends AbstractComponentService {


  private TicketPanelSubject: BehaviorSubject<TicketControl>;
  TicketPanel$: Observable<TicketControl>;

  private TicketButtonPanelSubject: BehaviorSubject<ButtonControl[]>;
  TicketButtonPanel$: Observable<ButtonControl[]>;

  private ControlSelectionSubject: BehaviorSubject<IMobileControlSelection>;
  ControlSelection$: Observable<IMobileControlSelection>;

  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;

  constructor(private layoutService: TemplateLayoutService) {
    super();
    this.InitializeSubjects();
    this.SubscribeObservables();
  }
  SubscribeObservables() {
    this.subs.sink = this.layoutService.TicketPageData$.subscribe((data) => {
      this.TicketPanelSubject.next(data.panel);
      this.TicketButtonPanelSubject.next(data.buttonPanel);
      this.SetButtonPropertyWindow(data.buttonPanel[0].name);
      this.ControlSelectionSubject.next(cloneObject(data.controlSelection));
    });
  }

  private InitializeSubjects() {
    this.SelectedLanguage$ = this.layoutService.SelectedLanguage$;
    this.CurrentPage$ = this.layoutService.CurrentPage$;
    this.TicketButtonPanelSubject = new BehaviorSubject<ButtonControl[]>([]);
    this.TicketButtonPanel$ = this.TicketButtonPanelSubject.asObservable();
    this.TicketPanelSubject = new BehaviorSubject<TicketControl>(null);
    this.TicketPanel$ = this.TicketPanelSubject.asObservable();
    this.ControlSelectionSubject = new BehaviorSubject(null);
    this.ControlSelection$ = this.ControlSelectionSubject.asObservable();
  }

  ResizeStop(event: IResizeEvent) {
    this.layoutService.TicketPageDefaultControlSelection();
    this.TicketPanelSubject.value.form.controls.height.setValue(
      event.size.height
    );
    this.TicketPanelSubject.next(this.TicketPanelSubject.value);
  }

  MoveEnd(event: IMobileMoveEvent) {
    this.layoutService.TicketPageDefaultControlSelection();
    this.TicketPanelSubject.value.form.controls.top.setValue(event.y);
    this.TicketPanelSubject.next(this.TicketPanelSubject.value);
  }

  UpdatePanelData(panelData: TicketControl) {
    this.TicketPanelSubject.next(panelData);
  }
  UpdateItemData(itemControl: TicketItemControl) {
    this.TicketPanelSubject.value.items.find(x => x.type == itemControl.type).styles.font = itemControl.styles.font;
    this.TicketPanelSubject.value.items.find(x => x.type == itemControl.type).styles.fontStyle = itemControl.styles.fontStyle;
    this.TicketPanelSubject.value.items.find(x => x.type == itemControl.type).styles.fontWeight = itemControl.styles.fontWeight;
    this.TicketPanelSubject.value.items.find(x => x.type == itemControl.type).styles.fontSize = itemControl.styles.fontSize;
    this.TicketPanelSubject.next(this.TicketPanelSubject.value);
  }
  ButtonPanelResizeStop(event: IResizeEvent, buttonName: string) {
    this.layoutService.TicketPageButtonSelection();
    const buttonIndex = this.GetButtonIndex(buttonName);
    this.SetButtonPropertyWindow(buttonName);
    this.TicketButtonPanelSubject.value[
      buttonIndex
    ].form.controls.height.setValue(event.size.height);
    this.TicketButtonPanelSubject.next(this.TicketButtonPanelSubject.value);
  }

  ButtonPanelMoveEnd(event: IMobileMoveEvent, buttonName: string) {
    this.layoutService.TicketPageButtonSelection();
    const buttonIndex = this.GetButtonIndex(buttonName);
    this.SetButtonPropertyWindow(buttonName);
    this.TicketButtonPanelSubject.value[buttonIndex].form.controls.top.setValue(
      event.y
    );
    this.TicketButtonPanelSubject.next(this.TicketButtonPanelSubject.value);
  }

  UpdateButtonPanelData(buttonData: ButtonControl) {
    const button = this.GetButtonIndex(buttonData.name);
    this.TicketButtonPanelSubject.value[button] = buttonData;
    this.TicketButtonPanelSubject.next(this.TicketButtonPanelSubject.value);
  }

  SetButtonPropertyWindow(value: string) {
    this.TicketButtonPanelSubject.value.map(
      (x) => (x.showPropertyWindow = false)
    );
    this.TicketButtonPanelSubject.value.find(
      (x) => x.name === value
    ).showPropertyWindow = true;
  }

  private GetButtonIndex(name: string) {
    return this.TicketButtonPanelSubject.value[0].name === name ? 0 : 1;
  }
  ChangeTicketItemsDropDownChange(item: any) {
    this.TicketPanelSubject.value.items.map((x) => {
      x.selected = false;
    });
    this.TicketPanelSubject.value.items.find(
      (x) => x.type == item
    ).selected = true;
    this.TicketPanelSubject.next(this.TicketPanelSubject.value);
  }

  OnButtonClick(buttonName: string) {
    this.layoutService.TicketPageButtonSelection();
    this.SetButtonPropertyWindow(buttonName);
  }
  OnPanelClick() {
    this.layoutService.TicketPageDefaultControlSelection();

  }
}
