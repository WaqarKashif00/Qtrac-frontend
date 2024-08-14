import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../../constants/type-constant';
import { ISnapshotStateResponse } from '../../snapshot.interface';
import { SnapshotService } from '../../snapshot.service';

@Component({
  selector: 'snapshot-list-header',
  templateUrl: './snapshot-list-header.component.html',
  styleUrls: ['./snapshot-list-header.component.scss','./../../snapshot.component.scss'],
})
export class SnapshotListHeaderComponent extends AbstractComponent {

  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() IsLoadingPage: boolean;
  @Output() Cancel : EventEmitter<void> = new EventEmitter();
  IsShowEditConditions:boolean=false;
  
  get isExisting(){
    return this.snapshotService.SelectedId;
  }

  constructor(private snapshotService : SnapshotService){
    super();
  }


  ngOnChanges(changes){
    this.IsShowEditConditions = (changes?.SnapshotState?.currentValue as ISnapshotStateResponse)?.selections.some(x=>(x.type == SnapshotTypeConstants.company) || (x.type == SnapshotTypeConstants.branch) || (x.type == SnapshotTypeConstants.tag) || (x.type == SnapshotTypeConstants.timeperiod) || (x.type == SnapshotTypeConstants.dataview));
  }

  SaveSnapshot(){
      this.snapshotService.SaveSnapshotDraft();
  }

  LoadSnapShot(){
    this.snapshotService.SaveSnapshotState(false,this.snapshotService.SelectedSnapshot);
  }

  OnCancel(){
    this.Cancel.emit();
  }
}
