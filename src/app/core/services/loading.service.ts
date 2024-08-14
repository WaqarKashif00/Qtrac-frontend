import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractService } from 'src/app/base/abstract-service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService extends AbstractService {
  /* #region  Property Declaration */

  private IsLoadingSubject: BehaviorSubject<boolean>;
  IsLoading$: Observable<boolean>;
  /* #endregion */
  constructor() {
    super();
    this.IsLoadingSubject = new BehaviorSubject<boolean>(false);
    this.IsLoading$ = this.IsLoadingSubject.asObservable();
  }
  /* #region  Public methods */

  public showLoading(): void {
    this.IsLoadingSubject.next(true);
  }
  public hideLoading(): void {
    this.IsLoadingSubject.next(false);
  }
  /* #endregion */
}
