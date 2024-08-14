import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../constants/type-constant';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { ISnapshotStateResponse, IGranulesSelected, IGranulesState, ISnapshotConfiguration } from '../snapshot.interface';
import { Observable } from "rxjs";
import { SnapshotContextService } from '../snapshot-context.service';
// import { KPIService } from '../../left-panel/kpi-content/kpi-content.service';
import { SnapshotService } from "../snapshot.service";
import { x } from '@progress/kendo-svg-icons';





@Component({
  selector: 'lavi-snapShotPanel',
  templateUrl: './Snapshot-header.component.html',
  styleUrls: ['./Snapshot-header.component.scss'],
  providers:[SnapshotContextService]
})
export class SnapshotHeaderComponent extends AbstractComponent {


  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() IsEditing: boolean;
  @Input() timeScopes: Array<object>;
  @Input() BranchList: Array<object>;
  @Output() AddEditContext : EventEmitter<void> = new EventEmitter();
  @Output() Cancel : EventEmitter<void> = new EventEmitter();
  @Output() Apply : EventEmitter<void> = new EventEmitter();
  @Output() Clear : EventEmitter<void> = new EventEmitter();
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();
  @Output() ClearGranule: EventEmitter<{granuleType:string,IsConfigUpdate?:boolean}> = new EventEmitter();
  TimerPeriodRadio: IGranulesSelected = this.GetDefaultRadioData();
  DataViewRadio: IGranulesSelected= this.GetDefaultRadioData();
  IsShowEditConditions:boolean=false;
  SnapshotTypeConstants = SnapshotTypeConstants


  constructor() {
    super();
    this.Configurations = {granuleTypes: [{id: "12345",
      type: "location",
      name: "LOCATIONS",
      granules: [{id:"testGran", type:"location", name:"HiThere", granules:[], isSelected:true}],
      isSelected: true}],
      kpis: [{id: "12345",
      type: "test",
      name: "test",
      granules: [],
      isSelected: true,
      selections:[ {id:"testGran", type:"location", name:"HiThere", granules:[], isSelected:true}],
      baselines: []
    }]}
    this.timeScopes =[{period: "day", isSelected:true}, {period: "week", isSelected:false}, {period: "month", isSelected:false}]
  }




  // getSelectedLocation(){
  //   const currentLocation = this.SnapshotState.selections.find(x=>(x.type == SnapshotTypeConstants.location)).name
  //   const presetLocation = {name: currentLocation, value: null}
  //   return presetLocation
  // }





  ngOnChanges(changes){
    this.IsShowEditConditions = (changes?.SnapshotState?.currentValue as ISnapshotStateResponse)?.selections.some(x=>(x.type == SnapshotTypeConstants.company) || (x.type == SnapshotTypeConstants.branch) || (x.type == SnapshotTypeConstants.tag) || (x.type == SnapshotTypeConstants.location) || (x.type == SnapshotTypeConstants.timeperiod) || (x.type == SnapshotTypeConstants.dataview));
    if(changes?.Configurations?.currentValue){
      let timePeriod = changes.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.timeperiod)?.granules?.find(x=>x.isSelected);
      this.TimerPeriodRadio =  timePeriod ? cloneObject(timePeriod) : cloneObject(this.TimerPeriodRadio)

      let dataView = changes.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.dataview)?.granules?.find(x=>x.isSelected);
      this.DataViewRadio =  timePeriod ? cloneObject(dataView) : cloneObject(this.DataViewRadio)
    }
    let workflow = changes.Configurations?.currentValue?.granuleTypes?.find(x => x.type == SnapshotTypeConstants.workflow);
    let wfGrangules = workflow[0]


  }

  CancelContext(){
    this.Cancel.emit()
  }

  ApplyContext(){
    this.Apply.emit()
  }

  AddContext(){
    this.AddEditContext.emit()
  }
  

  ClearAllContext(){
    this.Clear.emit();
  }

  CheckBoxChecked(granule : IGranulesSelected,IsSelected:boolean){
    this.CheckboxChanged.emit({
      item:granule,value:IsSelected
    });
  }

  // public valueChange(value: any) {
  //   console.log("valueChange", value);
  // }

  timeScopeChecked(timeScope,IsSelected:boolean, timeScopes){
    for(let i in timeScopes){
      timeScopes[i].isSelected = false;
    }
    const selectedTime = timeScopes.findIndex(x=> x.period == timeScope.period)
    timeScopes[selectedTime].isSelected = true;

  }


  DropDownSelected(granule : IGranulesSelected, IsSelected:boolean, AllGranule:IGranulesSelected[]){
    this.ClearData(granule.type,true);
    AllGranule.forEach(x=>x.isSelected=false);
    granule.isSelected =true
    this.CheckboxChanged.emit({
      item:granule,value:IsSelected
    });
    this.ApplyContext()
  }

  RadioChecked(granule:IGranulesSelected, IsSelected:boolean, AllGranule:IGranulesSelected[]){
    this.ClearData(granule.type,true);
    AllGranule.forEach(x=>x.isSelected=false);
    granule.isSelected =true
    // const selectedTimeIndex = this.SnapshotState.selections.findIndex(x=> x.type==granule.type)
    // this.SnapshotState.selections[selectedTimeIndex] = granule;
    this.CheckboxChanged.emit({
      item:granule,value:IsSelected
    });
    this.ApplyContext()
  }

  ClearData(granuleType : string, IsConfigUpdate?:boolean){
    this.ClearGranule.emit({granuleType,IsConfigUpdate})
  }

  GetDefaultRadioData(){
    return {
      id:null,
      name:null,
      type:null,
      granules:null,
      isSelected:null
    }
  }

  private EmitChangeToServices(parentId: string, baseline: any) {
    this.CheckboxChanged.emit({
      item: null,
      value: true,
      isInstantSave: true,
      parentId: parentId,
      baseline: baseline
    });
  }
}
