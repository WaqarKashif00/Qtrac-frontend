import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../constants/type-constant';
import { IGranulesState, ISnapshotConfiguration, ISnapshotGraphResponse, ISnapshotStateResponse } from '../snapshot.interface';
import { SnapshotContextService } from './snapshot-context.service';

@Component({
  selector: 'lavi-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./../snapshot.component.scss'],
  providers:[SnapshotContextService]
})
export class RightPanelComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() SnapshotGraph : ISnapshotGraphResponse
  @Input() Saved: boolean;
  @Output() Save : EventEmitter<void> = new EventEmitter()
  @Output() Cancel : EventEmitter<void> = new EventEmitter()
  @Output() AddEdit : EventEmitter<void> = new EventEmitter()
  @Output() GranuleSelected : EventEmitter<IGranulesState> = new EventEmitter()
  @Output() ClearGranule: EventEmitter<{granuleType:string,IsConfigUpdate?:boolean}> = new EventEmitter();
  IsEditing$: Observable<boolean>

  constructor(private service : SnapshotContextService) {
    super();
  }

  Init(): void {
    this.SetObservables()
  }


  ngOnChanges(changes) {
    if(changes?.Saved?.currentValue){
      this.service.ApplyContext()
    }
  }


  SetObservables() {
    this.IsEditing$ = this.service.IsEditing$
  }

  ApplyContext(){
    this.Save.emit()
  }

  CancelContext(){
    this.service.CancelContext();
    this.Cancel.emit()
  }

  AddEditContext(){
    this.service.AddEditContext();
    this.AddEdit.emit()
  }

  SelectionChanged(granule: IGranulesState){
    this.GranuleSelected.emit(granule);
  }

  ClearData(granuleType:{granuleType:string,IsConfigUpdate?:boolean}){
    this.ClearGranule.emit(granuleType);
  }

  Clear(){
    this.ClearGranule.emit({granuleType: SnapshotTypeConstants.scope});
    this.ClearGranule.emit({granuleType: SnapshotTypeConstants.branch});
    this.ClearGranule.emit({granuleType: SnapshotTypeConstants.company});
    this.ClearGranule.emit({granuleType: SnapshotTypeConstants.timeperiod});
    this.ClearGranule.emit({granuleType: SnapshotTypeConstants.tag});
    this.ClearGranule.emit({granuleType:SnapshotTypeConstants.dataview});
    this.ClearGranule.emit({granuleType:SnapshotTypeConstants.location});
    this.Save.emit();
  }
}
