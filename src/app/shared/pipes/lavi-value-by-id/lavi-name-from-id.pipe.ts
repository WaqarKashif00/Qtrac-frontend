import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'laviTextFromDropdown'
})
export class LaviNameFromIdPipe implements PipeTransform {
    transform(dropdown: any[], id: string, propertyId = 'value', propertyName = 'text'): string {
      const item = dropdown?.find(x => x[propertyId] === id);

      if (item){
        return item[propertyName];
      }

      return '';
    }
}
