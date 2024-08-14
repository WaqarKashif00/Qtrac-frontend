import { FilterModel } from './filter-model';

export class FilterModelWithTags extends FilterModel {
  public Tags: Array<string> = [];
  public SelectedTags: Array<string> = [];

  public areTagsSelected(): boolean {
    let ret = false;

    if (this.SelectedTags.length > 0) {
      ret = true;
    }

    return ret;
  }

  public isTagSelected(tag: string): boolean {
    let ret = false;

    if (this.SelectedTags.indexOf(tag) >= 0) {
      ret = true;
    }

    return ret;
  }

  public isFilterApplied(): boolean {
    let ret = super.isFilterApplied();

    if (!ret) {
      ret = this.areTagsSelected();
    }


    return ret;
  }

  public resetFilter(): void {
    super.resetFilter();

    this.SelectedTags = [];
  }

  public deSelectTag(tag: string): boolean {
    let ret = false;

    const index = this.SelectedTags.indexOf(tag);
    if (index >= 0) {
      this.SelectedTags.splice(index, 1);
      ret = true;
    }

    return ret;
  }

  public selectTag(tag: string): boolean {
    let ret = false;

    const index = this.SelectedTags.indexOf(tag);
    if (index === -1) {
      this.SelectedTags.push(tag);
      this.SelectedTags.sort();
      ret = true;
    }

    return ret;
  }
}
