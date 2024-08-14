import { Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, interval, Observable } from "rxjs";
import { debounce } from "rxjs/operators";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { AuthStateService } from "src/app/core/services/auth-state.service";
import { cloneObject } from "src/app/core/utilities/core-utilities";
import { SnapshotApiService } from "src/app/shared/api-services/snapshot-api.service";
import { SaveSuccessfulMessage } from "./constants/snapshot-message";
import { SnapshotTypeConstants } from "./constants/type-constant";
import { IGranules, IGranulesState, IKpiGranulesSelected, ISnapshotConfiguration, ISnapshotGraphResponse, ISnapshotStateResponse } from "./snapshot.interface";

@Injectable()
export class SnapshotService extends AbstractComponentService {
    
    SnapShotForm : FormGroup;
    SelectedId: string;
    SelectedName: String;
    SelectedSnapshot: ISnapshotStateResponse;
    Configurations$: Observable<ISnapshotConfiguration>;
    ConfigurationSubject: BehaviorSubject<ISnapshotConfiguration>;
    ShowSaveDraftScreenSubject: BehaviorSubject<boolean>;
    ShowSnapshotDraftScreen$: Observable<boolean>;
    SnapShotStateSubject: BehaviorSubject<ISnapshotStateResponse>;
    IsLoadingPage$ : Observable<boolean>;
    IsLoadingPageSubject: BehaviorSubject<boolean>
    SnapShotState$: Observable<ISnapshotStateResponse>
    DebounceApiSubject: BehaviorSubject<boolean>;
    DebounceApi$: Observable<boolean>
    tempSnapshotState: IGranules[] = [];
    tempConfiguration: ISnapshotConfiguration;
    SnapshotState: IGranules[] = [];
    SavedSubject: BehaviorSubject<boolean>;
    Saved$: Observable<boolean>;
    SnapshotGraphSubject: BehaviorSubject<ISnapshotGraphResponse>;
    SnapshotGraph$: Observable<ISnapshotGraphResponse>;
    IsEditingSubject: BehaviorSubject<boolean>;
    IsEditing$: Observable<boolean>
    get SnapshotList$(){
        return this.apiService.GetSnapShotList<ISnapshotStateResponse[]>(this.authService.CompanyId)
    }
    get CompanyId() { return this.authStateService.CompanyId; }

    constructor(
        private authStateService: AuthStateService,
        private apiService: SnapshotApiService
    ) {
        super();
        this.Init()
    }

    Init() {
        this.SnapShotForm = this.formBuilder.group({
            name : [null,Validators.required]
        })
        this.InitializeObservable()
        this.GetSnapshotState(this.CompanyId);
        this.GetSnapshotConfiguration(this.CompanyId);
    }

    AddEditContext() {
        this.SavedSubject.next(false);
        this.tempSnapshotState = this.SnapshotState ? cloneObject(this.SnapshotState) : null;
        this.tempConfiguration = this.ConfigurationSubject?.value ? cloneObject(this.ConfigurationSubject?.value) : null;
        if(this.ConfigurationSubject.value){
            let DefaultDataView = this.ConfigurationSubject.value.granuleTypes.find(x=>x.type == SnapshotTypeConstants.dataview)?.granules?.find(x=>x.isSelected);
            let DefaultTimPeriod = this.ConfigurationSubject.value.granuleTypes.find(x=>x.type == SnapshotTypeConstants.timeperiod)?.granules?.find(x=>x.isSelected);
            if(DefaultDataView && DefaultTimPeriod){
                return
            }
            if(!DefaultDataView){
                let index = this.ConfigurationSubject.value.granuleTypes.findIndex(x=>x.type == SnapshotTypeConstants.dataview);
                this.ConfigurationSubject.value.granuleTypes[index].granules[0].isSelected = true;
                this.SnapshotState.push(this.ConfigurationSubject.value.granuleTypes[index].granules[0])
            }
            if(!DefaultTimPeriod){
                let index = this.ConfigurationSubject.value.granuleTypes.findIndex(x=>x.type == SnapshotTypeConstants.timeperiod);
                this.ConfigurationSubject.value.granuleTypes[index].granules[0].isSelected = true;
                this.SnapshotState.push(this.ConfigurationSubject.value.granuleTypes[index].granules[0])
            }
            this.ConfigurationSubject.next(cloneObject(this.ConfigurationSubject.value));
            this.SnapShotStateSubject.value.selections = this.SnapshotState
            this.SnapShotStateSubject.next(cloneObject(this.SnapShotStateSubject.value));
        }
    }

