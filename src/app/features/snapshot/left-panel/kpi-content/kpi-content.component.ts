import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGranulesSelected, IGranulesState, ISnapshotConfiguration } from '../../snapshot.interface';
import { KPIService } from './kpi-content.service';

@Component({
  selector: 'lavi-kpi-content',
  templateUrl: './kpi-content.component.html',
  styleUrls: ['./../left-panel.component.scss', './../../snapshot.component.scss'],
  providers: [KPIService]
})
export class KpiContentComponent extends AbstractComponent {

  @Input() Configurations: ISnapshotConfiguration;
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();
  kpis = []
  DebounceApiSubject: BehaviorSubject<any>;
  IsOtherChangeActive:boolean;
  IsEditing$: Observable<boolean>;

  constructor(private service : KPIService) {
    super();
    this.IsEditing$  = service.IsEditing$;
  }

  ngOnChanges(){
    this.kpis = this.service.SetKPIList(this.Configurations?.kpis);
  }

  Init(){
    let isInitialized = false;
    this.DebounceApiSubject = new BehaviorSubject(null);
    this.DebounceApiSubject.pipe(debounce(() => interval(1000))).subscribe(
      (x) => {
          if(isInitialized && !this.IsOtherChangeActive){
              this.EmitChangeToServices(x?.parentId,x.baseline)
          }
          isInitialized = true
      }
  )
  }

  ShowBaseline(kpi:any){
    let kpiResponse = this.service.ShowHideBaseline(kpi) 
    
    if(this.Configurations?.kpis?.find(kp=>kp?.id == kpiResponse?.id)?.granules[0]?.isSelected && !this.Configurations?.kpis?.find(kp=>kp?.id == kpiResponse?.id).isSelected){
      this.CheckBoxChecked(this.Configurations?.kpis?.find(kp=>kp?.id == kpiResponse?.id)?.granules[0], true, kpiResponse?.id, false,null)
    }
    this.EmitChangeToServices(kpiResponse?.id, kpiResponse?.baseline)
  }

  SetKPIList(){
    this.service.SetKPIList(this.Configurations?.kpis)
  }
  
  CheckBoxChecked(granule: IGranulesSelected, value: boolean,parentId?:string,isParent?:boolean,aggregations?:any[]) {
    this.CheckboxChanged.emit(this.service.CheckBoxChecked(granule, value, parentId, isParent, aggregations))
  }

  BaselineChecked(baseline:any,parentId:string,baseLineStyle:any,baselines:any){
    if(baselines && baselines === true){
      this.IsOtherChangeActive=false
      this.DebounceApiSubject.next({parentId,baseline})
      return
    }
    baselines && baselines?.forEach(x=>x.isSelected=false);
    baseLineStyle.isSelected = true;
    
    this.EmitChangeToServices(parentId, baseline);

    this.IsOtherChangeActive = true;
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
