import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISideBarItems } from '../../auth/side-bar-item.interface';

@Component({
  selector: 'lavi-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss', './../manage-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftNavComponent extends AbstractComponent {
  @Input() ManageSideBarItems: ISideBarItems[];

  @Output() OnParentItemClicked: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() OnChildItemClicked: EventEmitter<string> =
    new EventEmitter<string>();

  constructor() {
    super();
  }
  OnParentItemClick(parentId: string) {
    this.OnParentItemClicked.emit(parentId);
  }
  OnChildItemClick(path: string) {
    this.OnChildItemClicked.emit(path);
  }
}
