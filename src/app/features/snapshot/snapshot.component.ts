import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGranulesState, ISnapshotConfiguration, ISnapshotGraphResponse, ISnapshotStateResponse } from './snapshot.interface';
import { SnapshotService } from './snapshot.service';

@Component({
  selector: 'lavi-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.scss'],
  providers:[SnapshotService]
})
export class SnapshotComponent extends AbstractComponent {

  Configurations$: Observable<ISnapshotConfiguration>;
  SnapShotState$: Observable<ISnapshotStateResponse>;
  SnapshotGraph$: Observable<ISnapshotGraphResponse>;
  Saved$ :Observable<boolean>
  ShowSnapshotDraftScreen$: Observable<boolean>;
  IsLoadingPage$: Observable<boolean>;

  constructor(
    private service : SnapshotService
  ) {
    super();
  }

  Init(): void {
    this.setObservables();
  }

  setObservables() {
    this.Configurations$ = this.service.Configurations$;
    this.SnapShotState$ = this.service.SnapShotState$;
    this.SnapshotGraph$ = this.service.SnapshotGraph$;
    this.IsLoadingPage$ = this.service.IsLoadingPage$;
    this.ShowSnapshotDraftScreen$ = this.service.ShowSnapshotDraftScreen$
    this.Saved$ = this.service.Saved$;
    this.Saved$.subscribe(x=>{
      
    })
  }

  SaveContext(){
    this.service.SaveSnapshotState()
  }

  CancelContext(){
    this.service.CancelSnapShotState()
  }

  AddEditContext(){
    this.service.AddEditContext()
  }

  SelectionChanged(granule : IGranulesState){
    this.service.ManageSnapshotState(granule)
  }

  ClearGranule(granuleType:{granuleType:string,IsConfigUpdate?:boolean}){
    this.service.ClearFromSnapShotStateByType(granuleType)
  }

  OnCancel(){
    this.service.SetDefaultOnCloseOfListPage()
  }
}
