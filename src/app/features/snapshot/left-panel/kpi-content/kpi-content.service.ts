import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { IGranulesSelected, IGranulesState } from "../../snapshot.interface";
import { SnapshotService } from "../../snapshot.service";

@Injectable()
export class KPIService extends AbstractComponentService{
    
    IsEditing$: Observable<boolean>;
    
    constructor(private snapshotService : SnapshotService) {
        super();
        this.IsEditing$ = snapshotService.IsEditing$;
    }

    SetKPIList(kpis: any[]) {
        return kpis ? kpis.map(kpi=>{
            if(!kpi.isSelected){
                kpi.granules[0].isSelected = true
            }
            return kpi
        }) : []
    }

    CheckBoxChecked(granule: IGranulesSelected, value: boolean,parentId?:string,isParent?:boolean,currentTypeSelected?:any[]) : IGranulesState{
        currentTypeSelected?.forEach(x=>x.isSelected = false);
        granule.isSelected = value;
        if(isParent && !granule.isSelected){
            this.ShowHideBaseline(granule,false);
        }
        if(isParent && granule.isSelected){
            granule.granules[0].isSelected=true
        }
        return {
            item: (isParent && granule.isSelected) ? granule.granules[0] : granule,
            value: value,
            isInstantSave:true,
            parentId:parentId,
            isParentItself: granule.isSelected ? false : true
        }
    }

    ShowHideBaseline(kpi:any,value:boolean=true){
        kpi.showBaseline = value
        kpi.baselines[0].color[0].isSelected = value
        kpi.baselines[0].style[0].isSelected = value
        return { id : kpi.id, baseline : kpi.baselines[0]}
    }

}