    CancelSnapShotState() {
        this.SavedSubject.next(false);
        this.SnapShotStateSubject.value.selections = this.SnapshotState = cloneObject(this.tempSnapshotState);
        this.SnapShotStateSubject.next(cloneObject(this.SnapShotStateSubject.value));
        this.ConfigurationSubject.next(cloneObject(this.tempConfiguration));
    }

    SaveSnapshotState(hideLoader?: boolean, LoadData?:ISnapshotStateResponse) {
        let request = this.CreateRequestObject();
        if(LoadData){
            request.selections = LoadData.selections;
        }
        this.subs.sink = this.apiService.SaveSnapShotState(request, hideLoader).subscribe((x: ISnapshotStateResponse) => {
            if(LoadData){
                this.OnListPageClose()
            }else{
                this.tempConfiguration = this.ConfigurationSubject?.value;
                this.tempSnapshotState = this.SnapshotState;
                if (!hideLoader) {
                    this.SavedSubject.next(true);
                }
                this.AppNotificationService.Notify(SaveSuccessfulMessage, hideLoader ? 3000 : 5000);
                this.SnapShotStateSubject.value.id = x.id,
                this.SnapShotStateSubject.value.name = x.name
                this.SnapShotStateSubject.next(cloneObject(this.SnapShotStateSubject.value));
                if (x?.companyId) {
                    this.subs.sink = this.apiService.GetGraphData(x).subscribe((graphResponse: ISnapshotGraphResponse) => {
                        this.SnapshotGraphSubject.next(cloneObject(graphResponse));
                    })
                }
            }
            
        });
    }

    ManageSnapshotState(granule: IGranulesState) {
        if (granule?.value) {
            this.AddInSnapshotState(granule);
            return
        }
        this.RemoveFromSnapshotState(granule);
    }

    ClearFromSnapShotStateByType(granuleType: {granuleType:string,IsConfigUpdate?:boolean}) {
        let length = this.SnapshotState.length
        for (let i = 0; i < length; i++) {
            let index = this.SnapshotState.findIndex(snap => snap.type == granuleType.granuleType);
            if (index >= 0) {
                this.SnapshotState.splice(index, 1);
            }
        }
        if(!granuleType.IsConfigUpdate){
            this.UpdateConfigByType(granuleType.granuleType);
        }
    }

    SetSelectedLoadData(snapshot: ISnapshotStateResponse) {
        this.SelectedSnapshot = snapshot;
    }

    SaveSnapshotDraft() {
        this.formService.ValidateAllFormFields(this.SnapShotForm)
        if(!this.SnapShotForm.valid){
            return
        }
        this.SaveSnapshotDraftInDB();

    }
    
    SetDefaultOnCloseOfListPage() {
        this.ShowSaveDraftScreenSubject.next(false);
        this.IsLoadingPageSubject.next(false);
        this.SelectedId = null;
        this.SelectedName = null;
        this.SelectedSnapshot = null;
    }
    
    private InitializeObservable() {
        let isInitialized = false;
        this.ConfigurationSubject = new BehaviorSubject<ISnapshotConfiguration>({ granuleTypes: [], kpis: [] });
        this.Configurations$ = this.ConfigurationSubject.asObservable();

        this.SnapShotStateSubject = new BehaviorSubject<ISnapshotStateResponse>(null);
        this.SnapShotState$ = this.SnapShotStateSubject.asObservable();

        this.ShowSaveDraftScreenSubject = new BehaviorSubject<boolean>(false);
        this.ShowSnapshotDraftScreen$ = this.ShowSaveDraftScreenSubject.asObservable();

        this.IsLoadingPageSubject = new BehaviorSubject<boolean>(false);
        this.IsLoadingPage$ = this.IsLoadingPageSubject.asObservable();

        this.SavedSubject = new BehaviorSubject<boolean>(null);
        this.Saved$ = this.SavedSubject.asObservable();

        this.DebounceApiSubject = new BehaviorSubject<boolean>(false);
        this.DebounceApi$ = this.DebounceApiSubject.asObservable();

        this.IsEditingSubject = new BehaviorSubject<boolean>(false);
        this.IsEditing$ = this.IsEditingSubject.asObservable();

        this.DebounceApiSubject.pipe(debounce(() => interval(2000))).subscribe(
            () => {
                if (isInitialized) {
                    this.SaveSnapshotState(true);
                }
                isInitialized = true
            }
        )

        this.SnapshotGraphSubject = new BehaviorSubject<ISnapshotGraphResponse>(null);
        this.SnapshotGraph$ = this.SnapshotGraphSubject.asObservable();
    }

