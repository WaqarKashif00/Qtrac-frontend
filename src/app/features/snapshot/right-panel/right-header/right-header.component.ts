import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { SnapshotTypeConstants } from '../../constants/type-constant';
import { SnapshotContextService } from '../snapshot-context.service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { ISnapshotStateResponse, IGranulesSelected, IGranulesState, ISnapshotConfiguration } from '../../snapshot.interface';
import { Observable } from "rxjs";
import { KPIService } from '../../left-panel/kpi-content/kpi-content.service';
import { SnapshotService } from "../../snapshot.service";





@Component({
  selector: 'lavi-right-header',
  templateUrl: './right-header.component.html',
  styleUrls: ['./right-header.component.scss'],
  // providers:[SnapshotContextService, KPIService]
})
export class RightHeaderComponent extends AbstractComponent {


  @Input() Configurations: ISnapshotConfiguration;
  @Input() SnapshotState: ISnapshotStateResponse;
  @Input() IsEditing: boolean;
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
  }

  getSelectedLocation(){
    const currentLocation = this.SnapshotState.selections.find(x=>(x.type == SnapshotTypeConstants.location)).name
    const presetLocation = {name: currentLocation, value: null}
    return presetLocation
  }



  ngOnChanges(changes){
    this.IsShowEditConditions = (changes?.SnapshotState?.currentValue as ISnapshotStateResponse)?.selections.some(x=>(x.type == SnapshotTypeConstants.company) || (x.type == SnapshotTypeConstants.branch) || (x.type == SnapshotTypeConstants.tag) || (x.type == SnapshotTypeConstants.location) || (x.type == SnapshotTypeConstants.timeperiod) || (x.type == SnapshotTypeConstants.dataview));
    if(changes?.Configurations?.currentValue){
      let timePeriod = changes.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.timeperiod)?.granules?.find(x=>x.isSelected);
      this.TimerPeriodRadio =  timePeriod ? cloneObject(timePeriod) : cloneObject(this.TimerPeriodRadio)

      let dataView = changes.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.dataview)?.granules?.find(x=>x.isSelected);
      this.DataViewRadio =  timePeriod ? cloneObject(dataView) : cloneObject(this.DataViewRadio)
    }

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
