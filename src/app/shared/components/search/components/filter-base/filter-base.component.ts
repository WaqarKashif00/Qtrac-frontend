import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FilterModel } from '../../models/filter-model';

@Component({
  selector: 'lavi-filter-base',
  templateUrl: './filter-base.component.html',
  styleUrls: ['./filter-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBaseComponent extends AbstractComponent {

  @Input('filter') public filter: FilterModel = new FilterModel();
  @Input('debounce-time') public timeInterval = 10;
  @Input('searchTextTitle') public searchTextTitle = 'Search';

  @Output('filterChange') public filterModelChanged = new EventEmitter<FilterModel>();

  private changed = new Subject<FilterModel>();

  public onResetFilter() {
    this.filter.resetFilter();
    this.onFilterModelChanged();
  }
  protected onFilterModelChanged() {
    this.changed.next(this.filter);
  }

  public onTextFilterChanged() {
    this.onFilterModelChanged();
  }

  constructor() {
    super();
  }

  Init(): void {
      this.subs.sink = this.changed.pipe(
        debounceTime(this.timeInterval)
        ).subscribe((e) => {
            this.filterModelChanged.emit(e);
          }
        );
  }

  Destroy(): void {
    this.changed.complete();
  }

}
