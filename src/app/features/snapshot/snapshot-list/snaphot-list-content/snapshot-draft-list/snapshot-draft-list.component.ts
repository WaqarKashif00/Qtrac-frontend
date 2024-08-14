import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotCommonConstant } from '../../../constants/snapshot-constant';
import { SnapshotValidationMessages } from '../../../constants/snapshot-validation-message';
import { SnapshotTypeConstants } from '../../../constants/type-constant';
import { ISnapshotStateResponse } from '../../../snapshot.interface';
import { SnapshotDraftListService } from './snapshot-draft-list.service';

@Component({
  selector: 'lavi-snapshot-draft-list',
  templateUrl: './snapshot-draft-list.component.html',
  styleUrls: ['./snapshot-draft-list.component.scss', './../../../snapshot.component.scss'],
  providers: [SnapshotDraftListService]
})
export class SnapshotDraftListComponent extends AbstractComponent {

  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() IsLoadingPage: boolean;
  SnapshotList$ : Observable<ISnapshotStateResponse[]>
  SnapshotNames : string[];
  Tags: string;
  Scopes: string;
  DataView: string;
  TimePeriod: string;
  Locations: string;
  ValidationMessage = SnapshotValidationMessages;
  typeConstants = SnapshotTypeConstants;
  
  get SelectedName(){
    return this.service.SelectedName;
  }

  set SelectedName(value){
    this.service.SelectedName = value;
  }
  get SnapShotForm(){
    return this.service.SnapShotForm;
  }

  constructor(private service: SnapshotDraftListService, private ref : ChangeDetectorRef) {
    super();
  }

  Init(){
    this.SnapshotList$ = this.service.GetSnapshotList();
    this.subs.sink = this.SnapshotList$.subscribe(x=>{
      this.SnapshotNames = x?.map(snap=>{
        return snap.name
      })

      this.SelectedName = this.AssignDefaultSelectedName(SnapshotCommonConstant.defaultName)
      this.ref.detectChanges();
    })
  }

  ngOnChanges(changes) {
    if (changes?.SnapshotState?.currentValue) {
      this.Tags = this.GetDataByType(changes?.SnapshotState?.currentValue, SnapshotTypeConstants.tag);
      this.Scopes = this.GetDataByType(changes?.SnapshotState?.currentValue, SnapshotTypeConstants.scope);
      this.DataView = this.GetDataByType(changes?.SnapshotState?.currentValue, SnapshotTypeConstants.dataview);
      this.TimePeriod = this.GetDataByType(changes?.SnapshotState?.currentValue, SnapshotTypeConstants.timeperiod);
      this.Locations = this.GetDataByType(changes?.SnapshotState?.currentValue,SnapshotTypeConstants.location)
    }
  }

  GetDataByType(Configurations: ISnapshotStateResponse, type: string) {
    return this.service.GetDataByTypeFromSnapshotState(Configurations, type);
  }

  SetSelection(dataItems:any[], item:any){
    if(item.isSelected){
      item.isSelected = false
      this.service.SetSelection(null)
    }else{
      dataItems.forEach(x=>x.isSelected=false)
      item.isSelected=!item.isSelected;
      this.service.SetSelection(item.id)
    }
    this.service.SetSelectedLoadData(dataItems.find(x=>x.isSelected))
  }

  private AssignDefaultSelectedName(defaultName) {
    let nameFound = this.SnapshotNames?.find(x=>x == defaultName);
    if(nameFound){
      let defaultNameSplit = defaultName.split(" ");
      var count:number = +defaultNameSplit[1]
      count++
      defaultNameSplit[1] = ""+ count;
      return this.AssignDefaultSelectedName(defaultNameSplit[0]+" "+defaultNameSplit[1]);
    }
    return defaultName
  }

}
