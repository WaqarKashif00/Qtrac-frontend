import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Language } from '../../../../../../../../models/enums/language-enum';
import { TicketItem } from '../../../../../../../../models/enums/ticket-items.enum';
import { ButtonControl } from '../../../Models/controls/button.control';
import { ThankYouPanelControl } from '../../../Models/controls/thank-you-panel.control';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { ThankYouService } from '../thank-you.service';

@Component({
  selector: 'lavi-thank-you-default-component',
  templateUrl: './thank-you-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouDefaultControlComponent extends AbstractComponent {
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;

  Control$: Observable<ThankYouPanelControl>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage$: Observable<string>;
  Buttons$: Observable<ButtonControl[]>;
  DefaultSelectedLanguage = Language.English;
  ThankYouItemType = TicketItem;

  constructor(private service: ThankYouService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.Control$ = this.service.Control$;
    this.Buttons$ = this.service.Buttons$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.DefaultLanguage$ = this.service.DefaultLanguage$;
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }

  OnMoveEnd(event: IMoveEvent) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.MoveEnd(event);
  }
  OnClick(){
    this.service.PanelClick()
  }
  OnButtonResizeStop(event: IResizeEvent, name: string) {
    this.service.ButtonResizeStop(event, name);
  }

  OnButtonMoveEnd(event: IMoveEvent, name: string) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.ButtonMoveEnd(event, name);
  }

  GetUrl(src, languageCode: string) {
    return (src?.find(x => x.languageCode === (languageCode))?.url);
  }
}