    private CreateRequestObject() {
        let request = {
            companyId: this.CompanyId,
            name: "Demo Snapshot state",
            selections: this.SnapshotState
        };
        if (this.SnapShotStateSubject.value.id) {
            request = this.SnapShotStateSubject.value;
        }
        return request;
    }

    private GetSnapshotConfiguration(CompanyId: string) {
        this.apiService.GetConfiGuration<ISnapshotConfiguration>(CompanyId).subscribe(configurationResponse => {
            this.ConfigurationSubject.next(configurationResponse);
        })
    }

    private GetSnapshotState(CompanyId: string) {
        this.apiService.GetSnapshotState<ISnapshotStateResponse>(CompanyId).subscribe(x => {
            this.SnapShotStateSubject.next(x ? x : { companyId: this.CompanyId, id: null, name: null, pk: null, selections: [], type: null });
            this.SnapshotState = x?.selections ? x?.selections : [];
            if (x?.companyId) {
                this.subs.sink = this.apiService.GetGraphData(x).subscribe((graphResponse: ISnapshotGraphResponse) => {
                    this.SnapshotGraphSubject.next(cloneObject(graphResponse));
                })
            }
        })
    }

    private RemoveFromSnapshotState(granule: IGranulesState) {
        let index = this.SnapshotState?.findIndex(gr => gr.id == granule?.item?.id);
        if (index >= 0) {
            this.SnapshotState.splice(index, 1);
        }
        if (granule.parentId) {
            this.RemoveFromSnapshotChild(granule);
            this.UpdateSnapShotObservable();
            this.SaveSnapshotDebounceApi(granule)
            return
        }

        this.SaveSnapshotDebounceApi(granule)
        this.UpdateSnapShotObservable();
    }

    private RemoveFromSnapshotChild(granule: IGranulesState) {
        let index = this.SnapshotState.findIndex(state => state.id == granule.parentId);
        if (index >= 0) {
            if (this.ArrayIsNotNullAndEmpty(this.SnapshotState[index].selections)) {
                let childIndex = this.SnapshotState[index].selections.findIndex(sel => sel.id == granule?.item?.id);
                this.SnapshotState[index].selections.splice(childIndex, 1);
            }
        }
        if (granule.isParentItself) {
            this.UpdateConfigForChild(granule.parentId, granule?.item?.type)
        }
    }

    private UpdateConfigForChild(parentId: any, type: string) {
        if (type == SnapshotTypeConstants.kpi) {
            this.UpdateKpiConfigSelectionById(this.ConfigurationSubject?.value?.kpis, parentId);
        }
        this.ConfigurationSubject.next(cloneObject(this.ConfigurationSubject?.value));
    }

    private UpdateKpiConfigSelectionById(granuleSelected: IKpiGranulesSelected[], parentId) {
        granuleSelected?.forEach(x => {
            if (x?.id == parentId) {
                x.isSelected = false;
                x?.granules?.forEach(g => {
                    g.isSelected = false;
                });
                x.baselines.forEach(bl => {
                    bl?.color?.forEach(c => c.isSelected = false);
                    bl?.style?.forEach(s => s.isSelected = false);
                    bl.value = 0
                })
            }
        })
    }

    private AddInSnapshotState(granule: IGranulesState) {
        let found = this.SnapshotState?.find(gr => gr.id == granule?.item?.id);
        if (!found) {
            if (granule?.parentId && !granule?.isParentItself) {
                this.AddInSnapshotAsChild(granule);
                this.UpdateSnapShotObservable();
                this.SaveSnapshotDebounceApi(granule)
                return
            }
            this.AddInSnapshot(granule);
            this.UpdateSnapShotObservable();
            this.SaveSnapshotDebounceApi(granule);
        }
    }

    private SaveSnapshotDebounceApi(granule: IGranulesState) {
        if (granule.isInstantSave) {
            this.DebounceApiSubject.next(true)
        }
    }

    private AddInSnapshot(granule: IGranulesState) {
        this.SnapshotState?.push({
            id: granule?.item?.id,
            name: granule?.item?.name,
            type: granule?.item?.type,
        });
    }

