import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../../constants/type-constant';
import { ISnapshotStateResponse } from '../../snapshot.interface';
import { SnapshotService } from '../../snapshot.service';

@Component({
  selector: 'lavi-left-footer',
  templateUrl: './left-footer.component.html',
  styleUrls: ['./left-footer.component.scss']
})
export class LeftFooterComponent extends AbstractComponent {

  @Input() SnapshotState: ISnapshotStateResponse;
  IsShowEditConditions:boolean=false;
  IsEditing$: Observable<boolean>;
  SnapshotList$ : Observable<ISnapshotStateResponse[]>

  constructor(private service:SnapshotService) {
    super();
  }

  Init(){
    this.IsEditing$ = this.service.IsEditing$ 
    this.SnapshotList$ = this.service.SnapshotList$ 
  }

  ngOnChanges(changes){
    this.IsShowEditConditions = (changes?.SnapshotState?.currentValue as ISnapshotStateResponse)?.selections.some(x=>(x.type == SnapshotTypeConstants.company) || (x.type == SnapshotTypeConstants.branch) || (x.type == SnapshotTypeConstants.tag) || (x.type == SnapshotTypeConstants.location) || (x.type == SnapshotTypeConstants.timeperiod) || (x.type == SnapshotTypeConstants.dataview));
  }

  ShowSaveDraftScreen(){
    this.service.ShowSaveDraftScreenSubject.next(true);
    this.service.IsLoadingPageSubject.next(false)
  }

  ShowSnapshotLoadScreen(){
    this.service.ShowSaveDraftScreenSubject.next(true);
    this.service.IsLoadingPageSubject.next(true)
  }
}
