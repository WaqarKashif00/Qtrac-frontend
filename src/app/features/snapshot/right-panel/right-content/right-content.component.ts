import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGranulesState, ISnapshotConfiguration, ISnapshotGraphResponse, ISnapshotStateResponse } from '../../snapshot.interface';

@Component({
  selector: 'lavi-right-content',
  templateUrl: './right-content.component.html',
  styleUrls: ['./right-content.component.scss']
})
export class RightContentComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotGraph: ISnapshotGraphResponse
  @Input() IsEditing: boolean;
  @Input() SnapshotState: ISnapshotStateResponse;
  @Output() GranuleSelected: EventEmitter<IGranulesState> = new EventEmitter()
  @Output() ClearGranule: EventEmitter<{granuleType:string,IsConfigUpdate?:boolean}> = new EventEmitter();
  @Output() AddEditContext : EventEmitter<void> = new EventEmitter();
  constructor() {
    super();
  }
  
  CheckBoxChanged(granules:IGranulesState){
    this.GranuleSelected.emit(granules)
  }

  ClearData(granuleType:{granuleType:string,IsConfigUpdate?:boolean}){
    this.ClearGranule.emit(granuleType)
  }

  EditContext(){
    this.AddEditContext.emit()
  }
}
