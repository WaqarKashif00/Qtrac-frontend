import { FilterModel } from "./filter-model";
import { FilterModelWithTags } from "./filter-model-with-tags";

// This can be deleted now..
export class FilterFactory {
  static matchesFilter(filter: FilterModel, ...args: string[]): boolean {
    let ret = false;

    if(!filter.isFilterApplied()) {
      ret = true;
    } else {
      if(ret && filter.isTextFilterApplied()) {
        ret = false;

        for(let index = 0; index < args.length; index ++) {
          if(args[index].toLowerCase().includes(filter.FilterText.toLowerCase())) {
            ret = true;
            break;
          }
        }
      } else {
        ret = true;
      }
    }

    return ret;
  }

  static matchesFilterWithTags(filter: FilterModelWithTags, tags: string[], ...args: string[]) :boolean {
    let ret = false;

    if(!filter.isFilterApplied()) {
      ret = true;
    } else {

      if(filter.areTagsSelected()) {
        ret = false;

        for(let tindex = 0; tindex < tags.length; tindex ++) {
          if(filter.isTagSelected(tags[tindex])) {
            ret = true;
            break;
          }
        }
      } else {
        ret = true;
      }

      if(ret && filter.isTextFilterApplied()) {
        ret = false;

        for(let index = 0; index < args.length; index ++) {
          if(args[index].toLowerCase().includes(filter.FilterText.toLowerCase())) {
            ret = true;
            break;
          }
        }
      }

    }

    return ret;
  }
}
