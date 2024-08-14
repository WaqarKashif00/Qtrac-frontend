import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoginMessages } from 'src/app/models/validation-message/login';
import { UserAPIService } from '../../shared/api-services/user-api.service';

@Component({
  selector: 'lavi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthenticationService]
})
export class LoginComponent extends AbstractComponent {
  LoginMessages = LoginMessages;

  constructor(
    private authenticationService: AuthenticationService,
    private readonly userApiService: UserAPIService,
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    super();
  }

  get LoginForm() {
    return this.authenticationService.LoginForm;
  }

  get EmailFormControl() {
    return this.authenticationService.LoginForm.get('email');
  }

  Init(): void {
    this.authenticationService.SetForm();
  }

  async NavigateToADAuthorizeUrl(): Promise<void> {
    this.authenticationService.SetValidator();
    if (this.LoginForm.invalid) {
      this.authenticationService.formService.ValidateAllFormFields(this.LoginForm);
      return;
    }
    const loginMailId = (this.EmailFormControl.value as string)?.toLowerCase();
    this.subs.sink = this.userApiService.LoginEmailExists({ email: loginMailId, userId: null }).subscribe(async (emailExists) => {
      if (emailExists){
        this.document.location.href = await this.authenticationService.getAuthorizeUrl(loginMailId);
      }else{
        this.EmailFormControl.setErrors({ emailExists: (!emailExists) });
        this.ref.detectChanges();
      }
    });
  }
}
