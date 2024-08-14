import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'laviPhoneNumberFormat'
})
export class LaviPhoneNumberFormatterPipe implements PipeTransform {
    transform(rawNum) {
        return rawNum.toString()
            .split('').reverse().join('')
            .replace(/(\d{4})(\d{3})(\d{3})(\d{1})/, '$1-$2-$3-$4')
            .split('').reverse().join('')
            .replace('-', ' (')
            .replace('-', ') ')
            ;
    }
}
