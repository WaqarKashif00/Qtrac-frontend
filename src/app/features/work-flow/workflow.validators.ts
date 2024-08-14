import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const MaxLengthGreaterThenMinLengthValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
  const minLengthFormControl = group.get('min');
  const maxLengthFormControl = group.get('max');

  if (!maxLengthFormControl.value || maxLengthFormControl.value === '') {
    return null;
  }
  const minLength = minLengthFormControl.value ? Number(minLengthFormControl.value) : 0;
  const maxLength = maxLengthFormControl.value ? Number(maxLengthFormControl.value) : 0;

  if (maxLength >= minLength) {
    maxLengthFormControl.setErrors(null);
    return null;
  } else {
    maxLengthFormControl.setErrors({ maxLengthShouldGreaterThenMinLength: true });
    return { maxLengthShouldGreaterThenMinLength: true };
  }
};

