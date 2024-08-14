import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss', './../../../scheduler-execution/scheduler-execution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent extends AbstractComponent {
  @Input() InActiveTextColor: string;
  @Input() ActiveTextColor: string;
  @Input() InActiveBackColor: string;
  @Input() ActiveBackColor: string;
  @Input() Value;
  @Input() Text: string;
  @Input() IsSelected: boolean;
  @Output() OnSelectingMile: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    super();
  }

  OnClick() {
    this.OnSelectingMile.emit(this.Value);
  }
}