    private AddInSnapshotAsChild(granule: IGranulesState) {
        let index = this.SnapshotState?.findIndex(state => state?.id == granule?.parentId);
        if (index < 0) {
            this.AddParentIfNotInSnapshot(granule);
            this.ConfigurationSubject.next(cloneObject(this.ConfigurationSubject?.value))
            this.AddInSnapshotAsChild(granule);
        }
        if (index >= 0) {
            //for workflow
            if (!(this.SnapshotState[index].type == SnapshotTypeConstants.kpi)) {
                if (this.ArrayIsNotNullAndEmpty(this.SnapshotState[index]?.selections)) {
                    this.SnapshotState[index].selections.push(granule?.item);
                } else {
                    this.SnapshotState[index].selections = [];
                    this.SnapshotState[index]?.selections?.push({
                        id: granule?.item?.id,
                        name: granule?.item?.name,
                        type: granule?.item?.type,
                    });
                    return;
                }
            }
            //for KPI
            if (this.SnapshotState[index]?.type == SnapshotTypeConstants.kpi) {
                if (!granule.baseline) {
                    if(granule?.item?.type == SnapshotTypeConstants.aggregation){
                        this.SnapshotState[index].selections = [];
                        this.SnapshotState[index]?.selections?.push({
                            id: granule?.item?.id,
                            name: granule?.item?.name,
                            type: granule?.item?.type,
                        });
                    }

                    if(granule?.item?.type == SnapshotTypeConstants.chart){
                        let data = granule?.item as any
                        this.SnapshotState[index].chart = {
                            id: data?.id,
                            name: data?.chartType,
                            type:data?.type,
                        }
                    }
                    return;
                }

                this.SnapshotState[index].baselines = [];
                this.SnapshotState[index].baselines.push({
                    color: granule?.baseline?.color?.find(x => x.isSelected)?.name,
                    id: granule?.baseline?.id,
                    name: granule?.baseline?.name,
                    style: granule?.baseline?.style?.find(x => x.isSelected)?.type,
                    value: granule?.baseline?.value ? granule?.baseline?.value : 0
                })
            }
        }
    }

    private AddParentIfNotInSnapshot(granule: IGranulesState) {
        if (granule?.item?.type == SnapshotTypeConstants.kpi || granule?.item?.type == SnapshotTypeConstants.aggregation || granule?.baseline || granule?.item?.type == SnapshotTypeConstants.chart) {
            let parentIndex = this.ConfigurationSubject?.value?.kpis?.findIndex(x => x.id == granule.parentId);
            this.SnapshotState.push({
                id: this.ConfigurationSubject?.value?.kpis[parentIndex]?.id,
                name: this.ConfigurationSubject?.value?.kpis[parentIndex]?.name,
                type: this.ConfigurationSubject?.value?.kpis[parentIndex]?.type
            });
            this.ConfigurationSubject.value.kpis[parentIndex].isSelected = true;
        } else {
            this.ConfigurationSubject?.value?.granuleTypes
                ?.forEach(conf => {
                    if (conf?.type == SnapshotTypeConstants.workflow) {
                        conf?.granules && conf?.granules?.forEach(wf => {
                            if (wf.id == granule.parentId) {
                                wf.isSelected = true
                                this.SnapshotState.push({
                                    id: wf?.id,
                                    name: wf?.name,
                                    type: wf?.type
                                });
                            }
                        })
                    }
                })

        }
    }

    private UpdateConfigByType(granuleType: string) {
        this.ConfigurationSubject?.value?.granuleTypes?.forEach(x => {
            if (x?.type == granuleType) {
                x?.granules?.forEach(gr => {
                    gr.isSelected = false;
                });
            }
        });
        this.ConfigurationSubject.next(cloneObject(this.ConfigurationSubject?.value));
        this.UpdateSnapShotObservable();
    }

    private UpdateSnapShotObservable() {
        this.SnapShotStateSubject.value.selections = this.SnapshotState;
        let data = this.SnapShotStateSubject?.value;
        this.SnapShotStateSubject?.next(cloneObject(data));
    }

    private ArrayIsNotNullAndEmpty(array: Array<any>) {
        return array && array[0]
    }

    private SaveSnapshotDraftInDB() {
        let requestData = this.CreateRequestObjectForDraft()
        this.apiService.SaveSnapshotDraft(requestData,this.SelectedId).subscribe(x=>{
            this.OnListPageClose();
        })
    }

    private OnListPageClose() {
        this.SetDefaultOnCloseOfListPage();
        this.GetSnapshotState(this.CompanyId);
        this.GetSnapshotConfiguration(this.CompanyId);
    }

    private CreateRequestObjectForDraft() {
        let request = {
            companyId: this.CompanyId,
            selections: this.SnapshotState,
            id: this.SelectedId,
        };
        if (this.SnapShotStateSubject.value.id) {
            request.selections = this.SnapShotStateSubject.value?.selections;
            request.id = this.SelectedId
        }
        request['isSelected'] = undefined;
        request['name'] =  this.SelectedId ? this.SelectedSnapshot.name : this.SelectedName;
        return request;
    }
}
