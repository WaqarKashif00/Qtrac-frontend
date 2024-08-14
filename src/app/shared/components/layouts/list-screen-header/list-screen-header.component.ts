import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';

@Component({
  selector: 'lavi-list-screen-header',
  templateUrl: './list-screen-header.component.html',
  styleUrls: ['./list-screen-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ListScreenHeaderComponent extends AbstractComponent {
  @Input() Title: string;
  @Input() ActionName: string;
  @Input() PageName: string;
  @Input() ButtonValue: string = 'abc';

  @Output() OnAddNewButtonClick: EventEmitter<void> = new EventEmitter<void>();
  constructor() {
    super();
  }

  RedirectToAddNewPage() {
    this.OnAddNewButtonClick.emit();
  }
}
