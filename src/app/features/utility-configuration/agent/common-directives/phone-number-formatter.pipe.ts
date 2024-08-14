import { Pipe, PipeTransform } from '@angular/core';
import { GetFormatterPhoneNumber } from '../../../../core/utilities/core-utilities';
@Pipe({
    name: 'laviPhoneNumberFormat'
})
export class LaviPhoneNumberFormatterPipe implements PipeTransform {
    transform(rawNum) {
        return GetFormatterPhoneNumber(rawNum);
    }
}

