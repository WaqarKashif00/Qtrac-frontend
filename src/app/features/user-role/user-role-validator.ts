import { AsyncValidatorFn, FormControl } from '@angular/forms';
import { timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserRoleService } from './user-role.service';


export class UserRoleValidator {
  static RoleExistsValidator(userRoleService: UserRoleService): AsyncValidatorFn {
    return (input: FormControl) => {
      return timer(1000).pipe(
        switchMap(() => userRoleService.IsRoleNameExists(input.value)),
        map((response) => {
          return response ? { isExists: true } : null;
        })
      );
    };
  }
}
