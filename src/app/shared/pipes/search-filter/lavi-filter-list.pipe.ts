import { Pipe, PipeTransform } from '@angular/core';
import { PropertyMapper } from 'src/app/shared/utility-functions/property-mapper';

@Pipe({
  name: 'laviFilterList',
  pure: false
})
export class LaviFilterListPipe implements PipeTransform {

  parse(input: string): string {
    let ret = input;

    if (ret.startsWith('\'') && ret.endsWith('\'')) {
      ret = ret.split('\'')[1];
    }
    return ret;
  }

  transform(items: any[], searchText: string, ...filterArgsParams: string[]): any[] {
    const propNames = filterArgsParams;
    const filteredArray = [];
    if (searchText && searchText.length > 0) {
       items.filter(item => {
          // Text filter applied
          for (const name of propNames) {
            const propName = name.split(' ');
            const prop = PropertyMapper.getPropertyFromObject(item, propName[0]);
            if (prop !== null && prop !== undefined) {
              if (Array.isArray(prop) && propName.length > 1) {
                if (propName.length > 1) {
                  for (const p of prop){
                    if (p && p[propName[1]]?.toLowerCase()?.includes(searchText?.toLowerCase())) {
                      this.AddItemInArray(filteredArray, item);
                    }
                  }
                }
                else {
                  if (Object.values(prop).includes(searchText.toLowerCase())) {
                    this.AddItemInArray(filteredArray, item);
                  }
                }
              } else {
                if (typeof(prop) === 'string' && prop.toLowerCase().includes(searchText.toLowerCase())) {
                  this.AddItemInArray(filteredArray, item);
                }else if (prop.length > 0 && Array.isArray(prop)){
                  // array of string
                  prop.filter((str) => {
                    if (str.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                      this.AddItemInArray(filteredArray, item);
                    }
                  });
                }
              }
            }
          }
      });
       return filteredArray;
    }
    return items;
  }

  private AddItemInArray(filteredArray: any[], item: any) {
    if (!filteredArray.some(x => x.id === item.id)) {
      filteredArray.push(item);
    }
  }
}
