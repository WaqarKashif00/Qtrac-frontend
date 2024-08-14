import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGranulesState, ISnapshotConfiguration, ISnapshotStateResponse } from '../snapshot.interface';

@Component({
  selector: 'lavi-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotState: ISnapshotStateResponse;
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();

  constructor() {
    super();
  }

  CheckBoxChecked(granule:IGranulesState){
    this.CheckboxChanged.emit(granule);
  }
}
