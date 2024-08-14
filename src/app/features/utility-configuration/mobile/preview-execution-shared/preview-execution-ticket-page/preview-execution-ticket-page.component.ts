import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { TicketItem } from '../../../../../models/enums/ticket-items.enum';
import { ButtonIndexes } from '../../models/mobile-monitor-execution-model';
import { IMobilePreviewButtonData, IMobilePreviewTicketItemData, IMobilePreviewTicketPageData } from '../../models/mobile-preview-data.interface';
@Component({
  selector: 'lavi-preview-execution-ticket-page',
  templateUrl: './preview-execution-ticket-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionTicketPageComponent extends AbstractComponent {
  @Input() Data: IMobilePreviewTicketPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Output() NextButtonClick: EventEmitter<void> = new EventEmitter();
  @Output() OnButtonClicked: EventEmitter<IMobilePreviewButtonData>;
  Indexes = ButtonIndexes;
  ItemType = TicketItem;

  public newData: any;
  constructor(private changes: ChangeDetectorRef) {
    super();
    this.OnButtonClicked = new EventEmitter<IMobilePreviewButtonData>();
  }
  async ngOnChanges(changes: SimpleChanges) {
    if(!changes.Data.firstChange){
      this.newData = changes.Data.currentValue;
    }
  }

  ButtonClicked(button: IMobilePreviewButtonData) {
    this.OnButtonClicked.emit(button);
  }

  IsSingleLabelOnly(item: IMobilePreviewTicketItemData): boolean {
    return item?.index == this.Indexes.CalledMessage || item?.index == this.Indexes.CalledByDynamicMessageIndex;
  }

  GetDecreasedFontSize(size: number): string {
    if (size && size > 0) {
      return parseInt((size * 0.60).toString()) + 'px';
    }
    return 'px';
  }
  ngOnInit(): void {
    this.changes.detach();
    setInterval(() => {
      this.changes.detectChanges();
    }, 2000)
    this.newData = this.Data;
  }
}
