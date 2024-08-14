import { Pipe, PipeTransform } from '@angular/core';
import { PropertyMapper } from 'src/app/shared/utility-functions/property-mapper';
import { FilterModelWithTags } from '../../components/search/models/filter-model-with-tags';

@Pipe({
  name: 'laviFilterListWithTags',
  pure: false
})
export class FilterWithTagsPipe implements PipeTransform {

  parse(input: string): string {
    let ret = input;

    if (ret.startsWith('\'') && ret.endsWith('\'')) {
      ret = ret.split('\'')[1];
    }
    return ret;
  }

  transform(items: any[], filterModel: FilterModelWithTags, tagProperty, ...filterArgsParms: string[]): any[] {
    const propNames = filterArgsParms;
    if (filterModel) {
      return items.filter(item => {
        let isAnyMatch = false;

        if (!filterModel.isTextFilterApplied()) {
          // No text filter applied
          isAnyMatch = true;
        } else {
          // Text filter applied
          for (let loop = 0; loop < propNames.length; loop++) {
            const prop = PropertyMapper.getPropertyFromObject(item, this.parse(propNames[loop]));
            if (prop !== null && prop !== undefined) {
              if (Array.isArray(prop)) {
                for (let aloop = 0; aloop < prop.length; aloop++) {
                  const aprop = prop[aloop];
                  if (aprop !== null && aprop !== undefined) {
                    isAnyMatch = aprop.toString().toLowerCase().indexOf(filterModel.FilterText.toLowerCase()) >= 0 ? true : isAnyMatch;
                  }
                }
              } else {
                isAnyMatch = prop.toString().toLowerCase().indexOf(filterModel.FilterText.toLowerCase()) >= 0 ? true : isAnyMatch;
              }
            }
          }
        }

        if (isAnyMatch) {
          // Tag search
          if (filterModel.areTagsSelected()) {
            let isTagMatched = false;

            let tags = null;

            const tagsProp = PropertyMapper.getPropertyFromObject(item, this.parse(tagProperty));

            if (tagsProp !== null && tagsProp !== undefined) {
              if (Array.isArray(tagsProp)) {
                tags = tagsProp.map((t) => t.value !== undefined ? t.value : t);
              }
            }

            if (tags) {
              for (const tag of tags) {
                isTagMatched = filterModel.isTagSelected(tag) ? true : isTagMatched;
              }
            }

            isAnyMatch = isTagMatched;
          }
        }

        return isAnyMatch;
      });
    }
  }
}
