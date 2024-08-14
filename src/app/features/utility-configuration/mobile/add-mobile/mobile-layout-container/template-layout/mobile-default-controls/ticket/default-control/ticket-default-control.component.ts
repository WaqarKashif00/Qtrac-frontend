import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { TicketService } from '../ticket.service';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { TicketControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-control';
import { TicketItem } from '../../../../../../../../../models/enums/ticket-items.enum';

@Component({
  selector: 'lavi-ticket-default-control',
  templateUrl: './ticket-default-control.component.html',
})
export class MobileTicketDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<TicketControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  ButtonPanel$: Observable<ButtonControl[]>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ItemType = TicketItem;

  constructor(private service: TicketService) {
    super();
    this.Panel$ = this.service.TicketPanel$;
    this.ButtonPanel$ = this.service.TicketButtonPanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  OnButtonPanelResizeStop(event: IResizeEvent, buttonName: string) {
    this.service.ButtonPanelResizeStop(event, buttonName);
  }
  OnButtonPanelMoveEnd(event: IMobileMoveEvent, buttonName: string) {
    this.service.ButtonPanelMoveEnd(event, buttonName);
  }
  OnClick() {
    this.service.OnPanelClick();
  }
  OnButtonClick(buttonName: string) {
    this.service.OnButtonClick(buttonName);
  }
}
