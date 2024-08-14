import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HeaderControl } from 'src/app/features/utility-configuration/mobile/models/controls/header.control';

@Component({
  selector: 'lavi-header-designer-screen',
  templateUrl: 'header-designer-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDesignerScreenComponent extends AbstractComponent {
  @Input() HeaderControl$: Observable<HeaderControl>;

  @Output() OnHeaderClick: EventEmitter<void> = new EventEmitter();

  OnClick(){
    this.OnHeaderClick.emit();
  }
}
