import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})

export class ExtractInitialsPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (!value) {
      return value;
    }

    return value.charAt(0).toUpperCase();
  }


}
