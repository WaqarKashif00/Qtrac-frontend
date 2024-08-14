import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { SnapshotService } from "./snapshot.service";

@Injectable()
export class SnapshotContextService extends AbstractComponentService {

    IsEditing$: Observable<boolean>

    constructor(private snapshotService : SnapshotService) {
        super();
        this.Init()
    }

    Init() {
        this.IsEditing$ = this.snapshotService.IsEditing$
    }

    AddEditContext() {
        this.snapshotService.IsEditingSubject.next(true);
    }

    CancelContext() {
        this.snapshotService.IsEditingSubject.next(false);
    }

    ApplyContext() {
        this.snapshotService.IsEditingSubject.next(false);
    }

}
