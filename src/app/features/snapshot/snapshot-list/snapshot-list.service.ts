import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AbstractComponentService } from "src/app/base/abstract-component-service";

@Injectable()
export class SnapshotListService extends AbstractComponentService {

    IsEditingSubject: BehaviorSubject<boolean>;
    IsEditing$: Observable<boolean>

    constructor() {
        super();
        this.Init()
    }

    Init() {
        this.IsEditingSubject = new BehaviorSubject<boolean>(false);
        this.IsEditing$ = this.IsEditingSubject.asObservable();
    }

    AddEditContext() {
        this.IsEditingSubject.next(true);
    }

    CancelContext() {
        this.IsEditingSubject.next(false);
    }

    ApplyContext() {
        this.IsEditingSubject.next(false);
    }

}