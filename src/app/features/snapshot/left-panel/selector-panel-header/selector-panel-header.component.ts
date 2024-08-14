import { Component, EventEmitter, Input,  Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGranulesState, ISnapshotConfiguration } from '../../snapshot.interface';

@Component({
  selector: 'lavi-selector-panel-header',
  templateUrl: './selector-panel-header.component.html',
  styleUrls: ['./selector-panel-header.component.scss']
})
export class SelectorPanelHeaderComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();
  IsServiceSelected:boolean;
  constructor() {
    super();
  }

  ChangeOnSelect(isKpi:boolean){
    this.IsServiceSelected = !isKpi;
  }

  CheckBoxChecked(granule:IGranulesState){
    this.CheckboxChanged.emit(granule);
  }
}
