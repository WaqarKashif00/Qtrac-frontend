import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { TicketControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-control';
import { TicketItemControl } from 'src/app/features/utility-configuration/mobile/models/controls/ticket-item-control';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobileControlSelection } from 'src/app/features/utility-configuration/mobile/models/mobile-control-selection.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { Language } from '../../../../../../../../../models/enums/language-enum';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'lavi-ticket-property-control',
  templateUrl: 'ticket-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketPropertyControlComponent extends AbstractComponent {
  Panel$: Observable<TicketControl>;
  ButtonPanel$: Observable<ButtonControl[]>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ControlSelection$: Observable<IMobileControlSelection>;


  DefaultLanguage = Language.English;

  constructor(private service: TicketService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Panel$ = this.service.TicketPanel$;
    this.ButtonPanel$ = this.service.TicketButtonPanel$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.ControlSelection$=this.service.ControlSelection$
  }

  UpdatePanelData(panelData: TicketControl) {
    this.service.UpdatePanelData(panelData);
  }

  UpdateButtonPanelData(buttonData: ButtonControl) {
    this.service.UpdateButtonPanelData(buttonData);
  }

  OnItemsDropDownChange(id: string) {
    this.service.SetButtonPropertyWindow(id);
  }
  OnTicketItemsDropDownChange(item) {
    this.service.ChangeTicketItemsDropDownChange(item);
  }
  OnItemChange(itemControl: TicketItemControl) {
    this.service.UpdateItemData(itemControl);
  }
}
