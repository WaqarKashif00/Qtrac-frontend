import { Injectable } from "@angular/core";
import { time } from "console";
import { Observable } from "rxjs";
import { AppConfigService } from "src/app/core/services/app-config.service";
import { FormService } from "src/app/core/services/form.service";

@Injectable({ providedIn: 'root' })
export class SnapshotApiService {

  GetSnapShotList<T>(companyId:string) {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/reporting/snapshot-states`)
  }

  constructor(
    private readonly formService: FormService,
    private readonly appConfigService: AppConfigService,
  ) { }

  get BaseAPIUrl() {
    return this.appConfigService.config.ReportingBaseApiUrl;
  }

  GetConfiGuration<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/reporting/snapshot-config`);
  }

  SaveSnapShotState<T,P>(SnapshotState:any,hideLoader:boolean):Observable<T> {
    return this.formService.PostAPICall<T,P>(`${this.BaseAPIUrl}/api/companies/${SnapshotState.companyId}/reporting/snapshot-state`, SnapshotState,!hideLoader);
  }

  GetSnapshotState<T>(companyId: string): Observable<T> {
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${companyId}/reporting/snapshot-state`);
  }

  GetGraphData<T,P>(SnapshotState: any):Observable<T>{
    return this.formService.PostAPICall<T,P>(`${this.BaseAPIUrl}/api/companies/${SnapshotState.companyId}/reporting/snapshot-generate-data`, SnapshotState);
  }

  SaveSnapshotDraft<T,P>(SnapshotStateDraft:any, isSelected : string) {
    return this.formService.PostAPICall<T,P>(`${this.BaseAPIUrl}/api/companies/${SnapshotStateDraft.companyId}/reporting/snapshot-states/draft/${isSelected ? true:false}`, SnapshotStateDraft);
  }
  GetSnapshotData<T,P>(SnapShotData: any): Observable<T>{ 
    return this.formService.PostAPICall<T,P>(`${this.BaseAPIUrl}/api/companies/${SnapShotData.branch.companyId}/reporting/snapshot/get-snapshot-for-branch`, SnapShotData);
  }
  GetLiveStatsData<T>(selectedBranch, dayObject):Observable<T>{
    return this.formService.GetAPICall<T>(`${this.BaseAPIUrl}/api/companies/${selectedBranch.companyId}/reporting/snapshot/get-live-data-for-branch/branch/${selectedBranch.branchId}?startDate=${dayObject.start}&endDate=${dayObject.end}`, selectedBranch);
  }

  GetDetailGraphData<T,P>(apiObject: any): Observable<T>{ 
    return this.formService.PostAPICall<T,P>(`${this.BaseAPIUrl}/api/companies/${apiObject.companyId}/reporting/snapshot/get-detail-graph-for-branch`, apiObject);
  }


}
