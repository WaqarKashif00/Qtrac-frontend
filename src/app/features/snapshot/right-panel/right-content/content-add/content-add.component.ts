import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { SnapshotTypeConstants } from '../../../constants/type-constant';
import { IGranulesSelected, IGranulesState, ISnapshotConfiguration } from '../../../snapshot.interface';

@Component({
  selector: 'lavi-content-add',
  templateUrl: './content-add.component.html',
  styleUrls: ['./content-add.component.scss', './../../../snapshot.component.scss']
})
export class ContentAddComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Input() IsEditing: boolean;
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();
  @Output() ClearGranule: EventEmitter<{granuleType:string,IsConfigUpdate?:boolean}> = new EventEmitter();
  TimerPeriodRadio: IGranulesSelected = this.GetDefaultRadioData();
  DataViewRadio: IGranulesSelected= this.GetDefaultRadioData();
  SnapshotTypeConstants = SnapshotTypeConstants
  constructor() {
    super();
  }

  ngOnChanges(data){
    if(data?.Configurations?.currentValue){
      let timePeriod = data.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.timeperiod)?.granules?.find(x=>x.isSelected);
      this.TimerPeriodRadio =  timePeriod ? cloneObject(timePeriod) : cloneObject(this.TimerPeriodRadio)

      let dataView = data.Configurations?.currentValue?.granuleTypes?.find(x=>x.type==SnapshotTypeConstants.dataview)?.granules?.find(x=>x.isSelected);
      this.DataViewRadio =  timePeriod ? cloneObject(dataView) : cloneObject(this.DataViewRadio)
    }
  }
  CheckBoxChecked(granule : IGranulesSelected,IsSelected:boolean){
    this.CheckboxChanged.emit({
      item:granule,value:IsSelected
    });
  }

  RadioChecked(granule:IGranulesSelected, IsSelected:boolean, AllGranule:IGranulesSelected[]){
    this.ClearData(granule.type,true);
    AllGranule.forEach(x=>x.isSelected=false);
    granule.isSelected =true
    this.CheckboxChanged.emit({
      item:granule,value:IsSelected
    });
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
}
