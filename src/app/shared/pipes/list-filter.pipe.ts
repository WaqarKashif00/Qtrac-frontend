import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'laviFilterListBy' })
export class ListFilterPipe implements PipeTransform {
    transform(dataArray: any[], ...filterArgsParms: string[]): any[] {
        const filterArgs = filterArgsParms[0];
        const propNames = filterArgsParms.slice(1);
        if (filterArgs) {
            return dataArray.filter(object => {
                let IsAnyMatch = false;
                for (const key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        const propValue = object[key];
                        const IsToCheck = propNames && propNames.length > 0
                            ? propNames.indexOf(key) > -1
                            : true;
                        if (IsToCheck) {
                            IsAnyMatch = propValue
                                .toString()
                                .toLowerCase()
                                .indexOf(filterArgs.toLowerCase())
                                >= 0
                                ? true
                                : IsAnyMatch;
                        }
                    }
                }
                return IsAnyMatch;
            });
        }
        return dataArray;
    }
}
