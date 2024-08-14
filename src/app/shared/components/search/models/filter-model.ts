import { IFilterable } from './filterable.interface';

export class FilterModel implements IFilterable {
  public FilterText = '';
  public AdvancedFilter: IFilterable | undefined;

  public isTextFilterApplied(): boolean {
    let ret = false;

    if (this.FilterText !== undefined && this.FilterText.trim().length > 0) {
      ret = true;
    }

    return ret;
  }

  public hasAdvancedFilter(): boolean {
    return this.AdvancedFilter !== undefined;
  }

  public isFilterApplied(): boolean {
    let ret = this.isTextFilterApplied();

    if (!ret && this.AdvancedFilter !== undefined) {
      ret = this.AdvancedFilter.isFilterApplied();
    }

    return ret;
  }

  public resetFilter(): void {
    this.FilterText = '';

    if (this.AdvancedFilter !== undefined) {
      this.AdvancedFilter.resetFilter();
    }
  }
}
