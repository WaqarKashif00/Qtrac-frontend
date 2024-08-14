import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'laviEmptyString'
})
export class LaviEmptyStringIfNullOrUndefinedPipe implements PipeTransform {
    transform(value): string {

      if (value){
        return value;
      }

      return '';
    }
}
