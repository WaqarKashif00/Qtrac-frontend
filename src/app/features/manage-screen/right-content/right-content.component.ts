import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISideBarItems } from '../../auth/side-bar-item.interface';

@Component({
  selector: 'lavi-right-content',
  templateUrl: './right-content.component.html',
  styleUrls: [
    './right-content.component.scss',
    './../manage-screen.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightContentComponent extends AbstractComponent {
  @Input() ManageSideBarItems: ISideBarItems[];

  @Output() OnChildItemClicked: EventEmitter<string> =
    new EventEmitter<string>();

  constructor() {
    super();
  }
  OnChildItemClick(path: string) {
    this.OnChildItemClicked.emit(path);
  }
}
