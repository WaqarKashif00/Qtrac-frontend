import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noOfDigitToTicketNumberingFormat'
})

export class NoOfDigitToTicketNumberingFormatPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if (typeof value !== 'number') {
      return '{}';
    }
    return this.GetFormat(value.toString().length);
  }

  private GetFormat(length: number) {
    let format = '0';
    while (1 < length) {
      format = '0' + format; length--;
    }
    return '{' + format + '}';
  }
}
