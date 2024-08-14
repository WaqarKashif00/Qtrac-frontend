import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISnapshotStateResponse } from '../snapshot.interface';
import { SnapshotListService } from './snapshot-list.service';


@Component({
  selector: 'snapshot-list',
  templateUrl: './snapshot-list.component.html',
  styleUrls: ['./../snapshot.component.scss'],
  providers:[SnapshotListService]
})
export class SnapshotListComponent extends AbstractComponent {

  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() IsLoadingPage: boolean;
  @Output() Cancel : EventEmitter<void> = new EventEmitter()
  IsEditing$: Observable<boolean>

  constructor(private service : SnapshotListService) {
    super();
  }
  
  OnCancel(){
    this.Cancel.emit()
  }

}
