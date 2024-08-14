import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { TicketItem } from '../../../../../models/enums/ticket-items.enum';
import { IKioskThankYouPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-thank-you',
  templateUrl: './kiosk-thank-you.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskThankYouComponent extends AbstractComponent {
  @Input() Data: IKioskThankYouPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  @Output() ShowNextPage: EventEmitter<string> = new EventEmitter();

  ItemType = TicketItem;

  showNextPage(btnName: string){
    this.ShowNextPage.emit(btnName);
  }
}
