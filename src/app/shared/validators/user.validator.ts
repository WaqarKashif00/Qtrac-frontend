import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl } from '@angular/forms';
import { of, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserAPIService } from '../api-services/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserValidatorService {

  constructor(private readonly userAPIService: UserAPIService) { }

  public EmailAlreadyExistValidator(userId: string, editValue: string = ''): AsyncValidatorFn {
    return (input: FormControl) => {

      const controlValue = input.value as string;
      const asyncValidationNotRequired = controlValue === null && controlValue === '' || controlValue === editValue;
      if (asyncValidationNotRequired) { return of(null); }

      return timer(1000).pipe(
        switchMap(() => this.userAPIService.EmailExists({ email: controlValue, userId })),
        map((response) => {
          return response ? { isExists: true } : null;
        })
      ).pipe(first());
    };
  }

}
