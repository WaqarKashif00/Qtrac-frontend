import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'quoteString'
})
export class QuoteStringPipe implements PipeTransform {
    transform(inputString: string): any {
        if (inputString===null||
            inputString==="") {
            return inputString;
        }

        return '\''+inputString+'\'';
      }
}
