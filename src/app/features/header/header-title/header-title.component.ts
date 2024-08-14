import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-header-title',
  templateUrl: './header-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./../header.component.scss'],
})
export class HeaderTitleComponent extends AbstractComponent {
  @Input() Title: string;
  @Input() ExitPath :string

  @Output() OnExitButtonClicked:EventEmitter<void>
  constructor() {
    super();
  }

  OnExitButtonClick(){
    this.OnExitButtonClicked.emit()
  }
}
