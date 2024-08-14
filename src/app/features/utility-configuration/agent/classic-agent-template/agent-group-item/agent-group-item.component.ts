import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGroupDetails } from '../../models/agent-models';

@Component({
  selector: 'lavi-agent-group-item',
  templateUrl: './agent-group-item.component.html',
  styleUrls: ['./agent-group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentGroupItemComponent extends AbstractComponent {

  @Input() Group: IGroupDetails;
  @Input() IsCheckBoxVisible:boolean;

  @Output() OnChecked: EventEmitter<boolean>;
  @Output() OnCall: EventEmitter<void>;

  @Input() IsSelected: boolean;
  constructor() {
    super();
    this.Initialize();
  }

  Initialize() {
    this.OnChecked = new EventEmitter<boolean>();
    this.OnCall = new EventEmitter<void>();
  }

  Checked(): void {
    this.IsSelected = !this.IsSelected;
    this.OnChecked.emit(this.IsSelected);
  }

}
