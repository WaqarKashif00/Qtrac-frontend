import { Injectable } from "@angular/core";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { SnapshotName, SnapshotTypeConstants } from "../../../constants/type-constant";
import { ISnapshotStateResponse } from "../../../snapshot.interface";
import { SnapshotService } from "../../../snapshot.service";

@Injectable()
export class SnapshotDraftListService extends AbstractComponentService {

    get SelectedName(){
        return this.snapshotService.SelectedName;
    }

    set SelectedName(value){
        this.snapshotService.SelectedName = value;
    }

    get SnapShotForm(){
        return this.snapshotService.SnapShotForm;
    }

    constructor(private snapshotService:SnapshotService) {
        super();
        this.SelectedName = this.snapshotService.SelectedName
    }

    SetSelectedLoadData(snapshot: any) {
        this.snapshotService.SetSelectedLoadData(snapshot)
    }

    SetSelection(selection: string) {
        this.snapshotService.SelectedId = selection;
    }


    GetSnapshotList() {
        return this.snapshotService.SnapshotList$
    }

    GetDataByTypeFromSnapshotState(Configurations: ISnapshotStateResponse, type: string) {
        let GranuleNameList = ""
        let resultArray = Configurations?.selections?.map(x=>{
            if(x?.type == type){
                return x;
            }
            if(type == SnapshotTypeConstants.scope){
                if(x.type == SnapshotTypeConstants.branch){
                    return x;
                }
                if(x.type == SnapshotTypeConstants.company){
                    return x;
                }
            }
        })

        resultArray?.forEach(x => {
            if(x){
                if (GranuleNameList) {
                    GranuleNameList = GranuleNameList + ", " + ((x?.type == SnapshotTypeConstants.company) ? SnapshotName.company : x?.name)
                } else {
                    GranuleNameList = (x?.type == SnapshotTypeConstants.company) ? SnapshotName.company : x?.name;
                }
            }
        })
        return GranuleNameList
    }

}
