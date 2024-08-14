import { HttpUrlEncodingCodec } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { of, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { FormService } from '../../core/services/form.service';
import { ILaviAddress } from '../api-models/google-models/lavi-address.interface';

export function ConfirmedValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function requiredFileType(
  FileType: string[],
  maxFileSize: number = 4190000
) {
  return (control: FormControl) => {
    const CurrentFile = control.value;
    if (CurrentFile) {
      const CurrentFileType =
        CurrentFile.name !== undefined &&
        CurrentFile.name !== '' &&
        CurrentFile.name !== null
          ? CurrentFile.name.split('.')[1].toLowerCase()
          : '';
      if (CurrentFileType !== '') {
        if (!FileType.includes(CurrentFileType)) {
          return { requiredFileType: true };
        } else if (CurrentFile.size > maxFileSize) {
          return { requiredFileSize: true };
        }
      }
    }
    return null;
  };
}

export function AddressValidate() {
  return (control: FormControl) => {
    let laviAddress: ILaviAddress = control.value;

    if (!laviAddress) {
      return { required: false };
    }

    let addressAsText = control.parent.get('address').value;

    if (!addressAsText) {
      return { required: true };
    }

    if (laviAddress.formattedAddress != addressAsText) {
      return { mismatched: true };
    }
    return null;
  };
}

export function requiredIfValidator(predicate: any) {
  return (formControl: FormControl) => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate(formControl)) {
      return Validators.required(formControl);
    }
    return null;
  };
}

export function CustomRequiredDropDownValidator(
  propertyName: string = 'value'
) {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (!control.value) {
      return { required: true };
    }

    if (control.value[propertyName] === null) {
      return { required: true };
    }
    return null;
  };
}

export function CustomRequiredDropDownIf(
  ifControl,
  toControl,
  propertyNameIfDropdown: string = 'value'
) {
  return (formGroup: FormGroup) => {
    const isChecked = formGroup.get(ifControl).value;
    const validationOnControl = formGroup.get(toControl);
    if (!isChecked) {
      validationOnControl.setErrors(null);
      formGroup.markAsDirty();

      return;

    }

    if (!(validationOnControl && validationOnControl.value)) {
      validationOnControl.setErrors({ required: true });
      formGroup.markAsDirty();
      return;
    }

    if (
      validationOnControl.value[propertyNameIfDropdown] == null ||
      validationOnControl.value[propertyNameIfDropdown] == '' ||
      validationOnControl.value[propertyNameIfDropdown] == 'null'
    ) {
      validationOnControl.setErrors({ required: true });
      formGroup.markAsDirty();

      return;

    }

    validationOnControl.setErrors(null);
    formGroup.markAsDirty();
    
  };
}

export function checkDateValidation(
  control: FormGroup
): ValidationErrors | null {
  try {
    const startingDateField = control.get('fromDate').value;

    const endingDateField = control.get('toDate').value;

    if (startingDateField > endingDateField && endingDateField) {
      return {
        invalidDate: true,
      };
    } else {
      return {};
    }
  } catch (err) {}
}

export function RecordAlreadyExistValidator(
  service: FormService,
  prefixApiURL: string = '',
  editValue: string = '',
  dueTime: number = 1000
): AsyncValidatorFn {
  return (input: FormControl) => {
    const controlValue = input.value as string;
    const asyncValidationNotRequired =
      (controlValue === null && controlValue === '') ||
      controlValue.trim() === editValue;
    if (asyncValidationNotRequired) {
      return of(null);
    }

    return timer(dueTime)
      .pipe(
        switchMap(() =>
          service.GetAPICall(
            prefixApiURL +
              `${new HttpUrlEncodingCodec().encodeValue(controlValue.trim())}`,
            false
          )
        ),
        map((response) => {
          return response ? { isExists: true } : null;
        })
      )
      .pipe(first());
  };
}
