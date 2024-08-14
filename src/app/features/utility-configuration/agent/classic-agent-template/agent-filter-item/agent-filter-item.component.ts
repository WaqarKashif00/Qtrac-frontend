import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-agent-filter-item',
  templateUrl: './agent-filter-item.component.html',
  styleUrls: ['./agent-filter-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentFilterItemComponent extends AbstractComponent {

  @Input() FilterName: string;
  @Input() Count: string;

  @Output() OnChecked: EventEmitter<boolean>;
  @Output() OnCall: EventEmitter<void>;

  @Input() IsSelected: boolean;

  get CanCall(): boolean {
    return (this.Count && Number(this.Count) > 0);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
    this.Initialize();
  }
  Initialize() {
    this.OnChecked = new EventEmitter<boolean>();
    this.OnCall = new EventEmitter<void>();
  }

  Checked(): void {
    this.OnChecked.emit(!this.IsSelected);
  }

  CallNext(): void {
    this.OnCall.emit();
  }

}
