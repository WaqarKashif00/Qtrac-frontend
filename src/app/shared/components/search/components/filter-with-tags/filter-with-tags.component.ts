import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FilterModelWithTags } from '../../models/filter-model-with-tags';

@Component({
  selector: 'lavi-filter-with-tags',
  templateUrl: './filter-with-tags.component.html',
  styleUrls: ['./filter-with-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterWithTagsComponent extends AbstractComponent {

  @Input() public filter: FilterModelWithTags = new FilterModelWithTags();
  @Input('debounce-time') public timeInterval = 10;
  @Input() public searchTextTitle = 'Search';
  @Input() public isExpanded = false;
  @Input('tagList') public tagList = [];

  @Output() public filterChange = new EventEmitter<FilterModelWithTags>();
  @Output() public isExpandedChange = new EventEmitter<boolean>();

  private changed = new Subject<FilterModelWithTags>();

  protected onFilterModelChanged() {
    this.changed.next(this.filter);
  }

  constructor() {
    super();
   }

  Init(): void {
    this.subs.sink = this.changed.pipe(
      debounceTime(this.timeInterval)
      ).subscribe((e: FilterModelWithTags) => {
          this.filterChange.emit(e);
        }
      );
  }

  Destroy(): void {
    this.changed.complete();
  }

  public onTextFilterChanged() {
    this.onFilterModelChanged();
  }

  expand() {
    this.isExpanded = true;
    this.onExpandedChanged();
  }

  collapse() {
    this.isExpanded = false;
    this.onExpandedChanged();
  }

  onExpandedChanged() {
    this.isExpandedChange.emit(this.isExpanded);
  }

  public resetFilter() {
    this.filter.resetFilter();
    this.onFilterModelChanged();
  }

  public deselectTag(tag: string) {
    if (this.filter.deSelectTag(tag)) {
      this.onFilterModelChanged();
    }
  }

  public selectTag(tag: string) {
    if (this.filter.selectTag(tag)) {
      this.onFilterModelChanged();
    }
  }
}
