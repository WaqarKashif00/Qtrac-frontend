import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserAPIService } from 'src/app/shared/api-services/user-api.service';
import { LOCATION } from '../../../core/tokens/location.token';

@Injectable()
export class LandingPageService extends AbstractComponentService {

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly tokenService: TokenService,
    private readonly userAPIService: UserAPIService,
    @Inject(LOCATION) private readonly location: Location
  ) {
    super();
  }

  async HandleQueryParams(params: Params): Promise<void> {
    const errorDescription = params['error_description'];
    const passwordResetRequired = errorDescription && errorDescription.indexOf('AADB2C90118') > -1;
    if (passwordResetRequired) {
      await this.handleForgotPasswordFunctionality();
    } else {
      await this.ValidateParamsAndGetToken(params);
    }
  }

  private async handleForgotPasswordFunctionality() {
    this.location.href = await this.authenticationService.getPasswordResetUrl();
  }

  private async ValidateParamsAndGetToken(params: Params) {
    const { code, state } = params;
    const isNotAllParameterAvailableToGetAdToken = !code || !state;
    if (this.tokenService.IsAccessTokenExpired() && isNotAllParameterAvailableToGetAdToken) {
      this.tokenService.Logout(false);
      return;
    }
    if (isNotAllParameterAvailableToGetAdToken) {
      return;
    }
    await this.GetTokenAndUpdateAuthState(code, state);
  }

  private async GetTokenAndUpdateAuthState(code: string, state: string) {
    try {
      this.loadingService.showLoading();
      const tokenResponse = await this.authenticationService.getToken(code, state);
      this.loadingService.hideLoading();
      this.tokenService.PersistAuthTokenAndUpdateStateVariables(tokenResponse);
      this.routeHandlerService.RedirectToHome();
    } catch (e) {
      this.loadingService.hideLoading();
      this.tokenService.Logout(false);

    }
  }

}
